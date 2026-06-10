import axios from 'axios';

// Define API response types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface PresignedUrlResponse {
  success: boolean;
  url: string;
  fileKey: string;
}

export interface ConfirmUploadData {
  fileName: string;
  fileKey: string;
  contentType: string;
  fileSize: number;
  userEmail: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ConfirmUploadResponse {
  success: boolean;
  data: ConfirmUploadData;
}

// Create dedicated axios instance for backend calls
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to all API gateway calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const handleLogoutAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Response interceptor to handle token refresh on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        handleLogoutAndRedirect();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await axios.post<AuthResponse>(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data.success && response.data.accessToken && response.data.refreshToken) {
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogoutAndRedirect();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string, name: string, role?: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', { email, password, name, role });
  return response.data;
}

/**
 * Log in an existing user
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

/**
 * Fetch the authenticated user's profile
 */
export async function fetchUserProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>('/auth/profile');
  return response.data;
}

/**
 * Request an S3 pre-signed URL for upload
 */
export async function requestPresignedUrl(fileName: string, contentType: string): Promise<PresignedUrlResponse> {
  const response = await apiClient.post<PresignedUrlResponse>('/upload/presigned-url', { fileName, contentType });
  return response.data;
}

/**
 * Confirm the S3 upload with the backend
 */
export async function confirmUpload(
  fileName: string,
  fileKey: string,
  contentType: string,
  fileSize: number
): Promise<ConfirmUploadResponse> {
  const response = await apiClient.post<ConfirmUploadResponse>('/upload/confirm', {
    fileName,
    fileKey,
    contentType,
    fileSize,
  });
  return response.data;
}

/**
 * Direct PUT request to S3 bucket.
 * Note: Must use a direct Axios request without the Authorization Bearer token header,
 * as AWS S3 will reject unexpected authorization headers.
 */
export async function uploadFileToS3(url: string, file: File, contentType: string): Promise<void> {
  await axios.put(url, file, {
    headers: {
      'Content-Type': contentType,
    },
  });
}

/**
 * To fetch the user list
 */
export async function fetchUserList(): Promise<{ success: boolean; users: User[] }> {
  const response = await apiClient.get<{ success: boolean; users: User[] }>('/auth/users');
  return response.data;
}


/**
 * To globally handle errors
 */
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      handleLogoutAndRedirect();
    }
    return Promise.reject(error);
  }
);
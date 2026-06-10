import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!token && !refreshToken) {
    // If neither token is present, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (using Outlet)
  return <Outlet />;
}

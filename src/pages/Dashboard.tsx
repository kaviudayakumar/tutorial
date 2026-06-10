import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type User, fetchUserProfile, fetchUserList, registerUser } from "../services/api";
import { Loader2, User as UserIcon, Mail, Shield, Calendar, ArrowRight, Upload, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { UseList } from "../components/UseList";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState("");

  // Form state for creating a user
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setCreateError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setCreateError("Password must be at least 6 characters.");
      return;
    }
    
    setIsCreating(true);
    setCreateError("");
    setCreateSuccess("");
    
    try {
      const response = await registerUser(newEmail, newPassword, newName, newRole);
      if (response.success) {
        setCreateSuccess(`User "${newName}" successfully created!`);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("user");
        await fetchUsers();
      } else {
        setCreateError("Failed to create user.");
      }
    } catch (err: any) {
      console.error("User creation error:", err);
      const msg = err.response?.data?.message || err.message;
      setCreateError(typeof msg === 'string' ? msg : "Failed to create user. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  async function fetchUsers() {
    try {
      setUsersError("");
      const response = await fetchUserList();
      if (response?.success) {
        setUsers(response.users);
      } else {
        setUsersError("Failed to fetch user list.");
      }
    } catch (err: any) {
      console.error("Failed to fetch user list:", err);
      setUsersError("Failed to load user directory. You may not have the required permissions.");
    }
  }

  useEffect(() => {
    async function loadProfileAndData() {
      try {
        const response = await fetchUserProfile();
        if (response.success) {
          setProfile(response.user);
          if (response.user.role === 'admin') {
            await fetchUsers();
          }
        } else {
          setError("Failed to fetch user profile.");
        }
      } catch (err: any) {
        console.error("Profile load error:", err);
        setError("Unable to connect to the authentication service.");
        // If the token is invalid/expired, we might want to log out
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfileAndData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600 dark:text-violet-400" />
        <p className="mt-4 text-sm font-medium text-slate-550 dark:text-slate-400">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-950 shadow-xl p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Error</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-xl transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure User Session</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">{profile?.name || "User"}</span>!
          </h1>
          <p className="text-sm text-slate-350 max-w-xl">
            Welcome to your ReactLab dashboard. You are securely authenticated and can now manage file uploads directly to AWS S3.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Details Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Profile Details</span>
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Name
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                {profile?.name}
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </span>
              <span className="text-sm font-bold text-slate-850 dark:text-white truncate max-w-[200px]">
                {profile?.email}
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Account Role
              </span>
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30 capitalize">
                {profile?.role}
              </span>
            </div>
            {profile?.createdAt && (
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Member Since
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Action Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="p-3 w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Cloud Storage File Upload
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload documents or images matching your environment-configured restrictions directly to your Amazon S3 bucket.
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/form-to-file-upload"
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-violet-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Go to File Uploader</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>
    </div>
      {profile?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Directory (Left 2 columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            {usersError ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Access Warning</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{usersError}</p>
              </div>
            ) : (
              <UseList users={users} />
            )}
          </div>

          {/* Create User Form (Right 1 column) */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm h-fit space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Create New User</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add a new user or administrator account to the system.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white transition-all capitalize"
                >
                  <option value="user">User (Standard)</option>
                  <option value="admin">Admin (Administrator)</option>
                </select>
              </div>

              {createError && (
                <p className="text-xs text-rose-500 font-medium bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/25">
                  {createError}
                </p>
              )}

              {createSuccess && (
                <p className="text-xs text-emerald-500 font-medium bg-emerald-500/10 py-2 px-3 rounded-lg border border-emerald-500/25">
                  {createSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-violet-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
              >
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isCreating ? "Creating User..." : "Create Account"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Atom, User as UserIcon, BookOpen, LogOut, Upload, LayoutDashboard, Loader2 } from "lucide-react";

function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  const isLoggedIn = !!token;

  let displayName = "";
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      displayName = parsed.name || parsed.email || "User";
    } catch {
      displayName = userStr;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20 group-hover:scale-105 transition-transform duration-350">
              <Atom className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              React<span className="text-violet-600 dark:text-violet-400 font-medium">Lab</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Tutorial</span>
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/form-to-file-upload"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`
                  }
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </NavLink>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
                  <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[10px] text-white font-extrabold capitalize">
                    {displayName[0] || "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {displayName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`
                }
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Page Content Area */}
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Loader2 className="w-10 h-10 animate-spin text-violet-600 dark:text-violet-400" />
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading page content...
            </p>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Modern minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-slate-400 dark:text-slate-500 animate-[spin_15s_linear_infinite]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              React Learning Hub
            </span>
          </div>
          <p className="text-xs text-center sm:text-right">
            © {new Date().getFullYear()} ReactLab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
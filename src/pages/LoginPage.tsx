import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, ArrowLeft, UserPlus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Link } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

const AuthSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type AuthFormValues = z.infer<typeof AuthSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState, setValue } = useForm<AuthFormValues>({
    resolver: zodResolver(AuthSchema),
  });

  function persistAuth(accessToken: string, refreshToken: string, user: any) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async function onSubmit(values: AuthFormValues) {
    setError('');
    setSuccessMsg('');

    try {
      if (isRegistering) {
        if (!values.name || values.name.trim() === '') {
          setError('Name is required for registration.');
          return;
        }
        
        // 1. Call registration API
        const regRes = await registerUser(values.email, values.password, values.name);
        if (!regRes.success) {
          setError('Registration failed. Please try again.');
          return;
        }

        setSuccessMsg('Registration successful! Logging you in...');
      }

      // 2. Call login API (works for both direct login and auto-login after register)
      const loginRes = await loginUser(values.email, values.password);
      if (loginRes.success && loginRes.accessToken && loginRes.refreshToken) {
        persistAuth(loginRes.accessToken, loginRes.refreshToken, loginRes.user);
        
        // Short delay to let success message be read if auto-logging in
        setTimeout(() => {
          navigate('/dashboard');
        }, isRegistering ? 1000 : 0);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const apiMsg = err.response?.data?.message || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Authentication failed. Please try again.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {/* Top Navigation Back */}
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hub</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
            {isRegistering ? <UserPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRegistering ? "Sign up to start secure file uploads" : "Sign in to access your file upload dashboard"}
          </p>
        </div>

        {/* Login/Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isRegistering && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600" 
                placeholder="e.g. John Doe" 
                {...register('name')} 
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
            <input 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600" 
              placeholder="e.g. user@example.com" 
              {...register('email')} 
            />
            {formState.errors.email && (
              <span className="text-[11px] text-red-500 font-medium block mt-0.5">
                {formState.errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
              {!isRegistering && <span className="text-[10px] text-slate-400">Default: password123</span>}
            </div>
            <input 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600" 
              placeholder="••••••••" 
              type="password" 
              {...register('password')} 
            />
            {formState.errors.password && (
              <span className="text-[11px] text-red-500 font-medium block mt-0.5">
                {formState.errors.password.message}
              </span>
            )}
          </div>

          {error && <p className="text-xs text-center text-rose-500 font-medium bg-rose-500/10 py-2 rounded-lg border border-rose-500/25">{error}</p>}
          {successMsg && <p className="text-xs text-center text-emerald-500 font-medium bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/25">{successMsg}</p>}

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md shadow-violet-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer" 
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isRegistering ? "Register Account" : "Login to Account"}</span>
          </button>
        </form>

        {/* Form Toggle Switch */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccessMsg('');
              setValue('name', '');
            }}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
          >
            {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
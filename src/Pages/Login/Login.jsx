import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../provider/authProvider';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charity-donation-platform-server.vercel.app';

const resolveRoleFromServer = async (email) => {
    if (!email) {
        console.log('[resolveRoleFromServer] No email provided');
        return null;
    }

    try {
        console.log(`[resolveRoleFromServer] Fetching role for email: ${email}`);
        const res = await fetch(`${API_BASE_URL}/users`);
        
        if (!res.ok) {
            console.error(`[resolveRoleFromServer] API returned status: ${res.status}`);
            return null;
        }
        
        const list = await res.json();
        console.log(`[resolveRoleFromServer] Received ${list?.length || 0} users from API`);
        
        const found = (list || []).find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
        
        if (found) {
            const role = (found.role || '').toLowerCase();
            console.log(`[resolveRoleFromServer] Found user with role: ${role}`);
            return role || null;
        } else {
            console.log(`[resolveRoleFromServer] User with email ${email} not found in database`);
            return null;
        }
    } catch (err) {
        console.error('[resolveRoleFromServer] Failed to resolve role from server:', err);
        return null;
    }
};

const Login = () => {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError('');
            setLoading(true);

            const { result } = await login(data.email, data.password);
            const userEmail = result?.user?.email || data.email;
            console.log(`[Login] User logged in with email: ${userEmail}`);

            const role = (await resolveRoleFromServer(userEmail)) || 'donor';
            console.log(`[Login] Resolved role: ${role}`);

            // Navigate based on role from backend
            if (role === 'admin') {
                console.log('[Login] Navigating to admin dashboard');
                navigate('/dashboard/admin', { replace: true });
            } else if (role === 'charity') {
                console.log('[Login] Navigating to charity dashboard');
                navigate('/dashboard/charity', { replace: true });
            } else {
                console.log('[Login] Navigating to donor dashboard');
                navigate('/dashboard/donor', { replace: true });
            }
        } catch (error) {
            if (error?.code === 'auth/operation-not-allowed') {
                setError('Email/Password sign-in is disabled in Firebase. Enable it in Authentication > Sign-in method. (auth/operation-not-allowed)');
            } else if (error?.code === 'auth/wrong-password') {
                setError('Incorrect password. (auth/wrong-password)');
            } else if (error?.code === 'auth/user-not-found') {
                setError('User not found. (auth/user-not-found)');
            } else if (error?.code === 'auth/invalid-credential') {
                setError('Invalid email or password. (auth/invalid-credential)');
            } else if (error?.code === 'auth/network-request-failed') {
                setError('Network error. Check your internet connection and try again. (auth/network-request-failed)');
            } else {
                setError(`Failed to log in. Please check your credentials.${error?.code ? ` (${error.code})` : ''}`);
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            const { result } = await loginWithGoogle();
            const userEmail = result?.user?.email;
            console.log(`[Google Login] User logged in with email: ${userEmail}`);

            const role = (await resolveRoleFromServer(userEmail)) || 'donor';
            console.log(`[Google Login] Resolved role: ${role}`);

            if (role === 'admin') {
                console.log('[Google Login] Navigating to admin dashboard');
                navigate('/dashboard/admin', { replace: true });
            } else if (role === 'charity') {
                console.log('[Google Login] Navigating to charity dashboard');
                navigate('/dashboard/charity', { replace: true });
            } else {
                console.log('[Google Login] Navigating to donor dashboard');
                navigate('/dashboard/donor', { replace: true });
            }
        } catch (error) {
            setError('Failed to log in with Google.');
            console.error('Google login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-primary">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-base-content/80">
                        Or{' '}
                        <Link to="/signup" className="font-medium text-primary hover:text-primary-focus underline">
                            create a new account
                        </Link>
                    </p>
                </div>

                <div className="card  shadow-2xl border border-base-300">
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email address</span>
                                </label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        // pattern: {
                                        //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        //     message: 'Invalid email address'
                                        // }
                                    })}
                                    type="email"
                                    className="input bg-gray-100 border-spacing-1 border-gray-300 input-bordered w-full focus:input-primary focus:outline-none"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.email.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                        type={showPassword ? 'text' : 'password'}
                                        className="input bg-gray-100 border-spacing-1 border-gray-300 input-bordered w-full pr-10 focus:input-primary focus:outline-none"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-base-content/60" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-base-content/60" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.password.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="label cursor-pointer">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    <span className="label-text ml-2">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full text-white font-semibold hover:btn-primary-focus transition-all"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="divider">OR</div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="btn btn-outline btn-primary w-full flex items-center justify-center gap-2 hover:btn-primary hover:text-white transition-all"
                        >
                            <FaGoogle className="h-5 w-5" />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

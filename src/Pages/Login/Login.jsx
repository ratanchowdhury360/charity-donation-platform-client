import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../provider/authProvider';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { setUserRole } from '../../utils/userStorage';

const Login = () => {
    const { login, signup, loginWithGoogle, setRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError('');
            setLoading(true);

            const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
            const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
            const isAdminCreds = (
                data?.email?.toLowerCase() === adminEmail?.toLowerCase() &&
                data?.password === adminPassword
            );

            // Surface missing admin env configuration clearly
            if (isAdminCreds && (!adminEmail || !adminPassword)) {
                setError('Admin credentials are not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD, then restart the dev server.');
                return;
            }

            try {
                await login(data.email, data.password);

                // Check if this is an admin login
                if (isAdminCreds) {
                    setUserRole(data.email, 'admin');
                    await setRole('admin');
                }
                // After login, redirect to home page
                // User can click Dashboard in navbar to go to their role-specific dashboard
                navigate('/', { replace: true });
                
            } catch (err) {
                // If admin credentials are provided but the account doesn't exist yet, create it
                if (isAdminCreds && (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential')) {
                    try {
                        await signup(data.email, data.password);
                        await setRole('admin');
                        navigate('/', { replace: true });
                        return;
                    } catch (signupError) {
                        console.error('Admin signup error:', signupError);
                        throw signupError;
                    }
                }
                throw err;
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
            await loginWithGoogle();
            // After Google login, redirect to home page
            // User can click Dashboard in navbar to go to their role-specific dashboard
            navigate('/', { replace: true });
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

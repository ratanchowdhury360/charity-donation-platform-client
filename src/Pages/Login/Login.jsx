import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../provider/authProvider';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { login, loginWithGoogle } = useAuth();
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
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (error) {
            setError('Failed to log in. Please check your credentials.');
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
            navigate(from, { replace: true });
        } catch (error) {
            setError('Failed to log in with Google.');
            console.error('Google login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                            create a new account
                        </Link>
                    </p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email address</span>
                                </label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className="input input-bordered w-full"
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
                                        className="input input-bordered w-full pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400" />
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
                                className="btn btn-primary w-full"
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
                            className="btn btn-outline w-full flex items-center justify-center gap-2"
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../provider/authProvider';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
    const { signup, loginWithGoogle, setRole } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            setError('');
            setLoading(true);
            await signup(data.email, data.password, {
                name: data.name,
                role: data.role
            });
            setRole(data.role);
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to create account. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            setRole('donor'); // Default role for Google signup
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to sign up with Google.');
            console.error('Google signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(value)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        return true;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            sign in to your existing account
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
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    {...register('name', {
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.name.message}</span>
                                    </label>
                                )}
                            </div>

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
                                    <span className="label-text">Account Type</span>
                                </label>
                                <select
                                    {...register('role', { required: 'Please select an account type' })}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select account type</option>
                                    <option value="donor">Donor - I want to donate to causes</option>
                                    <option value="charity">Charity - I represent an organization</option>
                                </select>
                                {errors.role && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.role.message}</span>
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
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            },
                                            validate: validatePassword
                                        })}
                                        type={showPassword ? 'text' : 'password'}
                                        className="input input-bordered w-full pr-10"
                                        placeholder="Create a strong password"
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

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: value => value === password || 'Passwords do not match'
                                        })}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="input input-bordered w-full pr-10"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <input
                                        {...register('terms', { required: 'You must accept the terms and conditions' })}
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text ml-2">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-primary hover:text-primary/80">
                                            Terms and Conditions
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-primary hover:text-primary/80">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                                {errors.terms && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.terms.message}</span>
                                    </label>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
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

export default SignUp;

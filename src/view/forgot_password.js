import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import supabase from '../db/db_conn';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Form states
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Session states
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(null);
    const [isValidSession, setIsValidSession] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        let subscription;

        const verifyPasswordRecovery = async () => {
            const email = searchParams.get('email');
            const token = searchParams.get('token');

            console.log('Email:', email);
            console.log('Token:', token);

            // Validate URL parameters
            if (!email || !token) {
                setError('Invalid password reset link. Please request a new one.');
                setIsVerifying(false);
                return;
            }

            try {
                // First, verify the OTP token
                const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                    type: 'recovery',
                    token: token,
                    email: email
                });

                console.log('Verification data:', verifyData);
                console.log('Verification error:', verifyError);

                if (verifyError) {
                    console.error('Verification error:', verifyError);
                    setError('This password reset link is invalid or has expired. Please request a new one.');
                    setIsVerifying(false);
                    return;
                }

                // If verification successful, set up auth state listener
                const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
                    console.log('Auth event:', event);
                    console.log('Session:', session);
                    switch (event) {
                        case 'PASSWORD_RECOVERY':
                            setIsValidSession(true);
                            setError(null);
                            break;

                        case 'SIGNED_OUT':
                            setIsValidSession(false);
                            setError('Your session has expired. Please request a new password reset link.');
                            break;

                        case 'SIGNED_IN':
                            // Optional: Handle successful sign in after password reset
                            break;

                        default:
                            // Handle other auth states if needed
                            break;
                    }
                });

                subscription = data.subscription;

                // If we get here, verification was successful
                setIsValidSession(true);
                setError(null);

            } catch (error) {
                console.error('Password recovery error:', error);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPasswordRecovery();

        // Cleanup subscription
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [searchParams]);

    const validatePassword = (password) => {
        const requirements = {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            isLongEnough: password.length >= 8
        };

        return Object.values(requirements).every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Validate passwords match
        if (trimmedPassword !== trimmedConfirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password requirements
        if (!validatePassword(trimmedPassword)) {
            setError('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: updateError } = await supabase.auth.updateUser({
                password: trimmedPassword
            });

            console.log('Update data:', data);
            console.log('Update error:', updateError);

            if (updateError) throw updateError;

            setIsComplete(true);
            toast.success('Password updated successfully!');

            // Optional: Redirect to login page after a delay
            // setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            console.error('Update password error:', err);
            setError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while verifying token
    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
                <div className="max-w-md w-full px-4 text-center">
                    <h1 className="text-center text-4xl font-bold mb-8">
                        <span className="text-[#3E64FF]">Campus</span>
                        <span className="text-[#5E72EB]">Connect</span>
                    </h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4">
                            <svg className="animate-spin h-16 w-16 text-[#3E64FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#212529] mb-2">Verifying Reset Link</h2>
                        <p className="text-[#6c757d]">Please wait while we verify your password reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid session state
    if (!isValidSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
                <div className="max-w-md w-full px-4 text-center">
                    <h1 className="text-center text-4xl font-bold mb-8">
                        <span className="text-[#3E64FF]">Campus</span>
                        <span className="text-[#5E72EB]">Connect</span>
                    </h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#212529] mb-2">Invalid Reset Link</h2>
                        <p className="text-[#6c757d]">{error || 'This password reset link is invalid or has expired. Please request a new one.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
                <div className="max-w-md w-full px-4 text-center">
                    <h1 className="text-center text-4xl font-bold mb-8">
                        <span className="text-[#3E64FF]">Campus</span>
                        <span className="text-[#5E72EB]">Connect</span>
                    </h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#3E64FF] to-[#5E72EB] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#212529] mb-2">Password Reset Complete</h2>
                        <p className="text-[#6c757d]">Your password has been successfully updated. You can now close this window and log in with your new password.</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-4xl font-bold">
                        <span className="text-[#3E64FF]">Campus</span>
                        <span className="text-[#5E72EB]">Connect</span>
                    </h1>
                    <h2 className="mt-6 text-center text-3xl font-bold text-[#212529]">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#6c757d]">
                        Please enter your new password
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-[#6c757d]">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3E64FF] focus:border-[#3E64FF] sm:text-sm"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="text-sm font-medium text-[#6c757d]">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3E64FF] focus:border-[#3E64FF] sm:text-sm"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="text-sm">
                            <p className="font-medium mb-2 text-gray-700">Password requirements:</p>
                            <ul className="space-y-2">
                                <li className={`flex items-center transition-colors duration-200 ${password.length >= 8 ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    <span className="flex-shrink-0 h-5 w-5 mr-2">
                                        {password.length >= 8 ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center transition-colors duration-200 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    <span className="flex-shrink-0 h-5 w-5 mr-2">
                                        {/[A-Z]/.test(password) ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                    One uppercase letter
                                </li>
                                <li className={`flex items-center transition-colors duration-200 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    <span className="flex-shrink-0 h-5 w-5 mr-2">
                                        {/[a-z]/.test(password) ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                    One lowercase letter
                                </li>
                                <li className={`flex items-center transition-colors duration-200 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    <span className="flex-shrink-0 h-5 w-5 mr-2">
                                        {/[0-9]/.test(password) ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                    One number
                                </li>
                                <li className={`flex items-center transition-colors duration-200 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    <span className="flex-shrink-0 h-5 w-5 mr-2">
                                        {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </span>
                                    One special character (!@#$%^&*)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#3E64FF] to-[#5E72EB] hover:from-[#5E72EB] hover:to-[#3E64FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E64FF]"
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
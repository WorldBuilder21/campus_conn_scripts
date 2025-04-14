// pages/VerifyEmail.jsx
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="text-[#3E64FF]">Campus</span>
                    <span className="text-[#5E72EB]">Connect</span>
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#3E64FF] to-[#5E72EB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#212529] mb-2">
                        Email Verification
                    </h2>
                    <p className="text-[#6c757d] mb-6">
                        Thank you for verifying your email. You can now access all CampusConnect features.
                    </p>
                    <Link
                        to="/"
                        className="text-white bg-gradient-to-r from-[#3E64FF] to-[#5E72EB] hover:from-[#5E72EB] hover:to-[#3E64FF] py-2 px-6 rounded-md inline-block font-medium"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
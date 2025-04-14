// pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="text-[#3E64FF]">Campus</span>
                    <span className="text-[#5E72EB]">Connect</span>
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-[#6c757d]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.172 16.172a4 4 0 015.656 0M12 14a3 3 0 100-6 3 3 0 000 6z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#212529] mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-[#6c757d] mb-6">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <Link
                        to="/"
                        className="text-[#3E64FF] hover:text-[#5E72EB] font-medium"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
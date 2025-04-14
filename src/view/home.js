const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="text-[#3E64FF]">Campus</span>
                    <span className="text-[#5E72EB]">Connect</span>
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-[#212529] mb-4">
                        Welcome to CampusConnect
                    </h2>
                    <p className="text-[#6c757d] mb-6">
                        Your trusted platform for campus communication and connectivity.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
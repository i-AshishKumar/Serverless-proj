import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToSignup = () => {
        navigate('/sign-up');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                    onClick={redirectToLogin}
                >
                    Login
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToSignup}
                >
                    Signup
                </button>
            </div>
        </div>
    );
};

import React from "react";
import { useNavigate } from "react-router-dom";

export const Agent = () => {
    const navigate = useNavigate();

    // Function to navigate to the agent's query answering page
    const redirectToAgentDashboard = () => {
        navigate('/agent/answer-query');
    };

    // Function to navigate to the manage rooms page
    const redirectToManageRooms = () => {
        navigate('/manage-rooms');
    };

    // Function to navigate to the data analysis dashboard
    const redirectToDataDashboard = () => {
        navigate('/feedback-analytics');
    };

    // Function to navigate to the customer analysis dashboard
    const redirectToCustomerAnalysis = () => {
        navigate('/customer-analysis');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="grid grid-cols-2 gap-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToAgentDashboard}
                >
                    Answer Customer Queries
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToManageRooms}
                >
                    Manage Rooms
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToDataDashboard}
                >
                    Review Analytics
                </button>
                <button
                    className="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToCustomerAnalysis}
                >
                    Customer Analysis Dashboard
                </button>
            </div>
        </div>
    );
};
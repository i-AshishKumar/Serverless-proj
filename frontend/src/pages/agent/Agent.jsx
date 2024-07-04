import React from "react";
import { useNavigate } from "react-router-dom";

export const Agent = () => {
    const navigate = useNavigate();
    const redirectToAgentDashboard = () => {
        navigate('/agent/answer-query');
    };

    const redirectToManageRooms = () => {
        navigate('/manage-rooms');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
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
            </div>
        </div>
    );
};

import React from "react";
import { useNavigate } from "react-router-dom";

export const Customer = () => {
    const navigate = useNavigate();

    // Function to redirect user to the Submit Query Dashboard page
    const redirectToQueryDashboard = () => {
        navigate('/customer/submit-query');
    };

    // Function to redirect user to the Room Booking page
    const redirectToRoomBooking = () => {
        navigate('/customer/rooms');
    };

    // Function to redirect user to the Customer Bookings page
    const redirectToCustomerBookings = () => {
        navigate('/customer/bookings');
    };

    // Function to redirect user to the Feedback Analytics page
    const redirectToAnalytics = () => {
        navigate('/feedback-analytics');
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                    onClick={redirectToQueryDashboard}
                >
                    Submit Concern
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={redirectToRoomBooking}
                >
                    Book Rooms
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                    onClick={redirectToCustomerBookings}
                >
                    View My Bookings
                </button>
                <button
                    className="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                    onClick={redirectToAnalytics}
                >
                    Review analytics
                </button>
            </div>
        </div>
    );
};
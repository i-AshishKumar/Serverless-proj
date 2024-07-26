import axios from "axios";
import React, { useEffect, useState } from "react";

// Utility function to format date and time
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will give the local date and time
};

export const AgentDashboard = () => {
    const user = localStorage.getItem("email"); // Get the user email from localStorage
    const [concerns, setConcerns] = useState([]); // State to hold concerns

    // Function to fetch concerns from the API
    const fetchConcerns = async () => {
        try {
            const response = await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/get_published_concern', {
                'agent_id': user
            });
            setConcerns(response.data.concerns); // Update state with fetched concerns
        } catch (error) {
            console.error('Error fetching concerns:', error); // Handle errors
        }
    };

    useEffect(() => {
        fetchConcerns(); // Fetch concerns when component mounts
        const interval = setInterval(fetchConcerns, 10000); // Fetch concerns every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    // Function to handle responding to a concern
    const handleRespond = async (bookingReference, reply) => {
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/reply_concern', {
                'concern_id': bookingReference,
                'reply': reply
            });
            alert('Response submitted successfully');
            fetchConcerns(); // Refresh concerns after submitting a response
        } catch (error) {
            console.error('Error submitting response:', error); // Handle errors
            alert('Failed to submit response');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Customer Queries</h2>
            {/* Uncomment this section if you want a manual refresh button */}
            {/* <div className="mb-4 text-center">
                <button 
                    onClick={fetchConcerns} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Refresh Queries
                </button>
            </div> */}
            {concerns.length > 0 ? (
                <div className="space-y-6">
                    {concerns.map((concern) => (
                        <div key={concern.id} className="bg-white shadow-md rounded-lg p-6">
                            <p className="font-semibold text-lg mb-2">Booking Ref: <span className="font-normal">{concern.booking_reference}</span></p>
                            <p className="mb-4"><span className="font-semibold">Concern:</span> {concern.message}</p>
                            <p className="mb-4"><span className="font-semibold">Response:</span> {concern.reply}</p>
                            {concern.status === "pending" && (
                                <>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Your response"
                                        rows="3"
                                        onChange={(e) => concern.reply = e.target.value}
                                    />
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        onClick={() => handleRespond(concern.id, concern.reply)}
                                    >
                                        Respond
                                    </button>
                                </>
                            )}
                            <p className="text-sm text-gray-500 mt-2">{formatDate(concern.created_at)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No concerns to display.</p>
            )}
        </div>
    );
};

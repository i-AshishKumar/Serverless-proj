import axios from "axios";
import React, { useEffect, useState } from "react";

export const AgentDashboard = () => {
    const [concerns, setConcerns] = useState([]);

    const fetchConcerns = async () => {
        try {
            const response = await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/get_published_concern');
            setConcerns(response.data.concerns);
        } catch (error) {
            console.error('Error fetching concerns:', error);
        }
    };

    useEffect(() => {
        fetchConcerns();
    }, []);

    const handleRespond = async (bookingReference, reply) => {
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/reply_concern', {
                'concern_id': bookingReference,
                'reply': reply
            });
            alert('Response submitted successfully');
            // Refresh concerns
            fetchConcerns();
        } catch (error) {
            console.error('Error submitting response:', error);
            alert('Failed to submit response');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Customer Query Dashboard</h2>
            <div className="mb-4 text-center">
                <button 
                    onClick={fetchConcerns} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Refresh Queries
                </button>
            </div>
            {concerns.length > 0 ? (
                <div className="space-y-6">
                    {concerns.map((concern) => (
                        <div key={concern.id} className="bg-white shadow-md rounded-lg p-6">
                            <p className="font-semibold text-lg mb-2">Booking Ref: <span className="font-normal">{concern.booking_reference}</span></p>
                            <p className="mb-4"><span className="font-semibold">Concern:</span> {concern.message}</p>
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
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No concerns to display.</p>
            )}
        </div>
    );
};
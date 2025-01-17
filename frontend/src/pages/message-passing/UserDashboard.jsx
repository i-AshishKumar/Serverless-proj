import React, { useState, useEffect } from "react";
import axios from "axios";

// Utility function to format date and time
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will give the local date and time
};

export const UserDashboard = () => {
    const user = localStorage.getItem("email");
    const [bookingReference, setBookingReference] = useState('');
    const [concern, setConcern] = useState('');
    const [responses, setResponses] = useState(null);
    const [followUpConcerns, setFollowUpConcerns] = useState({});
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/publish_concern', {
                'user_id': user,
                'booking_reference': bookingReference,
                'message': concern
            });
            alert('Concern submitted successfully');
            setBookingReference('');
            setConcern('');
        } catch (error) {
            console.error('Error submitting concern:', error);
            alert('Failed to submit concern');
        }
    };

    const handleFetchResponse = async () => {
        setLoading(true);
        try {
            const res = await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/get_replied_concern', {
                'user_id': user
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setResponses(res.data);
        } catch (error) {
            console.error('Error fetching response:', error);
            alert('Failed to fetch response');
        } finally {
            setLoading(false);
        }
    };

    const handleFollowUpSubmit = async (bookingReference, followUpConcern) => {
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/publish_concern', {
                'user_id': user,
                'booking_reference': bookingReference,
                'message': followUpConcern
            });
            alert('Follow-up concern submitted successfully');
            setFollowUpConcerns(prev => ({ ...prev, [bookingReference]: '' }));
        } catch (error) {
            console.error('Error submitting follow-up concern:', error);
            alert('Failed to submit follow-up concern');
        }
    };

    const handleFollowUpChange = (bookingReference, value) => {
        setFollowUpConcerns(prev => ({ ...prev, [bookingReference]: value }));
    };

    useEffect(() => {
        handleFetchResponse();
        const interval = setInterval(handleFetchResponse, 10000); // Fetch concerns every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Submit Your Concern</h2>
                    <form onSubmit={handleSubmit} className="mb-8">
                        <div className="mb-4">
                            <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700">Booking Reference</label>
                            <input
                                id="bookingReference"
                                type="text"
                                value={bookingReference}
                                onChange={(e) => setBookingReference(e.target.value)}
                                placeholder="Booking Reference"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="concern" className="block text-sm font-medium text-gray-700">Your Concern</label>
                            <textarea
                                id="concern"
                                value={concern}
                                onChange={(e) => setConcern(e.target.value)}
                                placeholder="Your concern"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            {loading ? 'Submitting...' : 'Submit Concern'}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Response from Agent</h2>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading responses...</p>
                    ) : (
                        responses ? (
                            responses.concerns.length > 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md">
                                    {responses.concerns.map((concern, index) => (
                                        <div key={index} className="mb-4 bg-white p-3 rounded-md shadow">
                                            <p className="font-semibold">Booking Ref: <span className="font-normal">{concern.booking_reference}</span></p>
                                            <p className="font-semibold">Status: <span className="font-normal">{concern.status.charAt(0).toUpperCase() + concern.status.slice(1)}</span></p>
                                            <p className="font-semibold">Concern: <span className="font-normal">{concern.message}</span></p>
                                            <p className="font-semibold">Agent Response: <span className="font-normal">{concern.reply}</span></p>
                                            <p className="text-sm text-gray-500 mt-2">{formatDate(concern.created_at)}</p>
                                            <form onSubmit={(e) => { e.preventDefault(); handleFollowUpSubmit(concern.booking_reference, followUpConcerns[concern.booking_reference] || ''); }} className="mt-4">
                                                <textarea
                                                    value={followUpConcerns[concern.booking_reference] || ''}
                                                    onChange={(e) => handleFollowUpChange(concern.booking_reference, e.target.value)}
                                                    placeholder="Your follow-up concern"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    rows="2"
                                                />
                                                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                                    {loading ? 'Submitting...' : 'Submit Follow-Up Concern'}
                                                </button>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No responses found.</p>
                            )
                        ) : (
                            <p className="text-center text-gray-500">Loading responses...</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
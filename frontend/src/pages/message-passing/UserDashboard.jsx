import React, { useState } from "react";
import axios from "axios";

export const UserDashboard = () => {
    const userId = '123';
    const [bookingReference, setBookingReference] = useState('');
    const [concern, setConcern] = useState('');
    const [responses, setResponses] = useState(null);
    const [followUpConcerns, setFollowUpConcerns] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/publish_concern', {
                'user_id': userId,
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
        try {
            const res = await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/get_replied_concern', {
                'user_id': userId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setResponses(res.data);
        } catch (error) {
            console.error('Error fetching response:', error);
            alert('Failed to fetch response');
        }
    };

    const handleFollowUpSubmit = async (bookingReference, followUpConcern) => {
        try {
            await axios.post('https://us-central1-serverlessproject-427212.cloudfunctions.net/publish_concern', {
                'user_id': userId,
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Submit Your Concern</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        value={bookingReference}
                        onChange={(e) => setBookingReference(e.target.value)}
                        placeholder="Booking Reference"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        value={concern}
                        onChange={(e) => setConcern(e.target.value)}
                        placeholder="Your concern"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Submit Concern
                </button>
            </form>

            <h2 className="text-2xl font-bold mb-4">View Responses</h2>
            <div className="mb-4">
                <button onClick={handleFetchResponse} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                    Fetch Responses
                </button>
            </div>

            {responses && (
                <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-2">Responses:</h3>
                    {responses.concerns.map((concern, index) => (
                        <div key={index} className="mb-4 bg-white p-3 rounded-md shadow">
                            <p className="font-semibold">Concern: <span className="font-normal">{concern.message}</span></p>
                            <p className="font-semibold mt-2">Agent Response: <span className="font-normal">{concern.reply}</span></p>
                            <form onSubmit={(e) => { e.preventDefault(); handleFollowUpSubmit(concern.booking_reference, followUpConcerns[concern.booking_reference] || ''); }} className="mt-4">
                                <textarea
                                    value={followUpConcerns[concern.booking_reference] || ''}
                                    onChange={(e) => handleFollowUpChange(concern.booking_reference, e.target.value)}
                                    placeholder="Your follow-up concern"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                    Submit Follow-Up Concern
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

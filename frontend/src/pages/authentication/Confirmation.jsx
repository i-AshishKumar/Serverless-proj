import { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate, useParams } from 'react-router-dom';
import UserPool from '../../UserPool'; // Import UserPool configuration
import axios from 'axios';

const Confirmation = () => {
    // Extract email and firstName from URL parameters
    const { email, firstName } = useParams();
    // State for storing the confirmation code and any error messages
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    // Hook to programmatically navigate to other routes
    const navigate = useNavigate();

    // Function to handle the confirmation process
    const handleConfirm = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Create a CognitoUser instance for the given email
        const userData = {
            Username: email,
            Pool: UserPool
        };
        const cognitoUser = new CognitoUser(userData);

        // Confirm the user's registration with the provided code
        cognitoUser.confirmRegistration(code, true, async (err, result) => {
            if (err && err.name !== 'InvalidLambdaResponseException') {
                console.log(err.name);
                setError(err.message); // Set error message if confirmation fails
            } else {
                console.log('Confirmation result:', result);

                // Prepare payload for the API request
                const payload = {
                    body: JSON.stringify({
                        eventType: "register",
                        email: email,
                        name: firstName  // Replace with actual name if available
                    })
                };

                try {
                    // Post the payload to the specified API endpoint
                    const response = await axios.post('https://ehnhrawf3e.execute-api.us-east-1.amazonaws.com/dev/loginnotification', payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('API response:', response.data);
                    navigate('/login'); // Navigate to login page on successful API response
                } catch (postError) {
                    console.error('Error posting to API:', postError);
                    setError('Error posting to API. Please try again.'); // Set error message if API request fails
                }
            }
        });
    }

    return (
        <div className='w-full max-w-xs'>
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <form onSubmit={handleConfirm}>
                    {/* Display error messages if any */}
                    <p className="text-red-500 mb-4 text-xs italic">{error}</p>
                    
                    {/* Disabled input field for email */}
                    <input
                        className='shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed' 
                        type="email"
                        value={email}
                        placeholder="Email"
                        disabled
                        required
                    />
                    
                    {/* Input field for the confirmation code */}
                    <input
                        className='shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)} // Update code state on change
                        placeholder="Confirmation Code"
                        required
                    />

                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            {/* Submit button for confirmation */}
                            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2'>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>

                {/* Button to resend the confirmation code (currently not functional) */}
                <div className="md:flex md:items-center justify-center">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2'>
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;

import { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useNavigate, useParams } from 'react-router-dom';
import UserPool from '../../UserPool';
import axios from 'axios';

const Confirmation = () => {
    const { email, firstName } = useParams();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleConfirm = async (event) => {
        event.preventDefault();
        const userData = {
            Username: email,
            Pool: UserPool
        };
        
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, async (err, result) => {
            if (err && err.name !== 'InvalidLambdaResponseException') {
                console.log(err.name);
                setError(err.message);
            } else {
                console.log('Confirmation result:', result);

                // Prepare the payload
                const payload = {
                    body: JSON.stringify({
                        eventType: "register",
                        email: email,
                        name: firstName  // Replace with the actual name if available
                    })
                };

                try {
                    const response = await axios.post('https://ehnhrawf3e.execute-api.us-east-1.amazonaws.com/dev/loginnotification', payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('API response:', response.data);
                    navigate('/login');
                } catch (postError) {
                    console.error('Error posting to API:', postError);
                    setError('Error posting to API. Please try again.');
                }
            }
        });
    }

    return (
        <div className='w-full max-w-xs'>
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <form onSubmit={handleConfirm} >
                    <p className="text-red-500 mb-4 text-xs italic">{error}</p>
                    <input
                        className='shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed' 
                        type="email"
                        value={email}
                        placeholder="Email"
                        disabled
                        required
                    />
                    <input
                        className='shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Confirmation Code"
                        required
                    />

                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2'>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>

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

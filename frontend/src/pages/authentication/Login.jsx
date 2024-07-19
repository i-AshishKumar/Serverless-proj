import { useState, useContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AccountContext } from './Account';

import UserPool from '../../UserPool';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { authenticate } = useContext(AccountContext);
    
    const login = async (event) => {
        event.preventDefault();
        authenticate(email, password)
            .then(data => { 
                console.log('Logged in!', data); 
                navigate('/verification/'+encodeURIComponent(email));
            })
            .catch(err => { 
                if (err.code === 'UserNotConfirmedException') {
                    // redirect to confirm page
                    navigate('/auth-confirm/' + encodeURIComponent(email)); // Redirect to the confirmation page with the email
                } else {
                    setError(err.message);
                }
            });
    };

    return (
        <div className='w-full max-w-xs'>
            <form onSubmit={login} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <p className="text-red-500 mb-4 text-xs italic">{error}</p>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
import { useState } from 'react';
import UserPool from '../../UserPool';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const validatePassword = (password) => {
        // password must be at least 8 characters long, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return passwordRegex.test(password);
    }
    
    const signUp = async (event) => {
        event.preventDefault();
        try {
            UserPool.signUp(email, password, [], null, (err, data) => {
                if (err) {
                    setError(err.message);
                    console.error(err);
                } else {
                    console.log(data);
                }
            });
        } catch (error) {
            console.log('error signing up:', error);
        }
    };

    return (
        <div className='w-full max-w-xs'>
            <form onSubmit={signUp} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
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
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup;
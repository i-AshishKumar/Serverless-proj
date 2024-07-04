import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPool from '../../UserPool';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const validatePassword = (password) => {
        // password must be at least 8 characters long, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return passwordRegex.test(password);
    }
    
    const signUp = async (event) => {
        event.preventDefault();
        const attributeList = [
            { Name: 'email', Value: email },
            { Name: 'phone_number', Value: phoneNumber },
            { Name: 'given_name', Value: firstName },
            { Name: 'family_name', Value: lastName },
            { Name: 'custom:role', Value: role },
            { Name: 'custom:securityQuestion', Value: securityQuestion },
            { Name: 'custom:securityAnswer', Value: securityAnswer }
        ];
        try {
            UserPool.signUp(email, password, attributeList, null, (err, data) => {
                if (err) {
                    setError(err.message);
                    console.error(err);
                } else {
                    console.log(data);
                    navigate('/auth-confirm/' + encodeURIComponent(email)); // Redirect to the confirmation page with the email
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        First Name
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Last Name
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone Number
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="+10000000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Role
                    </label>

                    <select 
                        className='shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        defaultValue={'agent'} 
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="agent">Agent</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Security Question
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="Security Question"
                        value={securityQuestion}
                        onChange={(e) => setSecurityQuestion(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Answer
                    </label>
                    <input
                        className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="Answer"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
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
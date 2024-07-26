import { AccountContext } from "./Account";
import UserPool from "../../UserPool";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserAttribute } from "../authentication/Account";

const Verification = () => {
    const [attributes, setAttributes] = useState();
    const [securityAnswer, setSecurityAnswer] = useState();
    const [error, setError] = useState('');
    const [cipher, setCipher] = useState();
    const [captcha, setCaptcha] = useState();
    const [captchaInput, setCaptchaInput] = useState();
    const navigate = useNavigate();
    const { email } = useParams();

    const words = ['apple', 'banana'];

    useEffect(() => {
        // Generate a random word and create a caesar cipher for captcha
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomShift = Math.floor(Math.random() * 26);
        const cipher = randomWord.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + randomShift) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + randomShift) % 26) + 97);
            } else {
                return char;
            }
        }).join('');
        setCaptcha(randomWord);
        setCipher(cipher);

        // Get the current user and their session
        const user = UserPool.getCurrentUser();
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    console.error('getSession error:', err);
                    navigate('/login'); // Redirect to login if session retrieval fails
                }
                console.log('session:', session);
                
                // Get user attributes, especially custom security question and answer
                user.getUserAttributes((err, att) => {
                    if (err) {
                        console.error('getUserAttributes error:', err);
                        navigate('/login'); // Redirect to login if attribute retrieval fails
                    }
                    console.log('attributes:', att);
                    
                    // Extract security question and answer from attributes
                    let obj = att.reduce((acc, curr) => {
                        if (curr.getName() === 'custom:securityQuestion' || curr.getName() === 'custom:securityAnswer') {
                            acc[curr.getName().split(':')[1]] = curr.getValue();
                        }
                        return acc;
                    }, {});
                    setAttributes(obj);
                });
            });
        } else {
            navigate('/login'); // Redirect to login if no user is found
        }
    }, [navigate]); // Dependency array ensures useEffect runs on component mount

    const handleSubmit = (event) => {
        event.preventDefault();
        // Check if the provided security answer matches the stored answer
        if (securityAnswer !== attributes.securityAnswer) {
            setError('Incorrect answer');
            console.log('Incorrect answer');
            console.log(securityAnswer);
            console.log(attributes.securityAnswer);

            // Sign out user if the answer is incorrect
            const user = UserPool.getCurrentUser();
            if (user) {
                user.signOut();
            }
            navigate('/login'); // Redirect to login page
            return;
        }
        // Check if the provided captcha matches the generated captcha
        if (captchaInput !== captcha) {
            setError('Incorrect captcha');
            return;
        }
        // Construct the request body for the API call
        const email = localStorage.getItem('email');
        const name = email.split('@')[0];
        const requestBody = {
            body: JSON.stringify({
                eventType: "login",
                email: email,
                name: name
            })
        };

        // Send the POST request to the API gateway
        fetch('https://ehnhrawf3e.execute-api.us-east-1.amazonaws.com/dev/loginnotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            console.log('Success:', data);
            // Retrieve user role and store it in localStorage
            const role = await getUserAttribute("custom:role");
            localStorage.setItem("role", role);
            // Navigate to the appropriate role-based page or home page
            navigate(role ? `/${role}` : '/');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to notify login event');
        });
    }

    if (!attributes) return ( <div>Loading...</div> ); // Show loading message while attributes are being fetched

    return (
        <div>
            <h1>Verification</h1>
            <form onSubmit={handleSubmit}>
                <p>{error}</p> {/* Display error messages */}
                <p>Security Question: {attributes.securityQuestion}</p>
                <input 
                    type="text" 
                    value={securityAnswer}
                    onChange={e => setSecurityAnswer(e.target.value)} 
                    required
                />
                <p>Captcha: {cipher}</p>
                <input 
                    type="text" 
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)} 
                    required
                />
                <button 
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Verification;

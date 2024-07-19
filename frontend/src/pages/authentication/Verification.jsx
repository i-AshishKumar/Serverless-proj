import { AccountContext } from "./Account";
import UserPool from "../../UserPool";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const Verification = () => {
    const [attributes, setAttributes] = useState();
    const [securityAnswer, setSecurityAnswer] = useState();
    const [error, setError] = useState('');
    const [cipher, setCipher] = useState();
    const [captcha, setCaptcha] = useState();
    const [captchaInput, setCaptchaInput] = useState();
    const navigate = useNavigate();

    const {email} = useParams();

    const words = ['apple', 'banana'];

    useEffect(() => {
        // pick a random word from the list and create a caesar cipher of it
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

        const user = UserPool.getCurrentUser();
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    console.error('getSession error:', err);
                    navigate('/login');
                }
                console.log('robin session', session);
                
                user.getUserAttributes((err, att) => {
                    if (err) {
                        console.error('getUserAttributes error:', err);
                        navigate('/login');
                    }
                    console.log('robin attributes', att);
                    
                    let obj = att.reduce((acc, curr) => {
                        if (curr.getName() === 'custom:securityQuestion' || curr.getName() === 'custom:securityAnswer') {
                            acc[curr.getName().split(':')[1]] =  curr.getValue();
                        }
                        return acc;
                    }, {});
                    setAttributes(obj);
                });

            });
            console.log('joker ')
            console.log(attributes)
        } else {
            navigate('/login');
        }
    }, []);

    

    const handleSubmit = (event) => {
        event.preventDefault();
        if (securityAnswer !== attributes.securityAnswer) {
            setError('Incorrect answer');
            console.log('Incorrect answer');
            console.log(securityAnswer);
            console.log(attributes.securityAnswer);

            // sign out user
            const user = UserPool.getCurrentUser();
            if (user) {
                user.signOut();
            }
            navigate('/login');

            return;
        }
        if (captchaInput !== captcha) {
            setError('Incorrect captcha');
            return;
        }
        // Construct the request body
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
        .then(data => {
            console.log('Success:', data);
            // Navigate to customer page after successful request
            navigate('/customer');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to notify login event');
        });
    }

    if (!attributes) return ( <div>Loading...</div> );

    return (
        <div>
            <h1>Verification</h1>
            <form onSubmit={handleSubmit}>
                <p>{error}</p>
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
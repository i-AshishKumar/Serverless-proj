import React, { useContext, useEffect, useState } from 'react';
import { AccountContext, getUserAttribute } from './Account';
import { useNavigate } from "react-router-dom";

const Status = () => {
    const [status, setStatus] = useState(false);
    const { getSession } = useContext(AccountContext); 
    const [role, setRole] = useState("guest-user");

    useEffect(() => {
        // UseEffect hook runs on component mount to check session and fetch user role
        console.log(status);
        getSession()
            .then(async session => {
                console.log('session:', session);
                setStatus(true); // Update status to true if session is successfully fetched
                const role = await getUserAttribute("custom:role"); // Fetch user role attribute
                console.log(role);
                setRole(role); // Update role state with fetched role
            })
            .catch(err => {
                console.error('Error getting session');
                setStatus(false); // Update status to false if there's an error fetching the session
            });
    }, [getSession]); // Dependency array ensures useEffect runs only when getSession changes

    return (
        <div>
            { status ? 
                <div>
                    <p>Email: {localStorage.getItem("email")}</p>
                    <p>Role: {role}</p>
                </div> 
                : 
                'Please log in.' // Prompt user to log in if status is false
            }
        </div>
    );
}

export default Status;
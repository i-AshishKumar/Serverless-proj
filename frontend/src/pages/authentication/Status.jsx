import React, { useContext, useEffect, useState } from 'react';
import { AccountContext, getUserAttribute } from './Account';
import { useNavigate } from "react-router-dom";

const Status = () => {
    const [status, setStatus] = useState(false);
    const { getSession } = useContext(AccountContext);
    const [role, setRole] = useState("guest-user");

    useEffect(() => {
        console.log(status);
        getSession()
            .then(async session => {
                console.log('session:', session);
                setStatus(true);
                const role = await getUserAttribute("custom:role");
                console.log(role);
                setRole(role);
            })
            .catch(err => {
                console.error('Error getting session')
                setStatus(false)
            });
    }, []);

    return (
        <div>
            { status ? <div><p>Email: {localStorage.getItem("email")}</p>
            <p>Role: {role}</p></div> : 'Please log in.' }
        </div>
    );
}

export default Status;
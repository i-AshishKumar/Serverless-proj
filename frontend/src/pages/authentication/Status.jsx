import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from './Account';

const Status = () => {
    const [status, setStatus] = useState(false);
    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        getSession()
            .then(session => {
                console.log('batman session:', session);
                setStatus(true);
            })
            .catch(err => {
                console.error('Error getting session')
                setStatus(false)
            });
    }, []);

    return (
        <div>
            { status ? 'You are logged in!' : 'Please log in.' }
        </div>
    );
}

export default Status;
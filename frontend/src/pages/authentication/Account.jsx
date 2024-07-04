import React, {createContext, useContext, useState} from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../../UserPool';

const AccountContext = createContext();

const Account = ({children}) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        console.error('getSession error:', err);
                        reject();
                    } else {
                        resolve(session);
                    }
                });
            } else {
                console.log('No user');
                reject();
            }
        });
    };

    const authenticate = async (email, password) => {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: email,
                Pool: Pool
            });

            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password
            });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    console.log('onSuccess:', data);
                    resolve(data);
                    localStorage.setItem("email", email);
                },
                onFailure: (err) => {
                    console.error('onFailure:', err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log('newPasswordRequired:', data);
                    resolve(data);
                }
            });
        });
    };

    return (
        <AccountContext.Provider value={{authenticate, getSession}}>
            {children}
        </AccountContext.Provider>
    );
}

export { Account, AccountContext };
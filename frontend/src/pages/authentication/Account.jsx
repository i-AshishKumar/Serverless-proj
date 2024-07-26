import React, { createContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../../UserPool';  // Importing UserPool configuration
import UserPool from '../../UserPool'; // Importing UserPool configuration

// Create a Context for managing account-related operations
const AccountContext = createContext();

// Account component that provides authentication and session management functions
const Account = ({ children }) => {
    // Function to get the current session for the logged-in user
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

    // Function to authenticate a user with email and password
    const authenticate = async (email, password) => {
        return new Promise((resolve, reject) => {
            // Create a CognitoUser instance with the provided email
            const user = new CognitoUser({
                Username: email,
                Pool: Pool
            });

            // Create AuthenticationDetails with email and password
            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password
            });

            // Authenticate the user
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

    // Provide the authenticate and getSession functions to child components
    return (
        <AccountContext.Provider value={{ authenticate, getSession }}>
            {children}
        </AccountContext.Provider>
    );
}

// Function to get a specific user attribute
const getUserAttribute = (attribute) => {
    return new Promise((resolve, reject) => {
        // Retrieve the current user from the UserPool
        const currentUser = UserPool.getCurrentUser();
  
        if (currentUser) {
            // Get the user's session
            currentUser.getSession((err, session) => {
                if (err) {
                    console.error('Error getting session:', err);
                    reject(err);
                    return;
                }
  
                // Get the user's attributes
                currentUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        console.error('Error getting user attributes:', err);
                        reject(err);
                        return;
                    }
  
                    // Find and return the specific attribute value
                    const attributeObject = attributes.find(attr => attr.getName() === attribute);
                    const attributeValue = attributeObject ? attributeObject.getValue() : null;
  
                    console.log(`${attribute}:`, attributeValue);
                    resolve(attributeValue);
                });
            });
        } else {
            console.error('No current user');
            resolve(null); // Resolve with null if no current user
        }
    });
};

export { Account, AccountContext, getUserAttribute };

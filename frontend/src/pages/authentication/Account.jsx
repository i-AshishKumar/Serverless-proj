import React, {createContext} from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../../UserPool';
import UserPool from '../../UserPool';

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

const getUserAttribute = (attribute) => {
    return new Promise((resolve, reject) => {
      const currentUser = UserPool.getCurrentUser();
  
      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (err) {
            console.error('Error getting session:', err);
            reject(err);
            return;
          }
  
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error('Error getting user attributes:', err);
              reject(err);
              return;
            }
  
            // Get specific attribute, e.g., email
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
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_osvHfvS4i',
    ClientId: '4uhapgg8mc1op0reibhvtqen59'
};

export default new CognitoUserPool(poolData);
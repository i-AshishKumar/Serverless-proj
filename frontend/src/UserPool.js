import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_NEYVAggWI',
    ClientId: '57dq0fu2d3hb6sr64sdruj9fvc'
};

export default new CognitoUserPool(poolData);
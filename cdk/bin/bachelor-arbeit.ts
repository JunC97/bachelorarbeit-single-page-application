#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UtilsStack } from '../lib/utils-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { DatabaseStack } from '../lib/database-stack';
import { LogicStack } from '../lib/logic-stack';

const app = new cdk.App();
const frontendStack = new FrontendStack(app, 'FrontendStack',{
    stackName: "bachelorarbeit-frontend-stack",
});

const databaseStack = new DatabaseStack(app, 'DatabaseStack', {
    stackName: "bachelorarbeit-database-stack",
});

const utilsStack = new UtilsStack(app, 'UtilsStack', {
    stackName: "bachelorarbeit-utils-stack",
})

const logicStack = new LogicStack(app, 'LogicStack', {
    stackName: "bachelorarbeit-logic-stack",
    vpc: databaseStack.Vpc,
    serverlessClusterArn: databaseStack.ServerlessClusterArn,
    dBCredentialsSecretArn: databaseStack.dBCredentialsSecretArn,
    lambda_code_bucket_arn: utilsStack.lambda_code_bucket_arn,
})
logicStack.addDependency(utilsStack);

new ApiGatewayStack(app, 'ApiGatewayStack',{
    stackName: "bachelorarbeit-api-gateway-stack",
    functionArn: logicStack.functionArn});

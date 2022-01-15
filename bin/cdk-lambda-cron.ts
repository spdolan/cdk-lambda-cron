#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NodejsLambdaStack } from '../lib/nodejs-lambda/nodejs-lambda-stack';
import { EventCRONStack } from '../lib/event-cron/event-cron-stack';

// pull environments - this is usually done implicitly by CDK
const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const usDebtLambda = new NodejsLambdaStack(app, 'USDebtLambda', {
  env: defaultEnv,
  lambdaEntry: `@/lib/lambda-fns/nodejs-lambda/index.ts`
})

const usDebtLambdaCRON = new EventCRONStack(app, 'USDebtCRONTrigger', {
  env: defaultEnv,
  lambda: usDebtLambda.lambda
})

// Stack Dependencies
usDebtLambdaCRON.addDependency(usDebtLambda)
# Node.js Lambda CRON - a CDK TypeScript project!

# Overview

This project contains two CDK stacks:
  1. Nodejs Lambda, to create an ESBuild compiled Node.js Typescript lambda function. Default is to hit the [US Treasury API](https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny) for a thrilling reminder about the US National Debt.
  1. Event CRON, which by default generates an AWS event for each Weekday, which triggers an input Lambda function to execute.

# Deployment

This repo assumes you have already followed the [CDK scaffold](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) for your already setup [AWS Account CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

To deploy as-is, from the root of the repository:

```bash
# Check that cdk is installed correctly
which cdk
# install dependencies - alternatively `npm install`
yarn install
# head over to where the stacks are declared
cd bin
# deploy Event CRON stack, which depends upon the Lambda
cdk deploy USDebtCRONTrigger
```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `yarn build`   compile typescript to js
 * `yarn watch`   watch for changes and compile
 * `yarn test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

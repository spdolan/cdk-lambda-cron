import { PathLike } from 'fs';
import * as path from 'path'
import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'

interface NodejsLambdaProps extends cdk.StackProps {
  lambdaEntry: PathLike
}

export class NodejsLambdaStack extends cdk.Stack {
  public readonly lambda: NodejsFunction;

  constructor(scope: cdk.Construct, id: string, props?: NodejsLambdaProps) {
    super(scope, id, props);

    this.lambda = new NodejsFunction(this, 'MyNodejsLambdaFunction', {
      entry: path.join(__dirname, `${props?.lambdaEntry}` || `@/lib/lambda-fns/nodejs-lambda/index.ts`), // accepts .js, .jsx, .ts and .tsx files
      // handler: 'handler', // defaults to 'handler'
      bundling: {
        minify: true, // minify code, defaults to false
        sourceMap: true,
      }
    });
  }
}
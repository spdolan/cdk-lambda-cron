import * as cdk from '@aws-cdk/core';
import * as targets from '@aws-cdk/aws-events-targets'
import * as events from '@aws-cdk/aws-events'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'

interface EventCRONProps extends cdk.StackProps {
  lambda: NodejsFunction
}

export class EventCRONStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: EventCRONProps) {
    super(scope, id, props);

    if (props?.lambda) {
      const eventRule = new events.Rule(this, 'scheduleRule', {
        // generate event every day at 7AM US ET (UTC-5), CRON is created in UTC
        schedule: events.Schedule.cron({ minute: '0', hour: '12', weekDay: 'MON-FRI' }),
      });
      eventRule.addTarget(new targets.LambdaFunction(props.lambda));
    } else {
      throw new Error('No function supplied to Event CRON stack.')
    }
  }
}
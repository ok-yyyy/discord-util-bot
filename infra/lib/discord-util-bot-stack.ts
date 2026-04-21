import * as cdk from 'aws-cdk-lib';
import { Ecr } from './constructs/ecr';
import { Ecs } from './constructs/ecs';
import { Vpc } from './constructs/vpc';

export type DiscordUtilBotStackProps = cdk.StackProps & {
  imageTag: string;
};

export class DiscordUtilBotStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: DiscordUtilBotStackProps) {
    super(scope, id, props);
    cdk.Tags.of(this).add('app', 'discord-util-bot');

    const vpc = new Vpc(this, 'Vpc');

    const ecr = new Ecr(this, 'Ecr', {
      imageTag: props.imageTag,
    });

    const ecs = new Ecs(this, 'Ecs', {
      vpc: vpc.vpc,
      securityGroup: vpc.securityGroup,
      repository: ecr.repository,
      imageTag: props.imageTag,
    });
  }
}

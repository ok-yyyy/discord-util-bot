import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export type EcsProps = cdk.StackProps & {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly repository: ecr.IRepository;
  readonly imageTag: string;
};

export class Ecs extends Construct {
  constructor(scope: Construct, id: string, props: EcsProps) {
    super(scope, id);

    // tokenをParameter Storeから参照
    const botToken = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'DiscordBotToken', {
      parameterName: '/discord-util-bot/token',
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: 'discord-util-bot-cluster',
      vpc: props.vpc,
      enableFargateCapacityProviders: true,
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: '/ecs/discord-util-bot',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_MONTH,
    });
    const logDriver = new ecs.AwsLogDriver({
      logGroup,
      streamPrefix: 'container',
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
      },
    });
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, props.imageTag),
      secrets: {
        DISCORD_BOT_TOKEN: ecs.Secret.fromSsmParameter(botToken),
      },
      logging: logDriver,
    });

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      securityGroups: [props.securityGroup],
      taskDefinitionRevision: ecs.TaskDefinitionRevision.LATEST,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1,
        },
      ],
    });
  }
}

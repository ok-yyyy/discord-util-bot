import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Vpc extends Construct {
  public readonly vpc: ec2.IVpc;
  public readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: 'discord-util-bot-vpc',
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public-1',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      securityGroupName: 'discord-util-bot-sg',
      vpc: this.vpc,
      allowAllOutbound: true,
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import { DockerImageName, ECRDeployment } from "cdk-ecr-deployment";
import { Construct } from 'constructs';
import path from "node:path";

export type EcrProps = cdk.StackProps & {
  readonly imageTag: string;
};

export class Ecr extends Construct {
  public readonly repository: ecr.IRepository;

  constructor(scope: Construct, id: string, props: EcrProps) {
    super(scope, id);

    this.repository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'discord-util-bot',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      lifecycleRules: [
        {
          maxImageCount: 10,
          tagStatus: ecr.TagStatus.ANY,
        },
      ],
    });

    const image = new ecr_assets.DockerImageAsset(this, 'Image', {
      directory: path.join(__dirname, '..', '..', '..'),
      platform: ecr_assets.Platform.LINUX_ARM64,
      ignoreMode: cdk.IgnoreMode.DOCKER,
    });

    new ECRDeployment(this, 'DeployImage', {
      src: new DockerImageName(image.imageUri),
      dest: new DockerImageName(`${this.repository.repositoryUri}:${props.imageTag}`),
    });
  }
}

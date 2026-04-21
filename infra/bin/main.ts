#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DiscordUtilBotStack } from '../lib/discord-util-bot-stack';

const app = new cdk.App();
new DiscordUtilBotStack(app, 'DiscordUtilBotStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  imageTag: app.node.tryGetContext('imageTag') || 'latest',
});

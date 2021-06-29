import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc } from '@aws-cdk/aws-ec2';
import { Logger } from 'tslog';
import { Key } from '@aws-cdk/aws-kms';
import { ISecret } from '@aws-cdk/aws-secretsmanager';
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';

export interface DatabaseStackProps extends cdk.StackProps {
  Vpc?: IVpc,
  serverlessClusterArn?: string,
}

export class DatabaseStack extends cdk.Stack {
  public readonly ServerlessClusterArn: string;
  public readonly Vpc: IVpc;
  public readonly dBCredentialsSecretArn?: string;
  constructor(scope: cdk.Construct, id: string, props?: DatabaseStackProps) {
    super(scope, id, props);
    const log = new Logger();
    
    const vpc = new ec2.Vpc(this, 'vpc', {
        cidr: "10.0.0.0/16"
    })

    const clusterKey = new Key(this, 'auroraClusterKey', {
      enableKeyRotation: true,
      enabled: true,
      description: "Key for Aurora serverless storage encryption",
    });
    
    //Aurora PostgreSQL 10.14 for Aurora Serverless v1 DB clusters
    log.info('Create Aurora Serverless Cluster');
    const serverlessCluster = new rds.ServerlessCluster(this, 'DatabaseClusterServerless', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_10_14 }),
      credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
      defaultDatabaseName: 'bachelorarbeit_aurora_serverless_database',
      enableDataApi: true,
      storageEncryptionKey: clusterKey,
      vpc: vpc,
      deletionProtection: false,
      scaling: {
        minCapacity: rds.AuroraCapacityUnit.ACU_2,
        maxCapacity: rds.AuroraCapacityUnit.ACU_4,
      }
    });
    this.ServerlessClusterArn = serverlessCluster.clusterArn;
    this.Vpc = vpc;
    this.dBCredentialsSecretArn = serverlessCluster.secret?.secretArn;
  }
}

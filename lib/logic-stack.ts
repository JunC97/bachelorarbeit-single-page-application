import { Duration, Construct } from '@aws-cdk/core';
import * as cdk from '@aws-cdk/core';
import { IVpc } from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import { Logger } from 'tslog';
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import { Function, Tracing, Runtime, Code, InlineCode } from '@aws-cdk/aws-lambda';

export interface LogicStackProps extends cdk.StackProps {
  vpc: IVpc,
  serverlessClusterArn: string,
  dBCredentialsSecretArn?: string,
  lambda_code_bucket_arn: string,
}

export class LogicStack extends cdk.Stack {
  public readonly functionArn: string;
  readonly DatabaseAPILambda: Function;
  constructor(scope: cdk.Construct, id: string, props: LogicStackProps) {
    super(scope, id, props);
    
    var dBCredentialsSecretArn = "";
    if(props.dBCredentialsSecretArn != undefined){
      dBCredentialsSecretArn = props.dBCredentialsSecretArn;
    }else {
      dBCredentialsSecretArn = ""
    }
    
    const lambda_code_bucket = s3.Bucket.fromBucketArn(this, 'spa-bucket', props.lambda_code_bucket_arn);
    
    const databaseAPILambdaExecutionRole = new Role(this, 'databaseAPILambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'),
      ]
    });
    
    const databaseAPILambda = new Function(this, 'databaseAPILambda', {
      runtime: Runtime.NODEJS_14_X,
      functionName: 'bachelorarbeit-database-api-lambda',
      description: 'This Lambda function manages the API calls directed at the Aurora serverless database',
      memorySize: 512,
      timeout: Duration.seconds(120),
      tracing: Tracing.ACTIVE,
      handler: 'ApiLambda.handler',
      code: Code.fromBucket(lambda_code_bucket, 'lambda/code/apiLambdaCode.zip'),
      role: databaseAPILambdaExecutionRole,
      environment: {
        "dbClusterArn": props.serverlessClusterArn,
        "serverlessClusterSecretArn": dBCredentialsSecretArn
      },
      vpc: props.vpc
    });
    databaseAPILambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      ),
    );

    databaseAPILambdaExecutionRole.attachInlinePolicy(new Policy(this, "bachelorarbeit-database-api-lambda-exceution-role-RDS-policy", {
      policyName: "bachelorarbeit-database-api-lambda-exceution-role",
      statements: [
        new PolicyStatement({
          actions: [
            's3:GetObject',
            's3:GetObjectACL',
            's3:PutObject',
            'ec2:CreateNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DeleteNetworkInterface',
            'ec2:DescribeInstances',
            'ec2:AttachNetworkInterface',
            'ssm:*',
            'kms:*'
          ],
          effect: Effect.ALLOW,
          resources: ['*']
        }),
        new PolicyStatement({
          actions: [
            'rds:*',
          ],
          effect: Effect.ALLOW,
          resources: [props.serverlessClusterArn]
        })
      ]
    }));


    databaseAPILambdaExecutionRole.attachInlinePolicy(new Policy(this, "bachelorarbeit-database-api-lambda-exceution-role-Log-policy", {
      policyName: "bachelorarbeit-database-api-lambda-exceution-role-Log-policy",
      statements: [new PolicyStatement({
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ],
        effect: Effect.ALLOW,
        resources: [`arn:aws:logs:${this.region}:${this.account}:log-group:/*ServiceLambda*`]
      })]
    }));
    this.functionArn = databaseAPILambda.functionArn;
    this.DatabaseAPILambda = databaseAPILambda;
    
  }
}

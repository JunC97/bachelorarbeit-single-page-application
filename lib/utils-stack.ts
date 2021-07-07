import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'
import * as s3deploy from '@aws-cdk/aws-s3-deployment';

export class UtilsStack extends cdk.Stack {
  public readonly lambda_code_bucket_arn: string;
  public readonly lambda_code_bucket: s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda_code_bucket = new s3.Bucket(this, 'lambda-code-bucket', {
        bucketName: 'bachelorarbeit-lambda-code-bucket',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
    });
    
    new s3deploy.BucketDeployment(this, 'deploy-single-page-application', {
      sources: [s3deploy.Source.asset('./code')],
      destinationBucket: lambda_code_bucket,
      destinationKeyPrefix: 'lambda/code' // optional prefix in destination bucket
    });
    this.lambda_code_bucket = lambda_code_bucket;
    this.lambda_code_bucket_arn = lambda_code_bucket.bucketArn;
  }
  
}

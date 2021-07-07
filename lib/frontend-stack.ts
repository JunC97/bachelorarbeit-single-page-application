import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import { CloudFrontWebDistribution, CloudFrontAllowedMethods, CloudFrontAllowedCachedMethods, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront'
import { ArnPrincipal, Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as kms from '@aws-cdk/aws-kms';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as iam from '@aws-cdk/aws-iam'

export class FrontendStack extends cdk.Stack {
  public readonly spa_bucket_arn: string;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
        
    const spa_bucket = new s3.Bucket(this, 'single-page-application-bucket', {
        bucketName: 'bachelorarbeit-single-page-application-bucket',
        websiteIndexDocument: 'index.html',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
    });
    const oai = new OriginAccessIdentity(this, 'bachelorarbeit-origin-identity-provider', {
              comment: 'bachelorarbeit-origin-identity-provider',
    });
    spa_bucket.grantPutAcl(oai);
    spa_bucket.grantPut(oai);
    spa_bucket.grantReadWrite(oai);
    
    spa_bucket.addToResourcePolicy(
      new PolicyStatement({
        resources: [
          spa_bucket.bucketArn
        ],
        actions: ["s3:*"],
        principals: [new ArnPrincipal(`arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oai.originAccessIdentityName}`)]
      })
    );
    
    const s3BucketDeployment = new Role(this, 'frontendS3Role', {
      assumedBy: new ServicePrincipal('s3.amazonaws.com'),
    });
    
    new s3deploy.BucketDeployment(this, 'deploy-single-page-application', {
      sources: [s3deploy.Source.asset('./code')],
      destinationBucket: spa_bucket
      //destinationKeyPrefix: 'spa' // optional prefix in destination bucket
    });
    
    //// Creates a distribution for a S3 bucket.
    //const myBucket = new s3.Bucket(this, 'myBucket');
      
   s3BucketDeployment.attachInlinePolicy(new Policy(this, "bachelorarbeit-frontend-s3-role-policy", {
      policyName: "bachelorarbeit-frontend-s3-role",
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
          resources: [spa_bucket.bucketArn]
        }),
        new PolicyStatement({
          actions: [
            's3:*',
          ],
          effect: Effect.ALLOW,
          resources: [spa_bucket.bucketArn]
        })
      ]
    }));
//
    spa_bucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:*'],
      resources: [spa_bucket.bucketArn],
      principals: [s3BucketDeployment]
    }));
    
    
    //spa_bucket.grantReadWrite(oia);
    
    //CREATE CLOUDFRONT
    const distribution = new CloudFrontWebDistribution(this, 'bachelorarbeit-spa-cf-distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: spa_bucket,
            originAccessIdentity: oai
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ],
      
      //comment: "Bachelorarbeit - Cloudfront Distribution of Single Page Application",
    });
    this.spa_bucket_arn = spa_bucket.bucketArn;
  }
}

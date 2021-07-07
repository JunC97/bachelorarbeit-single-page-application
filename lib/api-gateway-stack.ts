import * as cdk from '@aws-cdk/core';
import { Construct, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import { Effect, IRole, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Function } from '@aws-cdk/aws-lambda';
import { IResource, MockIntegration, EndpointType, ResponseType, Stage, LogGroupLogDestination, Deployment, MethodLoggingLevel, DomainName, SecurityPolicy, BasePathMapping, RestApi, IRestApi, LambdaIntegration, AuthorizationType, RequestAuthorizer, AwsIntegration, IdentitySource, PassthroughBehavior, RequestValidator, AccessLogFormat, JsonSchemaVersion, JsonSchemaType } from '@aws-cdk/aws-apigateway';
import { Logger } from 'tslog';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Duration } from '@aws-cdk/core';
import { IVpc, IVpcEndpoint } from '@aws-cdk/aws-ec2';
import { StringParameter} from '@aws-cdk/aws-ssm';
import * as lambda from '@aws-cdk/aws-lambda';

export interface ApiGatewayStackProps extends cdk.StackProps {
  functionArn: string,
  DatabaseAPILambda: Function
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);
    
    //VARIABLES
    const functionArn = props.functionArn;
    const allowedOrigins = ['http://localhost:3000'];
    //const isProduction = props.ProjectParameter.Stage == 'prod';
    //if (!isProduction) { allowedOrigins.push(`http://localhost:3000`); }
    
    const binaryMediaTypes: string[] = [
      'application/javascript',
      'text/css',
      'text/html',
      'binary/octet-stream',
      'application/octet-stream',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'image/vnd.microsoft.icon',
      'image/x-icon',
      'application/font-woff2',
      'application/font-woff',
      'font/woff',
      'font/woff2'
    ];
    
    //API-GATEWAY
    const api = new apigateway.RestApi(this, 'bachelorarbeit-spa-api', {
      description: "bachelorarbeit-spa-api",
      cloudWatchRole: true,
      restApiName: "bachelorarbeit-spa-api",
      deploy: false,
      binaryMediaTypes: binaryMediaTypes,
      endpointTypes: [EndpointType.REGIONAL]
    });
    //---------------------------------------------------------------
    
    /* # MODELS # */
    //
    //REQUEST MODEL
    const requestModel = api.addModel('sqlStatementModel', {
      contentType: 'application/json',
      modelName: 'sqlStatementModel',
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: 'sqlStatementModel',
        type: JsonSchemaType.OBJECT,
        properties: {
          title: { type: JsonSchemaType.STRING },
          notes: { type: JsonSchemaType.STRING },
          condition: { type: JsonSchemaType.STRING }
        }
      }
    });
    //---------------------------------------------------------------
    
    /* # STAGE # */
    //
    //REQUEST MODEL
    const projectApiStage = new Stage(this, 'ProjectApiStage', {
      accessLogDestination: new LogGroupLogDestination(
        new LogGroup(this, 'ProjectApiLogGroup',
          {
            logGroupName: `API-Gateway-Execution-Logs_${api.restApiId}/dev`,
            removalPolicy: RemovalPolicy.DESTROY
          })
      ),
      accessLogFormat: AccessLogFormat.custom(
        '{ "stage" : "$context.stage", "request_id" : "$context.requestId", "resource_path" : "$context.resourcePath", "user" : "$context.identity.user" }'
      ),
      methodOptions: {
        // note: 1st /* is path parameter, 2nd /* is the http method parameter (ref main.yaml, line 471)
        '/*/*': {
          dataTraceEnabled: true,
          loggingLevel: MethodLoggingLevel.INFO
        }
      },
      tracingEnabled: true,
      stageName: "dev",
      deployment: new Deployment(this, `ProjectApiDeploymentBachelor`, {
        api: api
      })
    });
    api.deploymentStage = projectApiStage;
    //---------------------------------------------------------------
    
    /* # EXECUTION ROLE # */
    const projectApiExecutionRole = new Role(this, 'ProjectApiExecutionRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        APIGWLambdaPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['lambda:Invoke*'],
              effect: Effect.ALLOW,
              resources: [
                props.functionArn,
              ]
            })
          ]
        })
      }
    });
    //---------------------------------------------------------------
    
    /* # INTEGRATION # */
    const lambdaServiceIntegration = new LambdaIntegration(props.DatabaseAPILambda, {
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    });
    //---------------------------------------------------------------
    
    /* # RESOURCES # */
    //
    //TITLE API
    const root = api.root;
    const title = root.addResource('titel');
    const create_title = title.addResource('create');
    const delete_title = title.addResource('delete');
    const find_title   = title.addResource('find');
    //
    //NOTES API
    const notes = root.addResource('notes');
    const create_notes = notes.addResource('create');
    const delete_notes = notes.addResource('delete');
    const find_notes   = notes.addResource('find');
    //---------------------------------------------------------------
    
    /* # METHODS # */
    /*
    ###############
    ## TITLE API ##
    ###############
    */
    create_title.addMethod('POST', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'create_title', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestParameters: {
        'method.request.path.itemId': true
      },
      requestModels: {
        'application/json': requestModel
      }
    });
    delete_title.addMethod ('DELETE', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'delete_title', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestModels: {
        'application/json': requestModel
      }
    });
    find_title.addMethod('GET', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'get_title', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestModels: {
        'application/json': requestModel
      }
    });
    
    //---------------------------------------------------------------
    /*
    ###############
    ## NOTES API ##
    ###############
    */
    create_notes.addMethod('POST', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'create_notes', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestModels: {
        'application/json': requestModel
      }
    });
    delete_notes.addMethod('DELETE', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'delete_notes', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestModels: {
        'application/json': requestModel
      }
    });
    find_notes.addMethod('GET', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'get_notes', functionArn),{
      requestTemplates: { 'application/json': '{"statusCode": 200}' },
      credentialsRole: projectApiExecutionRole
    }), {
      requestModels: {
        'application/json': requestModel
      }
    });
    //---------------------------------------------------------------
    /* # CORS # */
    addCorsOptions(title, allowedOrigins);
    addCorsOptions(root, allowedOrigins);
    addCorsOptions(create_title, allowedOrigins);
    addCorsOptions(delete_title, allowedOrigins);
    addCorsOptions(find_title, allowedOrigins);
    addCorsOptions(notes, allowedOrigins);
    addCorsOptions(create_notes, allowedOrigins);
    addCorsOptions(delete_notes, allowedOrigins);
    addCorsOptions(find_notes, allowedOrigins);    
    
    
    function addCorsOptions(apiResource: IResource, origins : string[] ) {
      apiResource.addMethod('OPTIONS', new MockIntegration({
        integrationResponses: [{
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'" + origins[0] + "'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        }],
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: {
          "application/json": "{\"statusCode\": 200}"
        },
      }), {
        methodResponses: [{
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },  
        }]
      })
    }
    //---------------------------------------------------------------
    
  }
}

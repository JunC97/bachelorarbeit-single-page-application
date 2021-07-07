import * as cdk from '@aws-cdk/core';
import { Construct, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import { Effect, IRole, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Function } from '@aws-cdk/aws-lambda';
import { EndpointType, ResponseType, Stage, LogGroupLogDestination, Deployment, MethodLoggingLevel, DomainName, SecurityPolicy, BasePathMapping, RestApi, IRestApi, LambdaIntegration, AuthorizationType, RequestAuthorizer, AwsIntegration, IdentitySource, PassthroughBehavior, RequestValidator, AccessLogFormat, JsonSchemaVersion, JsonSchemaType } from '@aws-cdk/aws-apigateway';
import { Logger } from 'tslog';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Duration } from '@aws-cdk/core';
import { IVpc, IVpcEndpoint } from '@aws-cdk/aws-ec2';
import { StringParameter} from '@aws-cdk/aws-ssm';
import * as lambda from '@aws-cdk/aws-lambda';

export interface ApiGatewayStackProps extends cdk.StackProps {
  functionArn: string,
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);
    
    //VARIABLES
    const functionArn = props.functionArn;
    
    //API-GATEWAY
    const api = new apigateway.RestApi(this, 'bachelorarbeit-spa-api');
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
          rows: { type: JsonSchemaType.ARRAY, items: { type: JsonSchemaType.STRING }},
          values: {type: JsonSchemaType.ARRAY, items: { type: JsonSchemaType.STRING }},
          condition: { type: JsonSchemaType.STRING },
          treeTable: { type: JsonSchemaType.STRING }
        }
      }
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
    create_title.addMethod('POST', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'create_title', functionArn)), {
      //authorizationType: AuthorizationType.CUSTOM,
      //authorizer: authorizer,
      //operationName: 'UpdateItem',
      //requestValidator: requestValidator,
      requestParameters: {
        'method.request.path.itemId': true
      },
      requestModels: {
        'application/json': requestModel
      }
    });
    delete_title.addMethod ('DELETE', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'delete_title', functionArn)), {
      requestModels: {
        'application/json': requestModel
      }
    });
    find_title.addMethod('GET', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'get_title', functionArn)), {
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
    create_notes.addMethod('POST', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'create_notes', functionArn)), {
      requestModels: {
        'application/json': requestModel
      }
    });
    delete_notes.addMethod('DELETE', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'delete_notes', functionArn)), {
      requestModels: {
        'application/json': requestModel
      }
    });
    find_notes.addMethod('GET', new LambdaIntegration(lambda.Function.fromFunctionArn(this, 'get_notes', functionArn)), {
      requestModels: {
        'application/json': requestModel
      }
    });
    //---------------------------------------------------------------
  }
}

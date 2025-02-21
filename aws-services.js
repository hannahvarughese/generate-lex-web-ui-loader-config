import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
  ListUserPoolClientsCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  CognitoIdentityClient,
  ListIdentityPoolsCommand,
} from "@aws-sdk/client-cognito-identity";
import { extractInfoFromUrl } from "./utils.js";
import { ConnectClient, ListInstancesCommand, ListContactFlowsCommand } from "@aws-sdk/client-connect";
import { APIGatewayClient, GetRestApisCommand } from "@aws-sdk/client-api-gateway";
import { connectInfo } from "./constants.js";


export const getStackOutput = async (stackName) => {
  try {
		const cloudFormationClient = new CloudFormationClient({
			region: process.env.AWS_REGION,
		});
    const command = new DescribeStacksCommand({ StackName: stackName });
    const response = await cloudFormationClient.send(command);

    const outputs = response.Stacks[0]?.Outputs;
    // console.log("outputs =>", outputs);

    // return response
    return outputs;
    // return outputs;
  } catch (error) {
    console.error(`Error fetching ${outputKey} from CloudFormation:`, error);
    throw new Error(`Error fetching ${outputKey} from CloudFormation`)
  }
};

export const getCognitoDetails = async (userPoolUrl, botStack) => {
  try {
    // Extract region and userPoolId from the URL
    const { awsRegion, appUserPoolIdentityProvider } = extractInfoFromUrl(userPoolUrl);

    console.log(`Extracted Region: ${awsRegion}`);
    console.log(`Extracted User Pool ID: ${appUserPoolIdentityProvider}`);

    // Initialize AWS SDK client
    const client = new CognitoIdentityProviderClient({ region: awsRegion });

    // Fetch User Pool Details
    const userPoolCommand = new DescribeUserPoolCommand({
      UserPoolId: appUserPoolIdentityProvider,
    });
    const userPoolResponse = await client.send(userPoolCommand);
    // console.log("userPoolResponse =>", JSON.stringify(userPoolResponse));
    console.log("USer POOL =>", userPoolResponse.UserPool);
    const userPoolName = userPoolResponse.UserPool?.Name || "N/A";
    const rawDomain = userPoolResponse.UserPool?.Domain || "N/A";

    console.log(`User Pool Name: ${userPoolName}`);

    // Fetch User Pool Client ID
    const clientCommand = new ListUserPoolClientsCommand({
      UserPoolId: appUserPoolIdentityProvider,
    });
    const clientResponse = await client.send(clientCommand);
    console.log("clientResponse =>", clientResponse);
    const appUserPoolClientId =
      clientResponse.UserPoolClients?.find(
        (poolClient) =>
          poolClient.ClientName ===
          `UserPool-${botStack}-client`
      )?.ClientId || "N/A";

    console.log(`User Pool Client ID: ${appUserPoolClientId}`);

    const identityClient = new CognitoIdentityClient({ region: awsRegion });
    const identityCommand = new ListIdentityPoolsCommand({ MaxResults: 60 }); // Fetch first 10 pools
    const identityResponse = await identityClient.send(identityCommand);
    const pools = identityResponse.IdentityPools;
    console.log("pools =>", pools.length);
    const poolId = pools?.find(
      (pool) =>
        pool.IdentityPoolName === `QnaBotIdPool-${botStack}`
    )?.IdentityPoolId;
    console.log("poolId -->", poolId);

    console.log(`Raw Domain from AWS: ${rawDomain}`);

    // Construct the full domain URL
    let appDomainName = "N/A";
    if (rawDomain !== "N/A") {
      appDomainName = `https://${rawDomain}.auth.${awsRegion}.amazoncognito.com`;
    }

    console.log(`Full Cognito Hosted Domain URL: ${appDomainName}`);

    return {
      poolId,
      appUserPoolClientId,
      appUserPoolName: userPoolName,
      appUserPoolIdentityProvider,
      appDomainName,
      aws_cognito_region: awsRegion,
      region: awsRegion,
    };
  } catch (error) {
    console.error("Error fetching Cognito details:", error);
    throw new Error('Error occurred during fetching of Cognito details');
  }
};

export const getConnectDetails = async() => {
  const connect = {...connectInfo}
  const connectClient = new ConnectClient({ region: process.env.AWS_REGION });
  const apiGatewayClient = new APIGatewayClient({ region: process.env.AWS_REGION });
  try {
    const instanceResponse = await connectClient.send(new ListInstancesCommand({}));
    connect.instanceId =  instanceResponse?.InstanceSummaryList?.[0]?.Id || '';
    // const contactFlowResponse = await connectClient.send(new ListContactFlowsCommand({ InstanceId: instanceId }));
    // const contactFlowId = contactFlowResponse?.ContactFlowSummaryList?.[0]?.Id;
    // const apiListResponse = await apiGatewayClient.send(new GetRestApisCommand({}));
    // const apiList = JSON.stringify(apiListResponse?.items);
    return connect;
  } catch (error) {
    console.error("Error fetching Connect Instance ID:", error);
    return null;
  }
}
import express from "express";
import dotenv from "dotenv";
import { getLexDetails, findConfigValue, updateValues } from "./utils.js";
import { getStackOutput, getCognitoDetails, getConnectDetails } from "./aws-services.js";
import { fetchDataFromDB, updateDataToDB } from "./composer-service.js";
import { ui, iframe, polly, recorder } from "./constants.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// API Endpoint to generate lex-web-ui-loader-config.json
app.post("/add-bot-config", async (req, res) => {
  try {    
    const region = process.env.AWS_REGION;
    const {botStack, customer, platform,  stage, title } = req.body;
    const stackOutputs = await getStackOutput(botStack);
    console.log("stackOutputs =>", stackOutputs);
    // Fetch values from CloudFormation Outputs
    const userPoolUrl = findConfigValue(stackOutputs, "UserPoolURL");
    console.log("userPoolUrl =>", userPoolUrl);
    const lex = getLexDetails(stackOutputs, region);
    console.log("lexInfo =>", lex);
    const cognitoInfo = await getCognitoDetails(userPoolUrl, botStack);
    console.log("cognitoInfo =>", cognitoInfo);
    const connect = await getConnectDetails();
    ui.pageTitle = botStack;
    ui.toolbarTitle = title ? title : ui.toolbarTitle;
    console.log("connect =>", JSON.stringify(connect));
    const config = {
      region,
      lex,
      cognito: cognitoInfo,
      connect,
      ui,
      polly,
      recorder,
      iframe
    };
    console.log("config=>", config)
    const dbData = await fetchDataFromDB(customer, stage, platform);
    console.log('dbData before update =>',JSON.stringify(dbData));
    if(dbData.message === 'Unauthorized') {
      throw new Error('Token is not valid');
    }
    const updatedDBData = updateValues(dbData, config);
    console.log('dbData after update =>',updatedDBData);
    const updateResponse = await updateDataToDB(customer, stage, platform, updatedDBData);
    console.log("updateResponse =>", updateResponse);
    if(updateResponse !== 1) {
      throw new Error('Error occurred during updation')
    }
    res.json({message: "Config updated successfully to database"});
    // res.json(config)
  } catch (error) {
    console.error("Error generating configuration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

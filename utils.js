import { staticLexConfig } from "./constants.js";

export const findConfigValue = (outputs, outputKey) => {
  const outputValue = outputs?.find(
    (o) => o.OutputKey === outputKey
  )?.OutputValue;

  return outputValue || null;
};

export const extractInfoFromUrl = (userPoolUrl) => {
  const match = userPoolUrl.match(
    /region=([\w-]+).*?#\/pool\/([\w-]+_\w+)\/details/
  );
  if (!match) {
    throw new Error("Invalid User Pool URL format.");
  }
  return { awsRegion: match[1], appUserPoolIdentityProvider: match[2] };
};

export const parseJSONStream = async (response) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  // Parse the accumulated string as JSON
  try {
    return JSON.parse(result);
  } catch (err) {
    console.log('Error parsing JSON:', err);
    throw err;
  }
};

export const updateValues = (values, config) => {
  // Ensure key1, key2, and key3 exist in dataObj
  values.lexWebUi = values.lexWebUi ?? {};
  values.lexWebUi.config = values.lexWebUi.config ?? {};
  values.lexWebUi.config.en = values.lexWebUi.config.en ?? {};

  // Update key3 with the new value
  Object.assign(values.lexWebUi.config.en, config);

  return values; // Return updated object (optional)
}

export const getLexDetails = (stackOutputs, region) => {
  const v2BotId = findConfigValue(stackOutputs, "LexV2BotId");
  const v2BotAliasId = findConfigValue(stackOutputs, "LexV2BotAliasId");
  const v2BotLocaleId = findConfigValue(stackOutputs, "LexV2BotLocaleIds");
  const botName = findConfigValue(stackOutputs, "LexV2BotName");
  const botAlias = findConfigValue(stackOutputs, "LexV2BotAlias");
  return { v2BotId, v2BotAliasId, v2BotLocaleId, botName, botAlias, ...staticLexConfig, region }
}


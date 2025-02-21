import { parseJSONStream } from "./utils.js";

export const fetchDataFromDB = async (customer,stage, platform) => {
  const url = `https://composer-api-options.devicebits.com/${stage}/values/${platform}/${customer}`;
  console.log("URL =>", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.COMPOSER_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await parseJSONStream(response);
    console.log("GET API response =>", data);
    return data;
  } catch (e) {
    console.error("Unable to fetch config from db", e);
    throw new Error("Unable to fetch config from db")
  }
};

export const updateDataToDB = async (customer, stage, platform, values) => {
  const url = `https://composer-api-options.devicebits.com/${stage}/values/${platform}/${customer}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.COMPOSER_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    console.log("PUT API response =>", response);
    const parsedResponse =  await parseJSONStream(response);
    return parsedResponse;
  } catch (e) {
    console.error("Unable to update values to db", e);
    throw new Error("Unable to update values to db")
  }
};

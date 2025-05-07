# generate-lex-web-ui-loader-config
This project is created to facilitate automatic creation of `lex-web-ui-loader-config.json` which is used to load QnA Bot. After the config is created it will be saved to database based on customer, platform(AgentAI, Selfservice) and stage(dev, prod).

## Steps to run
1. Clone the repository
2. Run `npm install`
3. Update `.env` with `COMPOSER_API_TOKEN`. You can get the token by
    a. Prod - Login to (composer)[https://composer.devicebits.com].
    b. Staging - Login to (composer-staging)[https://composer-staging.devicebits.com] 
    c. Right click on the browser -> Inspect -> Application -> Local Storage
    d. Copy the `id_token` from the local storage and paste it as value for `COMPOSER_API_TOKEN` in `.env`
4. Run the project using command `node server.js`.
5. The application will run on port 3000
6. Open Postman or any other API testing tool.
7. Choose HTTP method to be POST and paste the URL http://localhost:3000/add-bot-config
8. Add body with the following structure
        ``` {
                "botStack": "llmbot", // Name of the Qna Bot stack created on AWS
                "customer": "trial-fe-qa-env", // Name of the customer to which config needs to be added
                "platform": "ca", // Values can be ca for Agent AI , acad for Selfservice
                "stage": "dev", // dev for updating to staging, prod for updating to prod
                "title": "LLMBot" // title to be displayed in the chat window
            }```
9. After running the API, you will get success response (status: 200)
        ```{
                message: "Config updated successfully to database"
            }```
    or, if there is any error (status: 500)
        ```{
                 error: "Internal Server Error"
            }```

## Note

If you want to just generate the configuration and **not insert  to database** comment out lines from 42 - 54, and uncomment line no 55. Then rerun the application
using `node server.js` and call the API as described in **Steps to run** (7, 8). It will return the configuration in the response.

The generated config will have some static values along with dynamic values. The `ui`, `polly`, `recorder`, `iframe` will have static default values. The `instanceId` in `connect` will be dynamic and other values will be static. The `lex` and `cognito` section will have dynamic values except for `boolean` and `text` fields.

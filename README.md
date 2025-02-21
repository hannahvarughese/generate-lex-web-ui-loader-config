# generate-lex-web-ui-loader-config
This project is created to facilitate automatic creation of `lex-web-ui-loader-config.json` which is used to load QnA Bot. After the config is created, it will be saved to database based on customer, platform(AgentAI, Selfservice) and stage(dev, prod).

## Steps to run
1. Clone the repository
2. Run `npm install`
3. Update `.env` with `COMPOSER_API_TOKEN`. You can get the token by
   - Prod - Login to [composer](https://composer.devicebits.com).
   - Staging - Login to [composer-staging](https://composer-staging.devicebits.com) 
   - Right click on the browser -> Inspect -> Application -> Local Storage
   - Copy the `id_token` from the local storage and paste it as value for `COMPOSER_API_TOKEN` in `.env`
4. Run the project using command `node server.js`.
5. The application will run on port 3000
6. Open Postman or any other API testing tool.
7. Choose HTTP method to be POST and paste the URL http://localhost:3000/add-bot-config
8. Add body with the following structure
   ```jsonc
   {
        botStack: "llmbot", // Name of the Qna Bot stack created on AWS
        customer: "trial-fe-qa-env", // Name of the customer to which config needs to be added
        platform: "ca", // Values can be ca for Agent AI , acad for Selfservice
        stage: "dev" // dev for updating to staging, prod for updating to prod
   }
   ```
10. After running the API, you will get success response (status: 200)
    ```jsonc
    {
        message: "Config updated successfully to database"
    }
    ```
    or, if there is any error (status: 500)
    ```jsonc
    {
        error: "Internal Server Error"
    }
    ```

## Note
The generated config will have some static values along with dynamic values. The `ui`, `polly`, `recorder`, `iframe` will have static default values. The `instanceId` in `connect` will be dynamic and other values will be static. The `lex` and `cognito` section will have dynamic values except for `boolean` and `text` fields. If you want to update the fields, you can 
1. Login to [composer](https://composer.devicebits.com)/ [composer-staging](https://composer-staging.devicebits.com) 
2. Select `Administration` -> `Customer Options` -> Choose `Platform` (Ex: AgentAI) -> Choose `Customer` (Ex: trial) -> Choose `LexWebUi` from the categories and edit


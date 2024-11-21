///<reference types="cypress" />

const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  projectId: "1pixnu",
  e2e: {
    env: {
      email: "ariel@getfrontrunner.com",
    },
    setupNodeEvents(on, config) {
      config.env.token_url = process.env.TOKEN_URL;
      config.env.api_url = process.env.API_URL;
      config.env.api_key = process.env.API_KEY;
      config.env.client_id = process.env.CLIENT_ID;
      config.env.client_secret = process.env.CLIENT_SECRET;
      config.env.walletAddress = process.env.WALLET_ADDRESS;
      config.env.tradingaccountid = process.env.TRADING_ACCOUNT_ID;
      config.env.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
      config.env.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      config.env.sessionToken = process.env.SESSION_TOKEN;
      config.env.ci = process.env.CI;

      require("cypress-localstorage-commands/plugin")(on, config);

      return config;
    },
  },
});

# Cypress GraphQL API Automation project

## Getting Started

- Clone the project from the following url: https://gitlab.com/getfrontrunner/qa-api-automation
- Run 'yarn' command to install all the devDependencies from the package.json file
- Create an .env file into your root folder
- Get the keys and values for your .env file from this url: https://vault.bitwarden.com/#/vault?collectionId=d4f621bf-6a43-4608-88c9-af0800cfe38a&itemId=b0306249-487a-4916-8564-af0b0134a34c
- You are all set!

## Overview

- This project has been created to prove the ability of Cypress to test GraphQL APIs
- The current set of suites and tests were used as part of the POC, we need more (and better) scenarios to increase our coverage and provide confidence to the development team

## Running test cases

Once you have your .env file with the appropriate data, you can start running the GraphQL test cases

There are three scripts in the package.json file that help you run Cypress tests using different approaches:

  1. Use `yarn run cy:open` to run test cases using Cypress runner (More visual approach)
      - Cypress runner allows you to pick test suites and 'watch' the execution of the tests in real time
      - The result of the execution of every test will be displayed in the test runner
      - No screenshots nor videos are provided at the end of the execution

  2. Use `yarn run cy:run` to run all the test cases in a headless mode locally
      - Every suite will be run in your IDE's terminal
      - You will be able to follow the results of the execution in the terminal
      - At the end of the execution you will get a summary with the results
      - A video will be recorded after every test (customizable)
      - A screenshot will be taken in case of errors/issues during the execution (customizable)

  3.  Use `yarn run cy:ci` to run all the test cases in a headless mode (same as cy:run) but instead of just running them locally, they will also run in Cypress Dashboard thanks to the key provided by Cypress
      
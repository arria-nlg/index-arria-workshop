# Index IBM/Arria Workshop

A node.js webapp to be used in the Arria workshop.

During this workshop users will learn how to assemble and deploy a web application using IBM Cloud APIs and Arria NLG Studio. You will build up an application that takes an investment portfolio and evaluates what the holdings are worth in the current market. This data is then used to produce a report using natural language generation.

Building this application will show you how to:

* Create financial APIs on IBM Cloud
* Build and deploy NLG Studio applications that generate text
* Load and retrieve data from the Investment Portfolio service
* Analyse the portfolio's value using the Instrument Analytics service
* Generate narratives from the portfolio data with your NLG Studio API
* Chain these API calls together to make a node web app
* Deploy the application on IBM Cloud 

# The Application
In this tutorial you will build a web application that looks like this:

<p align="center">
  <img width="800"  src="readme_images/application.png">
</p>

At the top of the screen you are able to select one of your investment portfolios. You can then use submit to analyse the portfolio and generate a report about it. The general workflow looks like this:

<p align="center">
  <img width="800"  src="readme_images/architecture.png">
</p>

The application is built around three main APIs:

## IBM Investment Portfolio
The IBM Investment Portfolio stores information about a user's investment portfolios, including how many holdings they have and in which companies.

## IBM Instrument Analytics
An API which takes in portfolio information and uses IBM Algorithmics pricing models to judge how much each holding is theoretically worth. This API supports all major asset classes, including equity, fixed income, forwards & futures, options, interest rate products, credit derivatives, indexes and structured products. Our application will use this analytics to value the holdings in the current financial market.
  
## Arria NLG Studio
Arria NLG Studio is a web application allowing users to build and deploy natural language generation systems. Studio can be used to produce reports for any vertical and follows a methodology that makes it easy to get started and natural to build up report complexity. We will use Studio to build an API that can describe the value of a portfolio. 

# Automatically Deploying the Application to IBM Cloud

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/robert-hodgson1/predictive-market-using-arria.git)

Be sure to [load investment portfolio](#5-load-investment-portfolio) before running the application.

# Manually Deploying the Application to IBM Cloud
Follow these steps to setup and run this pattern. The steps are described in detail below.

## Prerequisite
- [node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Steps
1. [Clone the repo](#1-clone-the-repo)
2. [Create Bluemix services](#2-create-bluemix-services)
3. [Sign up to Arria Studio and publish your API](#3-sign-up-to-Arria)
4. [Configure .env file](#4-configure-env-file)
5. [Load Investment Portfolio](#5-load-investment-portfolio)
6. [Run Application](#6-run-application)
7. [Deploy to IBM Cloud](#7-deploy-to-ibm-cloud)


## 1. Clone the repo

Clone the `Predict Market Using Arria repo` locally. In a terminal, run:

  `$ git clone https://github.com/XXXX/index-arria-workshop.git`


## 2. Create Bluemix services

Create the following services in IBM Cloud:

* [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
* [**Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/instrument-analytics)
* [**Arria Natural Language Generation APIs**](https://console.bluemix.net/catalog/services/natural-language-generation-apis)

<br>For the `Arria Natural Language Generation API` service, this is only needed if you are running the app in IBM Cloud. You will need to register go to step 3 to generate the url and token to place into the service.

## 3. Sign up to Arria

Sign up - load the template, pulbish the API - get the URL and token.
set the url and token in the service in bluemix??

## 4. Configure .env file

Create a `.env` file in the root directory of your clone of the project repository by copying the sample `.env.example` file using the following command:

  ```none
  cp .env.example .env
  ```

  **NOTE** Most files systems regard files with a "." at the front as hidden files.  If you are on a Windows system, you should be able to use either [GitBash](https://git-for-windows.github.io/) or [Xcopy](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true)

You will need to update the credentials with the Bluemix credentials for each of the services you created in [Step 2](#2-create-bluemix-services).

The `.env` file will look something like the following:

  ```none  
  # Investment Portfolio
  CRED_PORTFOLIO_USERID_W=
  CRED_PORTFOLIO_PWD_W=
  CRED_PORTFOLIO_USERID_R=
  CRED_PORTFOLIO_PWD_R=
  CRED_PORTFOLIO_URL=

  # Instrument Analytics
  CRED_INSTRUMENT_ANALYTICS_URL=
  CRED_INSTRUMENT_ANALYTICS_ACCESSTOKEN=

  # Arria Natural Language Generation
  CRED_ARRIA_NATURAL_LANGUAGE_GENERATION_URL=
  CRED_ARRIA_NATURAL_LANGUAGE_GENERATION_TOKEN=
  ```

## 4. Load Investment Portfolio

You will now need to create a portfolio in your Investment Portfolio service and create holdings for that portfolio. The `holdings.sample.json` file provides you with sample holdings for a portfolio.  You can run the `investmentPortfolio.js` script to load portfolio and holdings.  The credentials are retrieved from `.env` file so ensure that your Investment Portfolio credentials are filled as per the [last step](#3-configure-env-file).

To load a portfolio named `MyFixedIncomePortfolio`, first install dependencies and use the command-line with the script to create the portfolio:
```
npm install
node investmentPortfolio.js -l MyFixedIncomePortfolio
```

To load holdings from `holdings.sample.json` into `MyFixedIncomePortfolio`, run:
```
node investmentPortfolio.js -l MyFixedIncomePortfolio -h holdings.sample.json
```

Similarly you can view your portfolios by running:
```
node investmentPortfolio.js -g
```

and view holdings for portfolio:
```
node investmentPortfolio.js -g MyFixedIncomePortfolio
```


## 5. Run Application

cd into this project's root directory
+ Run `npm install` to install the app's dependencies
+ Run `node app.js`
+ Access the running app locally


## 6. Deploy to IBM Cloud

Edit the `manifest.yml` file in the folder that contains your code and replace with a unique name for your application. The name that you specify determines the application's URL, such as `your-application-name.mybluemix.net`. Additionally - update the service names so they match what you have in Bluemix. The relevant portion of the `manifest.yml` file looks like the following:

  ```none
  applications:
  - path: .
    memory: 256M
    instances: 1
    domain: mybluemix.net
    name: arria-predictive-market
    host: arria-predictive-market
    disk_quota: 256M
    buildpack: sdk-for-nodejs
    services:
    - Investment-Portfolio
    - Instrument-Analytics
    - Arria-NLG-1
  ```

Once the manfiest.yml file is configured, you can push to IBM Cloud. From your root directory login into cf:
```
cf login
```
And push the app to IBM Cloud:
```
cf push
```

# Troubleshooting

* To troubleshoot your Bluemix application, use the logs. To see the logs, run:

```bash
cf logs <application-name> --recent
```



# License

[Apache 2.0](LICENSE)

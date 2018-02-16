# Index IBM/Arria Workshop

During this workshop, you'll learn how to assemble and deploy a web application using IBM Cloud APIs and Arria NLG Studio. You'll build an application that takes an investment portfolio and evaluates what the holdings are worth in the current market. This data is then used to produce a report using natural language generation.

The workshop is broken into two halves:

* Setting Up the Application
* Expanding the Narrative

In the first part, you'll learn how to host the various services that make up the application. In the second part, you'll learn how you can expand the narrative using NLG Studio.  

When you have finished, you'll know how to:

- Create financial APIs on IBM Cloud
- Build and deploy NLG Studio applications that generate text
- Load and retrieve data from the Investment Portfolio service
- Analyse the portfolio's value using the Instrument Analytics service
- Generate narratives from the portfolio data with your NLG Studio API
- Chain these API calls together to make a node web app
- Deploy the application on IBM Cloud 

# The Application
In this tutorial you will build a web application that reports on the value of people's investment portfolios. An investment portfolio is a collection of stocks, options, and other holdings in various companies. These companies are referred to as the issuers of each holding. When we describe these issuers we tend to do so by business sector, for example, health care, IT, transport, and so on. 

The end application looks like this:

<p align="center">
  <img width="800"  src="readme_images/application.png">
</p>

At the top of the screen, a dropdown lets you select one of your investment portfolios. Then you click **Submit** to analyze the portfolio and generate a report about it. The general workflow looks like this:

<p align="center">
  <img width="800"  src="readme_images/architecture.png">
</p>

The application is built around three main APIs:

## IBM Investment Portfolio
The IBM Investment Portfolio service stores information about a user's investment portfolios, including how many holdings they have and in which companies. This service is able to catalogue changes in the portfolio over time, but in this demo we're just going to use the most recent data.

## IBM Instrument Analytics
The IBM Instrument Analytics service takes in portfolio information and uses IBM Algorithmics pricing models to judge how much each holding is theoretically worth. This API supports all major asset classes, including equity, fixed income, forwards and futures, options, interest rate products, credit derivatives, indexes, and structured products. Instrument Analytics can calculate a variety of factors about holdings. The application you're building will use this service to value the holdings in the current financial market.
  
## Arria NLG Studio
Arria NLG Studio is a web application used to build and deploy natural language generation systems. Studio can be used to produce reports for any vertical, and it follows a methodology that makes it easy to get started, then build up report complexity naturally. You'll use Studio to build an API that can describe the value of a portfolio. 

<!-- # Automatically Deploying the Application to IBM Cloud

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/robert-hodgson1/predictive-market-using-arria.git)

Be sure to [load investment portfolio](#5-load-investment-portfolio) before running the application. 
-->
# Workshop A :  Setting Up the Application
In this workshop, you'll set up a web application on the IBM Cloud that combines IBM Cloud Financial Services with an Arria NLG Studio project.

## Prerequisites
- [node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [an NLG Studio account](https://app.studio.arria.com)
- [an IBM Cloud developer account](https://www.ibm.com/cloud/)
- [IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html#getting-started)

## Steps
1. [Clone the Repo](#1-clone-the-repo)
2. [Try the Application](#2-try-the-application)
3. [Generate Text with NLG Studio](#3-generating-text-with-nlg-studio)
4. [Create IBM Cloud Services](#4-create-ibm-cloud-services)
5. [Configure an .env File](#5-configure-env-file)
6. [Load Investment Portfolios](#6-load-investment-portfolios)
7. [Run the Application Locally](#7-run-the-application-locally)
8. [Deploy to IBM Cloud](#8-deploy-to-ibm-cloud)


## 1. Clone the Repo

Clone the `index-arria-workshop` locally. In a terminal, run:
*TODO - location*

  `$ git clone https://github.com/arria-nlg/index-arria-workshop.git`


## 2. Try the Application

Before you get started, take a look at the end product you're going to build. We have hosted the application at:

https://demo-index-arria-app-wb.mybluemix.net/

Test how the application works with the different portfolios and see how the narrative changes with each one.

## 3. Generate Text with NLG Studio

To generate the language in the application you'll use Arria NLG Studio. This web-based development environment lets you write APIs that take in data and use it to produce narratives. First, you'll load in the Studio project behind the application. 

**Note:** NLG Studio is designed for Google Chrome. We strongly recommend using Chrome when building Studio applications. 

To begin, log in to NLG Studio at <https://app.studio.arria.com>. If you haven't signed up yet, click **Don't Have an Account** and follow the instructions. The validation email can take a few minutes to come through.

Rather than creating the whole project from scratch, you'll import a pre-built Studio project. The file to load is in the git repository at `studio/nlgStudioProject.json`. Click the **Import a Project** icon, which is next to the **New project** button. 

<p align="center">
  <img width="800"  src="readme_images/import_project.png">
</p>

<img width="81" align="left" src="readme_images/preview.png">

Once you have imported the project, click it to open it. 

The purpose of NLG Studio is to build an NLG application using scripts. This application can then be hosted on the Arria cloud, allowing you to post data to it and retrieve a corresponding narrative. 

When you open a project, you are taken to the Data view. This view shows sample data that you can use to test your application. To see how the system reacts using this data, try clicking **Preview** in the left toolbar. 

Preview generates a report using the sample data. The top of the window shows the data, and the bottom shows the output text. You can change the sample data, and the report will reflect your changes. Try changing the name of the portfolio (currently "Sample Portfolio") to something else, and preview the report. The first sentence should use your new name. 

The text is composed using a series of scripts. Click **Compose** in the left toolbar to go to the Compose view. You should see the `Main` script for your project. Whenever a narrative is generated, it is this Main script that runs. The scripts are written in ATL, Arria's Articulate Text Language. You'll learn about ATL and how to write it in the second workshop.

For now, all you need to know is that regular text in your script is included in your reports, while text enclosed with double square brackets is calculated before being included. For example, the text at the bottom saying "Please note that all values are theoretical, actual market valuation may differ slightly." will appear as-is. The if statement is in square brackets, so it will be evaluated and it will use a different description depending on the number of issuers and sectors. 

Try adding a title to your report and preview what it looks like. Use the formatting buttons if you want to style the title.

<p align="center">
  <img width="800"  src="readme_images/formatting.png">
</p>

Now deploy your Studio application on the cloud. To do that, click **Publish** at the top right. When you see the Congratulations dialog, copy down the application's URL.

<p align="center">
  <img width="800"  src="readme_images/publish.png">
</p>

Your project is now hosted at the URL in the dialog. If you forget the URL (or make changes to the project) you can republish at any time. Republishing updates your existing URL.

To access that URL, you will also need an API key for authentication. You generate this key in the Settings view Selecting the **API** submenu,  then click **GENERATE API KEY**. 

<p align="center">
  <img width="800"  src="readme_images/api_key.png">
</p>

You will need your URL and API key throughout the workshop. 

If you have a tool for hitting RESTful services like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/), you can try using the service. Your service is available through a `POST` request to your URL. You will need two headers:
- `ContentType = application/json`
- `Authorization = Bearer YOUR_API_KEY_HERE`

You can find several example data sets in the `studio/api_data` folder. The structure for the data can be seen in the `studio/api_data/dataWrapper.json` file. If you do not send any data, NLG Studio will use the sample data. 

In Workshop B, you'll learn more about how to program in NLG Studio.

## 4. Create IBM Cloud Services

Your application is going to use three services from the IBM Cloud: two IBM financial services and a wrapper service around NLG Studio.

First, set up the [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio) service, which will store information about portfolios. Start by following the link and giving your service a name. Then click **Create** in the bottom right.

Next, select Service Credentials from the right menu. If you have navigated away from the API, you can visit the [**IBM Cloud dashboard**](https://console.bluemix.net/dashboard/apps) and open the application.

<p align="center">
  <img width="800"  src="readme_images/service_credentials.png">
</p>

These credentials are used to authorize usage of the IBM APIs. Click **New Credentials**, choose a name, and click **Add**. You can then click **View Credentials** and see the credentials. Copy them now, because you'll need them in [step 5](#5-configure-env-file). 

Follow the same steps to set up [**Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/instrument-analytics), which uses IBM Algorithmics' advanced financial analytics to evaluate the market price for different types of investment. Like with the Investment Portfolio service, you'll need to take a copy of the credentials.

The Arria Natural Language Generation APIs service is only needed when you are running the app in IBM Cloud. It gives you access to pre-built Arria NLG services and also lets you call your published NLG Studio project.

To create a link to your Studio project, follow the [Arria Natural Language Generation APIs](https://console.bluemix.net/catalog/services/natural-language-generation-apis) link and choose a name.

You also need to supply the URL and API for your published Studio service that you collected in [step 3](#3-generating-text-with-nlg-studio). Put these in the boxes provided and click **Create**.

<p align="center">
  <img width="800"  src="readme_images/studio_apis.png">
</p> 

Now you have three services running on IBM Cloud. Next, you'll connect them together.

## 5. Configure an .env File

The GitHub repository contains a basic node web app that strings together calls between the various services. To know how to connect to the services, the app uses an `.env` file.

Create an `.env` file in the root directory of your project repository by copying the sample `.env.example` file with the following command:

  ```none
  cp .env.example .env
  ```

  **Note:** Most files systems regard files with a "." at the front as hidden files.  If you are on a Windows system, you should be able to use either [GitBash](https://git-for-windows.github.io/) or [Xcopy](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true).

The `.env` file will look like this:

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
  
In the '.env' file, update the credentials with the IBM Cloud credentials for each of the services you created in [Create IBM Cloud Services](#4-create-ibm-cloud-services).

These credentials do not need quotes. 

**Note:** Pay particular attention to the Portfolio credentials. There are different credentials for reading (R) and writing (W).

## 6. Load Investment Portfolios

You will now need to create a portfolio in your Investment Portfolio service and create holdings for that portfolio. The `data/holdings.sample1.json` file provides you with sample holdings for a portfolio.  You can run the `investmentPortfolio.js` script to load the portfolio and holdings. The credentials are retrieved from the `.env` file, so make sure that your Investment Portfolio credentials are filled in as per the [last step](#5-configure-env-file).

To load a portfolio named `MyCustomPortfolio`, first install dependencies and use the command line with the script to create the portfolio:
```
npm install
node investmentPortfolio.js -l MyCustomPortfolio
```
This command produces a blank investment portfolio.

To populate this portfolio, load holdings from `data/holdings.sample1.json` into it. Run:
```
node investmentPortfolio.js -l MyCustomPortfolio -h data/holdings.sample1.json
```

To view a list of all of your portfolios, run:
```
node investmentPortfolio.js -g
```

To view the holdings within a portfolio, run:
```
node investmentPortfolio.js -g MyCustomPortfolio
```

If you make a mistake and want to delete a portfolio, run:

```
node investmentPortfolio.js -d MyCustomPortfolio
```

## 7. Run the Application Locally

Now try running the whole application locally. The application is structured around `app.js`, a script that points to all of the resources in the web app. It gathers the values from the `.env` file and tells the system to use the HTML and javascript stored in the `public` folder. The code actually calling each endpoint is in `public/script/main.js`.

To launch the application, run `node app.js` from the project's root directory. This will print out the port that the app is listening on. View the app by opening http://localhost:YOUR_PORT_NUMBER using the port that was printed in the console. 

## 8. Deploy to IBM Cloud

Running the application locally lets you test things, but to go into production you need to deploy the app. You'll use the IBM Cloud Command Line Interface to deploy the application with a few lines of code.

The `manifest.yml` file tells the IBM Cloud how to provision a server that hosts the app, and which services it needs to connect to. The current manifest file looks like this: 

  ```
applications:
- path: .
  memory: 128M
  instances: 1
  domain: mybluemix.net
  name: TODO
  host: TODO
  disk_quota: 128M
  buildpack: sdk-for-nodejs
  services:
  - Investment Portfolio-TODO
  - Instrument Analytics-TODO
  - Natural Language Generation APIs-TODO
  ```

You need to update the name and host, to tell your app which name it should be hosted under.

You also need to update the services list, making sure that the name for each service matches the name you created it with in the IBM Cloud. Check the [**IBM Cloud dashboard**](https://console.bluemix.net/dashboard/apps) to make sure the names match.

Once the manfiest.yml file is configured, you can push to IBM Cloud using the command line interface. The command line interface is accessed using `bx` like so:
```
bx login
```
You will need to supply your IBM Cloud user credentials. If you need to choose a region, choose US-South, the same region as your services.

Next, point the command line interface at your organization and space. These are here in the IBM Cloud dashboard:

<p align="center">
  <img width="800"  src="readme_images/org_space.png">
</p> 

Call the following command using your organization and space:
```
bx target -o ORG -s SPACE
```

Now the command line interface can point to your application. 

To host your app, simply call:
```
bx cf push
```

The console will include the URL that your app is hosted on. This will typically be `MANIFEST_HOST_VALUE.mybluemix.net`. Try visiting the URL to see your app running in the cloud.

# Workshop B : Expanding the Narrative
In this workshop, you'll take the application you built in Workshop A and expand the text with Arria's NLG Studio. This workshop is loosely structured; investigate anything you find interesting.

## Prerequisite
- [Workshop A](#workshop-a---setting-up-the-application)

## Steps
1. [Get More Sample Data](#1-get-more-sample-data)
2. [Learn NLG Studio](#2-learn-nlg-studio)
3. [Expand the Text](#3-expand-the-text)

## 1. Get More Sample Data
Currently you have one portfolio filled with sample data. However, you need to see how the system reacts in different situations. 

In [Load Investment Portfolios](#6-load-investment-portfolios), you learned how to add a portfolio to your collection. Each portfolio you add is stored in the Investment Portfolio service you set up on IBM Cloud, which means any portfolios you create are accessible. There are six more sample data files in the `data` folder.

Try creating portfolios for these files and see how the report changes. Portfolios are loaded when the page first loads, so refresh the app in your browser to see your additions.

You should notice that some of the samples, the ones with only a single issuer, don't produce a report. In this workshop, you'll write a script in NLG Studio for them.

## 2. Learn NLG Studio
You are going to write a script in NLG Studio to extend the text, so you'll need to learn the basics of Studio. There are two options for getting started, and your choice depends on how ambitious you're feeling. 

* If you want to get started quickly, there is a short primer on NLG Studio. This is in the form of a Studio project, and it explains the most common actions. The primer project is in the git repository as `studio/studioDevelopersPrimer.json`. Import this project into NLG Studio in the same way you imported the other project.
* If you want a more in-depth guide to NLG Studio, there is a full tutorial available on our documentation site at https://docs.studio.arria.com/getting-started/creating-a-json-project/. This tutorial will give you a step-by-step guide to building a new project.

## 3. Expand the Text
The report you downloaded is able to talk about the investment portfolio in most situations, unless there's only a single issuer. If all of your equity is in one company, the report will just print a line of canned text. You are going to expand this into a longer narrative. This is going to involve writing as well as coding. If you're ever stuck for ideas, you can try the https://demo-index-arria-app-wb.mybluemix.net/ demo to see how things are phrased there.

First, here's an introduction to how the project is set up. A Studio project starts with a `Main` script, which can call out to various sub-scripts. In the Portfolio Holdings Summary project, the `Main` script chooses which type of portfolio to work with, then prints a canned text sentence. There are four types of report: NoIssuers, OneIssuer, ManyIssuersOneSector and ManyIssuersManySectors. It is the OneIssuer script that you need to improve.

To test this, you need some sample data. In the `studio/previewData` folder, there are six sets of sample data:
- `SampleDataSet1` - The default portfolio with a number of different issuers across various sectors
- `SampleDataSet2` - An empty portfolio
- `SampleDataSet3` - A portfolio where all of the issuers are in the Technology sector
- `SingleIssuerSampleDataset1` - A portfolio with two separate holdings in a single issuer
- `SingleIssuerSampleDataset2` - A portfolio with a single holding in a single issuer
- `SingleIssuerSampleDataset3` - A portfolio with two separate holdings in a single issuer, where the vast majority of the holdings are in one of the holdings  

To load a sample dataset into Studio, go to the Data view and click the **Import Data** icon.
 
<p align="center">
  <img width="800"  src="readme_images/import_data.png">
</p>

Load in one of the SingleIssuer sample datasets so you can see what you're working with. If you preview it, you'll get the "You will fill in this template during the second part of the workshop" boilerplate text.

The project has already defined a few global variables that point to useful parts of the data. The two that will be most useful for you are ` [[PortfolioName]] ` and ` [[SortedIssuers]] `, or more specifically ` [[SortedIssuers[0]]] `. If you copy these into your script and then preview it, you can see the data you have to hand.

Begin with a basic sentence that names the portfolio and claims that there is only a single issuer.

Once you've added a sentence and previewed it, you can republish it. As soon as it's republished, anyone using the demo you have hosted on the IBM Cloud will see the latest version of the text.

Next, add the information that you'll always need:
- Who is the issuer?
- How many holdings are there? (That is, the length of the issuer's values.)
- Which sector is the issuer in? (There are two ways of getting this: either from the first holding, or from the '[[SortedSectors]]' variable.)

After that, it would be good to read about the different holdings. There is a sub-script called Position that takes a position in a holding (i.e., one of the issuer's values), which may come in handy.
  
It would make sense to describe the positions differently depending on how many holdings there are. Describing one holding is different from describing a portfolio made up of several holdings. You can use an if condition to choose from different options.

If you're describing multiple holdings, it would make sense to read them in value order. Try using the ` sort ` function. 

What happens if there are a lot of different holdings? You could try limiting the number of holdings using the ` top ` function.

What do you do if one of the holdings makes up the majority of the portfolio? In `SingleIssuerSampleDataset3` there are five units in one instrument, but 300 in the other.

The final thing to suggest is variation. You can use the ` chooseAtRandom ` function to make the report vary every time it is generated. If you want to vary something more complex, like a section of text including variables, it's usually easiest to put the choices in separate subscripts, and use ` chooseAtRandom ` to decide which to use. 

# License

[Apache 2.0](LICENSE)

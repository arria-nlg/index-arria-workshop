var request = require( 'request-promise' );
var fs = require( 'fs-extra' );
require('dotenv').config();

READER_USER_ID = process.env.CRED_PORTFOLIO_USERID_R;
READER_PASSWORD = process.env.CRED_PORTFOLIO_PWD_R;
WRITER_USER_ID = process.env.CRED_PORTFOLIO_USERID_W;
WRITER_PASSWORD = process.env.CRED_PORTFOLIO_PWD_W;

BASE_URL = "https://investment-portfolio.mybluemix.net/"

/*
 * Gets a list of all portfolios in the system.
 * Each portfolio has a name and the timestamp of when the portfolio was created
 */
function getPortfolios() {
  console.log('Attempting to get all portfolio names');
  
  request( {
    method: 'GET',
    url: BASE_URL + 'api/v1/portfolios',
    auth: {
      username: READER_USER_ID,
      password: READER_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    }
  } ).then( function( body ) {
    console.log(body);
    return body;
  } ).catch( function( err ) {
    // TODO - Check for unauth
    console.log( err );
  } );
}

/*
 * Gets the holdings for a particular portfolio, e.g. what shares and options are owned.
 * For every instrument the following information is returned:
 *    asset        - What the holding is in. Typically the company name.
 *    quantity     - How many holdings are owned in this instrument 
 *    instrumentId - The unique identifier for the instrument.
 *    companyName  - The name of the company.
 *    sectorName   - The business sector the company is involved with, e.g. health, transport.
 */
function getPortfolioHoldings(portfolioName) {
  console.log('Attempting to get portfolio holdings for ' + portfolioName);
  
  request( {
    method: 'GET',
    url: BASE_URL + 'api/v1/portfolios/' + portfolioName + '/holdings',
    auth: {
      username: READER_USER_ID,
      password: READER_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    },
    qs: { latest: 'true' },
  } ).then( function( body ) {
    console.log( body );
    return body;
  } ).catch( function( err ) {
    // TODO - Check for unauth
    console.log( err );
  } );
}

/**
 * Loads a new portfolio with the supplied name into the cloud service.
 * The portfolio will be created without any holdings.
 * If the portfolio already exists, nothing will change (i.e. existing holdings will remain). 
 */
function loadPortfolio(portfolioName) {
  console.log('Attempting to create a new portfolio called ' + portfolioName);
  var timeStamp = +new Date

  // Check it doesn't already exist
  request( {
    method: 'GET',
    url: BASE_URL + 'api/v1/portfolios/' + portfolioName + '/holdings',
    auth: {
      username: READER_USER_ID,
      password: READER_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    },
    qs: { latest: 'true' },
  } ).then( function( body ) {
    //Portfolio already exists
      
    console.log( 'A portfolio for ' + portfolioName + ' already exists');
    console.log( 'Holdings:');
    console.log( body );
    return body;
  } ).catch( function( err ) {
    // TODO - Check for unauth
    // Portfolio doesn't exist. Create one.
      
    // Request
    request( {
      method: 'POST',
      url: BASE_URL + 'api/v1/portfolios/',
      auth: {
        username: WRITER_USER_ID,
        password: WRITER_PASSWORD
      },
      json: {
        timestamp: timeStamp,
        name: portfolioName,
        closed: false,
        data: {
          manager: 'John Smith'
        }
      }
    } ).then( function( body ) {
      console.log(body);
      console.log("A new portfolio was created")
    } ).catch( function( err ) {
      // TODO - Check for unauth
      console.log("Could not create a new portfolio");
      console.log( err );
    } );
  } );

}

/**
 * Loads portfolio holdings from a json file and copies them into an existing portfolio.
 * The loaded holdings replace any that have already been set for the portfolio.
 * Throws an error if the portfolio does not already exist.
 */
function loadPortfolioHoldings(portfolio, holdingsJsonFile) {
  //load holdings into portfolo
  var timeStamp = +new Date
  console.log('Attempting to load holdings from ' + holdingsJsonFile + ' into ' + portfolio);

  fs.readFile( holdingsJsonFile, 'utf8' )
  .then( function( body ) {
    var data = JSON.parse( body );
    return request( {
      method: 'POST',
      url: BASE_URL + 'api/v1/portfolios/' + portfolio + '/holdings',
      auth: {
        username: WRITER_USER_ID,
        password: WRITER_PASSWORD
      },
      json: {
        timestamp: timeStamp,
        holdings: data.holdings
      }
    } );
  } ).then( function( body ) {
    console.log(body);
  } ).catch( function( err ) {
    // TODO - Check for unauth
    console.log( err );
  } );
}

/**
 *
 */
function deletePortfolio(portfolioName) {
  console.log('Attempting to delete ' + portfolioName);
  var timeStamp = +new Date

  // Check it already exists
  request( {
    method: 'GET',
    url: BASE_URL + 'api/v1/portfolios/' + portfolioName,
    auth: {
      username: READER_USER_ID,
      password: READER_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    },
    qs: { latest: 'true' },
  } ).then( function( getBody ) {
    //Portfolio already exists
      
    console.log( 'Portfolio found, deleting');
    
    target = JSON.parse(getBody);
    
    request( {
      method: 'DELETE',
      url: BASE_URL + 'api/v1/portfolios/' + portfolioName + '/' + target.portfolio[0].timestamp + "?rev=" + target.portfolio[0]._rev,
      auth: {
        username: WRITER_USER_ID,
        password: WRITER_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      },
      qs: { latest: 'true' },
    } ).then( function( body ) {
      console.log( 'Portfolio deleted');    
    } ).catch( function( err ) {
      // TODO - Check for unauth
      console.log( 'Could not delete the portfolio');
      return err;
    } );
  } ).catch( function( err ) {
   // TODO - Check for unauth
   console.log( 'No portfolio named ' + portfolioName + ' exists');
  } );
}

/**
 * Displays a help message which shows the possible arguments and how to use them.
 */
function showHelp() {
  console.log('Possible arguments:')
  console.log(' -g <name>?           Gets currently loaded portfolios. If used without a name,'); 
  console.log('                      this will show the names of all portfolios in the system.');
  console.log('                      If you supply a portfolio name it will get the details of');
  console.log('                      that portfolio.');
  console.log();
  console.log(' -l <name> -h? <data> Loads data into a named portfolio. Requires the name of ');
  console.log('                      the portfolio to edit. If used without -h (holdings) this');
  console.log('                      will create a blank portfolio. If used with -h this will ');
  console.log('                      load the holdings data from the target json file into the');
  console.log('                      portfolio. Please note that you can only load data into a');
  console.log('                      portfolio which has already been created.');
  console.log();
  console.log(' -d <name>            Delete a named portfolio. Use caution, this is permanent.');
  console.log();
  console.log(' -help                Display these options.');
                              
}

//get command-line args
const args = process.argv

//perfrom call based on command-line args
if (args[2]) {
  if (args[2] == '-l' ) {
    //load
    if(args[3]) {
      var portfolioName = args[3];
      
      if(args[4]) {
        if (args[4] == '-h') {
          if(args[5]) {
            //load holdings
            var holdingsJsonFile = args[5];

            fs.exists(holdingsJsonFile, function(exists) {
              if (exists) {
                loadPortfolioHoldings(portfolioName, holdingsJsonFile);
              } else {
                console.log(holdingsJsonFile + ": no such file");
              }
            });
          }
        } else {
          console.log(args[4] + ' is not a valid argument. Use -h to load holdings into a portfolio')
        }
      } else {
        loadPortfolio(portfolioName);
      }
    } else {
      console.log('Enter portfolio name')
    }
  } else if (args[2] == '-g') {
    //get
    if(args[3]) {
      portfolioName = args[3];
      getPortfolioHoldings(portfolioName);
    } else {
      getPortfolios();
    }

  } else if (args[2] == '-d' ) {
    //delete
      if(args[3]){
        deletePortfolio(args[3]);          
      } else {
        console.log('Enter portfolio name')
      }

  } else {
    if (args[2] != '-help'){
      console.log(args[2] + ' is not a valid argument');
    }
    showHelp();
  }
}  else {
  console.log("This script requires an argument")
  showHelp();
}

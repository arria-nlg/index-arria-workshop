require('dotenv').config();
var express = require('express');
var request = require( 'request-promise' );
var cfenv = require( 'cfenv' );
var vcapServices = require('vcap_services');
var jsonfile = require( 'jsonfile' );
var parser = require( 'body-parser' );

// IBM Cloud
var env = cfenv.getAppEnv();
var config ={};

config = jsonfile.readFileSync( __dirname + '/config.bluemix.json' );

//arria narrative credentials
var arriaCredentials = vcapServices.getCredentials('user-provided');
config.arria.key = arriaCredentials.api_key||process.env.CRED_ARRIA_NATURAL_LANGUAGE_GENERATION_TOKEN;
config.arria.url = arriaCredentials.api_url||process.env.CRED_ARRIA_NATURAL_LANGUAGE_GENERATION_URL;

//investment portfolio credentials
var portfolioCredentials = vcapServices.getCredentials('fss-portfolio-service');
config.portfolio.url = portfolioCredentials.url||process.env.CRED_PORTFOLIO_URL;
if (portfolioCredentials.reader) {
	config.portfolio.reader.userid = portfolioCredentials.reader.userid;
	config.portfolio.reader.password = portfolioCredentials.reader.password;
} else {
	config.portfolio.reader.userid = process.env.CRED_PORTFOLIO_USERID_R;
	config.portfolio.reader.password = process.env.CRED_PORTFOLIO_PWD_R;
}

if (portfolioCredentials.writer) {
	config.portfolio.writer.userid = portfolioCredentials.writer.userid;
	config.portfolio.writer.password = portfolioCredentials.writer.password;
} else {
	config.portfolio.writer.userid = process.env.CRED_PORTFOLIO_USERID_W;
	config.portfolio.writer.password = process.env.CRED_PORTFOLIO_PWD_W;
}

//simulated instrument analytics credentials
var instrumentCredentials = vcapServices.getCredentials('fss-analytics-service');
config.instrument.url = instrumentCredentials.uri||process.env.CRED_INSTRUMENT_ANALYTICS_URL;
config.instrument.token = instrumentCredentials.accessToken||process.env.CRED_INSTRUMENT_ANALYTICS_ACCESSTOKEN;

// create app
const app = express();

// Middleware
app.use( parser.json() );
app.use( parser.urlencoded( {
	extended: false
} ) );

// Per-request actions - load up the config
app.use( function( req, res, next ) {
	// Configuration
	req.config = config;

	// Just keep swimming
	next();
} );

// Static for main files
app.use( '/', express.static( 'public' ) );

// backend routes
app.use( '/api', require( './routes/api' ) );

// unhandled route


// error handler (must be last)
app.use(function(error, req, res, next) {
	res.statusCode = error.statusCode || 500;
	res.json({ message: error.message });
  });

//app.get('/', (req, res) => res.send('Hello World!'));
// Listen
var server = app.listen( env.port, env.bind, function() {
	// Debug
	console.log( 'App listening on: ' + env.port );
} );
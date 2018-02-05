var express = require('express');
var request = require('request-promise');

// Router
var router = express.Router();

// List portfolios
router.get('/portfolios', function (req, res, next) {
    console.log('get portfolios');

    // Request token
    request({
        method: 'GET',
        url: req.config.portfolio.url + 'api/v1/portfolios',
        auth: {
            username: req.config.portfolio.reader.userid,
            password: req.config.portfolio.reader.password
        },
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    }).then(function (body) {
        console.log(body);
        res.send(body);
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});



// Get holdings for portfolio
router.get('/holdings', function (req, res, next) {
    request({
        method: 'GET',
        url: req.config.portfolio.url + 'api/v1/portfolios/' + req.query.portfolio + '/holdings',
        auth: {
            username: req.config.portfolio.reader.userid,
            password: req.config.portfolio.reader.password
        },
        headers: {
            'Content-Type': 'application/json'
        },
        qs: { latest: 'true' },
    }).then(function (body) {
        res.send(body);
    }).catch(function (err) {
        console.log(err);
        next(err);
    });
});

//get anlaytics for instruments
router.post('/analytics', function (req, res, next) {
    let instruments = req.body.instruments;
    // get analytics
    let options = {
        method: 'POST',
        url: req.config.instrument.url + 'api/v1/instruments',
        headers: {
            'X-IBM-Access-Token': req.config.instrument.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'

        },
        "body": {
            "compute_request": {
                "analytics": ["THEO/Value"],
                "instruments": instruments
            }

        },
        json: true
    };
    console.log('retreive analytics.')
    request(options)
        .then(function (body) {
            // send back the holdings with the analytics
            res.send(body);
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        });
});

// get narrative
router.post('/narrative', function(req, res, next){
    let arriaData = req.body.arriaData;
    // get analytics
    let options = {
        method: 'POST',
        url: req.config.arria.url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ' Bearer ' + req.config.arria.key    
        },
        "body": {
                "data": arriaData
        },
        json: true
    };
    request(options)
        .then(function (body) {
            console.log('Got the narrative');
            console.log(body);
            // send back the holdings with the analytics
            res.send(body);
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        });
})



// Export
module.exports = router;
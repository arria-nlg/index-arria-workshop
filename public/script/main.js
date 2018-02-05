// get the portfolios
function getPortfolios() {
    fetch('api/portfolios')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Returned status:' + response.status + '. Message: ' + response.statusText);
        }).then(function (data) {
            console.log(data);
        }).catch(function (error) {
            console.log('There has been a problem getting your portfolios: ', error.message);
        });
}

// get the holdings and analytics
function getHoldings() {
    let holdings;
    fetch('api/holdings' + '?portfolio=' + 'US_Fixed_Income_Ptf')
        .then(function (response) {
            // check the response
            if (response.ok) {
                // pass on the data
                return response.json();
            }
            throw new Error('Returned status:' + response.status + '. Message: ' + response.statusText);
        })
        .then(function (data) {
            console.log(data)
            // extract the instruments
            holdings = data.holdings[0].holdings;
            let instruments = [];
            for (let h = 0; h < holdings.length; h++) {
                if (holdings[h].instrumentId) {
                    instruments.push(holdings[h].instrumentId);
                }
            }
            console.log(instruments);
            return instruments;
        })
        .then(function (instruments) {
            // post instruments to get the analytics
            return fetch('api/analytics', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify({ "instruments": instruments }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
        })
        .then(function (response) {
            // check the response
            if (response.ok) {
                // pass on the data
                return response.json();
            }
            throw new Error('Returned status:' + response.status + '. Message: ' + response.statusText);
        }).then(function (analytics) {
            console.log(analytics);
            // append the analytics to the holdings 
            for (var h = 0; h < holdings.length; h++) {
                let instrumentObj = analytics.find(function (instrument) {
                    return instrument.instrument == holdings[h].instrumentId;
                });
                let instValue = parseFloat(instrumentObj.values[0]['THEO/Value'].split(' ')[0]);
                holdings[h].unitValue = instValue;
                holdings[h].positionValue = instValue * holdings[h].quantity;
            }
            console.log(holdings);
        })
        .catch(function (error) {
            console.log('There was a problem getting holdings: ', error.message);
        });
}


function getNarrative() {
    var data = {
        "data": [
            {
                "id": "Primary",
                "type": "1d",
                "dataSet": [
                    [
                        "Jurisdiction",
                        "Type",
                        "StateLandArea",
                        "StatePop2010",
                        "StatePop2016",
                        "Capital",
                        "CapitalPop2010",
                        "CapitalPop2016",
                        "HeadOfGovt",
                        "Party",
                        "Terms",
                        "Daughters",
                        "Sons",
                        "NumDaughters",
                        "NumSons"
                    ],
                    [
                        "New South",
                        "Wales",
                        "State",
                        800641,
                        7238800,
                        7618200,
                        "Sydney",
                        4183471,
                        4526479,
                        "Gladys Berejiklian",
                        "Liberal",
                        1,
                        0,
                        0
                    ]
                ]
            }
        ],
        "options": {
            "nullValueBehaviour": "SHOW_IDENTIFIER"
        }
    };

    fetch('api/narrative', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ "arriaData": data.data }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(function (response) {
            // check the response
            if (response.ok) {
                // pass on the data
                return response.json();
            }
            throw new Error('Returned status:' + response.status + '. Message: ' + response.statusText);
        }).then(function(narrative){
            console.log(narrative);
        })
        .catch(function(error){
            console.log('There was a problem getting narrative: ', error.message);
        });

}

getPortfolios();
getHoldings();
getNarrative();
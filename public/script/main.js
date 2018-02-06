// get the portfolios and add to select
function loadPortfolios() {
    getPortfolios()
        .then(function (portfolios) {
            console.log('Adding portfolios to select');
            let select = document.getElementById('portfolio-select');
            portfolios.forEach(function (portfolio) {
                let option = document.createElement('OPTION');
                option.setAttribute('value', portfolio.name);
                option.appendChild(document.createTextNode(portfolio.name));
                select.appendChild(option);
            });
            // enable the form
            document.getElementById('portfolio-form').addEventListener('submit', submitPortfolio);
            document.getElementById('portfolio-input').disabled = false;

        }).catch(function (error) {
            console.log(error);
        });
}




function submitPortfolio(event) {
    event.preventDefault();
    let e = document.getElementById('portfolio-select');
    let ptf = e.options[e.selectedIndex].text;
    console.log('submitting portfolio:' + ptf);
    getPortfolioHoldings(ptf)
        .then(function (holdings) {
            addHoldingsTable(holdings);
            return getNarrative(holdings);
        }).then(function (narrative) {
            let content = narrative[0].result;
            addNarrative(content);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getPortfolios() {
    return fetch('api/portfolios')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Returned status:' + response.status + '. Message: ' + response.statusText);
        }).then(function (data) {
            console.log(data);
            return data.portfolios;

        }).catch(function (error) {
            console.log('There has been a problem getting your portfolios: ', error.message);
        });
}

// get the holdings and analytics
function getPortfolioHoldings(portfolioName) {
    let holdings;
    return fetch('api/holdings' + '?portfolio=' + portfolioName)
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
            return holdings;
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

    return fetch('api/narrative', {
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
        }).then(function (narrative) {
            console.log(narrative);
            return narrative;
        })
        .catch(function (error) {
            console.log('There was a problem getting narrative: ', error.message);
        });

}


function addHoldingsTable(holdings) {
    // roll up the data
    console.log('adding table');
    // add a table of holdings to the page
    // group by keys on the assets
    // get portfolio total value
    let ptfValue = holdings.reduce(function(r, v) {
        return r + v.positionValue;
    }, 0);

    // group using d3 for ease
    let nested = d3.nest()
        .key(function (d) { return d.sectorName; })
        .key(function (d) { return d.companyName; })
        .entries(holdings);


    // add the total portfolio
    let wholePortfolio = [{"key":'Portfolio', "values":nested}]

    // roll up the values
    wholePortfolio.forEach(function(node) {
        sumChildren(node, ptfValue);
    });

    console.log(wholePortfolio);

    // add table
    document.getElementById('holdings-table').innerText = JSON.stringify(wholePortfolio, null, 2);
}

function sumChildren(node, total) {
      node.groupValue = node.values.reduce(function(r, v) {
      return r + (v.values ? sumChildren(v, total) : v.positionValue);
    },0);
    node.groupWeight = node.groupValue / total;
    return node.groupValue;
  }

function addNarrative(narrative) {
    console.log('adding narrative');
    // add the narrative to the page
    let container = document.getElementById('narrative');
    container.innerHTML = narrative;
}

loadPortfolios();


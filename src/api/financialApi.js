import routes from './routes/routes.json';
import "regenerator-runtime";
import axios from 'axios';
import https from 'https';
import * as fs from 'fs';
import log4js from '../../src/main/logger/logger';
const apiKey = process.env.API_KEY;

const logger = log4js.getLogger();
logger.level = "debug";
// "testEnvironment": "node" (fixes ssl error)
// try https get (then switch to websockets)

export const requestPairByDay_ = async (symbol) => {
    //console.log('called');

    /* const httpsAgent = https.Agent({
         ca: fs.readFileSync("./certificate.crt"),
         key: fs.readFileSync("./certificate.key"),
         passphrase: "1234",
     })*/

    //  const instance = axios.create({ httpsAgent: httpsAgent });
    // routes.api.v3['historical-chart'].daily
    const localhost = "https://localhost:44362" // move to xml or yml file
    // logger.info(`${localhost}` + "/test/".concat(forexPair));
    // .api/v3/historical-chart/historical-price-full/{symbol}
    try {
        const response = await axios.get(`${localhost}` +
            routes.api.v3['historical-chart'].daily.concat(symbol));

        logger.log(`URI`, routes.api.v3['historical-chart'].daily.concat(symbol));

        const data = (response.data !== undefined && response.data !== null) ? response.data : response;

        logger.info(`Reponse data`, data);
        logger.info(`Status`, response);
        
        return data;
    } catch (errors) {
        console.error(errors);
    }
}

export const requestPairByMinute = async (minute, forexPair) => {
    await fetch(routes.api.v3['historical-chart'].minute.concat(minute + 'min/' + forexPair + "?apikey=" + apiKey))
        .then(response => {
            return response.json()
        })
        .catch(error => {
            console.log("error " + error);
            return { status: 400 };
        }
        );
}

/*export const requestPairByHour = async (hour, forexPair) => {
    await fetch(routes.api.v3['historical-chart'].hour.concat(hour + 'hour/' + forexPair + "?apikey=" + apiKey))
        .then(response => {

            const fileName = forexPair + "-"

            file = new File(response.json(), "", {
                type: "	application/json",
            });
        })
        .finally(response => {
            return response.json()
        })
        .catch(error => {
            console.log("error " + error);
            return { status: 400 };
        }
        );
}*/

export const requestPairByDay = async (forexPair) => {
    const localhost = "http://localhost:44362"
    await fetch(localhost + routes.api.v3['historical-chart'].daily.concat(forexPair))
        .then(response => {
            console.log("ok " + response);
            return response.json()
        })
        .catch(error => {
            console.log("error " + error);
            return { status: 400 };
        }
        );
}

// fix link
export const requestPairByDailyRange = async (forexPair, startRange, endRange) => {
    let file = [];
    const localhost = "https://localhost:44362"
    await fetch(localhost + routes.api.v3['historical-chart'].daily
        .concat(forexPair + '/' + startRange + '/' + endRange))
        .then(response => {

            /*   const fileName = forexPair + "-" + range;
   
               file = new File(response.json(), fileName, {
                   type: "application/json",
               });*/
        })
        .finally(response => {
            return {
                file: response.json(),
                status: 200
            };
        })
        .catch(error => {
            console.log("error " + error);
            return {
                file: null,
                status: 400
            };
        }
        );
}


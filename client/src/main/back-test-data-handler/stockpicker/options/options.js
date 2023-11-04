import * as time from 'luxon';
import range from './interval.json';
import log4js from '../../../logger/logger';
import * as api from '../../../../api/financialApi';

const logger = log4js.getLogger();
logger.level = "debug";

/** Options for stocks that are returned from the search results
 * and added to the portfolio
 */

// historical range 1 - 10...
// createRrequest object with helpers.js
export const getInterval = (unit) => {
    const DateTime = time.DateTime;
    const Interval = time.Interval;

    const dataRangeInterval = range.interval[0];
    const start = dataRangeInterval.start;
    const end = dataRangeInterval.end;

    const startObj = {
        year: start.year,
        month: start.month_no,
        day: start.day_no,
        hour: start.hour,
        minute: start.minute
    }

    const endObj = {
        year: end.year,
        month: end.month_no,
        day: end.day_no,
        hour: end.hour,
        minute: end.minute
    }
    // from bst zone first
    const startInterval = DateTime.utc(startObj.year, startObj.month,
        startObj.day, startObj.hour, startObj.minute);
    const endInterval = DateTime.utc(endObj.year, endObj.month,
        endObj.day, endObj.hour, endObj.minute);

    // change to log to console only
    logger.info(startInterval);
    logger.info(endInterval);

    const specifiedInterval = Interval.fromDateTimes(startInterval, endInterval);
    logger.info(specifiedInterval);
    return specifiedInterval.toDuration(unit).toObject();
}

// download historical data
export const downloadHistoricalData = (symbol) => { 
    // Create format to get api request
    const res = api.requestPairByDay_(symbol); 
    logger.info(res);
    // Create format to get json document
  //  console.log("Go home");
   // console.log(res);
    return res;
    // test equality to specified interval
    // communicate with api
}

export const storeHistoricalData = (symbol) => { 
    // Create format to get api request
    const res = api.requestPairByDay(symbol); 
    // Create format to get json document
   // console.log("Go home");
   // console.log(res);
    return res;
    
    // test equality to specified interval
    // communicate with api
}


 // get historical data from json document 
 //const DateTime = time.DateTime;
 // Use the yml file and/or create test cases for this
 // Maybe do this on the server side? 
 //const startInterval = DateTime.local(2018, 3, 12);
 //const endInterval = DateTime.local(2019, 3, 12);
 // const request = symbol + "?from=" + startInterval + "&to=" + endInterval;






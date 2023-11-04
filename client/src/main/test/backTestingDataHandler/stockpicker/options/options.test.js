import * as options from '../../../../back-test-data-handler/stockpicker/options/options';
import * as api from '../../../../../api/financialApi';
import axios from 'axios';

jest.mock("axios");

describe('get the length between a time frame from historical data', () => {
    //const num = options.getInterval(['hours', 'minutes', 'seconds', 'days']);

    test.skip('length between a time frame in seconds', () => {
        const round = Math.round(num.seconds);
        expect(round).toBe(364);
    });

    test.skip('length between a time frame in minutes', () => {
        const round = Math.round(num.minutes);
        expect(round).toBe(364);
    });

    test.skip('length between a time frame in hours', () => {
        const round = Math.round(num.hours);
        expect.not(round).toBeNull();
    });

    test.skip('length between a time frame in days', () => {
        const round = Math.round(num.days);
        expect(round).toBe(401);
    });
});

describe('api returns the correct response', () => {
    test('Response is not empty', async () => {

        axios.get.mockResolvedValue(
            {data: "DATA"}
         );   
       

        const res = await options.downloadHistoricalData("GSP");
       
      
        expect(res).not.toBeNull();


    });

    test.skip('Repsonse is in correct format', () => {
      
    });

    test.skip('Incorrect symbol leads to 404', () => {
      
    });

    test.skip('Response matches array length (getInterval)', () => {
       
    });
});


describe('get the length of arbitrary time frames for historical data', () => {
  //  const num = options.getInterval("seconds");

    test.skip('leap year', () => {
        const round = Math.round(num.seconds);
        expect(round).toBe(364);
    });

    test.skip('closed trading hours', () => {
        const round = Math.round(num.minutes);
        expect(round).toBe(364);
    });

    test.skip('length between a time frame in hours', () => {
        const round = Math.round(num.hours);
        expect(round).toBe(364);
    });

    test.skip('length between a time frame in days', () => {
        const round = Math.round(num.days);
        expect(round).toBe(364);
    });
});


/*describe('test results returned from daily range api call', () => {
    const num = options.getInterval("seconds");

    test.skip('daily historical range api test', () => {
        const data = ['', '', ''];
        const response = api.requestPairByDailyRange(...data);
        expect(response.status).toBe(200);


        // Read file created
        const fileName = forexPair + "-" + range;
        

        // let reader = 
        //reader.
        // Read file and compare results

    });
});*/


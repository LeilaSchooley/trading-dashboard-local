import React, { Component } from 'react';
//import SavedStockCache from './main/SavedStockCache.js';
//import DashboardTwoAlertCache from './DashboardTwo/js/DashboardTwoAlertCache.js';
import * as signalR from '@microsoft/signalr'; // Update to microsoft/signalr
import * as all from '../src/api/financialApi';
import * as connection from './HubConnectionHandler';
export class DataFeed extends Component {
  /*  static hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44362/stockfeed")
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();*/

    
    constructor(props) {
        super(props);

        // this.updateCache = false;
        this.lock = false;
        this.connected = false;
        this.keyCount = 0;
        this.updateStockInfo = false;

        this.state = {
            stockTableTwo: [],
            isStreaming: false,
            lock: false,
            hubConnection: null,
            request_Calls: -1,
            MAX_CALLS: 896,
            called: true,
        };
    }

    componentDidMount() {
      all.requestPairByDay_("gsp");
       
       // await connection.start();
        // console.log('START THE FEED!')
      //  localStorage.setItem('_connectionEstablished', false);
        //this.startDataFeed();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {

    }

   

    async connectionTimeout() {
        var count = 0;

        return new Promise(resolve => {
            this.interval = setInterval(() => {
                // Number of retries allowed: 3
                if (this.connected == true) {
                    clearInterval(this.interval)
                    resolve(false)
                }
                else if (count >= 3) {
                    clearInterval(this.interval)
                    resolve(true)
                }
                count++;
            }, 8000);
        });
    }

    /**
      * Gets the timezone by identifier as
      * well as the total time elapsed, can 
      * only be called if a user is logged in 
      * and triggers the alert interval, as 
      * long as the settings persist before the 
      * user logs out
      */
    async detectTimeZone() {
        // Fill Cache with EOD data
        await fetch('detectTimeZone')
            .then(response => response.json())
            .then(response => {
                //.set(key, item);
            })
            .catch(error => {
                console.log("error " + error) // 404
                // Last successfully catched data
                return;
            }
            );
    }

    /* End Of Day Data 
    async eodData() {
        // Fill Cache with EOD data
        await fetch('geteod/data')
            .then(response => response.json())
            .then(response => {
                for (var key = 0; key < response.length; key++) {
                    const item = JSON.parse(response[key]);

                    // Scanner
                    ScannerCache.set(key, item);

                    // DashboardTwo 
                    DashboardTwoCache.set(key, item);
                    DashboardTwoAlertCache.set(key, item);

                    // Portfolio
                    PortfolioCache.set(key, item);
                    // Set Gross

                    // Historical
                    HistoryCache.set(key, item);

                    // Dashboard One
                    TableCache.set(key, item);
                    AlertCache.set(key, item);
                    SavedStockCache.set(key, item);
                }
            })
            .catch(error => {
                console.log("error " + error) // 404
                // Last successfully catched data
                return;
            }
            );
    }*/

    /**
     * Starts the data feed and subscribes to a method on
     * the server which will retrieve the data. All Caches will
     * be populated through this method, if there is a faliure
     * the caches will be populated with the last successfully
     * fetched data, or EOD data when the session ends.
     */
    async startDataFeed() {
        var count = 0;
        
        // Create a Manager class
        await DataFeed.hubConnection
            .start()
            .then(() => {
                console.log('Successfully connected');
                DataFeed.hubConnection.on('lockStream', (request_Calls, sessionEnded) => {
                    // Add Timeout
                    this.request_Calls = request_Calls;

                    const exists = localStorage.getItem('sessionEnded')
                    if (exists === null || exists === undefined) {
                        localStorage.setItem('sessionEnded', sessionEnded);
                    }
                    else if (exists !== sessionEnded) {
                        localStorage.removeItem('sessionEnded');
                        localStorage.setItem('sessionEnded', sessionEnded)
                    }

                    if (sessionEnded) {
                        localStorage.setItem('sessionEndedCalled', false);
                        this.eodData(); // EOD data
                    }
                })
                DataFeed.hubConnection.on('requestData', (key, data) => {
                    const item = JSON.parse(data);

                    // Scanner
                   /* ScannerCache.set(key, item);

                    // DashboardTwo 
                    DashboardTwoCache.set(key, item);
                    DashboardTwoAlertCache.set(key, item);

                    // Portfolio
                    PortfolioCache.set(key, item);

                    // Historical
                    HistoryCache.set(key, item);

                    // Dashboard One
                    TableCache.set(key, item);
                    AlertCache.set(key, item);
                    SavedStockCache.set(key, item);

                    if (!this.state.updateCache)
                        this.setState({ updateCache: false });

                    if (count < 897) {
                        count += 1;
                    }
                    else {
                        count = 0;
                        console.log("Ok")
                        //   PortfolioCache.updateDataCallback(); // Updates data in portfolioo
                        TableCache.setFill(true);
                        DashboardTwoCache.setFill(true);
                        this.setState({ updateCache: true });
                        this.connected = true;
                    }*/
                })
            }) // Bind to constructor
            .catch(err => {
                console.log('Error while establishing hubConnection :( ' + err)
                this.eodData();
                this.connected = false;
            }); // Redirect to 404 page

        const res = await this.connectionTimeout();
        this.props.getUpdateCache(!res);
        this.setState({ ...this.state, updateCache: !res, lock: res });
        localStorage.setItem('_connectionEstablished', !res);
    }

    render() {
        return null;
    }
}

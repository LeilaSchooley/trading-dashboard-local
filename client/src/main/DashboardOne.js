import React, { Component, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
//import { DashboardNavbar } from './components/navbar/DashboardNavbar';

import TableCache from './cache/TableCache.js';
//import StockPicker from './components/stockpicker/StockPicker';

import { DashboardContext } from './context/DashboardContext.js'
import Container from './back-test-data-handler/container/Container';

const DashboardOne = ({ children }) => {
    const [lock, setLock] = useState(true);
    const [dashboardTwo, setDashboardTwo] = useState([]);
    const [initialiseTableTwo, setInitialiseTableTwo] = useState(false);
    const [tempDashboard, setTempDashboard] = useState([]);

    let intervalID;

    const init = () => {

        const intervalListCount = localStorage.getItem('intervalListCount');
        
        if(intervalListCount === null)
            localStorage.setItem('intervalListCount', 0);

    }

    useEffect(() => {
        // Needs fixing, does not detect when a user has disconnected

        init();

        const connectionEstablished = localStorage.getItem('_connectionEstablished');
        intervalID = setInterval(() => {
            if (connectionEstablished && TableCache.getFill()) {
                initialiseDashboard();
                initialiseLock(false);

                const sessionEndedCalled = localStorage.getItem('sessionEndedCalled');
                if (sessionEndedCalled === null || sessionEndedCalled === undefined) {
                    localStorage.setItem('sessionEndedCalled', false);
                }

                const sessionEnded = localStorage.getItem('sessionEnded');
                if (sessionEnded && !sessionEndedCalled) {
                    window.alert('Session is currently out of trading hours');
                    localStorage.removeItem('sessionEndedCalled');
                    localStorage.setItem('sessionEndedCalled', true);
                }

                clearInterval(intervalID);
            }
        }, 500);
    }, [])

    const initialiseDashboard = () => {
        const dashboard = [];

        /* dashboard.push(<DashboardNavbar
             lock={lock}
             dashboardTwo={dashboardTwo}
             initialiseTableTwo={initialiseTableTwo}
             temp={tempDashboard}
             style={{ transform: 'translateX(20px)' }}
         />);
         */

        setTempDashboard(dashboard);
    }

    useEffect(() => {
        setLock(true);
        setDashboardTwo(tempDashboard);
    }, [lock])

    const initialiseLock = (state) => {
        setInitialiseTableTwo(state);
    }

    return (
        <>
            <DashboardContext.Consumer>
                {children => (
                     <Container children={children} />
                )}
            </DashboardContext.Consumer>

        </>
    );
}

export default DashboardOne;
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AlertReducer } from '../../../reducers/AlertReducer.js';
import PriorityQueue from 'priority-q';
import throttle from 'lodash.throttle';
import * as cache from 'cache-base';
import AlertCache from '../../cache/AlertCache.js';
import TableCache from '../../cache/TableCache.js';
import AlertSettings from '../../settings/AlertSettings.js';
import PriceSettings from '../../settings/PriceSettings.js';
import TableSettings from '../../settings/TableSettings.js';
import SavedStockCache from '../../cache/SavedStockCache.js';

import {
    Box, Button
} from '@chakra-ui/react';

const date = new Date();

/* 
    A bit of a mess, settings should be replaced with a schema or registry
    that keeps track of all the different settings

    States for notifications alerts can be replaced with Reducer functions

    Logic for triggering alerts can be moved to a separate class

    Class components can be replaced by functional components
*/
export const Notification = (props) => {

    

    // Create priority priority_queue for animations not shown yet
    //............. = new
    let array = [];
    let stack = [];
    let queue = [];
    let queue_Length = 0;
    let queue_End = 0;
    let updateCache = false;

    const priority_queue = new PriorityQueue();
   // const animationsCache = new cache();
    //const notifications_temp = [];
    /*   const notifications: [
               { <div style={{
                     position: 'absolute', color: "black", fontSize: '22px',
                     fontWeight: 800, float: 'left'
                 }}>
                     Notifications <br/>
                 </div> 
        ], */

    const [toggleAnimation, setToggleAnimation] = useState(false);
    const [animationTime, setAnimationTime] = useState(5000);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [cache, setCache] = useState(null);
    const [continueAnimation, setContinueAnimation] = useState(true);
    const [disableAnimation, setDisableAnimation] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateNotifications, setUpdateNotifications] = useState(false);
    const [notificationsMenuVisible, setNotificationsMenuVisible] = useState(false);
    const [notifications, setNotifications] = useState(null);
    const [notifications_temp, setNotifications_temp] = useState([]);

    // **************************************************
    // Initialise Notifications
    // **************************************************

    // Initialise alert rows from database
   const _initialiseNotifications = async () => {
        console.log('OG ');
        // Read notifications from database
        await fetch('getallnotifications')
            .then(response => response.json())
            .then(response =>
                addFirstNotifications(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    const addFirstNotifications = async (response) => {
        if (response === null || response === undefined) {
            return;
        }
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            initialiseNotifications(item.Alert, item.TimeStamp);
        }
    }

    // **************************************************
    // Calculate times
    const withinAlertTime = () => {
        const startTime = parseTime(AlertSettings.getStartTime());
        const endTime = parseTime(AlertSettings.getEndTime());

        const h = (date.getHours() + 8) >= 24 ? Math.abs(24 - (date.getHours() + 8))
            : date.getHours() + 8;

        const m = date.getMinutes();

        if (h >= 17 && h <= 24 || h >= 0 && h <= 8) {
            return false;
        }

        if (h >= startTime[0] && h <= endTime[0]) {
            if (m >= startTime[0] && m <= endTime[0]) {
                return true;
            }
        }
        return false;
    }

    // Parse Time
    const parseTime = (str) => {
        var hours = str.substring(0, 2);
        var minutes = str.substring(3, 5);

        if (hours.substring(0, 1) === "0")
            hours = parseInt(hours.substring(1, 2));
        else
            hours = parseInt(hours.substring(0, 2));

        if (minutes.substring(0, 1) === "0")
            minutes = parseInt(minutes.substring(1, 2));
        else
            minutes = parseInt(minutes.substring(0, 2));

        return [parseInt(hours), parseInt(minutes)];
    }


    // Save alert rows into database
    const saveAlerts = async (alert) => {
        await fetch('savealerts/dashboardOne/'.concat(alert))
            .then(response => response.status)
            .then(response => {
                if (!response) {

                }
            }
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    // Get last alert indexes (use elsewhere)
    const initialiseAlerts = async () => {
        await fetch('getalerts/dashboardOne')
            .then(response => response.json())
            .then(response => {
                addFirstRows(response)
            }
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    const addFirstRows = (response) => {
        if (response.length === 0 || response === null || response === undefined) {
            // Restart Animation
            console.log('Is empty ');
            //  this.setState({ disableAnimation: true });
            return;
        }

        setIsUpdating(true);

        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            priority_queue.enqueue(item.Id);
            array[i] = item.Index;
        }

        const stack = randomizeStack(response.length);
        triggerAnimation(props.addToStyleMap, array, stack);
    }

    // Save alert rows into database
    const deleteAlerts = async (id) => {
        // Read notifications from database
        await fetch('deletealerts/dashboardOne/'.concat(id))
            .then(response => response.json())
            .then(response => {
            }
                //   this.addFirstRows(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    const triggerAnimation = (callback, array, stack) => {


        const animationTime = setInterval(() => {
            if (stack.length === 0) {
                //   console.log('Continue animation ');
                setIsUpdating(false);
                setContinueAnimation(false);
                setDisableAnimation(true);
                clearInterval(animationTime);
            }

            let index = stack.pop();

            // 
            for (const [key, value] of array.entries()) {
                if (index == parseInt(value)) {
                    // TableCache.setDisableScroll(true);
                    const item = array[index];
                    const count = parseInt(item[0]);
                    const state = item[1];
                    const delay = item[2];

                    console.log(' index ' + index);

                    _addToNotificationsMenu(index); // Sync to notifications
                    callback(count, state, delay, 0);
                    deleteAlerts(JSON.stringify(index));
                    setUpdateNotifications(false);
                    break;
                }
            }
        }, 7200);

        animationTime();
    }

    // Trigger alert automatically
 let autoAlert = (callback) => {
        // FETCH SAVE TO DATABASE
        setContinueAnimation(true);
        TableCache.setDisableScroll(true);
        const autoInterval = setTimeout(() => {
            // If the animation is safe to continue
            if (this.state.continueAnimation) {
                console.log('Call Animation ');

                // Add stocks to array and priority priority_queue;
                let index = 0;
                let length = 0;
                while (index < 897) {
                    const cache = AlertCache.get(index);
                    let inRange = 0;

                    // Bearish
                    if (PriceSettings.getStartPrice() > PriceSettings.getTargetPrice())
                        inRange = (cache.CurrentPrice <= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice >= PriceSettings.getTargetPrice());
                    else // Bullish
                    {
                        inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice <= PriceSettings.getTargetPrice());
                    }

                    const priceDetectionEnabled = PriceSettings.getPriceDetectionEnabled();
                    const currentPrice_state = parseInt(cache.ChangeArray[0]);
                    const state = AlertReducer(currentPrice_state);

                    if (priceDetectionEnabled) {
                        //console.log('STATE 2' + state + '  ' + currentPrice_state);
                        if (inRange) {
                            if (currentPrice_state !== 0) {
                                // Prevent adding an element twice
                                if (priority_queue.includes(index) == false) {
                                    priority_queue.enqueue(index);
                                    saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                    length++;
                                }

                                // Update existing element
                                array[index] = [index, state, 1600]
                            }
                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (priority_queue.includes(index) == false) {
                                priority_queue.enqueue(index);
                                saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                length++;
                            }

                            // Update existing element
                            array[index] = [index, state, 1600];
                        }
                    }
                    index++;
                }

                const stack = randomizeStack(length);
                if (stack.length === 0) {
                    // Restart Animation
                    setDisableAnimation(true);
                    return;
                }

                triggerAnimation(callback, array, stack);
                setContinueAnimation(false);
            }

        }, 10000);// AlertSettings.getAlertInterval()

        autoInterval();
    }

    // Trigger alert manually
   let manualAlert = (callback) => {
        TableCache.setDisableScroll(false);
        setContinueAnimation(true);
        const manualInterval = setTimeout(() => {
            if (this.state.continueAnimation) {
                console.log('NEXT ');

                // Add stocks to array and priority priority_queue;
                let index = 0;
                let length = 0;
                while (index < 897) {
                    const cache = AlertCache.get(index);

                    let inRange = 0;

                    // Bearish
                    if (PriceSettings.getStartPrice() > PriceSettings.getTargetPrice())
                        inRange = (cache.CurrentPrice <= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice >= PriceSettings.getTargetPrice());
                    else // Bullish
                    {
                        inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice <= PriceSettings.getTargetPrice());
                    }

                    const priceDetectionEnabled = PriceSettings.getPriceDetectionEnabled();
                    const currentPrice_state = parseInt(cache.ChangeArray[0]);
                    const state = AlertReducer(currentPrice_state);

                    if (priceDetectionEnabled) {
                        //console.log('STATE 2' + state + '  ' + currentPrice_state);
                        if (inRange) {
                            if (currentPrice_state !== 0) {
                                // Prevent adding an element twice
                                if (priority_queue.includes(index) == false) {
                                    priority_queue.enqueue(index);
                                    saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                    length++;
                                }

                                // Update existing element
                                this.array[index] = [index, state, 1600];
                            }
                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (priority_queue.includes(index) == false) {
                                priority_queue.enqueue(index);
                                saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                length++;
                            }

                            // Update existing element
                            array[index] = [index, state, 1600]
                        }
                    }
                    index++;
                }

                const stack = this.randomizeStack(length);
                if (stack.length === 0) {
                    // Restart Animation
                    setDisableAnimation(true);
                    return;
                }

                this.triggerAnimation(callback, array, stack);
                setContinueAnimation(false);
            }

        }, 10000);// AlertSettings.getAlertInterval()

        manualAlert();
    }

   const randomizeStack = (length) => {
        let stack = [];
        while (stack.length < length) {
            const index = parseInt(priority_queue.dequeue())
            stack.push(index);
        }

        let counter = length;
        while (0 !== counter) {
            let randId = Math.floor(Math.random() * length);
            // Swap it with the current element.
            let tmp = stack[counter];
            stack[counter] = stack[randId];
            stack[randId] = tmp;

            counter--;
        }

        return stack;
    }
    
    // **************************************************
    // Save Notifications
    // **************************************************

   const saveNotifications = async (notifications) => {
        await fetch('savenotifications/'.concat(notifications))
            .then(response => response.status)
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    // Add Notifications to notifications menu
    const _addToNotificationsMenu = async (index) => {
        const stock = TableCache.get(index).StockCode;
        const currentPrice_state = parseInt(TableCache.get(index).ChangeArray[0]);
        const currentPrice = parseInt(TableCache.get(index).CurrentPrice);
        const previousPrice = parseInt(TableCache.getPreviousPrice(index));

        let obj = notifications(index, stock, previousPrice, currentPrice, currentPrice_state);

        //if (!(obj === null || obj === undefined))
        saveNotifications(JSON.stringify(obj));
    }

    // **********************************************************

    // Enable/Disable Menu of Notifications
    const enableNotificationsMenu = (e) => {
        setNotificationsMenuVisible(!notificationsMenuVisible);
    }

    // Initialise Notifications
    const initialiseNotifications = (alert, time) => {
        notifications.push(
            <div class="record"
                style={{
                    position: "relative", color: "black", top: "10px",
                    fontFamily: 'Times New Roman', letterSpacing: '1.5px'
                }}>
                {alert}
                <br />
                {time}
            </div>
        );

        setNotifications_temp(notifications);
        setUpdateNotifications(true);
    }

    // Add notification to Menu
    const addToNotificationsMenu = (id, stock, previousPrice, currentPrice,
        startPrice, targetPrice, state) => {

        let alert;
        switch (state) {
            case 3:
                alert = `${stock} has increased to a price of ${currentPrice}
                prev: ${previousPrice} start price: ${startPrice}  Bullish signal warning`
                break;
            case 2:
                alert = `${stock} has increased to a price of ${currentPrice}
                prev: ${previousPrice} Bullish signal`
                break;
            case 1:
                alert = `${stock} has hit target price of ${targetPrice}
                prev: ${previousPrice} current: ${currentPrice} Bullish signal`
                break;
            case -1:
                alert = `${stock} has dropped to price of ${currentPrice}
                prev: ${previousPrice} Bearish signal`
                break;
            case -2:
                alert = `${stock} has dropped to price of ${currentPrice}
                start price: ${startPrice} Bearish signal warning`
                break;
            case -3:
                alert = `${stock} has hit target price of ${targetPrice}
                prev: ${previousPrice} Bearish signal`
                break;
        }
        const date = new Date();
        const h = (date.getHours() + 7) >= 24 ? Math.abs(24 - (date.getHours() + 7))
            : date.getHours() + 7;
        let m = date.getMinutes().toPrecision(2);

        if (m < 10) {
            m = date.getMinutes();
        }
        const time = 'Alert Time: ' + h.toString() + ':' + m;

        initialiseNotifications(alert, time)
        let obj;
        if (!(alert === null || alert === undefined)) {
            obj =
            {
                Id: parseInt(id),
                Alert: alert.toString(),
                TimeStamp: time
            }
        }


        setNotifications_temp(notifications);
        setUpdateNotifications(true);

        return obj;
    }

    // Call notifications
   const _notifications = (id, stock, previousPrice, currentPrice, state) => {
        let targetPrice;
        let startPrice;

        let globalStartPrice = PriceSettings.getStartPrice();
        let globalTargetPrice = PriceSettings.getTargetPrice();

        startPrice = globalStartPrice;
        targetPrice = globalTargetPrice;

        // User specifies a Bearish criteria
        if (startPrice > targetPrice) {
            if (currentPrice > startPrice) {

                state = 3; // Override state
            } else if (currentPrice < targetPrice) {
                state = -3;
            }

            // User specifies a Bullish criteria
        } else if (startPrice < targetPrice) {

            if (currentPrice < startPrice) {
                state = -2;
            } else if (currentPrice >= targetPrice) {
                state = 1;
            }
        }
        else // If the prices are equal
        {
            if (currentPrice < startPrice) {
                state = -2;
            } else if (currentPrice >= targetPrice) {
                state = 1;
            }
        }

        // Default states: 2, -1
        const obj = addToNotificationsMenu(id, stock, previousPrice, currentPrice,
            startPrice, targetPrice, state);

        return obj;
    }

    manualAlert = throttle(manualAlert, 1000);
    autoAlert = throttle(autoAlert, 1000);


    return (
        <>
            <Button
                class="toggleNotifications"
                onClick={enableNotificationsMenu}>
                Notifications
            </Button>

            <div class="dropdown-content">
                <Box
                    style={{ position: 'absolute' }}
                    visibility={(notificationsMenuVisible) ? 'visible' : 'hidden'}
                    min-width='19.25rem'
                    width='22.25rem'
                    height='40.25rem'
                    overflowY='auto'
                    bg='rgb(230,230,230)'
                    top='52px'
                    left='1115px'
                    backgroundColor='wheat.800'
                    zIndex='999'
                >
                    {notifications}
                </Box>
            </div>
        </>
    );
}

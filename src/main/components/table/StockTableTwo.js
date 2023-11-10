import React, { Component, PureComponent, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider, Tab
} from '@chakra-ui/react';
import { Notification } from '../notifications/Notification';
import TableCache from '../../cache/TableCache.js';
import AlertSettings from '../../settings/AlertSettings.js';
//import { AlertContext } from '../../../context/AlertContext';

import throttle from 'lodash.throttle';
import * as HashMap from 'hashmap';
import * as cache from 'cache-base';

// Fetch data for dash board one
const StockTableTwo = (props) => {
    let timeout = null;
    let initialiseSearch = false;
    let textInput = useRef();
    let styleMap = new HashMap();
    let multiplier = 50;
    let scrollEnd = 16; // Max rows to scroll to

    let updateTableData = false;
    let triggerAnimation = false;

    const [green, setGreen] = useState(false);
    const [red, setRed] = useState(false);
    const [priceChangeUp, setPriceChangeUp] = useState(false);
    const [validInput, setValidInput] = useState(false);
    const [display, setDisplay] = useState([]);
    const [stockRecord, setStockRecord] = useState(0);
    const [scroll, setScroll] = useState(1);
    const [query, setQuery] = useState({});
    const [queryRes, setQueryRes] = useState(false);
    const [start, setStart] = useState(0);
    const [maxScroll, setMaxScroll] = useState(456);

    const [tb2, setTb2] = useState([]);
    const [tb2_style, setTb2_style] = useState([]);
    const [tb2_temp, setTb2_temp] = useState([]);
    const [tb2_scrollPosition, setTb2_scrollPosition] = useState([]);
    const [tb2_updateTable, setTb2_updateTable] = useState(0);
    const [tb2_stack, setTb2_stack] = useState(false);
    const [tb2_cache, setTb2_cache] = useState([]);
    const [tb2_count, setTb2_count] = useState(1);
    const [tb2_numberOfClicks, setTb2_numberOfClicks] = useState([]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true);
    const [scrollUp_, setScrollUp_] = useState(0);
    const [scrollDown_, setScrollDown_] = useState(false);
    const [updateStyleMap, setUpdateStyleMap] = useState(0);
    const [isSelected, setIsSelected] = useState(456);
    const [lock, setLock] = useState(true);
    const [target, setTarget] = useState(0);
    const [scrollUpdated, setScrollUpdated] = useState(false)
    const [triggerAlertID, setTriggerAlertID] = useState(false);
    const [triggerAlertColor, setTriggerAlertColor] = useState("");
    const [triggerAlert, setTriggerAlert] = useState("");



    const [clickedAlertTableRowID, setClickedAlertTableRowID] = useState(0);

    const [disableScrolling, setDisableScrolling] = useState(false);
    const [alertInterval, setAlertInterval] = useState(30000);
    const [maximumAlertNotifications, setMaximumAlertNotifications] = useState(11);
    const [cachedRows, setCachedRows] = useState([]);
    const [enableAlerts, setEnableAlerts] = useState(false);

    const [cache, setCache] = useState(new cache());
    const [animationsCache, setAnimationCache] = useState(new cache());
    const [toggleAlert, setToggleAlert] = useState(false);

    useEffect(() => {
        let id;
        for (id = 0; id < 897; id++) {
            styleMap.set(id, {});
        }
        setScroll(scrollBy());
    }, [])

    useEffect(() => {
        const scroll = scrollBy();
        // Update cache from data feed
        if (props.updateCache) {
            // console.log('SJ ' + this.props.state.updateCache);
            setCache(TableCache.cache()); // Cannot access value immediately
            console.log(TableCache.cache());
            // Update table data (fix)
            if (updateTableData === false) {
                console.log('props ' + props.updateCache
                    + '   ' + updateTableData);

                createTable()
                updateTable(15)
                updateTableData = true;
                setEnableAlerts(true);
            }

            //this.updateCache(false);
        } else
            // Trigger if Hide Bullish/Bearish Stocks Enabled
            if (TableCache.getUpdateHideStocks()) {
                console.log('  ---->  ' + 'THESE ARE MY STOCKS!');
                newTable()
                setStart(tb2_scrollPosition * 50);

                if (start === 0)
                    textInput.current.scrollTop = 10;
                else
                    textInput.current.scrollTop = 25;

                TableCache.setDisableScroll(false);
                TableCache.setUpdateHideStocks(false);
            }
            else if (props.saveSettings) {
                setToggleAlert(true);
                props.toggleSettings(false);
            }
            // Highlight rowtable if selected
            else if (isSelected) {
                newTable()
                setStart(tb2_scrollPosition * 50);
                setIsSelected(false);
            }
            // Update if scrolled
            else if (props.tb2_count === 1) {
                newTable()
                setStart(tb2_scrollPosition * 50);
                console.log('SCROLL ');

                if (start === 0)
                    textInput.current.scrollTop = 10;
                else
                    textInput.current.scrollTop = 25;

                resetTableID(null); // Reset id
                setScrollUpdated(true);
                setTb2_count(0);
            }
            // Search for a stock
            else if (validInput) {
                setTb2_scrollPosition((tb2_scrollPosition <= 17) ? getUnits(scroll) : 17)
                if (start === 0)
                    textInput.current.scrollTop = 10;
                else
                    textInput.current.scrollTop = 25;

                resetTableID(stockRecord); // Reset id
                setValidInput(false);
                setQueryRes(false);
            }
            // Animation
            else if (updateStyleMap) {
                if (AlertSettings.getAuto()) {
                    setTb2_scrollPosition((getUnits(scroll) <= 17) ? getUnits(scroll) : 17)
                    // Top half or Bottom Half
                    const stockRecord_ = stockRecord;
                    let rem = stockRecord_ % 50;
                    textInput.current.scrollTop = parseInt((rem * (795 / 50)) + 55);
                }
                else if (AlertSettings.getManual()) {
                    newTable()
                    updateTable(start);
                }

                setUpdateStyleMap(updateStyleMap);
            }
    }, [props.updateCache, props.tb2_count, props.saveSettings, isSelected,
        validInput, updateStyleMap])

    // Scrolling
    useEffect(() => {
        if (tb2_scrollPosition) {
            newTable();
            setStart(tb2_scrollPosition * 50);
            updateTable(start);
        }
        else if (start && isSelected) {
            updateTable(start)
        }
        else if (start) {
            updateTable(start);
        }
    }, [tb2_scrollPosition, start])


    const toggleUserAlert = (state) => {
        setToggleAlert(state);
    }

    const resetTableID = (id) => {
        setClickedAlertTableRowID(id);
    }

    // Disable scrolling
    const disableUserScrolling = (e) => {
        setDisableScrolling(e.target.checked);
    }

    const setScrollUpdate = (bool) => {
        setScrollUpdated(bool);
    }

    // Search box retrieves stocks from database
    const searchDatabase = async (e) => {
        // e.preventDefault();
        let input = new String(e.target.value);

        if (input.length < 1) {
            setQueryRes(false);
            setDisplay("No Stocks Found");
        }

        // Buggy, fix nulls
        if (!(!input || /^\s*$/.test(input))) {
            await fetch('searchstock/'.concat(input))
                .then(response => response.text())
                .then(data =>
                    setQuery(JSON.parse(data)),
                    setQueryRes(true),
                    searchRecords()
                ).catch(error =>
                    console.log("error " + error),
                    //setValidInput(false)
                );
        }
        else {
            setValidInput(false);
            setDisplay("No Stocks Found");
        }
    }

    // Select Stocks from dropdown list
    const selectRecords = (e) => {
        setValidInput(true);
        // this.forceUpdate(); // replace with hooks
        var id = new Number(e.target.id);
        console.log("Selected Id " + id);
        setStockRecord(id);
        const scroll = scrollBy();
        setTb2_scrollPosition((tb2_scrollPosition <= 17) ? getUnits(scroll) : 17)
    }

    // Calculate units to scroll to a specific position in the table
    const getUnits = (scroll) => {
        const stockRecord_ = stockRecord;
        let rem = stockRecord_ % 50;
        let units = parseInt((stockRecord_ - rem) / 50);

        return units;
        /*   let units = parseFloat((((scroll / 800) / 2) % 1).toFixed(2));
           let integer = Math.trunc(((scroll / 800) / 2));
     
           console.log("units " + units + ' ' + " integer " + integer);
           // Get Integer part
           if (units < 0.4)
               units = integer;
           else if (units > 0.4 && units < 0.7)
               units = integer + 0.5;
           else
               units = integer + 1;
     
           return units;*/
    }

    // Units to scroll by to find record in search stocks
    const scrollBy = () => {
        const height = 790;
        const scroll = 33;

        const stockRecord_ = stockRecord;
        let heightUnits = (stockRecord_ / scroll);
        let count = height * heightUnits;

        return count;
    }

    const getDisplay = () => {
        return display;
    }

    // create searchable records from dropdown list
    const searchRecords = () => {
        var string = [];
        let arr = query.stockCode;

        if (arr !== undefined) {
            let count;
            for (count = 0; count < arr.length; count++) {

                let splitStr = arr[count].toString().split(',');
                let id = new Number(splitStr[0]);
                let value = splitStr[1];

                string.push(
                    <div
                        id={id}
                        class="record"
                        onClick={selectRecords}>
                        {value}
                        <br />
                    </div>
                );
            }
        }
        else {
            string.push("No Stocks Found");
            setValidInput(false);
        }

        setDisplay(string);
    }

    const freezeScrollPosition = async (e) => {
        setScroll(textInput.current.scrollTop);
        const result = await scroll_(e);
        if (result == "resolved") {
            // Check the position
            let position = loadFromCache();

            if (position !== 0) {
                scrollToPosition()
            }
            else {
                // Prevent re-rendering
                setIsUpdating(true);
            }
        }
        else {
            // 404
        }
    }

    // Trigger scrolling event
    const scroll_ = async (e) => {
        e.persist();
        return new Promise(resolve => {
            setTimeout(() => {
                e.stopPropagation();
                resolve('resolved');
            }, 900);
        });
    }

    /*
        units: 1 - Scroll Down
        units: -1 Scroll Up
        units: 0 No change
    */
    const loadFromCache = () => {
        if (disableScrolling || TableCache.getDisableScroll())
            return 0;

        let units = (scroll);

        setMaxScroll(
            (tb2_scrollPosition <= 1) ?
                458 : 800
        );

        return (units > maxScroll) ? 1 : (units <= 4) ? -1 : 0;
    }

    const scrollPosition = () => {
        return (scroll);
    }

    // Re-render table while scrolling down or scrolling up
    const scrollToPosition = () => {
        if (loadFromCache() === 1) {
            // Scroll Down
            setTb2_scrollPosition((tb2_scrollPosition <= 17) ?
                tb2_scrollPosition + 0.5 : 17
            );

            //    console.log('Scroll Down ' + this.state.tb2_scrollPosition)
            setTb2_count(1);
            setIsUpdating(false);
        }
        else if (loadFromCache() === -1) {
            // Scroll Up
            setTb2_scrollPosition((tb2_scrollPosition <= 1) ?
                0 : tb2_scrollPosition - 0.5
            );

            //  console.log('Scroll Up')
            setTb2_count(1);
            setIsUpdating(false);
        }
    }

    /* Select row from the table
       Triggers re-rendering of table */
    const selectRow = (e) => {
        var array = [];

        let style = {
            backgroundColor: ""
        };

        styleMap.set(target, style);

        const target = new Number(e.target.id);
        setTarget(target);

        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition = tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            setTb2_scrollPosition(0);
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = (tb2_scrollPosition * 50) - mod;

        //....................................

        style = {
            backgroundColor: "rgb(21,100,111)"
        };

        styleMap.set(target, style);

        for (id = start; id < end; id++) {
            // Get values from cache this.state.tb2_stack
            let list = (!priceDetection) ? TableCache.get(id) :
                TableCache.getOp(id);

            if (id == target) {

                array.push(
                    <tbody key={id} >
                        <tr style={styleMap.get(id)}>
                            <td id={id} onClick={selectRow}>{list.StockCode.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.TimeStamp.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.CurrentPrice.toString()} </td>
                            <td id={id} onClick={selectRow}>{list.High.toString()}</td>

                            <td id={id} onClick={selectRow}>{list.Low.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.Change.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.ChangeP.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.Volume.toString()}</td>
                        </tr>
                    </tbody>)
            }

            else {
                array.push(
                    <tbody key={id} >
                        <tr style={styleMap.get(id)}>
                            <td id={id} onClick={selectRow}>{list.StockCode.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.TimeStamp.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.CurrentPrice.toString()} </td>
                            <td id={id} onClick={selectRow}>{list.High.toString()}</td>

                            <td id={id} onClick={selectRow}>{list.Low.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.Change.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.ChangeP.toString()}</td>
                            <td id={id} onClick={selectRow}>{list.Volume.toString()}</td>
                        </tr>
                    </tbody>)
            }
        }

        setTb2_stack(array);
        setIsSelected(true);

        // Send Information to Display Stock
        selectStockTableRow(e);
    }

    const newTable = () => {
        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition = tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            setTb2_scrollPosition(0);
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = (tb2_scrollPosition * 50) - mod;

        var array = [];
        let style;

        // Use shallow compare
        for (id = start; id < end; id++) {
            if (id == target) {
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            // Get values from cache
            let list = (!priceDetection) ? TableCache.get(id) :
                TableCache.getOp(id);//this.state.cache.get(id.toString());


            //  console.log( 'WORK WORK ' + id);
            array.push(
                <tbody key={id} style={styleMap.get(id)}>
                    <tr >
                        <td id={id} onClick={selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={selectRow}>{list.High.toString()}</td>

                        <td id={id} onClick={selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.Change.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.ChangeP.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.Volume.toString()}</td>
                    </tr>
                </tbody>);
        }
        setTb2_stack(array);
    }

    const updateTable = (start) => {
        let mod = 0;
        let endMod = 50;
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition_ = tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition_ = 0;
            setTb2_scrollPosition(0);
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition_ === 0)
            mod = 0;
        else if (tb2_scrollPosition_ === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        // console.log('tb2 ' + tb2_scrollPosition);

        start = (start <= 15 || (start === undefined || start === null)) ? 0 : start - mod;

        /*   // Set start and end variables for FetchData
           this.props.setStart(start);
           this.props.setEnd(start + endMod);
           this.props.setUpdateNotifications(true);*/

        // Get values from cache
        let list = (!priceDetection) ? TableCache.get(start) :
            TableCache.getOp(start);
        //this.props.cache.get(start.toString());

        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>{list.StockCode.toString()}</th>
                                <th>{list.TimeStamp.toString()}</th>
                                <th>{list.CurrentPrice.toString()}</th>
                                <th>{list.High.toString()}</th>

                                <th>{list.Low.toString()}</th>
                                <th>{list.Change.toString()}</th>
                                <th>{list.ChangeP.toString()}</th>
                                <th>{list.Volume.toString()}</th>
                            </tr>
                        </thead>
                        {tb2_stack}
                    </table>
                </div>
            </div>
        </div>;

        setTb2(t);
    }


    /** styleMap : { color,  transition} */
    const addToStyleMap = (triggerAlertID, triggerAlertColor, time) => {
        //console.log(triggerAlertID + ' change ' + triggerAlertColor + ' time ' + time)
        let bool = true;
        let style;
        let i = 0;
        // Loop animation and add to style map
        let loop = setInterval(() => {
            if (bool) {
                style = {
                    backgroundColor: triggerAlertColor.toString(),
                    transition: 'background-color '.concat(`${time}ms linear`),
                };
            }
            else {
                style = {
                    backgroundColor: 'rgb(30,30,30)',
                    transition: 'background-color '.concat(`${time}ms linear`),
                };
            }

            styleMap.set(triggerAlertID, style);

            newTable()
            setStart(tb2_scrollPosition * 50);
            updateTable(start)
            setUpdateStyleMap(true);

            bool = !bool;

            if (i++ >= 3)
                clearInterval(loop);

        }, 2000);

        //   this.setState({ updateStyleMap: true });
        setStockRecord(triggerAlertID);
        setTriggerAlertID(triggerAlertID);
        setTriggerAlertColor(triggerAlertColor);
    }

    // Calculate interval and number of alert notifcations (Auto only)
    const setUserAlertInterval = () => {
        const triggerAlert = props.triggerAlert;
        const alertInterval = props.alertInterval;
        const startTime = props.startTime;
        const endTime = props.endTime;

        // Calculate number of notiifications
        let startTime_hours = startTime[0];
        let startTime_minutes = startTime[1];

        let endTime_hours = endTime[0];
        let endTime_minutes = endTime[1];

        // Calculate total minutes
        if (startTime_hours == 0) {
            startTime_minutes += 60;
        }
        else {
            startTime_minutes += (1 + startTime_hours) * 60;
        }

        if (endTime_hours == 0) {
            endTime_minutes += 60;
        }
        else {
            endTime_minutes += (1 + endTime_hours) * 60;
        }

        const maxNotifications = Math.round((Math.abs(startTime_minutes - endTime_minutes) / alertInterval));

        if (maxNotifications < 1) {
            window.alert("Increase Interval time frame");
        }
        setMaximumAlertNotifications(maxNotifications);
        setTriggerAlert(triggerAlert);
        setAlertInterval(alertInterval);
    }

    const createTable = () => {
        var table = [];
        let id;

        const priceDetection = (TableCache.getPriceDetection());
        const end = (!priceDetection) ? TableCache.getEnd() : 50;

        for (id = 0; id < end; id++) {
            // Get values from cache
            let list = TableCache.get(id); //this.state.cache.get(id.toString());

            tb2_stack.push(
                <tbody key={id} style={styleMap.get(id)}>
                    <tr>
                        <td id={id} onClick={selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={selectRow}>{list.High.toString()}</td>

                        <td id={id} onClick={selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.Change.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.ChangeP.toString()}</td>
                        <td id={id} onClick={selectRow}>{list.Volume.toString()}</td>
                    </tr>
                </tbody>)
        }
    }


    // **************************************************
    // Display Stock
    // **************************************************

    // Triggered when a table row is clicked
    const selectStockTableRow = (e) => {
        const alertTableId = parseInt(e.target.id);
        props.displayStock(alertTableId);
    }

    let stockTableTwoHeader = <table class="stockTableTwoHeader" aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Stock Name</th>
                <th>Time</th>
                <th>Price</th>
                <th>High</th>

                <th>Low</th>
                <th>Change</th>
                <th>ChangeP %</th>
                <th>Volume</th>
            </tr>
        </thead>
    </table>;

    return (
        <div>
       
            {/* STOCK TABLE TWO */}

            {<p>WISE</p>}
            
            <Box
                style={{ position: 'absolute', top: '877px', left: '60px' }}
                bg='rgb(30,30,30)'

                boxShadow='sm'
                textAlign='center'
                height='35px'
                width='60rem'
                rounded="lg"
                maxHeight='35px'
                margin='auto'
                zIndex='999'
                color='white'>

                <div style={{ position: 'absolute', top: '-5px', left: '5px' }}>
                    <input class="disableScrolling"
                        style={{
                            position: 'relative',
                            top: '1.475px'
                        }} type="checkbox" onChange={disableUserScrolling} />

                    <label id="disableScrolling"
                        style={{
                            position: 'relative',
                            top: '0px', left: '5px'
                        }}> Disable Scrolling</label>

                    <label id="hideBullishStocks" >Hide Bullish Stocks</label>
                    <input style={{
                        position: 'relative',
                        top: '1.475px',
                        left: '-100px'
                    }} class="hideBullishStocks" type="checkbox"
                    />

                    <label id="hideBearishStocks">Hide Bearish Stocks</label>
                    <input style={{
                        position: 'relative',
                        top: '1.475px',
                        left: '-90px'

                    }} class="hideBearishStocks" type="checkbox" />
                </div>

                {/* Search Box */}
                <div class="stockTableTwoMenu">
                    <div class="dropdown">

                        <InputGroup>
                            <Input
                                style={{
                                    position: 'absolute', top: '-7.5px',
                                    right: '16.5px', height: '29px',
                                    minWidth: '12.25rem',
                                    width: '12.25rem',
                                    color: 'black'
                                }}

                                onInput={searchDatabase}
                                placeholder="Search "
                            />

                            <InputRightElement
                                style={{
                                    position: 'absolute', top: '-7.5px'
                                }}
                                children={<img id="searchIcon" />} />
                        </InputGroup>

                        {/* Drop down Menu */}
                        <div class="dropdown-content">
                            <Box
                                min-width='12.25rem'
                                width='12.25rem'
                                height='8rem'
                                overflowY='auto'
                                bg='#f9f9f9'
                                top='0px'
                                backgroundColor='rgb(40,40,40)'>

                                {getDisplay()}

                            </Box>
                        </div>
                    </div>
                </div>

                {stockTableTwoHeader}

                <Box
                    style={tb2_style}
                    position='absolute'
                    overflowY='initial'
                    top='35px'
                    ref={textInput}
                    onScroll={freezeScrollPosition}
                    overflowX='hidden'
                    bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='800px'
                    width='62rem'
                    maxHeight='800px'
                    rounded="lg"
                    color='white'
                    zIndex='-999'>
                    {tb2}
                </Box>
            </Box>


            {/* StockTableTwo Alert Table Settings?
            ADD PROPS
            */}
            <Notification
                updateCache={props.updateCache}
                updateSettings={props.updateSettings}
                {...this} />

        </div>
    );
    /*  setInterval(() => {
             let i;
             for (i = 0; i < 897; i++) {
                 let list = this.props.state.cache.get(i.toString());
                 console.log("cache TWO " +
                     list.StockCode.toString() + " " +
                     list.High.toString() + " " +
                     list.CurrentPrice.toString() + " " +
                     list.Low.toString() + " " +
                     list.ProfitLoss.toString() + " " +
                     list.ProfitLoss_Percentage.toString() + " " +
                     list.Volume.toString()
                 )
             }
         }, 10000);*/
}

export default StockTableTwo;
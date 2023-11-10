import React, { Component, useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider, slideFadeConfig
} from '@chakra-ui/react';

import TableCache from '../../cache/TableCache';
import ResultsTable from './table/ResultsTable.js';
import TableHeader from './table/TableHeader';
import TableBody from './table/TableBody';
import * as cache from 'cache-base';
import * as HashMap from 'hashmap';

import _ from "lodash";

const StockPicker = (props) => {
    let textInput = useRef();
    let cache_ = new cache();
    let animationsCache = new cache();
    let styleMap = new HashMap();
    let intervalID;

    const [updateTableData, setUpdateTableData] = useState(false);
    const [stockTableBody, setStockTableBody] = useState([]);
    const [stockTableHeader, setStockTableHeader] = useState([]);
    const [scrollPos, setScrollPos] = useState(10);

    const [stockBody, setStockBody] = useState([]);



    const [stockHeader, setStockHeader] = useState([]);

    const [stockTable, setStockTable] = useState([]);
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
    const [request, setRequest] = useState("singleHistoricalPair");
    const [tb2_style, setTb2_style] = useState([]);
    const [tb2_temp, setTb2_temp] = useState([]);
    const [tb2_scrollPosition, setTb2_scrollPosition] = useState([]);
    const [tb2_updateTable, setTb2_updateTable] = useState(0);
    const [tb2_stack, setTb2_stack] = useState([]);
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
    const [toggleAlert, setToggleAlert] = useState(false);
    const [toggleTable, setToggleTable] = useState(false);

    // Scrolling 
    const maxHeight = 704;

    const [scrollPosition, setScrollPosition] = useState(10);
    const [performScroll, setPerformScroll] = useState(false);
    const [scrollDirection, setScrollDirection] = useState(0);
    const [scrollUpPointer, setScrollUpPointer] = useState(0);
    const [scrollDownPointer, setScrollDownPointer] = useState(0);

    const [increment, setIncrement] = useState(false);
    const [initialScroll, setInitialScroll] = useState(true);

    const tablePos = useRef();
    const totalPairs = 700;
    const pos = 0;

    // set scroll position
    useEffect(() => {
        if (scrollDirection === 1 || scrollDirection === -1)
            updatePointer();

    }, [scrollDirection]);

    // Update cache 
    useEffect(() => {
        if (enableAlerts) {
            if (props.fetchResults) {

                cache_.set(TableCache.cache()); // Cannot access value immediately
                //  console.log('props ' + props.fetchResults
                //    + '   ' + updateTableData);

                // lo
                setTimeout(() => {
                    createTable("singleHistoricalPair");
                }, 3000);

                const style = {
                    scrollTop: 500
                }

                setTb2_style(style);
                setEnableAlerts(true);
            }
        }
    }, [props.fetchResults]);

    useEffect(() => {
        setToggleTable(true);
        setUpdateTableData(false);
    }, [updateTableData]);

    useEffect(() => {
        if (props.fetchResults)
            updateTable();
    }, [increment]);

    const updatePointer = () => {
        if (scrollDirection === 1) {
            // Scroll Down
            setScrollDownPointer((scrollDownPointer < totalPairs) ? scrollDownPointer + 1 : totalPairs);
        }
        else if (scrollDirection === -1) {
            // Scroll Up
            setScrollDownPointer((scrollDownPointer > 0) ? scrollDownPointer - 1 : 0);
        }

        if (scrollDirection !== 0)
            setIncrement(true);
    }

    const createTable = (request) => {
        const startRow = 0;
        const endRow = 25;

        const pointer = scrollDownPointer;
        const start = pointer + startRow;
        const end = pointer + endRow;

        const tableHeader = [];

        const headerList = TableCache.get(start);
        tableHeader.push(<TableHeader list={headerList} request={request} />);

        const tableBody = [];

        for (let id = start; id < end; id++) {
            const list = TableCache.get(id);
            tableBody.push(<TableBody list={list} styleMap={styleMap}
                selectRow={selectRow} request={request} />);
        }

        setTable(tableBody, tableHeader); // Set table
        tablePos.current.scrollTop = 0;
    }

    /**
     * Updates the table once it is scrolled
     * 
     * @param {*} scrollDirection 
     * @param {*} scrollDownPointer 
     * @param {*} scrollUpPointer 
     */
    const updateTable = () => {
        const startRow = 0;
        const endRow = 25;

        const pointer = scrollDownPointer;
        const start = pointer + startRow; // could be imporved
        const end = pointer + endRow;

        const tableHeader = [];

        const headerList = TableCache.get(start);
        tableHeader.push(<TableHeader list={headerList} request={request} />);

        const tableBody = [];

        for (let id = start; id < end; id++) {
            const bodylist = TableCache.get(id);
            bodylist.id = id;
            tableBody.push(<TableBody list={bodylist} styleMap={styleMap}
                selectRow={selectRow} request={request} />);
        }

        // Set table
        setTable(tableBody, tableHeader);

        let scrollTop = 525.5;

        if (scrollDirection === -1)
            scrollTop = 70;
        else if (scrollDirection === 1)
            scrollTop = 525.5;

        tablePos.current.scrollTop = scrollTop;
        setIncrement(false);
    }

    // Methods to be moved to another class
    const setTable = (tableBody, tableHeader) => {
        setStockHeader(tableHeader); // Set header
        setStockBody(tableBody); // Set body
    }

    // Controls scroll speed
    const delayScroll = async (e) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }

    /*
      units: 1 - Scroll Down
      units: -1 Scroll Up
      units: 0 No change
    */
    const scrollToPosition = (scrollPosition) => {
        const scrollDownRange = maxHeight - 170;
        const scrollUpRange = 0;
        const scrollDown = _.inRange(scrollPosition, scrollDownRange, scrollDownRange + 150);
        const scrollUp = _.inRange(scrollPosition, scrollUpRange, scrollUpRange + 25);

        return (scrollDown) ? 1 : (scrollUp) ? -1 : 0; // scroll up or scroll down
    }

    const handleScrollInRange = async (e, scrollPosition) => {
        const resolved = await delayScroll(e);
        let res = 0;
        if (resolved) {
            res = scrollToPosition(scrollPosition);

            // We do not want to scroll up in the first row or last row
            if (res === -1 && scrollDownPointer === 0
                || res === 1 && scrollDownPointer === totalPairs - 1)
                res = 0;

            setScrollDirection(res);
        }
    }

    const handleScroll = async (e) => {
        const scrollPosition = await e.currentTarget.scrollTop;
        setScrollPosition(scrollPosition);
        handleScrollInRange(e, scrollPosition);
    }


    // Scrolling
    /*  useEffect(() => {
          if (tb2_scrollPosition) {
              createTable();
              setStart(tb2_scrollPosition * 50);
              setHeader(start);
          }
          else if (start && isSelected) {
              setHeader(start)
          }
          else if (start) {
              setHeader(start);
          }
      }, [tb2_scrollPosition, start]) 

    const getDisplay = () => {
        // return display;
    }

    const disableUserScrolling = (e) => {
    }*/

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
                    //  onClick={selectRecords}
                    >
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
    /*
        const setScrollPosition = (scrollPosition) => {
            setScrollPos(scrollPosition);
        }*/

    /* Select row from the table
       Triggers re-rendering of table */
    const selectRow = (e) => {
        var array = [];

        let style = {
            backgroundColor: ""
        };

        styleMap.set(target, style);

        var target = new Number(e.target.id);
        setTarget(target);

        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const max = 17;
        let tb2_scrollPosition = scrollPos;

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = (tb2_scrollPosition * 50) - mod;

        style = {
            backgroundColor: "rgb(21,100,111)"
        };

        styleMap.set(target, style);

        for (id = start; id < end; id++) {
            // Get values from cache this.state.tb2_stack
            let list = TableCache.get(id);

            list.id = id;
            array.push(<TableBody list={list} styleMap={styleMap} selectRow={selectRow} />)
        }

        setTb2_stack(array);
        setIsSelected(true);

        // Send Information to Display Stock
        //    selectStockTableRow(e);
    }

    const selectStockTableRow = (e) => {
        const alertTableId = parseInt(e.target.id);
        props.displayStock(alertTableId);
    }

    /* ***************************************************** */

    const Header = (props) => {
        const request = props.request;
        const header = (request === "singleHistoricalPair")
            ? singleHistoricalPairHeader : singleHistoricalPairDaily;
        return header;
    }

    // Change class
    const singleHistoricalPairHeader =
        <table class="stockPickerHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Close</th>
                    <th>Volume</th>
                    <th>Select</th>
                </tr>
            </thead>
        </table>;

    const singleHistoricalPairDaily = <table class="stockPickerHeader" aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Date</th>
                <th>Open</th>
                <th>Low</th>
                <th>High</th>
                <th>Close</th>
                <th>Volume</th>
                <th>AdjClose</th>
                <th>UnadjustedVolume</th>
                <th>Change</th>
                <th>ChangePercent</th>
                <th>Vwap</th>
                <th>Low</th>
                <th>Label</th>
                <th>ChangeOverTime</th>
            </tr>
        </thead>
    </table>;

    return (
        <>
            {/* STOCK PICKER */}
            {toggleTable && (<Box
                style={{ position: 'absolute', top: '140px', left: '4px' }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='35px'
                width='26rem'
                rounded="lg"
                maxHeight='35px'
                margin='auto'
                zIndex='0'
                color='white'>

                <Header request={request} />

                <Box
                    id="resultsTable"
                    position='absolute'
                    overflowY='initial'
                    top='35px'
                    onScroll={handleScroll}
                    ref={tablePos}
                    overflowX='hidden'
                    bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='100px'
                    width='26rem'
                    maxHeight='200px'
                    rounded="lg"
                    color='white'
                //    zIndex='-999'
                >
                    <ResultsTable scrollPosProps={setScrollPosition}
                        header={stockHeader} body={stockBody} totalPairs={600} />
                </Box>
            </Box>)}
        </>
    );
}

export default StockPicker;


/*updateTable={updateTable}body={stockTableBody}
    const getUnits = (scroll) => {
        const stockRecord_ = stockRecord;
        let rem = stockRecord_ % 50;
        let units = parseInt((stockRecord_ - rem) / 50);
        return units;
    }

    // Units to scroll by to find record in search stocks
    // Dummy method for reference to the scroller
    // Search Feature
    const scrollBy = () => {
        const height = 790;
        const scroll = 33;
        const stockRecord_ = stockRecord;
        let heightUnits = (stockRecord_ / scroll);
        let count = height * heightUnits;

        return count;
    }

    /*
    const selectRecords = (e) => {
        setValidInput(true);
        var id = new Number(e.target.id);
        console.log("Selected Id " + id);
        setStockRecord(id);
        const scroll = scrollBy();
        setTb2_scrollPosition((tb2_scrollPosition <= 17) ? getUnits() : 17)
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
    }*/



















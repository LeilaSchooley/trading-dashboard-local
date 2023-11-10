import React, { Component, useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';

import TableCache from '../../cache/TableCache.js';
import TableHeader from './table/TableHeader';
import StockTable from './table/StockTable.js';
import TableBody from './table/TableBody';
import * as cache from 'cache-base';
import * as HashMap from 'hashmap';

const StockPicker = (props) => {
    let textInput = useRef();
    let cache_ = new cache();
    let animationsCache = new cache();
    let styleMap = new HashMap();
    let intervalID;

    const [updateTableData, setUpdateTableData] = useState(false);
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
    const [tb2_header, setTb2Header] = useState([]);
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

    // Update cache 
    useEffect(() => {
        if (props.children.load) {
            // console.log('Stocks ' + this.props.state.updateCache);
            cache_.set(TableCache.cache()); // Cannot access value immediately
            if (!updateTableData) {
                console.log('props ' + props.children.load
                    + '   ' + updateTableData);

                createTable();
                //     updateTable();
                setEnableAlerts(true);
            }
        }
    }, []);

    useEffect(() => {
        if (updateTableData) {
            const list = TableCache.get(0);
            const header = <TableHeader list={list} rows={tb2_stack} />;
            setTb2Header(header);
            setTb2(tb2_stack);
            setUpdateTableData(false);
        }
    }, [updateTableData]);

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
      }, [tb2_scrollPosition, start]) */

    const getDisplay = () => {
        // return display;
    }

    const disableUserScrolling = (e) => {
    }

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
        let tb2_scrollPosition = tb2_scrollPosition;

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
        selectStockTableRow(e);
    }

    const selectStockTableRow = (e) => {
        const alertTableId = parseInt(e.target.id);
        props.displayStock(alertTableId);
    }

    const updateTable = () => {
        let mod = 0;
        let endMod = 50;
        let end;
        const max = 17;
        const _tb2_scrollPosition = tb2_scrollPosition ;

        if (_tb2_scrollPosition === 0)
            mod = 0;
        else if (_tb2_scrollPosition === max) {
            endMod = 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (_tb2_scrollPosition * 50) + endMod;
        let start = (_tb2_scrollPosition * 50) - mod;

        const table = [];
        let style;

        // Use shallow compare
        for (let id = start; id < end; id++) {
            if (id == target) {
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            // Get values from cache
            let list = TableCache.get(id);
            list.id = id;
            table.push(<TableBody list={list} styleMap={styleMap} selectRow={selectRow} />);
        }

        setTb2_stack(table);
        setHeader(start, mod);
    }

    const setHeader = (start, mod) => {
        start = (start <= 15 || (start === undefined || start === null)) ? 0 : start - mod;
        // Get values from cache
        let list = TableCache.get(start);
        const tableHeader = <TableHeader list={list} header={tb2_stack} />
        setTb2(tableHeader);
    }

    const createTable = () => {
        const table = [];
        const end = 50;
        for (let id = 0; id < end; id++) {
            // Get values from cache
            let list = TableCache.get(id);
            console.log(list);
            list.id = id;
            table.push(
                <TableBody key={id} list={list} styleMap={styleMap} selectRow={selectRow} />
            )
        }
        setTb2_stack(table);
        setUpdateTableData(true);
    }

    const getUnits = (scroll) => {
        const stockRecord_ = stockRecord;
        let rem = stockRecord_ % 50;
        let units = parseInt((stockRecord_ - rem) / 50);
        return units;
    }

    // Units to scroll by to find record in search stocks
    // Search Feature
    const scrollBy = () => {
        const height = 790;
        const scroll = 33;

        const stockRecord_ = stockRecord;
        let heightUnits = (stockRecord_ / scroll);
        let count = height * heightUnits;

        return count;
    }

    const selectRecords = (e) => {
        setValidInput(true);
        var id = new Number(e.target.id);
        console.log("Selected Id " + id);
        setStockRecord(id);
        const scroll = scrollBy();
        setTb2_scrollPosition((tb2_scrollPosition <= 17) ? getUnits() : 17)
    }

    /*
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
        <>
            {/* STOCK PICKER */}
            {toggleTable && (<Box
                style={{ position: 'absolute', top: '275px', left: '60px' }}
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
                    //  onScroll={freezeScrollPosition}
                    overflowX='hidden'
                    bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='400px'
                    width='32rem'
                    maxHeight='800px'
                    rounded="lg"
                    color='white'
                    zIndex='-999'>
                    <StockTable header={tb2_header} body={tb2} />
                </Box>
            </Box>)}
        </>
    );
}

export default StockPicker;
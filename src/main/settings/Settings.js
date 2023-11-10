import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import PriorityQueue from 'priority-q';
import throttle from 'lodash.throttle';
import * as cache from 'cache-base';
import { TimePicker } from 'antd';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper, fadeConfig
} from '@chakra-ui/react';

import TableCache from '../cache/TableCache.js';
import PriceSettings from './PriceSettings.js';
import AlertSettings from './AlertSettings.js';

/*export const Settings = (props) => {

    const [toggleAnimation, setToggleAnimation] = useState(false);
    const [_startTime, setStartTime] = useState('9:00');
    const [_endTime, setEndTime] = useState('17:00');
    const [disableStartTime, setDisableStartTime] = useState(false);
    const [disableEndTime, setDisableEndTime] = useState(false);
    const [manualDisabled, setManualDisabled] = useState(false);
    const [autoDisabled, setAutoDisabled] = useState(false);
    const [_manualAlert, setManualAlert] = useState(false);
    const [autoAlert, setAutoAlert] = useState(false);

    const format = 'HH:mm';

    useEffect(() => {
        // Initialise settings on load
        initialiseAlertSettings();
    }, []);

    const saveSettingsToDatabase = async (alertsettings, pricesettings) => {
        await fetch('savesettings/dashboardOne/'.concat(alertsettings) + '/'.concat(pricesettings))
            .then(response => response.json())
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    const saveConfiguration = () => {
        // AlertSettings.setAlertInterval(this.alertFrequencyRef.current.value);

        // Set Alert Times
         Detect Change in Alert Settings
        if (AlertSettings.getManual() !== manualAlert
            || AlertSettings.getAuto() !== autoAlert) {

            if (autoAlert) {
                let ans = window.confirm("Scrolling is disabled in auto mode, proceed?")
                if (!ans)
                    return;
            }

            AlertSettings.setManual(manualAlert);
            AlertSettings.setAuto(autoAlert);
            AlertSettings.setUpdateAlertSettings(true);
        }

        if (!autoAlert) {
            TableCache.setDisableScroll(false);
        }
         
                // Override all prices if enabled
                if (this.state.overrideGlobalPrices) {
                    if (PriceSettings.getStartPrice() !== this.state.globalStartPrice
                        || PriceSettings.getTargetPrice() !== this.state.globalTargetPrice) {
                        AlertSettings.setUpdateAlertSettings(true);
                    }
        
        
                    PriceSettings.setGlobalStartPrice(this.state.globalStartPrice);
                    PriceSettings.setGlobalTargetPrice(this.state.globalTargetPrice);
                }
        
                // Enable Price Detection
                if (PriceSettings.getPriceDetectionEnabled() !== this.state.enablePriceDetection) {
                    AlertSettings.setUpdateAlertSettings(true);
                    PriceSettings.setPriceDetectionEnabled(this.state.enablePriceDetection);
                }
        
                // Set variables for hiding bullish and bearish stocks
                if (this.state.hideBullishStocks && !PriceSettings.getHideBullishStocks()) {
                    this.hideBullishStocksConfig();
                    PriceSettings.sethideBullishStocks(true);
                    AlertSettings.setUpdateAlertSettings(true);
                } else if (!this.state.hideBullishStocks) {
                    PriceSettings.sethideBullishStocks(false);
                }
        
                if (this.state.hideBearishStocks && !PriceSettings.getHideBearishStocks()) {
                    this.hideBearishStocksConfig();
                    PriceSettings.sethideBearishStocks(true);
                    AlertSettings.setUpdateAlertSettings(true);
                } else if (!this.state.hideBearishStocks) {
                    PriceSettings.sethideBearishStocks(false);
                }
        
                if (AlertSettings.getUpdateAlertSettings()) {
                    var state = window.confirm("Are you sure you want to apply these changes? \n" +
                        "New settings will be applied");
                    if (!state) {
                        this.setState({ saveSettings: false });
                        AlertSettings.setUpdateAlertSettings(false);
                        return;
                    }
        
                    window.alert("New settings applied");
                    // Save to database
                    this.setState({ saveSettings: true });
                }

        saveSettingsToDatabase(AlertSettings.getAlertSettings(), PriceSettings.getPriceSettings());
    }

    const initialisePriceSettings = async () => {
        await fetch('getpricesettings/dashboardOne/')
            .then(response => response.json())
            .then(response => {
                this.getPriceSettings(response)
            }
            )
            .catch(error => {
                console.log("error 5 " + error) // 404
                return;
            }
            );
    }

    const initialiseAlertSettings = async () => {
        await fetch('getalertsettings/dashboardOne/')
            .then(response => response.json())
            .then(response => {
                getAlertSettings(response)
                console.log(response);
            }
            )
            .catch(error => {
                console.log("error 5 " + error) // 404
                return;
            }
            );
    }

    const getAlertSettings = (response) => {
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);

            if (item.StartTime === null || item.StartTime === undefined
                || item.EndTime === null || item.EndTime === undefined
                || item.AlertInterval === null || item.AlertInterval === undefined
                || item.Auto === null || item.Auto === undefined
                || item.Manual === null || item.Manual === undefined ||

                item.SettingsTriggered === null || item.SettingsTriggered === undefined
            ) {
                console.log(' Nullable ');
                return;
            }

            setStartTime(item.StartTime);
            setEndTime(item.EndTime);

            AlertSettings.setTime(item.StartTime, item.EndTime);

            AlertSettings.setAlertInterval(item.AlertInterval);
            AlertSettings.setManual(item.Manual);
            AlertSettings.setAuto(item.Auto);


            if (item.Manual) {
                setManualAlert(true);
                setAutoAlert(false);
                setDisableStartTime(true);
                setDisableEndTime(true);
                // Disable auto alert checkbox 
                setManualDisabled(false);
                setAutoDisabled(true);
            }
            else if (item.Auto) {
                setAutoAlert(true);
                setManualAlert(false);

                // Disable auto alert checkbox 
                setManualDisabled(true);
                setAutoDisabled(false);
            }

            AlertSettings.setUpdateAlertSettings(true);
        }
    }

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

    // change to schema
    const startTime = (time, timeString) => {
        const _time = parseTime(timeString.toString().trim());

        if (_time[0] >= 17 && _time[0] <= 24 || _time[0] >= 0 && _time[0] <= 8) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        setStartTime(timeString);

        AlertSettings.setTime(_startTime, _endTime);
    }

    const endTime = (time, timeString) => {
        const _time = parseTime(timeString.toString().trim());

        if (_time[0] >= 17 && _time[0] <= 24 || _time[0] >= 0 && _time[0] <= 8) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        setEndTime(timeString);

        AlertSettings.setTime(_startTime, _endTime);
    }

    const manualAlert = (e) => {
        setManualAlert(manualAlert);

        setDisableStartTime(e.target.checked);
        setDisableEndTime(e.target.checked);

        // Disable auto alert checkbox 
        setAutoAlert(autoDisabled);

        if (AlertSettings.getManual() !== manualAlert
        || AlertSettings.getAuto() !== autoAlert) {

        if (autoAlert) {
            let ans = window.confirm("Scrolling is disabled in auto mode, proceed?")
            if (!ans)
                return;
        }

        AlertSettings.setManual(_manualAlert);
        AlertSettings.setAuto(autoAlert);
        AlertSettings.setUpdateAlertSettings(true);
    }

    }

    return (
        <>
            <Box
                style={{ position: 'absolute', top: '475px', left: '1160px', zIndex: 0 }}
                //     bg='rgb(30,30,30)'
                boxShadow='sm'
                textAlign='center'
                height='45px'
                width='50rem'
                rounded="lg"
                margin='auto'
                color='white'
            >
                <table class="settings" aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Start <br /> Time</th>
                            <th>End  <br /> Time</th>
                            <th>Manual</th>
                            <th>Auto</th>
                            <th>Start Price </th>
                            <th>Stop Price </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td >
                                <div class="startTime">
                                    <TimePicker defaultValue={moment('9:00', format)}
                                        disabled={disableStartTime}
                                        format={format}
                                        value={moment(_startTime, format)}
                                        disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                        onChange={startTime}
                                    />
                                </div>
                            </td>
                            <td>
                                <div class="endTime">
                                    <TimePicker defaultValue={moment('16:59', format)}
                                        disabled={disableStartTime}
                                        format={format}
                                        value={moment(_endTime, format)}
                                        disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                        onChange={endTime}
                                    />
                                </div>
                            </td>
                            <td>
                                <input class="manualAlerts" type="checkbox"
                                    checked={_manualAlert}
                                    disabled={manualDisabled}
                                    onChange={manualAlert}
                                />

                            </td>
                            <td>

                                <input class="autoAlerts" type="checkbox"
                                // checked={this.state.autoAlert}
                                // disabled={this.state.autoDisabled} onChange={this.setAutoAlert} 
                                />
                            </td>
                            <td>
                                <div class="startPrice">
                                    <NumberInput
                                        isDisabled={false}
                                        //     onChange={this.setGlobalStartPrice}
                                        style={{ top: '0px' }}
                                        size="md" min={0} maxW={70} defaultValue={0} precision={2} step={0.2}>
                                        <NumberInputField />
                                        <NumberInputStepper >
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </div>
                            </td>
                            <td>
                                <div class="endPrice">
                                    <NumberInput
                                        isDisabled={false}
                                        style={{ top: '0px' }}
                                        //onChange={this.setGlobalTargetPrice}
                                        size="md" min={0} maxW={70} defaultValue={0} precision={2} step={0.2}>
                                        <NumberInputField />
                                        <NumberInputStepper >
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button
                    style={{ position: 'relative', top: '-36.5px', left: '180px', zIndex: '-999' }}
                    class="saveConfiguration" onClick={saveConfiguration}>Save Configuration
                </button>


            </Box>
        </>
    );











}*/
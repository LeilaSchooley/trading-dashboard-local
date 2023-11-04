import React, { Component } from 'react';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import { Menu, Dropdown, TimePicker } from 'antd';

import StockTableTwo from '../table/StockTableTwo';
import { SavedStockTable } from '../table/SavedStockTable';
import { Settings } from '../../settings/Settings';
import PriceSettings from '../../settings/PriceSettings.js';
import AlertSettings from '../../settings/AlertSettings.js';
import TableCache from '../../cache/TableCache.js';
import TableSettings from '../../settings/TableSettings.js';
//import { AlertContext } from '../../../context/AlertContext';

const date = new Date();

const DashboardNavbar = () => {
    /*constructor(props) {
        super(props);
        this.array = [];
        this.getStartTime = React.createRef(); // Replace ref with onclick, store and retrieve state
        this.getEndTime = React.createRef();
        this.alertFrequencyRef = React.createRef();
        this.dateTime = new Date();
        this.alertInterval_ = null;

        /*
          this.state = {
              animationTime: 5000,
              alertEnabled: false,
              alertInterval: 1000,
              triggerAlert: false,
  
              startTime: "09:00",
              endTime: "16:59",
              startTimeValue: "09:00",
  
              notifications_temp: [],
              notifications: [
                  /*    { <div style={{
                           position: 'absolute', color: "black", fontSize: '22px',
                           fontWeight: 800, float: 'left'
                       }}>
                           Notifications <br/>
                       </div> 
              ],
  
              manualNotifications: false,
              autoNotifications: false,
              enablePriceDetection: false,
              overrideGlobalPrices: false,
              setNotifications: false,
              notificationsEnabled: 0,
              globalStartPrice: 0,
              globalTargetPrice: 0,
              manualAlert: false,
              autoAlert: false,
              manualDisabled: false,
              autoDisabled: false,
              hideBearishStocks: false,
              hideBullishStocks: false,
  
              hideBearishStocksDisabled: false,
              hideBullishStocksDisabled: false,
  
              disableStartTime: false,
              disableEndTime: false,
              disableSetPrice: true,
  
              state: {},
  
              startPriceInput: null,
              targetPriceInput: null,
  
              // Display Stock
              stockInfoName: [],
              stockInfoHeader: [],
              stockInfoPrevPrice: [],
              stockInfoCurrPrice: [],
              stockInfoCode: [],
              updateStockInfo: false,
              alertMessagePopUp: "",
  
              updateNotifications: false,
              notificationsMenuVisible: false,
              clickedAlertTableRowID: null,
              addAlertTableRowBool: false,
              removeAlertTableRowBool: false,
              isSelected: false,
  
              // D1
              saveSettings: false,
              toggleAlert: false,
              update: false
          };*/
    
    /*
        componentDidMount() {
            this.initialieSettings();
            this.initialieAlertSettings();
        }
    
        componentDidUpdate = (prevProps, prevState, snapshot) => {
            if (this.state.updateNotifications) {
                this.setState({ notifications: this.state.notifications_temp });
                this.setState({ updateNotifications: false });
            }
            if (this.state.updateStockInfo) {
                this.setState({ stockInfoHeader: this.state.stockInfoName[0] });
                this.setState({ stockInfoPrevPrice: this.state.stockInfoName[1] });
                this.setState({ stockInfoCurrPrice: this.state.stockInfoName[2] });
                this.setState({ stockInfoCode: this.state.stockInfoName[3] });
    
                this.setState({ updateStockInfo: false });
            }
            if (this.state.update) {
                this.update(false);
            }
    
        }*/

    return (
        <>

            <StockTableTwo {...this} />
            <Settings {...this} />
            <SavedStockTable {...this} />

        </>
    );

}



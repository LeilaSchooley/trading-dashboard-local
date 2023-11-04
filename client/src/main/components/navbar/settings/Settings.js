
   /* initialiseStartPriceInput(value, bool) {
        var t = [];

        t.push(<>
            <p id="priceRange">Price Range</p>
            <div class="startPrice">
                <p id="startPriceLabel">Start Price</p>
                <NumberInput
                    isDisabled={bool}
                    onChange={this.setGlobalStartPrice}
                    style={{ top: '5px' }}
                    size="md" min={0} maxW={70} defaultValue={value} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        this.setState({ startPriceInput: t })
    }

    initialiseTargetPriceInput(value, bool) {
        var t = [];

        t.push(<>
            <div class="endPrice">
                <p id="endPriceLabel">Target Price</p>
                <NumberInput
                    isDisabled={bool}
                    onChange={this.setGlobalTargetPrice}
                    size="md" min={0} maxW={70} defaultValue={value} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        this.setState({ targetPriceInput: t })

    }

    getAlertSettings(response) {
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

            this.setState({ startTime: item.StartTime });
            this.setState({ endTime: item.EndTime });

            AlertSettings.setTime(item.StartTime, item.EndTime);

            AlertSettings.setAlertInterval(item.AlertInterval);
            AlertSettings.setManual(item.Manual);
            AlertSettings.setAuto(item.Auto);


            if (item.Manual) {
                this.setState({ manualAlert: true });
                this.setState({ autoAlert: false });
                this.setState({ disableStartTime: true });
                this.setState({ disableEndTime: true });
                // Disable auto alert checkbox 
                this.setState({ manualDisabled: false });
                this.setState({ autoDisabled: true });
            }
            else if (item.Auto) {
                this.setState({ autoAlert: true });
                this.setState({ manualAlert: false });

                // Disable auto alert checkbox 
                this.setState({ manualDisabled: true });
                this.setState({ autoDisabled: false });
            }

            AlertSettings.setUpdateAlertSettings(true);
        }
    }

    // ************************************************************
    // Save all settings
    // ************************************************************
    saveConfiguration() {
        // AlertSettings.setAlertInterval(this.alertFrequencyRef.current.value);
        AlertSettings.setTime(this.state.startTime, this.state.endTime);

        // Set Alert Times
        // Detect Change in Alert Settings
        if (AlertSettings.getManual() !== this.state.manualAlert
            || AlertSettings.getAuto() !== this.state.autoAlert) {

            if (this.state.autoAlert) {
                let ans = window.confirm("Scrolling is disabled in auto mode, proceed?")
                if (!ans)
                    return;
            }

            AlertSettings.setManual(this.state.manualAlert);
            AlertSettings.setAuto(this.state.autoAlert);

            AlertSettings.setUpdateAlertSettings(true);
        }

        if (!this.state.autoAlert) {
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

        this.saveSettingsToDatabase(AlertSettings.getAlertSettings(), PriceSettings.getPriceSettings());
    }

    // **************************************************

    // hideStocksConfig
    hideBullishStocksConfig() {
        // Create a Signal Graph
        this.bullishInterval = setInterval(() => {

            if (!PriceSettings.getHideBullishStocks()) {
                // Disable Price Detection
                TableCache.setDisableScroll(false);
                TableCache.setPriceDetection(false);
                TableCache.setUpdateHideStocks(true);
                clearInterval(this.bullishInterval);
            }
            TableCache.setDisableScroll(true);
            TableCache.hideBullishStocks();

        }, 60000);
    }

    // hideStocksConfig
    hideBearishStocksConfig() {
        // Create a Signal Graph
        this.bearishInterval = setInterval(() => {
            if (!PriceSettings.getHideBearishStocks()) {
                // Disable Price Detection
                TableCache.setDisableScroll(false);
                TableCache.setPriceDetection(false);
                TableCache.setUpdateHideStocks(true);
                clearInterval(this.bearishInterval);
            }
            TableCache.setDisableScroll(true);
            TableCache.hideBearishStocks();

        }, 60000);
    }

    withinAlertTime() {
        const startTime = this.parseTime(AlertSettings.getStartTime());
        const endTime = this.parseTime(AlertSettings.getEndTime());

        const h = (date.getHours() + 8) >= 24 ? Math.abs(24 - (date.getHours() + 8))
            : date.getHours() + 8;
        const m = date.getMinutes();

        if ((h >= 17 && h <= 24) || (h >= 0 && h <= 8)) {
            return false;
        }

        if (h >= startTime[0] && h <= endTime[0]) {
            if (m >= startTime[0] && m <= endTime[0]) {
                return true;
            }
        }
        return false;
    }

    setStartTime(time, timeString) {
        const _time = this.parseTime(timeString.toString().trim());

        if ((_time[0] >= 17 && _time[0] <= 24) || (_time[0] >= 0 && _time[0] <= 8)) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        this.setState({ startTime: timeString });
    }

    setEndTime(time, timeString) {
        const _time = this.parseTime(timeString.toString().trim());

        if (_time[0] >= 17 && _time[0] <= 24 || _time[0] >= 0 && _time[0] <= 8) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        this.setState({ endTime: timeString });
    }

    // Set hide Bullish Stocks
    setHideBullishStocks(e) {
        this.setState({ hideBullishStocks: e.target.checked });

        this.setState({ hideBearishStocksDisabled: !this.state.hideBearishStocksDisabled });

    }
    // Set hide Bearish Stocks
    setHideBearishStocks(e) {
        this.setState({ hideBearishStocks: e.target.checked });

        this.setState({ hideBullishStocksDisabled: !this.state.hideBullishStocksDisabled });
    }

    //Set Global Start Price
    setGlobalStartPrice(startPrice) {
        this.setState({ globalStartPrice: startPrice });
    }

    // Set Global Target Price
    setGlobalTargetPrice(targetPrice) {
        this.setState({ globalTargetPrice: targetPrice });
    }

    // Enable Price Detection Bool
    setPriceDetectionEnabled(e) {
        this.setState({ enablePriceDetection: e.target.checked });

        var t = [];
        var t2 = [];
        t.push(<>
            <p id="priceRange">Price Range</p>
            <div class="startPrice">
                <p id="startPriceLabel">Start Price</p>
                <NumberInput
                    isDisabled={!this.state.disableSetPrice}
                    onChange={this.setGlobalStartPrice}
                    style={{ top: '5px' }}
                    size="md" min={0} maxW={70} defaultValue={this.state.globalStartPrice} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        t2.push(<>
            <div class="endPrice">
                <p id="endPriceLabel">Target Price</p>
                <NumberInput
                    isDisabled={!this.state.disableSetPrice}
                    onChange={this.setGlobalTargetPrice}
                    size="md" min={0} maxW={70} defaultValue={this.state.globalTargetPrice} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);
        this.setState({ startPriceInput: t })
        this.setState({ targetPriceInput: t2 })
        this.setState({ disableSetPrice: !this.state.disableSetPrice });
    }

    // Override Global Prices Bool
    overrideGlobalPrices(e) {

        this.setState({ overrideGlobalPrices: e.target.checked });
    }

    // Checkbox that enables manual alert
    setManualAlert(e) {
        this.setState({ manualAlert: e.target.checked });

        this.setState({ disableStartTime: e.target.checked });
        this.setState({ disableEndTime: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ autoDisabled: !this.state.autoDisabled });
    }

    // Checkbox that enables auto alert
    setAutoAlert(e) {
        this.setState({ autoAlert: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ manualDisabled: !this.state.manualDisabled });
    }

    parseTime(str) {
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

    // **************************************************
    // Add to Historical Table
    // **************************************************

    async idExists(target) {
        return new Promise(resolve => {
            if (this.state.clickedAlertTableRowID === null
                || this.state.clickedAlertTableRowID === undefined) {
                resolve(false);
            }
            resolve(true);
        });
    }

    addToHistorical(e) {
        this.addToHistoricalTable();
    }


    // Add to History Table
    async addToHistoricalTable() {
        const res = await this.idExists();
        if (!res) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }

        const target = parseInt(this.state.clickedAlertTableRowID);
        const json = TableCache.get(target);
        console.log('target ' + target);
        let txt;
        if (isNaN(target) || (target === null || target === undefined)) {
            window.alert("No target is clicked ");
        }
        else {
            var r = window.confirm("Add to Historical Table?");
            if (r == true) {
                txt = "Yes";
            } else {
                txt = "Cancel";
            }

            const jsonString = await this.getJSON(json);

            // if (txt === "Yes") {
            const res = await this.saveHistoricalData(jsonString);
            console.log('Historical data added? ' + res);
            // window.alert(returned message)             window.alert('Maximum stocks for portfolio exceeded, limit: 200 ');
            //}
        }
    }

    async saveHistoricalData(data) {
        await fetch('savehistoricaldata/temp/'.concat(data))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return false;
                }
                else return true;
            })
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    async getJSON(json) {
        const today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var _today = yyyy + 'a' + mm + 'a' + dd;

        const obj = { Id: json.Id, Date: _today };
        var jsonString = JSON.stringify(obj);

        return jsonString;
    }

    // **************************************************
    // **************************************************
    // Display Stock
    // **************************************************

    // Triggered when a table row is clicked
    displayStock(stockID) {

        console.log('Clicked ' + stockID)

        var info = [];

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '270px', color: 'white' }}>
            {TableCache.get(stockID).StockName}</h1>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '75px', left: '270px', color: 'white' }}>
            Previous: {TableCache.getPreviousPrice(stockID)}</h2>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '120px', left: '270px', color: 'white' }}>
            Price: {TableCache.get(stockID).CurrentPrice}</h2>);

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '0px', color: 'white' }}>
            {TableCache.get(stockID).StockCode}</h1>);


        this.setState({ clickedAlertTableRowID: stockID });
        this.setState({ stockInfoName: info });

        this.setState({ updateStockInfo: true });
    }

    // **************************************************
    // **************************************************
    // Saved Stock Rows
    // **************************************************

    // Select Row Setter
    selectAlertTableRow(e) {
        const alertTableId = parseInt(e.target.id);
        this.setState({ clickedAlertTableRowID: alertTableId });
        this.setState({ isSelected: true });
        this.update(true);
    }

    setAddAlertTableRowBool(state) {
        this.setState({ addAlertTableRowBool: state });
        if (state === true) {
            this.update(true);
        }
    }

    removeStock(e) {
        if (this.state.clickedAlertTableRowID === null
            || this.state.clickedAlertTableRowID === undefined) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }
        var userselection = window.confirm("Are you sure you want to delete this stock ?");
        if (userselection == true) {
            this.setRemoveAlertTableRowBool(true);
            this.update(true);
        }
    }

    setRemoveAlertTableRowBool(state) {
        this.setState({ removeAlertTableRowBool: state });
        if (state === true) {
            this.update(true);
        }
    }

    setIsSelected(state) {
        this.setState({ isSelected: state });
        if (state === true) {
            this.update(true);
        }
    }

       const selectMarket =
            <select class="selectMarket" name="Select Market" value="Bursa Malaysia">
                <option value="Bursa Malaysia" disabled>Bursa Malaysia</option>
            </select>;

        const alertFrequency =
            <select class="alertFrequency" name="Frequency"
                ref={this.alertFrequencyRef}
                disabled={this.state.disableStartTime}>
                <option value="60000">1 Minute</option>
                <option value="300000">5 Minutes</option>
                <option value="600000">10 Minutes</option>
                <option value="900000">15 Minutes</option>
                <option value="1800000">30 Minutes</option>
                <option value="3600000">1 Hour</option>
                <option value="10800000">3 Hours</option>
            </select>;

        const custom_alertFrequency = <input class="customalertFrequency" type="number" id="quantity"
            name="quantity" min="1" max="240" />

        const format = 'HH:mm';

        const startTime =
            <div class="startTime">
                <TimePicker defaultValue={moment('9:00', format)}
                    disabled={this.state.disableStartTime}
                    format={format}
                    value={moment(this.state.startTime, format)}
                    disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={this.setStartTime} />
            </div>;

        const endTime =
            <div class="endTime">
                <TimePicker defaultValue={moment('16:59', format)}
                    disabled={this.state.disableEndTime}
                    format={format}
                    value={moment(this.state.endTime, format)}
                    disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={this.setEndTime} />
            </div>;

        const state = {
            toggleTab: false,
            showTab: this.showTab
        }

        return (
            <>
                <div class="DashboardNavbar">
                    <Box
                        style={{ position: 'absolute', top: '120px', left: '1075px' }}
                        bg='rgb(40,40,40)'
                        boxShadow='sm'
                        height='305px'
                        width='50rem'
                        rounded="lg"
                        margin='auto'
                        zIndex='0'>

                        {this.state.stockInfoCode}
                        {this.state.stockInfoHeader}
                        {this.state.stockInfoPrevPrice}
                        {this.state.stockInfoCurrPrice}

                        <button onClick={() => { this.setAddAlertTableRowBool(true) }}
                            style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}
                            class="addToHistorical">
                            Add <br />to Table</button>

                        <button onClick={this.removeStock}
                            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}
                            class="addToHistorical">
                            Remove  <br /> from Table</button>

                        <button
                            style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}
                            onClick={this.addToHistorical}
                            class="addToHistorical"
                        >
                            Add to <br /> Historical</button>
                    </Box>
    */
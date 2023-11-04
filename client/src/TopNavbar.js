import React, { Component, useState, useContext } from 'react';
import { Box, Select } from '@chakra-ui/react';
import './Dashboard.css';

import { Router, Route, Switch } from 'react-router';
import { Menu, Button } from 'antd';
import { Redirect } from "react-router-dom";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SyncOutlined,
  NotificationOutlined,
  SettingOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';


export const TopNavbar = props => {

  const [collapsed, toggleCollapsed] = useState(false);


  // toggleCollapsed(!collapsed);


  /*           
              {Index}
              {MSCap}
              {Ace} */
  /* const Screener = <h4 id="stockScreener">StockScreener</h4>
   const Dashboard = <h4 id="dashboard">{"Dashboard: "}{props.Data[0].dashboardNum}</h4>
   const Index = <h4 id="index">{"KLCI: "}{props.Data[0].indexValue}{' ( ' + props.Data[0].indexPercentage + ' )'}</h4>

   //const startScan = <h3 id="startScan">{"Start Scan: "}{props.Data[0].startScan}</h3>
   //const lastScan = <h3 id="lastScan">{"Last Scan: "}{props.Data[0].lastScan}</h3>
   const MSCap = <h3 id="msCap">{"MSCap: "}{props.Data[0].msCap}{' ( ' + props.Data[0].msCapPercentage + ' )'}</h3>
   const Ace = <h3 id="Ace">{"ACE: "}{props.Data[0].ACE}{' ( ' + props.Data[0].ACEpercentage + ' )'}</h3>*/


  function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    var today = yyyy + '-' + mm + '-' + dd;
    return today.toString();
  }


  // Return NavBar
  return (
    <div >
      <Menu
        style={{
          position: 'absolute', left: 0, top: 0, minWidth: '1900px', width: '100vw',
          height: '60px', margin: 0,
          backgroundColor: 'rgb(40,40,40)',
          fontSize: '20px',
          zIndex: '-999'
        }}
        inlineCollapsed={collapsed}
      >

        <p style={{ position: "absolute", left: "70px", bottom: "8px", color: 'white' }}> {props.state.dashboard} </p>
        <p style={{ position: "absolute", left: "250px", bottom: "8px", color: 'white' }}> Account: Test </p>
        <p style={{ position: "absolute", left: "410px", bottom: "8px", color: 'white' }}> Date: {getDate()} </p>
        <p style={{ position: "absolute", right: "70px", bottom: "8px", color: 'white' }}> Version 1.00 </p>
      </Menu>

      {/*
            <Box
                style={{ position: 'absolute', top: '0px', left: '60px', zIndex: -999 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='4rem'
                width='115rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>

                <p id="selectDashboard">Dashboard A</p>
  
            

            </Box>*/}
    </div>
  );
};


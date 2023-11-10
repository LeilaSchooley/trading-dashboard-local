import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import DashboardOne from '../src/main/DashboardOne';
import { Router, Route, Switch } from 'react-router';

import { SideMenu } from './SideMenu';
import { DataFeed } from './DataFeed';

import './custom.css'
import 'antd/dist/antd.css';

import { TopNavbar } from './TopNavbar.js';

class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super();

    this.redirect = this.redirect.bind(this);
    this.getUpdateCache = this.getUpdateCache.bind(this);
    this.sideMenu = this.sideMenu.bind(this);
    this.update = this.update.bind(this);

    this.state = {
      redirect: [],
      updateCache: false,
      update: true,
      sidemenu: null,
      topmenu: null,
      toggleTab: false,
      dashboard: "Dashboard One"
    };
  }

  componentDidMount() {
    /*<Redirect to='/' />;*/
    this.setState({ sidemenu: <SideMenu {...this} /> });

    switch (this.props.location.pathname) {
      case '/DashboardOne':
        this.setState({ dashboard: "Dashboard 1" });
        break;
      case '/DashboardTwo':
        this.setState({ dashboard: "Dashboard 2" });
        break;
      case '/Scanner':
        this.setState({ dashboard: "Scanner" });
        break;
      case '/HistoricalTable':
        this.setState({ dashboard: "Historical Table" });
        break;
      case '/Portfolio':
        this.setState({ dashboard: "Portfolio" });
        break;
      default:
        break;
    }
    this.setState({ update: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.update) {
      //this.setState({ topmenu: <TopNavbar {...this}  /> });
      this.setState({ update: false });
    }



  }

  update(update) {
    this.setState({ update: update });
  }


  redirect(key) {
    this.sideMenu(key);
    let redirect = [];
    switch (key) {
      case 9:
        redirect.push(<Redirect to='/DashboardOne' />);
        this.setState({ dashboard: "Dashboard 1" });
        break;
      case 10:
        redirect.push(<Redirect to='/DashboardTwo' />);
        this.setState({ dashboard: "Dashboard 2" });
        break;
      case 12:
        redirect.push(<Redirect to='/Scanner' />);
        this.setState({ dashboard: "Scanner" });
        break;
      case 13:
        redirect.push(<Redirect to='/HistoricalTable' />);
        this.setState({ dashboard: "Historical Table" });
        break;
      case 14:
        redirect.push(<Redirect to='/Portfolio' />);
        this.setState({ dashboard: "Portfolio" });
        break;
      default:
        break;
    }

    this.setState({ redirect: redirect });
    this.setState({ update: true });
  }

  getUpdateCache(update) {
    this.setState({ updateCache: update });
  }

  sideMenu(key) {
    switch (key) {
      case 9:
        this.setState({
          sidemenu: <SideMenu {...this}
            style={{ position: 'absolute', minHeight: '1200px', width: '55px', height: '100vh', margin: 0, zIndex: '999' }}
          />
        });
        this.setState({ update: true });
        break;
      case 12:
        this.setState({
          sidemenu: <SideMenu {...this}

          />
        });
        this.setState({ update: true });
        break;
      case 13:
        this.setState({ sidemenu: <SideMenu {...this} /> });
        this.setState({ update: true });
        break;
      case 14:
        this.setState({ sidemenu: <SideMenu {...this} /> });
        this.setState({ update: true });
        break;
      default:
        break;
    }


  }

  showTab = () => {
    this.setState({ toggleTab: !this.state.toggleTab });
  }

  render() {
    const state = {
      toggleTab: false,
      showTab: this.showTab
    }

    return (<div >
      {/* <TopNavbar {...this} /> 
        Needs to be redesigned
      */} 
      
      {this.state.sidemenu}
      <DataFeed {...this} />
      {this.state.redirect}
   {/*   <NotificationsContext.Provider value={state}> </NotificationsContext.Provider>
    <Route path='/DashboardOne' component={() => <DashboardOne {...this} />} />
          <Route path='/DashboardTwo' component={() => <DashboardTwo {...this} />} />
          <Route path='/HistoricalTable' component={() => <FilterTable {...this} />} />
          <Route path='/Portfolio' component={() => <PortFolio {...this} />} />
          <Route path='/Scanner' component={() => <Scanner {...this} />} />
   */}

        <Switch>
          <Route exact path='/' component={() => <DashboardOne {...this} />} />
        </Switch>
        
    </div>
    );
  }
}
export default withRouter(App);
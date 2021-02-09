import React, { Component, useEffect } from "react";
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button'
import "./Home.css";
const $ = window.$;

export class Home extends Component {
  static displayName = Home.name;
  dashboards = null;
  pathToServer = "http://" + window.location.hostname + ":8080" + "/Dashboards/GetDashboardsNames";

  constructor(props) {
    super(props);

    this.loadDashboard = this.loadDashboard.bind(this);
    this.updateAvailableDashboards = this.updateAvailableDashboards.bind(this);;

    this.updateAvailableDashboards();
  }

  rendederAvailableDashboards(dashboardNames) {
    const listItems = dashboardNames.map((d) => {
      return <Button onClick={(e) => this.loadDashboard(d, e)}>{d}</Button>;
    });

    const element =
      <div>
        <Button onClick={this.updateAvailableDashboards}>Refresh</Button>
        <Button>+</Button>
        <h5 class="sidenavHeader">Dashboards:</h5>
        {listItems}
      </div>;

    ReactDOM.render(element, document.getElementById('dashboardList'));
  }

  loadDashboard(dashboardId) {
    $.ig.RevealUtility.loadDashboard(
      dashboardId,
      (dashboard) => {
        var v = new $.ig.RevealView("#revealView");
        v.dashboard = dashboard;
        console.log("Loaded");
      },
      (error) => console.log(error)
    );
  }

  updateAvailableDashboards() {
    fetch(this.pathToServer).then(r => {
      r.json().then(json => {
        this.dashboards = json;
        this.rendederAvailableDashboards(this.dashboards);
      });
    });
  }

  render() {
    return (
      <div id="dashboards">
        <div class="sidenav" id="dashboardList">

        </div>
        <div id="revealView" class="revealView">
        </div>
      </div>
    );
  }
}

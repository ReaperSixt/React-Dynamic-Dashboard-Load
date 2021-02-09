import React, { Component, useEffect } from "react";
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button'
import "./Home.css";
const $ = window.$;

export class Home extends Component {
  static displayName = Home.name;
  dashboards = null;

  constructor(props) {
    super(props);
    let pathToServer = "http://" + window.location.hostname + ":8080" + "/Dashboards/GetDashboardsNames"

    this.loadDashboard = this.loadDashboard.bind(this);
    fetch(pathToServer).then(r => {
      r.json().then(json => {
        this.dashboards = json;
        this.rendederAvailableDashboards(this.dashboards);
      });
    });
  }

  rendederAvailableDashboards(dashboardNames) {
    const listItems = dashboardNames.map((d) => {
      return <Button onClick={(e) => this.loadDashboard(d, e)}>{d}</Button>;
    });

    const element =
      <div>
        <h5 class="sidenavHeader">Dashboards</h5>
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

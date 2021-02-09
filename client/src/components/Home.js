import React, { Component } from "react";
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
    this.updateAvailableDashboards = this.updateAvailableDashboards.bind(this);
    this.createNewDashboard = this.createNewDashboard.bind(this);

    this.updateAvailableDashboards();
  }

  rendederAvailableDashboards(dashboardNames) {
    const listItems = dashboardNames.map((d) => {
      return <Button onClick={(e) => this.loadDashboard(d, e)}>{d}</Button>;
    });

    const element =
      <div>
        <Button onClick={this.updateAvailableDashboards}>Refresh</Button>
        <Button onClick={this.createNewDashboard}>+</Button>
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
        v.canEdit = false;
        v.canSaveAs = false;
        v.dashboard = dashboard;
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

  updateAvailableDashboards() {
    fetch(this.pathToServer).then(r => {
      r.json().then(json => {
        this.dashboards = json;
        this.rendederAvailableDashboards(this.dashboards);
      });
    });
  }

  async canSaveThisName(dashboardName) {

    const r = await fetch(this.pathToServer);
    return await r.json().then(json => {
      return !json.includes(dashboardName);
    });
  }

  createNewDashboard() {
    var home = this;
    var v = new $.ig.RevealView("#revealView");
    v.startInEditMode = true;
    v.onDataSourcesRequested = function (callback) {

      var rsDsi = new $.ig.RVLocalFileDataSourceItem();
      rsDsi.uri = "local:/Samples.xlsx";
      var excelDsi = new $.ig.RVExcelDataSourceItem(rsDsi);
      excelDsi.title = "Excel File With Selected Sheet";
      excelDsi.sheet = "Sales";
      var result = new $.ig.RevealDataSources([], [excelDsi], true);

      callback(result);
    };

    v.onSave = function (rv, args) {
      var eventArgs = args;
      var dbName = rv.dashboard.title;

      home.canSaveThisName(dbName).then(canSave => {
        console.log("canSave:" + canSave);

        if (canSave) {
          eventArgs.saveFinished();
          home.updateAvailableDashboards();
        }
        else {
          if (window.confirm("A dashboard with name:" + dbName + " already exists. Do you want to override it?")) {
            eventArgs.saveFinished();
            home.updateAvailableDashboards();
          }
        }
      });
    }
    v.dashboard = new $.ig.RVDashboard();

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

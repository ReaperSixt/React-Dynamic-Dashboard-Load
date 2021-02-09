import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Linking } from "./components/Linking";
import { Filters } from "./components/Filters";
import "./custom.css";
const $ = window.$;

export default class App extends Component {
  static displayName = App.name;
  constructor() {
    super();
    $.ig.RevealSdkSettings.setBaseUrl("http://localhost:8080/");
    var revealTheme = new $.ig.RevealTheme();
    revealTheme.dashboardBackgroundColor = "#00ff00";

    // Bellow you could find a snippet all theming options
    // Here is a blog post explainging in more detail the theming capabilities

    // revealTheme.accentColor = "rgb(15,96,69)";
    // revealTheme.regularFont = "Righteous";
    // revealTheme.mediumFont = "Caveat";
    // revealTheme.boldFont = "Domine";

    // revealTheme.conditionalFormatting.hiColor = "rgb(87,0,127)";
    // revealTheme.conditionalFormatting.lowColor = "rgb(158,0,232)";
    // revealTheme.conditionalFormatting.midColor = "rgb(198,137,229)";
    // revealTheme.conditionalFormatting.noneColor = "rgb(255,255,127)";

    // revealTheme.chartColors = ["rgb(248,53,255)", "rgb(248,53,75)", "rgb(54,247,160)", "rgb(130,53,244)", "rgb(235,242,138),rgb(239,139,219),rgb(38,116,68),rgb(108,147,178)"];

    // revealTheme.fontColor = "rgb(226,24,125)";
    // revealTheme.visualizationBackgroundColor = "rgb(221,224,37)";
    // revealTheme.useRoundedCorners = false;

    $.ig.RevealView.updateRevealTheme(revealTheme)
  }

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/filters" component={Filters} />
        <Route path="/linking" component={Linking} />
      </Layout>
    );
  }
}

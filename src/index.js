import React from "react";
import ReactDOM from "react-dom";
import StatisticsLineChart from "./StatisticsLineChart.js";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <StatisticsLineChart />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

import React from "react";
import ReactDOM from "react-dom";
import StatisticsLineChart from "./StatisticsLineChart.js";
import "./styles.css";
import { chartData } from "./chartData";

const labels = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00"
];

function App() {
  return (
    <div className="App">
      <StatisticsLineChart chartData={chartData} labels={labels} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

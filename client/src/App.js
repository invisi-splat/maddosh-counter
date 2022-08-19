import './App.css';
import { useState, useEffect } from "react";

import CurrentCount from "./components/CurrentCount";
import CountingLength from "./components/CountingLength";
import PieChart from "./components/PieChart";
import History from "./components/History";
import RecentActivity from "./components/RecentActivity";
import AvgDay from "./components/AvgDay";
import LastCount from "./components/LastCount";
import io from "socket.io-client";
import "animate.css";

const socket = io();

function App() {
  const [ data, setData ] = useState(null);
  const [ loading, setLoading ] = useState(true)

  const fetch_data = () => {
    fetch("/api")
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(data => {
        setData(data)
      })
      .catch(error => {
        console.log("Yikes! " + error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(fetch_data, [])

  useEffect(() => { socket.on("refresh", fetch_data); }, [])

  if (loading) {return (
    <div id="loading-wrapper">
      <div id="loading-data">Loading data</div>
      <div id="wont-be-a-minute">Won't be a minute! (I hope)</div>
    </div>
  )}
  else {
    return (
      <>
      <div id="top">
        <CountingLength className="counting-length" data={data}></CountingLength>
        <CurrentCount className="current-count" data={data}></CurrentCount>
        <PieChart data={data}></PieChart>
      </div>
      <History className="history-comp" data={data}></History>
      <div id="bottom">
        <RecentActivity data={data}></RecentActivity>
        <AvgDay className="avg-day-comp" data={data}></AvgDay>
        <LastCount className="last-day-comp" data={data}></LastCount>
      </div>
      </>
    )};
}

export default App;

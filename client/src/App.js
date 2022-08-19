import './App.css';
import { useState, useEffect } from "react";

import CurrentCount from "./components/CurrentCount";
import CountingLength from "./components/CountingLength";
import PieChart from "./components/PieChart";
import History from "./components/History";
import RecentActivity from "./components/RecentActivity";
import AvgDay from "./components/AvgDay";
import LastCount from "./components/LastCount";

function App() {
  const [ data, setData ] = useState(null);
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
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
  }, [])

  if (loading) { return "Loading..." }
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
        <RecentActivity className="recent-activity-comp" data={data}></RecentActivity>
        <AvgDay className="avg-day-comp" data={data}></AvgDay>
        <LastCount className="last-day-comp" data={data}></LastCount>
      </div>
      </>
    )};
}

export default App;

import React from "react";
import dayjs from "dayjs";

function AvgDay(props) {
    let output = {};
    const data = [...props.data].reverse()
    for (const doc of data) {
        const date = dayjs.unix(parseInt(doc.Date, 10)).format("DD/MM");
        if (output.hasOwnProperty(date)) {
            output[date] = output[date] + 1;
        } else {
            if (Object.keys(output).length === 7) break;
            output[date] = 1;
        }
    }
    const maxNum = parseInt(data[0]["Content"]);
    const movingAvg = Math.floor(
        Object.entries(output)
            .map(x => x[1])
            .reduce((a, b) => a + b, 0) / 7
        );
    const nextMilestone = Math.ceil(maxNum / 1000) * 1000;
    const timeToNextMilestone = Math.ceil((nextMilestone - maxNum) / movingAvg);

    return (
      <div id="avg-day-wrapper">
        <div id="milestone">
            <p><b>~{timeToNextMilestone}</b> days until we reach</p>
            <p><b>{nextMilestone}</b></p>
        </div>
        <div id="avg-day">
            <p>Average count per day (7 day moving average):</p>
            <p><b>{movingAvg}</b></p>
        </div>
      </div>
    )
  }

export default AvgDay;
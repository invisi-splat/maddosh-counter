import React, { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function CountingLength(props) {
    const startTime = parseInt(props.data[0]["Date"], 10) * 1000; // ms
    const [ time, setTime ] = useState(dayjs.duration(Date.now() - startTime));

    let p = Array(6).fill("s");
    if (time.years() === 1) p[0] = "";
    if (time.months() === 1) p[1] = "";
    if (time.days() === 1) p[2] = "";
    if (time.hours() === 1) p[3] = "";
    if (time.minutes() === 1) p[4] = "";
    if (time.seconds() === 1) p[5] = "";

    const formatted_time = time.format(`Y [year${p[0]}], M [month${p[1]}], D [day${p[2]}], H [hour${p[3]}], m [minute${p[4]}], [and] s [second${p[5]}]`);
    setInterval(() => { setTime(dayjs.duration(Date.now() - startTime)) }, 1000);

    return (
      <div id="counting-length">
        <p>We have been counting for</p>
        <p><b>{formatted_time}</b></p>
      </div>
    )
  }

export default CountingLength;
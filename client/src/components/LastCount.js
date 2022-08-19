import React, { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

function LastCount(props) {
    const recent = props.data.at(-1)
    const [ time, setTime ] = useState(dayjs.duration((Date.now() - parseInt(recent["Date"], 10) * 1000) * -1));

    setInterval(() => { setTime(dayjs.duration((Date.now() - parseInt(recent["Date"], 10) * 1000) * -1)) }, 1000);

    return (
        <div id="last-count">
            <p>Last count:</p>
            <div>
                <span>{recent["Author"]}</span>
                <span>{recent["Content"]}</span>
            </div>
            <p>{time.humanize(true)}</p>
        </div>
    );
}

export default LastCount;
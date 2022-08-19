import React from "react";
import { Chart as ChartJS, registerables } from 'chart.js'; // haha me lazy
import { Bar } from 'react-chartjs-2';
import { randomColor } from "randomcolor";
import dayjs from "dayjs";

ChartJS.register(...registerables);

function aggregate_data(data) {
    let output = {};
    data = [...data].reverse()
    for (const doc of data) {
        const date = dayjs.unix(parseInt(doc.Date, 10)).format("DD/MM");
        if (output.hasOwnProperty(date)) {
            output[date] = output[date] + 1;
        } else {
            if (Object.keys(output).length === 7) break;
            output[date] = 1;
        }
    }
    return Object.entries(output).reverse(); // [["25/12", 12], ["26/12", 2], ["27/12", 5], ...]
}

function RecentActivity(props) {
    const recent_activity = aggregate_data(props.data);
    console.log(recent_activity)
    const data = {
        labels: recent_activity.map(x => x[0]),
        datasets: [{
            label: "Number of counts",
            data: recent_activity.map(x => x[1]),
            backgroundColor: randomColor({
                count: recent_activity.length,
                luminosity: "light",
                format: "rgb"
            })
        }]
    }

    return <div className="recent-activity-wrapper"><Bar data={data}></Bar></div>;
}

export default RecentActivity;
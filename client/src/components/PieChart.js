import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';
import { randomColor } from "randomcolor";

ChartJS.register(ArcElement, Tooltip, Legend);


function aggregate_data(data) {
    let output = {};
    for (const doc of data) {
        if (output.hasOwnProperty(doc.AuthorID)) {
            output[doc.AuthorID][1] = output[doc.AuthorID][1] + 1;
        } else {
            output[doc.AuthorID] = [doc.Author, 1];
        }
    }
    return Object.values(output); // e.g. ["invisi.#0561", 1409]
}

function PieChart(props) {
    const people_count = aggregate_data(props.data);
    people_count.sort((a, b) => b[1] - a[1]) // sort descending
    const data = {
        labels: people_count.map(x => x[0]),
        datasets: [{
            label: "User count",
            data: people_count.map(x => x[1]),
            backgroundColor: randomColor({
                count: people_count.length,
                luminosity: "light",
                format: "rgb"
            })
        }],
        hoverOffset: 4
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return <div className="pie-chart animate__animated animate__bounceIn animate__delay-1s"><p>Count distribution</p><div><Pie data={data} options={options}></Pie></div></div>;
}

export default PieChart;
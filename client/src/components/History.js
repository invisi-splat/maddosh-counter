import React from "react";
import { Chart as ChartJS, registerables, defaults } from 'chart.js'; // haha me lazy
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { randomColor } from "randomcolor";

ChartJS.register(...registerables);
ChartJS.register(zoomPlugin);

function aggregate_data(data) {
    let output = {};
    output["MISCOUNT"] = {"MISCOUNT": []};
    for (const doc of data) {
        if (doc.Author === "MISCOUNT") {
            output["MISCOUNT"]["MISCOUNT"].push([parseInt(doc.Date, 10), parseInt(doc.Content), 10]);
        }
        else if (output.hasOwnProperty(doc.AuthorID)) {
            output[doc.AuthorID][doc.Author].push([parseInt(doc.Date, 10), parseInt(doc.Content), 10]);
        } else {
            output[doc.AuthorID] = {[doc.Author]: [[parseInt(doc.Date, 10), parseInt(doc.Content, 10)]]};
        }
    }
    return Object.values(output); // e.g. {"invisi.#0561": [[1048013, 1], [1029548, 4], [10297859, 6], ...]]
}

function History(props) {
    const history = aggregate_data(props.data);
    const data = {
        datasets: history.map(obj => {
            const color = randomColor({
                hue: "random",
                luminosity: "light",
                format: "rgb"
            })
            return {
                label: Object.keys(obj)[0],
                data: Object.values(obj)[0].map(pair => {
                    return {
                        x: pair[0] * 1000, // to ms
                        y: pair[1]
                    }
                }),
                showLine: false,
                borderColor: color,
                backgroundColor: color,
                pointBorderColor: color,
                pointBackgroundColor: color,
                pointRadius: 8,
                pointStyle: "line",
                pointBorderWidth: 0.5,
                pointRotation: 45
            }
        })
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time"
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true
                },
                limits: {
                    x: {min: "original", max: "original"},
                    y: {min: "original", max: "original"}
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        }
    }

    defaults.font.family = "Tahoma, Geneva, Verdana, sans-serif";

    return <div className="history-wrapper animate__animated animate__bounceIn animate__delay-2s"><Line data={data} options={options}></Line></div>;
}

export default History;
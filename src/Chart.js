import React from "react";

import { Bar } from "react-chartjs-2";

export default function Chart({ data, api }) {
    return (
        <Bar
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                backgroundColor: "rgb(255,0,0,0)",
                legend: {
                    display: true,
                },
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                display: false,
                                callback: function (value) {
                                    return value.substr(0, 3); //truncate
                                },
                            },
                        },
                    ],
                },
            }}
        />
    );
}

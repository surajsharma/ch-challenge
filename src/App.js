import React, { useEffect, useState } from "react";
import axios from "axios";

import PaginatedTable from "./PaginatedTable";
import Chart from "./Chart";

import "./style.css";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function App() {
    let [apiData, setApiData] = useState(null);
    let [columns, setColumns] = useState([]);
    let [chartData, setChartData] = useState(null);
    let [api, setApi] = useState("banking");
    let [dimensions, setDimensions] = useState({});
    let [identifiers, setIdentifiers] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    let bankURL =
        process.env.NODE_ENV !== "production"
            ? "http://localhost:1234/bank"
            : "https://mocki.io/v1/c99c382d-9952-4452-a860-02f0e7f01449";
    let ecomURL =
        process.env.NODE_ENV !== "production"
            ? "http://localhost:1234/ecom"
            : "https://mocki.io/v1/f8e89695-6f41-4e1c-b5e4-bfd9d7ddffa4";

    useEffect(() => {
        console.clear();
        axios
            .get(api === "banking" ? bankURL : ecomURL)
            .then((data) => {
                console.log(data.data);
                if (data.data) {
                    setApiData(data.data);
                    console.log("got data");
                    get_dimensions(data.data);
                    setup_table(data.data);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setTabIndex(0);
        console.clear();
        axios
            .get(api === "banking" ? bankURL : ecomURL)
            .then((data) => {
                console.log(data.data);
                if (data.data) {
                    setApiData(data.data);
                    console.log("got data");
                    get_dimensions(data.data);
                    setup_table(data.data);
                }
            })
            .catch((err) => console.log(err));
    }, [api]);

    useEffect(() => {
        if (tabIndex == 0) {
            axios
                .get(api === "banking" ? bankURL : ecomURL)
                .then((data) => {
                    console.log(data.data);
                    if (data.data) {
                        setApiData(data.data);
                        console.log("got data");
                        get_dimensions(data.data);
                        setup_table(data.data);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            console.log(apiData);

            if (!apiData.length) {
                console.log("fetching data again");
                axios
                    .get(api === "banking" ? bankURL : ecomURL)
                    .then((data) => {
                        if (data.data) {
                            const filtertedData = data.data.filter((data) =>
                                data.string.includes(identifiers[tabIndex])
                            );

                            setApiData(filtertedData);
                            get_dimensions(data.data);
                            setup_table(data.data);
                        }
                    });
            }

            const filtertedData = apiData.filter((data) =>
                data.string.includes(identifiers[tabIndex])
            );

            setApiData(filtertedData);
        }
    }, [tabIndex]);

    function setup_data(apiData) {}

    function setup_table(apiData) {
        let c = [];
        if (apiData) {
            console.log("setting up table");
            //calculate and set columns
            Object.keys(apiData[0]).forEach((x) => {
                c.push({ header: x, accessor: x });
            });

            c[0].header = "Sub Population Name";
            c[1].header = "Net Impact";
            c[2].header = "Baseline Subpopulation Size";
            c[3].header = "RCA Subpopulation Size";
            c[6].header = "Baseline Metric";
            c[7].header = "RCA Metric";

            const OrderedColumns = [
                c[0],
                c[6],
                c[7],
                c[2],
                c[3],
                c[1],
                c[4],
                c[5],
            ];

            setColumns(OrderedColumns);

            var topImpact = apiData
                .map(function (item) {
                    return api == "banking"
                        ? [item.string, item.avg_duration_impact]
                        : [item.string, item.ItemTotalPrice_impact];
                })
                .sort()
                .slice(0, 10);

            let cdata = {
                labels: [],
                datasets: [
                    {
                        label:
                            api == "banking"
                                ? "Top 10 Avg Duration Impact"
                                : "Top 10 Total Price Impact",
                        data: [],
                        backgroundColor: [],
                        borderWidth: 1,
                    },
                ],
            };

            if (topImpact.length) {
                topImpact.forEach((item) => {
                    console.log(
                        "🚀 ~ file: App.js ~ line 151 ~ topImpact.forEach ~ item",
                        item
                    );

                    cdata.labels.push(item[0]);
                    cdata.datasets[0].data.push(item[1]);
                    cdata.datasets[0].backgroundColor.push(
                        item[item.length - 1] < 0 ? "#E74C3C" : "#27AE60"
                    );
                });
            }

            setChartData(cdata);
        }
    }

    function random_rgba() {
        var o = Math.round,
            r = Math.random,
            s = 255;
        return (
            "rgba(" +
            o(r() * s) +
            "," +
            o(r() * s) +
            "," +
            o(r() * s) +
            "," +
            r().toFixed(1) +
            ")"
        );
    }

    function get_dimensions(datum) {
        let ids = ["All"];
        let dims = {};

        if (datum) {
            if (api == "banking") {
                console.log("processing banking");
                for (let i = 0; i < datum.length; i++) {
                    let dim = datum[i].string.split(/[=&]+/);
                    for (let y = 0; y < dim.length; y++) {
                        if (y % 2 === 0) {
                            if (!ids.includes(dim[y].trim())) {
                                ids.push(dim[y].trim());
                            }
                        }
                    }
                }

                ids.forEach((i) => (dims[i] = []));

                for (let i = 0; i < datum.length; i++) {
                    let dim = datum[i].string.split(/[=&]+/);

                    for (let x = 0; x < dim.length; x++) {
                        if (ids.includes(dim[x].trim())) {
                            let key = dim[x].trim();
                            if (!dims[key].includes(dim[x + 1].trim())) {
                                dims[key].push(dim[x + 1].trim());
                            }
                        }
                    }
                }
                console.log("set bank", identifiers);
            } else {
                console.log("processing ecommerce");
                //get identifiers
                for (let i = 0; i < datum.length; i++) {
                    let dim = datum[i].string.split(/[&]+/);

                    for (let y = 0; y < dim.length; y++) {
                        if (dim[y].includes("<")) {
                            dim = dim[y].split("<");

                            // console.log(dim);
                            // [ "3.75 ", " UnitPrice ", "= 8142.75 " ]

                            for (let x = 0; x < dim.length; x++) {
                                if (x == 1) {
                                    let key = dim[x].trim();
                                    // console.log(key);
                                    if (!ids.includes(key)) {
                                        ids.push(key);
                                    }
                                }
                            }
                        } else {
                            dim = dim[y].split("=");
                            if (dim.length > 1) {
                                for (let x = 0; x < dim.length; x++) {
                                    if (
                                        x == 0 &&
                                        !ids.includes(dim[x].trim())
                                    ) {
                                        ids.push(dim[x].trim());
                                    }
                                }
                            }
                        }
                    }
                }

                // allocate dimensions array
                ids.forEach((i) => (dims[i] = []));

                // populate dimensions
                for (let i = 0; i < datum.length; i++) {
                    let dim = datum[i].string.split(/[&]+/);

                    for (let y = 0; y < dim.length; y++) {
                        if (dim[y].includes("<")) {
                            dim = dim[y].split("<");

                            // console.log(dim);
                            // [ "3.75 ", " UnitPrice ", "= 8142.75 " ]

                            for (let x = 0; x < dim.length; x++) {
                                if (x == 1) {
                                    let key = dim[x].trim();
                                    // console.log(key);
                                    dims[key].push({
                                        min: dim[x - 1].trim(),
                                        max: dim[x + 1].replace("=", "").trim(),
                                    });
                                }
                            }
                        } else {
                            dim = dim[y].split("=");
                            if (dim.length > 1) {
                                for (let x = 0; x < dim.length; x++) {
                                    if (x == 0) {
                                        let key = dim[x].trim();
                                        let val = dim[x + 1].trim();
                                        if (!dims[key].includes(val)) {
                                            dims[key].push(val);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                console.log("set ecomm", identifiers);
            }

            console.log("setting ids dims", ids, dims);
            setIdentifiers(ids);
            setDimensions(dims);
        }

        return;
    }

    const Tabular = () => {
        return (
            identifiers && (
                <>
                    <br />
                    <Tabs
                        selectedIndex={tabIndex}
                        onSelect={(tabIndex) => setTabIndex(tabIndex)}
                    >
                        <TabList>
                            {identifiers.map((i) => (
                                <Tab key={i}>{i}</Tab>
                            ))}
                            <Tab>Chart</Tab>
                        </TabList>

                        {identifiers.map((i) => (
                            <TabPanel key={i}>
                                <PaginatedTable
                                    data={apiData}
                                    columns={columns}
                                />
                            </TabPanel>
                        ))}
                        <TabPanel>
                            <div className="chart">
                                <Chart data={chartData} {...api} />
                                <br />
                            </div>
                        </TabPanel>
                    </Tabs>
                </>
            )
        );
    };

    return columns.length ? (
        <>
            <div className="selectApi">
                <button onClick={() => setApi("banking")}>
                    Bank-Marketing
                </button>{" "}
                &nbsp;
                <button onClick={() => setApi("ecommerce")}>E-Commerce</button>
                <br />
            </div>
            <div className="container">
                <div className="table">
                    {identifiers.length ? <Tabular /> : <p>Processing...</p>}
                </div>
            </div>
        </>
    ) : (
        "loading..."
    );
}

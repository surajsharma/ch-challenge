import React, { useEffect, useState } from "react";
import { useTable, usePagination, useColumnOrder } from "react-table";

export default function PaginatedTable({ data, columns }) {
    // Use the state and functions returned from useTable to build your UI

    columns[0].header = "Sub Population Name";
    columns[1].header = "Net Impact";
    columns[2].header = "Baseline Subpopulation Size";
    columns[3].header = "RCA Subpopulation Size";
    columns[6].header = "Baseline Metric";
    columns[7].header = "RCA Metric";

    const OrderedColumns = [
        columns[0],
        columns[6],
        columns[7],
        columns[2],
        columns[3],
        columns[1],
        columns[4],
        columns[5],
    ];
    console.log(OrderedColumns, "oc");
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns: OrderedColumns,
            data,
            initialState: {
                pageIndex: 0,
                hiddenColumns: [
                    "avg_duration_val_g1",
                    "avg_duration_val_g2",
                    "ItemTotalPrice_val_g1",
                    "ItemTotalPrice_val_g2",
                ],
            },
        },

        usePagination
    );
    return (
        <div className="paginatedTable">
            <br />
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {">>"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(page);
                        }}
                        style={{ width: "100px" }}
                    />
                </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <br />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    style={{
                                        borderBottom: "solid 3px red",
                                        background: "aliceblue",
                                        color: "black",
                                        fontSize: "11px",
                                    }}
                                >
                                    {<p>{column.header}</p>}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            style={{
                                                color:
                                                    cell.column.header ==
                                                    "Net Impact"
                                                        ? cell.value < 0
                                                            ? "#E74C3C"
                                                            : "#27AE60"
                                                        : "black",
                                                borderBottom: "1px solid black",
                                                fontSize: "11px",
                                            }}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

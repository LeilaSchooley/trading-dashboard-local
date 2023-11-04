import React, { Component, useState, useContext, useLayoutEffect, useEffect } from 'react';

const TableBody = ({ list }, styleMap, selectRow) => {
    return (
        <>
            <tbody key={list.id} >
                <tr style={styleMap ?? styleMap.get(list.id)}>
                    <td id={list.id} onClick={selectRow}>{list.StockCode.toString()}</td>
                    <td id={list.id} onClick={selectRow}>{list.TimeStamp.toString()}</td>
                    <td id={list.id} onClick={selectRow}>{list.CurrentPrice.toString()} </td>
                    <td id={list.id} onClick={selectRow}>{list.High.toString()}</td>

                    <td id={list.id} onClick={selectRow}>{list.Low.toString()}</td>
                    <td id={list.id} onClick={selectRow}>{list.Change.toString()}</td>
                    <td id={list.id} onClick={selectRow}>{list.ChangeP.toString()}</td>
                    <td id={list.id} onClick={selectRow}>{list.Volume.toString()}</td>
                </tr>
            </tbody>
        </>
    );
}

export default TableBody;
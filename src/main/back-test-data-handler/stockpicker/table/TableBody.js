import React, { Component, useState, useContext, useLayoutEffect, useEffect } from 'react';

const SingleHistoricalPair = ({ list, styleMap, selectRow }) => (
    <tbody key={list.id} >
        <tr>         
            <td  onClick={selectRow}>{list.id}</td>
            <td  onClick={selectRow}>{list.open}</td>
            <td  onClick={selectRow}>{list.low}</td>
            <td  onClick={selectRow}>{list.high}</td>
            <td  onClick={selectRow}>{list.close}</td>
            <td  onClick={selectRow}>{list.volume}</td>
            <td>
            <input
                style={{transform: 'translateY(2px)'}}
                type="checkbox" 
                id={list.id} 
                name={list.label} 
                value={list.label}/>
            </td>
        </tr>
    </tbody>
);



const SingleHistoricalPairDaily = (list, styleMap, selectRow) => (
    <tbody key={list.id} >
        <tr style={styleMap ?? styleMap.get(list.id)}>
            <td id={list.id} onClick={selectRow}>{list.date}</td>
            <td id={list.id} onClick={selectRow}>{list.open}</td>
            <td id={list.id} onClick={selectRow}>{list.low}</td>
            <td id={list.id} onClick={selectRow}>{list.high}</td>
            <td id={list.id} onClick={selectRow}>{list.close}</td>
            <td id={list.id} onClick={selectRow}>{list.adjClose}</td>
            <td id={list.id} onClick={selectRow}>{list.volume}</td>
            <td id={list.id} onClick={selectRow}>{list.unadjustedVolume}</td>
            <td id={list.id} onClick={selectRow}>{list.change}</td>
            <td id={list.id} onClick={selectRow}>{list.changePercent}</td>
            <td id={list.id} onClick={selectRow}>{list.vwap}</td>
            <td id={list.id} onClick={selectRow}>{list.label}</td>
            <td id={list.id} onClick={selectRow}>{list.changeOverTime}</td>
        </tr>
    </tbody>
);

const SinglePair = ({ list, styleMap, selectRow, request }) => {

    return (
        <>
            {request ?
                <SingleHistoricalPair list={list} styleMap={styleMap} selectRow={selectRow} request={request} />
                :
                <SingleHistoricalPairDaily list={list} styleMap={styleMap} selectRow={selectRow} request={request} />
            }
        </>
    );
}
const TableBody = ({ list, styleMap, selectRow, request }) => {

    return (
        <SinglePair list={list} styleMap={styleMap} selectRow={selectRow} request={request} />
    );
}

export default TableBody;
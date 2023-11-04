import React, { Component, useState, useContext, useLayoutEffect, useEffect } from 'react';

const SingleHistoricalPair = (list) => (
    <thead>
        <tr>
            <th>{list.label}</th>
            <th>{list.date}</th>
            <th>{list.open}</th>
            <th>{list.low}</th>
            <th>{list.high}</th>
            <th>{list.close}</th>
            <th>{list.volume}</th>
          
            {/* Replace with checkbox  //style={styleMap ?? styleMap.get(list.id)}*/}
        </tr>
    </thead>
);

const SingleHistoricalPairDaily = (list) => (
    <thead>
        <tr>
            <th>{list.date}</th>
            <th>{list.open}</th>
            <th>{list.low}</th>
            <th>{list.high}</th>
            <th>{list.close}</th>
            <th>{list.adjClose}</th>
            <th>{list.volume}</th>
            <th>{list.unadjustedVolume}</th>
            <th>{list.change}</th>
            <th>{list.changePercent}</th>
            <th>{list.vwap}</th>
            <th>{list.label}</th>
            <th>{list.changeOverTime}</th>
        </tr>
    </thead>
);

const SinglePair = ({ list, request }) => {
    
    return (
        <>
            {request ?
                <SingleHistoricalPair list={list}  request={request} />
                :
                <SingleHistoricalPairDaily list={list} request={request} />
            }
        </>
    );
}

const TableHeader = ({ list, request}) => {

    return (
        <>
        <SinglePair list={list} request={request} />
        </>
    );
}

export default TableHeader;
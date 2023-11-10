import React, { Component, useState, useContext, useLayoutEffect, useEffect } from 'react';

const TableHeader = ({ list }) => {
    return (
        <>
            <thead>
                <tr>
                    <th>{list.StockCode.toString()}</th>
                    <th>{list.TimeStamp.toString()}</th>
                    <th>{list.CurrentPrice.toString()}</th>
                    <th>{list.High.toString()}</th>

                    <th>{list.Low.toString()}</th>
                    <th>{list.Change.toString()}</th>
                    <th>{list.ChangeP.toString()}</th>
                    <th>{list.Volume.toString()}</th>
                </tr>
            </thead>
        </>
    );
}

export default TableHeader;
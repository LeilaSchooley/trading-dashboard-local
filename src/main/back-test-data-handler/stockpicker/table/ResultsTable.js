import React, { Component, useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';
import _ from "lodash";
import { TabList } from '@chakra-ui/react';

const ResultsTable = (children) => {
    
    const Header = () => {
        return children.header;
    }

    const Body = () => {
        return children.body;
    }

    return (
        <>
            <table
                class="stockPicker"
                aria-labelledby="stockPicker-table"
        
                zIndex='999'
            >
                <Header />
                <Body />

            </table>
        </>
    );
}

export default ResultsTable;
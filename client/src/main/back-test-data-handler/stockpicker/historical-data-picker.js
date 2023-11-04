import React, { Component, useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';

const pop = () => {


    
}








return (
    <>
        {/* STOCK PICKER */}
        {toggleTable && (<Box
            style={{ position: 'absolute', top: '140px', left: '4px' }}
            bg='rgb(40,40,40)'
            boxShadow='sm'
            textAlign='center'
            height='35px'
            width='26rem'
            rounded="lg"
            maxHeight='35px'
            margin='auto'
            zIndex='0'
            color='white'>

            <Header request={request} />

            <Box
                id="resultsTable"
                position='absolute'
                overflowY='initial'
                top='35px'
                onScroll={handleScroll}
                ref={tablePos}
                overflowX='hidden'
                bg='rgb(30,30,30)'
                boxShadow='sm'
                textAlign='center'
                height='100px'
                width='26rem'
                maxHeight='200px'
                rounded="lg"
                color='white'
            //    zIndex='-999'
            >
                <ResultsTable scrollPosProps={setScrollPosition}
                    header={stockHeader} body={stockBody} totalPairs={600} />
            </Box>
        </Box>)}
    </>
);


export default StockPicker;






import React from 'react';

const StockTable = (children) => {

    const Header = () => {
        return children.header;
    }

    const Body = () => {
        return children.body;
    }

    return (
        <>
            <table class="stockTableTwo" aria-labelledby="tabelLabel">
                <Header />
                <Body />
            </table>
        </>
    );
}

export default StockTable;
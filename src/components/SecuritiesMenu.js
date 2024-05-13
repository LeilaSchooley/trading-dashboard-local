import React, { useState } from 'react';

function SecuritiesMenu() {
    const [security, setSecurity] = useState('');

    return (
        <div>
            <select value={security} onChange={(e) => setSecurity(e.target.value)}>
                <option value="stock1">Stock 1</option>
                <option value="stock2">Stock 2</option>
                {/* Add more options as needed */}
            </select>
        </div>
    );
}

export default SecuritiesMenu;

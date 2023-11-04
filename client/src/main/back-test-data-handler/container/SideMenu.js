import React, { Component, useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';
import {
    Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel,
    Input, InputGroup,
    Select,
    Stack,
    InputRightElement,
    Checkbox, CheckboxGroup,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor
} from '@chakra-ui/react';

//import { AddIcon } from '@chakra-ui/icons'
//import TableCache from '../../cache/TableCache.js';


const SideMenu = () => {
    const [toggleSelectStock, setToggleSelectStock] = useState(false);
    const [disableDaysAndMinutes, setDisableDaysAndMinutes] = useState(true);
    const [disableHour, setDisableHour] = useState(false);
    const [disableMinutes, setDisableMinutes] = useState(false);

    const [disableMinsCheck, setDisableMinsCheck] = useState(false);
    const [disableHoursCheck, setDisableHoursCheck] = useState(false);

    const selectHour = (e) => {
        setDisableHour(!disableHour);
        setDisableHoursCheck(!disableHour);
    }

    const selectMinutes = (e) => {
        setDisableMinutes(!disableMinutes);
        setDisableMinsCheck(!disableMinutes);
    }

    const selectCustomTime = (e) => {
        if(!e.target.checked)
        {
            setDisableHour(false);
            setDisableMinutes(false);
        }

        if(!disableHour)
            setDisableHour(!disableHour);
        if(!disableMinutes)
            setDisableMinutes(!disableMinutes)

        setDisableDaysAndMinutes(!disableDaysAndMinutes);
       
        setDisableHoursCheck(false);
        setDisableMinsCheck(false);
    }




    return (
        <>
            {/* Side Menu */}
            {/* change to make borders black 239 239 239 */}
            <Box
                style={{ position: 'absolute', top: '0px', left: '1150px' }}
                bg='rgb(205,205,205)'
                boxShadow='sm'
                textAlign='center'
                height='25rem'
                width='17rem'
                rounded="lg"
                maxHeight='50rem'
                margin='auto'
            >

                <p>Settings</p>
                <hr />

                <div className='sub-bullet-point-line-one' aria-describedby='sub-bullet-point-line'>
                    <p style={{
                        position: 'absolute',
                        top: '-1px',
                        left: '0px',
                        width: '300px'
                    }}><span>⬥</span> Download Historical Data</p>
                </div>

                <hr style={{
                    position: 'relative',
                    top: '24px'
                }} />

                <div className='sub-bullet-point-line-two' aria-describedby='sub-bullet-point-line'>
                    <p style={{
                        position: 'absolute',
                        top: '1px',
                        left: '-20px',
                        width: '300px'
                    }}><span>⬥</span> Set Interval</p>

                    <div style={{
                        transform: 'translateX(30px)',
                        zIndex: '999'
                    }}>
                        <label style={{
                            position: 'relative',
                            top: '32px',
                            left: '90px',
                            color: 'black'
                        }}>1 Minute</label>
                        <input style={{
                            position: 'absolute',
                            top: '34px',
                            left: '60px',
                            width: '20px',
                            height: '20px',
                            color: 'black'
                        }}
                            checked={disableMinsCheck}
                            disabled={disableHour}
                            onClick={selectMinutes}
                            type="checkbox" />
                    </div>

                    <div style={{
                        transform: 'translateX(30px)',
                        zIndex: '999'
                    }}>
                        <label style={{
                            position: 'relative',
                            top: '32px',
                            left: '85px',
                            color: 'black'
                        }}>1 Hour</label>
                        <input style={{
                            position: 'absolute',
                            top: '34px',
                            left: '60px',
                            width: '20px',
                            height: '20px',
                            color: 'black'
                        }}
                            checked={disableHoursCheck}
                            disabled={disableMinutes}
                            onClick={selectHour}
                            type="checkbox" />
                    </div>

                    <div style={{
                        transform: 'translateX(30px)',
                        zIndex: '999'
                    }}>
                        <label style={{
                            position: 'absolute',
                            top: '32px',
                            left: '91px',
                            color: 'black'
                        }}>Custom</label>
                        <input style={{
                            position: 'absolute',
                            top: '34px',
                            left: '60px',
                            width: '20px',
                            height: '20px',
                            color: 'black'
                        }}

                            onClick={selectCustomTime}
                            type="checkbox" />
                    </div>

                    <div style={{
                        transform: 'translateX(30px)',
                        zIndex: '999'
                    }}>
                        <label style={{
                            position: 'absolute',
                            top: '60px',
                            left: '-41px',
                            width: '300px',
                            color: 'black'
                        }}>Days {`(Max: 366)`}</label>
                        <input style={{
                            position: 'absolute',
                            top: '84px',
                            left: '60px',
                            width: '70px',
                            height: '25px',
                            color: 'black'
                        }}
                            disabled={disableDaysAndMinutes}
                            checked={disableDaysAndMinutes}
                            min="0"
                            max="366"
                            type="number" />
                    </div>

                    <div style={{
                        transform: 'translateX(30px)',
                        zIndex: '999'
                    }}>
                        <label style={{
                            position: 'absolute',
                            top: '114px',
                            left: '-38px',
                            width: '300px',
                            color: 'black'
                        }}>Mins {`(Max: 1440)`}</label>
                        <input style={{
                            position: 'absolute',
                            top: '138px',
                            left: '60px',
                            width: '70px',
                            height: '25px',
                            color: 'black'
                        }}
                            disabled={disableDaysAndMinutes}
                            checked={disableDaysAndMinutes}
                            min="0"
                            max="1440"
                            type="number" />
                    </div>
                </div>

                <hr style={{
                    position: 'relative',
                    top: '247px'
                }} />

                <Button style={{
                    position: 'absolute',
                    top: '335px',
                    marginLeft: '-110px'}}>Clear</Button>

                <Button style={{
                    position: 'absolute',
                    top: '335px',
                    marginRight: '60px'
                   }}>Set Repeating</Button>




            </Box>
        </>
    );
}

export default SideMenu;


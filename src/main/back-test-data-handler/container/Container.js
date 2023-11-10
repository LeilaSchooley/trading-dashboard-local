import React, {
  Component,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  Select,
  Stack,
  InputRightElement,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";

import HistoricalDataContainer from "../historical-data-service/historical-data-container";

const Container = (props) => {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [toggleSelectStock, setToggleSelectStock] = useState(false);
  const [toggleSearchBar, setToggleSearchBar] = useState(true);
  const [value, setValue] = useState("");
  //const [selectMarket, setSelectMarket] = useState(false);
  const [market, setMarket] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fetchResults, setFetchResults] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setFetchResults(true);
      setLoaded(true);
    }

    //  getStock();
  }, [props.children.load]);

  const getStock = async () => {
    setTimeout(async () => {
      await fetch("https://localhost:44362/test/AAPL")
        .then((response) => {
          console.log("Test");
          console.log(response);
          return response.text();
        })
        .catch((error) => {
          console.log("error " + error);
          return { status: 400 };
        });
    }, 3000);

    /*   const res = await callApi();
           const data = JSON.parse(JSON.stringify(res));
   
           if (data?.statusCode === 400) {
               // "Display message: "Stock not found"
           }*/
  };

  // Search symbol
  const search = (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
  };

  const selectMarket = () => {
    if (toggleSearchBar) setToggleSearchBar(false);
  };

  /*
    const Header = () => {
        return children.header;
    }

    const Body = () => {
        return children.body;
    }*/

  return (
    <>
      {/* Container */}
      <Box
        style={{ position: "absolute", top: "55px", left: "60px" }}
        bg="rgb(239,239,239)"
        boxShadow="sm"
        textAlign="center"
        height="40rem"
        width="90rem"
        rounded="lg"
        maxHeight="50rem"
        margin="auto"
      >
        <Tabs style={{ position: "absolute", left: "2px" }}>
          <TabList>
            <Tab style={{ width: "75px" }}>Historical Data</Tab>
            <Tab style={{ width: "75px" }}>Input Parameters</Tab>
            <Tab style={{ width: "75px" }}>Results</Tab>
          </TabList>

          <TabPanels>
            <TabPanel
              style={{ position: "absolute", left: "2px", top: "70px" }}
            >
              <HistoricalDataContainer />
            </TabPanel>

            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Container;

/**
 
   <Menu>
  <MenuButton as={Popover} leftIcon={ <AddIcon />}>
                                        Actions
                                    </MenuButton>
    
                                    <MenuList>
                                        <MenuItem>Download
                                        
                                        sight
                                        
                                        s</MenuItem>
                                        <MenuItem>Create a Copy</MenuItem>
                                        <MenuItem>Mark as Draft</MenuItem>
                                        <MenuItem>Delete</MenuItem>
                                        <MenuItem>Attend a Workshop</MenuItem>
                                    </MenuList>
                                </Menu>                                  
 
 */

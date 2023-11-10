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

//import { AddIcon } from '@chakra-ui/icons'

/**
 * Fetches results of search
 *
 */
const Results = (children) => {
  const [toggleSelectStock, setToggleSelectStock] = useState(false);
  const [stack, setStack] = useState([]);

  const search = () => {
    // Results of promise will be
    // called in addsymbol
    ///addsymbol (..)
  };

  const addSymbol = (symbol) => {
    let tempStack = [];

    tempStack.push(
      <div class="resultsContainer">
        <input
          style={{
            width: "20px",
            height: "20px",
          }}
          type="checkbox"
        />
        {symbol.exchange}
        {symbol.name}
      </div>
    );

    setStack(tempStack);
  };

  return <>{stack}</>;
};

export default Container;

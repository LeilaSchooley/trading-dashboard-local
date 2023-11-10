import {
  Box,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  Button,
  Input,
} from "@chakra-ui/react";
import React from "react";

function SecuritiesMenu() {
  // This is a mock data for securities. In a real application, you'd fetch this data from an API.
  const securities = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "GOOGL", name: "Alphabet Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    { ticker: "AMZN", name: "Amazon Inc." },
    // ... more securities ...
  ];

  return (
    <Box
      mt="2rem" // Add a top margin to position it below the tabs
      h="calc(100vh - 10rem)" // Adjust the height to fit below the tabs
      w="100%" // Make it take the full width of the parent container
      boxShadow="sm"
      bg="white"
      overflowY="auto"
    >
      {/* Optionally add a search input at the top of the menu to filter securities */}
      <Input placeholder="Search for a security" mt={2} mb={4} />

      <VStack spacing={4} align="stretch">
        {securities.map((security) => (
          <Button
            key={security.ticker}
            justifyContent="flex-start"
            variant="ghost"
            _hover={{ bg: "gray.100" }} // Add a hover effect for better UX
          >
            {security.name} ({security.ticker})
          </Button>
        ))}
      </VStack>
    </Box>
  );
}

export default SecuritiesMenu;

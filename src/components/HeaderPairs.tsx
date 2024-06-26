import useTickerPrice from '@/hooks/useTickerPrice';
import { Flex, Text, Icon, HStack, Box, Link } from '@chakra-ui/react';
import { RiCoinsLine } from 'react-icons/ri';

interface HeaderPairsProps {
  pair: string;
  pairName: string;
}
export function HeaderPairs({ pair, pairName }: HeaderPairsProps) {
  const symbol = pair.toUpperCase().split('_');
  const tickerPrice = useTickerPrice(pairName);

  return (
    <Flex w="100%" borderBottomWidth={1} borderColor="gray.700">
      <Flex h="20" align="center">
        <HStack
          spacing="8"
          mx="8"
          pr="8"
          py="1"
          color="gray.50"
          borderRightWidth={1}
          borderColor="gray.700"
        >
          <Box textAlign="center">
            <Text fontSize="large" fontWeight="bold">
              {symbol[0]}/{symbol[1]}
            </Text>
            <Link display="flex" color="gray.300">
              <Icon as={RiCoinsLine} fontSize="14" mt="0.5" />
              <Text fontSize="small">Bitcoin</Text>
            </Link>
          </Box>
        </HStack>

        <HStack spacing="8">
          <Flex align="center">
            <Box textAlign="center">
              <Text fontSize="medium">
                {tickerPrice?.c ? Number(tickerPrice.c) : 0}
              </Text>
              <Text fontSize="small">$ pending</Text>
            </Box>
          </Flex>

          <Flex align="center">
            <Box textAlign="center">
              <Text color="gray.300" fontSize="small">
                Variação em 24h
              </Text>
              <Text color="red.500" fontSize="small">
                {tickerPrice?.p} {tickerPrice?.P}
              </Text>
            </Box>
          </Flex>

          <Flex align="center">
            <Box textAlign="center">
              <Text color="gray.300" fontSize="small">
                Máximo em 24h
              </Text>
              <Text fontSize="small">
                {tickerPrice?.h ? Number(tickerPrice.h).toFixed(2) : 0}
              </Text>
            </Box>
          </Flex>

          <Flex align="center">
            <Box textAlign="center">
              <Text color="gray.300" fontSize="small">
                Mínimo em 24h
              </Text>
              <Text fontSize="small">
                {tickerPrice?.l ? Number(tickerPrice.l).toFixed(2) : 0}
              </Text>
            </Box>
          </Flex>

          <Flex align="center">
            <Box textAlign="center">
              <Text color="gray.300" fontSize="small">
                Volume em 24h({symbol[0]})
              </Text>
              <Text fontSize="small">{tickerPrice?.v}</Text>
            </Box>
          </Flex>

          <Flex align="center">
            <Box textAlign="center">
              <Text color="gray.300" fontSize="small">
                Volume 24h({symbol[1]})
              </Text>
              <Text fontSize="small">{tickerPrice?.q}</Text>
            </Box>
          </Flex>
        </HStack>
      </Flex>
    </Flex>
  );
}

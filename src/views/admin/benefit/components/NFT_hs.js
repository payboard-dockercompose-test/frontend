// Chakra imports
import { Box, Flex, Heading, Image, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import { useEffect } from 'react';
import { FaHeading } from 'react-icons/fa';
import ShowData from 'views/admin/dataTables/components/ShowData';
import ShowDataBenefit from './ShowData_hs';

export default function NFTBenefit({ data }) {
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorBid = useColorModeValue('brand.500', 'white');
    return (
        <Card p="20px">
            <Flex direction={{ base: 'column' }} justify="center">
                <Box mb={{ base: '1px', '2xl': '1px' }} position="relative">
                    <Heading size="md">{data.max_cnt_card_name}</Heading>
                    <SimpleGrid columns={2} spacingX="0px">
                        <ShowDataBenefit card_annual_fee={data.max_cnt_fee}></ShowDataBenefit>
                        <Box position={'relative'}>
                            {/* <Image
                position={"absolute"}
                left="50%"
                transform="translate(-50%, -50%)"
                top="50%"
                src={data.image}
                w={{ base: "320px" }}
                h={{ base: "210px" }}
                borderRadius="20px"
              /> */}
                        </Box>
                    </SimpleGrid>
                </Box>
            </Flex>
        </Card>
    );
}

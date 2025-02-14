import { Text, useColorModeValue, Select, Spinner, Box, Heading, Stack, StackDivider } from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobData(props) {
    const API_SERVER = process.env.REACT_APP_API_SERVER;
    const [filter, setFilter] = useState('all');
    const [custsalaryNum, setCustsalaryNum] = useState(null);
    const [ageSalaryRangeAndAll, setAgeSalaryRangeAndAll] = useState(null);
    const [custSalary, setCustSalary] = useState(null);
    const [paymentBySalaryAndAll, setPaymentBySalaryAndAll] = useState(null);
    const [top3CardByCustSalary, setTop3CardByCustSalary] = useState(null);
    const [top3MccCodeByCustSalary, setTop3MccCodeByCustSalary] = useState(null);

    const [loading, setLoading] = useState(false); //로딩 스피너 사용을 위한 로딩 상태를 나타내는 상태 변수 추가

    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const textColorSecondary = 'gray.400';
    const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');

    useEffect(() => {
        setLoading(true);

        Promise.all([
            axios.get(API_SERVER + '/customer/custsalaryNum'),
            axios.get(API_SERVER + '/customer/ageSalaryRangeAndAll'),
            axios.get(API_SERVER + '/customer/findCustSalaryData'),
            axios.get(API_SERVER + '/customer/paymentBySalaryAndAll'),
            axios.get(API_SERVER + '/customer/top3CardByCustSalary'),
            axios.get(API_SERVER + '/customer/top3MccCodeByCustSalary'),
        ])
            .then(
                ([
                    custsalaryNumResponse,
                    ageSalaryRangeAndAllResponse,
                    custSalaryResponse,
                    paymentBySalaryAndAllResponse,
                    top3CardByCustSalaryResponse,
                    top3MccCodeByCustSalaryResponse,
                ]) => {
                    setCustsalaryNum(custsalaryNumResponse.data.find((row) => row[0] === filter)[1]);
                    setAgeSalaryRangeAndAll(ageSalaryRangeAndAllResponse.data.find((row) => row[0] === filter)[1]);
                    const custSalaryData = custSalaryResponse.data.find((row) => row[0] === filter);
                    setCustSalary(custSalaryData ? custSalaryData[1] : '데이터를 불러오는 중...');
                    setPaymentBySalaryAndAll(
                        paymentBySalaryAndAllResponse.data.find((row) => row['cust_salary'] === filter)['avg_payment']
                    );

                    if (filter === 'all') {
                        setTop3CardByCustSalary(top3CardByCustSalaryResponse.data['all'].join(', '));
                    } else {
                        const cardData = top3CardByCustSalaryResponse.data['top3CardTypes'].find(
                            (row) => row[0] === filter
                        );
                        setTop3CardByCustSalary(cardData ? cardData.slice(1).join(', ') : '데이터를 불러오는 중...');
                    }
                    const mainUseData = top3MccCodeByCustSalaryResponse.data;
                    const mainUsesByJob =
                        filter === 'all'
                            ? mainUseData.filter((row) => row[0] === 'all').map((row) => row[1])
                            : mainUseData.filter((row) => row[0] === filter).map((row) => row[1]);
                    setTop3MccCodeByCustSalary(mainUsesByJob);

                    setLoading(false);
                }
            )
            .catch((error) => {
                console.error('Error fetching data: ', error);
                setLoading(false);
            });
    }, [filter]);

    // 필터를 변경하는 함수입니다.
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // 나머지 코드...

    return (
        <>
            <Card mb={{ base: '0px', '2xl': '20px' }}>
                {loading ? (
                    <Spinner />
                ) : (
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Text
                                    color={textColorPrimary}
                                    fontWeight="bold"
                                    fontSize="2xl"
                                    mt="10px"
                                    mb="4px"
                                    mr="10px"
                                >
                                    All DATA{' '}
                                    <Text as="span" color={textColorSecondary} fontSize="md" ml="10px">
                                        종합데이터
                                    </Text>
                                </Text>
                            </div>
                            <div>
                                <Select value={filter} onChange={handleFilterChange} borderColor="blue.500">
                                    <option value="all">All</option>
                                    <option value="3000만원 미만">3000만원 미만</option>
                                    <option value="3000만원 이상 5000만원 미만">3000만원 이상 5000만원 미만</option>
                                    <option value="5000만원 이상 7000만원 미만">5000만원 이상 7000만원 미만</option>
                                    <option value="7000만원 이상 1억 미만">7000만원 이상 1억 미만</option>
                                    <option value="1억 이상">1억 이상</option>
                                </Select>
                            </div>
                        </div>
                        <Stack divider={<StackDivider />} spacing="3" mt="20px">
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    포함된 고객 수 : {custsalaryNum}명
                                </Heading>
                            </Box>
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    평균 연령 : {ageSalaryRangeAndAll}세
                                </Heading>
                            </Box>
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    평균 연봉 : {custSalary}
                                </Heading>
                            </Box>
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    평균 소비금액 : {paymentBySalaryAndAll}
                                </Heading>
                            </Box>
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    가장 많이 사용한 카드 : {top3CardByCustSalary}
                                </Heading>
                            </Box>
                            <Box>
                                <Heading size="s" textTransform="uppercase">
                                    주 사용처 :{' '}
                                    {top3MccCodeByCustSalary
                                        ? top3MccCodeByCustSalary.join(', ')
                                        : '데이터를 불러오는 중...'}
                                </Heading>
                            </Box>
                        </Stack>
                    </div>
                )}
            </Card>
        </>
    );
}

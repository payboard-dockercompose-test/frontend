import React, { createContext, useContext, useEffect, useState } from 'react';

// Chakra imports
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BarChart from 'components/charts/BarChart';

// Custom components
import Card from 'components/card/Card.js';
import Menu from './AdminMainMenu';
// Assets
import axios from 'axios';

export const MonthDetailTrafficContext = createContext();
export const TrafficProvider = (props) => {
    const API_SERVER = process.env.REACT_APP_API_SERVER;
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const [barChartDataMonthTraffic, setBarChartDataMonthTraffic] = useState([]);
    const [barChartOptionsDailyTraffic, setBarChartOptionsDailyTraffic] = useState([]);
    var total6transaction = [];
    const [transaction, setTransaction] = useState([]);
    var month = [];
    const [memo, SetMemo] = useState();
    useEffect(() => {
        axios
            .all([
                axios.get(API_SERVER + '/main/detailselectPerMonthtransaction'),
                axios.get(API_SERVER + '/main/detailselectMonthtransaction'),
            ])
            .then(
                axios.spread((res1, res2) => {
                    let Message = '1년간 매달 거래건수를 나타낸 차트입니다.';
                    SetMemo(Message);
                    const monthname = res1.data.map((item) => item.month);
                    const formattedMonths = monthname.map((month) => {
                        const [year, monthNumber] = month.split('-');
                        const date = new Date(parseInt(year), parseInt(monthNumber) - 1, 1);
                        return date.toLocaleDateString('ko-KR', { month: 'long' }); // Get Korean full month name
                    });
                    month = formattedMonths;

                    total6transaction = res1.data.map((item) => item.transaction);
                    setTransaction(res2.data);
                })
            )
            .then(() => {
                const barChartDataMonthTraffic1 = [
                    {
                        name: '월 거래건수',
                        data: total6transaction,
                    },
                ];
                setBarChartDataMonthTraffic(barChartDataMonthTraffic1);
                const barChartOptionsDailyTraffic1 = {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    tooltip: {
                        style: {
                            fontSize: '12px',
                            fontFamily: undefined,
                        },
                        onDatasetHover: {
                            style: {
                                fontSize: '12px',
                                fontFamily: undefined,
                            },
                        },
                        theme: 'dark',
                    },
                    xaxis: {
                        categories: month,
                        show: false,
                        labels: {
                            show: true,
                            style: {
                                colors: '#A3AED0',
                                fontSize: '14px',
                                fontWeight: '500',
                            },
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                    },
                    yaxis: {
                        show: true,
                        color: 'black',
                        labels: {
                            show: true,
                            style: {
                                colors: '#CBD5E0',
                                fontSize: '14px',
                            },
                        },
                    },
                    grid: {
                        show: false,
                        strokeDashArray: 5,
                        yaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        xaxis: {
                            lines: {
                                show: true,
                            },
                        },
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            type: 'vertical',
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                            colorStops: [
                                [
                                    {
                                        offset: 0,
                                        color: '#4318FF',
                                        opacity: 1,
                                    },
                                    {
                                        offset: 100,
                                        color: 'rgba(67, 24, 255, 1)', //색바꾸기
                                        opacity: 0.7,
                                    },
                                ],
                            ],
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 10,
                            columnWidth: '40px',
                        },
                    },
                };
                setBarChartOptionsDailyTraffic(barChartOptionsDailyTraffic1);
            })
            .catch((err) => {
                console.log('Error fetching currency data:', err);
            });
    }, []);

    return (
        <>
            <MonthDetailTrafficContext.Provider
                value={{
                    memo,
                    textColor,
                    transaction,
                    barChartDataMonthTraffic,
                    barChartOptionsDailyTraffic,
                }}
            >
                {props.children}
            </MonthDetailTrafficContext.Provider>
        </>
    );
};

export default function AdminDetailMonthTraffic(props) {
    return (
        <Card align="center" direction="column" w="100%">
            <TrafficProvider>
                <AdminMonthTrafficDisplay></AdminMonthTrafficDisplay>
            </TrafficProvider>
        </Card>
    );
}

function AdminMonthTrafficDisplay(props) {
    const { memo, textColor, barChartDataMonthTraffic, barChartOptionsDailyTraffic, transaction } =
        useContext(MonthDetailTrafficContext);

    return (
        <>
            <Flex justify="space-between" align="start" px="10px" pt="5px">
                <Flex w="100%" display="flex" direction="column">
                    <Text me="auto" color="secondaryGray.600" fontSize="sm" fontWeight="500">
                        월 거래건수
                    </Text>
                    <Flex align="end">
                        <Text color={textColor} fontSize="34px" fontWeight="700" lineHeight="100%">
                            {transaction}
                        </Text>
                        <Text
                            ms="6px"
                            color="secondaryGray.600"
                            fontSize="sm"
                            fontWeight="500"
                            display="flex"
                            align-items="center"
                        >
                            건
                        </Text>
                    </Flex>
                </Flex>
                <Menu memo={memo} />
            </Flex>
            <Box h="240px" mt="auto">
                {barChartDataMonthTraffic.length > 0 &&
                    barChartOptionsDailyTraffic.xaxis &&
                    barChartOptionsDailyTraffic.xaxis.categories.length > 0 && (
                        <BarChart chartData={barChartDataMonthTraffic} chartOptions={barChartOptionsDailyTraffic} />
                    )}
            </Box>
        </>
    );
}

import {
  IconButton,
  Box,
  Grid,
  Select,
  Input,
  Flex,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import NFT from "components/card/NFT_boh";
import NFT2 from "components/card/NFT_boh2";
import axios from "axios";
import Card from "components/card/Card";
import { SearchBar } from "components/navbar/searchBar/SearchBar_boh";
import Modal2 from "views/admin/dataTables/components/Modal";
import { cardState } from "../../admin/Recoil/CardCluster";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Loading from "../default/components/Loading";
import DatePickerMonthly from "./components/DatePicker";
import { dataDetailState } from "../Recoil/DataDetailState";

const TopBar = ({ setSelectedMonth, setSelectedSort }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [localMonth, setLocalMonth] = useState(null);
  const [localSort, setLocalSort] = useState(null);
  const [minDate, setMinDate] = useState(null);

  const monthOptions = [];
  for (let year = currentYear; year >= currentYear - 2; year--) {
    const startMonth = year === currentYear ? currentMonth : 12;
    const endMonth = year === currentYear - 2 ? 1 : 1;

    for (let month = startMonth; month >= endMonth; month--) {
      const monthString = month < 10 ? `0${month}` : `${month}`;
      const yearString = String(year);
      const optionText = `${yearString}년 ${monthString}월`;
      const optionValue = `${yearString}-${monthString}`;
      monthOptions.push({ text: optionText, value: optionValue });
    }
  }

  useEffect(() => {
    setMinDate(new Date(monthOptions[monthOptions.length - 1].value));
  }, []);

  const handleMonthChange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth 메소드는 0부터 시작하기 때문에 +1이 필요합니다.
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const yearString = String(year);
    const dateValue = `${yearString}-${monthString}`;
    setLocalMonth(dateValue);
  };
  const defaultDate =
    currentMonth === 0
      ? new Date(currentYear - 1, 11, 1)
      : new Date(currentYear, currentMonth - 1, 1);

  useEffect(() => {
    setLocalMonth(monthOptions[0]?.value);
    setSelectedMonth(monthOptions[0]?.value);
    setLocalSort("high");
    setSelectedSort("high");
  }, []);

  // const handleMonthChange = (event) => {
  //   //setSelectedMonth(event.target.value);
  //   setLocalMonth(event.target.value);
  // };

  const handleSortChange = (event) => {
    //setSelectedSort(event.target.value);
    setLocalSort(event.target.value);
  };

  return (
    <Grid
      mb="20px"
      mr="60px"
      ml="60px"
      templateColumns={{
        base: "1fr",
        lg: "2fr 3.5fr",
      }}
      gap="20px"
      backgroundColor="#fff"
      borderRadius="20px"
    >
      <Card padding="0">
        <Box p="10px 0px 10px 30px">
          <Flex>
            <DatePickerMonthly
              onChange={handleMonthChange}
              defaultValue={defaultDate}
              minDate={minDate}
              maxDate={defaultDate}
            ></DatePickerMonthly>
            {/* <Select
              defaultValue={monthOptions[0]?.value}
              onChange={handleMonthChange}
              mr={2}
            > 
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </Select>*/}
            <Select
              defaultValue="high"
              onChange={handleSortChange}
              mr={2}
              minW="279px"
            >
              <option value="high">이용률 높은순</option>
              <option value="low">이용률 낮은순</option>
            </Select>
            <IconButton
              colorScheme="blue"
              aria-label="Search database"
              icon={<SearchIcon />}
              onClick={() => {
                setSelectedMonth(localMonth);
                setSelectedSort(localSort);
              }}
              p="0 24px"
            />
          </Flex>
        </Box>
      </Card>
      {/* <Card>
        <Box bg="white.200" p={4}>
          <Flex></Flex>
        </Box>
      </Card> */}
    </Grid>
  );
};

export default function Settings() {
  const API_SERVER = process.env.REACT_APP_API_SERVER;
  const card1state = useRecoilValue(cardState);
  const [maincardstate, setMainCardState] = useState(true);
  const [cards, setCards] = useState([]);
  const divToRemove = document.querySelector(".hi");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const dataState = useRecoilValue(dataDetailState);
  const [clickedCards, setClickedCards] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const setDataDetailState = useSetRecoilState(dataDetailState);
  //const [clickedCardInfo, setClickedCardInfo] = useState([]);

  // 찐막 ㅋㅋ
  const handleCardClick = (index) => {
    setClickedCards((prevState) => {
      const clickedIndex = prevState.findIndex((card) => card.index === index);

      // 이미 클릭되어 있으면 클릭 상태를 해제
      if (clickedIndex >= 0) {
        return prevState.filter((card) => card.index !== index);
      }
      // 아니면 클릭 상태를 저장
      else {
        return [...prevState, { ...cards[index], index }];
      }
    });
  };

  useEffect(() => {
    console.log(clickedCards);
    console.log(cards.length);
  }, [clickedCards]);

  useEffect(() => {
    if (dataState === false) {
      const timeoutId = setTimeout(() => {
        if (divToRemove != null) divToRemove.style.display = "none";
      }, 7000);

      // Cleanup function to clear the timeout if component unmounts or if dataState changes
      return () => clearTimeout(timeoutId);
      //if (divToRemove != null) divToRemove.style.display = "none";
    } else if (dataState === true) {
      if (divToRemove != null) divToRemove.style.display = "flex";
    }
  }, [dataState]);
  // Empty dependency array ensures the effect runs only once on mount
  useEffect(() => {
    if (selectedMonth && selectedSort) {
      setDataDetailState(true);
      axios({
        method: "get",
        url:
          API_SERVER +
          `/CardCluster/Cards?month=${selectedMonth}&sort=${selectedSort}`,
      })
        .then((res) => {
          const filteredCards = res.data.map((card) => {
            return {
              card_name: card.cardName,
              card_img_url: card.cardImgUrl,
              card_annual_fee: card.cardAnnualFee,
              cardType: card.cardType,
            };
          });
          // 추출된 카드 정보 배열을 상태로 설정
          setCards(filteredCards);
          console.log(cards.length);
          if (filteredCards.length === 62) {
            setDataDetailState(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedMonth, selectedSort]);

  useEffect(() => {
    // 컴포넌트가 렌더링될 때마다 클릭 정보를 초기화
    setClickedCards([]);
    //setClickedCardInfo([]);
  }, [selectedMonth, selectedSort]);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* {maincardstate ? (
        <Loading />
      ) : (
        <div> */}
      <TopBar
        setSelectedMonth={setSelectedMonth}
        setSelectedSort={setSelectedSort}
      ></TopBar>

      {cards &&
        cards.map((card, index) => (
          <Grid
            key={index}
            mb="20px"
            mr="60px"
            ml="60px"
            templateColumns={{
              base: "1fr",
              lg: "2fr 3.5fr",
            }}
            templateRows={{
              base: "repeat(1, 5fr)",
              lg: "5fr",
            }}
            gap={{ base: "50px", xl: "20px" }}
          >
            <NFT
              cardId={`chartdiv${index}`}
              cardType={card.cardType}
              month={selectedMonth}
            />
            <NFT2
              key={index}
              onClick={() => handleCardClick(index)}
              //isClicked={clickedCards.includes(index)}
              isClicked={clickedCards.some((card) => card.index === index)}
              card_annual_fee={card.card_annual_fee}
              val={card.card_name}
              image={card.card_img_url}
              cardType={card.cardType}
              month={selectedMonth}
            />
          </Grid>
        ))}

      <Button
        onClick={onOpen}
        colorScheme="purple"
        backgroundColor={"#5E3AFF"}
        color={"white"}
        style={{
          borderRadius: "100",
          height: "80px",
          width: "100px",
          position: "fixed",
          right: "30px",
          bottom: "50px",
        }}
        disabled={clickedCards.length !== 2}
      >
        <Text>비교하기</Text>
      </Button>
      {clickedCards && (
        <Modal2
          isOpen={isOpen}
          onClose={onClose}
          clickedCardInfo={clickedCards}
          month={selectedMonth}
        ></Modal2>
      )}
      {/* </div>
      )} */}
      <Flex
        className="hi"
        position="absolute"
        background="#F4F7FE"
        top="-100px"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        paddingTop={350}
        filter="opacity(0.95)"
      >
        <Loading />
      </Flex>
    </Box>
  );
}

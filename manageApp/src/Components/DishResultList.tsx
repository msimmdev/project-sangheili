import {
  Box,
  Button,
  Spinner,
  Wrap,
  WrapItem,
  Flex,
  Spacer,
  ButtonGroup,
  Center,
} from "@chakra-ui/react";
import { DbId, Dish } from "@msimmdev/project-sangheili-types";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import DishResult from "./DishResult";
import { Link } from "react-router-dom";

export default ({
  tab,
  page,
  perPage,
  filter,
}: {
  tab: number;
  page: number;
  perPage: number;
  filter: "owned" | "shared" | "all";
}) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dishList, setDishList] = useState<(Dish & DbId)[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const offset = (page - 1) * perPage;
    let queryFilter = "";
    if (filter === "owned") {
      queryFilter = "&owner[$eq]=$me";
    } else if (filter === "shared") {
      queryFilter = "&shared[$eq]=$me";
    }
    fetch(
      `http://localhost:3100/dish?offset=${offset}&limit=${perPage}` +
        queryFilter,
      {
        headers: {
          Authorization: "Bearer " + auth.user?.access_token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.error("Invalid response", response);
          throw new Error("Unable to retrieve dishes");
        }
        return response.json();
      })
      .then((json) => {
        setIsLoading(false);
        setDishList(json);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.error(error);
      });
  }, [page, perPage]);

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <>ERROR</>;
  } else if (typeof dishList !== "undefined") {
    const prevButton = (
      <Button
        as={page === 1 ? undefined : Link}
        to={`/dishes/${tab}/${perPage}/${page - 1}`}
        isDisabled={page === 1}
        leftIcon={<span className="material-symbols-outlined">arrow_back</span>}
      >
        Prev
      </Button>
    );

    const nextButton = (
      <Button
        as={dishList.length !== perPage ? undefined : Link}
        to={`/dishes/${tab}/${perPage}/${page + 1}`}
        isDisabled={dishList.length !== perPage}
        rightIcon={
          <span className="material-symbols-outlined">arrow_forward</span>
        }
      >
        Next
      </Button>
    );

    const addButton = (
      <Button
        as={Link}
        to="/dishes/add"
        leftIcon={<span className="material-symbols-outlined">add</span>}
      >
        Add New Dish
      </Button>
    );

    const resultHeader = (
      <Flex paddingBottom="10px">
        <ButtonGroup>
          {prevButton}
          {nextButton}
        </ButtonGroup>
        <Spacer />
        {addButton}
      </Flex>
    );

    if (dishList.length === 0) {
      content = (
        <Box>
          {resultHeader}
          <Center>No Dishes to Display</Center>
        </Box>
      );
    } else {
      const dishDisplay: JSX.Element[] = [];
      for (const dish of dishList) {
        dishDisplay.push(
          <WrapItem maxWidth={300}>
            <DishResult
              dish={dish}
              layout="vertical"
              withLink={true}
              imgSize="sm"
            />
          </WrapItem>
        );
      }

      content = (
        <Box>
          {resultHeader}
          <Wrap spacing="10px">{dishDisplay}</Wrap>
          <Flex paddingTop="10px">
            <ButtonGroup>
              {prevButton}
              {nextButton}
            </ButtonGroup>
          </Flex>
        </Box>
      );
    }
  } else {
    content = <></>;
  }

  return <Box>{content}</Box>;
};

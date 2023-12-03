import {
  Box,
  Button,
  Spinner,
  Wrap,
  WrapItem,
  Flex,
  Spacer,
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
}: {
  tab: number;
  page: number;
  perPage: number;
}) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dishList, setDishList] = useState<(Dish & DbId)[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const offset = (page - 1) * perPage;
    fetch(`http://localhost:3100/dish?offset=${offset}&limit=${perPage}`, {
      headers: {
        Authorization: "Bearer " + auth.user?.access_token,
      },
    })
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
    const dishDisplay: JSX.Element[] = [];
    for (const dish of dishList) {
      dishDisplay.push(
        <WrapItem maxWidth={300}>
          <DishResult {...dish} />
        </WrapItem>
      );
    }

    let prevButton = <></>;
    if (page !== 1) {
      prevButton = (
        <Button as={Link} to={`/dishes/${tab}/${perPage}/${page - 1}`}>
          Prev
        </Button>
      );
    }

    let nextButton = <></>;
    if (dishList.length === perPage) {
      nextButton = (
        <Button as={Link} to={`/dishes/${tab}/${perPage}/${page + 1}`}>
          Next
        </Button>
      );
    }

    content = (
      <Box>
        <Flex paddingBottom="10px">
          {prevButton}
          <Spacer />
          {nextButton}
        </Flex>
        <Wrap spacing="10px">{dishDisplay}</Wrap>
        <Flex paddingTop="10px">
          {prevButton}
          <Spacer />
          {nextButton}
        </Flex>
      </Box>
    );
  } else {
    content = <></>;
  }

  return <Box>{content}</Box>;
};

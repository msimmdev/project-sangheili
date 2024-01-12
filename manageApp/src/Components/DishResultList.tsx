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
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Input,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { DbId, Dish } from "@msimmdev/project-sangheili-types";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import DishResult from "./DishResult";
import { Link } from "react-router-dom";

const DishResultList = ({
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
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<Error>();
  const searchRef = useRef(null);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    const useQueryFilter = new URLSearchParams({
      offset: offset.toString(),
      limit: perPage.toString(),
    });
    if (filter === "owned") {
      useQueryFilter.append("owner[$eq]", "$me");
    } else if (filter === "shared") {
      useQueryFilter.append("shared[$eq]", "$me");
    }

    if (search !== "") {
      useQueryFilter.append("name[$contains]", search);
    }

    fetch("http://localhost:3100/dish?" + useQueryFilter.toString(), {
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
  }, [page, perPage, search, filter, auth.user?.access_token]);

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
        colorScheme="almond"
        variant="outline"
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
        colorScheme="almond"
        variant="outline"
      >
        Next
      </Button>
    );

    const addButton = (
      <Button
        as={Link}
        to="/dishes/add"
        leftIcon={<span className="material-symbols-outlined">add</span>}
        colorScheme="almond"
      >
        Add New Dish
      </Button>
    );

    const filter = (
      <Popover initialFocusRef={searchRef}>
        {({ isOpen }) => (
          <>
            <PopoverTrigger>
              <Button
                leftIcon={
                  <span className="material-symbols-outlined">search</span>
                }
                isActive={isOpen || search !== ""}
                colorScheme="almond"
                variant="outline"
              >
                Search
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Search</PopoverHeader>
                <PopoverBody>
                  <Stack direction="row">
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      ref={searchRef}
                    />
                    <IconButton
                      icon={
                        <span className="material-symbols-outlined">
                          cancel
                        </span>
                      }
                      aria-label="Clear"
                      colorScheme="almond"
                      variant="ghost"
                      onClick={() => setSearch("")}
                    />
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </>
        )}
      </Popover>
    );

    const resultHeader = (
      <Flex paddingBottom="10px">
        <ButtonGroup>
          {prevButton}
          {nextButton}
          {filter}
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
          <WrapItem maxWidth={300} key={dish.id}>
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

export default DishResultList;

import { Box, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import { DbId, Dish } from "@msimmdev/project-sangheili-types";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import DishResult from "./DishResult";

export default () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dishList, setDishList] = useState<(Dish & DbId)[]>();
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

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
  }, []);

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <>ERROR</>;
  } else if (typeof dishList !== "undefined") {
    const dishDisplay: JSX.Element[] = [];
    for (const dish of dishList) {
      let imgSrc = "";
      if ("variants" in dish.mainImage) {
        const imgVar = dish.mainImage.variants.find((x) => x.sizeTag === "sm");
        if (typeof imgVar !== "undefined") {
          imgSrc = imgVar?.url;
        }
      }
      dishDisplay.push(
        <WrapItem maxWidth={300}>
          <DishResult
            dishName={dish.name}
            dishDescription={dish.description}
            imgSrc={imgSrc}
            key={dish.id}
          />
        </WrapItem>
      );
    }
    content = <Wrap>{dishDisplay}</Wrap>;
  } else {
    content = <></>;
  }

  return <Box>{content}</Box>;
};

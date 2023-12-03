import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { DbId, Dish } from "@msimmdev/project-sangheili-types";
import DishResult from "../Components/DishResult";

export default () => {
  const { dishId } = useParams();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dish, setDish] = useState<Dish & DbId>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetch(`http://localhost:3100/dish/${dishId}`, {
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
        setDish(json);
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
  } else if (typeof dish !== "undefined") {
    content = (
      <DishResult dish={dish} layout="horizontal" imgSize="lg" title="h1" />
    );
  }

  return <Box>{content}</Box>;
};

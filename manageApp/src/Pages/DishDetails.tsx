import {
  Box,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router-dom";
import { DbId, Dish } from "@msimmdev/project-sangheili-types";
import DishResult from "../Components/DishResult";
import CreateRecipeButton from "../Components/CreateRecipeButton";

const DishDetails = () => {
  const { dishId } = useParams();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dish, setDish] = useState<Dish & DbId>();
  const [error, setError] = useState<Error>();

  async function updateDish(updateDishId: string, data: Partial<Dish>) {
    const response = await fetch(`http://localhost:3100/dish/${updateDishId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + auth.user?.access_token,
      },
    });

    if (!response.ok) {
      console.error("Invalid update response", response);
      throw new Error("Unable to update dish");
    }
  }

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
  }, [dishId, auth.user?.access_token]);

  if (typeof dishId === "undefined") {
    return <>ERROR</>;
  }

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <>ERROR</>;
  } else if (typeof dish !== "undefined") {
    content = (
      <>
        <Breadcrumb padding="0.375rem">
          <BreadcrumbItem color="almond.600">
            <BreadcrumbLink as={Link} to="/dishes">
              Browse Dishes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage color="copper.600" fontWeight="bold">
            <BreadcrumbLink>{dish.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <DishResult
          dish={dish}
          layout="horizontal"
          imgSize="lg"
          title="h1"
          editControl={true}
          editSubmit={async (updateData) =>
            await updateDish(dishId, updateData)
          }
        />
        <CreateRecipeButton />
      </>
    );
  }

  return <Box>{content}</Box>;
};

export default DishDetails;

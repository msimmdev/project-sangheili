import { Button } from "@chakra-ui/react";
import { Recipe } from "@msimmdev/project-sangheili-types";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const api_url = import.meta.env.VITE_CRUD_API_URL;

const CreateRecipeButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createRecipe = async () => {
    if (typeof user !== "undefined" && user !== null) {
      const recipeData: Recipe = {
        name: "Untitled Recipe",
        type: "StandAlone",
        description: "",
        ingredientList: [],
        productList: [],
        sections: [],
        isDraft: true,
      };

      const addResponse = await fetch(`${api_url}/recipe`, {
        method: "POST",
        body: JSON.stringify(recipeData),
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!addResponse.ok) {
        console.error(addResponse);
        throw new Error(`Invalid add dish response: ${addResponse.status}}`);
      }

      const addedData = await addResponse.json();

      return navigate(`/recipe/${addedData["id"]}`);
    }
  };

  return (
    <Button
      leftIcon={<span className="material-symbols-outlined">add</span>}
      colorScheme="almond"
      onClick={createRecipe}
    >
      Create Recipe
    </Button>
  );
};

export default CreateRecipeButton;

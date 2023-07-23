import RecipeIngredient from "./recipe-ingredient";

type Recipe = {
  name: string;
  description: string;
  ingredientList: RecipeIngredient[];
};

export default Recipe;

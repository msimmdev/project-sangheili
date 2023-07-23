import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import { Duration } from "moment";

type Recipe = {
  name: string;
  description: string;
  ingredientList: RecipeIngredient[];
  productList: RecipeIngredient[];
  method: RecipeSection[];
  totalTime: Date;
};

export default Recipe;

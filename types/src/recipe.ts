import { UUID } from "crypto";
import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import { Duration } from "moment";

type Recipe = {
  id: UUID;
  name: string;
  description: string;
  ingredientList: RecipeIngredient[];
  productList: RecipeIngredient[];
  sections: RecipeSection[];
  totalTime: Duration | null;
  prepTime: Duration | null;
  cookTime: Duration | null;
};

export default Recipe;

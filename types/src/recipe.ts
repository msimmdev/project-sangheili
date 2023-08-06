import { UUID } from "crypto";
import { Duration } from "moment";
import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import RecipeSummary from "./recipe-summary";
import Image from "./Image";

enum RecipeType {
  StandAlone,
  Variant,
  Remix,
}

type Recipe = {
  id: UUID;
  name: string;
  description: string;
  type: RecipeType;
  ingredientList: RecipeIngredient[];
  productList: RecipeIngredient[];
  sections: RecipeSection[];
  totalTime: Duration | null;
  prepTime: Duration | null;
  cookTime: Duration | null;
  mainImage: Image | null;
  remixParent: RecipeSummary | null;
  remixChildren: RecipeSummary[];
};

export default Recipe;

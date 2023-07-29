import { UUID } from "crypto";
import { Duration } from "moment";
import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import Media from "./media";
import RecipeSummary from "./recipe-summary";

enum RecipeType {
  Default,
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
  media: Media[];
  remixParent: RecipeSummary;
  remixChildren: RecipeSummary[];
};

export default Recipe;

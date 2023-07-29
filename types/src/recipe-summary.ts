import { UUID } from "crypto";
import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import { Duration } from "moment";
import Media from "./media";

type RecipeSummary = {
  id: UUID;
  name: string;
  description: string;
  headlineMedia: Media;
};

export default RecipeSummary;

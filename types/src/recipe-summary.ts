import { UUID } from "crypto";
import RecipeIngredient from "./recipe-ingredient";
import RecipeSection from "./recipe-section";
import { Duration } from "moment";
import Image from "./Image";

type RecipeSummary = {
  id: UUID;
  name: string;
  description: string;
  mainImage: Image;
};

export default RecipeSummary;

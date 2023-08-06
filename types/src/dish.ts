import { UUID } from "crypto";
import Image from "./Image";
import RecipeSummary from "./recipe-summary";

type Dish = {
  id: UUID;
  name: string;
  description: string;
  defaultRecipe: RecipeSummary;
  mainImage: Image;
};

export default Dish;

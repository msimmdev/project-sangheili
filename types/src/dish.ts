import { UUID } from "crypto";
import Recipe from "./recipe";
import Media from "./media";

type Dish = {
  id: UUID;
  name: string;
  description: string;
  defaultRecipe: Recipe;
  media: Media[];
};

export default Dish;

import { AddDish, DishDetails, ManageDishes, EditRecipe } from "./Pages";

export default [
  {
    path: "dishes/:tab?/:perPage?/:page?",
    element: <ManageDishes />,
  },
  {
    path: "dishes/add",
    element: <AddDish />,
  },
  {
    path: "dish/:dishId",
    element: <DishDetails />,
  },
  {
    path: "recipe/:recipeId",
    element: <EditRecipe />,
  },
];

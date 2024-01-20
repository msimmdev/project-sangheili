import {
  AddDish,
  DishDetails,
  ManageDishes,
  EditRecipe,
  ManageRecipes,
} from "./Pages";

export default [
  {
    path: "dishes/:tab?/:perPage?/:page?",
    element: <ManageDishes />,
  },
  {
    path: "recipes/:tab?/:perPage?/:page?",
    element: <ManageRecipes />,
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

import { AddDish, ManageDishes } from "./Pages";

export default [
  {
    path: "dishes",
    element: <ManageDishes />,
  },
  {
    path: "dishes/add",
    element: <AddDish />,
  },
];

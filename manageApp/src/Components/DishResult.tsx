import React from "react";
import { createComponent } from "@lit/react";
import { DishResult as DishResultComponent } from "@msimmdev/project-sangheili-shared-components";

const DishResult = createComponent({
  tagName: "dish-result",
  elementClass: DishResultComponent,
  react: React,
});

export default DishResult;

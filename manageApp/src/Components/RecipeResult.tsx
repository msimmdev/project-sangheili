import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Text,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Box,
  As,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DbId, Recipe } from "@msimmdev/project-sangheili-types";
import InlineEdit from "./InlineEdit";

const RecipeResult = ({
  recipe,
  layout,
  editControl,
  editSubmit,
  withLink,
  imgSize,
  title,
}: {
  recipe: Recipe & DbId;
  layout: "horizontal" | "vertical";
  editControl?: boolean;
  editSubmit?: (updateValue: Partial<Recipe>) => Promise<void>;
  withLink?: boolean;
  imgSize: "xs" | "sm" | "md" | "lg" | "xl";
  title?: As;
}) => {
  let img = <></>;
  if (
    typeof recipe.mainImage !== "undefined" &&
    "variants" in recipe.mainImage
  ) {
    const imgVar = recipe.mainImage.variants.find((x) => x.sizeTag === imgSize);
    if (typeof imgVar !== "undefined") {
      img = (
        <Image
          src={imgVar.url}
          boxSize={layout === "vertical" ? "100%" : { sm: "100%", md: "50%" }}
          borderRadius="0.375rem"
          alt={recipe.mainImage.alt}
        />
      );
    }
  }

  let dishName = <>{recipe.name}</>;
  if (withLink) {
    dishName = (
      <LinkOverlay to={"/recipe/" + recipe.id} as={Link}>
        {recipe.name}
      </LinkOverlay>
    );
  }

  const header = (
    <CardHeader>
      <Heading
        size="md"
        {...(typeof title !== "undefined" ? { as: title } : {})}
      >
        {dishName}
      </Heading>
    </CardHeader>
  );

  let description = (
    <Text {...(layout === "vertical" ? { noOfLines: 5 } : {})}>
      {recipe.description}
    </Text>
  );

  if (editControl && typeof editSubmit !== "undefined") {
    description = (
      <InlineEdit
        defaultValue={recipe.description}
        onSubmit={(val) => editSubmit({ description: val })}
      />
    );
  }

  let content = <></>;

  if (layout === "vertical") {
    content = (
      <Card bg="mint.50">
        {header}
        <CardBody>
          {img}
          {description}
        </CardBody>
      </Card>
    );
  } else if (layout === "horizontal") {
    content = (
      <Card direction="row" bg="mint.50">
        {img}
        <Stack width="100%">
          {header}
          <CardBody>{description}</CardBody>
        </Stack>
      </Card>
    );
  }

  let containedContent = <></>;
  if (withLink) {
    containedContent = <LinkBox as="article">{content}</LinkBox>;
  } else {
    containedContent = <Box as="article">{content}</Box>;
  }

  return containedContent;
};

export default RecipeResult;

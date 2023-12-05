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
import { Dish, DbId } from "@msimmdev/project-sangheili-types";
import InlineEdit from "./InlineEdit";

export default ({
  dish,
  layout,
  editControl,
  editSubmit,
  withLink,
  imgSize,
  title,
}: {
  dish: Dish & DbId;
  layout: "horizontal" | "vertical";
  editControl?: boolean;
  editSubmit?: (updateValue: Partial<Dish>) => Promise<void>;
  withLink?: boolean;
  imgSize: "xs" | "sm" | "md" | "lg" | "xl";
  title?: As;
}) => {
  let img = <></>;
  if ("variants" in dish.mainImage) {
    const imgVar = dish.mainImage.variants.find((x) => x.sizeTag === imgSize);
    if (typeof imgVar !== "undefined") {
      img = (
        <Image
          src={imgVar.url}
          boxSize={layout === "vertical" ? "100%" : { sm: "100%", md: "50%" }}
          borderRadius="0.375rem"
          alt={dish.mainImage.alt}
        />
      );
    }
  }

  let dishName = <>{dish.name}</>;
  if (withLink) {
    dishName = (
      <LinkOverlay to={"/dish/" + dish.id} as={Link}>
        {dish.name}
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
      {dish.description}
    </Text>
  );

  if (editControl && typeof editSubmit !== "undefined") {
    description = (
      <InlineEdit
        defaultValue={dish.description}
        onSubmit={(val) => editSubmit({ description: val })}
      />
    );
  }

  let content = <></>;

  if (layout === "vertical") {
    content = (
      <Card>
        {header}
        <CardBody>
          {img}
          {description}
        </CardBody>
      </Card>
    );
  } else if (layout === "horizontal") {
    content = (
      <Card direction="row">
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

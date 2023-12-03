import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Text,
  Heading,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Dish, DbId } from "@msimmdev/project-sangheili-types";

export default (dish: Dish & DbId) => {
  let img = <></>;
  if ("variants" in dish.mainImage) {
    const imgVar = dish.mainImage.variants.find((x) => x.sizeTag === "sm");
    if (typeof imgVar !== "undefined") {
      img = <Image src={imgVar.url} />;
    }
  }

  return (
    <LinkBox as="article">
      <Card>
        <CardHeader>
          <Heading size="md">
            <LinkOverlay to={"/dish/" + dish.id} as={Link}>
              {dish.name}
            </LinkOverlay>
          </Heading>
        </CardHeader>
        <CardBody>
          {img}
          <Text noOfLines={5}>{dish.description}</Text>
        </CardBody>
      </Card>
    </LinkBox>
  );
};

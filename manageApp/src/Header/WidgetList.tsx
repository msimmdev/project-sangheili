import { Wrap, WrapItem } from "@chakra-ui/react";
import { UserProfile } from "./Widgets";

const WidgetList = () => (
  <Wrap>
    <WrapItem>
      <UserProfile />
    </WrapItem>
  </Wrap>
);

export default WidgetList;

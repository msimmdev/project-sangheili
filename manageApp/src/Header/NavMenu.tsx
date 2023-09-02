import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default () => (
  <Wrap justify="right" flexGrow={1}>
    <WrapItem>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={
            <span className="material-symbols-outlined">arrow_drop_down</span>
          }
        >
          Dishes
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} to="/dishes">
            Browse Dishes
          </MenuItem>
          <MenuItem as={Link} to="/dishes/add">
            Add a New Dish
          </MenuItem>
        </MenuList>
      </Menu>
    </WrapItem>
    <WrapItem>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={
            <span className="material-symbols-outlined">arrow_drop_down</span>
          }
        >
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>Test 1</MenuItem>
          <MenuItem>Test 2</MenuItem>
        </MenuList>
      </Menu>
    </WrapItem>
  </Wrap>
);

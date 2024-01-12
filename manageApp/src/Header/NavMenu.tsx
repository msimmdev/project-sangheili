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

const NavMenu = () => (
  <Wrap justify="right" flexGrow={1} marginRight={5}>
    <WrapItem>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={
            <span className="material-symbols-outlined">arrow_drop_down</span>
          }
          colorScheme="copper"
          variant="outline"
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
  </Wrap>
);

export default NavMenu;

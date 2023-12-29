import {
  Avatar,
  Portal,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
} from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

export default () => {
  const auth = useAuth();
  return (
    <Menu>
      <MenuButton>
        <Avatar name={auth.user?.profile.name} size="sm" role="button" />
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuItem
            color="tomato"
            fontWeight="bold"
            onClick={() =>
              auth.signoutRedirect({
                post_logout_redirect_uri: import.meta.env
                  .VITE_POST_LOGOUT_REDIRECT,
              })
            }
          >
            Log Out
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

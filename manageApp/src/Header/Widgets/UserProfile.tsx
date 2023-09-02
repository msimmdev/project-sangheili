import { Avatar } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

export default () => {
  const auth = useAuth();
  return <Avatar name={auth.user?.profile.name} />;
};

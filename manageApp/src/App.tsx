import { Outlet } from "react-router-dom";
import { useAuth, hasAuthParams } from "react-oidc-context";
import { useEffect } from "react";
import {
  Box,
  AbsoluteCenter,
  CircularProgress,
  Alert,
  SkipNavLink,
} from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  const { isLoading, isAuthenticated, error, activeNavigator, signinRedirect } =
    useAuth();

  useEffect(() => {
    if (!hasAuthParams() && !isAuthenticated && !activeNavigator && !isLoading)
      signinRedirect();
  }, [isAuthenticated, activeNavigator, isLoading, signinRedirect]);

  if (isLoading) {
    return (
      <Box position="relative" h="100px">
        <AbsoluteCenter>
          <CircularProgress />
        </AbsoluteCenter>
      </Box>
    );
  }

  if (error) {
    return (
      <Box position="relative" h="100px">
        <AbsoluteCenter>
          <Alert status="error">{error.message}</Alert>
        </AbsoluteCenter>
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <SkipNavLink>Skip to Content</SkipNavLink>
        <Header />
        <main className="container">
          <Outlet />
        </main>
        <Footer />
      </>
    );
  }
}

export default App;

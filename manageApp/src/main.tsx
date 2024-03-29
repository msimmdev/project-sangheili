import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { ChakraProvider } from "@chakra-ui/react";
import routes from "./routes";
import App from "./App.tsx";
import "./index.css";
import theme from "./theme.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authority={import.meta.env.VITE_AUTH_AUTHORITY}
      client_id={import.meta.env.VITE_AUTH_CLIENTID}
      redirect_uri={import.meta.env.VITE_AUTH_REDIRECT}
      scope="openid https://sangheili.onmicrosoft.com/76dcec81-27ef-4b4b-ad4a-e722a65963b5/Dishes.ReadWrite https://sangheili.onmicrosoft.com/76dcec81-27ef-4b4b-ad4a-e722a65963b5/Recipes.ReadWrite"
      onSigninCallback={onSigninCallback}
    >
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);

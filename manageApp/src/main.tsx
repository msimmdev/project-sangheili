import React from "react";
import ReactDOM from "react-dom/client";
import { User } from "oidc-client-ts";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import routes from "./routes";
import App from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider
    authority={import.meta.env.VITE_AUTH_AUTHORITY}
    client_id={import.meta.env.VITE_AUTH_CLIENTID}
    redirect_uri={import.meta.env.VITE_AUTH_REDIRECT}
    scope="openid https://sangheili.onmicrosoft.com/76dcec81-27ef-4b4b-ad4a-e722a65963b5/Dishes.ReadWrite"
    onSigninCallback={onSigninCallback}
  >
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AuthProvider>
);

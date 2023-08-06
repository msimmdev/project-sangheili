import React from "react";
import ReactDOM from "react-dom/client";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider
    authority={import.meta.env.VITE_AUTH_AUTHORITY}
    client_id={import.meta.env.VITE_AUTH_CLIENTID}
    redirect_uri={import.meta.env.VITE_AUTH_REDIRECT}
  >
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AuthProvider>
);

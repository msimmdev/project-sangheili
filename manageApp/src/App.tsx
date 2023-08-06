import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  const { isLoading, isAuthenticated, error, signinRedirect } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signinRedirect();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (isAuthenticated) {
    return (
      <>
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

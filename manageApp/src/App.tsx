import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
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

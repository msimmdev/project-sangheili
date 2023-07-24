import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="header-bar">
        <header className="container">
          <div className="header-title">Project Sangheili</div>
          <div className="header-search">
            <form
              action="/search"
              method="GET"
              role="search"
              autoComplete="off"
              className="search-form"
            >
              <input type="text" placeholder="Search..." name="p" />
              <button>
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
          </div>
          <div className="header-widgets">Widgets</div>
        </header>
      </div>
      <main className="container">
        <Outlet />
      </main>
      <div className="footer-bar">
        <footer className="container">This is a footer</footer>
      </div>
    </>
  );
}

export default App;

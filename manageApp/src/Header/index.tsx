import Title from "./Title";
import Search from "./Search";
import Widgets from "./Widgets";

export default () => (
  <div className="header-bar">
    <header className="container">
      <Title />
      <Search />
      <Widgets />
    </header>
  </div>
);

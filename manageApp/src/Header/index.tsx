import Title from "./Title";
import Search from "./Search";
import WidgetList from "./WidgetList";

export default () => (
  <div className="header-bar">
    <header className="container">
      <Title />
      <Search />
      <WidgetList />
    </header>
  </div>
);

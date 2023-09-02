import Title from "./Title";
import WidgetList from "./WidgetList";
import NavMenu from "./NavMenu";

export default () => (
  <div className="header-bar">
    <header className="container">
      <Title />
      <NavMenu />
      <WidgetList />
    </header>
  </div>
);

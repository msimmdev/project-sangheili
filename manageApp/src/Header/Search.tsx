export default () => (
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
);

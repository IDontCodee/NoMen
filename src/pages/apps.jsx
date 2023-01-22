import React from "react";
import Nav from "../components/nav.jsx";
import Head from "../components/head.jsx";
import Obfuscate from "../components/obfuscate.jsx";
import Proxy from "../components/proxy.jsx";
import globeSVG from "../assets/globe.svg";
import { getLink, fetchJSON } from "../util.js";

function Apps() {
  var proxy = React.useRef();
  const [appItems, setAppItems] = React.useState([]);
  React.useEffect(() => { fetchJSON("/apps.json", setAppItems) }, []);

  function goApp(config) {
    try {
      proxy.current.open({
        title: config.name,
        icon: config.icon,
        url: getLink(config.url)
      });
    } catch (err) {
      console.error(err);
      alert(err.toString());
    }
  }

  var [appsSearchTerm, setAppsSearchTerm] = React.useState("");

  function searchAppsType(e) {
    setAppsSearchTerm(e.target.value.toLowerCase());
  }

  const appItemsSearched = appItems.filter((item) => {
    if (!appsSearchTerm) {
      return item;
    } else {
      return item.name.toLowerCase().includes(appsSearchTerm);
    }
  });
  return (
    <>
      <Head defaultTitle="Apps | sussy"></Head>
      <Nav />
      <Proxy ref={proxy} />
      <div className="omniboxcontainersearch omniboxcontainer">
        <div className="omnisearch omnibox">
          <div className="searchicon">
            <svg
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </div>
          <input
            onKeyUp={searchAppsType}
            autoComplete="off"
            autoFocus
            id="search"
            className="search"
            placeholder="Search Apps"
          />
        </div>
      </div>
      {!appItemsSearched.length ? (
        <div className="desc">No results found.</div>
      ) : (
        ""
      )}
      <div className="gitems">
        {appItemsSearched.map((item, i) => {
          return (
            <div
              onClick={() => goApp(item, item.isMoreStuff)}
              style={{
                backgroundImage: `url(${item.icon}), url(${JSON.stringify(globeSVG)})`,
                backgroundSize: "cover",
                backgroundPosition: "0% 0%",
              }}
              className="gitem"
              key={i}
            >
              <div className="gtext">
                <Obfuscate>{item.name}</Obfuscate>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Apps;

import React from "react";
import Messenger from "../Messenger";
import Auth from "../Auth";
export default function App() {
  return (
    <div className="App">
      {localStorage.getItem("id") ? <Messenger /> : <Auth />}
    </div>
  );
}

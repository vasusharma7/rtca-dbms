import React from "react";
import Messenger from "../Messenger";
import Auth from "../Auth";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {localStorage.getItem("id") ? <Messenger /> : <Auth />}
      </div>
    </Provider>
  );
}

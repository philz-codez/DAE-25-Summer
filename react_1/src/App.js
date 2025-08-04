import "./styles.css";
import Card from "./Components/Card";
import RAH from "./Components/RAH";
import { useState } from "react";

export default function App() {
  let [upvote, setUpvote] = useState(0);

  function like() {
    return setUpvote((upvote += 1));
  }
  return (
    <div className="App">
      (upvote)
      <button onClick={like}>yes</button>
      <RAH />
      <RAH />
      <Card Name="Mo" Work="SWE" />
      <Card Name="Kay" Work="Chef" pics />
      <Card Name="Sam" Work="President" />
    </div>
  );
}

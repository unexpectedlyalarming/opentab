import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TabEditor from "./components/TabEditor";
import TabEditorTwo from "./components/TabEditor2";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TabEditorTwo />
    </>
  );
}

export default App;

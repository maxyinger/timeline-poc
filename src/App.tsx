import React, { useState, useEffect } from "react";
import timeline, { tween } from "./timeline";
import logo from "./logo.svg";
import "./App.css";

const timeWine = timeline([
  {
    key: "logo",
    progressor: tween({
      from: {
        y: -200
      },
      to: {
        y: 0
      }
    })
  },
  {
    key: "headline",
    progressor: tween({
      from: {
        x: -200
      },
      to: {
        x: 0
      }
    })
  }
]);

function App() {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(() => timeWine.setProgress(0));

  useEffect(() => {
    const unsubscribe = timeWine.subscribe(v => setCurrent(v));
    return unsubscribe;
  }, []);

  useEffect(() => {
    timeWine.setProgress(progress);
  }, [progress]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{progress}</p>
        <pre>{JSON.stringify(current, null, "\t")}</pre>
        <div>
          <button onClick={() => setProgress(v => v - 0.1)}>-0.1</button>
          <button onClick={() => setProgress(v => v + 0.1)}>+0.1</button>
        </div>
      </header>
    </div>
  );
}

export default App;

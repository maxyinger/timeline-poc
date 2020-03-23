import React, { useLayoutEffect, useEffect } from "react";
import timeline, { tween, play, easing } from "./timeline";
import logo from "./logo.svg";
import "./App.css";

const tl = timeline([
  {
    key: "app",
    progressor: tween({
      ease: easing.inOutSine,
      duration: 1000,
      from: {
        y: -100
      },
      to: {
        y: 0
      }
    })
  },
  {
    key: "inner",
    offset: 0,
    progressor: tween({
      ease: easing.inOutSine,
      duration: 1000,
      from: {
        y: 100
      },
      to: {
        y: 0
      }
    })
  },
  {
    key: "logo",
    offset: v => v - 300,
    progressor: tween({
      ease: easing.outQuint,
      duration: 4000,
      from: {
        opacity: 0,
        y: -50
      },
      to: {
        opacity: 1,
        y: 0
      }
    })
  },
  {
    key: "subheadline",
    offset: v => v - 3000,
    progressor: tween({
      ease: easing.outCirc,
      duration: 2000,
      from: {
        opacity: 0,
        y: 40
      },
      to: {
        opacity: 1,
        y: 0
      }
    })
  }
]);

function App() {
  useLayoutEffect(() => {
    const unsubscribe = tl.subscribe(v => {
      Object.entries(v).forEach(([key, val]) => {
        Object.entries(val).forEach(([property, pureVal]) => {
          document.body.style.setProperty(`--${key}-${property}`, pureVal);
        });
      });
    });

    tl.setProgress(0);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const id = setTimeout(() => play(tl), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="App fsa"
      style={{
        transform: `translateY(calc(var(--app-y) * 1%))`
      }}
    >
      <div
        className="inner fsa"
        style={{
          transform: `translateY(calc(var(--inner-y) * 1%))`
        }}
      >
        <div className="bg fsa">
          SOME BACKGORUND TEXT SOME BACKGORUND TEXT SOME BACKGORUND TEXT SOME
          BACKGORUND TEXT SOME BACKGORUND TEXT
        </div>
        <header className="App-header">
          <div
            style={{
              opacity: `var(--logo-opacity)`,
              transform: `translateY(calc(var(--logo-y) * 1%))`
            }}
          >
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div
            style={{
              opacity: `var(--subheadline-opacity)`,
              transform: `translateY(calc(var(--subheadline-y) * 1%))`
            }}
          >
            <p>Subheadline</p>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;

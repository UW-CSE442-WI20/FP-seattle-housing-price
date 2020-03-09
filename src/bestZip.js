import React from "react";
import ReactDOM from "react-dom";

import {BaseProvider, LightTheme} from 'baseui';
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

import DragDropList from "./dragDropList";
import Buttons from "./buttons";

const engine = new Styletron();

function App() {
  return (<div>
      <DragDropList />
      <Buttons/>
      </div>);
}

const rootElement = document.getElementById("priority-list");
ReactDOM.render(
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
      <App />
    </BaseProvider>
  </StyletronProvider>,
  rootElement
);
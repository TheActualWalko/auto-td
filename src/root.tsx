import React = require("react");
import GameHeader from "./game-header";
import GameBoard  from "./game-board";
import GameFooter from "./game-footer";
import { Provider } from "react-redux";
import state from "./state";
export default class App extends React.Component<{},{}>{
  render() {
    return (
      <Provider store={state}>
        <div className="game-wrap">
          <GameHeader />
          <GameBoard />
          <GameFooter />
        </div>
      </Provider>
    );
  }
}

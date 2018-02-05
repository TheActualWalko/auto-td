import React = require("react");
import { connect } from "react-redux";
import { GameState } from "./state";

const GameHeader = ({ round })=>(
  <header className="main-header">
    <h2 className="round-title">Round { round + 1 }</h2>
  </header>
);

const mapStateToProps = ( state : GameState , ownProps )=>{
  return {
    round : state.round
  }
}

export default connect( mapStateToProps )( GameHeader );
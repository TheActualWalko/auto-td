import React = require("react");
import { connect } from "react-redux";
import { GameState, GamePhase, nextPhase } from "./state";

const stateMessagesByPhase = {
  [ GamePhase.BEFORE_FIRST_ROUND ] : "Welcome to Auto-TD. Click the orange button to place your first tower.",
  [ GamePhase.BUILD ]              : "The gate is closed. Open it when you are ready.",
  [ GamePhase.DEFEND ]             : "Minions are attacking. Good luck!",
  [ GamePhase.LIMBO ]              : "You survived. Drop a tower to continue.",
  [ GamePhase.GAME_OVER ]          : "Game over. Click the orange button to restart."
};

const advanceMessagesByPhase = {
  [ GamePhase.BEFORE_FIRST_ROUND ] : "Begin Game",
  [ GamePhase.BUILD ]              : "Open the Gate",
  [ GamePhase.DEFEND ]             : "Defending",
  [ GamePhase.LIMBO ]              : "Drop Tower",
  [ GamePhase.GAME_OVER ]          : "Restart"
};

const GameFooter = ({ phase, nextPhase })=>{
  let buttonClassName = "game-advance";
  if( phase === GamePhase.DEFEND ){
    buttonClassName += " disabled";
  }
  return (
    <footer className="main-footer">
      <p className="game-phase">{ stateMessagesByPhase[ phase ] }</p>
      <button 
        className={ buttonClassName }
        onClick={ ()=>nextPhase() }
      >
        { advanceMessagesByPhase[ phase ] }
      </button>
    </footer>
  );
};

const mapStateToProps = ( state : GameState , ownProps )=>{
  return {
    phase : state.phase
  };
};

const mapDispatchToProps = ( dispatch, ownProps )=>{
  return {
    nextPhase : ()=>{
      dispatch( nextPhase() );
    }
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( GameFooter );
import React = require("react");
import { connect } from "react-redux";
import { GameState, GamePhase } from "./state";
import {
  TileType,
  Direction,
  Coordinates,
  Player,
  Tower,
  Minion,
  TileMap,
  WorldState
} from "./world/types";

import {
  mapTiles,
  moveCoords,
  coordsToKey
} from "./world/helpers";

const classNamesByType = {
  [ TileType.GRASS ] : "grass",
  [ TileType.ROCK  ] : "rock",
  [ TileType.EMPTY ] : "empty",
  [ TileType.TOWER ] : "tower"
};

const renderTowerInsides = ()=>{
  return <div className="tower-top"></div>
}

const makeRenderTile = ( width : number, height : number )=>{
  const tileWidth  = ( 1/width  )*100 + "%";
  const tileHeight = ( 1/height )*100 + "%";
  return ( type : TileType, coords : Coordinates )=>(
    <div 
      key={coordsToKey(coords)}
      className={ "tile " + classNamesByType[ type ] }
      style={{
        width  : tileWidth,
        height : tileHeight,
        left   : ( coords.x/width  )*100 + "%",
        top    : ( coords.y/height )*100 + "%"
      }}
    >
      { type === TileType.TOWER ? renderTowerInsides() : null }
    </div>
  );
};

const renderOneMinion = ( minion, width, height )=>{
  return (
    <div 
      key={minion.id}
      className="minion"
      style={{
        opacity : ( minion.health === 100 ? 1.0 : 0.8 ),
        width  : ( 1/width  )*100 + "%",
        height : ( 1/height )*100 + "%",
        left   : (minion.coords.x / width ) * 100 + "%",
        top    : (minion.coords.y / height) * 100 + "%"
      }}
    >
      { minion.health < 100 && (
        <div className="minion-health-bar-wrap">
          <div 
            className="minion-health-bar"
            style={{
              width : (minion.health)+"%"
            }}
          ></div>
        </div>
      ) }
    </div>
  );
};

const renderMinions = ( minions, width, height )=>{
  return minions.map( (m, i)=>renderOneMinion( m, width, height ) );
}

const renderOneProjectile = ( projectile, width, height )=>{
  return (
    <div 
      key={projectile.id}
      className="projectile"
      style={{
        width  : ( 1/width  )*100 + "%",
        height : ( 1/height )*100 + "%",
        left   : (projectile.coords.x / width ) * 100 + "%",
        top    : (projectile.coords.y / height) * 100 + "%"
      }}
    >
    </div>
  );
};

const renderProjectiles = ( projectiles, width, height )=>{
  return projectiles.map( (p, i)=>renderOneProjectile( p, width, height ) );
}

const renderPlayer = ( player, width, height )=>(
  <div 
    className="player"
    style={{
      width  : ( 1/width  )*100 + "%",
      height : ( 1/height )*100 + "%",
      left   : (player.coords.x / width ) * 100 + "%",
      top    : (player.coords.y / height) * 100 + "%"
    }}
  >
  </div>
);

const renderPlayerTarget = ( player : Player, carrying : boolean, width : number, height : number )=>{
  const target = moveCoords( player.coords, player.direction );
  let className = "player-target";
  if( carrying ){
    className += " carrying";
  }
  return (
    <div 
      className={ className }
      style={{
        width  : ( 1/width  )*100 + "%",
        height : ( 1/height )*100 + "%",
        left   : (target.x / width ) * 100 + "%",
        top    : (target.y / height) * 100 + "%"
      }}
    >
    </div>
  );
};

const GameBoard = ( state : GameState )=>{
  const world = state.world;
  const renderTile = makeRenderTile( world.width, world.height );
  return (
    <main className="game-board">
      { mapTiles( world.tiles, renderTile ) }
      { renderPlayer( world.player, world.width, world.height ) }
      { state.phase === GamePhase.BUILD && renderPlayerTarget( world.player, world.carrying, world.width, world.height ) }
      { state.phase === GamePhase.DEFEND && renderMinions( world.minions, world.width, world.height ) }
      { state.phase === GamePhase.DEFEND && renderProjectiles( world.projectiles, world.width, world.height ) }
    </main>
  );
};

const mapStateToProps = ( state : GameState , ownProps )=>{
  return state;
}

export default connect( mapStateToProps )( GameBoard );
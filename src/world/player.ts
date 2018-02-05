import { assignNew } from "../helpers";

import {
  TileType,
  Direction,
  Coordinates,
  Player,
  Tower,
  Minion,
  TileMap,
  ScoreMap,
  WorldState
} from "./types";

import { moveCoords } from "./helpers";
import { getTile, setTile, clearTile } from "./tiles";

export const setPlayerDirection = ( state : WorldState, direction : Direction ) : WorldState=>{
  return assignNew( 
    state, 
    { 
      player : assignNew( 
        state.player,
        { direction : direction }
      )
    } 
  );
};

export const movePlayer = ( state : WorldState, direction : Direction ) : WorldState=>{
  const newCoords = moveCoords( state.player.coords, direction );
  if( 
    newCoords.x < 0             || 
    newCoords.y < 0             || 
    newCoords.y >= state.height ||
    newCoords.x >= state.width 
  ){
    return state;
  }else if( getTile( state.tiles, newCoords ) !== TileType.EMPTY ){
    return state;
  }else{
    return assignNew( 
      state, 
      { 
        player : assignNew( 
          state.player,
          { coords : newCoords }
        )
      } 
    );
  }
};

export const placeCarrying = (
  state : WorldState,
  targetTileCoords : Coordinates
) : WorldState=>{
  const targetTileType = getTile( state.tiles, targetTileCoords );
  if( targetTileType === TileType.GRASS || targetTileType === TileType.EMPTY ){
    return assignNew( 
      state, 
      { 
        tiles : setTile( state.tiles, targetTileCoords, TileType.ROCK ) ,
        carrying : false
      }
    );
  }else{
    return state;
  }
};

export const collectTile = ( 
  state : WorldState,
  targetTileCoords : Coordinates
) : WorldState=>{
  const targetTileType = getTile( state.tiles, targetTileCoords );
  if( targetTileType === TileType.GRASS ){
    return assignNew( 
      state, 
      { tiles : clearTile( state.tiles, targetTileCoords ) }
    );
  }else if( targetTileType === TileType.ROCK ){
    return assignNew(
      state,
      { 
        tiles    : clearTile( state.tiles, targetTileCoords ),
        carrying : true
      }
    );
  }else{
    return state;
  }
};

export const useTargetTile = ( state : WorldState ) : WorldState=>{
  const targetTileCoords = moveCoords( state.player.coords, state.player.direction );
  let operation : ( s : WorldState, c : Coordinates )=>WorldState;
  if( state.carrying ){
    return placeCarrying( state, targetTileCoords );
  }else{
    return collectTile( state, targetTileCoords );
  }
};

export const directPlayer = ( state : WorldState, direction : Direction ) : WorldState=>{
  let operation : ( s : WorldState, d : Direction )=>WorldState;
  if( state.player.direction !== direction ){
    operation = setPlayerDirection;
  }else{
    operation = movePlayer;
  }
  return operation( state, direction );
};
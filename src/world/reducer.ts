import { assignNew } from "../helpers";

import {
  TileType,
  Direction,
  Coordinates,
  Player,
  Tower,
  Minion,
  TileMap,
  WorldState
} from "./types";

import {
  DROP_TOWER,
  DIRECT_PLAYER,
  USE_TARGET_TILE,
  TIME_STEP
} from "./actions";


import {
  coordsToKey,
  getRandomCoords,
  randomWalk
} from "./helpers";

import { setTile } from "./tiles";
import { dropTower } from "./towers";
import { directPlayer, useTargetTile } from "./player";
import { moveMinions } from "./minions";
import { moveProjectiles, spawnProjectiles } from "./projectiles";

const getRandomTileMap = ( width : number, height : number )=>{
  let tileMap : TileMap = {};
  const rockPatchCount = Math.round(Math.random()) + Math.ceil(( width * height ) / 64);

  for( let x = 0; x < width; x ++ ){
    for( let y = 0; y < height; y ++ ){
      tileMap[ coordsToKey( { x, y } ) ] = TileType.GRASS;
    }
  }

  for( let i = 0; i < rockPatchCount; i ++ ){
    const rockPatchSteps = ( Math.random() * 3 ) + 4;
    let coords = getRandomCoords( width, height );
    for( let j = 0; j < rockPatchSteps; j ++ ){
      tileMap = setTile( tileMap, coords, TileType.ROCK );
      coords = randomWalk( width, height, coords );
    }
  }

  let coords = { x : 0, y : 0 };
  let tries = 0;
  while( tries++ < 10000 && (coords.x !== width-1 || coords.y !== height-1) ){
    tileMap = setTile( tileMap, coords, TileType.EMPTY );
    coords = randomWalk( width, height, coords, 1, 1 );
  }
  tileMap = setTile( tileMap, coords, TileType.EMPTY );

  return tileMap;
}

const DefaultWorldState = {
  tiles  : getRandomTileMap( 16, 16 ),
  player : {
    coords    : { x : 0, y : 0 },
    direction : Direction.RIGHT
  },
  towers  : [],
  minions : [],
  projectiles : [],
  carrying : null,
  width  : 16,
  height : 16,
  minionsToSpawn : 4,
  stepIndex      : 0
};

const MOVE_MINIONS_EVERY = 4;
const MOVE_PROJECTILES_EVERY = 1;
const SPAWN_PROJECTILES_EVERY = 1;

export default (
  state  : WorldState = DefaultWorldState,
  action : any
)=>{
  switch( action.type ){
    case DROP_TOWER:{
      return dropTower( state, action.coords );
    }
    case DIRECT_PLAYER:{
      return directPlayer( state, action.direction );
    }
    case USE_TARGET_TILE:{
      return useTargetTile( state );
    }
    case TIME_STEP:{
      let outputState = assignNew( 
        state, 
        { stepIndex : state.stepIndex + 1 } 
      );
      if( state.stepIndex % MOVE_MINIONS_EVERY === 0 ){
        outputState = moveMinions( outputState );
      }
      if( state.stepIndex % MOVE_PROJECTILES_EVERY === 0 ){
        outputState = moveProjectiles( outputState );
      }
      if( state.stepIndex % SPAWN_PROJECTILES_EVERY === 0 ){
        outputState = spawnProjectiles( outputState );
      }
      return outputState;
    }
    default:{
      return state;
    }
  }
};
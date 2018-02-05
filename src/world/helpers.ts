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

import {
  getScoreGrid,
  getValidNeighbourCoords
} from "./path-finding";

import {
  getTile
} from "./tiles";

export const getRandomCoords = ( width, height ) : Coordinates=>{
  return {
    x : Math.floor( Math.random() * width ),
    y : Math.floor( Math.random() * height )
  }
};

export const randomWalk = ( 
  width  : number, 
  height : number, 
  coords : Coordinates,
  biasX : number = 0,
  biasY : number = 0
) : Coordinates=>{
  const directions = [];
  if( coords.x > 0 ){
    directions.push( Direction.LEFT );
    if( biasX < 0 ){
      for( let i = 0; i < -1*biasX; i ++ ){
        directions.push( Direction.LEFT );
      }
    }
  }
  if( coords.x < (width-1) ){
    directions.push( Direction.RIGHT );
    if( biasX > 0 ){
      for( let i = 0; i < biasX; i ++ ){
        directions.push( Direction.RIGHT );
      }
    }
  }
  if( coords.y > 0 ){
    directions.push( Direction.UP );
    if( biasY < 0 ){
      for( let i = 0; i < -1*biasY; i ++ ){
        directions.push( Direction.UP );
      }
    }
  }
  if( coords.y < (height-1) ){
    directions.push( Direction.DOWN );
    if( biasY > 0 ){
      for( let i = 0; i < biasY; i ++ ){
        directions.push( Direction.DOWN );
      }
    }
  }
  return moveCoords( coords, directions[ Math.floor(Math.random() * directions.length) ] );
}

export const coordsToKey = ( coords : Coordinates ) : string=>{
  return coords.x + "," + coords.y;
};

export const keyToCoords = ( key : string ) : Coordinates=>{
  const split = key.split(",");
  return {
    x : parseInt( split[0] ),
    y : parseInt( split[1] )
  }
};

export const moveCoords = ( coords : Coordinates, direction : Direction ) : Coordinates=>{
  switch( direction ){
    case Direction.UP:    return { x : coords.x, y : coords.y - 1 };
    case Direction.DOWN:  return { x : coords.x, y : coords.y + 1 };
    case Direction.LEFT:  return { x : coords.x - 1, y : coords.y };
    case Direction.RIGHT: return { x : coords.x + 1, y : coords.y };
  }
};

export const getDistance = ( fromCoords : Coordinates, toCoords : Coordinates ) : number => {
  return Math.sqrt( 
    Math.pow(fromCoords.x - toCoords.x, 2) 
    + 
    Math.pow(fromCoords.y - toCoords.y, 2)
  );
};

export const mapTiles = ( 
  tiles : TileMap, 
  callback : (
    type   : TileType,
    coords : Coordinates
  )=>void )=>{
  const output = [];
  Object.keys( tiles ).forEach( key=>{
    const coords = keyToCoords( key );
    output.push(callback( getTile( tiles, coords ), coords ));
  });
  return output;
};
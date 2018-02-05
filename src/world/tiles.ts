import { assignNew } from "../helpers";

import {
  TileMap,
  TileType,
  Coordinates
} from "./types";

import {
  keyToCoords, coordsToKey 
} from "./helpers";

export const setTile = (
  tiles  : TileMap,
  coords : Coordinates,
  type   : TileType
) : TileMap=>{
  return assignNew(
    tiles,
    { [ coordsToKey( coords ) ] : type }
  );
};

export const getTile = ( tiles : TileMap, coords : Coordinates ) : TileType=>{
  return tiles[ coordsToKey( coords ) ];
};

export const clearTile = ( tiles : TileMap, coords : Coordinates ) : TileMap=>{
  return setTile( tiles, coords, TileType.EMPTY );
};
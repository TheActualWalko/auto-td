import {
  Coordinates,
  Direction
} from "./types";

export const DROP_TOWER = "DROP_TOWER";
export const dropTower = ( coords : Coordinates )=>{
  return {
    type : DROP_TOWER,
    coords
  };
};

export const DIRECT_PLAYER = "DIRECT_PLAYER";
export const directPlayer = ( direction : Direction )=>{
  return {
    type : DIRECT_PLAYER,
    direction
  };
};

export const USE_TARGET_TILE = "USE_TARGET_TILE";
export const useTargetTile = ()=>{
  return {
    type : USE_TARGET_TILE
  };
};

export const TIME_STEP = "TIME_STEP";
export const timeStep = ()=>{
  return {
    type : TIME_STEP
  };
};
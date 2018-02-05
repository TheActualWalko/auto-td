import { assignNew } from "../helpers";
import { Tower, Coordinates, WorldState, TileType } from "./types";
import { setTile } from "./tiles";

export const dropTower = ( state : WorldState, coords : Coordinates ) : WorldState=>{
  return assignNew(
    state,
    {
      tiles  : setTile( state.tiles, coords, TileType.TOWER ),
      towers : state.towers.concat( makeNewTower( coords ) )
    }
  );
};

export const makeNewTower = ( coords : Coordinates ) : Tower=>{
  return {
    coords,
    ammo : 0
  };
};

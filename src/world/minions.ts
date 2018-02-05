import { ScoreMap, Minion, WorldState } from "./types";
import { coordsToKey } from "./helpers";
import { assignNew } from "../helpers";
import { getValidNeighbourCoords, getScoreGrid } from "./path-finding";

const moveOneMinion = ( 
  width  : number,
  height : number,
  scoreGrid : ScoreMap, 
  minion : Minion 
)=>{
  const neighbours = getValidNeighbourCoords( width, height, minion.coords );
  let bestCoords = minion.coords;
  let bestScore = Infinity;
  neighbours.forEach( coords=>{
    const score = scoreGrid[ coordsToKey( coords ) ];
    if( score < bestScore ){
      bestScore = score;
      bestCoords = coords;
    }
  });
  return assignNew(
    minion,
    { coords : bestCoords }
  );
}

let minionID = 0;
const makeMinion = ()=>({
  id : minionID ++,
  coords : { x : 15, y : 15 },
  health : 100
});

export const moveMinions = ( state : WorldState ) : WorldState => {
  const scoreGrid = getScoreGrid( state );
  let minionsToSpawn = state.minionsToSpawn;
  const minions = state.minions
    .filter( m=>!(m.coords.x === 0 && m.coords.y === 0) )
    .map(
      minion=>moveOneMinion( 
        state.width, 
        state.height, 
        scoreGrid, 
        minion 
      )
    );
  if( minionsToSpawn > 0 ){
    minions.push( assignNew( makeMinion() ) );
    minionsToSpawn --;
  }
  return assignNew(
    state,
    { 
      minionsToSpawn,
      minions
    }
  );
};
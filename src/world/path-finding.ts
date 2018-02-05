import { TileType, TileMap, ScoreMap, Coordinates } from "./types";
import { coordsToKey, keyToCoords } from "./helpers";
import { assignNew } from "../helpers";

export const getValidNeighbourCoords = ( 
  width  : number,
  height : number,
  coords : Coordinates
) : Coordinates[] => {
  const { x, y } = coords;
  const neighbours : Coordinates[] = [];
  if( x > 0 ){
    neighbours.push( { x : x-1, y } );
  }
  if( y > 0 ){
    neighbours.push( { x, y : y-1 } );
  }
  if( x < width - 1 ){
    neighbours.push( { x : x+1, y } );
  }
  if( y < height - 1 ){
    neighbours.push( { x, y : y+1 } );
  }
  return neighbours;
}

export const setScore = ( 
  scores  : ScoreMap, 
  target : Coordinates,
  score  : number
) : ScoreMap => {
  const output : ScoreMap = {};
  return assignNew(
    scores,
    { [coordsToKey(target)] : score }
  );
}

export const getBaseGrid = ( 
  tiles : TileMap 
) : ScoreMap => {
  const output : ScoreMap = {};
  Object.keys(tiles).forEach( key=>{
    let score;
    const tile = tiles[ key ];
    const { x, y } = keyToCoords( key );
    if( tile === TileType.EMPTY ){
      if( x === 0 && y === 0 ){
        score = 0;
      }else{
        score = null;
      }
    }else{
      score = Infinity;
    }
    output[ key ] = score;
  });
  return output;
}

const getLowestNeighbour = ( 
  width  : number,
  height : number,
  scores : ScoreMap, 
  coords : Coordinates 
)=>{
  return getValidNeighbourCoords( width, height, coords )
    .map(coords=>scores[coordsToKey( coords )])
    .reduce((min, curr)=>{
      if( curr === null ){
        return min;
      }else{
        return Math.min( min, curr );
      }
    }, Infinity)
}

export const finishScoreGrid = ( 
  width  : number,
  height : number,
  scores : ScoreMap, 
  coordsSetLastTime : Coordinates[] = [{ x : 0, y : 0 }] 
)=>{
  const coordsSetThisTime = [];
  coordsSetLastTime.forEach((coords)=>{
    const neighbours = getValidNeighbourCoords( width, height, coords );
    neighbours.forEach((coords)=>{
      if( scores[coordsToKey( coords )] === null ){
        scores = setScore( 
          scores, 
          coords,
          1+getLowestNeighbour( width, height, scores, coords ) 
        );
        coordsSetThisTime.push( coords );
      }
    });
  });
  if( coordsSetThisTime.length === 0 ){
    return scores;
  }else{
    return finishScoreGrid( width, height, scores, coordsSetThisTime );
  }
}

export const getScoreGrid = ( state )=>{
  return finishScoreGrid( 
    state.width, 
    state.height, 
    getBaseGrid( state.tiles ) 
  );
}
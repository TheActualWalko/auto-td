import { createStore, combineReducers } from "redux";
import { WorldState, Direction } from "./world/types";
import worldReducer from "./world/reducer";
import { dropTower, directPlayer, useTargetTile, timeStep } from "./world/actions";
import { assignNew } from "./helpers";
import { getRandomCoords } from "./world/helpers";

export enum GamePhase { BEFORE_FIRST_ROUND, BUILD, DEFEND, LIMBO, GAME_OVER };
export interface GameState {
  round : number,
  phase : GamePhase,
  world : WorldState
}

const getMinionCountToSpawn = ( round : number )=>{
  return Math.floor( Math.pow( round+1, 1.7 ) );
}

const getNextPhase = ( phase : GamePhase )=>{
  if( phase === GamePhase.BEFORE_FIRST_ROUND ){
    return GamePhase.BUILD;
  }else if( phase === GamePhase.BUILD ){
    return GamePhase.DEFEND;
  }else if( phase === GamePhase.DEFEND ){
    return GamePhase.LIMBO;
  }else if( phase === GamePhase.LIMBO ){
    return GamePhase.BUILD;
  }else if( phase === GamePhase.GAME_OVER ){
    return GamePhase.BEFORE_FIRST_ROUND;
  }
}

const NEXT_PHASE = "NEXT_PHASE";
export const nextPhase = ()=>{
  return {
    type : NEXT_PHASE
  };
};

let defendInterval;

const MasterReducer = ( 
  state : GameState, 
  action 
) : any => {
  switch( action.type ){
    case NEXT_PHASE:
      const prevPhase = state.phase;
      const phase = getNextPhase( state.phase );
      let round = state.round;
      let world = state.world;
      if( prevPhase === GamePhase.DEFEND ){
        round ++;
      }
      if( phase === GamePhase.LIMBO ){
        world = assignNew( world, {
          minions     : [],
          projectiles : []
        });
      }
      if( phase === GamePhase.BUILD ){
        console.log("ay!");
        world = assignNew( 
          worldReducer( 
            state.world, 
            dropTower( getRandomCoords( state.world.width, state.world.height ) ) 
          )
        );
        world = assignNew(
          world,
          {
            stepIndex      : 0,
            minionsToSpawn : getMinionCountToSpawn( round ),
            towers : world.towers.map( t=>assignNew(t, { ammo : 40 }) )
          }
        );
      }
      if( phase === GamePhase.DEFEND ){
        defendInterval = setInterval(()=>{
          store.dispatch( timeStep() );
          const world = store.getState().world;
          if( world.minions.length === 0 && world.minionsToSpawn === 0 ){
            store.dispatch(nextPhase());
          }
        }, 100);
      }else{
        clearInterval( defendInterval );
      }
      return assignNew(
        state,
        { 
          world,
          round,
          phase
        }
      );
    default:
      return assignNew(
        state,
        { world : worldReducer( state.world, action ) }
      );
  }
};

const store = createStore(MasterReducer, {
  round : 0,
  phase : GamePhase.BEFORE_FIRST_ROUND,
  world : worldReducer(undefined, {})
});

store.dispatch( { type : "CLEAR" } );

try{

  window["$getState"] = ()=>{
    return store.getState();
  };

  window["$subscribe"] = ()=>{
    let count = 0;
    store.subscribe(()=>{
      console.log("state change #" + count ++, store.getState());
    });
  };

}catch(e){}

const directionMap = {
  119 : Direction.UP,
  115 : Direction.DOWN,
  97  : Direction.LEFT,
  100 : Direction.RIGHT,
  
  38  : Direction.UP,
  40  : Direction.DOWN,
  37  : Direction.LEFT,
  39  : Direction.RIGHT,
};

window.addEventListener("keydown", ( event )=>{
  if( store.getState().phase === GamePhase.BUILD ){
    const direction = directionMap[ event.which ];
    if( direction !== undefined ){
      store.dispatch( directPlayer( direction ) );
      event.preventDefault();
    }
    if( event.which === 32 ){
      store.dispatch( useTargetTile() );
      event.preventDefault();
    }
  }
});

export default store;

import { Projectile, WorldState, Coordinates, Velocity } from "./types";
import { getDistance } from "./helpers";
import { assignNew } from "../helpers";

const moveOneProjectile = ( projectile : Projectile )=>{
  return assignNew(
    projectile,
    {
      coords : {
        x : projectile.coords.x + projectile.velocity.x,
        y : projectile.coords.y + projectile.velocity.y
      }
    }
  );
};

const TARGET_RANGE = 6;
const PROJECTILE_SPEED = 0.8;
const PROJECTILE_DAMAGE = 10;

let projectileID = 0;
export const makeProjectile = ( coords : Coordinates, target : Coordinates )=>{
  const angleRadians = Math.atan2( target.y-coords.y, target.x-coords.x );
  const velocity = {
    x : Math.cos( angleRadians ) * PROJECTILE_SPEED,
    y : Math.sin( angleRadians ) * PROJECTILE_SPEED
  };
  return {
    id : projectileID ++,
    hasHitTarget : false,
    coords,
    velocity
  }
};

export const spawnProjectiles = ( state : WorldState ) : WorldState => {
  const nextProjectiles = state.projectiles.concat([]);
  const nextTowers = state.towers.map( t=>{
    if( t.ammo <= 0 ){
      return t;
    }
    let hasSpawnedProjectile = false
    state.minions.forEach( m=>{
      if( !hasSpawnedProjectile && getDistance( t.coords, m.coords ) < TARGET_RANGE ){
        nextProjectiles.push(makeProjectile( t.coords, m.coords ));
        hasSpawnedProjectile = true;
      }
    });
    if( hasSpawnedProjectile ){
      return assignNew( t, { ammo : t.ammo-1 });
    }else{
      return t;
    }
  });
  return assignNew(
    state,
    { 
      projectiles : nextProjectiles,
      towers      : nextTowers
    }
  );
}

const isInBlock = ( pointCoords, blockCoords )=>{
  return Math.round( pointCoords.x ) === blockCoords.x && Math.round( pointCoords.y ) === blockCoords.y;
}

export const moveProjectiles = ( state : WorldState ) : WorldState => {
  const projectilesStrikingTargets = [];
  const minionsToRemove = [];
  let nextProjectiles = state.projectiles
    .filter( p=>!p.hasHitTarget )
    .map( moveOneProjectile )
    .filter( projectile=>{
      return (
        projectile.coords.x >= 0 && projectile.coords.x < state.width
        &&
        projectile.coords.y >= 0 && projectile.coords.y < state.height
      );
    });
  const nextMinions = state.minions
    .map( m=>{
      const outputM = assignNew( m );
      nextProjectiles.forEach( (p, pIndex)=>{
        if( isInBlock( p.coords, m.coords ) ){
          outputM.health -= PROJECTILE_DAMAGE;
          projectilesStrikingTargets.push( p.id );
          if( outputM.health <= 0 ){
            minionsToRemove.push( m.id );
          }
        }
      });
      return outputM;
    })
    .filter( m=>minionsToRemove.indexOf( m.id ) < 0 );
  
  nextProjectiles = nextProjectiles
    .map( p=>{
      if( projectilesStrikingTargets.indexOf( p.id ) >= 0 ){
        return assignNew( p, { hasHitTarget : true } );
      }else{
        return p;
      }
    });
  return assignNew(
    state,
    { projectiles : nextProjectiles },
    { minions : nextMinions }
  );
};
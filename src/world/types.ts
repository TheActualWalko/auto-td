export enum TileType { GRASS, ROCK, EMPTY, TOWER }

export enum Direction { UP, DOWN, LEFT, RIGHT }

export interface Coordinates {
  x : number
  y : number
}

export interface Velocity {
  x : number
  y : number
}

export interface Player {
  coords    : Coordinates
  direction : Direction
}

export interface Tower {
  coords : Coordinates
  ammo   : number
}

export interface Projectile {
  id           : number
  coords       : Coordinates
  velocity     : Velocity
  hasHitTarget : boolean
}

export interface Minion {
  id     : number
  coords : Coordinates
  health : number
}

export type TileMap = {
  [ coordinates : string ] : TileType
}

export type ScoreMap = { 
  [ coords : string ] : number 
};

export interface WorldState {
  tiles          : TileMap,
  player         : Player,
  towers         : Tower[],
  minions        : Minion[],
  projectiles    : Projectile[],
  carrying       : boolean,
  width          : number,
  height         : number,
  minionsToSpawn : number,
  stepIndex      : number
}
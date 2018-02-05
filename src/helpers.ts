export const assign = ( ...objects ) : any=>{
  const writeInto = objects[0];
  objects.slice(1).forEach(o=>{
    Object.keys( o ).forEach( k=>{
      writeInto[ k ] = o[ k ];
    });
  });
  return writeInto;
}

export const assignNew = ( ...objects ) : any=>{
  return assign.apply(null, [{}].concat(objects));
}
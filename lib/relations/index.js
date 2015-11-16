import HasMany from './hasMany';
import BelongsToOne from './belongsToOne';

export function hasMany(targetModel, options){
    return new HasMany(targetModel, options)
}

export function belongsToOne(targetModel, options){
    return new BelongsToOne(targetModel, options)
}

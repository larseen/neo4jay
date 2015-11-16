import _ from 'lodash';

export default class hasMany {
    constructor(targetModel, options){

        this.relationshipType = 'HasMany';
        this.target = targetModel;
        this.options = options;
        this.singleRelationsship = false;
        this.name = options.name;
        this.schema = options.schema;

    }






}

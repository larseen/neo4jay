import _ from 'lodash';

export default class belongsToOne {
    constructor(targetModel, options){

        this.associationType = 'BelongsToOne';
        this.target = targetModel;
        this.options = options;
        this.singleRelationsship = true;
        this.name = options.name;
        this.schema = options.schema || null;

    }

}

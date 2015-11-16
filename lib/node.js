import _ from 'lodash';
/**
 * Node description
 * @param {object} obj    the actual node object
 * @param {object} fields optional object if any fields vas specified during the query
 * @param {boolean} skipId optinal boolean should we autogenerate id
 */

 export default class Node {
     constructor(model, node, fields, skipId){


         this.modelName = model.modelName;
         this.model = model;
         this.db = model.db;
         this.base = model.base;
         this.schema = model.schema;
         this.selected = fields;


         // Inherit the functions of the Model
         for ( var i in model){
             if (typeof model[i] === 'function') {
               this[i] = model[i];
             }
         }

         this._node = this.buildNode(node);

     }

     buildNode = function(node){


        return node;
    }

    save = function(){

        const safeProps = this.schema.validate(this._node);

        const Model = this.model;

        var query = [
            'CREATE (node:'+this.modelName+' {props})',
            'RETURN node',
        ].join('\n');

        var params = {
            props: safeProps
        };

        return this.db.cypher({ query: query, params: params })
            .then(response => {
                return new Node(Model, response[0]);
            })

    }



    toJSON() {
        return this._node;
    }

}

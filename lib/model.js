import _ from 'lodash';
import Node from './node';
import { NotFoundError, ValidationError } from './errors';

export default class Model {


    static findById = function(id, conditions, properties) {

        const Model = this;

        var query = [
            'MATCH (node:'+Model.modelName+')',
            'WHERE node.id = "'+id+'"',
            'RETURN node',
        ].join('\n')

        return this.db.cypher({ query: query })
            .then(response => {
                if(!response.length) return null;
                return new Node(Model, response[0]);
            })


    };

    static updateById = function(id, node, conditions, properties) {

        const Model = this;
        const safeProps = this.schema.validate(node);

        var query = [
            'MATCH (node:'+Model.modelName+')',
            'WHERE node.id = "'+id+'"',
            'SET node += {props}',
            'RETURN node',
        ].join('\n')

        var params = {
            props: safeProps
        };

        return this.db.cypher({ query: query, params: params })
            .then(response => {
                if(!response.length) return null;
                return new Node(Model, response[0]);
            })


    };

    static find = function(conditions, properties) {

        const Model = this;

        var query = [
            'MATCH (node:'+Model.modelName+')',
            'RETURN node',
        ].join('\n')

        return this.db.cypher({ query: query })
            .then(response => {
                console.log(response);
                return response.map(function (node) {
                    return new Node(Model, node);
                });
            })


    };

    static create = function(node) {

        var newNode = new Node(this, node);
        return newNode.save();

    };


    static compile(name, schema, db, base) {

        // generate new Node
        function model(node, fields, skipId) {
          return new Node(model, node, fields, skipId);
        }

        model.modelName = name;
        model.db = db;
        model.base = base;
        model.schema = schema;


        // Inherit the functions of Model
        for ( var i in Model){
            if (typeof Model[i] === 'function') {
              model[i] = Model[i];
            }
        }

        return model;

    }
}

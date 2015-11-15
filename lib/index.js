import Model from './model';
import Node from './node';
import Schema from './Schema';
import Relations from './relations';
import Bluebird from 'bluebird';
import config from '../config/'
import Neo4j from 'neo4j';
Bluebird.promisifyAll(Neo4j)
const db = new Neo4j.GraphDatabase(config.neo4j);

class Neo4Jay {
    constructor(){

        this.db = db;
        this.models = {};
        this.modelSchemas = {};
        this.Schema = Schema;
        this.Model = Model;
        this.Node = Node;
        this.Relations = Relations;

    }


    model(name, schema){
        // generate new Model
        function model(node, fields, skipId) {
          return new Node(model, node, fields, skipId);
        }

        model = Model.compile(name, schema, db, this);
        neo4jay.models[name] = model
        return model;
    }

}

var neo4jay = module.exports = exports = new Neo4Jay;

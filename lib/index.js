import Model from './model';
import Node from './node';
import Schema from './schema';
import Relations from './relations';
import Bluebird from 'bluebird';
import Cypher from './cypher';

class Neo4Jay {
    constructor(){


        this.models = {};
        this.modelSchemas = {};
        this.Schema = Schema;
        this.Model = Model;
        this.Node = Node;
        this.Relations = Relations;
        this.Cypher = new Cypher({
            url: 'http://localhost:7474',
            auth: {
                username: 'neo4j',
                password: 'password'
            }
        });

    }




    model(name, schema){
        
        // generate new Model
        function model(node, fields, skipId) {
          return new Node(model, node, fields, skipId);
        }

        model = Model.compile(name, schema, neo4jay.Cypher, neo4jay);
        neo4jay.models[name] = model
        return model;
    }

}

var neo4jay = module.exports = exports = new Neo4Jay();

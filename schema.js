import _ from 'lodash';
import shortid from 'shortid';
/**
*
* Define the structure of your data
* Schema specific methods
* Indexes / Constrains
* Hooks
* Validation
*
*/

export default class Schema {
    constructor(object, options){

        this.options = this.setOptions(options);
        this.paths = this.setPaths(object);
        this.methods = {};
        this.relationships = {};

    }

    setPaths = function(object){

        var paths = {};

        _.mapKeys(object, function(value, key) {
            paths[key] = value;
        });

        if(this.options.id){
            paths.id = {
                unique: true,
                index: true,
                required: true,
                constraint: true,
                default: shortid.generate()
            }
        }

        return paths;

    }

    setOptions = function(options){

        options = {
            strict: true,
            autoIndex: null,
            validateBeforeSave: true,
            id: true
        };

      return options;

    }

    validate = function(node){

        var _node = {};

        _.mapKeys(this.paths, function(value, key) {

            if(node[key]){
                _node[key] = node[key]
            } else {
                if(value.required && !value.default) throw new error('missing property: '+key)
                else _node[key] = value.default;
            }

        });

        return _node;

    }

    /**
    * Adds an instance method to documents constructed from Models compiled from this schema.
    *
    * @param {String|Object} method name
    * @param {Function} [fn]
    *
    */
    method = function(name, fn){
        if ('string' != typeof name){
            for (var i in name){
                this.methods[i] = name[i];
            }
        } else {
            this.methods[name] = fn;
        }
    }

    /**
    * Adds an instance method to documents constructed from Models compiled from this schema.
    *
    * @param {String|Object} method name
    * @param {Function} [fn]
    *
    */
    relation = function(name, fn){
        if ('string' != typeof name){
            for (var i in name){
                this.relationships[i] = name[i];
            }
        } else {
            this.relationships[name] = fn;
        }
    }





}

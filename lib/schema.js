import _ from 'lodash';
import shortid from 'shortid';
/**
* define the structure of your data,
* schema specific methods,
* indexes / constrains,
* hooks,
* validation,
* relationships,
*
*/
export default class Schema {
    /**
     *
     * Used to initialize a new schema.
     *
     * @example
     * import Neo4Jay from 'neo4jay';
     *
     * const Schema = Neo4Jay.Schema;
     *
     * const ingredientSchema = new Schema({
     * 	name: {
     * 		required: true,
     * 		type: String
     * 	},
     * 	description: {
     * 		type: String
     * 	}
     * })
     *
     */
    constructor(object, options){

        this._options = this._setOptions(options);
        this._paths = this._setPaths(object);
        this.methods = {};
        this.relationships = {};

    }

    /**
     * @access private
     */
    _setPaths(object){

        var paths = {};

        _.mapKeys(object, function(value, key) {
            paths[key] = value;
        });

        if(this._options.id){
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

    /**
     * @access private
     */
    _setOptions(options){

        options = {
            strict: true,
            autoIndex: null,
            validateBeforeSave: true,
            id: true
        };

      return options;

    }

    /**
     * Function to use for validating a node
     * @param  {object} node - The node that will be evaluated
     * @return {object} node - The evaluated node with added or removed properties.
     * @throws {ValidationError} error - Thrown if an node violates the constraints given by the schema.
     *
     */
    validate(node){

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
     *
     * Adds an instance relationship to documents constructed from Models compiled from this schema.
     *
     * @access public
     * @param {string|object} name - name for the specified relationsship, or an object of muliple relationsships.
     * @param {function} fn - relationsship to be added to the schema.
     * @example
     * ingredientSchema.relation({
     * 	'HAS_NUTRIENTS': Relations.hasMany('Nutrient'),
     * 	'HAS_INGREDIENT': Relations.belongsTo('IngredientType'),
     * 	'CONTAINS_INGREDIENT': Relations.belongsToMany('Recipe'),
     * })
     *
     */
    relation(name, fn){
        if ('string' != typeof name){
            for (var i in name){
                this.relationships[i] = name[i];
            }
        } else {
            this.relationships[name] = fn;
        }
    }





}

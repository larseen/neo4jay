import _ from 'lodash';
import Bluebird from 'bluebird';
import Request from 'request-promise';
import URL from 'url';

export default class Cypher {
    constructor(options){
        var uri, _ref;

        if (options == null) {
            options = {};
        }

        if (_.isString(options)) {
            options = {
                url: options
            };
        }

        this.url = options.url;
        this.auth = options.auth;
        this.headers = options.headers || 'Neo4Jay';

        if (!this.url) {
            throw new TypeError('URL to Neo4j required');
        }

        uri = URL.parse(this.url);
        if (uri.auth && (this.auth != null)) {
            delete uri.auth;
            this.url = URL.format(uri);
        }

        this.auth = this._normalizeAuth((_ref = this.auth) != null ? _ref : uri.auth);

    }

    http(options){

        if (options == null) {
            options = {};
        }
        if (_.isString(options)) {
            options = {
                path: options
            };
        }

        var method = options.method;
        var path = options.path;
        var headers = options.headers;
        var body = options.body;
        var raw = options.raw;

        if (!path) {
            throw new TypeError('Path required');
        }
        method || (method = 'GET');
        headers || (headers = {});
        headers = this.headers + 'X-Stream: true';

        return Request({
            method: method,
            url: URL.resolve(this.url, path),
            proxy: this.proxy,
            auth: this.auth,
            headers: headers,
            agent: this.agent,
            json: body != null ? body : true,
            encoding: 'utf8',
            gzip: true
        })
    }

    cypher(options){
        var queries, format, headers, opts;
        if (options == null) {
            options = {};
        }
        if (_.isString(options)) {
            options = {
                query: options
            };
        }

        if (!options.query) {
          throw new TypeError('Query required');
        }

        const method = 'POST';
        const path = '/db/data/transaction';

        if (options.query) {
            queries = [{
                query: options.query,
                params: options.params,
                lean: options.lean
            }];
        }
        var single = true;
        var formats = [];
        var body = {
          statements: (function() {
              var _i, _len, _ref, _results;
              _results = [];
              for (_i = 0, _len = queries.length; _i < _len; _i++) {
                  var query = queries[_i];
                    if (_.isString(query)) {
                        query = {
                            query: query
                        };
                    }
                const _ref = query;
                query = _ref.query;
                const params = _ref.params;
                const lean = _ref.lean;
                formats.push(format = lean ? 'row' : 'row');
                _results.push({
                    statement: query,
                    parameters: params || {},
                    resultDataContents: [format]
                });
            }
            return _results;
          })()
        };
        return this.http({
          method: method,
          path: path,
          headers: headers,
          body: body,
          raw: true
        })
        .then(response => {

            var _results = [];
            _.forEach(response.results, function(result){
                const columns = result.columns

                _.forEach(result.data, function(data, index){
                    data = data.row;
                    var inserted = false;
                    var node;

                    _.each(_results, function(node, index) {
                       if(_.isEqual(node.id, data[0].id)){
                           inserted = true;
                           for (var i = 1; i < data.length-1; i++) {
                               if(!_results[index][columns[i]]){
                                   _results[index][columns[i]] = [];
                               }
                               _results[index][columns[i]].push({
                                   ...data[i],
                                   ...data[i+1]
                               });
                           }
                       }
                    })

                    if(!inserted){
                        node = data[0]
                        for (var i = 1; i < data.length-1; i++) {
                            if(!data[i+1]){
                                break;
                            }
                           node[columns[i]] = [];
                           node[columns[i]].push({
                               ...data[i],
                               ...data[i+1]
                           });
                        }
                        _results.push(node)
                    }

                })
            })
            return _results;
        })

    }

    _normalizeAuth = function(auth) {
        var password, passwordParts, username, _ref;
        if (!auth) {
            return null;
        }
        if (typeof auth === 'string') {
            _ref = auth.split(':'), username = _ref[0], passwordParts = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
            password = passwordParts.join(':');
            auth = {
                username: username,
                password: password
            };
        }
        if ((Object.keys(auth)).length === 0) {
            return null;
        }
        return auth;
    };

}

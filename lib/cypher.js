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
                formats.push(format = lean ? 'row' : 'rest');
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
            console.log(response.results[0]);
            console.log(response.results[0].data[0].rest[0].data);
            var _i, _len, _results, result, columns, data;
            _results = [];
            for (var i = _i = 0, _len = response.results.length; _i < _len; i = ++_i) {
                result = response.results[i];
                columns = result.columns, data = result.data;
                format = formats[i];
                _results.push(_.data.pluck(format).map(function(row) {
                    var column, j, _j, _len1;
                    result = {};
                    for (j = _j = 0, _len1 = columns.length; _j < _len1; j = ++_j) {
                        column = columns[j];
                        result[column] = row[j];
                    }
                return result;
                }));
            }
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

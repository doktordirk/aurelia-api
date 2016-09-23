'use strict';

System.register(['extend', 'aurelia-path', 'aurelia-fetch-client', 'aurelia-dependency-injection'], function (_export, _context) {
  "use strict";

  var extend, buildQueryString, join, HttpClient, RequestInit, Container, resolver, _dec, _class4, _typeof, Rest, DefaultRest, Config, Endpoint;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  function getRequestPath(resource, idOrCriteria, criteria) {
    var hasSlash = resource.slice(-1) === '/';

    if (typeof idOrCriteria === 'string' || typeof idOrCriteria === 'number') {
      resource = '' + join(resource, String(idOrCriteria)) + (hasSlash ? '/' : '');
    } else {
      criteria = idOrCriteria;
    }

    if ((typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) === 'object' && criteria !== null) {
      resource += '?' + buildQueryString(criteria);
    } else if (criteria) {
      resource += '' + (hasSlash ? '' : '/') + criteria + (hasSlash ? '/' : '');
    }

    return resource;
  }

  function configure(frameworkConfig, configOrConfigure) {
    var config = frameworkConfig.container.get(Config);

    if (typeof configOrConfigure === 'function') {
      return configOrConfigure(config);
    }

    config.configure(configOrConfigure);
  }

  _export('configure', configure);

  return {
    setters: [function (_extend) {
      extend = _extend.default;
    }, function (_aureliaPath) {
      buildQueryString = _aureliaPath.buildQueryString;
      join = _aureliaPath.join;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      RequestInit = _aureliaFetchClient.RequestInit;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      resolver = _aureliaDependencyInjection.resolver;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('Rest', Rest = function () {
        function Rest(client, endpoint) {
          

          this.client = client;
          this.endpoint = endpoint;
        }

        Rest.prototype.request = function request(method, path, body, options) {
          throw new Error('must implement');
        };

        Rest.prototype.find = function find(resource, criteria, options) {
          return this.request('GET', getRequestPath(resource, criteria), undefined, options);
        };

        Rest.prototype.findOne = function findOne(resource, id, criteria, options) {
          return this.request('GET', getRequestPath(resource, id, criteria), undefined, options);
        };

        Rest.prototype.post = function post(resource, body, options) {
          return this.request('POST', resource, body, options);
        };

        Rest.prototype.update = function update(resource, criteria, body, options) {
          return this.request('PUT', getRequestPath(resource, criteria), body, options);
        };

        Rest.prototype.updateOne = function updateOne(resource, id, criteria, body, options) {
          return this.request('PUT', getRequestPath(resource, id, criteria), body, options);
        };

        Rest.prototype.patch = function patch(resource, criteria, body, options) {
          return this.request('PATCH', getRequestPath(resource, criteria), body, options);
        };

        Rest.prototype.patchOne = function patchOne(resource, id, criteria, body, options) {
          return this.request('PATCH', getRequestPath(resource, id, criteria), body, options);
        };

        Rest.prototype.destroy = function destroy(resource, criteria, options) {
          return this.request('DELETE', getRequestPath(resource, criteria), undefined, options);
        };

        Rest.prototype.destroyOne = function destroyOne(resource, id, criteria, options) {
          return this.request('DELETE', getRequestPath(resource, id, criteria), undefined, options);
        };

        Rest.prototype.create = function create(resource, body, options) {
          return this.post(resource, body, options);
        };

        return Rest;
      }());

      _export('Rest', Rest);

      _export('DefaultRest', DefaultRest = function (_Rest) {
        _inherits(DefaultRest, _Rest);

        function DefaultRest(httpClient, endpoint) {
          

          var _this = _possibleConstructorReturn(this, _Rest.call(this, httpClient, endpoint));

          _this.defaults = {
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            })
          };
          return _this;
        }

        DefaultRest.prototype.request = function request(method, path, body, options) {
          var requestOptions = extend(true, { headers: {} }, this.defaults, options || {}, { method: method, body: body });

          var contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

          if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && body !== null && contentType) {
            requestOptions.body = contentType.toLowerCase() === 'application/json' ? JSON.stringify(body) : buildQueryString(body);
          }

          return this.client.fetch(path, requestOptions).then(function (response) {
            if (response.status >= 200 && response.status < 400) {
              return response.json().catch(function () {
                return null;
              });
            }

            throw response;
          });
        };

        return DefaultRest;
      }(Rest));

      _export('DefaultRest', DefaultRest);

      _export('Config', Config = function () {
        function Config() {
          

          this.RestType = DefaultRest;
          this.endpoints = {};
        }

        Config.prototype.registerEndpoint = function registerEndpoint(name, configureMethod, defaults) {
          var _this2 = this;

          var newClient = new HttpClient();
          this.endpoints[name] = new this.RestType(newClient, name);

          if (defaults !== undefined) {
            this.endpoints[name].defaults = defaults;
          }

          if (typeof configureMethod === 'function') {
            newClient.configure(configureMethod);

            return this;
          }

          if (typeof configureMethod !== 'string' && !this.defaultBaseUrl) {
            return this;
          }

          if (this.defaultBaseUrl && typeof configureMethod !== 'string' && typeof configureMethod !== 'function') {
            newClient.configure(function (configure) {
              configure.withBaseUrl(_this2.defaultBaseUrl);
            });

            return this;
          }

          newClient.configure(function (configure) {
            configure.withBaseUrl(String(configureMethod));
          });

          return this;
        };

        Config.prototype.getEndpoint = function getEndpoint(name) {
          if (!name) {
            return this.defaultEndpoint || null;
          }

          return this.endpoints[name] || null;
        };

        Config.prototype.endpointExists = function endpointExists(name) {
          return !!this.endpoints[name];
        };

        Config.prototype.setDefaultEndpoint = function setDefaultEndpoint(name) {
          this.defaultEndpoint = this.getEndpoint(name);

          return this;
        };

        Config.prototype.setDefaultBaseUrl = function setDefaultBaseUrl(baseUrl) {
          this.defaultBaseUrl = baseUrl;

          return this;
        };

        Config.prototype.configure = function configure(config) {
          var _this3 = this;

          if (config.defaultBaseUrl) {
            this.defaultBaseUrl = config.defaultBaseUrl;
          }

          config.endpoints.forEach(function (endpoint) {
            _this3.registerEndpoint(endpoint.name, endpoint.endpoint, endpoint.config);

            if (endpoint.default) {
              _this3.setDefaultEndpoint(endpoint.name);
            }
          });

          if (config.defaultEndpoint) {
            this.setDefaultEndpoint(config.defaultEndpoint);
          }

          return this;
        };

        return Config;
      }());

      _export('Config', Config);

      _export('Endpoint', Endpoint = (_dec = resolver(), _dec(_class4 = function () {
        function Endpoint(key) {
          

          this._key = key;
        }

        Endpoint.prototype.get = function get(container) {
          return container.get(Config).getEndpoint(this._key);
        };

        Endpoint.of = function of(key) {
          return new Endpoint(key);
        };

        return Endpoint;
      }()) || _class4));

      _export('Endpoint', Endpoint);
    }
  };
});
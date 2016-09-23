import {buildQueryString, join} from 'aurelia-path';
import {HttpClient, RequestInit} from 'aurelia-fetch-client';
import * as extend from 'extend';

/**
 * Rest class. A simple rest client to fetch resources
 */
export class Rest {

  /**
   * The defaults to apply to any request
   *
   * @param {RequestInit} defaults The default fetch client RequestInit
   */
  defaults: RequestInit = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  };

  /**
   * The client for the rest adapter
   *
   * @param {HttpClient} client The fetch client
   *
   */
  client: HttpClient;

  /**
   * The name of the endpoint it was registered under
   *
   * @param {string} endpoint The endpoint name
   */
  endpoint: string;

  /**
   * Inject the httpClient to use for requests.
   *
   * @param {HttpClient} httpClient The httpClient to use
   * @param {string}     [endpoint] The endpoint name
   */
  constructor(httpClient: HttpClient, endpoint: string) {
    this.client   = httpClient;
    this.endpoint = endpoint;
  }

  /**
   * Make a request to the server.
   *
   * @param {string}          method     The fetch method
   * @param {string}          path       Path to the resource
   * @param {{}}              [body]     The body to send if applicable
   * @param {RequestInit}     [options]  Fetch RequestInit overwrites
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  request(method: string, path: string, body?: {}, options?: RequestInit): Promise<any|Error> {
    let requestOptions = extend(true, {headers: {}}, this.defaults, options || {}, {method, body});

    let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

    if (typeof body === 'object' && body !== null && contentType) {
      requestOptions.body = contentType.toLowerCase() === 'application/json'
                          ? JSON.stringify(body)
                          : buildQueryString(body);
    }

    return this.client.fetch(path, requestOptions).then(response => {
      if (response.status >= 200 && response.status < 400) {
        return response.json().catch(() => null);
      }

      throw response;
    });
  }

  /**
   * Find a resource.
   *
   * @param {string}                    resource  Resource to find in
   * @param {{}|string|Number}          criteria  Object for where clause, string / number for id.
   * @param {RequestInit}               [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  find(resource: string, criteria?: {}|string|Number, options?: RequestInit): Promise<any|Error> {
    return this.request('GET', getRequestPath(resource, criteria), undefined, options);
  }

  /**
   * Find a resource.
   *
   * @param {string}           resource  Resource to find in
   * @param {string|Number}    id        String / number for id to be added to the path.
   * @param {{}}               criteria  Object for where clause
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  findOne(resource: string, id: string|Number, criteria?: {}, options?: RequestInit): Promise<any|Error> {
    return this.request('GET', getRequestPath(resource, id, criteria), undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string}           resource  Resource to create
   * @param {{}}               body      The data to post (as Object)
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  post(resource: string, body?: {}, options?: {}): Promise<any|Error> {
    return this.request('POST', resource, body, options);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      New data for provided criteria.
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  update(resource: string, criteria?: {}|string|Number, body?: {}, options?: RequestInit): Promise<any|Error> {
    return this.request('PUT', getRequestPath(resource, criteria), body, options);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {string|Number}    id        String / number for id to be added to the path.
   * @param {{}}               criteria  Object for where clause
   * @param {object}           body      New data for provided criteria.
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  updateOne(resource: string, id: string|number, criteria?: {}, body?: {}, options?: RequestInit): Promise<any|Error> {
    return this.request('PUT', getRequestPath(resource, id, criteria), body, options);
  }

  /**
   * Patch a resource.
   *
   * @param {string}           resource  Resource to patch
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      Data to patch for provided criteria.
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  patch(resource: string, criteria?: {}|string|Number, body?: {}, options?: RequestInit): Promise<any|Error> {
    return this.request('PATCH', getRequestPath(resource, criteria), body, options);
  }

  /**
   * Patch a resource.
   *
   * @param {string}           resource  Resource to patch
   * @param {string|Number}    id        String / number for id to be added to the path.
   * @param {{}}               criteria  Object for where clause
   * @param {object}           body      Data to patch for provided criteria.
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  patchOne(resource: string, id: string|Number, criteria?: {}, body?: {}, options?: {}): Promise<any|Error> {
    return this.request('PATCH', getRequestPath(resource, id, criteria), body, options);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource  The resource to delete
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  destroy(resource: string, criteria?: {}|string|Number, options?: RequestInit): Promise<any|Error> {
    return this.request('DELETE', getRequestPath(resource, criteria), undefined, options);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource  The resource to delete
   * @param {string|Number}    id        String / number for id to be added to the path.
   * @param {{}}               criteria  Object for where clause
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  destroyOne(resource: string, id: string|Number, criteria?: {}, options?: RequestInit): Promise<any|Error> {
    return this.request('DELETE', getRequestPath(resource, id, criteria), undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string}           resource  The resource to create
   * @param {{}}               body      The data to post (as Object)
   * @param {RequestInit}      [options] Extra fetch RequestInit options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  create(resource: string, body?: {}, options?: RequestInit): Promise<any|Error> {
    return this.post(resource, body, options);
  }
}

function getRequestPath(resource: string, idOrCriteria?: string|Number|{}, criteria?: {}) {
  let hasSlash = resource.slice(-1) === '/';

  if (typeof idOrCriteria === 'string' || typeof idOrCriteria === 'number') {
    resource = `${join(resource, String(idOrCriteria))}${hasSlash ? '/' : ''}`;
  } else {
    criteria = idOrCriteria;
  }

  if (typeof criteria === 'object' && criteria !== null) {
    resource += `?${buildQueryString(criteria)}`;
  } else if (criteria) {
    resource += `${hasSlash ? '' : '/'}${criteria}${hasSlash ? '/' : ''}`;
  }

  return resource;
}
import {buildQueryString, join} from 'aurelia-path';

/**
 * Rest class. A simple rest client to fetch resources
 */
export abstract class Rest {

  /**
   * The defaults to apply to any request
   *
   * @param {any} defaults The default client setting
   */
  defaults: any;

  /**
   * The client for the rest adapter
   *
   * @param {any} client The client
   *
   */
  client: any;

  /**
   * The name of the endpoint it was registered under
   *
   * @param {string} endpoint The endpoint name
   */
  endpoint: string;

  /**
   * Create a new instance
   *
   * @param {client} client     The client to use
   * @param {string} [endpoint] The endpoint name
   */
  constructor(client: any, endpoint: string) {
    this.client   = client;
    this.endpoint = endpoint;
  }

  /**
   * Make a request to the server.
   *
   * @param {string}          method     The request method
   * @param {string}          path       Path to the resource
   * @param {{}}              [body]     The body to send if applicable
   * @param {{}}              [options]  Request options overwrites
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  abstract request(method: string, path: string, body?: any, options?: any): Promise<{}|Error>;

  /**
   * Find a resource.
   *
   * @param {string}                    resource  Resource to find in
   * @param {{}|string|Number}          criteria  Object for where clause, string / number for id.
   * @param {{}}                        [options] Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  find(resource: string, criteria?: {}|string|Number, options?: any): Promise<{}|Error> {
    return this.request('GET', getRequestPath(resource, criteria), undefined, options);
  }

  /**
   * Find a resource.
   *
   * @param {string}           resource    Resource to find in
   * @param {string|Number}    id          String / number for id to be added to the path.
   * @param {{}}               [criteria]  Object for where clause
   * @param {{}}               [options]   Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  findOne(resource: string, id: string|Number, criteria?: {}, options?: any): Promise<{}|Error> {
    return this.request('GET', getRequestPath(resource, id, criteria), undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string}           resource  Resource to create
   * @param {{}}               [body]    The data to post (as Object)
   * @param {{}}               [options] Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  post(resource: string, body?: any, options?: any): Promise<{}|Error> {
    return this.request('POST', resource, body, options);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [body]    New data for provided criteria.
   * @param {{}}               [options] Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  update(resource: string, criteria?: {}|string|Number, body?: any, options?: any): Promise<{}|Error> {
    return this.request('PUT', getRequestPath(resource, criteria), body, options);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource   Resource to update
   * @param {string|Number}    id         String / number for id to be added to the path.
   * @param {{}}               [criteria] Object for where clause
   * @param {{}}               [body]     New data for provided criteria.
   * @param {{}}               [options]  Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  updateOne(resource: string, id: string|number, criteria?: {}, body?: any, options?: any): Promise<{}|Error> {
    return this.request('PUT', getRequestPath(resource, id, criteria), body, options);
  }

  /**
   * Patch a resource.
  *
   * @param {string}           resource   Resource to patch
   * @param {{}|string|Number} [criteria] Object for where clause, string / number for id.
   * @param {{}}               [body]     Data to patch for provided criteria.
   * @param {{}}               [options]  Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  patch(resource: string, criteria?: {}|string|Number, body?: any, options?: any): Promise<{}|Error> {
    return this.request('PATCH', getRequestPath(resource, criteria), body, options);
  }

  /**
   * Patch a resource.
   *
   * @param {string}           resource   Resource to patch
   * @param {string|Number}    id         String / number for id to be added to the path.
   * @param {{}}               [criteria] Object for where clause
   * @param {{}}               [body]     Data to patch for provided criteria.
   * @param {{}}               [options]  Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  patchOne(resource: string, id: string|Number, criteria?: {}, body?: any, options?: any): Promise<{}|Error> {
    return this.request('PATCH', getRequestPath(resource, id, criteria), body, options);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource   The resource to delete
   * @param {{}|string|Number} [criteria] Object for where clause, string / number for id.
   * @param {{}}               [options]  Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  destroy(resource: string, criteria?: {}|string|Number, options?: any): Promise<{}|Error> {
    return this.request('DELETE', getRequestPath(resource, criteria), undefined, options);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource   The resource to delete
   * @param {string|Number}    id         String / number for id to be added to the path.
   * @param {{}}               [criteria] Object for where clause
   * @param {{}}               [options]  Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  destroyOne(resource: string, id: string|Number, criteria?: {}, options?: any): Promise<{}|Error> {
    return this.request('DELETE', getRequestPath(resource, id, criteria), undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string}           resource  The resource to create
   * @param {{}}               [body]    The data to post (as Object)
   * @param {{}}               [options] Extra request options.
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  create(resource: string, body?: any, options?: any): Promise<{}|Error> {
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

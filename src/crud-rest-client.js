import {CrudStorage} from './crud-storage';
import {Rest} from './rest';

/**
 * Rest class. A simple rest client to fetch resources
 */
export class CrudRestStorage extends CrudStorage {

  /**
   * Inject the httpClient to use for requests.
   *
   * @param {Rest}   rest       The Rest client to use
   * @param {string} [endpoint] The endpoint name
   */
  constructor(rest, endpoint) {
    this.rest     = rest;
    this.endpoint = endpoint;
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string} resource  The resource to create
   * @param {{}}     body      The data to post (as Object)
   * @param {{}}     [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  create(resource, body, options) {
    return this.rest.create(..arguments);
  }

  /**
   * Read a resource.
   *
   * @param {string}           resource  Resource to find in
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  read(resource, criteria, options) {
    return this.rest.find(..arguments);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      New data for provided criteria.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  update(resource, criteria, body, options) {
    return this.rest.update(..arguments);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource  The resource to delete
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  delete(resource, criteria, options) {
    return this.rest.destroy(..arguments);
  }

  /**
   * Count instances of a resource.
   * Makes a rest.find(`${resource}/count`, criteria, options) reuqest
   * Overwrite it, if this doesn't
   *
   * @param {string} resource  Resource to count.
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}     [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  count(resource, criteria, options) {
    return this.rest.find(`${resource}/count`, criteria, options);
  }
}

/**
 * CrudStorage basis class. Interface for clients which implement crud methods
 */
export class CrudStorage {
  /**
   * Create a new instance for resource.
   *
   * @param {string} resource  The resource to create
   * @param {{}}     body      The data to post (as Object)
   * @param {{}}     [options] Extra client options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  create(resource, body, options) {
    throw new Error('CrudStorages must implement create(resource, body, options).');
  }

  /**
   * Read a resource.
   *
   * @param {string}           resource  Resource to find in
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra client options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  read(resource, criteria, options) {
    throw new Error('CrudStorages must implement read(resource, criteria, options).');
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      New data for provided criteria.
   * @param {{}}               [options] Extra client options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  update(resource, criteria, body, options) {
    throw new Error('CrudStorages must implement update(resource, criteria, body, options).');
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource  The resource to delete
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra client options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  delete(resource, criteria, options) {
    throw new Error('CrudStorages must implement delete(resource, criteria, options).');
  }

  /**
   * Count instances of a resource.
   *
   * @param {string} resource  Resource to create
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}     [options] Extra client options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  count(resource, criteria, options) {
    throw new Error('CrudStorages must implement count(resource, criteria, options).');
  }


  /* BC methods */

  /**
   * Destroy a resource. Maps to delete
   */
  destroy = this.delete;

  /**
   * Find a resource. Maps to read
   */
  find = this.read;

  /**
   * Post a resource. Maps to create
   */
  post = this.create;
}

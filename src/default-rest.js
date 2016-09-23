import {buildQueryString} from 'aurelia-path';
import {HttpClient, RequestInit} from 'aurelia-fetch-client';
import extend from 'extend';
import {Rest} from './rest';

/**
 * Rest class. A simple rest client to fetch resources
 */
export class DefaultRest extends Rest {

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
   * Inject the httpClient to use for requests.
   *
   * @param {HttpClient} httpClient The httpClient to use
   * @param {string}     endpoint   The endpoint name
   */
  constructor(httpClient: HttpClient, endpoint: string) {
    super(httpClient, endpoint);
  }

  /**
   * Make a request to the server.
   *
   * @param {string}          method     The fetch method
   * @param {string}          path       Path to the resource
   * @param {Body}            [body]     The body to send if applicable
   * @param {RequestInit}     [options]  Fetch RequestInit overwrites
   *
   * @return {Promise<any>|Promise<Error>} Server response as Object
   */
  request(method: string, path: string, body?: Body, options?: RequestInit): Promise<any|Error> {
    let requestOptions = extend(true, {headers: {}}, this.defaults, options || {}, {method, body});

    let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

    if (typeof body === 'object' && body !== null && contentType) {
      requestOptions.body = contentType.toLowerCase() === 'application/json'
                          ? JSON.stringify(body)
                          : buildQueryString(body);
    }

    return this.client.fetch(path, requestOptions).then((response: Response) => {
      if (response.status >= 200 && response.status < 400) {
        return response.json().catch(() => null);
      }

      throw response;
    });
  }
}

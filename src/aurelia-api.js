import {ApiConfig} from './api-config';

export function configure(aurelia, configCallback) {
  let config = aurelia.container.get(ApiConfig);

  configCallback(config);
}

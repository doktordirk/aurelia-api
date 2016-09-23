import {Container} from 'aurelia-dependency-injection';
import {Config} from './config';

export function configure(
  frameworkConfig: { container: Container, globalResources: (...resources: string[]) => any },
  configOrConfigure: {defaultEndpoint: string, defaultBaseUrl: string, endpoints: Array<{name: string, endpoint: string, config: RequestInit, default: boolean}>} | ((config: Config) => void)
) {
  let config = frameworkConfig.container.get(Config);

  if (typeof configOrConfigure === 'function') {
    return configOrConfigure(config);
  }

  config.configure(configOrConfigure);
}

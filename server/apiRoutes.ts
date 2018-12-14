/* eslint-disable global-require */
import routes from './decorators/routes';
import { resolve } from 'path';
import { sync } from 'glob';
import { Express } from 'express-serve-static-core';

export default (route: Express) => {
  routes.bootstrap(route);
  sync('server/controllers/**/*.ts')
    .forEach((filename) => {
      require(resolve(process.cwd(), filename));
    })
};

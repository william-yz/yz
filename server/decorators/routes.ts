import { Express } from 'express-serve-static-core';
import { RequestHandler, Response, Request, NextFunction } from 'express';

const dummy = (path: String) => {
  return (a: unknown, b: string, descriptor: PropertyDescriptor) => {
    throw new Error('Have not init yet.');
  }
}

export default {
  POST: dummy,
  GET: dummy,
  PUT: dummy,
  DELETE: dummy,
  ResponseBody: (target: {}, name: string, descriptor: TypedPropertyDescriptor<Function>) => {
    const method = descriptor.value;
    descriptor.value = async function () {
      const res: Response = arguments[1];
      try {
        const result = await method.apply(this, arguments);
        res.json({
          error: 0,
          result,
        });
      } catch (e) {
        res.json({
          error: 1,
          errMsg: e
        });
      }
    }
  },
  bootstrap(routes: Express) {
    this.POST = (path: string) => (target: {}, name: string, descriptor: PropertyDescriptor) => {
      routes.post(path, descriptor.value);
    };
    this.GET = (path: string) => (target: {}, name: string, descriptor: PropertyDescriptor) => {
      routes.get(path, descriptor.value);
    };
    this.PUT = (path: string) => (target: {}, name: string, descriptor: PropertyDescriptor) => {
      routes.put(path, descriptor.value);
    };
    this.DELETE = (path: string) => (target: {}, name: string, descriptor: PropertyDescriptor) => {
      routes.delete(path, descriptor.value);
    };
  },
};

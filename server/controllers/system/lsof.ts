import Router from '../../decorators/routes';
import { Request } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

export default class {

  @Router.GET('/api/system/lsof/list/:port')
  @Router.ResponseBody
  public static async list(req: Request) {
    const { params } = req;
    if (params.port) {
      const result = await promisify(exec)(`lsof -i:${params.port}`);
      if (result.stderr) {
        return result.stderr;
      }
      const table = result.stdout.split('\n');
      return table.filter(f => f).map(t => t.split(/\s+/));
    }
  }

  @Router.DELETE('/api/system/lsof/kill/:pid')
  @Router.ResponseBody
  public static async kill(req: Request) {
    const { params } = req;
    if (params.pid) {
      const result = await promisify(exec)(`kill ${params.pid}`);
      if (result.stderr) {
        return result.stderr;
      }
      return params.pid;
    }
  }
}

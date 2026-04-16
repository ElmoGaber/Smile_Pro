declare module "pg" {
  const pg: any;

  export default pg;

  export class Pool {
    constructor(config?: any);
  }
}
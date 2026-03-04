declare module 'express-http-context' {
  import { RequestHandler } from 'express';

  const httpContext: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
    middleware: RequestHandler;
  };

  export = httpContext;
}

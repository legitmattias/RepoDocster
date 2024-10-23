import { Request } from 'express'
import Config from '../config/BackendConfig'

export function getRequestWithConfig(req: Request): Request & { config: Config } {
  return req as Request & { config: Config }
}

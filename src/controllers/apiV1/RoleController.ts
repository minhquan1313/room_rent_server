import { errorResponse } from "@/Utils/errorRes";
import { sleep } from "@/Utils/sleep";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Role, TRole } from "@/models/User/Role";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoleController {
  postAdd(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  patch(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  delete(req: Request, res: Response, next: NextFunction) {
    res.json(`ok`);
  }
  // /api/v1/roles/
  async getAll(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { roleTitle } = req;
      await sleep(1000);

      if (roleTitle) {
        const r: TRole[] = ["admin", "admin_lvl_2"];
        if (r.includes(roleTitle)) return res.json(await Role.find());
      }

      res.json(await Role.getUserAssignableRoles());
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoleController();
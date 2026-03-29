import type { Request, Response } from "express";

import { AdminRepository } from "../admin/admin.repository";

export class SettingsController {
  private readonly repository = new AdminRepository();

  get = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.repository.getSettings() });
  };
}

import type { Request, Response } from "express";
import type { ExtensionsRequest } from "./dtos/ExtensionsRequest";

export class ExtensionsController {
  async createExtension(req: Request, res: Response): Promise<void> {
    try {
      const extensions = req.body as ExtensionsRequest;
      res.status(201).json(extensions);
    } catch (error) {
      console.error("Error creating extension:", error);
      res.status(500).json({
        message: "Error creating extension",
      });
    }
  }
}

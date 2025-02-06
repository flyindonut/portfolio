import { Request, Response, NextFunction } from "express";
import FrameworkService from "../services/frameworkService";

export default class FrameworkController {
  static async getFrameworks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const frameworks = await FrameworkService.getAllFrameworks();
      res.json(frameworks);
    } catch (error) {
      next(error);
    }
  }

  static async getFrameworkBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const framework = await FrameworkService.getFrameworkBySlug(req.params.slug);
      if (!framework) {
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      res.json(framework);
    } catch (error) {
      next(error);
    }
  }

  static async createFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newFramework = await FrameworkService.createFramework(req.body);
      res.status(201).json(newFramework);
    } catch (error) {
      next(error);
    }
  }

  static async updateFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedFramework = await FrameworkService.updateFramework(req.params.slug, req.body);
      if (!updatedFramework) {
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      res.json(updatedFramework);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedFramework = await FrameworkService.deleteFramework(req.params.slug);
      if (!deletedFramework) {
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      res.json({ message: "Framework deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
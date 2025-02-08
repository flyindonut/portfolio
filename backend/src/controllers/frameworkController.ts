import { Request, Response, NextFunction } from "express";
import FrameworkService from "../services/frameworkService";
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

export default class FrameworkController {
  static async getFrameworks(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all frameworks');
    try {
      const frameworks = await FrameworkService.getAllFrameworks();
      logger.info(`Retrieved Frameworks: ${frameworks.map(framework => framework.slug).join(', ')}`);
      res.json(frameworks);
    } catch (error) {
      logger.error({ error }, 'Error retrieving frameworks');
      next(error);
    }
  }

  static async getFrameworkBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get framework by slug');
    try {
      const framework = await FrameworkService.getFrameworkBySlug(req.params.slug);
      if (!framework) {
        logger.warn('Framework not found');
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      logger.info(`Retrieved Framework: ${framework.slug}`);
      res.json(framework);
    } catch (error) {
      logger.error({ error }, 'Error retrieving framework');
      next(error);
    }
  }

  static async createFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create framework');
    try {
      const newFramework = await FrameworkService.createFramework(req.body);
      logger.info(`Created Framework: ${newFramework.slug}`);
      res.status(201).json(newFramework);
    } catch (error) {
      logger.error({ error }, 'Error creating framework');
      next(error);
    }
  }

  static async updateFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update framework');
    try {
      const updatedFramework = await FrameworkService.updateFramework(req.params.slug, req.body);
      if (!updatedFramework) {
        logger.warn('Framework not found for updating');
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      logger.info(`Updated Framework: ${updatedFramework.slug}`);
      res.json(updatedFramework);
    } catch (error) {
      logger.error({ error }, 'Error updating framework');
      next(error);
    }
  }

  static async deleteFramework(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete framework');
    try {
      const deletedFramework = await FrameworkService.deleteFramework(req.params.slug);
      if (!deletedFramework) {
        logger.warn('Framework not found for deletion');
        res.status(404).json({ message: "Framework not found" });
        return;
      }
      logger.info(`Deleted Framework: ${deletedFramework.slug}`);
      res.json({ message: "Framework deleted successfully" });
    } catch (error) {
      logger.error({ error }, 'Error deleting framework');
      next(error);
    }
  }
}
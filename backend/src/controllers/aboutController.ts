import { Request, Response, NextFunction } from "express";
import AboutService from "../services/aboutService";
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

export default class AboutController {
  static async getAllAbouts(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all abouts');
    try {
      const abouts = await AboutService.getAllAbouts();
      logger.info(`Retrieved Abouts: ${abouts.map(about => about.slug).join(', ')}`);
      res.json(abouts);
    } catch (error) {
      logger.error({ error }, 'Error retrieving abouts');
      next(error);
    }
  }

  static async getAboutBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get about by slug');
    try {
      const about = await AboutService.getAboutBySlug(req.params.slug);
      if (!about) {
        logger.warn('About not found');
        res.status(404).json({ message: "About not found" });
        return;
      }
      logger.info(`Retrieved About: ${about.slug}`);
      res.json(about);
    } catch (error) {
      logger.error({ error }, 'Error retrieving about');
      next(error);
    }
  }

  static async createAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create about');
    try {
      const newAbout = await AboutService.createAbout(req.body);
      logger.info(`Created About: ${newAbout.slug}`);
      res.status(201).json(newAbout);
    } catch (error) {
      logger.error({ error }, 'Error creating about');
      next(error);
    }
  }

  static async updateAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update about');
    try {
      const updatedAbout = await AboutService.updateAbout(req.params.slug, req.body);
      if (!updatedAbout) {
        logger.warn('About not found for updating');
        res.status(404).json({ message: "About not found" });
        return;
      }
      logger.info(`Updated About: ${updatedAbout.slug}`);
      res.json(updatedAbout);
    } catch (error) {
      logger.error({ error }, 'Error updating about');
      next(error);
    }
  }

  static async deleteAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete about');
    try {
      const deletedAbout = await AboutService.deleteAbout(req.params.slug);
      if (!deletedAbout) {
        logger.warn('About not found for deletion');
        res.status(404).json({ message: "About not found" });
        return;
      }
      logger.info(`Deleted About: ${deletedAbout.slug}`);
      res.json({ message: "About deleted successfully" });
    } catch (error) {
      logger.error({ error }, 'Error deleting about');
      next(error);
    }
  }
}
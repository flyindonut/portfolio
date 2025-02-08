import { Request, Response, NextFunction } from "express";
import LanguageService from "../services/languageService";
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

export default class LanguageController {
  static async getLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all languages');
    try {
      const languages = await LanguageService.getAllLanguages();
      logger.info(`Retrieved Languages: ${languages.map(language => language.slug).join(', ')}`);
      res.json(languages);
    } catch (error) {
      logger.error({ error }, 'Error retrieving languages');
      next(error);
    }
  }

  static async getLanguageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get language by slug');
    try {
      const language = await LanguageService.getLanguageBySlug(req.params.slug);
      if (!language) {
        logger.warn('Language not found');
        res.status(404).json({ message: "Language not found" });
        return;
      }
      logger.info(`Retrieved Language: ${language.slug}`);
      res.json(language);
    } catch (error) {
      logger.error({ error }, 'Error retrieving language');
      next(error);
    }
  }

  static async createLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create language');
    try {
      const newLanguage = await LanguageService.createLanguage(req.body);
      logger.info(`Created Language: ${newLanguage.slug}`);
      res.status(201).json(newLanguage);
    } catch (error) {
      logger.error({ error }, 'Error creating language');
      next(error);
    }
  }

  static async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update language');
    try {
      const updatedLanguage = await LanguageService.updateLanguage(req.params.slug, req.body);
      if (!updatedLanguage) {
        logger.warn('Language not found for updating');
        res.status(404).json({ message: "Language not found" });
        return;
      }
      logger.info(`Updated Language: ${updatedLanguage.slug}`);
      res.json(updatedLanguage);
    } catch (error) {
      logger.error({ error }, 'Error updating language');
      next(error);
    }
  }

  static async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete language');
    try {
      const deletedLanguage = await LanguageService.deleteLanguage(req.params.slug);
      if (!deletedLanguage) {
        logger.warn('Language not found for deletion');
        res.status(404).json({ message: "Language not found" });
        return;
      }
      const { icon, ...deletedLanguageWithoutIcon } = deletedLanguage.toObject();
      logger.info(`Deleted Language: ${deletedLanguageWithoutIcon.slug}`);
      res.json({ message: "Language deleted successfully" });
    } catch (error) {
      logger.error({ error }, 'Error deleting language');
      next(error);
    }
  }
}
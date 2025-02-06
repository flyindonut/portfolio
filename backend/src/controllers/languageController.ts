import { Request, Response, NextFunction } from "express";
import LanguageService from "../services/languageService";

export default class LanguageController {
  static async getLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const languages = await LanguageService.getAllLanguages();
      res.json(languages);
    } catch (error) {
      next(error);
    }
  }

  static async getLanguageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const language = await LanguageService.getLanguageBySlug(req.params.slug);
      if (!language) {
        res.status(404).json({ message: "Language not found" });
        return;
      }
      res.json(language);
    } catch (error) {
      next(error);
    }
  }

  static async createLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newLanguage = await LanguageService.createLanguage(req.body);
      res.status(201).json(newLanguage);
    } catch (error) {
      next(error);
    }
  }

  static async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedLanguage = await LanguageService.updateLanguage(req.params.slug, req.body);
      if (!updatedLanguage) {
        res.status(404).json({ message: "Language not found" });
        return;
      }
      res.json(updatedLanguage);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedLanguage = await LanguageService.deleteLanguage(req.params.slug);
      if (!deletedLanguage) {
        res.status(404).json({ message: "Language not found" });
        return;
      }
      res.json({ message: "Language deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
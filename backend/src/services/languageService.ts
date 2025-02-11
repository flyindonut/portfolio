import Language from "../models/languageModel";
import slugify from "slugify";
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});


export default class LanguageService {
  static async getAllLanguages() {
    logger.info('Getting Languages from DB');
    const languages = await Language.find();
    logger.info(`Retrieved Languages: ${languages.map(language => language.slug).join(', ')}`);
    return languages;
  }

  static async getLanguageBySlug(slug: string) {
    logger.info(`Getting Language from DB: ${slug}`);
    const language = await Language.findOne({ slug });
    if (!language) {
      logger.warn('Language not found', { slug });
    } else {
      logger.info(`Retrieved Language: ${language.slug}`);
    }
    return language;
  }

  static async createLanguage(data: any) {
    logger.info('Creating Language in DB');
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingLanguage = await Language.findOne({ slug: data.slug });
    if (existingLanguage) {
      logger.warn('Language with this name already exists', { slug: data.slug });
      throw new Error("Language with this name already exists.");
    }

    const newLanguage = await Language.create(data);
    logger.info(`Created Language: ${newLanguage.slug}`);
    return newLanguage;
  }

  static async updateLanguage(slug: string, updateData: any) {
    logger.info(`Updating Language in DB: ${slug}`);
    // Generate new slug if the language name has changed
    if (updateData && updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }

    const updatedLanguage = await Language.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedLanguage) {
      logger.warn('Language not found for updating', { slug });
    } else {
      logger.info(`Updated Language: ${updatedLanguage.slug}`);
    }
    return updatedLanguage;
  }

  static async deleteLanguage(slug: string) {
    logger.info(`Deleting Language from DB: ${slug}`);
    const deletedLanguage = await Language.findOneAndDelete({ slug });
    if (!deletedLanguage) {
      logger.warn('Language not found for deletion', { slug });
    } else {
      logger.info(`Deleted Language: ${deletedLanguage.slug}`);
    }
    return deletedLanguage;
  }
}
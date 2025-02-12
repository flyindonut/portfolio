import Framework from "../models/frameworkModel";
import slugify from "slugify";
import logger from '../config/logger';

export default class FrameworkService {
  static async getAllFrameworks() {
    logger.info('Getting Frameworks from DB');
    const frameworks = await Framework.find();
    logger.info(`Retrieved Frameworks: ${frameworks.map(framework => framework.slug).join(', ')}`);
    return frameworks;
  }

  static async getFrameworkBySlug(slug: string) {
    logger.info(`Getting Framework from DB: ${slug}`);
    const framework = await Framework.findOne({ slug });
    if (!framework) {
      logger.warn('Framework not found', { slug });
    } else {
      logger.info(`Retrieved Framework: ${framework.slug}`);
    }
    return framework;
  }

  static async createFramework(data: any) {
    logger.info('Creating Framework in DB');
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingFramework = await Framework.findOne({ slug: data.slug });
    if (existingFramework) {
      logger.warn('Framework with this name already exists', { slug: data.slug });
      throw new Error("Framework with this name already exists.");
    }

    const newFramework = await Framework.create(data);
    logger.info(`Created Framework: ${newFramework.slug}`);
    return newFramework;
  }

  static async updateFramework(slug: string, updateData: any) {
    logger.info(`Updating Framework in DB: ${slug}`);
    // Generate new slug if the framework name has changed
    if (updateData && updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }

    const updatedFramework = await Framework.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedFramework) {
      logger.warn('Framework not found for updating', { slug });
    } else {
      logger.info(`Updated Framework: ${updatedFramework.slug}`);
    }
    return updatedFramework;
  }

  static async deleteFramework(slug: string) {
    logger.info(`Deleting Framework from DB: ${slug}`);
    const deletedFramework = await Framework.findOneAndDelete({ slug });
    if (!deletedFramework) {
      logger.warn('Framework not found for deletion', { slug });
    } else {
      logger.info(`Deleted Framework: ${deletedFramework.slug}`);
    }
    return deletedFramework;
  }
}
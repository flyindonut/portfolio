import Technology from "../models/technologyModel";
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


export default class TechnologyService {
  static async getAllTechnologies() {
    logger.info('Getting Technologies from DB');
    const technologies = await Technology.find();
    logger.info(`Retrieved Technologies: ${technologies.map(tech => tech.slug).join(', ')}`);
    return technologies;
  }

  static async getTechnologyBySlug(slug: string) {
    logger.info(`Getting Technology from DB: ${slug}`);
    const technology = await Technology.findOne({ slug });
    if (!technology) {
      logger.warn('Technology not found', { slug });
    } else {
      logger.info(`Retrieved Technology: ${technology.slug}`);
    }
    return technology;
  }

  static async createTechnology(data: any) {
    logger.info('Creating Technology in DB');
    data.slug = slugify(data.translations.en.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingTechnology = await Technology.findOne({ slug: data.slug });
    if (existingTechnology) {
      logger.warn('Technology with this name already exists', { slug: data.slug });
      throw new Error("Technology with this name already exists.");
    }

    const newTechnology = await Technology.create(data);
    logger.info(`Created Technology: ${newTechnology.slug}`);
    return newTechnology;
  }

  static async updateTechnology(slug: string, updateData: any) {
    logger.info(`Updating Technology in DB: ${slug}`);
    // Generate new slug if the technology name has changed
    if (updateData.translations && updateData.translations.en && updateData.translations.en.name) {
      updateData.slug = slugify(updateData.translations.en.name, { lower: true, strict: true });
    }

    const updatedTechnology = await Technology.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedTechnology) {
      logger.warn('Technology not found for updating', { slug });
    } else {
      logger.info(`Updated Technology: ${updatedTechnology.slug}`);
    }
    return updatedTechnology;
  }

  static async deleteTechnology(slug: string) {
    logger.info(`Deleting Technology from DB: ${slug}`);
    const deletedTechnology = await Technology.findOneAndDelete({ slug });
    if (!deletedTechnology) {
      logger.warn('Technology not found for deletion', { slug });
    } else {
      logger.info(`Deleted Technology: ${deletedTechnology.slug}`);
    }
    return deletedTechnology;
  }
}
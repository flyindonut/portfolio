import About from "../models/aboutModel";
import slugify from "slugify";
import logger from '../config/logger';

export default class AboutService {
  static async getAllAbouts() {
    logger.info('Getting Abouts from DB');
    const abouts = await About.find();
    logger.info(`Retrieved Abouts: ${abouts.map(about => about.slug).join(', ')}`);
    return abouts;
  }

  static async getAboutBySlug(slug: string) {
    logger.info(`Getting About from DB: ${slug}`);
    const about = await About.findOne({ slug });
    if (!about) {
      logger.warn('About not found', { slug });
    } else {
      logger.info(`Retrieved About: ${about.slug}`);
    }
    return about;
  }

  static async createAbout(data: any) {
    logger.info('Creating About in DB');
    data.slug = slugify(data.translations.en.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingAbout = await About.findOne({ slug: data.slug });
    if (existingAbout) {
      logger.warn('About with this name already exists', { slug: data.slug });
      throw new Error("About with this name already exists.");
    }

    const newAbout = await About.create(data);
    logger.info(`Created About: ${newAbout.slug}`);
    return newAbout;
  }

  static async updateAbout(slug: string, updateData: any) {
    logger.info(`Updating About in DB: ${slug}`);
    // Generate new slug if the about name has changed
    if (updateData.translations && updateData.translations.en && updateData.translations.en.name) {
      updateData.slug = slugify(updateData.translations.en.name, { lower: true, strict: true });
    }

    const updatedAbout = await About.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedAbout) {
      logger.warn('About not found for updating', { slug });
    } else {
      logger.info(`Updated About: ${updatedAbout.slug}`);
    }
    return updatedAbout;
  }

  static async deleteAbout(slug: string) {
    logger.info(`Deleting About from DB: ${slug}`);
    const deletedAbout = await About.findOneAndDelete({ slug });
    if (!deletedAbout) {
      logger.warn('About not found for deletion', { slug });
    } else {
      logger.info(`Deleted About: ${deletedAbout.slug}`);
    }
    return deletedAbout;
  }
}
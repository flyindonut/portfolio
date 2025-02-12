import Service from "../models/serviceModel";
import slugify from "slugify";
import logger from '../config/logger';

export default class ServiceService {
  static async getAllServices() {
    logger.info('Getting Services from DB');
    const services = await Service.find();
    logger.info(`Retrieved Services: ${services.map(service => service.slug).join(', ')}`);
    return services;
  }

  static async getServiceBySlug(slug: string) {
    logger.info(`Getting Service from DB: ${slug}`);
    const service = await Service.findOne({ slug });
    if (!service) {
      logger.warn('Service not found', { slug });
    } else {
      logger.info(`Retrieved Service: ${service.slug}`);
    }
    return service;
  }

  static async createService(data: any) {
    logger.info('Creating Service in DB');
    data.slug = slugify(data.translations.en.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingService = await Service.findOne({ slug: data.slug });
    if (existingService) {
      logger.warn('Service with this name already exists', { slug: data.slug });
      throw new Error("Service with this name already exists.");
    }

    const newService = await Service.create(data);
    logger.info(`Created Service: ${newService.slug}`);
    return newService;
  }

  static async updateService(slug: string, updateData: any) {
    logger.info(`Updating Service in DB: ${slug}`);
    // Generate new slug if the service name has changed
    if (updateData.translations && updateData.translations.en && updateData.translations.en.name) {
      updateData.slug = slugify(updateData.translations.en.name, { lower: true, strict: true });
    }

    const updatedService = await Service.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedService) {
      logger.warn('Service not found for updating', { slug });
    } else {
      logger.info(`Updated Service: ${updatedService.slug}`);
    }
    return updatedService;
  }

  static async deleteService(slug: string) {
    logger.info(`Deleting Service from DB: ${slug}`);
    const deletedService = await Service.findOneAndDelete({ slug });
    if (!deletedService) {
      logger.warn('Service not found for deletion', { slug });
    } else {
      logger.info(`Deleted Service: ${deletedService.slug}`);
    }
    return deletedService;
  }
}
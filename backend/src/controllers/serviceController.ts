import { Request, Response, NextFunction } from "express";
import ServiceService from "../services/serviceService";
import pino from 'pino';

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

export default class ServiceController {
  static async getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all services');
    try {
      const services = await ServiceService.getAllServices();
      logger.info(`Retrieved Services: ${services.map(service => service.slug).join(', ')}`);
      res.json(services);
    } catch (error) {
      logger.error({ error }, 'Error retrieving services');
      next(error);
    }
  }

  static async getServiceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get service by slug');
    try {
      const service = await ServiceService.getServiceBySlug(req.params.slug);
      if (!service) {
        logger.warn('Service not found');
        res.status(404).json({ message: "Service not found" });
        return;
      }
      logger.info(`Retrieved Service: ${service.slug}`);
      res.json(service);
    } catch (error) {
      logger.error({ error }, 'Error retrieving service');
      next(error);
    }
  }

  static async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create service');
    try {
      const newService = await ServiceService.createService(req.body);
      logger.info(`Created Service: ${newService.slug}`);
      res.status(201).json(newService);
    } catch (error) {
      logger.error({ error }, 'Error creating service');
      next(error);
    }
  }

  static async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update service');
    try {
      const updatedService = await ServiceService.updateService(req.params.slug, req.body);
      if (!updatedService) {
        logger.warn('Service not found for updating');
        res.status(404).json({ message: "Service not found" });
        return;
      }
      logger.info(`Updated Service: ${updatedService.slug}`);
      res.json(updatedService);
    } catch (error) {
      logger.error({ error }, 'Error updating service');
      next(error);
    }
  }

  static async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete service');
    try {
      const deletedService = await ServiceService.deleteService(req.params.slug);
      if (!deletedService) {
        logger.warn('Service not found for deletion');
        res.status(404).json({ message: "Service not found" });
        return;
      }
      logger.info(`Deleted Service: ${deletedService.slug}`);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      logger.error({ error }, 'Error deleting service');
      next(error);
    }
  }
}
import { Request, Response, NextFunction } from "express";
import ProjectService from "../services/projectService";
import logger from '../config/logger';

export default class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get all projects');
    try {
      const projects = await ProjectService.getAllProjects();
      logger.info(`Retrieved Projects: ${projects.map(project => project.slug).join(', ')}`);
      res.json(projects);
    } catch (error) {
      logger.error({ error }, 'Error retrieving projects');
      next(error);
    }
  }

  static async getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to get project by slug');
    try {
      const project = await ProjectService.getProjectBySlug(req.params.slug);
      if (!project) {
        logger.warn('Project not found');
        res.status(404).json({ message: "Project not found" });
        return;
      }
      logger.info(`Retrieved Project: ${project.slug}`);
      res.json(project);
    } catch (error) {
      logger.error({ error }, 'Error retrieving project');
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to create project');
    try {
      const newProject = await ProjectService.createProject(req.body);
      logger.info(`Created Project: ${newProject.slug}`);
      res.status(201).json(newProject);
    } catch (error) {
      logger.error({ error }, 'Error creating project');
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to update project');
    try {
      const updatedProject = await ProjectService.updateProject(req.params.slug, req.body);
      if (!updatedProject) {
        logger.warn('Project not found for updating');
        res.status(404).json({ message: "Project not found" });
        return;
      }
      logger.info(`Updated Project: ${updatedProject.slug}`);
      res.json(updatedProject);
    } catch (error) {
      logger.error({ error }, 'Error updating project');
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Received request to delete project');
    try {
      const deletedProject = await ProjectService.deleteProject(req.params.slug);
      if (!deletedProject) {
        logger.warn('Project not found for deletion');
        res.status(404).json({ message: "Project not found" });
        return;
      }
      logger.info(`Deleted Project: ${deletedProject.slug}`);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      logger.error({ error }, 'Error deleting project');
      next(error);
    }
  }
}
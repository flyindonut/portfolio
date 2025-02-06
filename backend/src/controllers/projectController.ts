import { Request, Response, NextFunction } from "express";
import ProjectService from "../services/projectService";

export default class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await ProjectService.getAllProjects();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.getProjectBySlug(req.params.slug);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newProject = await ProjectService.createProject(req.body);
      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedProject = await ProjectService.updateProject(req.params.slug, req.body);
      if (!updatedProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedProject = await ProjectService.deleteProject(req.params.slug);
      if (!deletedProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

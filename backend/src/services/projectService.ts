import Project from "../models/projectModel";
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


export default class ProjectService {
  static async getAllProjects() {
    logger.info('Getting Projects from DB');
    const projects = await Project.find();
    logger.info(`Retrieved Projects: ${projects.map(project => project.slug).join(', ')}`);
    return projects;
  }

  static async getProjectBySlug(slug: string) {
    logger.info(`Getting Project from DB: ${slug}`);
    const project = await Project.findOne({ slug });
    if (!project) {
      logger.warn('Project not found', { slug });
    } else {
      logger.info(`Retrieved Project: ${project.slug}`);
    }
    return project;
  }

  static async createProject(data: any) {
    logger.info('Creating Project in DB');
    data.slug = slugify(data.translations.en.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingProject = await Project.findOne({ slug: data.slug });
    if (existingProject) {
      logger.warn('Project with this name already exists', { slug: data.slug });
      throw new Error("Project with this name already exists.");
    }

    const newProject = await Project.create(data);
    logger.info(`Created Project: ${newProject.slug}`);
    return newProject;
  }

  static async updateProject(slug: string, updateData: any) {
    logger.info(`Updating Project in DB: ${slug}`);
    // Generate new slug if the project name has changed
    if (updateData.translations && updateData.translations.en && updateData.translations.en.name) {
      updateData.slug = slugify(updateData.translations.en.name, { lower: true, strict: true });
    }

    const updatedProject = await Project.findOneAndUpdate({ slug }, updateData, { new: true });
    if (!updatedProject) {
      logger.warn('Project not found for updating', { slug });
    } else {
      logger.info(`Updated Project: ${updatedProject.slug}`);
    }
    return updatedProject;
  }

  static async deleteProject(slug: string) {
    logger.info(`Deleting Project from DB: ${slug}`);
    const deletedProject = await Project.findOneAndDelete({ slug });
    if (!deletedProject) {
      logger.warn('Project not found for deletion', { slug });
    } else {
      logger.info(`Deleted Project: ${deletedProject.slug}`);
    }
    return deletedProject;
  }
}
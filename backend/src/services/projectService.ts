import Project from "../models/projectModel";
import slugify from "slugify";

export default class ProjectService {
  static async getAllProjects() {
    return await Project.find();
  }

  static async getProjectBySlug(slug: string) {
    return await Project.findOne({ slug });
  }

  static async createProject(data: any) {
    data.slug = slugify(data.translations.en.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingProject = await Project.findOne({ slug: data.slug });
    if (existingProject) throw new Error("Project with this name already exists.");

    return await Project.create(data);
  }

  static async updateProject(slug: string, updateData: any) {
    // Generate new slug if the project name has changed
    if (updateData.translations && updateData.translations.en && updateData.translations.en.name) {
      updateData.slug = slugify(updateData.translations.en.name, { lower: true, strict: true });
    }

    return await Project.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  static async deleteProject(slug: string) {
    return await Project.findOneAndDelete({ slug });
  }
}
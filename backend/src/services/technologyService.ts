import Technology from "../models/technologyModel";
import slugify from "slugify";

export default class TechnologyService {
  static async getAllTechnologies() {
    return await Technology.find();
  }

  static async getTechnologyBySlug(slug: string) {
    return await Technology.findOne({ slug });
  }

  static async createTechnology(data: any) {
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingTechnology = await Technology.findOne({ slug: data.slug });
    if (existingTechnology) throw new Error("Technology with this name already exists.");

    return await Technology.create(data);
  }

  static async updateTechnology(slug: string, updateData: any) {
    return await Technology.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  static async deleteTechnology(slug: string) {
    return await Technology.findOneAndDelete({ slug });
  }
}
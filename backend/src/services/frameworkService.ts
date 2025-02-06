import Framework from "../models/frameworkModel";
import slugify from "slugify";

export default class FrameworkService {
  static async getAllFrameworks() {
    return await Framework.find();
  }

  static async getFrameworkBySlug(slug: string) {
    return await Framework.findOne({ slug });
  }

  static async createFramework(data: any) {
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingFramework = await Framework.findOne({ slug: data.slug });
    if (existingFramework) throw new Error("Framework with this name already exists.");

    return await Framework.create(data);
  }

  static async updateFramework(slug: string, updateData: any) {
    return await Framework.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  static async deleteFramework(slug: string) {
    return await Framework.findOneAndDelete({ slug });
  }
}
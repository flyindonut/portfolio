import Language from "../models/languageModel";
import slugify from "slugify";

export default class LanguageService {
  static async getAllLanguages() {
    return await Language.find();
  }

  static async getLanguageBySlug(slug: string) {
    return await Language.findOne({ slug });
  }

  static async createLanguage(data: any) {
    data.slug = slugify(data.name, { lower: true, strict: true });

    // Validate duplicate slug
    const existingLanguage = await Language.findOne({ slug: data.slug });
    if (existingLanguage) throw new Error("Language with this name already exists.");

    return await Language.create(data);
  }

  static async updateLanguage(slug: string, updateData: any) {
    return await Language.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  static async deleteLanguage(slug: string) {
    return await Language.findOneAndDelete({ slug });
  }
}
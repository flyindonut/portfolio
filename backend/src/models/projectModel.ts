import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  slug: string;
  translations: {
    en: {
      name: string;
      description: string;
    };
    fr: {
      name: string;
      description: string;
    };
  };
  technologies: string[];
  languages: string[];
  frameworks: string[];
  startDate: string; // Format: "MM/YYYY"
  endDate: string; // Format: "MM/YYYY"
  images: string[];
  link: string;
}

const ProjectSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    translations: {
      en: {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
      fr: {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    technologies: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    frameworks: { type: [String], default: [] },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    images: { type: [String], default: [] },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);

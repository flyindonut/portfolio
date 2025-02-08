import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  slug: string;
  technologies: string[];
  services: string[];
  firstName: string;
  lastName: string;
  translations: {
    en: {
      title: string;
      description: string;
      hobbies: string;
    };
    fr: {
      title: string;
      description: string;
      hobbies: string;
    };
  };
}

const AboutSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    technologies: { type: [String], default: [] },
    services: { type: [String], default: [] },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    translations: {
      en: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        hobbies: { type: String, required: true },
      },
      fr: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        hobbies: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAbout>("About", AboutSchema);
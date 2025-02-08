import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  translations: {
    en: {
      name: string;
    };
    fr: {
      name: string;
    };
  };
  icon: string;
  slug: string;
}

const ServiceSchema: Schema = new Schema(
  {
    translations: {
      en: {
        name: { type: String, required: true },
      },
      fr: {
        name: { type: String, required: true },
      },
    },
    icon: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IService>("Service", ServiceSchema);
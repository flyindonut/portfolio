import mongoose, { Schema, Document } from "mongoose";

export interface ILanguage extends Document {
  name: string;
  slug: string;
  icon: string;
}

const LanguageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILanguage>("Language", LanguageSchema);
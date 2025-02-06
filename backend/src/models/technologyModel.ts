import mongoose, { Schema, Document } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  slug: string;
  icon: string;
}

const TechnologySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITechnology>("Technology", TechnologySchema);
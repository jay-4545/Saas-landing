import { Schema, model, models, type InferSchemaType } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String },
    author: { type: String },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    mainImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { versionKey: false }
);

blogSchema.pre("save", function setUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

export type BlogDocument = InferSchemaType<typeof blogSchema>;
export const Blog = models.Blog || model("Blog", blogSchema);

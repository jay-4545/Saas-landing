import { Schema, model, models, type InferSchemaType } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String },
    company: { type: String },
    avatar: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    quote: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;
export const Testimonial =
  models.Testimonial || model("Testimonial", testimonialSchema);

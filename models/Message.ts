import { Schema, model, models, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type MessageDocument = InferSchemaType<typeof messageSchema>;
export const Message = models.Message || model("Message", messageSchema);

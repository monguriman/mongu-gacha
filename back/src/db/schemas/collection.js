import { Schema, model } from "mongoose";
import CardSchema from './card.js';

const CollectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    card: [CardSchema]
  },
  {
    timestamps: true,
  }
);

const CollectionModel = model("Collection", CollectionSchema);

export { CollectionModel };

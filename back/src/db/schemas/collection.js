import { Schema, model } from "mongoose";

const CardSchema = new Schema(
  {
    cardNumber: {
      type: Number,
      required: true,
    },//고유한 카드넘버
    cardRarity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CollectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    card: [CardSchema],
  },
  {
    timestamps: true,
  }
);

const CollectionModel = model("Collection", CollectionSchema);

export { CollectionModel };

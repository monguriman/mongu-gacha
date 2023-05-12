import { Schema, model } from "mongoose";

const TotalCardSchema = new Schema(
  {
    totalCardNumber: {
      type: Number,
      required: true,
      unique: true,
    },//고유한 카드넘버
    rarity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TotalCardModel = model("TotalCard", TotalCardSchema);

export { TotalCardModel };

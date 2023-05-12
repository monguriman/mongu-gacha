import { Schema, model } from "mongoose";

const CardSchema = new Schema(
  {
    cardId: {
      type: Number,
      required: true,
    },//고유한 카드넘버
    cardAcquisitionTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CardModel = model("Card", CardSchema);

export { CardModel };

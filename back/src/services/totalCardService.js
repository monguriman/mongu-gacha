import { TotalCard } from "../db";

class totalCardService {
  // 전체 totalCard 조회
  static async findAll() {
    const totalCards = await TotalCard.findAll({});
    return totalCards;
  }

  // totalCard 추가
  static async create(totalCardData) {
    const totalCard = await TotalCard.create(totalCardData);
    return totalCard;
  }

  // totalCard 수정
  static async update(totalCardNumber, updatedData) {
    const totalCard = await TotalCard.update(
      { totalCardNumber },
      updatedData,
      { new: true }
    );
    return totalCard;
  }

  // totalCard 삭제
  static async delete(totalCardNumber) {
    const deletedTotalCard = await TotalCard.delete({ totalCardNumber });
    return deletedTotalCard;
  }
}

export { totalCardService };

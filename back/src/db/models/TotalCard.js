import { TotalCardModel } from '../schemas/totalCard'

class TotalCard {
    // 전체 totalCard 조회
    static async findAll() {
        const totalCards = await TotalCardModel.find({})
        return totalCards
    }

    // rarity로 totalCard 조회
    static async findByRarity(rarity) {
        const totalCards = await TotalCardModel.find({ rarity: rarity })
        return totalCards
    }

    // totalCard 추가
    static async create(totalCardData) {
        const totalCard = await TotalCardModel.create(totalCardData)
        return totalCard
    }

    // totalCard 수정
    static async update(totalCardNumberData, updatedData) {
        const { totalCardNumber } = totalCardNumberData
        const totalCard = await TotalCardModel.findOneAndUpdate(
            { totalCardNumber: totalCardNumber },
            updatedData,
            { new: true }
        )
        return totalCard
    }

    // totalCard 삭제
    static async delete(totalCardNumberData) {
        const { totalCardNumber } = totalCardNumberData
        const deletedTotalCard = await TotalCardModel.findOneAndDelete({
            totalCardNumber: totalCardNumber,
        })
        return deletedTotalCard
    }
}

export { TotalCard }

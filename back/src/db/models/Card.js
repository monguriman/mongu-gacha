import { CardModel } from '../schemas/card'
import { UserModel } from '../schemas/user'

class Card {
    // 전체 카드 조회
    static async findAll() {
        const cards = await CardModel.find({})
        return cards
    }

    // 특정 카드 조회
    static async findById(cardId) {
        const card = await CardModel.findOne({ cardId })
        return card
    }

    // 카드 추가
    static async addCard(userId, cardData) {
        const card = await CardModel.create(cardData)
        const user = await UserModel.findOne({ _id: userId })
        user.collection.push(card)
        await user.save()
        return card
    }

    // 카드 삭제
    static async deleteCard(userId, cardId) {
        const user = await UserModel.findOne({ _id: userId })
        const index = user.collection.findIndex(
            (card) => card.cardId === cardId
        )
        if (index === -1) {
            throw new Error('Card not found')
        }
        const deletedCard = user.collection.splice(index, 1)[0]
        await user.save()
        return deletedCard
    }
}

export { Card }

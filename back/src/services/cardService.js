import { User, Card } from '../db'

class CardService {
    // 전체 카드 조회
    static async findAll() {
        const cards = await Card.find({})
        return cards
    }

    // 특정 카드 조회
    static async findById(cardId) {
        const card = await Card.findOne({ cardId })
        return card
    }

    // 카드 추가
    static async addCard(userId, cardData) {
        const card = await Card.create(cardData)
        const user = await User.findOne({ _id: userId })
        user.card.push(card)
        await user.save()
        return card
    }

    // 카드 삭제
    static async deleteCard(userId, cardId) {
        const user = await User.findOne({ _id: userId })
        const cardIndex = user.card.findIndex((card) => card.cardId === cardId)
        if (cardIndex === -1) {
            throw new Error('Card not found')
        }
        const deletedCard = user.card.splice(cardIndex, 1)[0]
        await user.save()
        return deletedCard
    }
}

export { CardService }

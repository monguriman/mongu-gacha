import { CollectionModel } from '../schemas/collection'

class Collection {
    // Collection 생성
    static async createCollection({ userId }) {
        const collection = await CollectionModel.create({ userId, cards: [] })
        return collection
    }

    // Collection 조회
    static async getCollection({ userId }) {
        const collection = await CollectionModel.findOne({ userId })
        return collection
    }

    // 카드 추가
    static async addCardToCollection({ userId, cardData }) {
        const collection = await CollectionModel.findOne({ userId })
        collection.cards.push(cardData)
        await collection.save()
        return collection.cards
    }

    // 카드 삭제
    static async deleteCardFromCollection({ userId, cardId }) {
        const collection = await CollectionModel.findOne({ userId })
        const index = collection.cards.findIndex(
            (card) => card.cardId === cardId
        )
        if (index === -1) {
            throw new Error('Card not found in collection')
        }
        const deletedCard = collection.cards.splice(index, 1)[0]
        await collection.save()
        return deletedCard
    }
}

export { Collection }

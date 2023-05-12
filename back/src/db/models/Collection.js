import { CollectionModel } from '../schemas/collection'

class Collection {
    // Collection 생성
    static async create({ userId }) {
        const collection = await CollectionModel.create({ userId, cards: [] })
        return collection
    }

    // Collection 조회
    static async findById({ userId }) {
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
    static async deleteCardFromCollection({ userId, cardNumber }) {
        const collection = await CollectionModel.findOne({ userId })
        const index = collection.cards.findIndex(
            (card) => card.cardNumber === cardNumber
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

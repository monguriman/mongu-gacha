import { TotalCard, Collection } from '../db'
import { coinService } from './coinService'

function getRarity() {
    const randomNumber = Math.random() // 0 이상 1 미만의 무작위 실수
    if (randomNumber < 0.03) {
        return 5
    } else if (randomNumber < 0.13) {
        return 4
    } else if (randomNumber < 0.6) {
        return 3
    } else {
        return 2
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //최댓값도 포함, 최솟값도 포함
}

class collectionService {
    //카드 1장 뽑기
    //5, 4, 3, 2성 (각각 3%(1장), 10%(3장), 47%(14장), 40%(12장)) 먼저 결정
    //레어도 내의 카드 중 한장을 랜덤하게 뽑음
    static async drawAndAddOneCard({ userId }) {
        const rarity = getRarity()
        console.log(rarity, '성 등장!')
        const candidateCards = await TotalCard.findByRarity(rarity)
        //후보카드 중 랜덤하게 한개 카드 선택
        const randomIndex = getRandomIntInclusive(0, candidateCards.length - 1)
        const selectedCard = candidateCards[randomIndex]

        //유저의 collection 가져오기
        const collection = await Collection.findById({ userId })

        const cardToAdd = {
            cardNumber: selectedCard.totalCardNumber,
            cardRarity: selectedCard.rarity,
        }

        //유저의 collection을 찾아서 없다면 최초 1회 collection 생성 후 거기에 추가
        if (!collection) {
            const createdCollection = await Collection.create({ userId })
            createdCollection.card.push(cardToAdd)
            await createdCollection.save()

            // 코인 차감
            await coinService.deductCoin({ userId, amount: 30 })

            return createdCollection.card[0]
        }

        //collection내의 card 배열에 selectedCard를 추가
        collection.card.push(cardToAdd)
        await collection.save()

        // 코인 차감
        await coinService.deductCoin({ userId, amount: 30 })//뽑기 1회당 가격

        return cardToAdd
    }
}

export { collectionService }

import { Router } from 'express'
import { login_required } from '../middlewares/login_required'
import { collectionService } from '../services/collectionService'

const collectionRouter = Router()

// 카드 1회 뽑기
collectionRouter.put('/collection/:id', async (req, res) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.params.id
        const cardDrew = await collectionService.drawAndAddOneCard({ userId });
        res.json(cardDrew)
    } catch (error) {
        res.status(500).json({ error: '카드 뽑기에 실패했습니다.' })
    }
})

// 유저의 collection 조회
collectionRouter.get('/collection/:id', async (req, res) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.params.id
        const collection = await collectionService.getCollection({ userId });
        res.json(collection)
    } catch (error) {
        res.status(500).json({ error: '유저의 도감 조회에 실패했습니다.' })
    }
})

export { collectionRouter }

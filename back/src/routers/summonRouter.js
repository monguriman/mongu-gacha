import { Router } from 'express'
import { login_required } from '../middlewares/login_required'
import { summonService } from '../services/summonService'

const summonRouter = Router()

// 카드 1회 뽑기
summonRouter.put('/summon/:id', async (req, res) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.params.id
        const cardDrew = await summonService.drawAndAddOneCard({ userId });
        res.json(cardDrew)
    } catch (error) {
        res.status(400).json({ error: '카드 뽑기에 실패했습니다.' })
    }
})

// 유저의 collection 조회
summonRouter.get('/summon/:id', async (req, res) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.params.id
        const collection = await summonService.getCollection({ userId });
        res.json(collection)
    } catch (error) {
        res.status(400).json({ error: '유저의 도감 조회에 실패했습니다.' })
    }
})

export { summonRouter }

import { Router } from 'express'
import { login_required } from '../middlewares/login_required'
import { summonService } from '../services/summonService'

const summonRouter = Router()

// 카드 1회 뽑기
summonRouter.put('/summon/', async (req, res) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.params.id
        const cardDrew = await summonService.drawAndAddOneCard({ userId });
        res.json(cardDrew)
    } catch (error) {
        res.status(400).json({ error: '카드 뽑기에 실패했습니다.' })
    }
})

export { summonRouter }

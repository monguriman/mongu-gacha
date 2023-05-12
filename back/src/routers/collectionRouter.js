import { Router } from 'express'
import { login_required } from '../middlewares/login_required'
import { collectionService } from '../services/collectionService'

const collectionRouter = Router()

// 전체 totalCard 조회
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

export { collectionRouter }

import { Router } from 'express'
import { login_required } from '../middlewares/login_required'
import { collectionService } from '../services/collectionService'

const collectionRouter = Router()

// 유저의 collection 조회
collectionRouter.get('/collection', login_required, async (req, res, next) => {
    try {
        // URI로부터 사용자 id를 추출함.
        const userId = req.currentUserId
        const collection = await collectionService.getCollection({ userId });

        res.json(collection)
    } catch (error) {
        res.status(400).json({ error: '유저의 도감 조회에 실패했습니다.' })
    }
})

export { collectionRouter }

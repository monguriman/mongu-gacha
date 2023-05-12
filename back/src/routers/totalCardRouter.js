import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { totalCardService } from '../services/totalCardService';
const totalCardRouter = Router();

// 전체 totalCard 조회
totalCardRouter.get('/totalCard', async (req, res) => {
  try {
    const totalCards = await totalCardService.findAll();
    res.json(totalCards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total cards' });
  }
});

// totalCard 추가
totalCardRouter.post('/totalCard', async (req, res) => {
  const totalCardData = req.body;
  try {
    const totalCard = await totalCardService.create(totalCardData);
    res.json(totalCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add total card' });
  }
});

// totalCard 수정
totalCardRouter.put('/totalCard/:totalCardNumber', async (req, res) => {
  const totalCardNumber = req.params.totalCardNumber;
  const updatedData = req.body;
  try {
    const totalCard = await totalCardService.update(totalCardNumber, updatedData);
    res.json(totalCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update total card' });
  }
});

// totalCard 삭제
totalCardRouter.delete('/totalCard/:totalCardNumber', async (req, res) => {
  const totalCardNumber = req.params.totalCardNumber;
  try {
    const deletedTotalCard = await totalCardService.delete(totalCardNumber);
    res.json(deletedTotalCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete total card' });
  }
});

export { totalCardRouter };

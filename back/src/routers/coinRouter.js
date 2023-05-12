import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { coinService } from "../services/coinService";

const coinRouter = Router();

coinRouter.put(
  "/user/coin", // 경로 수정
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const { amount, operation } = req.body;
      if (operation === 'add') {
        const result = await coinService.addCoin({ userId, amount });
        res.json({ coin: result.coin });
      } else if (operation === 'deduct') {
        const result = await coinService.deductCoin({ userId, amount });
        res.json({ coin: result.coin });
      } else {
        res.status(400).json({ message: 'Invalid operation' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  

export { coinRouter };

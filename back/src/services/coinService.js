import { User } from "../db";

class coinService {
  static async addCoin({ userId, amount }) {
    const user = await User.findById({ userId });
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin + amount;
    const coin = await User.update({ userId, fieldToUpdate, newValue: updatedCoin })
    return coin;
  }

  static async deductCoin({ userId, amount }) {
    const user = await User.findById({ userId });

    if (user.coin < amount) {
      res.status(400).send({ error: '코인이 부족합니다.' });
      throw new Error('코인이 부족합니다.');
    }

    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin - amount;
    const coin = await User.update({ userId, fieldToUpdate, newValue: updatedCoin })

    return coin;
  }
}

export { coinService };

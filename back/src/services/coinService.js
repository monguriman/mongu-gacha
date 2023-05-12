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
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin - amount;
    const coin = await User.update({ userId, fieldToUpdate, newValue: updatedCoin })

    return coin;
  }
}

export { coinService };

import { User } from "../db";

class coinService {
  static async addCoin({ user_id, amount }) {
    const user = await User.findById({ user_id });
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin + amount;
    const coin = await User.update({ user_id, fieldToUpdate, updatedCoin })

    return coin;
  }

  static async deductCoin({ user_id, amount }) {
    const user = await User.findById({ user_id });
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin - amount;
    const coin = await User.update({ user_id, fieldToUpdate, updatedCoin })

    return coin;
  }
}

export { coinService };

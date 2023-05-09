import { User } from "../db";

class coinService {
  static async addCoin({ user_id, amount }) {
    console.log('서비스들어옴')
    const user = await User.findById({ user_id });
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin + amount;
    const coin = await User.update({ user_id, fieldToUpdate, newValue: updatedCoin })
    console.log(coin);
    return coin;
  }

  static async deductCoin({ user_id, amount }) {
    const user = await User.findById({ user_id });
    const fieldToUpdate = 'coin';
    const updatedCoin = user.coin - amount;
    const coin = await User.update({ user_id, fieldToUpdate, newValue: updatedCoin })

    return coin;
  }
}

export { coinService };

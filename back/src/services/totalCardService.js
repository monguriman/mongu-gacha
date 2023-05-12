import { User } from "../db";

class collectionService {
  //카드 1장 뽑기
  //5, 4, 3, 2성 (각각 3%(1장), 10%(3장), 47%(14장), 40%(12장)) 먼저 결정
  //레어도 내의 카드 중 한장을 랜덤하게 뽑음

  static async addcollection({ userId, amount }) {
    const user = await User.findById({ userId });
    const fieldToUpdate = 'collection';
    const updatedcollection = user.collection + amount;
    const collection = await User.update({ userId, fieldToUpdate, newValue: updatedcollection })
    return collection;
  }

  static async deductcollection({ userId, amount }) {
    const user = await User.findById({ userId });
    const fieldToUpdate = 'collection';
    const updatedcollection = user.collection - amount;
    const collection = await User.update({ userId, fieldToUpdate, newValue: updatedcollection })

    return collection;
  }
}

export { collectionService };

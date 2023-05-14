import { Collection } from '../db'

class collectionService {
    //유저의 현재 도감정보 가져오기
    static async getCollection({ userId }) {
        const collection = await Collection.findById({ userId });

        if (!collection) {
            const errorMessage = '유저는 아무런 카드를 가지고 있지 않습니다.';
            return { errorMessage };
        }

        return collection;
    }
}

export { collectionService }

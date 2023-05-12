import { UserModel } from '../schemas/user';

class User {
    // 유저 추가
    static async create({ newUser }) {
        const createdNewUser = await UserModel.create(newUser);
        return createdNewUser;
    }

    // 이메일 조회
    static async findByEmail({ email }) {
        const user = await UserModel.findOne({ email });
        return user;
    }

    // 아이디 조회
    static async findById({ userId }) {
        const user = await UserModel.findOne({ _id: userId });
        return user;
    }

    // 모든 유저 조회
    static async findAll() {
        const users = await UserModel.find({});
        return users;
    }

    // 특정 유저 정보 수정
    static async update({ userId, fieldToUpdate, newValue }) {
        const filter = { _id: userId };

        let update = { [fieldToUpdate]: newValue };

        const option = { returnOriginal: false };

        const updatedUser = await UserModel.findOneAndUpdate(filter, update, option);

        return updatedUser;
    }
}

export { User };

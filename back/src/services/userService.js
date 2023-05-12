import { User, Comment } from '../db'; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class userAuthService {
    //create
    static async addUser({ name, email, password }) {
        // 이메일 중복 확인
        const user = await User.findByEmail({ email });
        if (user) {
            const errorMessage = '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.';
            return { errorMessage };
        }

        // 비밀번호 해쉬화
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { name, email, password: hashedPassword };

        // db에 저장
        const createdNewUser = await User.create({ newUser });
        createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

        return createdNewUser;
    }
    // 이메일 조회
    static async findByEmail({ email }) {
        const user = await User.findByEmail({ email });
        return user;
    }

    //로그인
    static async getUser({ email, password }) {
        // 이메일 db에 존재 여부 확인
        const user = await User.findByEmail({ email });

        if (!user) {
            const errorMessage = '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        // 비밀번호 일치 여부 확인
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
        if (!isPasswordCorrect) {
            const errorMessage = '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        // 로그인 성공 -> JWT 웹 토큰 생성
        const secretKey = process.env.JWT_SECRET_KEY || 'jwt-secret-key';
        const token = jwt.sign({ userId: user._id }, secretKey);

        // 반환할 loginuser 객체를 위한 변수 설정
        const id = user._id;
        const name = user.name;
        const description = user.description;
        const coin = user.coin;

        const loginUser = {
            token,
            id,
            email,
            name,
            description,
            coin,
            errorMessage: null,
        };

        return loginUser;
    }

    //모든 users read - 커뮤니티
    static async getUsers() {
        const users = await User.findAll();
        return users;
    }

    //update
    static async setUser({ userId, toUpdate }) {
        // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
        let user = await User.findById({ userId });
        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            const errorMessage = '가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }
        // toUpdate -> name, email, description, gitLink, userImage
        for (const [fieldToUpdate, newValue] of Object.entries(toUpdate)) {
            user = await User.update({ userId, fieldToUpdate, newValue });
            await Comment.updateUser({ userId, fieldToUpdate, newValue });
        }

        return user;
    }

    // 특정 user read
    static async getUserInfo({ userId }) {
        const user = await User.findById({ userId });

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            const errorMessage = '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
            return { errorMessage };
        }

        return user;
    }

}

export { userAuthService };

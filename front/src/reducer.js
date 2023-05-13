export function loginReducer(userState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            console.log('%c로그인!', 'color: #d93d1a;')
            return {
                ...userState,
                user: action.payload,
            }
        case 'LOGOUT':
            console.log('%c로그아웃!', 'color: #d93d1a;')
            return {
                ...userState,
                user: null,
            }
        case 'UPDATE_COIN':
            console.log('%c코인 값 변동!', 'color: #d93d1a;')
            console.log(action.coin);
            return {
                ...userState,
                coin: action.coin,
            }
        default:
            return userState
    }
}

import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Image } from 'react-bootstrap'

import * as Api from '../../api'
import { DispatchContext, UserStateContext } from '../../App'

import '../../styles/LoginForm.css'
import Logo from '../../images/logo.png'

function LoginForm() {
    const navigate = useNavigate()
    const dispatch = useContext(DispatchContext)
    const userState = useContext(UserStateContext)

    //useState로 email 상태를 생성함.
    const [email, setEmail] = useState('abc@example.com')
    //useState로 password 상태를 생성함.
    const [password, setPassword] = useState('1111')

    //이메일이 abc@example.com 형태인지 regex를 이용해 확인함.
    const validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    //위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함.
    const isEmailValid = validateEmail(email)
    // 비밀번호가 4글자 이상인지 여부를 확인함.
    const isPasswordValid = password.length >= 4
    //
    // 이메일과 비밀번호 조건이 동시에 만족되는지 확인함.
    const isFormValid = isEmailValid && isPasswordValid

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // "user/login" 엔드포인트로 post요청함.
            const res = await Api.post('user/login', {
                email,
                password,
            })
            // 유저 정보는 response의 data임.
            const user = res.data
            console.log(user)
            // JWT 토큰은 유저 정보의 token임.
            const jwtToken = user.token
            // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
            sessionStorage.setItem('userToken', jwtToken)
            // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: user,
            })

            // 기본 페이지로 이동함.
            navigate('/', { replace: true })
        } catch (err) {
            alert(err.response.data.error)
            console.log('로그인에 실패하였습니다.\n', err)
        }
    }

    useEffect(() => {
        // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
        if (!userState.user) {
            navigate('/login')
            return
        } else {
            navigate(`/user/${userState.user._id ?? userState.user._id}`)
        }
    }, [userState, navigate])

    return (
        <>
            <Container className="logoContainer">
                <Image src={Logo} style={{ width: '320px' }} />
            </Container>
            <Container className="introContainer">
                코인을 모아 당신의 카드 콜렉션을 완성해보세요
                </Container>
            <Container className="loginContainer">
                <form class="form_main" onSubmit={handleSubmit}>
                    <p class="heading">로그인</p>
                    <div class="inputContainer">
                        <svg
                            viewBox="0 0 16 16"
                            fill="#2e2e2e"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            class="inputIcon"
                        >
                            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                        </svg>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일"
                            id="username"
                            class="inputField"
                            type="text"
                        />
                    </div>
                    {!isEmailValid && (
                        <Form.Text
                            className="text-success mt-0 mb-0"
                            style={{
                                fontSize: '12.5px',
                                alignSelf: 'flex-start',
                            }}
                        >
                            　이메일 형식이 올바르지 않습니다.
                        </Form.Text>
                    )}

                    <div class="inputContainer">
                        <svg
                            viewBox="0 0 16 16"
                            fill="#2e2e2e"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            class="inputIcon"
                        >
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                        </svg>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="패스워드"
                            id="password"
                            class="inputField"
                            type="password"
                        />
                    </div>
                    {!isPasswordValid && (
                        <Form.Text
                            className="text-success mt-0 mb-0"
                            style={{
                                fontSize: '12.5px',
                                alignSelf: 'flex-start',
                            }}
                        >
                            　비밀번호는 4글자 이상입니다.
                        </Form.Text>
                    )}

                    <button id="button">로그인</button>
                    <div class="signupContainer">
                        <a
                            onClick={() => navigate('/register')}
                            style={{ color: 'white' }}
                        >
                            회원가입
                        </a>
                    </div>
                </form>
            </Container>
        </>
    )
}

export default LoginForm

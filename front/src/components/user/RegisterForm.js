import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'

import * as Api from '../../api'

function RegisterForm() {
  const navigate = useNavigate()

  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState('abc@example.com')
  //useState로 password 상태를 생성함.
  const [password, setPassword] = useState('1111')
  //useState로 confirmPassword 상태를 생성함.
  const [confirmPassword, setConfirmPassword] = useState('1111')
  //useState로 name 상태를 생성함.
  const [name, setName] = useState('이름')

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
  // 비밀번호와 확인용 비밀번호가 일치하는지 여부를 확인함.
  const isPasswordSame = password === confirmPassword
  // 이름이 2글자 이상인지 여부를 확인함.
  const isNameValid = name.length >= 2

  // 위 4개 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid =
    isEmailValid && isPasswordValid && isPasswordSame && isNameValid

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // "user/register" 엔드포인트로 post요청함.
      await Api.post('user/register', {
        email,
        password,
        name,
      })

      // 로그인 페이지로 이동함.
      navigate('/login')
    } catch (err) {
      console.log('회원가입에 실패하였습니다.', err)
    }
  }

  return (
    <Container>
      <form class="form_main" onSubmit={handleSubmit}>
        <p class="heading">Sign up</p>

        <div class="inputContainer">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            id="registerEmail"
            class="inputField"
            type="text"
          />
        </div>
        {!isEmailValid && (
          <Form.Text className="text-success mt-0 mb-0" style={{fontSize: '12.5px', alignSelf: 'flex-start'}}>
           　이메일 형식이 올바르지 않습니다.
          </Form.Text>
        )}

        <div class="inputContainer">
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            id="registerPassword"
            class="inputField"
            type="password"
          />
        </div>
        {!isPasswordValid && (
          <Form.Text className="text-success mt-0 mb-0" style={{fontSize: '12.5px', alignSelf: 'flex-start'}}>
            　비밀번호는 4글자 이상으로 설정해 주세요.
          </Form.Text>
        )}

        <div class="inputContainer">
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password Confirm"
            id="registerConfirmPassword"
            class="inputField"
            type="password"
          />
        </div>
        {!isPasswordSame && (
          <Form.Text className="text-success mt-0 mb-0" style={{fontSize: '12.5px', alignSelf: 'flex-start'}}>
            　비밀번호가 일치하지 않습니다.
          </Form.Text>
        )}

        <div class="inputContainer">
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            id="registerName"
            class="inputField"
            type="text"
          />
        </div>
        {!isNameValid && (
          <Form.Text className="text-success mt-0 mb-0" style={{fontSize: '12.5px', alignSelf: 'flex-start'}}>
            　이름은 2글자 이상으로 설정해 주세요.
          </Form.Text>
        )}

        <button id="button" type="submit" disabled={!isFormValid}>Register</button>
      </form>
    </Container>
  )
}

export default RegisterForm

import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Col, Row, Image } from 'react-bootstrap'

import { UserStateContext } from '../App'
import * as Api from '../api'
import '../styles/Home.css'
import menuButtons from '../images/menuButtons'
import Logo from '../images/logo.png'

function Portfolio() {
    const navigate = useNavigate()
    const params = useParams()
    // useState 훅을 통해 portfolioOwner 상태를 생성함.
    const [portfolioOwner, setPortfolioOwner] = useState(null)
    // fetchPorfolioOwner 함수가 완료된 이후에만 (isFetchCompleted가 true여야) 컴포넌트가 구현되도록 함.
    // 아래 코드를 보면, isFetchCompleted가 false이면 "loading..."만 반환되어서, 화면에 이 로딩 문구만 뜨게 됨.
    const [isFetchCompleted, setIsFetchCompleted] = useState(false)
    const userState = useContext(UserStateContext)

    const fetchPorfolioOwner = async (ownerId) => {
        // 유저 id를 가지고 "/users/유저id" 엔드포인트로 요청해 사용자 정보를 불러옴.
        const res = await Api.get('users', ownerId)
        // 사용자 정보는 response의 data임.
        const ownerData = res.data
        // portfolioOwner을 해당 사용자 정보로 세팅함.
        setPortfolioOwner(ownerData)
        // fetchPorfolioOwner 과정이 끝났으므로, isFetchCompleted를 true로 바꿈.
        setIsFetchCompleted(true)
    }

    useEffect(() => { 
      console.log(userState.user)
        // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
        if (!userState.user) {
            navigate('/login', { replace: true })
            return
        }
        if (params.userId) {
            // 만약 현재 URL이 "/users/:userId" 라면, 이 userId를 유저 id로 설정함.
            const ownerId = params.userId
            // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
            fetchPorfolioOwner(ownerId)
        } else {
            // 이외의 경우, 즉 URL이 "/" 라면, 전역 상태의 user.id를 유저 id로 설정함.
            const ownerId = userState.user._id
            // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
            fetchPorfolioOwner(ownerId)
        }
    }, [params, userState, navigate])

    if (!isFetchCompleted) {
        return 'loading...'
    }

    return (
        <>
            <Container>
            <Row className="justify-content-center pt-5 flex-column align-items-center">
                <Image src={Logo} className="mb-5 mt-3" style={{width:'400px'}} />
                    <Col xs={6} md={5} xl={3} className="mb-5">
                        <img
                            className="homeButton"
                            src={menuButtons['miningButton']}
                            onClick={() => navigate('/mining')}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Col>
                    <Col xs={6} md={5} xl={3} className="mb-5">
                        <img
                            className="homeButton"
                            src={menuButtons['summonButton']}
                            onClick={() => navigate('/summon')}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Col>
                    <Col xs={6} md={5} xl={3} className="mb-5">
                        <img
                            className="homeButton"
                            src={menuButtons['rouletteButton']}
                            onClick={() => navigate('/roulette')}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Col>
                    <Col xs={6} md={5} xl={3} className="mb-5">
                        <img
                            className="homeButton"
                            src={menuButtons['collectionButton']}
                            onClick={() => navigate('/collection')}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Portfolio

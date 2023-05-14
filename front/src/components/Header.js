import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { UserStateContext, DispatchContext } from '../App'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const userState = useContext(UserStateContext)
    const dispatch = useContext(DispatchContext)
    const [coin, setCoin] = useState(0) // 초기값 0으로 설정

    useEffect(() => {
        if (userState.user) {
            setCoin(userState.user.coin)
        }
    }, [userState.user])

    const isLogin = !!userState.user

    const logout = () => {
        sessionStorage.removeItem('userToken')
        dispatch({ type: 'LOGOUT' })
        navigate('/')
    }

    const portfolioOwner = userState.user

    return (
        <>
            <Navbar
                activeKey={location.pathname}
                style={{ backgroundColor: 'black', opacity: '70%' }}
            >
                <Nav.Item className="me-auto mb-1 mt-1">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Nav.Link
                            onClick={() => navigate('/')}
                            style={{ color: '#FFFFFF', fontWeight: '500' }}
                        >
                            Mongu Collectors
                        </Nav.Link>
                        {isLogin && portfolioOwner && (
                            <div
                                style={{
                                    textAlign: 'left',
                                    marginLeft: '10px',
                                    color: '#FFFFFF',
                                }}
                            >
                                <p style={{ marginBottom: '5px' }}>
                                    Lv.1 {portfolioOwner.name}
                                </p>
                                <p>코인 소지량 {coin}</p>
                            </div>
                        )}
                    </div>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => navigate('/mining')}
                        style={{ color: '#FFFFFF', fontWeight: '500' }}
                    >
                        채굴
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => navigate('/summon')}
                        style={{ color: '#FFFFFF', fontWeight: '500' }}
                    >
                        소환
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => navigate('/collection')}
                        style={{ color: '#FFFFFF', fontWeight: '500' }}
                    >
                        도감
                    </Nav.Link>
                </Nav.Item>
                {isLogin && (
                    <Nav.Item>
                        <Nav.Link
                            onClick={logout}
                            style={{ color: '#FFFFFF', fontWeight: '500' }}
                        >
                            로그아웃
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Navbar>
        </>
    )
}

export default Header

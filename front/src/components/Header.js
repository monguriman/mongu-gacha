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
            {isLogin && (
                <Navbar
                    activeKey={location.pathname}
                    style={{ backgroundColor: 'black', opacity: '70%' }}
                >
                    <Nav.Item className="me-auto mb-1 mt-1">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isLogin && portfolioOwner && (
                                <div
                                    style={{
                                        textAlign: 'left',
                                        marginLeft: '10px',
                                        color: '#FFFFFF',
                                    }}
                                >
                                    <p style={{ marginBottom: '5px' }}>
                                    🚩{portfolioOwner.name} 님
                                    </p>
                                    <p>🪙 {coin.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => navigate('/')}
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                            }}
                        >
                            홈
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => navigate('/mining')}
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                            }}
                        >
                            채굴
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => navigate('/summon')}
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                            }}
                        >
                            소환
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => navigate('/roulette')}
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                            }}
                        >
                            룰렛
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            onClick={() => navigate('/collection')}
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                            }}
                        >
                            도감
                        </Nav.Link>
                    </Nav.Item>
                    {isLogin && (
                        <Nav.Item>
                            <Nav.Link
                                onClick={logout}
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                }}
                            >
                                로그아웃
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </Navbar>
            )}
        </>
    )
}

export default Header

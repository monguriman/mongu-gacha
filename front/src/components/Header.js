import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { UserStateContext, DispatchContext } from '../App'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()

    const userState = useContext(UserStateContext)
    const dispatch = useContext(DispatchContext)

    // 전역상태에서 user가 null이 아니라면 로그인 성공 상태임.
    const isLogin = !!userState.user

    // 로그아웃 클릭 시 실행되는 함수
    const logout = () => {
        // sessionStorage 에 저장했던 JWT 토큰을 삭제함.
        sessionStorage.removeItem('userToken')
        // dispatch 함수를 이용해 로그아웃함.
        dispatch({ type: 'LOGOUT' })
        // 기본 페이지로 돌아감.
        navigate('/')
    }

    // portfolioOwner 정보를 가져옴
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
                                <p>코인 소지량 {portfolioOwner.coin}</p>
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
                        onClick={() => navigate('/network')}
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

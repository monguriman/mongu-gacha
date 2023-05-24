import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheel } from 'react-custom-roulette'
import { DispatchContext, UserStateContext } from '../../App'
import { Card, Col, Row, Modal, Button, Container, Form } from 'react-bootstrap'
import * as Api from '../../api'
import '../../styles/RouletteForm.css'
import rouletteBackground from '../../images/rouletteBackground.png'
const data = [{ option: 'RED' }, { option: 'BLUE' }]

function RouletteForm() {
    const dispatch = useContext(DispatchContext)
    const userState = useContext(UserStateContext)
    const navigate = useNavigate()

    const [mustSpin, setMustSpin] = useState(false)
    const [prizeNumber, setPrizeNumber] = useState(0)
    const [betAmount, setBetAmount] = useState('')
    const [betColor, setBetColor] = useState('')
    const [resultMessage, setResultMessage] = useState('')
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [coin, setCoin] = useState(0)

    const handleSpinClick = async () => {
        if (!mustSpin && betAmount && betColor) {
            // 유저의 보유 코인과 베팅 금액을 비교하여 코인이 부족한 경우 에러 메시지 표시
            if (parseInt(betAmount) > coin || coin == 0) {
                setResultMessage('코인이 부족합니다.')
                setIsResultVisible(true)
                return
            }

            const newPrizeNumber = Math.floor(Math.random() * data.length)
            setPrizeNumber(newPrizeNumber)
            setMustSpin(true)

            const requestBody = {
                amount: parseInt(betAmount),
                operation: 'deduct',
            }

            try {
                //먼저 베팅한 코인을 차감한다
                const res = await Api.put('user/coin', requestBody)
                const user = res.data
                //상단바에 차감이 즉각 반영되도록 전역 반영
                dispatch({
                    type: 'UPDATE_COIN',
                    payload: user,
                })

                if (data[newPrizeNumber].option === betColor) {
                    const addAmount = parseInt(betAmount) * 2

                    const addRequestBody = {
                        amount: addAmount,
                        operation: 'add',
                    }
                    try {
                        await Api.put('user/coin', addRequestBody)

                        setResultMessage(
                            `축하합니다! ${addAmount.toLocaleString()} 코인을 얻었습니다.`
                        )
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    setResultMessage(`${betAmount.toLocaleString()} 코인을 잃었습니다.`)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleStop = async () => {
        //상단바에 즉각 반영되도록 전역 반영
        const res = await Api.get('user/current')
        const user = res.data
        dispatch({
            type: 'UPDATE_COIN',
            payload: user,
        })
    }

    useEffect(() => {
        // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
        if (!userState.user) {
            alert('로그인 후 사용가능한 메뉴입니다.')
            navigate('/login', { replace: true })
            return
        }
    }, [userState])

    useEffect(() => {
        setIsResultVisible(false)
    }, [betAmount, betColor])

    useEffect(() => {
        // 유저의 보유 코인 가져오기
        Api.get('user/current')
            .then((response) => {
                const user = response.data
                setCoin(user.coin)
            })
            .catch((error) => console.log(error))
    }, [mustSpin])

    useEffect(() => {
        if (isResultVisible) {
            const timeout = setTimeout(() => {
                setIsResultVisible(false)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [isResultVisible])

    return (
        <Container className="d-flex align-items-center justify-content-center bg-transparent">
            <Card
                className="text-center"
                style={{
                    backgroundImage: `url(${rouletteBackground})`,
                    backgroundSize: 'cover',
                    backgroundColor: 'transparent',
                    backgroundPosition: 'center',
                    height: '510px',
                    width: '800px',
                    marginTop: '15%',
                    position: 'relative',
                }}
            >
                <Card.Body>
                    <Row className="">
                        <Col
                            xs="6"
                            className="ps-4 mt-4 pt-4 d-flex align-items-center justify-content-center"
                        >
                            <Container
                                className="text-white"
                                style={{
                                    fontSize: '13px',
                                    position: 'absolute',
                                    bottom: '20px',
                                    paddingLeft: '195px',
                                    paddingBottom: '115px',
                                    textAlign: 'left',
                                }}
                            >
                                베팅한 색깔과 룰렛의 결과가 일치하면 게임
                                승리입니다.
                                <br />
                                게임에 승리하면 베팅한 코인의 2배를 얻습니다.
                            </Container>
                            <div class="wheelContainer">
                                <Wheel
                                    mustStartSpinning={mustSpin}
                                    prizeNumber={prizeNumber}
                                    data={data}
                                    onStopSpinning={() => {
                                        handleStop()
                                        setIsResultVisible(true)
                                        setMustSpin(false)
                                    }}
                                    spinDuration={0.3}
                                    fontSize={'28'}
                                    outerBorderColor={['#f2f2f2']}
                                    outerBorderWidth={[3]}
                                    innerBorderColor={['#f2f2f2']}
                                    radiusLineColor={['#dedede']}
                                    radiusLineWidth={[3]}
                                    backgroundColors={['#F22B35', '#46AEFF']}
                                    radius={100}
                                />
                            </div>
                        </Col>
                        <Col
                            xs="6"
                            className="d-flex flex-column align-items-center justify-content-center"
                        >
                            <Container
                                style={{ color: 'white', fontSize: '14px' }}
                                className="mt-4 pt-4 mb-2"
                            >
                                베팅할 코인 개수
                            </Container>
                            <input
                                className="input"
                                type="number"
                                value={betAmount}
                                onChange={(event) =>
                                    setBetAmount(
                                        event.target.value.replace(/\D/g, '')
                                    )
                                }
                                disabled={mustSpin}
                            />
                            <Container
                                style={{ color: 'white', fontSize: '14px' }}
                                className="mt-4 mb-1"
                            >
                                베팅할 색깔
                            </Container>
                            <Form.Group className="mb-3">
                                <input
                                    className="input-btn"
                                    type="radio"
                                    id="red"
                                    name="betColor"
                                    value="RED"
                                    checked={betColor === 'RED'}
                                    onChange={(event) =>
                                        setBetColor(event.target.value)
                                    }
                                    disabled={mustSpin}
                                    style={{
                                        display: 'none',
                                    }}
                                />
                                <label
                                    className={`neon-btn ${
                                        betColor === 'RED' ? 'active' : ''
                                    }`}
                                    htmlFor="red"
                                >
                                    <span className="span"></span>
                                    <span
                                        className="txt"
                                        style={{
                                            color: 'white',
                                            fontSize: '20px',
                                            fontWeight: '900',
                                        }}
                                    >
                                        🔴RED🔴
                                    </span>
                                </label>
                                <input
                                    className="input-btn"
                                    type="radio"
                                    id="blue"
                                    name="betColor"
                                    value="BLUE"
                                    checked={betColor === 'BLUE'}
                                    onChange={(event) =>
                                        setBetColor(event.target.value)
                                    }
                                    disabled={mustSpin}
                                    style={{
                                        display: 'none',
                                    }}
                                />
                                <label
                                    className={`neon-btn ${
                                        betColor === 'BLUE' ? 'active' : ''
                                    }`}
                                    htmlFor="blue"
                                >
                                    <span className="span"></span>
                                    <span
                                        className="txt"
                                        style={{
                                            color: 'white',
                                            fontSize: '20px',
                                            fontWeight: '900',
                                        }}
                                    >
                                        🔵BLUE🔵
                                    </span>
                                </label>
                            </Form.Group>

                            <Button
                                onClick={handleSpinClick}
                                disabled={mustSpin || !betAmount || !betColor}
                                className="shadow__btn me-3"
                                style={{
                                    fontSize: '15px',
                                    height: '40px',
                                    width: '100px',
                                }}
                            >
                                시작
                            </Button>
                        </Col>
                    </Row>
                    {isResultVisible && (
                        <Modal
                            show={isResultVisible}
                            onHide={() => setIsResultVisible(false)}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>결과</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>{resultMessage}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsResultVisible(false)}
                                >
                                    닫기
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default RouletteForm

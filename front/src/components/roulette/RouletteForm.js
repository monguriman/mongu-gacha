import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheel } from 'react-custom-roulette'
import { DispatchContext, UserStateContext } from '../../App'
import { Card, Col, Row, Modal, Button, Container } from 'react-bootstrap'
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
                            `축하합니다! ${addAmount} 코인을 얻었습니다.`
                        )
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    setResultMessage(`${betAmount} 코인을 잃었습니다.`)
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
                            className="ps-4 mt-5 pt-4 d-flex align-items-center justify-content-center"
                        >
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
                                        backgroundColors={[
                                            '#F22B35',
                                            '#46AEFF',
                                        ]}
                                        radius={100}
                                    />
                                </div>
                        </Col>
                        <Col
                            xs="6"
                            className="d-flex flex-column align-items-center justify-content-center"
                        >
                            <input
                                className="input mb-3"
                                type="number"
                                value={betAmount}
                                onChange={(event) =>
                                    setBetAmount(
                                        event.target.value.replace(/\D/g, '')
                                    )
                                }
                                placeholder="베팅할 코인 개수"
                                disabled={mustSpin}
                            />
                            <select
                                value={betColor}
                                onChange={(event) =>
                                    setBetColor(event.target.value)
                                }
                                placeholder="베팅할 색"
                                disabled={mustSpin}
                            >
                                <option value="">베팅할 색깔</option>
                                <option value="RED">RED</option>
                                <option value="BLUE">BLUE</option>
                            </select>
                            <button
                                onClick={handleSpinClick}
                                disabled={mustSpin || !betAmount || !betColor}
                                className="mt-3"
                            >
                                SPIN
                            </button>
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

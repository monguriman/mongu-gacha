import React, { useState, useEffect, useContext } from 'react'
import { Wheel } from 'react-custom-roulette'
import { DispatchContext } from '../../App'
import { Modal, Button } from 'react-bootstrap'
import * as Api from '../../api'

const data = [{ option: 'RED' }, { option: 'BLUE' }]

function RouletteForm() {
    const dispatch = useContext(DispatchContext)

    const [mustSpin, setMustSpin] = useState(false)
    const [prizeNumber, setPrizeNumber] = useState(0)
    const [betAmount, setBetAmount] = useState('')
    const [betColor, setBetColor] = useState('')
    const [resultMessage, setResultMessage] = useState('')
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [coin, setCoin] = useState(0) // 유저의 보유 코인 상태값 추가

    const handleSpinClick = () => {
        if (!mustSpin && betAmount && betColor) {
            // 유저의 보유 코인과 베팅 금액을 비교하여 코인이 부족한 경우 에러 메시지 표시
            if (parseInt(betAmount) > coin) {
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
            Api.put('user/coin', requestBody)
                .then((res) => {
                    const user = res.data
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
                        Api.put('user/coin', addRequestBody)
                            .then((res) => {
                                const user = res.data
                                dispatch({
                                    type: 'UPDATE_COIN',
                                    payload: user,
                                })
                            })
                            .catch((error) => console.log(error))

                        setResultMessage(
                            `축하합니다! 베팅한 코인의 2배를 얻었습니다. (+${addAmount} 코인)`
                        )
                    } else {
                        setResultMessage('코인을 잃었습니다.')
                    }

                    setMustSpin(false)
                })
                .catch((error) => console.log(error))
        }
    }

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
    }, []) // 컴포넌트가 처음 렌더링될 때만 실행

    useEffect(() => {
        if (isResultVisible) {
            const timeout = setTimeout(() => {
                setIsResultVisible(false)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [isResultVisible])

    return (
        <>
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={() => {
                    setIsResultVisible(true)
                }}
                spinDuration={0.3}
            />
            <input
                type="number"
                value={betAmount}
                onChange={(event) => setBetAmount(event.target.value)}
                placeholder="베팅할 코인 개수"
                disabled={mustSpin}
            />
            <select
                value={betColor}
                onChange={(event) => setBetColor(event.target.value)}
                placeholder="베팅할 색"
                disabled={mustSpin}
            >
                <option value="">색 선택</option>
                <option value="RED">RED</option>
                <option value="BLUE">BLUE</option>
            </select>
            <button
                onClick={handleSpinClick}
                disabled={mustSpin || !betAmount || !betColor}
            >
                SPIN
            </button>
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
        </>
    )
}

export default RouletteForm

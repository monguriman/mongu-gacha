import React, { useState, useEffect, useContext } from 'react'
import { Wheel } from 'react-custom-roulette'
import { DispatchContext, UserStateContext } from '../../App'
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
    const [user, setUser] = useState(null)

    const handleSpinClick = async () => {
        if (!mustSpin && betAmount && betColor) {
            // 유저의 보유 코인과 베팅 금액을 비교하여 코인이 부족한 경우 에러 메시지 표시
            console.log('스타트코인', coin)
            console.log('벳어마운트', betAmount)
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
                setUser(user)
                console.log('코인차감', user)
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
                        //게임에서 이겼다면 베팅한 코인 * 2 의 금액을 코인에 Add한다
                        const res = await Api.put('user/coin', addRequestBody)
                        const user = res.data
                        console.log('이겨서 유저 설정함', user)
                        setUser(user)
                        setResultMessage(
                            `축하합니다! 베팅한 코인의 2배인 ${betAmount*2} 코인을 얻었습니다.`
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
        setIsResultVisible(false)
    }, [betAmount, betColor])

    useEffect(() => {
        console.log(mustSpin)
    }, [mustSpin])

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
        <>
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={() => {
                    handleStop()
                    setIsResultVisible(true)
                    setMustSpin(false)
                }}
                spinDuration={0.2}
            />
            <input
                type="number"
                value={betAmount}
                onChange={(event) =>
                    setBetAmount(event.target.value.replace(/\D/g, ''))
                }
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

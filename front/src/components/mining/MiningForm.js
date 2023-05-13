import React, { useState, useEffect, useContext } from 'react'
import { UserStateContext, DispatchContext } from '../../App';

import * as Api from '../../api'
import { Container, Card, Image } from 'react-bootstrap'
import mining_1 from '../../images/mining_1.png'
import mining_2 from '../../images/mining_2.png'
import '../../styles/MiningForm.css'

function MiningForm() {
    const userState = useContext(UserStateContext);
    const dispatch = useContext(DispatchContext);

    const [coin, setCoin] = useState(null)
    const [imageNumber, setImageNumber] = useState(1)
    const [shimmer, setShimmer] = useState(false)
    const [criticalText, setCriticalText] = useState(false)
    const [addText, setAddText] = useState(false)

    const handleAddCoin = async () => {
        try {
            const isCritical = Math.random() < 0.05 // 5% 확률로 true
            const amount = isCritical ? 10 : 1;
            const response = await Api.put('user/coin', {
                amount,
                operation: 'add',
            })
            setCoin(response.data.coin);
            dispatch({ type: 'UPDATE_COIN', coin: response.data.coin });
            setImageNumber((prevImageNumber) => (prevImageNumber === 1 ? 2 : 1))
            setShimmer(true) // 반짝임 활성화
            setTimeout(() => {
                setShimmer(false) // 반짝임 비활성화
            }, 250)
            setAddText(true) // +1 텍스트 표시 활성화
            setTimeout(() => {
                setAddText(false) // +1 텍스트 표시 비활성화
            }, 250)

            if (isCritical) {
                setCriticalText(true)
                setTimeout(() => {
                    setCriticalText(false)
                }, 250)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleDeductCoin = async () => {
        try {
            const response = await Api.put('coin', {
                amount: 1,
                operation: 'deduct',
            })
            setCoin(response.data.coin)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const fetchCurrentUserCoin = async () => {
            try {
                const response = await Api.get('user/current')
                setCoin(response.data.coin)
            } catch (error) {
                console.error(error)
            }
        }
        fetchCurrentUserCoin()
    }, [])

    if (coin === null) {
        return <div>Loading...</div>
    }

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Card style={{ width: '360px' }} className="text-center">
                <Card.Body>
                    <div ontouchstart="">
                        <button
                            className="miningButton"
                            onMouseDown={handleAddCoin}
                        >
                            <a>채굴</a>
                        </button>
                    </div>
                    <br />
                    <span
                        className={`coin-text ${
                            shimmer ? 'shimmer-animation' : ''
                        }`}
                    >
                        코인 {coin}
                    </span>
                    <br />
                    <br />
                    {criticalText ? (
                        <div className="critical-text">Critical! +10</div>
                    ) : addText ? (
                        <div className="add-text">+1</div>
                    ) : (
                        <div>　</div>
                    )}
                    {imageNumber === 1 ? (
                        <Image src={mining_1} alt="Image 1" width="50%" fluid />
                    ) : (
                        <Image src={mining_2} alt="Image 2" width="50%" fluid />
                    )} 
                    <div style={{ fontSize:'11px'}}>
                        * 채굴 버튼 1회당 1개의 코인을 얻을 수 있습니다. <br />* 5%의 확률로 10개의 코인을 얻을 수 있는 크리티컬이 발생합니다.
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default MiningForm

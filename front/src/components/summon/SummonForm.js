import React, { useContext, useState, useEffect } from 'react'
import * as Api from '../../api'
import { Container, Button, Modal } from 'react-bootstrap'
import { UserStateContext, DispatchContext } from '../../App'
import '../../styles/SummonForm.css'

import images from '../../images/imageIndex'

function SummonForm() {
    const dispatch = useContext(DispatchContext)
    const userState = useContext(UserStateContext)
    const [modalShow, setModalShow] = useState(false)
    const [drewCard, setDrewCard] = useState(null)
    const [userCards, setUserCards] = useState([]) // 기존 카드 정보를 담을 상태 추가

    const {
        card_1,
        card_2,
        card_3,
        card_4,
        card_5,
        card_6,
        card_7,
        card_8,
        card_9,
        card_10,
        card_11,
        card_12,
        card_13,
        card_14,
        card_15,
        card_16,
        card_17,
        card_18,
        card_19,
        card_20,
        card_21,
        card_22,
        card_23,
        card_24,
        card_25,
        card_26,
        card_27,
        card_28,
        card_29,
        card_30,
    } = images

    useEffect(() => {
        fetchUserCards() // 컴포넌트가 마운트될 때 기존 카드 정보 가져오기
    }, [drewCard])

    // 유저의 기존 카드 정보를 가져오는 비동기 함수
    const fetchUserCards = async () => {
        try {
            const response = await Api.get('collection')
            setUserCards(response.data.card)
        } catch (error) {
            console.error('Error fetching userCards:', error)
        }
    }

    const handleSummon = async () => {
        try {
            const response = await Api.put(`user/summon`)
            const card = response.data
            setDrewCard(card)
            setModalShow(true)

            const userData = await Api.get('user/current')
            const user = userData.data
            dispatch({
                type: 'UPDATE_COIN',
                payload: user,
            })
        } catch (err) {
            if (err.response.status === 400) {
                alert(err.response.data.error)
            }
            console.log(err.response)
            console.log('코인이 부족합니다.', err)
        }
    }

    const getCardImage = (cardNumber) => {
        // 카드 번호에 해당하는 이미지 경로를 가져옴
        return images[`card_${cardNumber}`]
    }

    const renderModalContent = () => {
        if (drewCard) {
            // 새로 뽑은 카드의 카드 번호
            const newCardNumber = drewCard.cardNumber

            // 기존 카드 목록에 새로 뽑은 카드 번호가 포함되어 있는지 확인
            const isExistingCard = userCards.some(
                (card) => card.cardNumber === newCardNumber
            )

            // 모달 내용 렌더링
            return (
                <div className="modal-card-reveal-animation">
                    <p>카드번호: {drewCard.cardNumber}</p>
                    <p>희귀도: {drewCard.cardRarity}</p>
                    <img
                        src={getCardImage(drewCard.cardNumber)}
                        alt={`Card ${drewCard.cardNumber}`}
                        style={{
                            scale: '0.7',
                            borderRadius: '15px',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                    {isExistingCard ? (
                        <p>이미 가지고 있는 카드입니다.</p>
                    ) : (
                        <p>새로운 카드입니다!!!</p>
                    )}
                </div>
            )
        }

        return null
    }

    return (
        <Container>
            <Button className="summon-button" onClick={handleSummon}>
                소환
            </Button>

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>다음 카드를 획득했습니다!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {renderModalContent()}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setModalShow(false)}
                    >
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default SummonForm

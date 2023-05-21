import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Api from '../../api'
import { Container, Button, Modal, Card, Row, Image } from 'react-bootstrap'
import { UserStateContext, DispatchContext } from '../../App'
import '../../styles/SummonForm.css'
import images from '../../images/imageIndex'
import cardFrames from '../../images/cardFrames'

function SummonForm() {
    const dispatch = useContext(DispatchContext)
    const userState = useContext(UserStateContext)
    const [modalShow, setModalShow] = useState(false)
    const [drewCard, setDrewCard] = useState(null)
    const [userCards, setUserCards] = useState([])
    const navigate = useNavigate()

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
        fetchUserCards()
    }, [drewCard])

    useEffect(() => { 
        console.log(userState.user)
          // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
          if (!userState.user) {
              navigate('/login', { replace: true })
              return
          }
      }, [userState])

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
            } else {
                console.log('코인이 부족합니다.', err)
            }
        }
    }

    const handleSummonEleven = async () => {
        try {
            const response = await Api.put('user/summonEleven')
            const cards = response.data
            setDrewCard(cards[cards.length - 1])
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
            } else {
                console.log('코인이 부족합니다.', err)
            }
        }
    }

    const getCardImage = (cardNumber) => {
        return images[`card_${cardNumber}`]
    }

    const renderModalContent = () => {
        if (drewCard) {
            const newCardNumber = drewCard.cardNumber
            const isExistingCard = userCards.some(
                (card) => card.cardNumber === newCardNumber
            )

            return (
                <>
                    <Card
                        style={{
                            backgroundImage: `url(${getCardImage(
                                drewCard.cardNumber
                            )})`,
                            width: '18rem',
                            height: '21.46rem',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <Card.Body>
                            <Row className="justify-content-md-center">
                                <div className={`card-image`}>
                                    <Image
                                        src={
                                            cardFrames[
                                                `cardFrame${drewCard.cardRarity}`
                                            ]
                                        }
                                        alt={`Card Image`}
                                        fluid
                                        className={``}
                                        style={{
                                            scale: '1.26',
                                            borderRadius: '0px',
                                            marginTop: '17.5px',
                                        }}
                                    />
                                    <div
                                        className="card-info"
                                        style={{
                                            position: 'absolute', // Add position absolute to overlay the text
                                            top: '5%', // Position the text in the middle vertically
                                            left: '5.5%', // Position the text in the middle horizontally
                                            transform: 'translate(-50%, -50%)', // Center the text
                                            color: 'white', // Set the text color to white
                                            textAlign: 'left', // Center align the text
                                            fontStyle: 'italic',
                                            fontWeight: '900',
                                            fontSize: '1.4rem',
                                        }}
                                    >
                                        <p>{drewCard.cardNumber}</p>
                                    </div>
                                    <div
                                        className="card-info"
                                        style={{
                                            position: 'absolute', // Add position absolute to overlay the text
                                            top: '85%', // Position the text in the middle vertically
                                            right: '8%', // Position the text in the middle horizontally
                                            color: 'white', // Set the text color to white
                                            textAlign: 'left', // Center align the text
                                            fontWeight: '300',
                                        }}
                                    ></div>
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                    <div className="modal-card-reveal-animation mt-5">
                        {isExistingCard ? (
                            <p>이미 가지고 있는 카드입니다.</p>
                        ) : (
                            <p>새로운 카드입니다!!!</p>
                        )}
                    </div>
                </>
            )
        }
        return null
    }

    return (
        <Container>
            <Button
                className="summon-button"
                onClick={handleSummon}
                disabled={userState.coin < 30}
            >
                소환
            </Button>
            <div>　</div>
            <Button
                className="summon-button"
                onClick={handleSummonEleven}
                disabled={userState.coin < 300}
            >
                11연속 소환
            </Button>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                className="text-center"
            >
                <Modal.Header closeButton>
                    <Modal.Title>다음 카드를 획득했습니다!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-center">
                        {renderModalContent()}
                    </Row>
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

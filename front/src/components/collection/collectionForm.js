import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserStateContext } from '../../App'
import * as Api from '../../api'
import { Container, Card, Row, Image, Modal, Button } from 'react-bootstrap'
import '../../styles/CollectionForm.css'
import images from '../../images/imageIndex'
import cardFrames from '../../images/cardFrames'

function CollectionForm() {
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

    const userState = useContext(UserStateContext)
    const navigate = useNavigate()

    const getCardCount = (cardNumber) => {
        return userCards.filter((card) => card.cardNumber === cardNumber).length
    }

    const [totalCards, setTotalCards] = useState([])
    const [userCards, setUserCards] = useState([])
    const [showCongratsModal, setShowCongratsModal] = useState(false)

    useEffect(() => {
        // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
        if (!userState.user) {
            alert('로그인 후 사용가능한 메뉴입니다.')
            navigate('/login', { replace: true })
            return
        }
    }, [userState])

    useEffect(() => {
        // totalCard 정보를 가져오는 비동기 함수
        const fetchTotalCards = async () => {
            try {
                const response = await Api.get('totalCard')
                setTotalCards(response.data)
            } catch (error) {
                console.error('Error fetching totalCards:', error)
            }
        }

        // 유저의 카드 정보를 가져오는 비동기 함수
        const fetchUserCards = async () => {
            try {
                const response = await Api.get('collection')
                setUserCards(response.data.card)
            } catch (error) {
                console.error('Error fetching userCards:', error)
            }
        }

        fetchTotalCards()
        fetchUserCards()
    }, [])

    useEffect(() => {
        const completionPercentage = calculateCompletionPercentage()
        if (completionPercentage == 100.0) {
            setShowCongratsModal(true)
        }
    }, [userCards])

    // totalCardNumber를 기준으로 정렬하는 함수
    const sortByTotalCardNumber = (cards) => {
        return cards.sort((a, b) => a.totalCardNumber - b.totalCardNumber)
    }

    // 카드가 보유 중인지 확인하는 함수
    const isCardOwned = (cardNumber) => {
        return userCards.some((card) => card.cardNumber === cardNumber)
    }

    // 정렬된 카드 목록을 출력하는 함수
    const renderSortedCards = () => {
        const sortedCards = sortByTotalCardNumber(totalCards)
        return sortedCards.map((card) => {
            const cardImage = images[`card_${card.totalCardNumber}`]
            const cardFrame = cardFrames[`cardFrame${card.rarity}`] // Get the appropriate card frame based on card rarity

            return (
                <Card
                    className={`mb-5 mt-3 ms-5 mr-5`}
                    style={{
                        position: 'relative',
                        width: '18rem',
                        height: '21.46rem',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundImage: `url(${cardImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: isCardOwned(card.totalCardNumber)
                            ? ''
                            : 'grayscale(100%) blur(10px)',
                        transition: 'transform 0.3s',
                    }}
                    key={card.totalCardNumber}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundSize = '110%' // Apply background image zoom when mouse enters
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundSize = 'cover' // Reset background image size when mouse leaves
                    }}
                >
                    <Card.Body>
                        <Row className="justify-content-md-center">
                            <div className={`card-image`}>
                                <Image
                                    src={cardFrame}
                                    alt={`Image ${card.totalCardNumber}`}
                                    fluid
                                    className={``}
                                    style={{
                                        scale: '1.255',
                                        borderRadius: '0px',
                                        marginTop: '18px',
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
                                    <p>{card.totalCardNumber}</p>
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
                                >
                                    <p>
                                        {isCardOwned(card.totalCardNumber) && (
                                            <a>
                                                ×{' '}
                                                {getCardCount(
                                                    card.totalCardNumber
                                                )}
                                            </a>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            )
        })
    }

    //도감 완성도 계산
    const calculateCompletionPercentage = () => {
        const ownedCardNumbers = Array.from(
            new Set(userCards.map((card) => card.cardNumber))
        )
        const ownedCardsCount = ownedCardNumbers.length
        const totalCardsCount = totalCards.length
        const percentage = (ownedCardsCount / totalCardsCount) * 100
        return percentage.toFixed(2) // Round the percentage to 2 decimal places
    }

    return (
        <>
            <h2
                className="text-center mt-5 mb-4"
                style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
            >
                나의 도감
            </h2>
            <h3
                className="text-center completion-percentage"
                style={{
                    color: 'pink',
                    fontSize: '24px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
            >
                도감 완성도: {calculateCompletionPercentage()}%
            </h3>

            <Container fluid className="pt-4">
                <Row xs="auto" className="justify-content-center">
                    {renderSortedCards()}
                </Row>
            </Container>
            <Modal
                show={showCongratsModal}
                onHide={() => setShowCongratsModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>축하합니다!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>도감을 100% 완성하셨습니다!</p>
                    <p>당신의 앞날에 행운만 가득하길☘️</p>
                    <p>플레이 해주셔서 감사합니다.</p>
                    <p>몽구 드림</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCongratsModal(false)}
                    >
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CollectionForm

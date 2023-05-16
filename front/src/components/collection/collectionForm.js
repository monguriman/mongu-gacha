import React, { useState, useEffect, useContext } from 'react'

import * as Api from '../../api'
import { Container, Card, Row, Image } from 'react-bootstrap'
import '../../styles/CollectionForm.css'
import images from '../../images/imageIndex'

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

    const getCardCount = (cardNumber) => {
        return userCards.filter((card) => card.cardNumber === cardNumber).length
    }

    const [totalCards, setTotalCards] = useState([])
    const [userCards, setUserCards] = useState([])

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
            // Get the corresponding card image based on card number
            const cardImage = images[`card_${card.totalCardNumber}`]

            return (
                <Card
                    className={`mb-5 ms-5 mr-5 ${
                        isCardOwned(card.totalCardNumber)
                            ? 'owned'
                            : 'not-owned'
                    }`}
                    style={{
                        width: '18rem',
                        height: '28rem',
                        borderRadius: '18px',
                    }}
                    key={card.totalCardNumber}
                >
                    <Card.Body>
                        <Row className="justify-content-md-center">
                            <div className="card-info">
                                <p>카드 번호: {card.totalCardNumber}</p>
                                <p>등급: {card.rarity}</p>
                                <p style={{marginBottom:'10px'}}>
                                    {isCardOwned(card.totalCardNumber) && (
                                        <a>
                                            {getCardCount(card.totalCardNumber)}
                                            장 보유중
                                        </a>
                                    )}<a>　</a>
                                </p>
                            </div>
                            <div
                                className={`card-image ${
                                    isCardOwned(card.totalCardNumber)
                                        ? ''
                                        : 'not-owned'
                                }`}
                            >
                                <Image
                                    src={cardImage}
                                    alt={`Image ${card.totalCardNumber}`}
                                    fluid
                                    className={`${
                                        isCardOwned(card.totalCardNumber)
                                            ? ''
                                            : 'not-owned'
                                    }`}
                                    style={{ borderRadius: '15px' }}
                                />
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            )
        })
    }

    return (
        <>
            <h2 className="text-center mt-5 mb-4">나의 도감</h2>
            <Container fluid className="pt-4">
                <Row xs="auto" className="justify-content-center">
                    {renderSortedCards()}
                </Row>
            </Container>
        </>
    )
}

export default CollectionForm

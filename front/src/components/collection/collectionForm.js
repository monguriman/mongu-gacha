import React, { useState, useEffect, useContext } from 'react'
import { DispatchContext } from '../../App'

import * as Api from '../../api'
import { Container, Card, Image, Row } from 'react-bootstrap'
import '../../styles/MiningForm.css'

function CollectionForm() {
    const [totalCards, setTotalCards] = useState([])
    const [userCards, setUserCards] = useState([])

    useEffect(() => {
        // totalCard 정보를 가져오는 비동기 함수
        const fetchTotalCards = async () => {
            try {
                const response = await Api.get('totalCard')
                console.log('토탈카드', response.data)
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
        return sortedCards.map((card) => (
            <Card className="mb-5 ms-5 mr-5" style={{ width: '18rem', height: '10rem', borderRadius: '18px' }}>
                <Card.Body>
                <Row className="justify-content-md-center">
                <p>
                    카드 번호: {card.totalCardNumber} <br />
                    등급: {card.rarity}
                </p>
                {isCardOwned(card.totalCardNumber) && <p>보유중</p>}
                </Row>
                </Card.Body>
            </Card>
        ))
    }

    return (
        <>
        <h2>Total Cards</h2>
        <Container fluid className="pt-4">
            <Row xs="auto" className="justify-content-center">
                {renderSortedCards()}
            </Row>
        </Container>
        </>
    )
}

export default CollectionForm

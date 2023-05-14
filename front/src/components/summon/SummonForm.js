import React, { useContext, useState } from 'react'
import * as Api from '../../api'
import { Container, Button, Modal } from 'react-bootstrap'
import { UserStateContext, DispatchContext } from '../../App'

function SummonForm() {
    const dispatch = useContext(DispatchContext);
    const userState = useContext(UserStateContext)
    const [modalShow, setModalShow] = useState(false)
    const [drewCard, setDrewCard] = useState(null)

    const handleSummon = async () => {
        try {
            const response = await Api.put(`user/summon`)
            const card = response.data
            setDrewCard(card)
            setModalShow(true)

            const userData = await Api.get('user/current');
            const user = userData.data;
            dispatch({
                type: 'UPDATE_COIN',
                payload: user
            })

        } catch (err) {
            if (err.response.status === 400) {
                alert(err.response.data.error)
            }
            console.log(err.response);
            console.log('코인이 부족합니다.', err)
        }
    }

    return (
        <Container style={{ fontSize: '80px', color: 'white' }}>
            <Button onClick={handleSummon}>소환</Button>

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>다음 카드를 획득했습니다!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {drewCard && (
                        <div>
                            <p>카드번호 : {drewCard.cardNumber}</p>
                            <p>희귀도 : {drewCard.cardRarity}</p>
                        </div>
                    )}
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

import React, { useState, useEffect } from "react";
import * as Api from "../../api";
import { Button, Container, Row, Col, Card, Image } from 'react-bootstrap';
import mining_1 from '../../images/mining_1.png';
import mining_2 from '../../images/mining_2.png';
import '../../styles/MiningForm.css';

function MiningForm() {
  const [coin, setCoin] = useState(null);
  const [imageNumber, setImageNumber] = useState(1);
  const [shimmer, setShimmer] = useState(false);
  const [criticalText, setCriticalText] = useState(false);

  const handleAddCoin = async () => {
    try {
      const response = await Api.put("coin", {
        amount: 1,
        operation: "add",
      });
      setCoin(response.data.coin);
      setImageNumber((prevImageNumber) => (prevImageNumber === 1 ? 2 : 1));
      setShimmer(true); // 반짝임 활성화
      setTimeout(() => {
        setShimmer(false); // 반짝임 비활성화
      }, 250);

      // 5% 확률로 코인 10개 증가 및 "Critical!" 표시
      if (Math.random() < 0.05) {
        setCoin((prevCoin) => prevCoin + 9);
        setCriticalText(true);
        setTimeout(() => {
          setCriticalText(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeductCoin = async () => {
    try {
      const response = await Api.put("coin", {
        amount: 1,
        operation: "deduct",
      });
      setCoin(response.data.coin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCurrentUserCoin = async () => {
      try {
        const response = await Api.get("user/current");
        setCoin(response.data.coin);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentUserCoin();
  }, []);

  if (coin === null) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#B89E97" }}
    >
      <Card style={{ width: "360px" }} className="text-center">
        <Card.Body>
          <div ontouchstart="">
            <div className='button' onMouseDown={handleAddCoin}>
              <a>채굴</a>
            </div>
          </div>
          <br />
          <span className={`coin-text ${shimmer ? "shimmer-animation" : ""}`}>
            코인 {coin}
          </span>
          <br />
          <br />
          {criticalText ? <div className="critical-text">Critical! +10</div> : <div>　</div>}
          {imageNumber === 1 ? (
            <Image src={mining_1} alt="Image 1" width="50%" fluid />
          ) : (
            <Image src={mining_2} alt="Image 2" width="50%" fluid />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MiningForm;

import React, { useState, useEffect } from "react";
import * as Api from "../../api";
import mining_1 from '../../images/mining_1.png';
import mining_2 from '../../images/mining_2.png';

function MiningForm() {
  const [coin, setCoin] = useState(null);
  const [imageNumber, setImageNumber] = useState(1);

  const handleAddCoin = async () => {
    try {
      const response = await Api.put("coin", {
        amount: 1,
        operation: "add",
      });
      setCoin(response.data.coin);
      setImageNumber(prevImageNumber => prevImageNumber === 1 ?  2 : 1); // 이미지 번호를 교대로 변경
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
    <>
      <button type='button' onMouseDown={handleAddCoin}>+</button>
      <br />
      <button type='button' onMouseDown={handleDeductCoin}>-</button>
      <br />
      <span>코인: {coin}</span>
      {imageNumber === 1 ? <img src={mining_1} alt="Image 1" width='50%' /> : <img src={mining_2} alt="Image 2" width='50%' />}
    </>
  );
}

export default MiningForm;
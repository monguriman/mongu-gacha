import React, { useState, useEffect } from "react";
import * as Api from "../../api";

function MiningForm() {
  const [coin, setCoin] = useState(null);
  const [isImageVisible, setIsImageVisible] = useState(false);

  const handleAddCoin = async () => {
    try {
      const response = await Api.put("coin", {
        amount: 1,
        operation: "add",
      });
      setCoin(response.data.coin);
      setIsImageVisible(!isImageVisible);
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
      {isImageVisible && (
        <>
          <img src="../../images/digging_1.png" alt="Image 1" />
          <img src="image2.jpg" alt="Image 2" />
        </>
      )}
    </>
  );
}

export default MiningForm;
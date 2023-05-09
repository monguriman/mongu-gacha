import React, { useState, useEffect } from "react";
import * as Api from "../../api";

function MiningForm({ portfolioOwnerId, isEditable }) {

  // useState 훅을 통해 user 상태를 생성함.
  const [user, setUser] = useState(null);

  useEffect(() => {
    // "users/유저id" 엔드포인트로 GET 요청을 하고, user를 response의 data로 세팅함.
    Api.get("users", portfolioOwnerId).then((res) => setUser(res.data));
  }, [portfolioOwnerId]);

  return (
    <>
        <button>+</button>
        <br />
        <button>-</button>
    </>
  );
}

export default MiningForm;

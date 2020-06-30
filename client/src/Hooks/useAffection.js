import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useAffection = (productId) => {
  const { userDataState } = useSelector((state) => state);

  const {userData} = userDataState

  const [affectionate, setAffectionate] = useState(false);

  useEffect(() => {
    const found = ()=>userData.reviewed?.map((review) => {
      if (review.productId === productId) {
        setAffectionate(true);
      }
    });
    found()
  }, [affectionate, userData.reviewed, productId]);

  const postAffection = payload => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
          providerId: payload,
          productId: productId
      }),
      redirect: "follow",
    };

    return fetch("/api/product/review/", options)
      .then((res) => {
        if (res.ok) {
          setAffectionate(true);
        } else if (!res.ok) {
          setAffectionate(false);
        }
      })
      .catch((err) => {
        setAffectionate(false);
      });
  };

  return [affectionate, postAffection]
};

export default useAffection
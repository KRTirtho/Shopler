import { useState } from "react";

/**
 * @returns [affection: Boolean, controlAffection: func]
 * @function controlAffection 
 * @params {productId: String, providerId: String, type: <URL_Params>:String /add{1}?remove{1}?/} 
 * @author KR.Tirtho
 * @copyright MIT 2020
  */

const useAffection = () => {
  const [affection, setAffection] = useState('');


  const controlAffection = ({ productId, providerId, type }) => {

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        providerId: providerId,
        productId: productId,
      }),
      redirect: "follow",
    };

    const URL = `/api/product/review?${
      type === "add" ? "add=true" : "remove=true"
    }`;

    return fetch(URL, options)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        if (json.affection === true) {
          setAffection(true);
        } else if (json.affection === false) {
          setAffection(false);
        }
      })
      .catch((err) => {
        console.error("Failed to connect to: ", URL);
      });
  };
  return [affection, controlAffection]
};

export default useAffection;

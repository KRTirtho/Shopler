import { useState } from "react";

/**
 * @author KR.Tirtho 
 * @version 0.0.1
 * @summary This is a product for good uses only the author of this library
    will not occupy for any sort of illegal circumstances. The user will be responsible for their 
    whatever use case.
 * @param options: <Object> @var { cleanUp: boolean, usePopUp: boolean}
 * @returns [request:func, data: object, success: boolean, error: boolean, resStatus: number, resStatusCode: string, popUp: JSX]
 * @function request @param {body: object,
headers: JSON_Object, method: string, useFormData: boolean, useResponse: boolean }
 */

export default function useFetchP3D(options = {}) {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [resStatus, setResStatus] = useState("");
  const [resStatusText, setResStatusText] = useState("");

  const request = (url, fetchOption) => {
    const { method, body, headers, useFormData, useResponse, } = fetchOption;
    const option = {
      method: method ? method : "POST",
      body:
      body && !useFormData
      ? JSON.stringify(body)
      : body && useFormData === true
      ? body
      : undefined,
      headers: !useFormData || useFormData === false? headers: undefined,
      redirect: "follow"
    };
    
    // if ((headers && useFormData === undefined) || useFormData===false) {
    //   option.headers = headers;
    // }
    
    if (typeof options === "object") {
      return fetch(url, option)
      .then((res) => {
        if (!res.ok) {
          setSuccess(false);
          setError(true);
        } else if (res.status >= 200 && res.status <= 350) {
          setResStatus(res.status);
          setResStatusText(res.statusText);
          setError(false);
          setSuccess(true);
        }
        return res.json();
      })
      .then((json) => {
        if (
          useResponse !== undefined &&
          useResponse === true &&
          (json || json.length > 0)
          ) {
            setData(json);
            setSuccess(true);
            setError(false);
          } else if (
            useResponse !== undefined &&
            useResponse === true &&
            (!json || json.length === 0)
            ) {
              setSuccess(false);
              setError(true);
            }
          })
          .catch((err) => {
            setSuccess(false);
            setError(true);
            console.error("failed to fetch: " + err);
        });
      } else {
        throw new TypeError('"Options" should be a type of object');
      }
    };

    return [request, data, success, error, resStatus, resStatusText];
  }
/**
 * @license MIT
 */

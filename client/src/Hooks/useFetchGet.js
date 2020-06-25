import { useState, useEffect } from "react";

/**
 * @version 0.0.1
 * @returns  [request : function,data : object, loading : boolean, error : boolean] 
 * @request > @param url: URL, signal: boolean
 * @summary This is a product for good uses only the author of this library
 will not occupy for any sort of illegal circumstances. The user will be responsible for their 
 whatever use case.
 * @author KR.Tirtho 
 */

export default function useFetchGet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

/**
 * @fetch from the (url)
 * @json Data is assigning into [data] 
 * @loading for loaders
 * @error for error handling
 */
const fetchGET = (url, signal) => {
  if (!url)
    console.error(
      "No url argument passed-in in useFetchGet. Pass an url as argument for fetching data from that URL"
    );
    return fetch(url, {signal: signal})
      .then((res) => {
        setLoading(true);
        setError(false);
        if (!res.ok) {
          setLoading(false);
          setError(true);
        }
        return res.json();
      })
      .then((json) => {
        if (json || json.length > 0) {
          setData(json);
          setLoading(false);
          setError(false);
        } else if (!json || json.length === 0) {
          setLoading(false);
          setError(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.error("failed to fetch: " + err);
      });
  };

  return [fetchGET, data, loading, error] ;
}

/**
 * @license MIT@2020  
 */
import { useEffect } from "react";

function useOnClickOutSide(events ,ref, handler){
  
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    events.map(event=>{
      return document.addEventListener(event, listener);
    })
    return () => {
      events.map(event=>{
        return document.removeEventListener(event, listener);
      })
    };
  }, [ref, handler, events]);
}

export default useOnClickOutSide;

/**
 * @params ([event], ref: DOMNode, callback: func)
  */
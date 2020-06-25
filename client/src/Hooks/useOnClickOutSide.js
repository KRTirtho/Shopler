import { useEffect } from "react";

function useOnClickOutSide(on ,ref, handler){
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    on.forEach(event=>{
      document.addEventListener(event, listener);
    })
    return () => {
      on.forEach(event=>{
        document.removeEventListener(event, listener);
      })
    };
  }, [ref, handler]);
}

export default useOnClickOutSide;

/**
 * @params ([event], ref: DOMNode, callback: func)
  */
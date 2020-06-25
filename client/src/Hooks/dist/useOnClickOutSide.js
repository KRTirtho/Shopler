"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useOnClickOutSide(ref, handler) {
    var on = function (event) { return event; };
    react_1.useEffect(function () {
        var listener = function (event) {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        on().forEach(function (event) {
            document.addEventListener(event, listener);
        });
        return function () {
            on().forEach(function (event) {
                document.removeEventListener(event, listener);
            });
        };
    }, [ref, handler]);
    return { on: on };
}
exports["default"] = useOnClickOutSide;
/**
 * @params ([event], ref: DOMNode, callback: func)
  */ 

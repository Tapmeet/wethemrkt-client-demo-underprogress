import React, { useEffect } from 'react';
import HorizontalLayout from "components/HorizontalLayout"
const BoardToken = '7c02dcb6-2fee-767d-5f88-67aca82ac056';

const Feedback = () => {
  useEffect(() => {
    (function (w, d, i, s) { function l() { if (!d.getElementById(i)) { var f = d.getElementsByTagName(s)[0], e = d.createElement(s); e.type = "text/javascript", e.async = !0, e.src = "https://canny.io/sdk.js", f.parentNode.insertBefore(e, f) } } if ("function" != typeof w.Canny) { var c = function () { c.q.push(arguments) }; c.q = [], w.Canny = c, "complete" === d.readyState ? l() : w.attachEvent ? w.attachEvent("onload", l) : w.addEventListener("load", l, !1) } })(window, document, "canny-jssdk", "script");

    Canny('render', {
      boardToken: BoardToken,
      basePath: null, // See step 2
      ssoToken: null, // See step 3,
      theme: 'light', // options: light [default], dark, auto
    });
  }, []);

  return (
    <HorizontalLayout>
      <div data-canny />
    </HorizontalLayout>
  );
}

export default Feedback;
import React from "react";

// Main Window.
let browser = null;
// child window.
let popup = null;
// interval
let timer = null;

// This function is what the name says.
// it checks whether the popup still open or not
function watcher() {
  // if popup is null then let's clean the intervals.
  if (popup === null) {
    clearInterval(timer);
    timer = null;
    // if popup is not null and it is not closed, then let's set the focus on it... maybe...
  } else if (popup !== null && !popup.closed) {
    popup.focus();
    // if popup is closed, then let's clean errthing.
  } else if (popup !== null && popup.closed) {
    clearInterval(timer);
    browser.focus();
    timer = null;
    popup = null;
  }
}

const PopUp = ({children, url}) => {
  // browser is set to current window
  browser = window.self;

  const onClickHandler = (evt) => {
    // if there is  already a child open, let's set focus on it
    if (popup && !popup.closed) {
      popup.focus();
      return;
    }

    const name = "Panorama Viewer";
    const opts = `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=${300}, height=${300}`;

    // we open a new window.
    popup = browser.open(url, name, opts);
    return;
  };

  if (timer === null) {
    // each two seconds we check if the popup still open or not
    timer = setInterval(watcher, 2000);
  }
  return (
    <a onClick={onClickHandler}>
      {children}
    </a>
  );
};

export default PopUp;

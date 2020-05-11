import axios from "../store/axios";

window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error("Pushed new error to log", error);
  axios.post("/_/pushlog", {
    msg: "Unexpected client error: " + msg,
    stack: JSON.stringify(error)
  });
  return true;
};

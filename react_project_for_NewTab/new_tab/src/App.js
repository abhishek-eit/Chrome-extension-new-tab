import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  let [_loading, setLoading] = useState(true);
  let [_bg, setBg] = useState("");
  let [_quote, setQuote] = useState("");
  let [_user, setUser] = useState("");
  let clockRef = useRef(null);
  let dateRef = useRef(null);

  let updateClock = () => {
    var time = new Date();
    var Hour = time.getHours() % 12 ? time.getHours() % 12 : 12;
    var Minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var Meridiem = time.getHours() < 12 ? "AM" : "PM";
    clockRef.current.children[0].innerHTML = Hour;
    clockRef.current.children[1].innerHTML = ":";
    clockRef.current.children[2].innerHTML = Minute;
    clockRef.current.children[3].innerHTML = Meridiem;

    dateRef.current.innerHTML = new Date().toDateString();
  };

  useEffect(() => {
    let fetchData = async () => {
      let bg_image = Cookies.get("bg_image");
      if (bg_image) {
        setBg(bg_image);
      } else {
        const unsplashRes = await axios.get(
          `https://api.unsplash.com/photos/random/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}&query=nature&orientation=landscape`
        );
        if (unsplashRes.status === 200) {
          // console.log(unsplashRes.data);
          Cookies.set("bg_image", unsplashRes.data.urls.full, { expires: 1 });
          setBg(unsplashRes.data.urls.full);
        }
      }

      updateClock();
      setTimeout(updateClock, 1000);

      let quote = Cookies.get("quote");
      if (quote) {
        setQuote(JSON.parse(quote));
      } else {
        const quoteRes = await axios.get(`https://api.quotable.io/random`);
        if (quoteRes.status === 200) {
          console.log(quoteRes.data);
          Cookies.set("quote", JSON.stringify(quoteRes.data), { expires: 1 });
          setQuote(quoteRes.data);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {/* Section For Background */}
      <div
        className="background"
        style={{
          backgroundImage: _bg
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${_bg}')`
            : `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${process.env.PUBLIC_URL}/assets/images/default_bg.jpeg')`,
          visibility: _loading ? "hidden" : "visible",
        }}
      >
        <div className="layout h-100 w-100 d-flex flex-column">
          <div className="header-layout h-25"></div>

          <div className="main-layout h-50">
            {/*Section For Date */}
            <div className="date text-center" ref={dateRef}></div>
            {/*Section For Clock */}
            <div className="clock d-flex justify-content-center align-items-baseline" ref={clockRef}>
              <div className="hour"></div>
              <div className="colon"></div>
              <div className="minute"></div>
              <div className="ps-2 meridiem"></div>
            </div>

            {/* Section For Greetings */}
            <div className="greetings">Good Afternoon, Abhishek</div>

            {/* Section For News */}
            <div className="center-tooltip-area"></div>
          </div>

          <div className="footer-layout h-25 d-flex flex-column">
            {/* Section For quote */}
            <div
              className="quote p-3"
              style={{
                visibility: _loading || !_quote ? "hidden" : "visible",
                textAlign: "center",
                flexGrow: 1,
              }}
            >
              <div className="quote-content">{_quote.content}</div>
              <div className="quote-author"> ~ {_quote.author}</div>
            </div>
            {/* Section For Footer */}
            <div className="footer d-flex justify-content-around align-items-center">
              <div className="footer-item">News</div>
              <div className="footer-item">Reminders</div>
              <div className="footer-item">Todo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

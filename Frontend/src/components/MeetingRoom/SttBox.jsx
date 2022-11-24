import { useEffect, useState } from "react";
import styles from "./SttBox.module.css";

const SttBox = (props) => {
  const { mute } = props;

  const [finalSpan, setFinalSpan] = useState("");
  const [interimSpan, setInterimSpan] = useState("");
  const [ignoreEndProcess, setIgnoreEndProcess] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const FIRST_CHAR = /\S/;
  const TWO_LINE = /\n\n/g;
  const ONE_LINE = /\n/g;
  const language = "ko-KR";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  let finalTranscript;

  recognition.continuous = true;
  recognition.interimResults = true;

  useEffect(() => {
    finalTranscript = "";

    if (typeof SpeechRecognition !== "function") {
      alert("크롬에서만 동작 합니다.");
      return false;
    }
  }, []);

  useEffect(() => {
    console.log(mute);
    console.log(isRecognizing);
    if (mute === false) start();
    if (mute === true && isRecognizing) {
      recognition.stop();
    }
  }, [mute]);

  /**
   * 음성 인식 시작 처리
   */
  recognition.onstart = function () {
    console.log("onstart", arguments);
    setIsRecognizing(true);
  };

  /**
   * 음성 인식 종료 처리
   */
  recognition.onend = function () {
    console.log("onend", arguments);
    setIsRecognizing(false);

    if (ignoreEndProcess) {
      return false;
    }

    if (!finalTranscript) {
      console.log("empty finalTranscript");
      return false;
    }
  };

  /**
   * 음성 인식 결과 처리
   */
  recognition.onresult = function (event) {
    let interimTranscript = "";
    if (typeof event.results === "undefined") {
      recognition.onend = null;
      recognition.stop();
      return;
    }

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ".";
      } else {
        interimTranscript += transcript + ".";
      }
    }

    finalTranscript = capitalize(finalTranscript);
    setFinalSpan(linebreak(finalTranscript));
    setInterimSpan(linebreak(interimTranscript));
  };

  /**
   * 음성 인식 에러 처리
   */
  recognition.onerror = function (event) {
    console.log("onerror", event);

    if (event.error.match(/no-speech|audio-capture|not-allowed/)) {
      setIgnoreEndProcess(true);
    }
  };

  /**
   * 개행 처리
   * @param {string} s
   */
  function linebreak(s) {
    return s.replace(TWO_LINE, "<p></p>").replace(ONE_LINE, "<br>");
  }

  /**
   * 첫문자를 대문자로 변환
   * @param {string} s
   */
  function capitalize(s) {
    return s.replace(FIRST_CHAR, function (m) {
      return m.toUpperCase();
    });
  }

  /**
   * 음성 인식 트리거
   */
  function start() {
    recognition.lang = language;
    recognition.start();
    setIgnoreEndProcess(false);
  }

  function stop() {
    recognition.continuous = false;
    recognition.stop();
  }

  return (
    <div className={styles.sttBox}>
      <div className={styles.speakerIcon}>🔊 </div>
      <div className={styles.sttText} id="sttText">
        <span id="final">{finalSpan}</span>
        <span id="interim">{interimSpan}</span>
      </div>
    </div>
  );
};

export default SttBox;

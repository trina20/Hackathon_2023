import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechRecognitionComponent = () => {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

  return (
    <div style={{textAlign: "left", marginLeft: "3%", padding: "2%"}}>
      <p>Please record you feedback</p>
      <p>{transcript}</p>
      <button onClick={startListening} disabled={listening}>Start</button>
      <button onClick={stopListening} disabled={!listening}>Stop</button>
    </div>
  );
}

export default SpeechRecognitionComponent;

import React, { createContext, useState } from 'react';
import run from '../../Gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-IN"; // Adjust language if needed
    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(prompt) {
    try {
      const text = await run(prompt);
      let newText=text.split("**")&&text.split("*")&&text.replace("google","Malik Touqeer")
      &&text.replace("Google","Malik Touqeer")
      setPrompt(newText);
      speak(newText);
      setResponse(true);
      setTimeout(()=>{
       setSpeaking(false)
      },4000)
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setPrompt("Sorry, I couldn't process your request.");
      speak("Sorry, I couldn't process your request.");
    }
  }

  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!speechRecognition) {
    console.warn("Speech recognition is not supported in this browser.");
  }

  const recognition = new speechRecognition();
  recognition.onresult = (e) => {
    const currentIndex = e.resultIndex;
    const transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    takeCommand(transcript.toLowerCase())
  };

  function takeCommand(command){
    if(command.includes("open") && command.includes("youtube")){
      window.open("https://www.youtube.com/","_blank")
      speak("opening youtube")
      setResponse(true)
      setPrompt("opening youtube...")
      setTimeout(()=>{
        setSpeaking(false)
       },4000)
    }
    else if(command.includes("open") && command.includes("google")){
      window.open("https://www.google.com/","_blank")
      speak("opening google")
      setResponse(true);
      setPrompt("opening google...")
      setTimeout(()=>{
        setSpeaking(false)
       },4000)
    }
    else{
      aiResponse(command)
    }
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;

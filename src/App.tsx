import React, { useEffect, useState, useMemo, useRef } from "react";
import "./App.css";

// 🖼️ Image Imports
import bgImage from "./images/bg.jpg";
import homeBgImage from "./images/bg.png";
import speechBg from "./images/speech_bg.png";
import languageBg from "./images/language_bg.png";
import cognitiveBg from "./images/cog.png";
import socialBg from "./images/social_bg.png";
import prosodyBg from "./images/prosody_bg.png";
import gameBg from "./images/game_bg.png";
import motorBg from "./images/motor_bg.png";
import rabbitImage from "./images/rabbit.jpg";
import logoImage from "./images/logo.png";

// 🖼️ Lip Movement Images 🚀 NEW
import oLipsImage from "./images/o-lips.png"; 
import eLipsImage from "./images/e-lips.png";

// 🖼️ Emotion & Situation Images
import sadBoyImage from "./images/sad_boy.png";
import happyBoyImage from "./images/happy_boy.png";
import angryBoyImage from "./images/angry_boy.png";
import excitedBoyImage from "./images/surprised_boy.png";
import toyPullSceneImage from "./images/toy_pull_scene.png";
import droppedCardsSceneImage from "./images/dropped_cards_scene.png";
import struggleJarSceneImage from "./images/jar_struggle.png";
import watchingGameSceneImage from "./images/watching_game_scene.png";

// 🖼️ Game Images
import appleImage from "./images/apple.jpeg";
import mangoImage from "./images/mango.png";
import bananaImage from "./images/banana.png";
import cherryImage from "./images/cherry.png";
import playCricketImage from "./images/play_cricket.png";
import parkSceneImage from "./images/park_scene.png";
import bearStoryImage from "./images/bear_story.png";

// 🎥 Video Imports
import balloonVideo from "./videos/balloon.mp4"; 

// 🔊 Audio Imports
import shSound from "./audio/sh.mp3";
import happySound from "./audio/happy.mp3";
import sadSound from "./audio/sad.mp3";
import angrySound from "./audio/angry.mp3";
import excitedSound from "./audio/surprised.mp3";
import toyConflictSound from "./audio/toy_conflict.mp3";
import cardAccidentSound from "./audio/card_accident.mp3";
import wantToJoinSound from "./audio/want_to_join.mp3";
import jarStruggleSound from "./audio/jar_struggle.mp3";
import rabbitSound from "./audio/rabbit.mp3";
import appleSound from "./audio/apple.mp3";
import playCricketSound from "./audio/play_cricket.mp3";
import eatingFoodSound from "./audio/eating_food.mp3";
import sleepingSound from "./audio/sleeping.mp3";
import dancingSound from "./audio/dancing.mp3";
import kickingBallSound from "./audio/kicking_ball.mp3";
import squirrelTreeSound from "./audio/squirrel_tree.mp3";
import drawingColoringSound from "./audio/drawing_coloring.mp3";
import icecreamPurposeSound from "./audio/icecream_purpose.mp3";
import zippyStorySound from "./audio/zippy_bear_story.mp3";
import backgroundMusic from "./audio/kids-music.mp3";

// 🔊 Lip Movement Audios 🚀 NEW
import oSound from "./audio/o-sound.mp3";
import eSound from "./audio/e-sound.mp3";

// 🔊 Correct Answer Audios
import kickingBallAnswer from "./audio/kicking_ball_answer.mp3";
import squirrelTreeAnswer from "./audio/squirrel_tree_answer.mp3";
import drawingColoringAnswer from "./audio/drawing_coloring_answer.mp3";
import icecreamVehicleAnswer from "./audio/icecream_vehicle_answer.mp3";

// 🔊 Motor Models
import steadyBreatheModel from "./audio/steady_breathe_model.mp3";

// --- Data Types ---
type Subtopic = { title: string; example?: string };
type Category = {
  id: number;
  title: string;
  colorFrom: string;
  colorTo: string;
  subtopics: Subtopic[];
  imageURL: string;
};
type ActiveGame = { category: Category; subtopic: Subtopic } | null;

// 🚀 Point Pop Animation Styles
const PointPopStyles = () => (
  <style>{`
    @keyframes floatUpFade {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(-120px); opacity: 0; }
    }
    .animate-point-pop {
      animation: floatUpFade 1.2s ease-out forwards;
      pointer-events: none;
      position: absolute;
      z-index: 100;
      font-weight: 900;
      font-size: 4rem;
      color: #fbbf24;
      text-shadow: 2px 2px 15px rgba(0,0,0,0.3);
      width: 100%;
      left: 0;
      text-align: center;
    }
  `}</style>
);

const CATEGORIES: Category[] = [
  { id: 1, title: "Speech & Articulation", colorFrom: "#ff9a9e", colorTo: "#fecfef", imageURL: speechBg, subtopics: [{ title: "Phoneme articulation", example: `e.g., "pa", "ba", "ta", "da", "ka", "ga"` }, { title: "Word-level articulation", example: `e.g., "rabbit", "school", "three"` }] },
  { id: 2, title: "Language & Vocabulary", colorFrom: "#a1c4fd", colorTo: "#c2e9fb", imageURL: languageBg, subtopics: [{ title: "Object naming", example: `Identify pictures → "Apple"` }, { title: "Action words (verbs)", example: `Describe actions → "He is jumping"` }] },
  { id: 3, title: "Cognitive & Comprehension", colorFrom: "#d4fc79", colorTo: "#96e6a1", imageURL: cognitiveBg, subtopics: [{ title: "Picture-based comprehension", example: "Describe what’s happening" }, { title: "Story listening & answering", example: "Listen, then answer" }] },
  { id: 4, title: "Social & Emotional", colorFrom: "#fbc2eb", colorTo: "#a6c1ee", imageURL: socialBg, subtopics: [{ title: "Facial expression recognition", example: "Happy / Sad / Angry / Surprised" }, { title: "Situational responses", example: "Choose correct reply" }] },
  { id: 5, title: "Prosody & Voice", colorFrom: "#ffd89b", colorTo: "#19547b", imageURL: prosodyBg, subtopics: [{ title: "Pitch variation", example: "Try high vs low pitch" }, { title: "Stress patterns", example: "Emphasize key words" }] },
  { id: 6, title: "Game-Based Reinforcement", colorFrom: "#a18cd1", colorTo: "#fbc2eb", imageURL: gameBg, subtopics: [{ title: "Speech games", example: `"Say the word to pop the balloon"` }, { title: "Listening games", example: "Match sound to picture" }] },
  { id: 7, title: "Non-Verbal & Motor", colorFrom: "#f6d365", colorTo: "#fda085", imageURL: motorBg, subtopics: [{ title: "Breathing control", example: "Blow bubbles steadily" }, { title: "Lip & tongue movement", example: "Tongue up-down, side-to-side" }] },
];

interface QuestionSet { id: number; question: string; correctLabel: string; audioMap: { [key: string]: string }; options: string[]; }

const COMPREHENSION_QUESTIONS: QuestionSet[] = [
  { id: 1, question: "Q1: What is the boy in the green shirt doing right now?", correctLabel: "Kicking a soccer ball", audioMap: { "Kicking a soccer ball": kickingBallAnswer }, options: ["Riding a scooter", "Kicking a soccer ball", "Throwing a baseball", "Climbing the slide"] },
  { id: 2, question: "Q2: Where is the squirrel located in the picture?", correctLabel: "In the branches of the tree", audioMap: { "In the branches of the tree": squirrelTreeAnswer }, options: ["Under the picnic table", "Inside the swing set", "In the branches of the tree", "Next to the ice cream truck"] },
  { id: 3, question: "Q3: What are the children sitting at the picnic table doing?", correctLabel: "They are drawing or coloring.", audioMap: { "They are drawing or coloring.": drawingColoringAnswer }, options: ["They are all eating lunch.", "They are reading a book together.", "They are drawing or coloring.", "They are listening to music."] },
  { id: 4, question: "Q4: What is the main purpose of the yellow vehicle on the right side of the park?", correctLabel: "It is selling ice cream.", audioMap: { "It is selling ice cream.": icecreamVehicleAnswer }, options: ["It is a school bus.", "It is a taxi waiting for a fare.", "It is selling ice cream.", "It is delivering packages."] },
];

const STORY_QUESTIONS: QuestionSet[] = [
  { id: 1, question: "Q1: What did Zippy Zoom Bear want to find first?", correctLabel: "Big, sweet berries", audioMap: { "Big, sweet berries": playCricketSound }, options: ["A new friend", "Big, sweet berries", "A warm blanket", "A stream"] },
  { id: 2, question: "Q2: What color was Zippy's basket?", correctLabel: "Red", audioMap: { Red: appleSound }, options: ["Blue", "Green", "Red", "Yellow"] },
];

const EMOTION_SCENARIOS = [
  { id: 1, emotion: "Happy", imageAsset: happyBoyImage, audioAsset: happySound },
  { id: 2, emotion: "Sad", imageAsset: sadBoyImage, audioAsset: sadSound },
  { id: 3, emotion: "Angry", imageAsset: angryBoyImage, audioAsset: angrySound },
  { id: 4, emotion: "Surprised", imageAsset: excitedBoyImage, audioAsset: excitedSound },
];
const ALL_EMOTION_LABELS = EMOTION_SCENARIOS.map((s) => s.emotion);

const SITUATION_QUESTIONS = [
  { id: 1, scenarioText: "Two friends both reach for the same toy at the same time.", imageAsset: toyPullSceneImage, audioAsset: toyConflictSound, correctResponse: "Let's take turns.", options: ["No, it's mine!", "Let's take turns.", "I need water.", "What color is your shirt?"] },
  { id: 2, scenarioText: "One friend accidentally bumps another.", imageAsset: droppedCardsSceneImage, audioAsset: cardAccidentSound, correctResponse: "Oh no, I'm so sorry!", options: ["Oh no, I'm so sorry!", "Watch where you stand.", "It's just a game.", "I'm leaving."] },
];

function useKeyDown(key: string, handler: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === key) handler(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler]);
}

// =======================================================
// Game Components
// =======================================================

function MotorGame({ activeGame, setPage, setPoints }: any) {
  const [phase, setPhase] = useState<"ready" | "playing" | "finished">("ready");
  const [showPointPop, setShowPointPop] = useState(false);
  // 🚀 New State: Track which step the child is on
  const [currentStep, setCurrentStep] = useState<"O" | "E">("O");
  const videoRef = useRef<HTMLVideoElement>(null);

  const isBreathing = activeGame.subtopic.title === "Breathing control";

  const handleStart = () => {
    setPhase("playing");
    if (isBreathing) {
      const audio = new Audio(steadyBreatheModel);
      audio.play();
      if (videoRef.current) videoRef.current.play();
      audio.onended = () => setPhase("finished");
    } else {
      // 🚀 Lip & Tongue: Play the current sound only
      const audio = new Audio(currentStep === "O" ? oSound : eSound);
      audio.play();
      
      // Allow them to look at the model for 4 seconds before showing the "Finish/Next" button
      setTimeout(() => {
        setPhase("finished");
      }, 4000);
    }
  };

  const handleNextOrComplete = () => {
    if (!isBreathing && currentStep === "O") {
      // 🚀 Step 1 Finished: Move to EE
      setCurrentStep("E");
      setPhase("ready");
    } else {
      // 🚀 Step 2 (or Breathing) Finished: Final Score
      setShowPointPop(true);
      setPoints((p: number) => p + 50); 
      setTimeout(() => setPage("content"), 1500);
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto border-4 border-orange-400 text-center relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+50</div>}
      
      {/* 🚀 Dynamic Title: Shows Step 1 or Step 2 */}
      <h3 className="text-3xl font-black text-orange-600 mb-4">
        {isBreathing 
          ? activeGame.subtopic.title 
          : `Step ${currentStep === "O" ? "1" : "2"}: ${currentStep === "O" ? "OO Sound" : "EE Sound"}`}
      </h3>

      <div className="relative h-80 w-full bg-slate-50 rounded-2xl border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-10">
        {isBreathing ? (
           <video ref={videoRef} src={balloonVideo} className="w-full h-full object-contain" playsInline />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* 🚀 Show current lip image based on Step */}
            <div className="flex flex-col items-center">
              <img 
                src={currentStep === "O" ? oLipsImage : eLipsImage} 
                className="h-64 object-contain" 
                alt="Lip model" 
              />
              <p className="text-6xl font-black mt-4 text-orange-500">
                {currentStep === "O" ? "OOO" : "EEE"}
              </p>
            </div>
          </div>
        )}

        {phase === "ready" && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <button 
              onClick={handleStart} 
              className="px-12 py-6 bg-orange-500 text-white rounded-full font-black text-3xl shadow-xl hover:scale-110 transition-transform"
            >
              WATCH & LISTEN
            </button>
          </div>
        )}
      </div>

      {phase === "playing" && (
        <div className="text-2xl font-black text-blue-600 animate-pulse">
          Now you try! Repeat the sound!
        </div>
      )}

      {phase === "finished" && (
        <button 
          onClick={handleNextOrComplete} 
          className="px-10 py-4 bg-green-500 text-white rounded-full font-black text-xl shadow-lg border-b-4 border-green-700 hover:scale-105 transition-all"
        >
          {!isBreathing && currentStep === "O" 
            ? "I'm Done! Next Sound ➡️" 
            : "Finish Adventure! 🏆"}
        </button>
      )}
    </div>
  );
}

// ... rest of your components (ObjectNamingGame, ActionWordsGame, etc.) remain identical ...

function ObjectNamingGame({ setPage, setPoints }: any) {
  const [phase, setPhase] = useState<"listen" | "choose" | "feedback">("listen");
  const [selection, setSelection] = useState<string | null>(null);
  const [showPointPop, setShowPointPop] = useState(false);
  const shuffledChoices = useMemo(() => [{ id: "apple", src: appleImage, isCorrect: true }, { id: "mango", src: mangoImage, isCorrect: false }, { id: "banana", src: bananaImage, isCorrect: false }, { id: "cherry", src: cherryImage, isCorrect: false }].sort(() => Math.random() - 0.5), []);

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-indigo-500 text-center relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+50</div>}
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-6">Find the Apple!</h3>
      {phase === "listen" && <button onClick={() => { new Audio(appleSound).play(); setPhase("choose"); }} className="mb-12 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-xl mx-auto block shadow-lg">🔊 Listen Now!</button>}
      {phase !== "listen" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {shuffledChoices.map(c => (
            <div key={c.id} onClick={() => { if(phase==="choose") { setSelection(c.id); setPhase("feedback"); if(c.isCorrect) setPoints((p:number)=>p+50); } }}
              className={`p-3 rounded-xl border-4 cursor-pointer transition-all ${selection === c.id ? (c.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "bg-indigo-50 border-gray-200"}`}><img src={c.src} className="w-full h-40 object-contain rounded-lg" alt="choice" /></div>
          ))}
        </div>
      )}
      {phase === "feedback" && <button onClick={() => { setShowPointPop(true); setTimeout(()=>setPage("content"), 1200); }} className="mt-10 px-8 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg block mx-auto hover:scale-105">Continue 🏆</button>}
    </div>
  );
}

function ActionWordsGame({ setPage, setPoints }: any) {
  const [phase, setPhase] = useState<"view" | "choose" | "feedback">("view");
  const [selection, setSelection] = useState<string | null>(null);
  const [showPointPop, setShowPointPop] = useState(false);
  const shuffledChoices = useMemo(() => [{ label: "Playing Cricket", audio: playCricketSound, isCorrect: true }, { label: "Eating Food", audio: eatingFoodSound, isCorrect: false }, { label: "Sleeping", audio: sleepingSound, isCorrect: false }, { label: "Dancing", audio: dancingSound, isCorrect: false }].sort(() => Math.random() - 0.5), []);

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-indigo-500 text-center relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+50</div>}
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-6">Action Words Challenge</h3>
      <img src={playCricketImage} className="w-full max-h-64 object-contain rounded-lg mb-8 mx-auto" alt="main" />
      {phase === "view" && <button onClick={() => setPhase("choose")} className="px-8 py-4 bg-green-500 text-white rounded-full font-bold mx-auto block shadow-lg">Start Game!</button>}
      {phase !== "view" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shuffledChoices.map(c => (
            <button key={c.label} onClick={() => { new Audio(c.audio).play(); if(phase==="choose") { setSelection(c.label); setPhase("feedback"); if(c.isCorrect) setPoints((p:number)=>p+50); }}}
              className={`p-4 rounded-xl font-bold transition-all ${selection === c.label ? (c.isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white") : "bg-indigo-600 text-white"}`}>{c.label}</button>
          ))}
        </div>
      )}
      {phase === "feedback" && <button onClick={() => { setShowPointPop(true); setTimeout(()=>setPage("content"), 1200); }} className="mt-10 px-8 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg block mx-auto">Continue 🏆</button>}
    </div>
  );
}

function PictureComprehensionGame({ setPage, setPoints }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<"question" | "feedback" | "finished">("question");
  const [showPointPop, setShowPointPop] = useState(false);

  const currentQuestion = COMPREHENSION_QUESTIONS[currentQIndex];
  const shuffledOptions = useMemo(() => [...currentQuestion.options].sort(() => Math.random() - 0.5), [currentQIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    if (phase !== "question") return;
    const correct = selectedAnswer === currentQuestion.correctLabel;
    setSelection(selectedAnswer); setIsCorrect(correct); setPhase("feedback");
    if (correct) setScore((s) => s + 50);
    const correctAudioFile = currentQuestion.audioMap[currentQuestion.correctLabel];
    if (correctAudioFile) new Audio(correctAudioFile).play().catch((e) => console.error(e));
  };

  const getButtonClass = (label: string) => {
    if (phase === "feedback") {
      if (label === currentQuestion.correctLabel) return "bg-green-500 text-white shadow-xl ring-4 ring-green-300 border-transparent";
      if (selection === label && !isCorrect) return "bg-red-500 text-white ring-4 ring-red-300 opacity-80 border-transparent";
      return "bg-gray-100 text-gray-400 opacity-50 cursor-default";
    }
    return "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 hover:shadow-md transition-all";
  };

  if (phase === "finished") return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl mx-auto border-4 border-green-500 mt-10 text-center relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-10">+{score}</div>}
      <h3 className="text-4xl font-extrabold text-green-700 mb-4">Complete! 🎉</h3>
      <p className="text-2xl mb-8">You scored {score} points!</p>
      <button onClick={() => { setShowPointPop(true); setPoints((p: number) => p + score); setTimeout(() => setPage("content"), 1200); }} 
        className="px-8 py-3 text-xl font-bold text-white rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg border-b-4 border-green-800">Back to Adventures</button>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-purple-500 text-center">
      <h3 className="text-3xl font-extrabold text-purple-700 mb-4">Picture Comprehension</h3>
      <div className="mb-10 p-2 bg-gray-50 rounded-xl shadow-inner border-4 border-gray-200"><img src={parkSceneImage} alt="Park" className="w-full h-auto max-h-80 object-contain mx-auto rounded-lg" /></div>
      <p className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shuffledOptions.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(opt)} disabled={phase !== "question"} className={`p-6 text-xl font-bold rounded-xl border-2 transition-all duration-300 ${getButtonClass(opt)}`}>{opt}</button>
        ))}
      </div>
      {phase === "feedback" && (
        <div className="mt-8">
          <p className={`text-3xl font-black ${isCorrect ? "text-green-600" : "text-red-600"} mb-6`}>{isCorrect ? "Correct! ✨" : "Good try! Listen to the correct answer."}</p>
          <button onClick={() => currentQIndex < COMPREHENSION_QUESTIONS.length - 1 ? (setCurrentQIndex(currentQIndex + 1), setSelection(null), setPhase("question")) : setPhase("finished")} className="px-10 py-4 text-2xl font-bold text-white rounded-full shadow-xl bg-purple-600 hover:bg-purple-700 border-b-4 border-purple-800">{currentQIndex < COMPREHENSION_QUESTIONS.length - 1 ? "Next Question →" : "View Final Score →"}</button>
        </div>
      )}
    </div>
  );
}

function StoryComprehensionGame({ setPage, setPoints }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [phase, setPhase] = useState<"intro" | "playing" | "feedback" | "finished">("intro");
  const [showPointPop, setShowPointPop] = useState(false);
  const currentQuestion = STORY_QUESTIONS[currentQIndex];
  const shuffledOptions = useMemo(() => currentQuestion ? [...currentQuestion.options].sort(() => Math.random() - 0.5) : [], [currentQIndex]);

  if (phase === "finished") return (
    <div className="text-center p-10 bg-white rounded-2xl shadow-xl relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+{score}</div>}
      <h3 className="text-4xl font-bold text-green-600 mb-6">Great Listening! 🎉</h3>
      <button onClick={() => { setShowPointPop(true); setPoints((p:number)=>p+score); setTimeout(()=>setPage("content"), 1200); }} className="px-10 py-4 bg-green-600 text-white rounded-full font-bold">Back to Adventures</button>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl border-4 border-purple-500 max-w-6xl mx-auto text-center">
      <h3 className="text-3xl font-extrabold text-purple-700 mb-4">Story Comprehension</h3>
      {phase === "intro" ? (
        <div><img src={bearStoryImage} className="h-64 mx-auto mb-6 rounded-xl" alt="bear" /><button onClick={() => { new Audio(zippyStorySound).play(); setPhase("playing"); }} className="px-12 py-6 bg-red-500 text-white rounded-full font-bold text-2xl shadow-xl">🎧 START STORY</button></div>
      ) : (
        <>
          <p className="text-2xl font-bold mb-8">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shuffledOptions.map(opt => (
              <button key={opt} onClick={() => { if(phase==="playing") { setSelection(opt); setPhase("feedback"); if(opt===currentQuestion.correctLabel) setScore(s=>s+50); }}}
                className={`p-6 text-xl font-bold rounded-2xl transition-all ${selection === opt ? (opt === currentQuestion.correctLabel ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-indigo-50 text-indigo-800"}`}>{opt}</button>
            ))}
          </div>
          {phase === "feedback" && <button onClick={() => currentQIndex < STORY_QUESTIONS.length - 1 ? (setCurrentQIndex(currentQIndex+1), setSelection(null), setPhase("playing")) : setPhase("finished")} className="mt-8 px-10 py-4 bg-purple-600 text-white rounded-full font-bold mx-auto block shadow-xl">Next Question →</button>}
        </>
      )}
    </div>
  );
}

function FacialRecognitionGame({ setPage, setPoints }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [phase, setPhase] = useState<"question" | "feedback" | "finished">("question");
  const [showPointPop, setShowPointPop] = useState(false);
  const currentScenario = EMOTION_SCENARIOS[currentQIndex];
  const options = useMemo(() => [...ALL_EMOTION_LABELS].sort(() => Math.random() - 0.5), [currentQIndex]);

  if (phase === "finished") return (
    <div className="text-center p-10 bg-white rounded-2xl shadow-xl relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+{score}</div>}
      <h3 className="text-4xl font-bold text-green-600 mb-6">Excellent Work! 🎉</h3>
      <button onClick={() => { setShowPointPop(true); setPoints((p:number)=>p+score); setTimeout(()=>setPage("content"), 1200); }} className="px-10 py-4 bg-green-600 text-white rounded-full font-bold">Back to Adventures</button>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl border-4 border-red-500 max-w-4xl mx-auto text-center">
      <h3 className="text-3xl font-bold text-red-600 mb-8">How do they feel?</h3>
      <img src={currentScenario.imageAsset} className="h-64 mx-auto mb-10 rounded-xl" alt="emo" />
      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => (
          <button key={opt} onClick={() => { if(phase==="question") { setSelection(opt); setPhase("feedback"); if(opt===currentScenario.emotion) { setScore(s=>s+75); new Audio(currentScenario.audioAsset).play(); } }}}
            className={`p-6 text-xl font-bold rounded-2xl transition-all ${selection === opt ? (opt === currentScenario.emotion ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-red-100 text-red-700"}`}>{opt}</button>
        ))}
      </div>
      {phase === "feedback" && <button onClick={() => currentQIndex < EMOTION_SCENARIOS.length - 1 ? (setCurrentQIndex(currentQIndex+1), setSelection(null), setPhase("question")) : setPhase("finished")} className="mt-10 px-8 py-3 bg-red-600 text-white rounded-full font-bold mx-auto block shadow-xl">Next Expression →</button>}
    </div>
  );
}

function SituationalResponseGame({ setPage, setPoints }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [phase, setPhase] = useState<"scenario" | "question" | "feedback" | "finished">("scenario");
  const [showPointPop, setShowPointPop] = useState(false);
  const currentQ = SITUATION_QUESTIONS[currentQIndex];
  const options = useMemo(() => [...currentQ.options].sort(() => Math.random() - 0.5), [currentQIndex]);

  if (phase === "finished") return (
    <div className="text-center p-10 bg-white rounded-2xl shadow-xl relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-0">+{score}</div>}
      <h3 className="text-4xl font-bold text-blue-600 mb-6">Social Superstar! 🌟</h3>
      <button onClick={() => { setShowPointPop(true); setPoints((p:number)=>p+score); setTimeout(()=>setPage("content"), 1200); }} className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold">Back to Adventures</button>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl border-4 border-blue-500 max-w-6xl mx-auto text-center">
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-center bg-blue-50 p-6 rounded-2xl">
        <img src={currentQ.imageAsset} className="h-56 rounded-xl" alt="situation" />
        <p className="text-xl font-medium text-blue-900">{currentQ.scenarioText}</p>
      </div>
      {phase === "scenario" ? (
        <button onClick={() => { new Audio(currentQ.audioAsset).play(); setPhase("question"); }} className="px-10 py-5 bg-purple-600 text-white rounded-full font-bold text-xl block mx-auto shadow-lg animate-pulse">🎧 LISTEN TO SITUATION</button>
      ) : (
        <>
          <p className="text-2xl font-bold mb-8 text-center">How should we respond?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map(opt => (
              <button key={opt} onClick={() => { if(phase==="question") { setSelection(opt); setPhase("feedback"); if(opt===currentQ.correctResponse) setScore(s=>s+100); }}} 
                className={`p-6 text-lg font-bold rounded-2xl transition-all ${selection === opt ? (opt === currentQ.correctResponse ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-blue-100 text-blue-800"}`}>{opt}</button>
            ))}
          </div>
          {phase === "feedback" && <button onClick={() => currentQIndex < SITUATION_QUESTIONS.length - 1 ? (setCurrentQIndex(currentQIndex+1), setSelection(null), setPhase("scenario")) : setPhase("finished")} 
            className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-full font-bold mx-auto block shadow-xl">Next Situation →</button>}
        </>
      )}
    </div>
  );
}

function GameScreen({ activeGame, setPage, setPoints }: any) {
  const [gamePhase, setGamePhase] = useState<"listen" | "playing" | "speak" | "feedback">("listen");
  const [hasListened, setHasListened] = useState(false);
  const [showPointPop, setShowPointPop] = useState(false); // 🚀 Added for scoring effect

  if (!activeGame) return <div className="text-center p-20 font-bold">Loading...</div>;

  const { subtopic } = activeGame;

  // 🔎 Check if this is the Rabbit game
  const isRabbitGame = subtopic.title.includes("Word-level");
  
  let targetText = subtopic.title.includes("Phoneme") 
    ? "/sh/ sound" 
    : isRabbitGame 
    ? "Word: 'Rabbit'" 
    : subtopic.title;

  let audioFile = subtopic.title.includes("Phoneme") ? shSound : isRabbitGame ? rabbitSound : "";
  
  // Custom repetition counts for different difficulty levels
  let repetitionCount = subtopic.title.includes("Phoneme") ? 10 : 6;

  const handlePlaySound = () => { 
    setGamePhase("playing"); 
    const a = new Audio(audioFile); 
    a.play(); 
    a.onended = () => { 
      setGamePhase("listen"); 
      setHasListened(true); 
    }; 
  };

  const handleComplete = () => {
    setShowPointPop(true);
    setPoints((p: number) => p + 50);
    setTimeout(() => setPage("content"), 1500);
  };

  return (
    <div className="min-h-screen p-8 pt-20 text-center bg-gray-100 relative">
      <PointPopStyles />
      {showPointPop && <div className="animate-point-pop top-20">+50</div>}

      <h2 className="text-4xl font-extrabold text-purple-700 mb-12">{activeGame.category.title}</h2>
      
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto border-4 border-purple-300">
        
        {/* 🐰 FIXED: Display Rabbit Image if it is the Word-level exercise */}
        {isRabbitGame && (
          <div className="mb-8">
            <img 
              src={rabbitImage} 
              alt="Rabbit" 
              className="w-64 h-64 object-cover mx-auto rounded-2xl shadow-md border-4 border-purple-50"
            />
          </div>
        )}

        <p className="text-5xl font-black text-indigo-900 mb-12">{targetText}</p>
        
        {gamePhase === "listen" && (
          <div className="flex flex-col gap-6">
            <button onClick={handlePlaySound} className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-2xl shadow-xl hover:bg-blue-700 mx-auto flex items-center gap-3">
              <span>🔊</span> {hasListened ? "Listen Again" : "Listen Now!"}
            </button>
            {hasListened && (
              <button onClick={() => setGamePhase("speak")} className="px-12 py-5 bg-orange-500 text-white rounded-full font-black text-2xl shadow-xl animate-bounce mx-auto">
                Ready to Practice! ➡️
              </button>
            )}
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="text-3xl font-black text-blue-600 animate-pulse">
            Listening... 👂
          </div>
        )}

        {gamePhase === "speak" && (
          <div className="p-10 bg-purple-50 rounded-2xl border-4 border-purple-200">
            <p className="text-2xl font-bold mb-6 text-purple-800">Repeat {repetitionCount} times!</p>
            <button onClick={() => setGamePhase("feedback")} className="px-12 py-6 bg-indigo-600 text-white rounded-xl font-black text-2xl shadow-xl hover:bg-indigo-700">
              I Finished My Repetitions! 🎉
            </button>
          </div>
        )}

        {gamePhase === "feedback" && (
          <div className="text-5xl font-black text-green-700 animate-bounce">
            GREAT JOB! 🎉
          </div>
        )}
      </div>

      <button 
        onClick={handleComplete} 
        disabled={gamePhase !== "feedback"} 
        className={`mt-12 px-12 py-4 text-2xl font-bold text-white rounded-full shadow-xl transition-all ${
          gamePhase === "feedback" ? "bg-green-500 hover:scale-105" : "bg-gray-400 opacity-50"
        }`}
      >
        Continue to Adventures! 🏆
      </button>
    </div>
  );
}

// --- App Router ---
export default function App() {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const [page, setPage] = useState<"home" | "content" | "game">("home");
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem("unpuzzle_points");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("unpuzzle_points", points.toString());
  }, [points]);

  return (
    <div className="min-h-screen relative font-sans text-gray-800">
      {page === "home" ? <Home setPage={setPage} /> :
       page === "game" ? (
         <div className="min-h-screen bg-gray-100 p-8 pt-20">
           {activeGame?.subtopic.title === "Object naming" ? <ObjectNamingGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.subtopic.title === "Action words (verbs)" ? <ActionWordsGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.subtopic.title === "Picture-based comprehension" ? <PictureComprehensionGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.subtopic.title === "Story listening & answering" ? <StoryComprehensionGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.subtopic.title === "Facial expression recognition" ? <FacialRecognitionGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.subtopic.title === "Situational responses" ? <SituationalResponseGame setPage={setPage} setPoints={setPoints} /> :
            activeGame?.category.id === 7 ? <MotorGame activeGame={activeGame} setPage={setPage} setPoints={setPoints} /> :
            <GameScreen activeGame={activeGame} setPage={setPage} setPoints={setPoints} />}
         </div>
       ) : <AppContent points={points} setPoints={setPoints} openCategory={openCategory} setOpenCategory={setOpenCategory} setPage={setPage} setActiveGame={setActiveGame} />}
    </div>
  );
}

function AppContent({ points, setPoints, openCategory, setOpenCategory, setPage, setActiveGame }: any) {
  useKeyDown("Escape", () => setOpenCategory(null));
  
  useEffect(() => {
    const bgMusic = new Audio(backgroundMusic);
    bgMusic.loop = true; bgMusic.volume = 0.25;
    bgMusic.play().catch((e) => console.log("Music interaction required"));
    return () => { bgMusic.pause(); bgMusic.currentTime = 0; };
  }, []);

  const handleReset = () => {
    if(window.confirm("Do you want to reset all points?")) {
      setPoints(0);
    }
  };

  return (
    <div className="min-h-screen pt-16 relative" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <header className="fixed top-0 inset-x-0 z-30 flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-6">
          <button onClick={() => setPage("home")} className="bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 font-bold hover:bg-indigo-200 transition">🏠 Home</button>
          <img src={logoImage} alt="Logo" className="h-16" />
        </div>
        <div className="flex items-center gap-4">
           <button onClick={handleReset} className="text-xs font-bold text-red-500 hover:underline">Reset Progress</button>
           <div className="bg-white shadow-lg rounded-full px-5 py-2 font-bold text-purple-600 border border-purple-200">🏆 {points} pts</div>
        </div>
      </header>
      <main className="p-8 max-w-7xl mx-auto">
        <p className="text-center text-4xl font-black text-indigo-900 mb-10 drop-shadow-md">Choose a FUN ADVENTURE!</p>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
          {CATEGORIES.map((c, index) => {
            let outerClass = "min-h-[180px] transition-all duration-500 ease-out transform-gpu";
            if (index < 4) outerClass += " lg:col-span-1 xl:col-span-2";
            else {
              outerClass += " lg:col-span-1 xl:col-span-2 lg:mt-8";
              if (index === 4) outerClass += " xl:col-start-2";
              else if (index === 5) outerClass += " xl:col-start-4";
              else if (index === 6) outerClass += " xl:col-start-6";
            }
            return (
              <div key={c.id} className={outerClass}>
                <article onClick={() => setOpenCategory(c)} className="group relative rounded-3xl h-full cursor-pointer transition-all duration-500 hover:-translate-y-4">
                  <div className="absolute inset-0 bg-black/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-6 scale-90" />
                  <div className="absolute inset-0 ring-4 ring-white shadow-2xl rounded-3xl overflow-hidden z-10" style={{ background: `linear-gradient(135deg, ${c.colorFrom}, ${c.colorTo})` }} />
                  <div className="p-6 flex flex-col justify-between h-full relative z-20 bg-white/80 backdrop-blur-sm border-2 border-white rounded-3xl transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url(${c.imageURL})`, backgroundSize: "60%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                    <div className="mt-auto flex justify-end"><span className="text-3xl font-bold text-indigo-900 bg-white/50 rounded-full w-10 h-10 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">→</span></div>
                  </div>
                </article>
                <div className="text-center mt-3"><h3 className="bg-white shadow-md px-4 py-1.5 font-black text-indigo-900 rounded-xl border-2 border-indigo-50 inline-block text-lg transition-transform duration-500 group-hover:scale-110">{c.title}</h3></div>
              </div>
            );
          })}
        </section>
      </main>
      {openCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setOpenCategory(null)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-2xl border-4 border-indigo-400">
            <h2 className="text-2xl font-black mb-6 text-indigo-900">{openCategory.title}</h2>
            <ul className="space-y-4 max-h-[50vh] overflow-y-auto">
              {openCategory.subtopics.map((s, i) => (
                <li key={i} className="p-4 bg-slate-50 rounded-xl border border-indigo-100 flex flex-col gap-3 text-left">
                  <strong className="text-lg text-indigo-800">{s.title}</strong>
                  <button onClick={() => { setOpenCategory(null); setActiveGame({ category: openCategory, subtopic: s }); setPage("game"); }} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-xl shadow-lg hover:scale-[1.02] transition">PLAY ACTIVITY (+10 pts)</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Home({ setPage }: any) {
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    const bgMusic = new Audio(backgroundMusic);
    bgMusic.loop = true; bgMusic.volume = isMuted ? 0 : 0.3;
    bgMusic.play().catch((e) => {});
    return () => { bgMusic.pause(); bgMusic.currentTime = 0; };
  }, [isMuted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${homeBgImage})` }}>
      <div className="absolute top-8 left-8 z-10"><img src={logoImage} alt="Logo" className="h-16 w-auto" /></div>
      <div className="absolute top-8 right-8 z-10"><button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white text-white text-2xl shadow-xl">{isMuted ? "🔇" : "🔊"}</button></div>
      <button onClick={() => setPage("content")} className="absolute top-[85%] left-1/2 -translate-x-1/2 px-16 py-8 text-3xl font-black text-white rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 shadow-2xl hover:scale-110 transition-all ring-8 ring-white/50">START THE ADVENTURE!</button>
    </div>
  );
}

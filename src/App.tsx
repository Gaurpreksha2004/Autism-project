import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

// 🖼️ Image Imports (NOTE: All file paths must be verified locally)
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

// 🖼️ LOGO IMPORT
import logoImage from "./images/logo.png";

// 🖼️ EMOTION IMAGES (Category 4, Subtopic 1)
import sadBoyImage from "./images/sad_boy.png";
import happyBoyImage from "./images/happy_boy.png";
import angryBoyImage from "./images/angry_boy.png";
import excitedBoyImage from "./images/surprised_boy.png";

// 🖼️ NEW SITUATION IMAGES (Category 4, Subtopic 2)
import toyPullSceneImage from "./images/toy_pull_scene.png";
import droppedCardsSceneImage from "./images/dropped_cards_scene.png";
// FIX: Corrected import name for jar struggle image
import struggleJarSceneImage from "./images/jar_struggle.png";
import watchingGameSceneImage from "./images/watching_game_scene.png";

// 🖼️ Game Images
import appleImage from "./images/apple.jpeg";
import mangoImage from "./images/mango.png";
import bananaImage from "./images/banana.png";
import cherryImage from "./images/cherry.png";
import playCricketImage from "./images/play_cricket.png";
// FIX: Using correct extension now: park_scene.png
import parkSceneImage from "./images/park_scene.png";
import bearStoryImage from "./images/bear_story.png";

// 🔊 Audio Imports (NOTE: Assume audio files are in ./audio folder now)
import shSound from "./audio/sh.mp3";

// 🔊 EMOTION AUDIOS (Category 4, Subtopic 1)
import happySound from "./audio/happy.mp3";
import sadSound from "./audio/sad.mp3";
import angrySound from "./audio/angry.mp3";
import excitedSound from "./audio/surprised.mp3";

// 🔊 NEW SITUATION AUDIOS (Category 4, Subtopic 2)
import toyConflictSound from "./audio/toy_conflict.mp3";
import cardAccidentSound from "./audio/card_accident.mp3";
import jarStruggleSound from "./audio/jar_struggle.mp3";
import wantToJoinSound from "./audio/want_to_join.mp3";

import rabbitSound from "./audio/rabbit.mp3";
import appleSound from "./audio/apple.mp3";
import playCricketSound from "./audio/play_cricket.mp3";
import eatingFoodSound from "./audio/eating_food.mp3";
import sleepingSound from "./audio/sleeping.mp3";
import dancingSound from "./audio/dancing.mp3";
// COGNITIVE GAME AUDIOS
import kickingBallSound from "./audio/kicking_ball.mp3";
import squirrelTreeSound from "./audio/squirrel_tree.mp3";
import drawingColoringSound from "./audio/drawing_coloring.mp3";
import icecreamPurposeSound from "./audio/icecream_purpose.mp3";
import zippyStorySound from "./audio/zippy_bear_story.mp3"; // STORY AUDIO

// --- Data Types and Constants ---
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

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Speech & Articulation",
    colorFrom: "#ff9a9e",
    colorTo: "#fecfef",
    imageURL: speechBg,
    subtopics: [
      {
        title: "Phoneme articulation",
        example: `e.g., "pa", "ba", "ta", "da", "ka", "ga"`,
      },
      {
        title: "Word-level articulation",
        example: `e.g., "rabbit", "school", "three"`,
      },
    ],
  },
  {
    id: 2,
    title: "Language & Vocabulary",
    colorFrom: "#a1c4fd",
    colorTo: "#c2e9fb",
    imageURL: languageBg,
    subtopics: [
      { title: "Object naming", example: `Identify pictures → "Apple"` },
      {
        title: "Action words (verbs)",
        example: `Describe actions → "He is jumping"`,
      },
    ],
  },
  {
    id: 3,
    title: "Cognitive & Comprehension",
    colorFrom: "#d4fc79",
    colorTo: "#96e6a1",
    imageURL: cognitiveBg,
    subtopics: [
      {
        title: "Picture-based comprehension",
        example: "Describe what’s happening",
      },
      { title: "Story listening & answering", example: "Listen, then answer" },
    ],
  },
  {
    id: 4,
    title: "Social & Emotional",
    colorFrom: "#fbc2eb",
    colorTo: "#a6c1ee",
    imageURL: socialBg,
    subtopics: [
      {
        title: "Facial expression recognition",
        example: "Happy / Sad / Angry / Surprised",
      },
      { title: "Situational responses", example: "Choose correct reply" },
    ],
  },
  {
    id: 5,
    title: "Prosody & Voice",
    colorFrom: "#ffd89b",
    colorTo: "#19547b",
    imageURL: prosodyBg,
    subtopics: [
      { title: "Pitch variation", example: "Try high vs low pitch" },
      { title: "Stress patterns", example: "Emphasize key words" },
    ],
  },
  {
    id: 6,
    title: "Game-Based Reinforcement",
    colorFrom: "#a18cd1",
    colorTo: "#fbc2eb",
    imageURL: gameBg,
    subtopics: [
      { title: "Speech games", example: `"Say the word to pop the balloon"` },
      { title: "Listening games", example: "Match sound to picture" },
    ],
  },
  {
    id: 7,
    title: "Non-Verbal & Motor",
    colorFrom: "#f6d365",
    colorTo: "#fda085",
    imageURL: motorBg,
    subtopics: [
      { title: "Breathing control", example: "Blow bubbles steadily" },
      {
        title: "Lip & tongue movement",
        example: "Tongue up-down, side-to-side",
      },
    ],
  },
];

// --- GAME DATA DEFINITION (Top-level) ---
interface QuestionSet {
  id: number;
  question: string;
  correctLabel: string;
  audioMap: { [key: string]: string };
  options: string[];
}

const COMPREHENSION_QUESTIONS: QuestionSet[] = [
  {
    id: 1,
    question: "Q1: What is the boy in the green shirt doing right now?",
    correctLabel: "Kicking a soccer ball",
    audioMap: {
      "Riding a scooter": shSound,
      "Kicking a soccer ball": kickingBallSound,
      "Throwing a baseball": rabbitSound,
      "Climbing the slide": appleSound,
    },
    options: [
      "Riding a scooter",
      "Kicking a soccer ball",
      "Throwing a baseball",
      "Climbing the slide",
    ],
  },
  {
    id: 2,
    question: "Q2: Where is the squirrel located in the picture?",
    correctLabel: "In the branches of the tree",
    audioMap: {
      "Under the picnic table": eatingFoodSound,
      "Inside the swing set": sleepingSound,
      "In the branches of the tree": squirrelTreeSound,
      "Next to the ice cream truck": dancingSound,
    },
    options: [
      "Under the picnic table",
      "Inside the swing set",
      "In the branches of the tree",
      "Next to the ice cream truck",
    ],
  },
  {
    id: 3,
    question: "Q3: What are the children sitting at the picnic table doing?",
    correctLabel: "They are drawing or coloring.",
    audioMap: {
      "They are all eating lunch.": appleSound,
      "They are reading a book together.": rabbitSound,
      "They are drawing or coloring.": drawingColoringSound,
      "They are listening to music.": shSound,
    },
    options: [
      "They are all eating lunch.",
      "They are reading a book together.",
      "They are drawing or coloring.",
      "They are listening to music.",
    ],
  },
  {
    id: 4,
    question:
      "Q4: What is the main purpose of the yellow vehicle on the right side of the park?",
    correctLabel: "It is selling ice cream.",
    audioMap: {
      "It is a school bus.": eatingFoodSound,
      "It is a taxi waiting for a fare.": sleepingSound,
      "It is selling ice cream.": icecreamPurposeSound,
      "It is delivering packages.": dancingSound,
    },
    options: [
      "It is a school bus.",
      "It is a taxi waiting for a fare.",
      "It is selling ice cream.",
      "It is delivering packages.",
    ],
  },
];

const STORY_QUESTIONS: QuestionSet[] = [
  {
    id: 1,
    question: "Q1: What did Zippy Zoom Bear want to find first?",
    correctLabel: "Big, sweet berries",
    audioMap: {
      "A new friend": shSound,
      "Big, sweet berries": playCricketSound,
      "A warm blanket": rabbitSound,
      "A stream": appleSound,
    },
    options: [
      "A new friend",
      "Big, sweet berries",
      "A warm blanket",
      "A stream",
    ],
  },
  {
    id: 2,
    question: "Q2: What color was Zippy's basket?",
    correctLabel: "Red",
    audioMap: {
      Blue: shSound,
      Green: rabbitSound,
      Red: appleSound,
      Yellow: dancingSound,
    },
    options: ["Blue", "Green", "Red", "Yellow"],
  },
  {
    id: 3,
    question: "Q3: How did Zippy help Rosie the Rabbit?",
    correctLabel: "He pulled down a green leaf",
    audioMap: {
      "He gave her a hug": eatingFoodSound,
      "He found her a carrot": sleepingSound,
      "He pulled down a green leaf": kickingBallSound,
      "He pushed a big log": drawingColoringSound,
    },
    options: [
      "He gave her a hug",
      "He found her a carrot",
      "He pulled down a green leaf",
      "He pushed a big log",
    ],
  },
  {
    id: 4,
    question: "Q4: Who was blocking Freddie the Fox's way across the stream?",
    correctLabel: "A big log",
    audioMap: {
      "A big rock": sleepingSound,
      "A big stick": dancingSound,
      "A big log": icecreamPurposeSound,
      "A big snake": rabbitSound,
    },
    options: ["A big rock", "A big stick", "A big log", "A big snake"],
  },
  {
    id: 5,
    question: "Q5: What did Zippy do with his berries at the end of the story?",
    correctLabel: "He shared them with his friends",
    audioMap: {
      "He ate them all alone": playCricketSound,
      "He took them home to hide": shSound,
      "He shared them with his friends": squirrelTreeSound,
      "He planted them in the forest": appleSound,
    },
    options: [
      "He ate them all alone",
      "He took them home to hide",
      "He shared them with his friends",
      "He planted them in the forest",
    ],
  },
];

// --- GAME DATA DEFINITION: EMOTION RECOGNITION (Card 4, Subtopic 1) ---
interface EmotionScenario {
  id: number;
  emotion: string; // The correct label (e.g., "Happy")
  imageAsset: string; // The image file path
  audioAsset: string; // The audio file path
}

const EMOTION_SCENARIOS: EmotionScenario[] = [
  {
    id: 1,
    emotion: "Happy",
    imageAsset: happyBoyImage,
    audioAsset: happySound,
  },
  {
    id: 2,
    emotion: "Sad",
    imageAsset: sadBoyImage,
    audioAsset: sadSound,
  },
  {
    id: 3,
    emotion: "Angry",
    imageAsset: angryBoyImage,
    audioAsset: angrySound,
  },
  {
    id: 4,
    emotion: "Surprised",
    imageAsset: excitedBoyImage,
    audioAsset: excitedSound,
  },
];

const ALL_EMOTION_LABELS = EMOTION_SCENARIOS.map((s) => s.emotion);

// --- GAME DATA DEFINITION: SITUATIONAL RESPONSES (Card 4, Subtopic 2) ---
interface SituationQuestion {
  id: number;
  scenarioText: string; // Brief description of the scenario
  imageAsset: string; // Path to a supporting image
  audioAsset: string; // Path to the audio clip of the scenario happening
  correctResponse: string;
  options: string[];
}

const SITUATION_QUESTIONS: SituationQuestion[] = [
  {
    id: 1,
    scenarioText: "Two friends both reach for the same toy at the same time.",
    imageAsset: toyPullSceneImage,
    audioAsset: toyConflictSound,
    correctResponse:
      "Let's take turns. I'll use it for five minutes and then you can have it.",
    options: [
      "No, it's mine! I hate you!",
      "Let's take turns. I'll use it for five minutes and then you can have it.",
      "I think I need to go get a drink of water.",
      "What color is your shirt?",
    ],
  },
  {
    id: 2,
    scenarioText:
      "One friend accidentally bumps another, causing them to drop their stack of cards.",
    imageAsset: droppedCardsSceneImage,
    audioAsset: cardAccidentSound,
    correctResponse: "Oh no, I'm so sorry! Let me help you pick them all up.",
    options: [
      "Oh no, I'm so sorry! Let me help you pick them all up.",
      "Watch where you are standing next time.",
      "It's just a game, who cares?",
      "I'm leaving before you get mad.",
    ],
  },
  {
    id: 3,
    scenarioText:
      "A child is trying to open a jar but is struggling and starting to get frustrated.",
    imageAsset: struggleJarSceneImage,
    audioAsset: jarStruggleSound,
    correctResponse: "Excuse me, can you please help me open this jar?",
    options: [
      "Open it NOW!",
      "Excuse me, can you please help me open this jar?",
      "Quietly throw the jar across the room.",
      "Continue struggling and say nothing until someone notices.",
    ],
  },
  {
    id: 4,
    scenarioText:
      "A child is watching a group of other children playing a game and wants to join in.",
    imageAsset: watchingGameSceneImage,
    audioAsset: wantToJoinSound,
    correctResponse:
      "That looks like fun! Can I play with you when you need another person?",
    options: [
      "Stand very close and stare at the game until they invite you.",
      "That looks like fun! Can I play with you when you need another person?",
      "Tell them their game is boring.",
      "Wait for the game to end and then ask what they are doing next.",
    ],
  },
];
// --- END GAME DATA DEFINITION ---

function useKeyDown(key: string, handler: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler]);
}

// =======================================================
// Game Component: Object Naming Game (Card 2, Subtopic 1)
// =======================================================
interface Choice {
  id: string;
  src: string;
  alt: string;
  isCorrect: boolean;
}

const FRUIT_CHOICES: Choice[] = [
  {
    id: "apple",
    src: appleImage,
    alt: "Red Apple with a green leaf",
    isCorrect: true,
  },
  {
    id: "mango",
    src: mangoImage,
    alt: "Yellow Mango with a green leaf",
    isCorrect: false,
  },
  {
    id: "banana",
    src: bananaImage,
    alt: "Bunch of yellow bananas",
    isCorrect: false,
  },
  {
    id: "cherry",
    src: cherryImage,
    alt: "Two red cherries on a stem",
    isCorrect: false,
  },
];

function ObjectNamingGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [phase, setPhase] = useState<"listen" | "choose" | "feedback">(
    "listen"
  );
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const shuffledChoices = useMemo(() => {
    return FRUIT_CHOICES.sort(() => Math.random() - 0.5);
  }, []);

  const handlePlaySound = () => {
    setPhase("choose");

    try {
      const audio = new Audio(appleSound);
      audio.play();
    } catch (e) {
      console.error("Audio playback failed:", e);
      alert(`Simulating sound playback for 'APPLE'. Now, find the image.`);
    }
  };

  const handleChoice = (choiceId: string, correct: boolean) => {
    if (phase !== "choose") return;

    setSelection(choiceId);
    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      setPoints((p) => p + 50);
    }
  };

  const handleNext = () => {
    setPage("content");
  };

  const getBorderClass = (id: string, correct: boolean) => {
    if (selection === id) {
      return correct
        ? "border-green-500 ring-4 ring-green-300 shadow-xl"
        : "border-red-500 ring-4 ring-red-300 shadow-xl";
    }
    if (
      phase === "feedback" &&
      FRUIT_CHOICES.find((c) => c.id === id)?.isCorrect
    ) {
      return "border-green-500 ring-4 ring-green-300 shadow-xl opacity-70";
    }
    return "border-gray-200 hover:border-indigo-400";
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-indigo-500">
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Object Naming Challenge: Find the Apple!
      </h3>

      {/* Instruction Area */}
      <div className="mb-10 p-4 bg-indigo-50 rounded-lg">
        <p className="text-xl font-semibold text-indigo-800">
          {phase === "listen" &&
            "Click the button below to hear the name of the fruit you need to find."}
          {phase === "choose" &&
            "Which of these fruits is the one you heard? Click to select!"}
          {phase === "feedback" &&
            (isCorrect
              ? "🎉 CORRECT! Great listening and finding skills!"
              : "❌ Try again next time! The correct answer is the apple.")}
        </p>
      </div>

      {/* Listen Button (Only visible in listen phase) */}
      {phase === "listen" && (
        <button
          onClick={handlePlaySound}
          className="mb-12 px-8 py-4 text-2xl font-bold text-white rounded-full 
                                                       bg-blue-600 hover:bg-blue-700 transition shadow-lg flex items-center justify-center mx-auto"
        >
          <span className="text-4xl mr-3">🔊</span> Listen Now!
        </button>
      )}

      {/* Image Choice Grid (Visible in choose and feedback phase) */}
      {(phase === "choose" || phase === "feedback") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {shuffledChoices.map((choice) => (
            <div
              key={choice.id}
              onClick={() =>
                phase === "choose" && handleChoice(choice.id, choice.isCorrect)
              }
              className={`p-3 bg-gray-50 rounded-xl border-4 transition-all duration-300 
                                                       cursor-pointer ${getBorderClass(
                choice.id,
                choice.isCorrect
              )}`}
            >
              <img
                src={choice.src}
                alt={choice.alt}
                className="w-full h-auto object-contain rounded-lg"
              />
              {phase === "feedback" && (
                <p
                  className={`mt-2 font-bold ${
                    choice.isCorrect ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {choice.alt.split(" ")[1]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedback Button */}
      {phase === "feedback" && (
        <button
          onClick={handleNext}
          className="mt-10 px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg 
                                                       bg-green-500 hover:bg-green-600"
        >
          Continue to Adventures (+50 pts) 🏆
        </button>
      )}
    </div>
  );
}

// =======================================================
// Game Component: Action Words Game (Card 2, Subtopic 2)
// =======================================================

interface ActionChoice {
  label: string;
  audio: string;
  isCorrect: boolean;
}

const ACTION_CHOICES: ActionChoice[] = [
  { label: "Playing Cricket", audio: playCricketSound, isCorrect: true },
  { label: "Eating Food", audio: eatingFoodSound, isCorrect: false },
  { label: "Sleeping", audio: sleepingSound, isCorrect: false },
  { label: "Dancing", audio: dancingSound, isCorrect: false },
];

function ActionWordsGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [phase, setPhase] = useState<"view" | "choose" | "feedback">("view");
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const shuffledChoices = useMemo(() => {
    return ACTION_CHOICES.sort(() => Math.random() - 0.5);
  }, []);

  const handleChoiceClick = (choice: ActionChoice) => {
    // Play the audio associated with the clicked button
    try {
      const audio = new Audio(choice.audio);
      audio.play();
    } catch (e) {
      console.error("Audio playback failed:", e);
      alert(`Simulating playback for: ${choice.label}.`);
    }

    // Only allow choice selection in the 'choose' phase
    if (phase !== "choose") return;

    setSelection(choice.label);
    setIsCorrect(choice.isCorrect);
    setPhase("feedback");

    if (choice.isCorrect) {
      setPoints((p) => p + 50);
    }
  };

  const handleNext = () => {
    setPage("content");
  };

  const getButtonClass = (label: string, isCorrect: boolean) => {
    if (selection === label) {
      return isCorrect
        ? "bg-green-600 text-white ring-4 ring-green-300 shadow-lg"
        : "bg-red-600 text-white ring-4 ring-red-300 shadow-lg";
    }
    if (phase === "feedback" && isCorrect) {
      return "bg-green-100 text-green-800 border-green-500 shadow-md";
    }
    // FIX: Ensure phase check is correct for button visibility and type comparison
    return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-indigo-500">
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Action Words Challenge: Match the Sound!
      </h3>

      {/* 1. Visual Prompt (Image) */}
      <div className="mb-10 p-4 bg-gray-50 rounded-xl shadow-inner border-4 border-gray-200">
        <img
          src={playCricketImage}
          alt="A boy playing cricket"
          className="w-full max-h-72 object-contain mx-auto rounded-lg"
        />
      </div>

      {/* 2. Instruction Area */}
      <div className="mb-12 p-4 bg-purple-50 rounded-lg">
        <p className="text-xl font-semibold text-purple-800">
          {phase === "view" &&
            "Look at the picture, then start the challenge by choosing the best matching action word below."}
          {phase === "choose" &&
            "Click on each button to hear the word, then select the one that matches the image!"}
          {phase === "feedback" &&
            (isCorrect
              ? "🎉 FANTASTIC! You correctly identified the action!"
              : "❌ Keep trying! Listen carefully and look at the action in the picture.")}
        </p>
      </div>

      {/* 3. Action Buttons (Audio + Selection) */}
      {/* FIX: Simplified rendering logic */}
      {(phase === "choose" || phase === "feedback") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shuffledChoices.map((choice) => (
            <button
              key={choice.label}
              onClick={() => handleChoiceClick(choice)}
              className={`p-4 font-bold rounded-xl transition-all duration-300 border-2 border-transparent 
                                                    ${getButtonClass(
                choice.label,
                choice.isCorrect
              )}`}
              disabled={phase !== "choose"} // Only disable when not in choose phase
            >
              {choice.label}
              {phase === "feedback" && choice.isCorrect && " ✅"}
            </button>
          ))}
        </div>
      )}

      {/* 4. Controls */}
      {phase === "view" && (
        <button
          onClick={() => setPhase("choose")}
          className="mt-10 px-6 py-3 text-xl font-bold text-white rounded-full transition shadow-lg bg-green-500 hover:bg-green-600"
        >
          Start Game!
        </button>
      )}

      {phase === "feedback" && (
        <button
          onClick={handleNext}
          className="mt-10 px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg 
                                                    bg-green-500 hover:bg-green-600"
        >
          Continue to Adventures (+50 pts) 🏆
        </button>
      )}
    </div>
  );
}

// =======================================================
// Game Component: Picture Comprehension Game (Card 3, Subtopic 1)
// =======================================================
function PictureComprehensionGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<"question" | "feedback" | "finished">(
    "question"
  );

  const currentQuestion = COMPREHENSION_QUESTIONS[currentQIndex];

  // Shuffle options for the current question
  const shuffledOptions = useMemo(() => {
    return currentQuestion.options.sort(() => Math.random() - 0.5);
  }, [currentQIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    if (phase !== "question") return;

    const correct = selectedAnswer === currentQuestion.correctLabel;
    setSelection(selectedAnswer);
    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      setScore((s) => s + 50); // 50 points per question
    }
  };

  const handlePlayAudio = (optionLabel: string) => {
    const audioFile = currentQuestion.audioMap[optionLabel];
    if (audioFile) {
      try {
        const audio = new Audio(audioFile);
        audio.play();
      } catch (e) {
        console.error("Audio playback failed:", e);
        alert(`Simulating playback for: "${optionLabel}".`);
      }
    } else {
      alert(`Audio file not linked for: "${optionLabel}".`);
    }
  };

  const handleNext = () => {
    if (currentQIndex < COMPREHENSION_QUESTIONS.length - 1) {
      // Move to next question
      setCurrentQIndex(currentQIndex + 1);
      setSelection(null);
      setIsCorrect(null);
      setPhase("question");
    } else {
      // Game finished
      setPhase("finished");
      setPoints((p) => p + score); // Add total score to global points
    }
  };

  const handleExit = () => setPage("content");

  const getButtonClass = (label: string) => {
    if (phase === "feedback") {
      if (label === currentQuestion.correctLabel) {
        return "bg-green-500 text-white shadow-xl ring-4 ring-green-300";
      }
      if (selection === label && !isCorrect) {
        return "bg-red-500 text-white ring-4 ring-red-300 opacity-80";
      }
      return "bg-gray-100 text-gray-600 opacity-50 cursor-default";
    }

    return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
  };

  if (phase === "finished") {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl mx-auto border-4 border-green-500 mt-10">
        <h3 className="text-4xl font-extrabold text-green-700 mb-4">
          Challenge Complete! 🎉
        </h3>
        {/* FIX: Removed duplicate className attribute */}
        <p className="text-2xl text-gray-700 mb-8">
          You scored {score} points!
        </p>
        <button
          onClick={handleExit}
          className="px-8 py-3 text-xl font-bold text-white rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
        >
          Back to Adventures
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-purple-500">
      <h3 className="text-3xl font-extrabold text-purple-700 mb-4">
        Picture Comprehension
      </h3>
      <p className="text-xl text-indigo-500 mb-8">
        Question {currentQIndex + 1} of {COMPREHENSION_QUESTIONS.length}
      </p>

      {/* 1. Visual Prompt (Image) */}
      <div className="mb-10 p-2 bg-gray-50 rounded-xl shadow-inner border-4 border-gray-200">
        <img
          src={parkSceneImage}
          alt="Complex park scene with children"
          className="w-full h-auto object-contain mx-auto rounded-lg"
        />
      </div>

      {/* 2. Question Text */}
      <p className="text-2xl font-bold text-gray-800 mb-6">
        {currentQuestion.question}
      </p>

      {/* 3. Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shuffledOptions.map((optionLabel) => (
          <div
            key={optionLabel}
            className={`p-3 rounded-xl border-2 transition-all duration-300 
                                        ${getButtonClass(optionLabel)}`}
          >
            <button
              onClick={() => handlePlayAudio(optionLabel)}
              className="text-lg font-semibold w-full text-left p-2 rounded-lg mb-2 flex items-center justify-between hover:bg-gray-200"
            >
              <span className="flex-grow">{optionLabel}</span>
              <span className="text-xl">🔊</span>
            </button>

            <button
              onClick={() => handleAnswer(optionLabel)}
              className={`w-full py-2 text-md font-bold rounded-lg transition 
                                              ${
                phase === "question"
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-300 text-gray-600 cursor-default"
              }`}
              disabled={phase !== "question"}
            >
              Select
            </button>
          </div>
        ))}
      </div>

      {/* 4. Feedback and Next Controls */}
      {phase === "feedback" && (
        <div className="mt-8 p-4 rounded-xl">
          <p
            className={`text-3xl font-black ${
              isCorrect ? "text-green-600" : "text-red-600"
            } mb-4`}
          >
            {isCorrect ? "Correct! (+50 pts)" : "Incorrect."}
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg 
                                        bg-purple-600 hover:bg-purple-700"
          >
            {currentQIndex < COMPREHENSION_QUESTIONS.length - 1
              ? "Next Question →"
              : "View Final Score →"}
          </button>
        </div>
      )}
    </div>
  );
}

// =======================================================
// NEW GAME COMPONENT: Story Comprehension Game (Card 3, Subtopic 2)
// =======================================================

function StoryComprehensionGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  // Current Q index starts at 0 since we move directly to the quiz from intro
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<
    "intro" | "playing" | "feedback" | "finished"
  >("intro");

  const currentQuestion = STORY_QUESTIONS[currentQIndex];
  const maxQuestions = STORY_QUESTIONS.length;

  // Shuffle options for the current question
  const shuffledOptions = useMemo(() => {
    // Only run shuffle if we are on a valid question index
    if (currentQIndex < 0 || currentQIndex >= maxQuestions) return [];
    return currentQuestion.options.sort(() => Math.random() - 0.5);
  }, [currentQIndex]);

  const startQuizPhase = () => {
    // This is the single, guaranteed function to start the quiz
    setPhase("playing");
    setCurrentQIndex(0);
  };

  const handlePlayAudio = (optionLabel: string) => {
    const audioFile = currentQuestion.audioMap[optionLabel];
    if (audioFile) {
      try {
        const audio = new Audio(audioFile);
        audio.play();
      } catch (e) {
        console.error("Audio playback failed:", e);
        alert(`Simulating playback for: "${optionLabel}".`);
      }
    } else {
      alert(`Audio file not linked for: "${optionLabel}".`);
    }
  };

  const handlePlayStory = () => {
    // 1. Play the audio
    try {
      const audio = new Audio(zippyStorySound);
      audio.play();
    } catch (e) {
      console.error("Story audio attempted but failed:", e);
    }

    // 2. Regardless of audio success/failure, proceed to the quiz after 15 seconds.
    // This prevents the blank screen freeze.
    setPhase("playing"); // Show playing screen immediately to give visual feedback

    setTimeout(() => {
      // FIX: Guaranteed move to the first question after 15 seconds.
      startQuizPhase();
    }, 15000); // 15 seconds = estimated story duration
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (phase !== "playing") return;

    const correct = selectedAnswer === currentQuestion.correctLabel;
    setSelection(selectedAnswer);
    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      setScore((s) => s + 50); // 50 points per question
    }
  };

  const handleNext = () => {
    if (currentQIndex < maxQuestions - 1) {
      // Move to next question
      setCurrentQIndex(currentQIndex + 1);
      setSelection(null);
      setIsCorrect(null);
      setPhase("playing");
    } else {
      // Game finished
      setPhase("finished");
      setPoints((p) => p + score); // Add total score to global points
    }
  };

  const handleExit = () => setPage("content");

  const getButtonClass = (label: string) => {
    if (phase === "feedback") {
      if (label === currentQuestion.correctLabel) {
        return "bg-green-500 text-white shadow-xl ring-4 ring-green-300";
      }
      if (selection === label && !isCorrect) {
        return "bg-red-500 text-white ring-4 ring-red-300 opacity-80";
      }
      return "bg-gray-100 text-gray-600 opacity-50 cursor-default";
    }

    return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
  };

  if (phase === "finished") {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl mx-auto border-4 border-green-500 mt-10">
        <h3 className="text-4xl font-extrabold text-green-700 mb-4">
          Challenge Complete! 🎉
        </h3>
        <p className="text-2xl text-gray-700 mb-8">
          You scored {score} points!
        </p>
        <button
          onClick={handleExit}
          className="px-8 py-3 text-xl font-bold text-white rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
        >
          Back to Adventures
        </button>
      </div>
    );
  }

  const displayQuestion = phase === "playing" || phase === "feedback";

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-purple-500">
      <h3 className="text-3xl font-extrabold text-purple-700 mb-4">
        Story Comprehension Challenge
      </h3>
      <p className="text-xl text-indigo-500 mb-8">
        {currentQIndex >= 0
          ? `Question ${currentQIndex + 1} of ${maxQuestions}`
          : "Ready to begin?"}
      </p>

      {/* --- Story Intro Section (Phase: intro) */}
      {phase === "intro" && (
        <div className="text-center p-8">
          <h4 className="text-2xl font-bold mb-4">
            Zippy Zoom Bear's Simple Berry Day
          </h4>
          <div className="mb-6 p-4 bg-gray-50 rounded-xl max-w-xs mx-auto shadow">
            <img
              src={bearStoryImage}
              alt="Cartoon bear with berries"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Listen carefully to the entire story first. You will be asked
            questions about it later!
          </p>
          <button
            onClick={handlePlayStory}
            className="px-8 py-4 text-2xl font-bold text-white rounded-full 
                                         bg-red-500 hover:bg-red-600 transition shadow-lg flex items-center justify-center mx-auto"
          >
            <span className="text-4xl mr-3">🎧</span> Play Story & Start Quiz
          </button>
        </div>
      )}

      {/* --- Question Section (Phase: playing or feedback) --- */}
      {displayQuestion && (
        <>
          {/* 2. Question Text */}
          <p className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </p>

          {/* 3. Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shuffledOptions.map((optionLabel) => (
              <div
                key={optionLabel}
                className={`p-3 rounded-xl border-2 transition-all duration-300 
                                          ${getButtonClass(optionLabel)}`}
              >
                <button
                  onClick={() => handlePlayAudio(optionLabel)}
                  className="text-lg font-semibold w-full text-left p-2 rounded-lg mb-2 flex items-center justify-between hover:bg-gray-200"
                >
                  <span className="flex-grow">{optionLabel}</span>
                  <span className="text-xl">🔊</span>
                </button>

                <button
                  onClick={() => handleAnswer(optionLabel)}
                  className={`w-full py-2 text-md font-bold rounded-lg transition 
                                              ${
                    phase === "playing"
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-gray-300 text-gray-600 cursor-default"
                  }`}
                  disabled={phase !== "playing"}
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          {/* 4. Feedback and Next Controls */}
          {phase === "feedback" && (
            <div className="mt-8 p-4 rounded-xl">
              <p
                className={`text-3xl font-black ${
                  isCorrect ? "text-green-600" : "text-red-600"
                } mb-4`}
              >
                {isCorrect ? "Correct! (+50 pts)" : "Incorrect."}
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg 
                                         bg-purple-600 hover:bg-purple-700"
              >
                {currentQIndex < COMPREHENSION_QUESTIONS.length - 1
                  ? "Next Question →"
                  : "View Final Score →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =======================================================
// Game Component: Facial Recognition Game (Card 4, Subtopic 1)
// =======================================================
function FacialRecognitionGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<"question" | "feedback" | "finished">(
    "question"
  );

  // Memoize shuffled scenarios to ensure they stay the same throughout one game session
  const shuffledScenarios = useMemo(() => {
    return EMOTION_SCENARIOS.sort(() => Math.random() - 0.5);
  }, []);

  const currentScenario = shuffledScenarios[currentQIndex];

  // Shuffle options for the current question
  const shuffledOptions = useMemo(() => {
    // Generate options: the correct answer + three others
    const correct = currentScenario.emotion;
    const incorrect = ALL_EMOTION_LABELS.filter((label) => label !== correct);

    // Select three random incorrect options, or fewer if the total is less than 4
    const randomIncorrect = incorrect
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let options = [correct, ...randomIncorrect];

    // Trim options to exactly 4 if needed (should always be 4 with current data)
    options = options.slice(0, 4);

    // Final shuffle to randomize button position
    return options.sort(() => Math.random() - 0.5);
  }, [currentQIndex]); // Re-shuffle only when question index changes

  const handleAnswer = (selectedAnswer: string) => {
    if (phase !== "question") return;

    const correct = selectedAnswer === currentScenario.emotion;
    setSelection(selectedAnswer);
    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      // 1. Play Audio on Correct Answer
      try {
        const audio = new Audio(currentScenario.audioAsset);
        audio.play();
      } catch (e) {
        console.error("Audio playback failed:", e);
        alert(
          `Simulating correct audio playback for: ${currentScenario.emotion}.`
        );
      }
      setScore((s) => s + 75); // Higher points for a two-step recognition/audio task
    }
  };

  const handleNext = () => {
    if (currentQIndex < EMOTION_SCENARIOS.length - 1) {
      // Move to next question
      setCurrentQIndex(currentQIndex + 1);
      setSelection(null);
      setIsCorrect(null);
      setPhase("question");
    } else {
      // Game finished
      setPhase("finished");
      setPoints((p) => p + score); // Add total score to global points
    }
  };

  const handleExit = () => setPage("content");

  const getButtonClass = (label: string) => {
    const isThisCorrect = label === currentScenario.emotion;

    if (phase === "feedback") {
      if (isThisCorrect) {
        return "bg-green-500 text-white shadow-xl ring-4 ring-green-300";
      }
      if (selection === label && !isCorrect) {
        return "bg-red-500 text-white ring-4 ring-red-300 opacity-80";
      }
      return "bg-gray-100 text-gray-600 opacity-50 cursor-default";
    }

    return "bg-pink-100 text-pink-800 hover:bg-pink-200";
  };

  if (phase === "finished") {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl mx-auto border-4 border-green-500 mt-10">
        <h3 className="text-4xl font-extrabold text-green-700 mb-4">
          Emotion Challenge Complete! 🎉
        </h3>
        <p className="text-2xl text-gray-700 mb-8">
          You scored **{score}** points!
        </p>
        <button
          onClick={handleExit}
          className="px-8 py-3 text-xl font-bold text-white rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
        >
          Back to Adventures
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-red-500">
      <h3 className="text-3xl font-extrabold text-red-700 mb-4">
        Facial Expression Recognition
      </h3>
      <p className="text-xl text-pink-500 mb-8">
        Question {currentQIndex + 1} of {EMOTION_SCENARIOS.length}
      </p>

      {/* 1. Visual Prompt (Emotion Image) */}
      <div className="mb-10 p-2 bg-yellow-50 rounded-xl shadow-inner border-4 border-yellow-200 max-w-sm mx-auto">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          What emotion is this friend showing?
        </p>
        <img
          src={currentScenario.imageAsset}
          alt={`A boy looking ${currentScenario.emotion}`}
          className="w-full h-auto object-contain mx-auto rounded-lg max-h-80"
        />
      </div>

      {/* 2. Answer Options */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {shuffledOptions.map((optionLabel) => (
          <button
            key={optionLabel}
            onClick={() => handleAnswer(optionLabel)}
            className={`p-4 text-xl font-black rounded-xl transition-all duration-300 shadow-md
                                       ${getButtonClass(optionLabel)}`}
            disabled={phase !== "question"}
          >
            {optionLabel}
            {phase === "feedback" &&
              optionLabel === selection &&
              isCorrect &&
              " 🎉"}
            {phase === "feedback" &&
              optionLabel === selection &&
              !isCorrect &&
              " ❌"}
          </button>
        ))}
      </div>

      {/* 3. Feedback and Next Controls */}
      {phase === "feedback" && (
        <div className="mt-8 p-4 rounded-xl text-center">
          <p
            className={`text-3xl font-black ${
              isCorrect ? "text-green-600" : "text-red-600"
            } mb-4`}
          >
            {isCorrect
              ? `Correct! That's ${currentScenario.emotion}! (+75 pts) 🔊`
              : `Incorrect. The correct answer is ${currentScenario.emotion}.`}
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg bg-red-600 hover:bg-red-700"
          >
            {currentQIndex < EMOTION_SCENARIOS.length - 1
              ? "Next Expression →"
              : "View Final Score →"}
          </button>
        </div>
      )}
    </div>
  );
}

// =======================================================
// NEW GAME COMPONENT: Situational Response Game (Card 4, Subtopic 2)
// =======================================================
function SituationalResponseGame({
  setPage,
  setPoints,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<
    "scenario" | "question" | "feedback" | "finished"
  >("scenario");

  // Memoize shuffled questions for one game session
  const shuffledQuestions = useMemo(() => {
    return SITUATION_QUESTIONS.sort(() => Math.random() - 0.5);
  }, []);

  const currentQuestion = shuffledQuestions[currentQIndex];
  const maxQuestions = SITUATION_QUESTIONS.length;

  // Shuffle options for the current question
  const shuffledOptions = useMemo(() => {
    // Only re-shuffle options when the question changes
    return currentQuestion.options.sort(() => Math.random() - 0.5);
  }, [currentQIndex]);

  const handlePlayScenario = () => {
    // Play the audio for the scenario
    try {
      const audio = new Audio(currentQuestion.audioAsset);
      audio.play();
    } catch (e) {
      console.error("Scenario audio playback failed:", e);
      alert(`Simulating scenario audio for: ${currentQuestion.scenarioText}.`);
    }

    // Move to the question phase after a short delay (or immediately if audio fails)
    setTimeout(() => {
      setPhase("question");
    }, 2000);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (phase !== "question") return;

    const correct = selectedAnswer === currentQuestion.correctResponse;
    setSelection(selectedAnswer);
    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      setScore((s) => s + 100); // High point value for complex social task
    }

    // Play correct response audio for reinforcement
    // NOTE: In a real app, this should be a clean, modeled recording of the correct response.
    try {
      // Since we don't have separate modeled response audios, we'll just play the scenario audio again
      // OR simply display the correct response text (which the user can read)
      alert(`Modeled Response: "${currentQuestion.correctResponse}"`);
    } catch (e) {
      console.error("Modeling audio playback failed:", e);
    }
  };

  const handleNext = () => {
    if (currentQIndex < maxQuestions - 1) {
      // Move to next question
      setCurrentQIndex(currentQIndex + 1);
      setSelection(null);
      setIsCorrect(null);
      setPhase("scenario"); // Reset to scenario introduction phase
    } else {
      // Game finished
      setPhase("finished");
      setPoints((p) => p + score); // Add total score to global points
    }
  };

  const handleExit = () => setPage("content");

  const getButtonClass = (label: string) => {
    const isThisCorrect = label === currentQuestion.correctResponse;

    if (phase === "feedback") {
      if (isThisCorrect) {
        return "bg-green-500 text-white shadow-xl ring-4 ring-green-300";
      }
      if (selection === label && !isCorrect) {
        return "bg-red-500 text-white ring-4 ring-red-300 opacity-80";
      }
      return "bg-gray-100 text-gray-600 opacity-50 cursor-default";
    }

    return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
  };

  if (phase === "finished") {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl mx-auto border-4 border-green-500 mt-10">
        <h3 className="text-4xl font-extrabold text-green-700 mb-4">
          Social Challenge Complete! 🎉
        </h3>
        <p className="text-2xl text-gray-700 mb-8">
          You scored **{score}** points!
        </p>
        <button
          onClick={handleExit}
          className="px-8 py-3 text-xl font-bold text-white rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
        >
          Back to Adventures
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border-4 border-blue-500">
      <h3 className="text-3xl font-extrabold text-blue-700 mb-4">
        Situational Responses: Choose the Best Words
      </h3>
      <p className="text-xl text-blue-500 mb-8">
        Scenario {currentQIndex + 1} of {maxQuestions}
      </p>

      {/* 1. Visual Prompt (Scenario Image) */}
      <div className="mb-10 p-2 bg-blue-50 rounded-xl shadow-inner border-4 border-blue-200 max-w-md mx-auto">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Scenario: {currentQuestion.scenarioText}
        </p>
        <img
          src={currentQuestion.imageAsset}
          alt={`Scene showing ${currentQuestion.scenarioText}`}
          className="w-full h-auto object-contain mx-auto rounded-lg max-h-64"
        />
      </div>

      {/* --- SCENARIO/AUDIO PHASE --- */}
      {phase === "scenario" && (
        <div className="text-center p-4">
          <p className="text-2xl font-medium text-gray-800 mb-6">
            Click to listen to the situation!
          </p>
          <button
            onClick={handlePlayScenario}
            className="px-8 py-4 text-2xl font-bold text-white rounded-full 
                            bg-purple-600 hover:bg-purple-700 transition shadow-lg flex items-center justify-center mx-auto"
          >
            <span className="text-4xl mr-3">🎧</span> Hear Scenario
          </button>
        </div>
      )}

      {/* --- QUESTION PHASE --- */}
      {(phase === "question" || phase === "feedback") && (
        <>
          <p className="text-2xl font-bold text-gray-800 mb-6">
            What is the best way to respond?
          </p>

          {/* 3. Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shuffledOptions.map((optionLabel) => (
              <button
                key={optionLabel}
                onClick={() => handleAnswer(optionLabel)}
                className={`p-4 text-lg font-black rounded-xl transition-all duration-300 shadow-md h-full text-left
                                       ${getButtonClass(optionLabel)}`}
                disabled={phase !== "question"}
              >
                {optionLabel}
                {phase === "feedback" &&
                  optionLabel === selection &&
                  isCorrect &&
                  " ✅"}
                {phase === "feedback" &&
                  optionLabel === selection &&
                  !isCorrect &&
                  " ❌"}
                {phase === "feedback" &&
                  optionLabel === currentQuestion.correctResponse && (
                    <span className="text-sm font-semibold block pt-1">
                      {" "}
                      (BEST RESPONSE)
                    </span>
                  )}
              </button>
            ))}
          </div>

          {/* 4. Feedback and Next Controls */}
          {phase === "feedback" && (
            <div className="mt-8 p-4 rounded-xl text-center">
              <p
                className={`text-3xl font-black ${
                  isCorrect ? "text-green-600" : "text-red-600"
                } mb-4`}
              >
                {isCorrect
                  ? `Excellent choice! You used great social words! (+100 pts)`
                  : `Good try! The best response is: **${currentQuestion.correctResponse}**`}
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg bg-blue-600 hover:bg-blue-700"
              >
                {currentQIndex < maxQuestions - 1
                  ? "Next Scenario →"
                  : "View Final Score →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Game Screen Component (Speech & Default Logic) ---
function GameScreen({
  activeGame,
  setPage,
  setPoints,
}: {
  activeGame: ActiveGame;
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  if (!activeGame) {
    return (
      <div className="min-h-screen p-10 pt-20 text-center text-xl font-bold">
        Loading...
      </div>
    );
  }

  // --- Special Router Check ---
  if (activeGame.category.title === "Language & Vocabulary") {
    if (activeGame.subtopic.title === "Object naming") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <ObjectNamingGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }
    if (activeGame.subtopic.title === "Action words (verbs)") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <ActionWordsGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }
  }

  if (activeGame.category.title === "Cognitive & Comprehension") {
    if (activeGame.subtopic.title === "Picture-based comprehension") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <PictureComprehensionGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }

    if (activeGame.subtopic.title === "Story listening & answering") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <StoryComprehensionGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }
  }

  // --- NEW SOCIAL & EMOTIONAL CHECKS ---
  if (activeGame.category.title === "Social & Emotional") {
    if (activeGame.subtopic.title === "Facial expression recognition") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <FacialRecognitionGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }
    if (activeGame.subtopic.title === "Situational responses") {
      return (
        <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
          <SituationalResponseGame setPage={setPage} setPoints={setPoints} />
        </div>
      );
    }
  }

  // --- DEFAULT: Speech Game Logic (If not a matching game) ---
  const { category, subtopic } = activeGame;

  const [gamePhase, setGamePhase] = useState<
    "listen" | "playing" | "speak" | "feedback"
  >("listen");

  // Determine the target content and the audio file path
  let targetText: string;
  let audioFile: string;
  let repetitionCount: number | null = null;
  let visualAsset: string | null = null;

  if (subtopic.title.includes("Phoneme articulation")) {
    targetText = "/sh/ sound";
    audioFile = shSound;
    repetitionCount = 10;
  } else if (subtopic.title.includes("Word-level articulation")) {
    targetText = "Word: 'Rabbit'";
    audioFile = rabbitSound;
    visualAsset = rabbitImage;
    repetitionCount = 6;
  } else {
    targetText = subtopic.title;
    audioFile = "";
  }

  const isRepetitionGame = repetitionCount !== null;

  const requiresVisualPrompt = (subtopicTitle: string) => {
    const visualKeywords = [
      "Word-level",
      "Object naming",
      "Opposites",
      "Picture-based",
      "Matching",
      "Sequencing",
    ];
    return visualKeywords.some((keyword) => subtopicTitle.includes(keyword));
  };

  const showImage = requiresVisualPrompt(subtopic.title) && visualAsset;

  // Functional Audio Playback Logic
  const handlePlaySound = () => {
    setGamePhase("playing");

    if (audioFile) {
      try {
        const audio = new Audio(audioFile);
        audio.play();

        audio.onended = () => {
          setGamePhase("speak");
        };

        setTimeout(() => {
          if (gamePhase === "playing") {
            console.log("Audio failed or blocked. Proceeding to Speak phase.");
            setGamePhase("speak");
          }
        }, 3000);
      } catch (e) {
        console.error("Audio playback failed:", e);
        alert(
          `Audio function triggered! (Simulated Playback for: ${targetText}). Proceeding to Practice phase.`
        );
        setTimeout(() => {
          setGamePhase("speak");
        }, 1000);
      }
    } else {
      alert(
        "No specific audio file defined for this activity yet. Proceeding to Practice phase."
      );
      setTimeout(() => {
        setGamePhase("speak");
      }, 1000);
    }
  };

  // Handler for completing the practice phase (used for both single and repetition tasks)
  const handleCompletePractice = () => {
    setGamePhase("feedback");
  };

  // Final handler to exit the game
  const handleFinishGame = () => {
    setPoints((p) => p + 50);
    setPage("content");
  };

  return (
    <div className="min-h-screen p-8 pt-20 text-center bg-gray-100">
      <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
        {category.title}
      </h2>
      <h3 className="text-2xl font-semibold text-indigo-500 mb-12">
        Activity: {subtopic.title}
      </h3>

      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto border-4 border-purple-300">
        {/* --- 1. VISUAL PROMPT AREA (CONDITIONAL RENDERING) --- */}
        {showImage && (
          <div className="mb-10">
            <p className="text-xl text-gray-700 font-medium mb-4">
              Look at this image:
            </p>
            <div className="flex justify-center items-center h-40 bg-yellow-50 p-4 rounded-xl shadow-inner border-b-4 border-yellow-200">
              {/* Renders the actual image asset */}
              {showImage && visualAsset ? (
                <img
                  src={visualAsset as string}
                  alt="Visual target"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-7xl">🖼️</span>
              )}
            </div>
          </div>
        )}

        <p className="text-4xl font-black text-indigo-900 mb-10">
          {targetText}
        </p>

        {gamePhase === "listen" && (
          <>
            <p className="text-2xl text-gray-700 font-medium mb-6">
              {showImage
                ? "Now, Listen to the target:"
                : "First, Listen to the sound:"}
            </p>

            <button
              onClick={handlePlaySound}
              className="mb-12 px-8 py-4 text-2xl font-bold text-white rounded-full 
                                                       bg-blue-600 hover:bg-blue-700 transition shadow-lg flex items-center justify-center mx-auto"
            >
              <span className="text-4xl mr-3">🔊</span> Listen Now!
            </button>
          </>
        )}

        {gamePhase === "playing" && (
          <div className="mb-12 p-4 text-2xl font-black text-blue-700 border border-blue-400 rounded-xl bg-blue-100 mx-auto max-w-sm animate-pulse">
            <span className="text-4xl mr-3">🎧</span> Playing Audio...
          </div>
        )}

        {gamePhase === "speak" && (
          <>
            {isRepetitionGame ? (
              <div className="p-8 bg-purple-50 rounded-xl border-4 border-purple-200">
                <p className="text-2xl font-bold text-purple-800 mb-4">
                  Your Turn!
                </p>
                <p className="text-xl font-semibold text-gray-700 mb-6">
                  Repeat the sound {targetText} {repetitionCount} times at your
                  own pace!
                </p>
                <button
                  onClick={handleCompletePractice}
                  className="mt-6 px-6 py-3 text-xl font-bold text-white rounded-lg 
                                                         bg-indigo-600 hover:bg-indigo-700 transition shadow-lg"
                >
                  I Finished My {repetitionCount} Repetitions! 🎉
                </button>
              </div>
            ) : (
              <>
                <p className="text-2xl font-medium mb-6">
                  Next, Say the target sound/word into the microphone:
                </p>
                <button
                  onClick={handleCompletePractice}
                  className="mb-12 px-10 py-5 text-2xl font-black text-white rounded-full 
                                                       bg-red-500 hover:bg-red-600 transition shadow-2xl shadow-red-300/50"
                >
                  <span className="text-4xl mr-3">🎤</span> Start Speaking!
                </button>
              </>
            )}
          </>
        )}

        {gamePhase === "feedback" && (
          <div className="p-8 bg-green-50 rounded-xl">
            <p className="text-3xl font-black text-green-700 mb-4">
              Great Job! 🎉
            </p>
            <p className="text-xl text-gray-700">
              (Simulated recognition: Activity complete!)
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleFinishGame}
        disabled={gamePhase !== "feedback"}
        className={`mt-10 px-8 py-3 text-xl font-bold text-white rounded-full transition shadow-lg ${
          gamePhase === "feedback"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {gamePhase === "feedback"
          ? "Continue to Adventures (+50 pts) 🏆"
          : "Complete the activity first..."}
      </button>
    </div>
  );
}

// --- Main App Component (Router & State Management) ---
// Using React.FC to explicitly define the component type and help with JSX namespace issue
export default function App(): React.FC {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const [page, setPage] = useState<"home" | "content" | "game">("home");
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const [points, setPoints] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("sfw_points_v1");
      return raw ? JSON.parse(raw) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sfw_points_v1", JSON.stringify(points));
    } catch {}
  }, [points]);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-gray-800">
      {/* Conditional Rendering Logic (Router) */}
      {page === "home" ? (
        <Home setPage={setPage} />
      ) : page === "game" ? (
        // Use a wrapper to check the game type and render the specific game component
        <div className="min-h-screen bg-gray-100">
          {activeGame?.category.title === "Language & Vocabulary" &&
          activeGame.subtopic.title === "Object naming" ? (
            <div className="p-8 pt-20">
              <ObjectNamingGame setPage={setPage} setPoints={setPoints} />
            </div>
          ) : activeGame?.category.title === "Language & Vocabulary" &&
            activeGame.subtopic.title === "Action words (verbs)" ? (
            <div className="p-8 pt-20">
              <ActionWordsGame setPage={setPage} setPoints={setPoints} />
            </div>
          ) : activeGame?.category.title === "Cognitive & Comprehension" &&
            activeGame.subtopic.title === "Picture-based comprehension" ? (
            <div className="p-8 pt-20">
              <PictureComprehensionGame
                setPage={setPage}
                setPoints={setPoints}
              />
            </div>
          ) : activeGame?.category.title === "Cognitive & Comprehension" &&
            activeGame.subtopic.title === "Story listening & answering" ? (
            <div className="p-8 pt-20">
              <StoryComprehensionGame setPage={setPage} setPoints={setPoints} />
            </div>
          ) : activeGame?.category.title === "Social & Emotional" &&
            activeGame.subtopic.title === "Facial expression recognition" ? (
            <div className="p-8 pt-20">
              <FacialRecognitionGame setPage={setPage} setPoints={setPoints} />
            </div>
          ) : activeGame?.category.title === "Social & Emotional" &&
            activeGame.subtopic.title === "Situational responses" ? (
            <div className="p-8 pt-20">
              <SituationalResponseGame
                setPage={setPage}
                setPoints={setPoints}
              />
            </div>
          ) : (
            <GameScreen
              activeGame={activeGame}
              setPage={setPage}
              setPoints={setPoints}
            />
          )}
        </div>
      ) : (
        <AppContent
          points={points}
          setPoints={setPoints}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
          setPage={setPage}
          setActiveGame={setActiveGame}
        />
      )}
    </div>
  );
}

// --- AppContent Component (The Categories Page) ---
function AppContent({
  points,
  setPoints,
  openCategory,
  setOpenCategory,
  setPage,
  setActiveGame,
}: {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  openCategory: Category | null;
  setOpenCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
  setActiveGame: React.Dispatch<React.SetStateAction<ActiveGame>>;
}) {
  useKeyDown("Escape", () => setOpenCategory(null));

  return (
    <div
      className="min-h-screen pt-16 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-4 md:px-8 py-4 gap-4 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-md">
        {/* Header content: Logo and Home button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-2 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-full px-3 py-1.5 hover:bg-indigo-200 transition"
          >
            <span className="text-xl">🏠</span> Home
          </button>

          {/* Logo on AppContent (Categories Page) */}
          <div className="flex items-center gap-2 hidden sm:flex">
            <img
              src={logoImage}
              alt="Unpuzzle Logo"
              className="h-16 w-auto" // Adjust size as needed
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-white shadow-lg rounded-full px-4 py-2 font-bold text-lg text-purple-600 border border-purple-200">
            🏆 {points} pts
          </div>
          <button
            className="text-sm bg-gray-100 border border-gray-200 text-gray-600 rounded-lg px-3 py-1.5 hover:bg-red-50 hover:text-red-600 transition"
            onClick={() => {
              if (confirm("Reset points?")) {
                setPoints(0);
              }
            }}
            title="Reset points"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main Category Grid Container - Content only */}
      <main className="relative z-10 p-5 md:p-8 max-w-7xl mx-auto">
        <p className="text-center text-3xl font-extrabold text-indigo-900 mb-10 drop-shadow-sm">
          Choose a FUN ADVENTURE to begin!
        </p>

        {/* 📐 STAGGERED GRID */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6"
          role="list"
        >
          {CATEGORIES.map((c, index) => {
            let outerClass =
              "min-h-[140px] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] transform-gpu overflow-hidden";

            // --- Grid Logic (Staggered Layout) ---
            if (index < 4) {
              outerClass += " lg:col-span-1 xl:col-span-2";
            } else {
              outerClass += " lg:col-span-1 xl:col-span-2 lg:mt-8";
              if (index === 4) {
                outerClass += " xl:col-start-2";
              } else if (index === 5) {
                outerClass += " xl:col-start-4";
              } else if (index === 6) {
                outerClass += " xl:col-start-6";
              }
            }
            // --- End Grid Logic ---

            return (
              <div key={c.id} className={outerClass}>
                {" "}
                {/* Outer div gets the grid span */}
                <article
                  role="listitem"
                  onClick={() => setOpenCategory(c)}
                  // ULTRA POP EFFECT APPLIED HERE
                  className="ring-4 ring-white/90 shadow-2xl"
                  style={{
                    boxShadow:
                      "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.9)",
                  }}
                  aria-label={c.title}
                >
                  {/* Outer background is the main gradient */}
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.colorFrom}, ${c.colorTo})`,
                    }}
                  />

                  {/* 🖼️ Inner div: The Card Box - Text contrast fix remains */}
                  <div
                    className="p-5 flex flex-col justify-between h-full text-indigo-900 bg-white/80 backdrop-blur-sm border-2 border-white/90 relative z-20 rounded-2xl"
                    style={{
                      backgroundImage: `url(${c.imageURL})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundBlendMode: "normal",
                      minHeight: "140px",
                    }}
                  >
                    {/* TOP SECTION: Title and Tagline REMOVED */}
                    <div className="flex flex-col gap-1">
                      {/* Empty space maintained */}
                    </div>

                    {/* BOTTOM SECTION: Exercise Count */}
                    <div className="flex justify-between items-center gap-4 pt-4 border-t border-indigo-200 mt-3">
                      <div className="font-semibold opacity-95 text-sm">
                        {c.subtopics.length} exercises
                      </div>
                      <div className="text-2xl opacity-90 font-bold">→</div>
                    </div>
                  </div>
                </article>
                {/* Category Name Below the Card */}
                <div className="text-center mt-3 mb-4">
                  <h3
                    className="inline-block m-0 text-lg font-extrabold text-indigo-900 
                                                   bg-white shadow-md rounded-lg px-3 py-1 border border-indigo-200 relative z-20"
                  >
                    {c.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Modal for Subtopic Selection (Updated Logic) */}
      {openCategory && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenCategory(null);
          }}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl p-6 shadow-2xl relative"
            role="dialog"
            aria-modal="true"
            aria-label={openCategory.title}
          >
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100">
              <div className="flex gap-4 items-center">
                <div>
                  <h2 className="text-2xl font-bold m-0">
                    {openCategory.title}
                  </h2>
                  <p className="text-gray-500 text-base">
                    Select an activity to begin.
                  </p>
                </div>
              </div>
              <button
                className="text-xl text-gray-400 hover:text-gray-700 transition"
                onClick={() => setOpenCategory(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="py-4 max-h-[70vh] overflow-y-auto">
              <h4 className="text-lg font-semibold mb-4 text-indigo-700">
                Subtopics & Activities
              </h4>
              <ul className="space-y-4">
                {openCategory.subtopics.map((s, i) => (
                  <li
                    key={i}
                    className="p-4 bg-white rounded-xl shadow-lg border border-indigo-100 cursor-pointer 
                                                    transition-transform hover:scale-[1.01] hover:shadow-xl group"
                  >
                    <strong className="text-indigo-800 text-lg block group-hover:text-purple-600 transition">
                      {s.title}
                    </strong>
                    {s.example && (
                      <div className="text-sm text-gray-500 mt-1">
                        {s.example}
                      </div>
                    )}
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => {
                          setOpenCategory(null); // Close Modal
                          setActiveGame({
                            category: openCategory,
                            subtopic: s,
                          }); // Set game context
                          setPage("game"); // Switch to game view
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition flex-grow text-center"
                      >
                        Try Quick Activity (+10 pts)
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            "This will open the full exercise screen in the next version."
                          )
                        }
                        className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                      >
                        Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                className="bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition"
                onClick={() => setOpenCategory(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Home Component (Uses home_bg.png) ---
// Defined the Home component explicitly so App() can reference it without compilation errors
function Home({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<"home" | "content" | "game">>;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center p-8 relative z-10 overflow-hidden"
      style={{
        backgroundImage: `url(${homeBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0"
        aria-hidden
      />

      {/* Logo placed at the top left for context */}
      <div className="absolute top-8 left-8 z-10">
        <img
          src={logoImage}
          alt="Unpuzzle Logo"
          className="h-16 w-auto" // Adjust size as needed
        />
      </div>

      {/* Main content area is centered, but now the button container uses absolute positioning */}
      <div className="text-center z-10">
        {/* The large text "Unpuzzle" is already part of your image background */}
      </div>

      {/* FIXED BUTTON CONTAINER: Positioned precisely to avoid overlapping the large title */}
      {/* 🚀 CHANGED top-[65%] TO top-[75%] 🚀 */}
      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-4 z-10">
        <button
          onClick={() => setPage("content")}
          className="px-12 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white shadow-2xl shadow-indigo-400/70 hover:from-red-600 hover:via-yellow-600 hover:to-blue-600 transform transition-all duration-300 hover:scale-110 active:scale-95 ring-8 ring-white/50"
        >
          START THE FUN ADVENTURE!
        </button>

        <p className="text-sm text-white pt-2 font-medium">
          Click here to unlock all the games!
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Sparkles, Dog, Search, ArrowRight, Trophy, Zap } from "lucide-react";

interface DogNameGeneratorUnifiedProps {
  ctaUrl?: string; // Allow custom CTA URL
  apiKey?: string; // Allow custom API key
}

interface QuizAnswers {
  age: string;
  size: string;
  personality: string;
  furType: string;
  activity: string;
  treat: string;
  nameStyle: string;
}

export default function DogNameGeneratorUnified({
  ctaUrl = "/dog-names", // Default to a relative Webflow page
  apiKey = "", // API key from data attribute
}: DogNameGeneratorUnifiedProps) {
  // Mode selection: 'choose' | 'quick' | 'quiz'
  const [mode, setMode] = useState<"choose" | "quick" | "quiz">("choose");

  // Quick mode states
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);

  // Quiz mode states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    age: "",
    size: "",
    personality: "",
    furType: "",
    activity: "",
    treat: "",
    nameStyle: "",
  });

  // Shared states
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generationMode, setGenerationMode] = useState<"quick" | "quiz">(
    "quick"
  );

  // Dog breeds list
  const dogBreeds = [
    "Labrador Retriever",
    "Golden Retriever",
    "German Shepherd",
    "French Bulldog",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Dachshund",
    "Siberian Husky",
    "Boxer",
    "Boston Terrier",
    "Shih Tzu",
    "Chihuahua",
    "Border Collie",
    "Australian Shepherd",
    "Cocker Spaniel",
    "Pomeranian",
    "Maltese",
    "Cavalier King Charles Spaniel",
    "Great Dane",
    "Mastiff",
    "Doberman Pinscher",
    "Saint Bernard",
    "Bernese Mountain Dog",
    "Newfoundland",
    "Bloodhound",
    "Basset Hound",
    "Afghan Hound",
    "Greyhound",
    "Whippet",
    "Italian Greyhound",
    "Jack Russell Terrier",
    "Bull Terrier",
    "Scottish Terrier",
    "West Highland White Terrier",
    "Mixed Breed",
    "Mutt",
    "Designer Mix",
  ];

  const preferences = [
    {
      value: "food",
      label: "🍖 Food",
      emoji: "🍕",
      description: "Delicious treats & meals",
    },
    {
      value: "object",
      label: "⚽ Objects",
      emoji: "🎾",
      description: "Toys, tools & things",
    },
    {
      value: "location",
      label: "🌎 Places",
      emoji: "🏔️",
      description: "Cities, countries & landmarks",
    },
    {
      value: "nature",
      label: "🌺 Nature",
      emoji: "🌸",
      description: "Flowers, trees & elements",
    },
    {
      value: "character",
      label: "🦸 Characters",
      emoji: "🎭",
      description: "Movies, books & heroes",
    },
    {
      value: "color",
      label: "🎨 Colors",
      emoji: "🌈",
      description: "Vibrant hues & shades",
    },
    {
      value: "traditional",
      label: "👑 Traditional",
      emoji: "⭐",
      description: "Popular & trending names",
    },
    {
      value: "millennial",
      label: "📱 Millennial",
      emoji: "💿",
      description: "90s kids vibes",
    },
    {
      value: "genz",
      label: "🔥 Gen Z",
      emoji: "✨",
      description: "Internet culture & slang",
    },
    {
      value: "genalpha",
      label: "🚀 Gen Alpha",
      emoji: "🎮",
      description: "Digital natives & memes",
    },
  ];

  const quizQuestions = [
    {
      id: "age",
      question: "What's your dog's age?",
      emoji: "🎂",
      options: [
        { value: "puppy", label: "Puppy (under 1 year)", emoji: "🐶" },
        { value: "young", label: "Young adult (1-3 years)", emoji: "🐕" },
        { value: "mature", label: "Mature (4-7 years)", emoji: "🦮" },
        { value: "senior", label: "Senior (8+ years)", emoji: "🐕‍🦺" },
      ],
    },
    {
      id: "size",
      question: "What's your dog's size?",
      emoji: "📏",
      options: [
        { value: "teacup", label: "Teacup (Under 5 lbs)", emoji: "🐁" },
        { value: "small", label: "Small (5-20 lbs)", emoji: "🐕" },
        { value: "medium", label: "Medium (20-50 lbs)", emoji: "🐩" },
        { value: "large", label: "Large (50-90 lbs)", emoji: "🦮" },
        { value: "giant", label: "Giant (90+ lbs)", emoji: "🐕‍🦺" },
      ],
    },
    {
      id: "personality",
      question: "Which best describes your dog's personality?",
      emoji: "🎭",
      options: [
        { value: "goofy", label: "Goofy & playful", emoji: "🤪" },
        { value: "loyal", label: "Loyal & protective", emoji: "🛡️" },
        { value: "elegant", label: "Elegant & graceful", emoji: "👑" },
        {
          value: "mischievous",
          label: "Mischievous troublemaker",
          emoji: "😈",
        },
        { value: "calm", label: "Calm & chill", emoji: "😌" },
      ],
    },
    {
      id: "furType",
      question: "What's your dog's fur type?",
      emoji: "✂️",
      options: [
        { value: "short", label: "Short & sleek", emoji: "✨" },
        { value: "long", label: "Long & flowing", emoji: "💇‍♀️" },
        { value: "curly", label: "Curly or wavy", emoji: "🌀" },
        { value: "fluffy", label: "Fluffy & thick", emoji: "☁️" },
        {
          value: "hairless",
          label: "Hairless or very short fuzz",
          emoji: "🧴",
        },
      ],
    },
    {
      id: "activity",
      question: "Your dog's favorite activity is...",
      emoji: "🎾",
      options: [
        { value: "chasing", label: "Chasing balls or frisbees", emoji: "🎾" },
        { value: "snuggling", label: "Snuggling on the couch", emoji: "🛋️" },
        { value: "exploring", label: "Exploring the outdoors", emoji: "🏔️" },
        { value: "training", label: "Training & learning tricks", emoji: "🎯" },
        { value: "barking", label: "Barking at strangers", emoji: "🗣️" },
      ],
    },
    {
      id: "treat",
      question: "Pick a treat your dog can't resist:",
      emoji: "🦴",
      options: [
        { value: "peanutbutter", label: "Peanut butter", emoji: "🥜" },
        { value: "bacon", label: "Bacon", emoji: "🥓" },
        { value: "cheese", label: "Cheese", emoji: "🧀" },
        { value: "chicken", label: "Chicken", emoji: "🍗" },
        { value: "anything", label: "Anything edible", emoji: "🍽️" },
      ],
    },
    {
      id: "nameStyle",
      question: "Do you want your dog's name to be...",
      emoji: "💎",
      options: [
        { value: "cute", label: "Cute & sweet", emoji: "🥰" },
        { value: "strong", label: "Strong & bold", emoji: "💪" },
        { value: "funny", label: "Funny & quirky", emoji: "😂" },
        { value: "classy", label: "Classy & timeless", emoji: "🎩" },
        { value: "unique", label: "Unique & rare", emoji: "⭐" },
      ],
    },
  ];

  const filteredBreeds = dogBreeds
    .filter((dogBreed) => dogBreed.toLowerCase().includes(breed.toLowerCase()))
    .slice(0, 10);

  const handleQuizAnswerSelect = (questionId: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateQuizNames();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getPersonalityType = () => {
    if (
      quizAnswers.personality === "goofy" ||
      quizAnswers.activity === "chasing"
    )
      return "goofball";
    if (quizAnswers.personality === "loyal") return "protector";
    if (
      quizAnswers.personality === "elegant" ||
      quizAnswers.nameStyle === "classy"
    )
      return "royal";
    if (
      quizAnswers.personality === "mischievous" ||
      quizAnswers.nameStyle === "funny"
    )
      return "clown";
    if (
      quizAnswers.personality === "calm" ||
      quizAnswers.activity === "snuggling"
    )
      return "zen";
    return "goofball";
  };

  const generateQuickNames = async () => {
    if (!breed || !gender || !preference) {
      alert("Please fill in all fields!");
      return;
    }

    setGenerationMode("quick");
    await generateNames(
      `Generate 5 creative and playful dog names for a ${gender} ${breed} dog. The names should be inspired by ${preference}. Make the names fun, memorable, and suitable for a beloved pet. Return only the names, one per line, without numbers or bullets.`
    );
  };

  const generateQuizNames = async () => {
    setGenerationMode("quiz");
    const personalityType = getPersonalityType();
    const prompt = `Based on this dog quiz profile, generate 5 perfect dog names:

Age: ${quizAnswers.age}
Size: ${quizAnswers.size}  
Personality: ${quizAnswers.personality}
Fur Type: ${quizAnswers.furType}
Favorite Activity: ${quizAnswers.activity}
Favorite Treat: ${quizAnswers.treat}
Name Style Preference: ${quizAnswers.nameStyle}

Personality Type: ${personalityType}

Generate 5 creative dog names that match this personality profile. Make them ${quizAnswers.nameStyle} and suitable for a ${quizAnswers.personality} ${quizAnswers.size} dog. Consider their ${quizAnswers.furType} fur and love for ${quizAnswers.activity}. Return only the names, one per line, without numbers or bullets.`;

    await generateNames(prompt);
  };

  const generateNames = async (prompt: string) => {
    setIsLoading(true);
    setShowResults(false);

    try {
      // Use API key from props (data-api-key attribute) or fallback to window object
      const effectiveApiKey = apiKey || (window as any).GEMINI_API_KEY;

      if (!effectiveApiKey) {
        throw new Error(
          "Gemini API key not found. Please add data-api-key attribute to the widget container."
        );
      }

      // Try different Gemini API endpoints (fastest models first for dog names)
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${effectiveApiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${effectiveApiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${effectiveApiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`,
      ];

      let response;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 256, // Reduced for faster generation
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
              ],
            }),
          });

          if (response.ok) {
            console.log("✅ API call successful with endpoint:", endpoint);
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!response || !response.ok) {
        const errorData = await response?.json().catch(() => null);
        console.error("API Error:", errorData);

        if (response?.status === 400) {
          throw new Error(
            "Invalid API key. Please check your Gemini API key or get a new one from https://makersuite.google.com/app/apikey"
          );
        } else if (response?.status === 404) {
          throw new Error(
            "Gemini API model not found. Your API key may be outdated. Please get a new key from https://makersuite.google.com/app/apikey"
          );
        }
        throw new Error(`HTTP error! status: ${response?.status || 'unknown'}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        const names = generatedText
          .split("\n")
          .filter((name: string) => name.trim())
          .slice(0, 5);
        setGeneratedNames(names);
        setShowResults(true);
      } else {
        throw new Error("No names generated");
      }
    } catch (error) {
      console.error("Error generating names:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to generate names. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetToChoice = () => {
    setMode("choose");
    setShowResults(false);
    setGeneratedNames([]);
    setCurrentQuestion(0);
    setBreed("");
    setGender("");
    setPreference("");
    setQuizAnswers({
      age: "",
      size: "",
      personality: "",
      furType: "",
      activity: "",
      treat: "",
      nameStyle: "",
    });
  };

  // Mode Selection Screen
  if (mode === "choose") {
    return (
      <div
        style={{
          maxWidth: "1180px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 24px",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
          color: "#2d3436",
          textAlign: "center",
        }}
      >
        <Dog size={48} style={{ color: "#fd79a8", marginBottom: "16px" }} />
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            color: "#2d3436",
          }}
        >
          Dog Name Generator
        </h1>
        <p style={{ fontSize: "18px", color: "#636e72", margin: "0 0 32px 0" }}>
          Choose your perfect naming experience
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => setMode("quick")}
            style={{
              padding: "24px 20px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #00b894 0%, #55a3ff 100%)",
              color: "white",
              textAlign: "center",
              transition: "all 0.3s",
              boxShadow: "0 8px 20px rgba(0, 184, 148, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(0, 184, 148, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0, 184, 148, 0.3)";
            }}
          >
            <Zap size={32} style={{ marginBottom: "12px" }} />
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                margin: "0 0 8px 0",
              }}
            >
              Quick Generate
            </h3>
            <p style={{ fontSize: "14px", opacity: "0.9", margin: "0" }}>
              Fast & simple - pick breed, gender, and style for instant names
            </p>
            <div style={{ fontSize: "12px", opacity: "0.8", marginTop: "8px" }}>
              ⏱️ 30 seconds
            </div>
          </button>

          <button
            onClick={() => setMode("quiz")}
            style={{
              padding: "24px 20px",
              borderRadius: "16px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #ff8a65 60%, #ffb366 100%)",
              color: "white",
              textAlign: "center",
              transition: "all 0.3s",
              boxShadow: "0 8px 20px rgba(255, 138, 101, 0.4)",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(255, 138, 101, 0.5)";
              e.currentTarget.style.border = "2px solid rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(255, 138, 101, 0.4)";
              e.currentTarget.style.border = "2px solid rgba(255,255,255,0.2)";
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "rgba(255,255,255,0.9)",
                  color: "#ff8a65",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                ⭐ POPULAR
              </div>
              <Trophy size={32} style={{ marginBottom: "12px" }} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                margin: "0 0 8px 0",
              }}
            >
              Take Quiz
            </h3>
            <p style={{ fontSize: "14px", opacity: "0.9", margin: "0" }}>
              Personalized experience - 7 questions for perfectly tailored names
            </p>
            <div style={{ fontSize: "12px", opacity: "0.8", marginTop: "8px" }}>
              🎯 2 minutes
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const personalityType =
      generationMode === "quiz" ? getPersonalityType() : null;
    const personalityEmojis = {
      goofball: "🤪",
      protector: "🛡️",
      royal: "👑",
      clown: "🤡",
      zen: "🧘‍♀️",
    };

    const personalityDescriptions = {
      goofball:
        "Your pup is playful, lovable, and a little ridiculous (in the best way)!",
      protector:
        "Strong, commanding, and loyal - a guardian with a heart of gold.",
      royal: "Your pup has regal vibes and deserves a name fit for royalty.",
      clown:
        "The life of the party — always making you laugh and sometimes a little chaotic.",
      zen: "Calm, gentle, and wise - your dog embodies peaceful energy.",
    };

    // Signature name suggestions from the quiz
    const signatureNames = {
      goofball: {
        name: "Biscuit",
        reason:
          "Because your pup is playful, lovable, and a little ridiculous (in the best way). Biscuit is lighthearted, easy to yell across a park, and always gets smiles.",
      },
      protector: {
        name: "Titan",
        reason:
          'Strong, commanding, and loyal - just like your dog. Titan says "Don\'t mess with me" but also "I\'ll guard your heart forever."',
      },
      royal: {
        name: "Duchess",
        reason:
          "Your pup has regal vibes and deserves a name fit for royalty. Duchess is elegant, timeless, and perfect for dogs who expect the red-carpet treatment.",
      },
      clown: {
        name: "Pickles",
        reason:
          "Because your dog is the life of the party — always making you laugh and sometimes a little too chaotic. Pickles is as unique and silly as your pup.",
      },
      zen: {
        name: "Willow",
        reason:
          "Calm, gentle, and wise - your dog embodies peaceful energy. Willow is perfect for the laid-back soul who just wants cuddles and sunshine.",
      },
    };

    const ctaMessages = {
      goofball: "Want 50+ more fun dog names?",
      protector: "Want to see more powerful dog names?",
      royal: "Want 50+ more classy dog names?",
      clown: "Want even wackier dog name ideas?",
      zen: "Want 50+ more peaceful, unique dog names?",
    };

    const ctaDescriptions = {
      goofball:
        "Discover hundreds more playful names, fun games, and connect with other dog lovers in our community.",
      protector:
        "Explore our complete collection of strong names, plus training tips and bonding activities for loyal pups.",
      royal:
        "Browse our elegant name database, breed guides, and styling inspiration for your sophisticated companion.",
      clown:
        "Find even more quirky names, take fun personality quizzes, and share your pup's silly moments.",
      zen: "Access our peaceful name collection plus calming tips and wellness advice for your zen companion.",
    };

    return (
      <div
        style={{
          maxWidth: "1180px",
          width: "100%",
          margin: "0 auto",
          padding: "24px",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
          color: "#2d3436",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {generationMode === "quick"
            ? "⚡"
            : personalityEmojis[
                personalityType as keyof typeof personalityEmojis
              ]}
        </div>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: "0 0 8px 0",
            color: generationMode === "quick" ? "#55a3ff" : "#f66220",
          }}
        >
          {generationMode === "quick"
            ? `Perfect Names for Your ${gender} ${breed}! 🎉`
            : `Your Dog is "The ${personalityType
                ?.charAt(0)
                .toUpperCase()}${personalityType?.slice(1)}"!`}
        </h2>

        {generationMode === "quiz" && personalityType && (
          <p
            style={{ fontSize: "16px", color: "#636e72", margin: "0 0 24px 0" }}
          >
            {
              personalityDescriptions[
                personalityType as keyof typeof personalityDescriptions
              ]
            }
          </p>
        )}

        {/* Signature Name Section for Quiz Results */}
        {generationMode === "quiz" && personalityType && (
          <div
            style={{
              background: "linear-gradient(135deg, #f66220 0%, #ff8a65 100%)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              border: "1px solid rgba(246, 98, 32, 0.2)",
              color: "white",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                margin: "0 0 8px 0",
                color: "white",
                fontWeight: "600",
              }}
            >
              Your perfect dog name is...
            </h3>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "white",
                marginBottom: "12px",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {
                signatureNames[personalityType as keyof typeof signatureNames]
                  ?.name
              }
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.95)",
                margin: "0",
                lineHeight: "1.4",
              }}
            >
              {
                signatureNames[personalityType as keyof typeof signatureNames]
                  ?.reason
              }
            </p>
          </div>
        )}

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            margin: "0 0 16px 0",
            color: generationMode === "quiz" ? "#f66220" : "#55a3ff",
          }}
        >
          {generationMode === "quiz"
            ? "🎉 More Perfect Names"
            : "🎉 Your Perfect Names"}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#636e72",
            margin: "0 0 24px 0",
            lineHeight: "1.4",
          }}
        >
          {generationMode === "quiz"
            ? "Here are your personalized name suggestions based on your dog's unique personality!"
            : "Here are your perfect dog names based on your preferences!"}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
            maxWidth: "100%",
          }}
        >
          {generatedNames.map((name, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "16px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#2d3436",
                textAlign: "center",
                border: "2px solid #e9ecef",
                animation: `slideIn 0.4s ease-out ${index * 0.1}s both`,
                transition: "all 0.3s",
                cursor: "pointer",
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform =
                  "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  generationMode === "quiz"
                    ? "0 8px 25px rgba(246, 98, 32, 0.2)"
                    : "0 8px 25px rgba(85, 163, 255, 0.2)";
                e.currentTarget.style.borderColor =
                  generationMode === "quiz" ? "#f66220" : "#55a3ff";
                e.currentTarget.style.color =
                  generationMode === "quiz" ? "#f66220" : "#55a3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#e9ecef";
                e.currentTarget.style.color = "#2d3436";
              }}
            >
              <span style={{ transition: "color 0.2s ease" }}>{name}</span>
            </div>
          ))}
        </div>

        {/* CTA Section for Quiz Results */}
        {generationMode === "quiz" && personalityType && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              border: "2px solid #e9ecef",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h4
              style={{
                fontSize: "18px",
                margin: "0 0 8px 0",
                color: "#f66220",
                fontWeight: "700",
              }}
            >
              {ctaMessages[personalityType as keyof typeof ctaMessages]}
            </h4>
            <p
              style={{
                fontSize: "14px",
                color: "#636e72",
                margin: "0 0 16px 0",
                lineHeight: "1.4",
              }}
            >
              {ctaDescriptions[personalityType as keyof typeof ctaDescriptions]}
            </p>
            <button
              onClick={() => (window.location.href = ctaUrl)}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                background: "linear-gradient(135deg, #f66220 0%, #ff8a65 100%)",
                color: "white",
                transition: "all 0.2s",
                boxShadow: "0 4px 15px rgba(246, 98, 32, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(246, 98, 32, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(246, 98, 32, 0.3)";
              }}
            >
              🎉 Explore More Names & Features
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={resetToChoice}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "2px solid #ddd",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              background: "white",
              color: "#636e72",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#f66220";
              e.currentTarget.style.color = "#f66220";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#636e72";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🔄 Try Different Method
          </button>
        </div>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "#b2bec3",
          }}
        >
          <p style={{ margin: "0" }}>Powered by Google Gemini AI ✨</p>
        </div>
      </div>
    );
  }

  // Quick Mode
  if (mode === "quick") {
    return (
      <>
        <div
          style={{
            maxWidth: "1180px",
            width: "100%",
            margin: "0 auto",
            padding: "24px",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
            color: "#2d3436",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <Zap size={32} style={{ color: "#55a3ff" }} />
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  margin: "0",
                  color: "#55a3ff",
                }}
              >
                Quick Generate
              </h1>
            </div>
            <p style={{ fontSize: "16px", color: "#636e72", margin: "0" }}>
              Fast & simple name generation ⚡
            </p>
            <button
              onClick={resetToChoice}
              style={{
                fontSize: "12px",
                color: "#55a3ff",
                margin: "8px 0 0 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Back to Options
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Breed Search */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#2d3436",
                }}
              >
                🐕 Dog Breed
              </label>
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#b2bec3",
                  }}
                />
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => {
                    setBreed(e.target.value);
                    setShowBreedDropdown(true);
                  }}
                  onFocus={(e) => {
                    setShowBreedDropdown(true);
                    e.currentTarget.style.borderColor = "#55a3ff";
                  }}
                  onBlur={(e) => {
                    setTimeout(() => setShowBreedDropdown(false), 200);
                    e.currentTarget.style.borderColor = "#ddd";
                  }}
                  placeholder="Search for your dog's breed..."
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 40px",
                    borderRadius: "12px",
                    border: "2px solid #ddd",
                    fontSize: "16px",
                    outline: "none",
                    background: "white",
                    color: "#2d3436",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              {showBreedDropdown && breed && filteredBreeds.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "8px",
                    marginTop: "4px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                >
                  {filteredBreeds.map((dogBreed, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setBreed(dogBreed);
                        setShowBreedDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        background: "transparent",
                        color: "#333",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "14px",
                        borderBottom:
                          index < filteredBreeds.length - 1
                            ? "1px solid rgba(0,0,0,0.1)"
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(102, 126, 234, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {dogBreed}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#2d3436",
                }}
              >
                👫 Gender
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      border:
                        gender === g ? "2px solid #55a3ff" : "2px solid #ddd",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: gender === g ? "#55a3ff" : "white",
                      color: gender === g ? "white" : "#636e72",
                      textTransform: "capitalize",
                    }}
                    onMouseEnter={(e) => {
                      if (gender !== g) {
                        e.currentTarget.style.borderColor = "#55a3ff";
                        e.currentTarget.style.color = "#55a3ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (gender !== g) {
                        e.currentTarget.style.borderColor = "#ddd";
                        e.currentTarget.style.color = "#636e72";
                      }
                    }}
                  >
                    {g === "male" ? "🐕" : "🐩"} {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Inspiration */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#2d3436",
                }}
              >
                ✨ Name Inspiration
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                {preferences.map((pref) => (
                  <button
                    key={pref.value}
                    onClick={() => setPreference(pref.value)}
                    style={{
                      padding: "16px 12px",
                      borderRadius: "12px",
                      border:
                        preference === pref.value
                          ? "2px solid #55a3ff"
                          : "2px solid #ddd",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      background:
                        preference === pref.value ? "#55a3ff" : "white",
                      color: preference === pref.value ? "white" : "#636e72",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => {
                      if (preference !== pref.value) {
                        e.currentTarget.style.borderColor = "#55a3ff";
                        e.currentTarget.style.color = "#55a3ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (preference !== pref.value) {
                        e.currentTarget.style.borderColor = "#ddd";
                        e.currentTarget.style.color = "#636e72";
                      }
                    }}
                  >
                    <div style={{ fontSize: "18px" }}>{pref.emoji}</div>
                    <div style={{ fontSize: "14px", fontWeight: "700" }}>
                      {pref.label.includes("Gen")
                        ? pref.label.split(" ")[1] +
                          " " +
                          pref.label.split(" ")[2]
                        : pref.label.split(" ")[1]}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: preference === pref.value ? "0.9" : "0.8",
                      }}
                    >
                      {pref.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQuickNames}
              disabled={isLoading || !breed || !gender || !preference}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  isLoading || !breed || !gender || !preference
                    ? "not-allowed"
                    : "pointer",
                background:
                  isLoading || !breed || !gender || !preference
                    ? "#d1d5db"
                    : "#55a3ff",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px",
                transition: "all 0.2s",
                boxShadow:
                  !isLoading && breed && gender && preference
                    ? "0 4px 6px -1px rgba(85, 163, 255, 0.3), 0 2px 4px -1px rgba(85, 163, 255, 0.2)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && breed && gender && preference) {
                  e.currentTarget.style.background = "#4a90e2";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(85, 163, 255, 0.4), 0 4px 6px -2px rgba(85, 163, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && breed && gender && preference) {
                  e.currentTarget.style.background = "#55a3ff";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(85, 163, 255, 0.3), 0 2px 4px -1px rgba(85, 163, 255, 0.2)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Names
                </>
              )}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </>
    );
  }

  // Quiz Mode (similar to the existing quiz logic but integrated)
  if (mode === "quiz") {
    const currentQ = quizQuestions[currentQuestion];
    const currentAnswer = quizAnswers[currentQ.id as keyof QuizAnswers];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <>
        <div
          style={{
            maxWidth: "1180px",
            width: "100%",
            margin: "0 auto",
            padding: "24px",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            marginBottom: "32px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            color: "#374151",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <Trophy size={32} style={{ color: "#F56220" }} />
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  margin: "0",
                  color: "#111827",
                }}
              >
                Personality Quiz
              </h1>
            </div>
            <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
              Discover your dog's perfect name ✨
            </p>
            <button
              onClick={resetToChoice}
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "8px 0 0 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Back to Options
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "#f3f4f6",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#F56220",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {currentQ.emoji}
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: "0",
                color: "#111827",
              }}
            >
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  handleQuizAnswerSelect(currentQ.id, option.value)
                }
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border:
                    currentAnswer === option.value
                      ? "2px solid #F56220"
                      : "2px solid #e5e7eb",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    currentAnswer === option.value ? "#F56220" : "white",
                  color: currentAnswer === option.value ? "white" : "#374151",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  minHeight: "80px",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  if (currentAnswer !== option.value) {
                    e.currentTarget.style.borderColor = "#F56220";
                    e.currentTarget.style.color = "#F56220";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentAnswer !== option.value) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
              >
                <span style={{ fontSize: "20px" }}>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "16px",
                fontWeight: "600",
                cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                background: "white",
                color: currentQuestion === 0 ? "#9ca3af" : "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
            >
              ← Back
            </button>

            {currentAnswer && (
              <button
                onClick={nextQuestion}
                disabled={isLoading}
                style={{
                  padding: "12px 32px",
                  background: isLoading ? "#d1d5db" : "#F56220",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = "#e55a1d";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = "#F56220";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Generating...
                  </>
                ) : currentQuestion === quizQuestions.length - 1 ? (
                  <>
                    <Sparkles size={16} />
                    Get My Names!
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </>
    );
  }

  return null;
}

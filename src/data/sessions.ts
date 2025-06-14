export interface Pose {
  duration: number; // in seconds
  name: string;
  cue: string;
  image: string;
}

export interface Session {
  id: string; // Using slug as the unique ID
  name: string;
  description: string;
  category: 'Energise' | 'Strength' | 'Desk Relief' | 'Flexibility' | 'Mindfulness' | 'Relax';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All-Levels';
  length: number; // in minutes
  tags: string[];
  instructor: string;
  thumbnail: string; // Path to image
  videoUrl?: string; // Keep for future use
  program?: Pose[];
}

export const sessions: Session[] = [
  {
    "id": "morning-sunrise-flow",
    "name": "Morning Sunrise Flow",
    "description": "A gentle Vinyasa flow to energize your body and greet the day.",
    "category": "Energise",
    "difficulty": "Beginner",
    "length": 10,
    "tags": ["vinyasa", "morning", "full-body"],
    "instructor": "Ava Patel",
    "thumbnail": "/lovable-uploads/e6441b44-9f3c-4885-bbdc-10812ac30a0f.png",
    "program": [
      { "duration": 60, "name": "Easy-Seat Centering", "cue": "Settle into your spine and take three deep breaths.", "image": "/lovable-uploads/c4cea92a-e035-4aed-be77-44b9e21c46db.png" },
      { "duration": 60, "name": "Cat–Cow", "cue": "Gently articulate your spine with your breath.", "image": "/lovable-uploads/7b74422c-72cf-4cae-a131-2173b172a5ac.png" },
      { "duration": 60, "name": "Half Sun Salutation", "cue": "Warm up the shoulders by sweeping your arms overhead.", "image": "/lovable-uploads/2b4d0124-3e50-4cf5-8fc1-ae0b87612818.png" },
      { "duration": 60, "name": "High Lunge (Right)", "cue": "Step your right leg forward, keeping your knee stacked over the ankle.", "image": "/lovable-uploads/36425ed3-3c7a-470b-aa4a-e64d1f568db9.png" },
      { "duration": 60, "name": "High Lunge (Left)", "cue": "Step your left leg forward, maintaining the same alignment.", "image": "/lovable-uploads/162f6795-2764-40d9-b2a9-ff2bacbdc987.png" },
      { "duration": 60, "name": "Downward Dog", "cue": "Gently pedal your feet to awaken your hamstrings.", "image": "/lovable-uploads/a47871b4-dcd8-4e49-bafa-62339a211715.png" },
      { "duration": 60, "name": "Low Cobra", "cue": "Lift your chest gently to open your heart space.", "image": "/lovable-uploads/0ca6648b-dbc8-435b-aeb9-bcd3ff5cf2b4.png" },
      { "duration": 60, "name": "Chair Pose Pulses", "cue": "Sink your hips and find small, controlled pulses.", "image": "/lovable-uploads/f24ab972-a510-4e8a-ad7f-d1d5c08b10e6.png" },
      { "duration": 60, "name": "Forward Fold", "cue": "Hang heavy, keeping your knees soft and releasing your arms.", "image": "/lovable-uploads/41eb127c-0604-48b4-bd70-117b6b2b6ed8.png" },
      { "duration": 60, "name": "Mountain Pose", "cue": "Stand tall, bring your hands to your heart, and connect with your breath.", "image": "/lovable-uploads/313c9caa-4242-4154-9e06-f2baa7588844.png" }
    ]
  },
  {
    "id": "core-stability-pilates",
    "name": "Core Stability Pilates",
    "description": "Strengthen your core and improve posture with this focused Pilates session.",
    "category": "Strength",
    "difficulty": "Intermediate",
    "length": 9,
    "tags": ["pilates", "core", "stability"],
    "instructor": "Diego Ramos",
    "thumbnail": "/lovable-uploads/3973e1c6-f0b9-4359-b326-819f2e428271.png"
  },
  {
    "id": "lunchtime-chair-stretch",
    "name": "Lunchtime Chair Stretch",
    "description": "Relieve tension in your neck, shoulders, and back without leaving your chair.",
    "category": "Desk Relief",
    "difficulty": "Beginner",
    "length": 7,
    "tags": ["seated", "office", "stretch"],
    "instructor": "Jade Nguyen",
    "thumbnail": "/lovable-uploads/337ffd86-4952-49d0-a6ad-7552a944cbe0.png"
  },
  {
    "id": "slow-flow-hips-hamstrings",
    "name": "Slow Flow — Hips & Hamstrings",
    "description": "A mindful practice to release tight hips and hamstrings.",
    "category": "Flexibility",
    "difficulty": "Intermediate",
    "length": 9,
    "tags": ["slow", "yin-inspired", "lower-body"],
    "instructor": "Marco Rossi",
    "thumbnail": "/lovable-uploads/b5b544b9-63a7-452a-b94d-fe1a89f6cf33.png"
  },
  {
    "id": "power-vinyasa-sweat",
    "name": "Power Vinyasa Sweat",
    "description": "A dynamic and challenging flow to build heat, strength, and endurance.",
    "category": "Strength",
    "difficulty": "Advanced",
    "length": 8,
    "tags": ["power", "cardio", "balance"],
    "instructor": "Sofia Hernández",
    "thumbnail": "/lovable-uploads/2cc38afc-3eb4-40b2-a5a6-79ad0e96817a.png"
  },
  {
    "id": "mid-afternoon-micro-meditation",
    "name": "Mid-Afternoon Micro-Meditation",
    "description": "A short, guided meditation to reset your focus and calm your mind.",
    "category": "Mindfulness",
    "difficulty": "All-Levels",
    "length": 7,
    "tags": ["meditation", "focus", "breath"],
    "instructor": "Liam O'Connor",
    "thumbnail": "/lovable-uploads/9a964a3e-bdcf-4085-b7f6-58d03016998d.png"
  },
  {
    "id": "lower-back-love",
    "name": "Lower-Back Love",
    "description": "Gentle stretches and poses to alleviate lower back pain and improve mobility.",
    "category": "Desk Relief",
    "difficulty": "Beginner",
    "length": 9,
    "tags": ["gentle", "back-care", "mobility"],
    "instructor": "Harper Lee",
    "thumbnail": "/lovable-uploads/5ce869b9-9ee9-445e-8eff-66f76ac99f45.png"
  },
  {
    "id": "evening-unwind-restorative",
    "name": "Evening Unwind Restorative",
    "description": "A deeply relaxing practice using props to prepare your body for a restful sleep.",
    "category": "Relax",
    "difficulty": "All-Levels",
    "length": 8,
    "tags": ["restorative", "props", "sleep-prep"],
    "instructor": "Noah Kim",
    "thumbnail": "/lovable-uploads/79b5a332-dc59-480b-9a85-b247e1aafa54.png"
  },
  {
    "id": "45min-total-body-challenge",
    "name": "45 min Total-Body Challenge",
    "description": "Push your limits with this advanced, full-body workout for strength and endurance.",
    "category": "Strength",
    "difficulty": "Advanced",
    "length": 7,
    "tags": ["total-body", "power", "endurance"],
    "instructor": "Chloe Zhang",
    "thumbnail": "/lovable-uploads/49a70081-4e66-4014-a2ec-90fbb6baa5da.png"
  },
  {
    "id": "bedtime-breath-to-sleep",
    "name": "Bedtime Breath-to-Sleep",
    "description": "Simple breathing exercises (Pranayama) to calm your nervous system for sleep.",
    "category": "Relax",
    "difficulty": "Beginner",
    "length": 9,
    "tags": ["pranayama", "sleep", "calm"],
    "instructor": "Ethan Johnson",
    "thumbnail": "/lovable-uploads/5e8e80fa-8eff-4b16-a89f-53339e6993aa.png"
  }
];

export const getSessionById = (id: string): Session | undefined => {
  return sessions.find(session => session.id === id);
};

// For backwards compatibility with any component that might still use the old name
export const getSessionBySlug = getSessionById;

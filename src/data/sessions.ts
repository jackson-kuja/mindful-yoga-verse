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
}

export const sessions: Session[] = [
  {
    "id": "morning-sunrise-flow",
    "name": "Morning Sunrise Flow",
    "description": "A gentle Vinyasa flow to energize your body and greet the day.",
    "category": "Energise",
    "difficulty": "Beginner",
    "length": 20,
    "tags": ["vinyasa", "morning", "full-body"],
    "instructor": "Ava Patel",
    "thumbnail": "/lovable-uploads/e6441b44-9f3c-4885-bbdc-10812ac30a0f.png"
  },
  {
    "id": "core-stability-pilates",
    "name": "Core Stability Pilates",
    "description": "Strengthen your core and improve posture with this focused Pilates session.",
    "category": "Strength",
    "difficulty": "Intermediate",
    "length": 30,
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
    "length": 10,
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
    "length": 25,
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
    "length": 40,
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
    "length": 5,
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
    "length": 15,
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
    "length": 30,
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
    "length": 45,
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
    "length": 12,
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

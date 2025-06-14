
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
    "thumbnail": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1599447512188-3c7556a31d96?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1545350189-b3bf1f829372?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1575052814080-384180a3e351?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1474418397713-7e15e4d5e154?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1604514256612-4ff0c483b1c6?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1603988363607-962456432328?q=80&w=800&auto=format&fit=crop"
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
    "thumbnail": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
  }
];

export const getSessionById = (id: string): Session | undefined => {
  return sessions.find(session => session.id === id);
};

// For backwards compatibility with any component that might still use the old name
export const getSessionBySlug = getSessionById;

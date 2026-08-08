/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyCoffeeOption {
  text: string;
  jordanReply: string;
  friendshipPoints: number;
}

export interface DailyCoffeeDialogue {
  id: string;
  question: string;
  options: DailyCoffeeOption[];
}

export const dailyCoffeeDialogues: DailyCoffeeDialogue[] = [
  {
    id: 'coffee_1',
    question: "Morning! What's your biggest academic focus today?",
    options: [
      {
        text: "Deep work on my research paper in the library.",
        jordanReply: "Nice! I'll hold down a quiet booth for us later if you need extra focus.",
        friendshipPoints: 3
      },
      {
        text: "Surviving my 9 AM lecture with a hot cup of coffee!",
        jordanReply: "Haha, mood! That professor speaks so fast, caffeine is non-negotiable.",
        friendshipPoints: 2
      },
      {
        text: "Reviewing vocabulary and speaking drills with you!",
        jordanReply: "Aww, roommate power! Let's get those speaking confidence points up.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_2',
    question: "Rise and shine! Did you get any sleep last night or were you cramming?",
    options: [
      {
        text: "Got a solid 8 hours, feel completely refreshed!",
        jordanReply: "Teach me your ways! I was up till 2 AM tweaking my slides.",
        friendshipPoints: 3
      },
      {
        text: "Pulled an all-nighter finishing my essay draft.",
        jordanReply: "Oof, take it easy today! Make sure to grab a big lunch later.",
        friendshipPoints: 2
      },
      {
        text: "Somewhere in between—a power nap saved me.",
        jordanReply: "Power naps are a college student's true secret weapon!",
        friendshipPoints: 2
      }
    ]
  },
  {
    id: 'coffee_3',
    question: "Hey! How do you take your coffee or tea in the morning?",
    options: [
      {
        text: "Black coffee, strong and straightforward.",
        jordanReply: "Respect! Pure academic fuel right there.",
        friendshipPoints: 2
      },
      {
        text: "Oat milk latte with a sprinkle of cinnamon.",
        jordanReply: "Fancy! You definitely know how to romanticize campus mornings.",
        friendshipPoints: 3
      },
      {
        text: "Chamomile or Green Tea to keep calm before exams.",
        jordanReply: "Smart choice! Zen vibes are essential during midterm season.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_4',
    question: "Morning! What's your top strategy for staying awake in early lectures?",
    options: [
      {
        text: "Sitting in the front row so the professor looks at me.",
        jordanReply: "Bold move! That definitely forces you to stay sharp.",
        friendshipPoints: 3
      },
      {
        text: "Taking active handwritten notes in a notebook.",
        jordanReply: "Classic! Writing by hand keeps the brain fully engaged.",
        friendshipPoints: 3
      },
      {
        text: "Sipping ice water whenever my eyelids get heavy.",
        jordanReply: "Cold water works every time! Simple and effective.",
        friendshipPoints: 2
      }
    ]
  },
  {
    id: 'coffee_5',
    question: "Biscuit the campus cat was purring outside our door! What's your study spot for today?",
    options: [
      {
        text: "The sunlit study nook on the 3rd floor of the library.",
        jordanReply: "Oh that spot is gorgeous! Biscuit loves napping on the windowsill there.",
        friendshipPoints: 3
      },
      {
        text: "A cozy armchair in the student union lounge.",
        jordanReply: "Love that spot—great background noise and easy access to snacks!",
        friendshipPoints: 2
      },
      {
        text: "Right here at my dorm desk with some lo-fi beats.",
        jordanReply: "Dorm study sessions hit different when the room is cozy!",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_6',
    question: "Good morning! How are you feeling about your academic progress this semester?",
    options: [
      {
        text: "Feeling confident! My vocabulary and speaking are improving daily.",
        jordanReply: "I can totally hear the growth in your confidence! Keep it up!",
        friendshipPoints: 3
      },
      {
        text: "Still getting used to the workload, but taking it step by step.",
        jordanReply: "You're doing great. College is a marathon, not a sprint.",
        friendshipPoints: 2
      },
      {
        text: "Ready for a big challenge! Bring on the research debates!",
        jordanReply: "That's the spirit! You're going to ace every presentation.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_7',
    question: "Hey roommate! Do you prefer quiet solo studying or lively group study sessions?",
    options: [
      {
        text: "Quiet solo study—I need zero distractions to absorb concepts.",
        jordanReply: "Totally fair! Deep focus is super productive.",
        friendshipPoints: 2
      },
      {
        text: "Group study! Explaining ideas out loud helps me understand them better.",
        jordanReply: "Same here! Peer discussions make tough topics so much clearer.",
        friendshipPoints: 3
      },
      {
        text: "A mix—solo review first, then quizzing each other over coffee.",
        jordanReply: "The ultimate strategy! Best of both worlds.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_8',
    question: "If you could instantly master one academic skill today, what would it be?",
    options: [
      {
        text: "Flawless academic essay writing and thesis structuring.",
        jordanReply: "Ooh, writing clearly opens so many doors in academia!",
        friendshipPoints: 3
      },
      {
        text: "Rapid reading comprehension for long journal articles.",
        jordanReply: "Yes! Saving hours on textbook chapters would be a dream.",
        friendshipPoints: 3
      },
      {
        text: "Confident public speaking in campus seminars.",
        jordanReply: "You're already doing awesome at that! Practice makes perfect.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_9',
    question: "Morning! What's your go-to brain food when you need intense focus?",
    options: [
      {
        text: "Fresh fruit and almonds for clean energy.",
        jordanReply: "Healthy choice! Your brain definitely thanks you.",
        friendshipPoints: 2
      },
      {
        text: "Dark chocolate and a hot espresso shot.",
        jordanReply: "Ah, the luxury study combo! High focus guaranteed.",
        friendshipPoints: 3
      },
      {
        text: "Whatever pastry is fresh at the campus bakery!",
        jordanReply: "Hard to beat a warm croissant before a long study sprint!",
        friendshipPoints: 2
      }
    ]
  },
  {
    id: 'coffee_10',
    question: "How do you handle feeling overwhelmed by a long reading assignment?",
    options: [
      {
        text: "Break it into 25-minute Pomodoro sprints with breaks.",
        jordanReply: "Pomodoro is a lifesaver! Keeps burnout far away.",
        friendshipPoints: 3
      },
      {
        text: "Skim the introduction and conclusion first to get the main thesis.",
        jordanReply: "Pro reading technique! Smart strategy for academic papers.",
        friendshipPoints: 3
      },
      {
        text: "Discuss the core concepts with you over breakfast first!",
        jordanReply: "Aww! Talking it out always makes scary assignments feel doable.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_11',
    question: "Hey! How do you usually warm up your English speaking before class?",
    options: [
      {
        text: "Saying daily tongue twisters or reading out loud in my room.",
        jordanReply: "Love that! Vocal warmups make a huge difference.",
        friendshipPoints: 3
      },
      {
        text: "Listening to an academic podcast while getting dressed.",
        jordanReply: "Passive immersion works wonders for natural phrasing!",
        friendshipPoints: 2
      },
      {
        text: "Having our daily morning coffee chats, of course!",
        jordanReply: "Haha, yes! Best warmup routine on campus.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_12',
    question: "Morning! Are you the type to outline every essay paragraph or just write freely?",
    options: [
      {
        text: "Meticulous outline first—every topic sentence planned.",
        jordanReply: "Structure is key! Your essays must be super logical.",
        friendshipPoints: 3
      },
      {
        text: "Freewriting first to get ideas out, then editing heavily.",
        jordanReply: "Great for creativity! Refining drafts is where the magic happens.",
        friendshipPoints: 3
      },
      {
        text: "I talk through my ideas out loud before typing a word.",
        jordanReply: "Verbalizing your thoughts is such an underrated writing hack!",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_13',
    question: "What's the most interesting concept you've discussed in lectures recently?",
    options: [
      {
        text: "Cognitive psychology research on how memory retention works!",
        jordanReply: "Whoa, meta-learning! Apply those retention tricks to our studies!",
        friendshipPoints: 3
      },
      {
        text: "The evolution of computer programming languages and AI.",
        jordanReply: "Tech moves so fast! Super relevant for future careers.",
        friendshipPoints: 3
      },
      {
        text: "Case studies on global market trends and business strategy.",
        jordanReply: "Fascinating! Understanding global systems is so empowering.",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_14',
    question: "How do you like to celebrate or reward yourself after finishing a tough exam?",
    options: [
      {
        text: "A long walk around the quad with my favorite music.",
        jordanReply: "Unplugging in nature is the best way to reset your brain.",
        friendshipPoints: 2
      },
      {
        text: "Treating myself to a slice of cake at the student cafe.",
        jordanReply: "Dessert rewards are 100% deserved after exam stress!",
        friendshipPoints: 3
      },
      {
        text: "Hanging out in the dorm lounge chatting with friends.",
        jordanReply: "Dorm celebrations are the best memories in college!",
        friendshipPoints: 3
      }
    ]
  },
  {
    id: 'coffee_15',
    question: "If we started a weekly study group in Elm Hall lounge, what should our vibe be?",
    options: [
      {
        text: "Cozy lo-fi music, warm lighting, and hot chocolate.",
        jordanReply: "Count me in! That sounds like the ultimate study sanctuary.",
        friendshipPoints: 3
      },
      {
        text: "High-energy quiz sessions with flashcards and healthy competition!",
        jordanReply: "Active recall party! Everyone will ace their tests.",
        friendshipPoints: 3
      },
      {
        text: "Silent focus hour followed by 15 minutes of casual chatter.",
        jordanReply: "Structured and social! Perfect balance for getting work done.",
        friendshipPoints: 3
      }
    ]
  }
];

export function getTodayCoffeeDialogue(dateStr?: string): DailyCoffeeDialogue {
  const dStr = dateStr || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dStr.length; i++) {
    hash = (hash << 5) - hash + dStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % dailyCoffeeDialogues.length;
  return dailyCoffeeDialogues[index];
}

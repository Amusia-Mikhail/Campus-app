/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, ChapterType, SkillType, HeroProfile, UserProgress, Question } from './models';

export interface IStoryRepository {
  getChapters(): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | null>;
  getChaptersByLocation(locationId: string): Promise<Chapter[]>;
}

export interface IUserRepository {
  getProfile(): Promise<HeroProfile>;
  updateProfile(profile: Partial<HeroProfile>): Promise<HeroProfile>;
}

export interface IProgressRepository {
  getProgress(): Promise<UserProgress>;
  updateProgress(progress: Partial<UserProgress>): Promise<UserProgress>;
  incrementSkill(skill: SkillType, amount: number): Promise<UserProgress>;
  completeChapter(chapterId: string): Promise<UserProgress>;
  incrementFriendship(npcName: string, amount: number): Promise<number>;
}

// Generates 5 chapters per location, with major-specific topics for Lecture Hall and Seminar Room
export function getDynamicChapters(major: HeroProfile['major'], dorm: string = 'Elm Hall'): Chapter[] {
  const finalChapters: Chapter[] = [];

  // ==========================================
  // 1. DORM (ELM HALL) - CHAPTERS 1-5
  // ==========================================
  finalChapters.push({
    id: '1',
    title: 'Move-In Day',
    type: ChapterType.NARRATIVE,
    skill: SkillType.READING,
    locationId: 'dorm',
    intro: 'You arrive at Elm Hall with a heavy suitcase and a heart full of nervous excitement. Your first semester at campus begins now.',
    prose: [
      'The morning sun filters through the towering elm trees lining the quad. Elm Hall stands before you, an elegant red-brick building with classic ivy-covered archways.',
      'You haul your luggage up the stairs to Room 204. As you open the door, you meet Jordan, your new roommate, who is already setting up a desk with classic music posters.',
      '"Hey! You must be my roommate!" Jordan beams, extending a hand. "I just arrived an hour ago. I took the bed near the window, but let me know if you prefer this side."',
      'You unpack your books, neatly arranging your academic English materials. On the desk, you spot a welcome letter from the residential community.',
      'As you look out the window, you spot a sleek, fluffy tabby cat resting peacefully on the low brick wall below. "Oh, that is Biscuit," Jordan says, noticing your gaze. "He is the unofficial mascot of the campus library. If you give him some ear scratches, he will follow you anywhere!"',
      'You feel a wave of relief. This room, this campus, this new chapter of your life—it is finally starting to feel like home.'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: '2',
    title: 'First Week Struggles',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dorm',
    intro: 'You sit at your desk organizing your books. Jordan looks up from a massive binder with a slight sigh.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! How are your first classes going? Honestly, looking at these syllabi is making my head spin. It feels like the academic vocabulary is on another level!',
    npcLines: [
      'That is actually a great strategy. Making flashcards for academic terminology is incredibly helpful.',
      'Absolutely! We should set up a shared digital calendar so we do not miss any assignment deadlines.',
      'Speaking of breaks, I saw Biscuit the cat sleeping right on a stack of newspapers in the lounge earlier. He looked completely stress-free!',
      'Yes! Let’s walk over to the advising office together tomorrow. Meeting with Dr. Reyes should give us some peace of mind.',
      'Perfect! Let’s head to the dining hall in a bit to get some hot food.'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '3',
    title: 'Roommate Agreement',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'dorm',
    intro: 'To prevent any future misunderstandings, Jordan suggests drafting a simple roommate agreement for Room 204.',
    essayPrompt: 'Draft a short set of roommate guidelines. Reflect on how you and Jordan should communicate about cleaning chores, quiet study hours, and welcoming guests to Room 204.',
    minWords: 40
  });

  finalChapters.push({
    id: '4',
    title: 'Weekend Prep & Plans',
    type: ChapterType.NARRATIVE,
    skill: SkillType.READING,
    locationId: 'dorm',
    intro: 'The weekend approaches, and you and Jordan plan a joint study session to stay ahead of your reading loads.',
    prose: [
      'It is Friday afternoon, and the dorm hallway is filled with chatter. Jordan is sitting on the floor sorting through folders.',
      '"I am planning my weekend study schedule," Jordan says. "The library is supposed to be quiet on Sunday mornings. Would you like to join me?"',
      'You look over Jordan’s neatly color-coded outline. Taking a structured approach to studying will help you manage the dense reading assignments.',
      'As you agree to the plan, Biscuit the cat wanders into Room 204, meowing softly. He walks over to your desk and rubs against your ankle.',
      '"Looks like Biscuit approved our weekend plans!" Jordan laughs. You feel fully prepared to tackle the upcoming week.'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '5',
    title: 'Dorm Lounge Debate',
    type: ChapterType.DISCUSSION,
    skill: SkillType.SPEAKING,
    locationId: 'dorm',
    intro: 'You join a gathering of first-year students in the Elm Hall lounge. A discussion starts about dorm community guidelines.',
    discussionPrompt: 'Debate: Should university dormitories enforce mandatory quiet hours starting at 9:00 PM on weeknights to support academic performance?',
    classmateReplies: [
      {
        name: 'Liam',
        avatarSeed: 'liam',
        text: 'I think mandatory quiet hours at 9:00 PM are absolutely essential. Some of us have 8:00 AM lectures, and having a peaceful environment to sleep and study is a basic academic right.',
        stance: 'agree'
      },
      {
        name: 'Sophia',
        avatarSeed: 'sophia',
        text: 'While study time is important, 9:00 PM is way too early. Many students work evening jobs or feel most creative at night. We should focus on mutual respect rather than rigid regulations.',
        stance: 'disagree'
      }
    ]
  });

  // ==========================================
  // 2. LECTURE HALL (LECTURE) - CHAPTERS 6-10 (MAJOR-SPECIFIC)
  // ==========================================
  const lectureTopics = {
    Psychology: [
      {
        title: 'Cognitive Memory Schemas',
        transcript: 'Welcome back. Today we explore the architecture of human memory, specifically short-term memory. Unlike long-term memory, which has a seemingly infinite capacity, short-term memory is strictly limited. In 1956, cognitive psychologist George Miller published a landmark paper introducing the concept of "The Magical Number Seven, Plus or Minus Two." This means the average human mind can hold between five and nine individual items of information at one time. To overcome this limitation, our brains employ a strategy called "chunking." Chunking is the process of grouping individual pieces of information into larger, familiar units. For example, memorizing a ten-digit phone number as three distinct chunks is vastly easier than trying to recall ten independent digits. Without active rehearsal, information in our short-term store fades rapidly within fifteen to thirty seconds.',
        q1: 'What is the average capacity of human short-term memory according to George Miller?',
        o1: ['3 to 5 items', '5 to 9 items', '10 to 12 items', 'Unlimited items'],
        a1: 1,
        q2: 'Which cognitive technique involves grouping individual elements into larger, structured units?',
        o2: ['Rehearsal', 'Fading', 'Chunking', 'Retrieval'],
        a2: 2
      },
      {
        title: 'Neuroplasticity Foundations',
        transcript: 'Today, we examine neuroplasticity—the brain’s incredible ability to reorganize itself by forming new neural connections throughout life. For decades, scientists believed the adult brain was completely static. We now know that cognitive exercises, learning a new language, and physical activity actually alter the brain’s physical structure. Synaptic pruning occurs when weaker connections are eliminated, while frequently used pathways are reinforced. As neuroscientists famously summarize: neurons that fire together, wire together. This adaptive capacity is crucial for recovering from neurological injuries and acquiring advanced cognitive skills.',
        q1: 'What is neuroplasticity?',
        o1: ['The brain’s ability to remain static', 'The process of losing neural cells permanently', 'The brain’s ability to reorganize and form new connections', 'A type of cognitive memory loss'],
        a1: 2,
        q2: 'What phrase describes how neural pathways are reinforced through repeated activity?',
        o2: ['Neurons that fire together, wire together', 'The Magical Number Seven', 'Synaptic pruning limitation', 'Unconscious cognitive drift'],
        a2: 0
      },
      {
        title: 'Developmental Psychology',
        transcript: 'Let us address the developmental debate: Nature versus Nurture. This paradigm looks at whether human behavior, intelligence, and personality are determined primarily by genetic inheritance (nature) or environmental influences (nurture). Modern consensus rejects strict division, recognizing a complex interaction called epigenetics. Epigenetics refers to how environmental factors, such as nutrition, stress, and social bonds, can actually alter gene expression without changing the underlying DNA sequence. Thus, environment and biology work in tandem to shape our psychological development.',
        q1: 'What is the modern consensus on the Nature vs Nurture debate?',
        o1: ['Behavior is entirely genetic', 'Behavior is entirely environmental', 'They interact complexly, as studied in epigenetics', 'The debate is no longer academically relevant'],
        a1: 2,
        q2: 'What does epigenetics study?',
        o2: ['DNA sequence mutations', 'How environmental factors alter gene expression', 'The structure of the brain stem', 'Short-term memory chunking'],
        a2: 1
      },
      {
        title: 'Cognitive Dissonance Theory',
        transcript: 'Today, we discuss Cognitive Dissonance, a theory proposed by Leon Festinger in 1957. Cognitive dissonance is the mental discomfort or psychological tension a person experiences when holding two contradictory beliefs, values, or ideas. To resolve this uncomfortable tension, individuals will unconsciously alter their beliefs, justify their behaviors, or reject new information that contradicts their existing worldview. For example, a smoker who knows smoking is unhealthy might convince themselves that the stress-relieving benefits outweigh the long-term physical risks.',
        q1: 'Who proposed the Theory of Cognitive Dissonance in 1957?',
        o1: ['George Miller', 'Leon Festinger', 'B.F. Skinner', 'Sigmund Freud'],
        a1: 1,
        q2: 'How do individuals typically resolve cognitive dissonance?',
        o2: ['By holding more contradictory beliefs', 'By ignoring their own values completely', 'By altering beliefs, justifying behavior, or rejecting contradictory data', 'By forgetting the conflict entirely'],
        a2: 2
      },
      {
        title: 'Social Psychology: Conformity',
        transcript: 'Our final lecture covers social conformity, famously demonstrated by Solomon Asch in his 1951 line experiments. Asch placed a participant in a room with actors who intentionally gave wrong answers when identifying matching line lengths. Astoundingly, over one-third of participants conformed to the group’s incorrect consensus. This highlights two key social influences: informational social influence, where we conform because we believe the group has accurate data, and normative social influence, where we conform simply to fit in and avoid social rejection.',
        q1: 'What did Solomon Asch’s 1951 line experiments demonstrate?',
        o1: ['Short-term memory limits', 'Social conformity to group consensus', 'The chemical nature of neuroplasticity', 'Epigenetics in twins'],
        a1: 1,
        q2: 'Why do people conform due to "normative social influence"?',
        o2: ['Because they believe the group has better facts', 'To avoid social rejection and fit in', 'Because of genetic predispositions', 'To improve their academic GPA'],
        a2: 1
      }
    ],
    'Computer Science': [
      {
        title: 'Binary Search & Complexity',
        transcript: 'Welcome, class. Today we explore algorithmic efficiency, focusing on Binary Search. In computer science, how we search through data matters immensely. A linear search checks every single item sequentially, which takes O(n) time. However, if our data is sorted, we can use Binary Search. This algorithm repeatedly divides the search space in half. If the target value is less than the middle element, we narrow our search to the lower half; otherwise, we search the upper half. This logarithmic approach reduces our time complexity to O(log n). For a dataset of one billion elements, a linear search might take one billion operations, while binary search takes only thirty.',
        q1: 'What is the key prerequisite for performing a Binary Search?',
        o1: ['The dataset must be empty', 'The dataset must be sorted', 'The data must contain only integers', 'The search must be done in parallel'],
        a1: 1,
        q2: 'What is the time complexity of Binary Search?',
        o2: ['O(1)', 'O(n)', 'O(n log n)', 'O(log n)'],
        a2: 3
      },
      {
        title: 'Object-Oriented Programming',
        transcript: 'Today we discuss Object-Oriented Programming, or OOP. OOP is a programming paradigm centered around "objects" rather than actions. It relies on four core principles: Encapsulation, which bundles data and methods inside a single unit; Inheritance, which allows new classes to acquire properties of existing ones; Polymorphism, enabling different classes to be treated as instances of a parent class through a shared interface; and Abstraction, which hides complex implementation details behind simplified models.',
        q1: 'Which OOP principle is defined by bundling data and methods inside a single unit?',
        o1: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        a1: 2,
        q2: 'What is polymorphism?',
        o2: ['Allowing classes to inherit data', 'The ability of different classes to respond to the same message in unique ways', 'Hiding implementation details', 'Converting code to binary'],
        a2: 1
      },
      {
        title: 'Relational Database Design',
        transcript: 'We now examine relational database design. Relational databases organize structured data into tables consisting of rows and columns, linked through primary and foreign keys. A primary key uniquely identifies a specific record in a table, while a foreign key in another table points directly to that primary key, establishing a logical connection. To ensure data integrity and eliminate redundancy, database architects apply a process called normalization. This involves decomposing tables into smaller, highly structured relations.',
        q1: 'What is the primary purpose of database normalization?',
        o1: ['To make queries run slower', 'To eliminate data redundancy and ensure logical integrity', 'To encrypt database passwords', 'To convert SQL into NoSQL'],
        a1: 1,
        q2: 'What key is used in one table to reference a unique primary key in another table?',
        o2: ['Super Key', 'Composite Key', 'Foreign Key', 'Candidate Key'],
        a2: 2
      },
      {
        title: 'Introduction to Neural Networks',
        transcript: 'Our topic today is artificial neural networks, the foundation of modern deep learning. Inspired by biological brains, these networks consist of interconnected layers of artificial neurons. An input layer receives data, which passes through hidden layers where mathematical transformations occur, leading to an output layer. Each connection has a specific "weight" and "bias," which are adjusted during training. Through an algorithm called backpropagation, the network calculates errors between its output and the correct answer, propagating corrections backward to tune the weights.',
        q1: 'What algorithm is used to calculate errors and adjust weights backward through a neural network?',
        o1: ['Binary Search', 'Linear Regression', 'Backpropagation', 'Sorting Network'],
        a1: 2,
        q2: 'What are the three main types of layers in a standard neural network?',
        o2: ['Primary, secondary, and tertiary', 'Input, hidden, and output', 'Binary, octal, and hexadecimal', 'Data, process, and query'],
        a2: 1
      },
      {
        title: 'Internet Protocol & Packet Routing',
        transcript: 'We conclude with network routing. The Internet relies on packet switching, where large messages are sliced into small packets of digital data, routed independently across routers, and reassembled at the destination. IP, or Internet Protocol, handles addressing, ensuring each packet has a source and destination address. TCP, or Transmission Control Protocol, works alongside IP, managing connection establishment, packet sorting, and retransmitting lost packets to guarantee reliable delivery.',
        q1: 'What is the role of IP (Internet Protocol) in packet routing?',
        o1: ['Encrypting web pages', 'Handling addressing and routing packets', 'Compiling code on routers', 'Powering physical fiber cables'],
        a1: 1,
        q2: 'Which protocol is responsible for packet order and guaranteeing reliable, error-free delivery?',
        o2: ['UDP', 'DNS', 'TCP', 'HTTP'],
        a2: 2
      }
    ],
    Business: [
      {
        title: 'Supply, Demand, & Equilibrium',
        transcript: 'Welcome, class. Today we explore microeconomics, specifically the Law of Supply and Demand. In a free market, prices are determined by the interaction of consumers and producers. The Law of Demand states that, all else equal, as the price of a good increases, consumer demand for that good decreases. Conversely, the Law of Supply states that as prices rise, producers are willing to supply more of that good to maximize revenue. The intersection of these two curves is called market equilibrium. At equilibrium, the quantity demanded exactly equals the quantity supplied, resulting in stable market prices.',
        q1: 'According to the Law of Demand, what happens when the price of a product increases?',
        o1: ['Producers supply less', 'Consumer demand decreases', 'Market equilibrium is automatically doubled', 'Consumer demand increases'],
        a1: 1,
        q2: 'What is market equilibrium?',
        o2: ['A state of zero supply', 'When taxes equal corporate revenues', 'The point where quantity demanded equals quantity supplied', 'When prices rise indefinitely'],
        a2: 2
      },
      {
        title: 'Fundamentals of Marketing',
        transcript: 'Today we discuss marketing segmentation. Businesses cannot appeal to every consumer simultaneously, so they divide the market into distinct segments based on shared characteristics. We categorize these segments using four main criteria: demographic segmentation (age, gender, income); geographic segmentation (location, climate); psychographic segmentation (lifestyle, values); and behavioral segmentation (brand loyalty, purchasing habits). By targeting specific segments, companies optimize their advertising budgets and build stronger brand loyalty.',
        q1: 'Which marketing segmentation category is based on age, gender, and income level?',
        o1: ['Geographic', 'Psychographic', 'Demographic', 'Behavioral'],
        a1: 2,
        q2: 'What is the goal of target marketing segmentation?',
        o2: ['To advertise to every single person in the world', 'To optimize advertising budgets by targeting specific receptive groups', 'To lower the quality of products', 'To eliminate competitors legally'],
        a2: 1
      },
      {
        title: 'Finance: Time Value of Money',
        transcript: 'We now cover a cornerstone of finance: the Time Value of Money, or TVM. TVM is the concept that money available at the present time is worth more than the identical sum in the future due to its potential earning capacity. Provided money can earn interest, any amount of money is worth more the sooner it is received. We calculate this using present value and future value formulas, factoring in compounding interest. This principle underlies all capital budgeting, investment analysis, and retirement planning.',
        q1: 'Why is a dollar today worth more than a dollar tomorrow according to TVM?',
        o1: ['Because paper money degrades over time', 'Due to its potential earning capacity through interest', 'Because of tax deductions', 'Because banks do not allow future deposits'],
        a1: 1,
        q2: 'What financial calculations are used to measure the Time Value of Money?',
        o2: ['Binary search parameters', 'Present value and future value compounding formulas', 'Syllabus grading equations', 'SWOT metrics'],
        a2: 1
      },
      {
        title: 'Organizational Leadership',
        transcript: 'Today we discuss organizational leadership and management styles. Psychologists and business theorists identify three primary leadership behaviors: Autocratic, where the leader retains all decision-making power with little input from subordinates; Democratic, where the leader encourages collaborative participation and builds consensus; and Laissez-faire, where the leader grants complete freedom to team members to manage their own tasks. Effective managers dynamically shift styles depending on the urgency and complexity of the project.',
        q1: 'Which leadership style is characterized by complete hands-off freedom for team members?',
        o1: ['Democratic', 'Autocratic', 'Laissez-faire', 'Bureaucratic'],
        a1: 2,
        q2: 'How should an effective manager use leadership styles?',
        o2: ['Always remain strictly autocratic', 'Shift styles dynamically based on project urgency and complexity', 'Never make any decisions', 'Delegate all responsibilities to Biscuit the cat'],
        a2: 1
      },
      {
        title: 'Strategic SWOT Analysis',
        transcript: 'We conclude with strategic management frameworks, focusing on the SWOT Analysis. Developed in the 1960s, SWOT stands for Strengths, Weaknesses, Opportunities, and Threats. Strengths and Weaknesses are internal factors within a company, such as intellectual property, brand reputation, or debt levels. Opportunities and Threats are external factors in the broader environment, such as emerging technologies, tax laws, or aggressive competitors. Completing a SWOT matrix is critical before launching new ventures.',
        q1: 'In a SWOT analysis, which two components represent internal business factors?',
        o1: ['Opportunities and Threats', 'Strengths and Weaknesses', 'Taxation and Demographics', 'Supplies and Demands'],
        a1: 1,
        q2: 'What does SWOT stand for?',
        o2: ['System Wide Operations Technology', 'Strengths, Weaknesses, Opportunities, Threats', 'Supply, Wealth, Options, Trade', 'Social Welfare Organization Trust'],
        a2: 1
      }
    ],
    Undecided: [
      {
        title: 'Interdisciplinary Thinking',
        transcript: 'Welcome, class. Today we discuss the power of Interdisciplinary Thinking. In modern academia, complex global challenges cannot be solved through a single lens. To understand issues like climate change or public health, we must blend insights from scientific, economic, and psychological disciplines. Interdisciplinary studies encourage cognitive flexibility, allowing students to synthesize diverse methodologies, question established assumptions, and design innovative solutions. Throughout this semester, we will practice integrating scientific data with ethical reasoning.',
        q1: 'What is interdisciplinary thinking?',
        o1: ['Focusing strictly on a single sub-field', 'Integrating insights and methodologies from multiple academic disciplines', 'Studying only history', 'Ignoring scientific consensus'],
        a1: 1,
        q2: 'Why is interdisciplinary study essential for solving global issues?',
        o2: ['Because global issues are simple', 'Because complex challenges require multifaceted scientific, economic, and ethical insights', 'To lower tuition costs', 'To bypass academic peer review'],
        a2: 1
      },
      {
        title: 'Critical Thinking & Fallacies',
        transcript: 'Today we examine critical thinking, focusing on identifying logical fallacies. A logical fallacy is an error in reasoning that renders an argument invalid. We analyze two common fallacies: Ad Hominem, which attacks a person’s character rather than addressing their actual argument; and the Straw Man fallacy, which involves oversimplifying or completely misrepresenting an opponent’s position to make it easier to attack. Developing academic literacy means building robust, evidence-backed arguments free of these structural errors.',
        q1: 'What is an "Ad Hominem" logical fallacy?',
        o1: ['An argument based on statistical data', 'Attacking an opponent’s personal character instead of their argument', 'Oversimplifying an opponent’s thesis', 'Citing a credible academic journal'],
        a1: 1,
        q2: 'What is the "Straw Man" fallacy?',
        o2: ['Using statistical graphs', 'Misrepresenting or oversimplifying an opponent’s argument to attack it easily', 'Agreeing with everything Jordan says', 'Refusing to write an essay'],
        a2: 1
      },
      {
        title: 'Environmental Carbon Cycles',
        transcript: 'Today we explore the global carbon cycle, a fundamental process regulating Earth’s climate. Carbon is stored in reservoirs: the atmosphere, oceans, terrestrial biosphere, and deep geological formations. Through photosynthesis, plants absorb carbon dioxide, converting it to organic molecules. Cellular respiration, decomposition, and burning fossil fuels release carbon back into the atmosphere. When human activities release carbon faster than natural sinks can absorb it, the atmospheric concentration increases, trapping heat through the greenhouse effect.',
        q1: 'Which process absorbs carbon dioxide from the atmosphere to convert it to organic matter?',
        o1: ['Cellular respiration', 'Photosynthesis', 'Decomposition', 'Fossil fuel combustion'],
        a1: 1,
        q2: 'What happens when carbon is released into the atmosphere faster than natural reservoirs can absorb it?',
        o2: ['The greenhouse effect traps more heat, raising temperatures', 'Earth instantly enters an ice age', 'Plants stop performing photosynthesis', 'Atmospheric oxygen levels drop to zero'],
        a2: 0
      },
      {
        title: 'The Industrial Revolution',
        transcript: 'Today’s historical analysis covers the Industrial Revolution, beginning in Great Britain during the late 18th century. This transition shifted manufacturing from manual cottage industries to steam-powered, machine-driven factories. The massive influx of agricultural workers seeking factory employment led to rapid, unplanned urbanization, creating densely populated, unsanitary city centers. This era fundamentally restructured global economics, giving rise to modern industrial capitalism, labor unions, and child labor regulation.',
        q1: 'Where did the Industrial Revolution begin in the late 18th century?',
        o1: ['United States', 'Great Britain', 'Germany', 'France'],
        a1: 1,
        q2: 'What major social change was triggered by the rise of steam-powered factories?',
        o2: ['A massive shift of populations from urban to rural farms', 'Rapid, unplanned urbanization and restructuring of labor systems', 'The complete elimination of trade networks', 'The invention of binary search'],
        a2: 1
      },
      {
        title: 'Academic Peer Review Systems',
        transcript: 'We conclude our academic literacy block with the peer review system. Before a scientific paper or research study is published in a credible journal, it undergoes rigorous evaluation by independent experts in the same field. These peer reviewers analyze the study’s research methodology, statistical accuracy, ethical protocols, and logical consistency. The reviewers provide detailed critiques, recommending that the journal editor accept, reject, or request revisions to the manuscript, maintaining high standards of scholarly integrity.',
        q1: 'Who evaluates a research manuscript during the peer review process?',
        o1: ['The author’s roommates', 'Independent academic experts in the same field', 'The general public via online voting', 'A team of professional marketing agents'],
        a1: 1,
        q2: 'What is the primary goal of academic peer review?',
        o2: ['To speed up paper publication', 'To maintain high standards of scholarly integrity and methodology accuracy', 'To write thesis statements for students', 'To guarantee that all papers are free of charge'],
        a2: 1
      }
    ]
  };

  const selectedLectures = lectureTopics[major] || lectureTopics['Undecided'];

  selectedLectures.forEach((lec, idx) => {
    finalChapters.push({
      id: String(6 + idx),
      title: lec.title,
      type: ChapterType.LECTURE,
      skill: SkillType.LISTENING,
      locationId: 'lecture_hall',
      intro: `You find a seat in the crowded lecture hall. Professor Sterling opens her slides to discuss ${lec.title.toLowerCase()}.`,
      transcript: lec.transcript,
      questions: [
        {
          id: `q${6 + idx}_1`,
          questionText: lec.q1,
          options: lec.o1,
          correctIndex: lec.a1
        },
        {
          id: `q${6 + idx}_2`,
          questionText: lec.q2,
          options: lec.o2,
          correctIndex: lec.a2
        }
      ]
    });
  });

  // ==========================================
  // 3. SEMINAR ROOM (DISCUSSION) - CHAPTERS 11-15 (MAJOR-SPECIFIC)
  // ==========================================
  const seminarTopics = {
    Psychology: [
      {
        title: 'Seminar: Therapy & AI',
        prompt: 'In today’s cognitive seminar, let us debate a modern dilemma: Can conversational artificial intelligence models ever truly replicate human empathy to deliver effective mental health therapy?',
        reply1: 'I believe AI therapy is a highly scalable solution. It provides 24/7 access, eliminates scheduling hurdles, and offers a judgment-free zone for individuals who are hesitant to speak to a human clinician.',
        reply2: 'I must disagree. Empathy is fundamentally a biological, shared human experience. An AI can only mimic emotional vocabulary based on probability; it doesn’t genuinely care or share therapeutic rapport.'
      },
      {
        title: 'Seminar: Social Media Anxiety',
        prompt: 'Let’s debate: Does the widespread usage of algorithm-driven social media platforms directly cause high anxiety rates among teenagers, or is it merely a correlation?',
        reply1: 'The data is clear. Algorithms actively exploit social comparison, seeking to trigger dopamine loops that leave teens feeling isolated, sleep-deprived, and highly anxious.',
        reply2: 'I think that is too simplistic. Social media also provides vital community support for marginalized groups, and anxiety has many complex economic and social drivers beyond screen time.'
      },
      {
        title: 'Seminar: Mandatory Screenings',
        prompt: 'Policy Debate: Should annual psychological screenings be legally mandated for all individuals in high-stress public sector jobs, such as police officers and air traffic controllers?',
        reply1: 'Yes. Ensuring public safety requires absolute psychological stability. Preventive screenings catch burnout and trauma before they lead to tragic operational errors.',
        reply2: 'Mandatory tests could lead to heavy stigma. Employees might hide symptoms or cheat on screenings to protect their jobs. Confident, voluntary counseling resources are far more effective.'
      },
      {
        title: 'Seminar: EQ vs Cognitive IQ',
        prompt: 'Debate: Is emotional intelligence (EQ) a more critical predictor of career leadership success than high cognitive intelligence (IQ)?',
        reply1: 'Absolutely. Technical skills get you hired, but emotional management, empathy, and social communication are what allow you to lead, inspire, and manage complex modern teams.',
        reply2: 'While EQ is helpful, IQ is the baseline. Without high analytical capability and problem-solving skills, a leader cannot make correct strategic decisions under pressure, regardless of how popular they are.'
      },
      {
        title: 'Seminar: Parenting vs Genetics',
        prompt: 'Debate: Is a child’s long-term moral and academic development more heavily shaped by parental discipline (nurture) or genetic personality traits (nature)?',
        reply1: 'Parents set the entire foundation. Daily habits, moral boundaries, and educational investments establish the structural environment that channels a child’s traits toward success.',
        reply2: 'Twin studies reveal genetics explain over fifty percent of personality variance. Parents have less control than they think; their role is mostly supporting a pre-written biological canvas.'
      }
    ],
    'Computer Science': [
      {
        title: 'Seminar: Open Source AI',
        prompt: 'Debate: Should advanced artificial intelligence models be fully open-sourced to promote transparency and equity, or heavily restricted to prevent malicious deployments?',
        reply1: 'AI must be open. Restricting models concentrates massive computational power in a few wealthy tech monopolies. Open source allows global developers to audit safety and find bias.',
        reply2: 'Releasing powerful models is highly dangerous. Bad actors can easily remove safety filters to generate bioweapons, launch automated phishing campaigns, or produce massive quantities of misinformation.'
      },
      {
        title: 'Seminar: Quantum Cryptography',
        prompt: 'Debate: Should governments immediately fund quantum-resistant encryption upgrades, or is the threat of quantum decryptions too far in the future to justify current spending?',
        reply1: 'We must act immediately. Decrypting modern security takes classical computers trillions of years, but quantum algorithms will break it in minutes. Harvesting encrypted data is happening now.',
        reply2: 'Quantum computing hardware is still decades away from breaking RSA encryption. Rushing expensive infrastructure upgrades distracts from solving immediate, daily cybersecurity threats.'
      },
      {
        title: 'Seminar: Gig Economy Algorithms',
        prompt: 'Debate: Are algorithmic routing and pricing systems in ride-sharing apps exploiting gig workers, or are they providing unmatched flexibility?',
        reply1: 'It is algorithmic exploitation. Drivers are subjected to dynamic pricing that fluctuates without warning, taking away transparent earnings while tracking their physical data.',
        reply2: 'The algorithms maximize market efficiency. Drivers choose exactly when to work, and dynamic surge pricing balances consumer demand and driver supply in real-time, boosting overall market health.'
      },
      {
        title: 'Seminar: Self-Driving Liability',
        prompt: 'Legal Debate: When a fully autonomous vehicle is involved in a fatal collision, should the legal liability rest with the vehicle manufacturer, or the occupant who sat in the driver seat?',
        reply1: 'The manufacturer must be liable. The occupant has no control over deep neural network decisions. If a company sells self-driving software, they must stand behind its physical actions.',
        reply2: 'Occupants must maintain active oversight. Current technology requires human intervention during edge cases. If an occupant ignores safety alerts, they are responsible for the collision.'
      },
      {
        title: 'Seminar: Automation & UBI',
        prompt: 'Debate: Should governments implement a universal basic income (UBI) specifically funded by automation taxes to offset labor displacement caused by AI?',
        reply1: 'Yes. Automation is moving faster than labor retraining. UBI provides a vital financial floor, ensuring workers do not fall into extreme poverty as routine cognitive tasks are digitized.',
        reply2: 'UBI is incredibly expensive and disincentivizes work. Instead of handouts, we should fund technical bootcamps and educational programs to prepare workers for high-value collaborative jobs.'
      }
    ],
    Business: [
      {
        title: 'Seminar: Shareholder Primacy',
        prompt: 'Debate: Should a corporation’s sole legal duty be maximizing wealth for its shareholders, or should it prioritize stakeholder interests (employees, environment, local communities)?',
        reply1: 'Shareholder primacy is the most efficient system. When companies focus strictly on profits, they allocate capital efficiently, create jobs, and generate tax revenues that support the public.',
        reply2: 'Prioritizing only shareholders leads to environmental exploitation and low wages. Corporations operate with public infrastructure, so they owe a duty to support the society that sustains them.'
      },
      {
        title: 'Seminar: Corporate Wealth Tax',
        prompt: 'Debate: Should governments impose a higher marginal wealth tax on corporations to directly fund public education and reduce rising income inequality?',
        reply1: 'Yes. Wealth inequality threatens social cohesion. Forcing highly profitable corporations to pay their fair share directly reinvests in our future workforce through education.',
        reply2: 'High corporate taxes hurt the economy. Companies will move their offices and manufacturing jobs to low-tax countries, leaving domestic workers with fewer career opportunities.'
      },
      {
        title: 'Seminar: Minimum Wage & Inflation',
        prompt: 'Debate: Should the federal minimum wage be automatically indexed to annual inflation rates, or does this risk creating a damaging wage-price spiral?',
        reply1: 'Indexing is essential for human dignity. When wages remain stagnant while living costs rise, worker purchasing power is destroyed, dragging down consumer spending.',
        reply2: 'Automatic wage hikes force small businesses to raise prices to cover labor costs. This feeds back into inflation, creating a spiral that ultimately hurts low-income workers.'
      },
      {
        title: 'Seminar: CSR Stock Performance',
        prompt: 'Debate: Does investing heavily in Corporate Social Responsibility (CSR) actually improve a company’s long-term stock performance, or is it mostly marketing cost?',
        reply1: 'CSR is highly profitable long-term. Modern consumers actively prefer ethical brands, and strong environmental practices reduce compliance risks while attracting top talent.',
        reply2: 'Most CSR is expensive greenwashing. It diverts capital away from core research, product quality, and manufacturing improvements, which are the real drivers of long-term stock value.'
      },
      {
        title: 'Seminar: Globalization Pros & Cons',
        prompt: 'Debate: Is rapid economic globalization ultimately beneficial for local manufacturing industries, or does it devastate domestic labor markets?',
        reply1: 'Globalization lowers prices for consumers everywhere and connects local businesses to international buyers, creating high-value trade and logistics jobs.',
        reply2: 'It has hollowed out industrial towns. Offshoring manufacturing to cheap overseas labor markets has eliminated stable domestic union jobs, widening the wealth gap.'
      }
    ],
    Undecided: [
      {
        title: 'Seminar: College Funding',
        prompt: 'In today’s academic seminar, let’s debate a crucial public policy issue: Should public college tuition be fully funded by tax revenues, making it free for all students?',
        reply1: 'I strongly believe public college should be tuition-free. Higher education is a fundamental public good, much like high school. When tuition is free, we eliminate systemic financial barriers, allowing bright minds from all socioeconomic backgrounds to contribute to our society’s intellectual and economic growth.',
        reply2: 'I see Liam’s point, but I worry about the negative side effects. Making college free requires massive increases in tax rates, which could strain the economy. Furthermore, fully funded college might lead to overcrowded classrooms and a potential decline in the instructional quality and resources of public universities.'
      },
      {
        title: 'Seminar: Public Transit Funding',
        prompt: 'Debate: Should major cities prioritize tax funding for public transit expansion over widening highways to reduce traffic congestion?',
        reply1: 'Expanding public transit is the only real solution. Widening highways actually triggers induced demand, attracting more cars and traffic. Transit reduces carbon emissions and helps low-income workers travel.',
        reply2: 'Widening highways is what consumers want. Public transit is expensive to build, often operates at a loss, and is impractical for suburban families who need cars for daily tasks.'
      },
      {
        title: 'Seminar: Space Exploration Limits',
        prompt: 'Debate: Should governments heavily fund outer space exploration during times of economic recession, or should all resources be kept for domestic aid?',
        reply1: 'Space exploration drives incredible technological spin-offs, from water filtration to medical imaging, while inspiring students to pursue scientific careers that boost the economy.',
        reply2: 'It is highly unethical to spend billions on space rockets when local citizens are struggling with homelessness, high food costs, and failing domestic schools.'
      },
      {
        title: 'Seminar: Single-Use Plastics',
        prompt: 'Debate: Should retail businesses face a complete legal ban on all single-use plastic packaging, or should we rely on consumer recycling programs?',
        reply1: 'We need a strict ban. Recycling is a broken system; less than ten percent of plastic is recycled. A ban forces companies to adopt sustainable, biodegradable packaging.',
        reply2: 'Bans increase operational costs, which are passed on to consumers. Many food items require plastic to prevent spoilage and contamination, so recycling research is a safer path.'
      },
      {
        title: 'Seminar: permanent Remote Work',
        prompt: 'Debate: Should office employees have a permanent legal right to work remotely if their tasks can be completed fully on a computer?',
        reply1: 'Yes. Remote work reduces commuting stress, saves money on transport, and lets parents balance family care, increasing overall employee happiness and productivity.',
        reply2: 'Permanent remote work degrades corporate culture, makes collaborative brainstorming difficult, and harms local city center businesses that rely on office workers.'
      }
    ]
  };

  const selectedSeminars = seminarTopics[major] || seminarTopics['Undecided'];

  selectedSeminars.forEach((sem, idx) => {
    finalChapters.push({
      id: String(11 + idx),
      title: sem.title,
      type: ChapterType.DISCUSSION,
      skill: SkillType.SPEAKING,
      locationId: 'seminar_room',
      intro: `You take a seat at the circular seminar table. Professor Reyes introduces today's academic debate topic.`,
      discussionPrompt: sem.prompt,
      classmateReplies: [
        {
          name: 'Liam',
          avatarSeed: 'liam',
          text: sem.reply1,
          stance: 'agree'
        },
        {
          name: 'Sophia',
          avatarSeed: 'sophia',
          text: sem.reply2,
          stance: 'disagree'
        }
      ]
    });
  });

  // ==========================================
  // 4. WRITING CENTER - CHAPTERS 16-20
  // ==========================================
  finalChapters.push({
    id: '16',
    title: 'Academic Essay Draft',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'writing_center',
    intro: 'You visit the Writing Center to work on your academic reflection essay. A writing tutor helps you outline your ideas.',
    essayPrompt: 'Reflect on a significant academic or personal challenge you have encountered in your life. Describe the obstacles you faced, the actions you took to overcome them, and what important lessons you learned about yourself in the process.',
    minWords: 40
  });

  finalChapters.push({
    id: '17',
    title: 'The Argumentative Thesis',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'writing_center',
    intro: 'A tutor named Marcus guides you on constructing a strong, arguable thesis statement for an essay about technology.',
    essayPrompt: 'Formulate a single-sentence thesis statement arguing whether smartphones have improved or degraded real-world social communication, and write a paragraph supporting your stance with examples.',
    minWords: 40
  });

  finalChapters.push({
    id: '18',
    title: 'Paraphrasing & Citation',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'writing_center',
    intro: 'You practice paraphrasing academic passages to avoid plagiarism while maintaining original scholarly context.',
    essayPrompt: 'Read a source statement: "The internet has revolutionized information access, but has also reduced our attention spans." Write a paraphrased version of this idea in your own words, and explain the academic importance of citation ethics.',
    minWords: 40
  });

  finalChapters.push({
    id: '19',
    title: 'Literature Synthesis',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'writing_center',
    intro: 'You work on synthesizing two conflicting academic articles. One argues sleep is critical for memory, while another claims light study before bed is better.',
    essayPrompt: 'Synthesize these two ideas. Explain how a student can balance adequate sleep hygiene with active studying to optimize overall cognitive retention.',
    minWords: 40
  });

  finalChapters.push({
    id: '20',
    title: 'The Executive Summary',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'writing_center',
    intro: 'Your final writing task is condensing a complex 5-page research proposal into a highly dense academic abstract.',
    essayPrompt: 'Write a professional abstract summarizing a mock research project that investigates whether classical background music improves student focus during math exams.',
    minWords: 40
  });

  // ==========================================
  // 5. CAMPUS LIBRARY - CHAPTERS 21-25
  // ==========================================
  finalChapters.push({
    id: '21',
    title: 'Advisor\'s Email Guide',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'library',
    intro: 'You find a quiet study cubby in the Library. You open your inbox and carefully read a detailed welcome email from your academic advisor.',
    documentTitle: 'Welcome to Your First Semester! — Office of Academic Advising',
    documentBody: 'Dear Student,\n\nWelcome to your first semester! As your academic advisor, my goal is to help you navigate your degree requirements, select appropriate classes, and connect you with tutoring and study groups.\n\nOur office is located in Room 102 of the Academic Services Building, directly adjacent to the campus Library. Regular walk-in advising hours are held every Tuesday and Thursday from 1:00 PM to 4:00 PM. If you require a comprehensive degree planning session, please use our online booking portal, "CampusSched," to schedule a dedicated 30-minute appointment at least 48 hours in advance.\n\nIn addition to academic planning, we are hosting a mandatory "Time Management & Exam Prep" workshop on September 22nd in the main library auditorium. This workshop is highly recommended for all first-year students adjusting to college-level reading and writing loads.\n\nPlease reach out if you have any questions or feel overwhelmed. We are here to support your journey.\n\nWarm regards,\n\nDr. Elena Reyes\nDirector of First-Year Advising',
    questions: [
      {
        id: 'q21_1',
        questionText: 'When are walk-in advising hours held by Dr. Reyes?',
        options: [
          'Mondays and Wednesdays from 9:00 AM to 12:00 PM',
          'Tuesdays and Thursdays from 1:00 PM to 4:00 PM',
          'Friday mornings only',
          'Walk-ins are not permitted; appointments are mandatory'
        ],
        correctIndex: 1
      },
      {
        id: 'q21_2',
        questionText: 'How much notice is required to schedule a full 30-minute degree planning session?',
        options: [
          'At least 24 hours',
          'At least 48 hours',
          'One week',
          'No notice is required'
        ],
        correctIndex: 1
      }
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: '22',
    title: 'Scholarly Abstract Reading',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'library',
    intro: 'You select an academic journal to practice reading dense scholarly abstracts under a glowing green banker\'s lamp.',
    documentTitle: 'Journal of Educational Psychology: Cognitive Load & Memory Retentiveness',
    documentBody: 'Abstract: This study examines the impact of multimedia lecture slides on student cognitive load during first-year college lectures. We surveyed 150 participants split into two instructional groups. Group A was presented with highly visual slides containing minimal text, while Group B viewed text-dense slides. Statistical results indicate that Group A demonstrated a twenty percent higher recall of key terminologies on a delayed comprehension test. We conclude that reducing on-screen textual redundancy minimizes extraneous cognitive load, allowing working memory to process essential auditory explanations more effectively.',
    questions: [
      {
        id: 'q22_1',
        questionText: 'What was the primary finding regarding Group A, who viewed highly visual slides?',
        options: [
          'They fell asleep during the lecture',
          'They showed a twenty percent higher recall of key terminologies',
          'They requested more text-dense slides',
          'They failed the delayed comprehension test'
        ],
        correctIndex: 1
      },
      {
        id: 'q22_2',
        questionText: 'What is the academic conclusion regarding extraneous cognitive load?',
        options: [
          'Increasing text density helps students focus',
          'Reducing on-screen text redundancy allows working memory to process audio better',
          'Cognitive load has no impact on student retention',
          'Visual slides are highly distracting to college students'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '23',
    title: 'The Syllabus Policy',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'library',
    intro: 'You read through the university\'s uniform syllabus policy on grading scales and academic dishonesty.',
    documentTitle: 'University Regulations: Course Policy & Academic Integrity',
    documentBody: 'Section 4.1: Grading Scale. All courses under the liberal arts catalog adhere to a standard four-point scale. An "A" represents outstanding achievement (93-100%), a "B" represents commendable performance (83-89%), and a "C" denotes satisfactory progress (73-79%).\n\nSection 4.2: Academic Honesty. Plagiarism, defined as submitting another individual\'s work or ideas as one\'s own without explicit citation, is strictly prohibited. First offenses result in an automatic zero on the assignment and a formal referral to the Dean of Students. A second offense is grounds for immediate course failure and administrative suspension.',
    questions: [
      {
        id: 'q23_1',
        questionText: 'According to Section 4.1, what range corresponds to a "B" grade?',
        options: [
          '90-92%',
          '83-89%',
          '73-79%',
          '60-69%'
        ],
        correctIndex: 1
      },
      {
        id: 'q23_2',
        questionText: 'What is the immediate penalty for a first-time plagiarism offense?',
        options: [
          'A verbal warning from the professor',
          'An automatic zero on the assignment and a referral to the Dean',
          'Immediate expulsion from the university',
          'A mandatory fine paid to the library'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '24',
    title: 'Research Grant Guidelines',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'library',
    intro: 'You review the application checklist for the Undergrad Summer Research Grant.',
    documentTitle: 'Office of Research: Undergrad Summer Grant Circular',
    documentBody: 'The Office of Research is pleased to announce funding for summer research projects. Grants up to $3,000 are awarded to qualified undergraduates. To apply, students must draft a 1,000-word proposal detailing their methodology, secure a written endorsement from a tenure-track faculty sponsor, and submit a budget outline by April 5th.\n\nFunds may be utilized for lab equipment, field travel, or participant compensation, but cannot be spent on personal laptops or tuition. Awardees are required to present their findings at the Fall Undergraduate Symposium in October.',
    questions: [
      {
        id: 'q24_1',
        questionText: 'What is the maximum funding amount awarded by this research grant?',
        options: [
          '$1,000',
          '$2,000',
          '$3,000',
          '$5,000'
        ],
        correctIndex: 2
      },
      {
        id: 'q24_2',
        questionText: 'Which of the following is an unapproved use of the grant funds?',
        options: [
          'Laboratory equipment',
          'Field travel expenses',
          'Purchasing a personal laptop',
          'Participant compensation'
        ],
        correctIndex: 2
      }
    ]
  });

  finalChapters.push({
    id: '25',
    title: 'Elm University Archives',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'library',
    intro: 'You read an archived historical booklet detailing the founding of your university campus.',
    documentTitle: 'Historical Review: The Founding of Elm University (Est. 1895)',
    documentBody: 'Elm University was founded in 1895 through a land grant donation by industrialist Thomas Elm. Originally established as a practical agricultural college, the institution expanded into a comprehensive research university in 1920. The iconic "Hall of Science" was built in 1925 to honor the university’s scientific contributions during the early industrial era. Today, the campus retains its classical red-brick architectural style, maintaining over one hundred historical elm trees planted during the inaugural ceremony in 1896.',
    questions: [
      {
        id: 'q25_1',
        questionText: 'In what year was Elm University originally established?',
        options: [
          '1895',
          '1920',
          '1925',
          '1896'
        ],
        correctIndex: 0
      },
      {
        id: 'q25_2',
        questionText: 'Who donated the land grant to establish the university?',
        options: [
          'Advisor Reyes',
          'Professor Sterling',
          'Industrialist Thomas Elm',
          'Solomon Asch'
        ],
        correctIndex: 2
      }
    ]
  });

  // ==========================================
  // 6. DINING HALL (CAMPUS LIFE) - CHAPTERS 26-30
  // ==========================================
  finalChapters.push({
    id: '26',
    title: 'Dinner with Jordan',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dining_hall',
    intro: 'The cozy aroma of freshly baked pasta fills the Dining Hall. You spot Jordan waving from a booth in the corner, ready to chat.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! Glad you made it to dinner. The dining hall is packed tonight. How was your day of classes?',
    npcLines: [
      'That sounds amazing! Honestly, college is a huge adjustment, but I think we are both going to do great here.',
      'Oh, did you hear about the student psychology club? They are hosting an event next week with free food.',
      'I was studying in the library earlier and saw Biscuit the cat sleeping right on the checkout counter. The librarian even made him a little nametag!',
      'By the way, we should totally plan a study group for our midterm prep. Studying together makes it so much easier!',
      'Let’s get some ice cream for dessert. They have the waffle cones today!'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '27',
    title: 'Midterm Stress Relief',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dining_hall',
    intro: 'You meet Jordan for a quick lunch between classes. Jordan has a large cup of coffee and looks a bit tired.',
    npcName: 'Jordan',
    initialGreeting: 'Ugh, I stayed up way too late studying for our history midterm. I feel like my brain is completely saturated! How are you holding up with the exam stress?',
    npcLines: [
      'You are totally right. Pulling all-nighters actually degrades memory retention anyway.',
      'A walk in the quad sounds perfect. Let\'s do that after we eat.',
      'By the way, Advisor Reyes said that if we need extra help, there are writing workshops on Wednesday afternoons.',
      'Look at that! Biscuit is sitting on the bench outside, completely relaxed. He is a role model for stress management.',
      'Alright, let\'s finish our lunch and head to our next lecture!'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '28',
    title: 'The Great Dessert Debate',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dining_hall',
    intro: 'You and Jordan finish dinner and walk over to the dessert station, laughing about a joke from class.',
    npcName: 'Jordan',
    initialGreeting: 'They have both the chocolate-dip waffle cones and the vanilla cupcakes with sprinkles tonight! This is a major decision. Which dessert do you think is superior?',
    npcLines: [
      'Waffle cones are definitely the classic choice. That crunch is unbeatable!',
      'Cupcakes are great too, but they can be super messy if the frosting is piled too high.',
      'Let\'s grab both and split them! That solves the dilemma perfectly.',
      'Hey, I think Sophia is sitting over there near the window. Let\'s go sit with her and eat our dessert.',
      'This was the perfect way to wrap up a long day of lectures.'
    ]
  });

  finalChapters.push({
    id: '29',
    title: 'Weekend Trip Planning',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dining_hall',
    intro: 'Over breakfast, Jordan suggests taking a weekend trip off-campus to explore the surrounding city.',
    npcName: 'Jordan',
    initialGreeting: 'Morning! I was thinking we should take the local city bus this Saturday and visit the botanical gardens downtown. What do you think about getting off-campus for a few hours?',
    npcLines: [
      'Awesome! The bus fare is super cheap with our student IDs, which is a major bonus.',
      'I\'ll pack some sandwiches from the grab-and-go counter so we don\'t have to spend a fortune on lunch.',
      'We can leave around ten in the morning and be back in time for our Sunday library study session.',
      'I wonder if Biscuit would fit in my backpack. Just kidding, the library staff would probably launch a search party!',
      'Great! I\'ll look up the bus schedule right now.'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '30',
    title: 'Semester End Toast',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dining_hall',
    intro: 'It is the last week of classes. You and Jordan share a celebratory meal to mark your achievements.',
    npcName: 'Jordan',
    initialGreeting: 'We actually survived our first semester! It feels like just yesterday we were hauling those heavy suitcases into Room 204. What was your favorite part of this whole experience?',
    npcLines: [
      'Meeting so many incredible people was definitely a highlight for me too.',
      'Honestly, our late-night study sessions in the dorm room made all the difference.',
      'We should definitely make this dinner a semester-end tradition every year!',
      'Let\'s raise our glasses—here is to a successful first semester and many more to come!',
      'Now, let\'s get back to packing our bags for winter break!'
    ]
  });

  // ==========================================
  // 7. STUDENT UNION - CHAPTERS 31-35
  // ==========================================
  finalChapters.push({
    id: '31',
    title: 'Campus Club Fair',
    type: ChapterType.LECTURE,
    skill: SkillType.LISTENING,
    locationId: 'student_union',
    intro: 'You head to the Student Union where the annual Campus Club Fair is in full swing. You listen to a presentation about the public speaking and debate club.',
    transcript: 'Welcome to the Campus Debate Society orientation. Joining an academic club is one of the best ways to practice active listening and advanced speaking skills. Our society participates in parliamentary debate formats, which teach students to think critically under pressure, construct robust counter-arguments, and deliver persuasive speeches. Every week, we debate motions covering global ethics, science policies, and economic systems. We meet on Mondays at 7:00 PM in Room 301 of the Student Union. Remember, debate is not about shouting; it is about structured, logical arguments supported by credible evidence. We hope to see you at our first mock debate next week!',
    questions: [
      {
        id: 'q31_1',
        questionText: 'What format of debate does the society participate in?',
        options: [
          'Informal forum style',
          'Parliamentary debate formats',
          'Online text debates',
          'No structured format'
        ],
        correctIndex: 1
      },
      {
        id: 'q31_2',
        questionText: 'When and where does the society meet?',
        options: [
          'Tuesdays in the Library',
          'Mondays at 7:00 PM in Student Union Room 301',
          'Wednesdays at the Dining Hall',
          'Thursdays in Elm Hall'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '32',
    title: 'Student Government Debate',
    type: ChapterType.LECTURE,
    skill: SkillType.LISTENING,
    locationId: 'student_union',
    intro: 'You attend a student presidential election debate in the Student Union main lounge.',
    transcript: 'Thank you all for coming. As candidate for Student Government President, my platform focuses on mental health advocacy. Currently, students wait up to three weeks for counseling appointments. I propose funding two additional peer-counselors using student union surplus budgets. Furthermore, I will implement a "De-stress Week" during final exams, which will include free breakfast bagels, study packs, and animal-assisted therapy sessions in the central quad. Your vote on Thursday directly shapes the resources available to our community.',
    questions: [
      {
        id: 'q32_1',
        questionText: 'What is the primary focus of the candidate’s platform?',
        options: [
          'Lowering parking ticket costs',
          'Mental health advocacy and reducing counselor wait times',
          'Adding more sports equipment',
          'Renovating the dining hall kitchen'
        ],
        correctIndex: 1
      },
      {
        id: 'q32_2',
        questionText: 'Which event does the candidate propose for final exams week?',
        options: [
          'A mandatory math exam',
          'A "De-stress Week" featuring free breakfast bagels and animal-assisted therapy',
          'A campus-wide sports tournament',
          'An off-campus bus excursion'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '33',
    title: 'Volunteer Fair Orientation',
    type: ChapterType.LECTURE,
    skill: SkillType.LISTENING,
    locationId: 'student_union',
    intro: 'You listen to an orientation presentation about the university\'s community volunteering coalition.',
    transcript: 'Welcome, students. Our community outreach program coordinates off-campus tutoring and park cleaning. Last semester, Elm University volunteers tutored over eighty local high school students in math and English. Volunteering is not only a fantastic way to give back; it also builds communication literacy and leadership skills. To register, attend our briefing next Tuesday or complete the online safety training module. All volunteers receive a complimentary volunteer T-shirt and a certificate of community service signed by the Dean.',
    questions: [
      {
        id: 'q33_1',
        questionText: 'How many local high school students were tutored by volunteers last semester?',
        options: [
          'Ten students',
          'Over eighty students',
          'Nearly five hundred students',
          'No tutoring was done'
        ],
        correctIndex: 1
      },
      {
        id: 'q33_2',
        questionText: 'What must students do to register as volunteers?',
        options: [
          'Pay a registration fee',
          'Attend next Tuesday’s briefing or complete the online safety module',
          'Pass a rigorous academic English exam',
          'Secure an endorsement from Advisor Reyes'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '34',
    title: 'Study Abroad Information',
    type: ChapterType.LECTURE,
    skill: SkillType.LISTENING,
    locationId: 'student_union',
    intro: 'You attend an informational seminar about study abroad opportunities in Europe and Asia.',
    transcript: 'Studying abroad is an invaluable global academic experience. Elm University offers exchange programs with partner institutions in Madrid, Tokyo, and London. To qualify, you must have a minimum GPA of 2.75 and have completed at least 24 academic credits. Applications for the Spring semester exchange must be submitted to the international office by October 1st. Funding is available through the Global Scholars Scholarship, which offsets up to fifty percent of flight and lodging costs.',
    questions: [
      {
        id: 'q34_1',
        questionText: 'What is the minimum GPA required to qualify for study abroad exchange programs?',
        options: [
          '2.0 GPA',
          '2.5 GPA',
          '2.75 GPA',
          '3.5 GPA'
        ],
        correctIndex: 2
      },
      {
        id: 'q34_2',
        questionText: 'How much cost does the Global Scholars Scholarship offset?',
        options: [
          'Up to ten percent of books',
          'Up to fifty percent of flight and lodging costs',
          'The entire tuition cost of college',
          'Only public transit bus fares'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '35',
    title: 'Campus Security Workshop',
    type: ChapterType.LECTURE,
    skill: SkillType.LISTENING,
    locationId: 'student_union',
    intro: 'You attend a night safety workshop hosted by the campus police department in the union auditorium.',
    transcript: 'Safety is a shared responsibility. The campus police department operates 24/7 patrols. We offer a "SafeWalk" escort service: if you are studying late in the library or science lab, call 555-SAFE, and a trained escort will walk you to your dorm. Additionally, we have over fifty blue-light emergency phones situated across all major pathways. Pressing the button connects you instantly to our dispatch, automatically transmitting your exact physical location.',
    questions: [
      {
        id: 'q35_1',
        questionText: 'What is the phone number for the "SafeWalk" escort service?',
        options: [
          '911-EMERGENCY',
          '555-SAFE',
          '555-DORM',
          'Call Dr. Reyes’ office'
        ],
        correctIndex: 1
      },
      {
        id: 'q35_2',
        questionText: 'What happens when you press the button on a blue-light emergency phone?',
        options: [
          'It turns off the pathway lights',
          'It connects you instantly to dispatch and transmits your location',
          'It sounds a silent alarm in Elm Hall only',
          'It plays classical music'
        ],
        correctIndex: 1
      }
    ]
  });

  // ==========================================
  // 8. SCIENCE LAB - CHAPTERS 36-40
  // ==========================================
  finalChapters.push({
    id: '36',
    title: 'Water Quality Report',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'science_lab',
    intro: 'You join your chemistry lab group to write a joint scientific report on environmental water quality.',
    essayPrompt: 'Write a summary paragraph of a scientific experiment. Describe the importance of controls, hypotheses, and peer reviews in scientific writing.',
    minWords: 40
  });

  finalChapters.push({
    id: '37',
    title: 'Lab Safety Protocol',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'science_lab',
    intro: 'The lab instructor requests that each group write out a clear, step-by-step safety protocol for chemical handling.',
    essayPrompt: 'Draft a safety protocol for handling hazardous reagents in a chemistry lab. Detail the use of personal protective equipment (PPE), emergency eye-wash procedures, and chemical waste disposal.',
    minWords: 40
  });

  finalChapters.push({
    id: '38',
    title: 'Formulating Hypotheses',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'science_lab',
    intro: 'You practice drafting clear, testable scientific hypotheses for an upcoming botany experiment.',
    essayPrompt: 'Define what makes an academic hypothesis "testable." Write a specific, testable hypothesis examining whether increased nitrogen levels in soil speed up the growth of tomato plants.',
    minWords: 40
  });

  finalChapters.push({
    id: '39',
    title: 'Analyzing Lab Graphs',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'science_lab',
    intro: 'You analyze a graph showing enzyme reaction rates at different temperatures and summarize the results.',
    essayPrompt: 'Write a paragraph interpreting a scientific line graph. Explain how temperature affects enzyme activity, defining terms like "optimal temperature" and "denaturation" in your analysis.',
    minWords: 40
  });

  finalChapters.push({
    id: '40',
    title: 'Peer Review Rebuttal',
    type: ChapterType.INDEPENDENT_WORK,
    skill: SkillType.WRITING,
    locationId: 'science_lab',
    intro: 'You practice drafting a formal response letter to address critical feedback from a peer reviewer on your biology paper.',
    essayPrompt: 'Draft a professional response to a reviewer who critiqued your sample size. Respectfully explain how you addressed their concerns, outlining why your sample remains statistically valid.',
    minWords: 40
  });

  // ==========================================
  // 9. CAREER CENTER - CHAPTERS 41-45
  // ==========================================
  finalChapters.push({
    id: '41',
    title: 'Internship Guidelines',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'career_center',
    intro: 'You visit the Career Services Center to read through the guidelines for securing on-campus internships and research assistant positions.',
    documentTitle: 'Career Services Center: Guidelines for Academic Internships',
    documentBody: 'Welcome to Career Services. Academic internships are structured, credit-bearing work experiences designed to bridge classroom learning and professional practice.\n\nTo qualify for an on-campus research internship, a student must have completed at least 12 credit hours, maintain a minimum GPA of 3.0, and secure a faculty sponsor. Application deadlines are strictly enforced: for Fall internships, applications must be submitted by October 15th; for Spring, by March 1st.\n\nStudents are required to maintain a weekly reflective log detailing their technical contributions, participate in monthly progress reviews with their faculty advisor, and submit a final 5-page research report. Successful completion grants 3 academic credits and a certificate of merit.\n\nVisit our office in the Career Center, Room 205, for resume reviews and interview preparation workshops.',
    questions: [
      {
        id: 'q41_1',
        questionText: 'What is the minimum GPA required to qualify for an on-campus research internship?',
        options: [
          '2.0 GPA',
          '2.5 GPA',
          '3.0 GPA',
          '3.5 GPA'
        ],
        correctIndex: 2
      },
      {
        id: 'q41_2',
        questionText: 'When is the application deadline for Fall semester internships?',
        options: [
          'September 1st',
          'October 15th',
          'November 30th',
          'March 1st'
        ],
        correctIndex: 1
      }
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: '42',
    title: 'Resume & Cover Letters',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'career_center',
    intro: 'You study professional guidelines for drafting standard, highly scannable cover letters.',
    documentTitle: 'Career Services: Structuring Your Professional Cover Letter',
    documentBody: 'A cover letter must follow a strict three-paragraph hierarchy. The first paragraph introduces your profile and specifies the desired position. The second paragraph synthesizes your qualifications, connecting your coursework directly to the job requirements. The third paragraph contains a professional call to action, expressing your desire for an interview and detailing your availability. Always address the letter to a specific hiring manager; "To Whom It May Concern" is considered outdated and impersonal.',
    questions: [
      {
        id: 'q42_1',
        questionText: 'What is the recommended paragraph structure for a professional cover letter?',
        options: [
          'A single long block of text',
          'A strict three-paragraph hierarchy (introduction, qualifications, call to action)',
          'Exactly ten bullet points',
          'An informal letter with drawings'
        ],
        correctIndex: 1
      },
      {
        id: 'q42_2',
        questionText: 'Why should you avoid addressing a letter with "To Whom It May Concern"?',
        options: [
          'Because it is too long',
          'It is considered outdated and impersonal; always aim to address a specific hiring manager',
          'It violates basic copyright laws',
          'Hiring managers prefer informal greetings like "Hey there!"'
        ],
        correctIndex: 1
      }
    ]
  });

  finalChapters.push({
    id: '43',
    title: 'Networking & Etiquette',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'career_center',
    intro: 'You read an advice flyer on professional networking etiquette and elevator pitches.',
    documentTitle: 'Career Guide: Crafting Your 30-Second Elevator Pitch',
    documentBody: 'An elevator pitch is a concise, 30-second summary of your skills, academic background, and career aspirations. It should cover three key questions: Who are you? What do you do? What are you looking to accomplish? When delivering your pitch at networking fairs, always maintain steady eye contact, offer a firm handshake, and ensure your attire is business-casual. Follow up within twenty-four hours by sending a personalized connection request on professional social networks like LinkedIn.',
    questions: [
      {
        id: 'q43_1',
        questionText: 'How long should a standard elevator pitch be?',
        options: [
          'Ten seconds or less',
          'Approximately 30 seconds',
          'At least five minutes',
          'An hour-long seminar'
        ],
        correctIndex: 1
      },
      {
        id: 'q43_2',
        questionText: 'What is the recommended follow-up protocol after a networking event?',
        options: [
          'Call the person immediately at midnight',
          'Wait at least one month before reaching out',
          'Send a personalized professional connection request within twenty-four hours',
          'Send a general greeting card via mail'
        ],
        correctIndex: 2
      }
    ]
  });

  finalChapters.push({
    id: '44',
    title: 'The Student Worker Contract',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'career_center',
    intro: 'You read a standard university contract for student workers employed as on-campus assistants.',
    documentTitle: 'Human Resources: Standard On-Campus Employment Contract',
    documentBody: 'Section 1. Hours. On-campus student employees are strictly limited to a maximum of twenty hours of work per week during active academic semesters. This limitation ensures that employment does not interfere with academic performance.\n\nSection 2. Confidentiality. Student workers often handle sensitive registration or research data. Signing this contract binds the employee to strict non-disclosure guidelines. Sharing student records or passwords with unauthorized parties is ground for immediate termination and academic suspension.',
    questions: [
      {
        id: 'q44_1',
        questionText: 'What is the maximum number of hours a student worker can log per week during semesters?',
        options: [
          'Ten hours',
          'Twenty hours',
          'Thirty-five hours',
          'Unlimited hours'
        ],
        correctIndex: 1
      },
      {
        id: 'q44_2',
        questionText: 'What happens if a student worker shares sensitive records or passwords?',
        options: [
          'They receive a small grading penalty',
          'They are fined ten dollars',
          'Immediate employment termination and academic suspension',
          'They are reassigned to Elm Hall cleaning duties'
        ],
        correctIndex: 2
      }
    ]
  });

  finalChapters.push({
    id: '45',
    title: 'Graduate School Checklist',
    type: ChapterType.LIBRARY,
    skill: SkillType.READING,
    locationId: 'career_center',
    intro: 'You read an application checklist for pursuing a Master\'s or Ph.D. program after graduation.',
    documentTitle: 'Admissions Office: Graduate School Application Blueprint',
    documentBody: 'Applying to graduate school requires early, structured preparation. A complete application packet consists of: a completed application form, official university transcripts, three letters of recommendation from tenure-track faculty, a 2-page Statement of Purpose (SOP) outlining your research goals, and standardized test scores if applicable. Most top-tier programs enforce a priority admission deadline of December 1st for enrollment starting the following Fall.',
    questions: [
      {
        id: 'q45_1',
        questionText: 'How many letters of recommendation are typically required for graduate applications?',
        options: [
          'One letter',
          'Two letters',
          'Three letters',
          'Five letters'
        ],
        correctIndex: 2
      },
      {
        id: 'q45_2',
        questionText: 'When is the standard priority admission deadline for top-tier graduate programs?',
        options: [
          'December 1st',
          'February 15th',
          'April 5th',
          'September 1st'
        ],
        correctIndex: 0
      }
    ]
  });

  // ==========================================
  // 10. UNIVERSITY QUAD - CHAPTERS 46-50
  // ==========================================
  finalChapters.push({
    id: '46',
    title: 'The Quad Reflection',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'quad',
    intro: 'The semester is coming to an end. You sit on a park bench on the grassy University Quad under the golden autumn trees, reflecting with classmate Sophia.',
    npcName: 'Sophia',
    initialGreeting: 'Can you believe we actually finished our first semester? The campus looks so beautiful today with the red and gold leaves. How do you feel about everything we learned?',
    npcLines: [
      'I know, right? I remember how nervous we were on Move-In Day. Now, we are analyzing psychology research and writing lab reports!',
      'Honestly, practicing academic English in real-life debates and essays was so helpful. I feel so much more confident speaking up in class.',
      'Oh look, Biscuit the cat is running across the lawn! He always knows when the sun is out.',
      'We should definitely celebrate by getting dinner with Jordan tonight. Let us keep studying together next semester!',
      'We did it! Here is to the rest of our college journey!'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '47',
    title: 'Biscuit\'s Sunny Afternoon',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'quad',
    intro: 'You and Sophia spot Biscuit the cat stretching on a warm stone wall in the Quad. You walk over to pet him.',
    npcName: 'Sophia',
    initialGreeting: 'Look at Biscuit! He is practically soaking up the sunshine. I read that interacting with animals actually lowers cortisol levels and boosts concentration. How are your energy levels?',
    npcLines: [
      'It really does. Just petting Biscuit for a minute makes all the study anxiety vanish.',
      'He is so fluffy! The library staff is so lucky to have him as a mascot.',
      'I heard Dr. Reyes is coordinating a pet-therapy event in the quad during finals. That will be amazing.',
      'Definitely! Let\'s sit under that big maple tree and review our vocabulary terms.',
      'Biscuit fell back asleep. He really is the king of relaxation.'
    ],
    biscuitCatMentioned: true
  });

  finalChapters.push({
    id: '48',
    title: 'Future Career Aspirations',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'quad',
    intro: 'As golden leaves gently drift from the trees, you and Sophia talk about what you hope to do after graduation.',
    npcName: 'Sophia',
    initialGreeting: 'I was looking at the Career Center notice board earlier, and it got me thinking about the future. What are your dream goals for after we complete our degrees?',
    npcLines: [
      'That is such an inspiring goal! You have definitely got the academic drive for it.',
      'Yes, getting a solid internship next summer is my priority too.',
      'Dr. Reyes said she could write recommendation letters for us if we maintain our GPAs, which is huge.',
      'The quad is so peaceful today. It\'s hard to believe we will be sophomore students soon.',
      'Let\'s make sure we stay focused and keep helping each other study!'
    ]
  });

  finalChapters.push({
    id: '49',
    title: 'Sophia\'s Study Flashcards',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'quad',
    intro: 'Sophia pulls out a stack of handwritten study cards to help you review key vocabulary before finals.',
    npcName: 'Sophia',
    initialGreeting: 'Okay, let\'s do a quick active-recall session! I\'ll name an academic English term, and you tell me what it means or how you\'d use it in an essay. Ready to quiz?',
    npcLines: [
      'Spot on! That was a perfect definition of "synthesis."',
      'Excellent! Using cohesive transitional phrases really elevates essay flow.',
      'Wow, you are completely crushing these definitions. The final exam should be a breeze!',
      'Let\'s do one more card before we wrap up and head inside.',
      'Awesome study session. We make a great academic team!'
    ]
  });

  finalChapters.push({
    id: '50',
    title: 'Farewell to the Elm Trees',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'quad',
    intro: 'On the very last day of the semester, you, Jordan, and Sophia meet in the Quad to take a group photo.',
    npcName: 'Sophia',
    initialGreeting: 'This is it—the official end of our first college semester! We have to take a picture under the big elm trees to remember this day. Jordan, get in the frame! Are we all ready?',
    npcLines: [
      'Say cheese! That photo turned out absolutely perfect. I\'ll email it to both of you.',
      'Look at that—even Biscuit made it into the corner of the picture! He\'s officially in our class photo.',
      'I am going to miss Room 204 and Elm Hall so much over the winter break.',
      'Let\'s stay in touch and text each other every week.',
      'Have an amazing, restful break! We earned it. See you both next semester!'
    ],
    biscuitCatMentioned: true
  });

  // Dynamically replace 'Elm Hall' references with the actual selected dorm details (scoped only to the dorm-room location and chapter 50)
  finalChapters.forEach(c => {
    if (c.locationId === 'dorm' || c.id === '50') {
      const isOak = dorm === 'Oak Hall';
      const isPine = dorm === 'Pine Hall';
      const dormName = dorm || 'Elm Hall';
      const roomNum = isOak ? 'Room 306' : (isPine ? 'Room 108' : 'Room 204');
      const treeType = isOak ? 'oak' : (isPine ? 'pine' : 'elm');
      const posterStyle = isOak ? 'minimalist modern design posters' : (isPine ? 'vintage indie posters and green plants' : 'classic music posters');

      const replaceAll = (text: string): string => {
        if (!text) return text;
        return text
          .replace(/Elm Hall/g, dormName)
          .replace(/Room 204/g, roomNum)
          .replace(/elm trees/g, `${treeType} trees`)
          .replace(/classic music posters/g, posterStyle);
      };

      if (c.title) c.title = replaceAll(c.title);
      if (c.intro) c.intro = replaceAll(c.intro);
      if (c.prose) {
        c.prose = c.prose.map(p => replaceAll(p));
      }
      if (c.initialGreeting) c.initialGreeting = replaceAll(c.initialGreeting);
      if (c.npcLines) {
        c.npcLines = c.npcLines.map(line => replaceAll(line));
      }
      if (c.discussionPrompt) c.discussionPrompt = replaceAll(c.discussionPrompt);
      if (c.essayPrompt) c.essayPrompt = replaceAll(c.essayPrompt);
    }
  });

  // ==========================================
  // JORDAN FRIENDSHIP MILESTONE CHAPTERS (10, 25, 50 PTS)
  // ==========================================
  finalChapters.push({
    id: 'jordan_milestone_10',
    title: "Jordan's Campus Secret",
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dorm',
    intro: 'Jordan invites you for a quick chat to share a hidden study spot near Elm Hall and tell you about Biscuit\'s origins.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! Since we\'ve been hanging out so much, I have to show you my absolute favorite quiet spot behind the Quad archway! And guess what? That\'s where Biscuit first adopted me last year when I fed him a piece of warm scone.',
    npcLines: [
      'It really is the best spot when you need to recharge away from noisy study groups.',
      'Biscuit loves it there too—he usually naps under the stone bench while I do my readings.',
      'I\'m so glad we ended up as roommates this semester. Having a reliable friend makes campus feel much warmer!',
      'Let\'s definitely study there together before our next midterms!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: 'jordan_milestone_25',
    title: 'Coffee & Deep Talks',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'student_union',
    intro: 'Jordan waves you over at the Student Union coffee corner for an impromptu study break and coffee.',
    npcName: 'Jordan',
    initialGreeting: 'Hey study buddy! I bought us some roasted coffee. I wanted to thank you for always supporting me. Honestly, when I first got to campus, I was terrified I wouldn\'t fit in or keep up with academic expectations.',
    npcLines: [
      'I really appreciate you listening. Sharing academic goals with you makes everything feel achievable.',
      'By the way, Biscuit was sitting right by the coffee shop door earlier looking for pastries!',
      'Whenever you need help practicing speeches or proofreading, I\'ve always got your back.',
      'Here\'s to surviving our first semester with flying colors!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: 'jordan_milestone_50',
    title: 'A Special Campus Gift',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'library',
    intro: 'Jordan meets you outside the Campus Library with a beaming smile and a small gift in hand.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! Our friendship score just reached true best-friend level! I made something special for you—a custom leather bookmark with Biscuit\'s little paw print on it. You\'re the best roommate anyone could ask for!',
    npcLines: [
      'I asked the campus craft workshop to help me engrave it. It\'s guaranteed to bring you luck on every exam!',
      'Biscuit actually sat on the table while I was making it, so it officially has his feline blessing.',
      'We\'ve accomplished so much together this semester. I couldn\'t have done it without your encouragement!',
      'Let\'s keep pushing forward together. You\'re an incredible scholar and friend!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: 'jordan_milestone_75',
    title: 'Late Night Cramming',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'dorm',
    intro: 'Jordan is sitting at the dorm desk late at night looking overwhelmed before a big midterm. You pause to offer encouragement.',
    npcName: 'Jordan',
    initialGreeting: 'Hey... sorry for the stressed vibe. I\'ve been staring at this economics review guide for three hours and my mind is completely blanking out on supply elasticity formulas.',
    npcLines: [
      'Thank you for stopping to help me break this down step-by-step. Just talking through it out loud makes a world of difference!',
      'Biscuit is asleep on my notebook right now, acting like a fluffy paperweight to keep me grounded.',
      'Knowing you have my back when the academic pressure builds up means everything to me.',
      'Alright, let\'s crush this exam together tomorrow morning!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: 'jordan_milestone_100',
    title: 'Family Call',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'university_quad',
    intro: 'Jordan catches you after you finish a video call with family back home and opens up about missing home.',
    npcName: 'Jordan',
    initialGreeting: 'Hey, I couldn\'t help but overhear you laughing with your family on the phone just now. It reminded me how much I miss Sunday dinners with my own family.',
    npcLines: [
      'Moving away for college was a bigger adjustment than I expected, even with all the exciting campus events.',
      'Hearing you speak so warmly with your folks made me feel comfortable enough to open up about my homesickness.',
      'You really create a warm, welcoming space wherever you go.',
      'I think I\'m going to give my mom a quick video call right now!'
    ]
  });

  finalChapters.push({
    id: 'jordan_milestone_130',
    title: 'Roommate Ritual',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'student_union',
    intro: 'Jordan meets you with two warm cups of hot chocolate and proposes a new weekly roommate tradition.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! I was thinking... we\'ve survived over half the semester together, so it\'s time we officially establish a weekly Roommate Tradition! How about Sunday Hot Chocolate & Movie Night?',
    npcLines: [
      'We can take turns picking movies and grab warm pastries from the bakery downstairs.',
      'Biscuit approves too—he already claimed the middle cushion on our dorm lounge sofa for movie nights!',
      'Having set rituals like this makes the semester feel balanced no matter how busy coursework gets.',
      'Mark your calendar—Sunday 8 PM is officially sacred roommate downtime!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  finalChapters.push({
    id: 'jordan_milestone_160',
    title: 'Standing Up for a Friend',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'seminar_room',
    intro: 'Jordan shares a dilemma about a group project dispute where another student took credit for Jordan\'s research, and thanks you for standing up for them.',
    npcName: 'Jordan',
    initialGreeting: 'Hey! I wanted to talk to you about what happened in our group seminar yesterday. When Alex tried to gloss over my contributions, you stepped in and spoke up for me.',
    npcLines: [
      'I usually freeze up in those kinds of confrontational moments, so having you speak with such clarity and confidence was incredible.',
      'Because of your support, Professor Reyes gave our research team proper individual recognition!',
      'It showed me what true loyalty looks like. I\'m really proud to call you my best friend on campus.',
      'Thank you for always having my back when it counts!'
    ]
  });

  finalChapters.push({
    id: 'jordan_milestone_200',
    title: 'End of Semester',
    type: ChapterType.CAMPUS_LIFE,
    skill: SkillType.SPEAKING,
    locationId: 'university_quad',
    intro: 'Jordan meets you under the golden autumn trees in the Quad to reflect on your journey across the entire semester.',
    npcName: 'Jordan',
    initialGreeting: 'Can you believe the semester is almost over? Looking back at day one when we were both navigating the Quad with campus maps, we\'ve come so far!',
    npcLines: [
      'From late-night study sessions and coffee runs to overcoming tough exams and project deadlines, you\'ve been the heart of my campus experience.',
      'Biscuit is practically our third roommate now—I think he\'ll miss you as much as I will over the winter break!',
      'No matter what new challenges next semester brings, I know we\'re going to tackle them together.',
      'Thank you for being such an extraordinary friend throughout this entire journey!'
    ],
    biscuitCatMentioned: true,
    biscuitCatIllustration: true
  });

  return finalChapters;
}

export const HARDCODED_CHAPTERS: Chapter[] = getDynamicChapters('Psychology', 'Elm Hall');

export class InMemoryStoryRepository implements IStoryRepository {
  async getChapters(): Promise<Chapter[]> {
    // We dynamically load the user's major and dorm from localStorage!
    const saved = localStorage.getItem('campus_hero_profile');
    let major: HeroProfile['major'] = 'Undecided';
    let dorm = 'Elm Hall';
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.major) major = parsed.major;
          if (parsed.dorm) dorm = parsed.dorm;
        }
      } catch (e) {
        // ignore
      }
    }
    return getDynamicChapters(major, dorm);
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    const chapters = await this.getChapters();
    const chapter = chapters.find(c => c.id === id);
    return chapter || null;
  }

  async getChaptersByLocation(locationId: string): Promise<Chapter[]> {
    const chapters = await this.getChapters();
    return chapters.filter(c => c.locationId === locationId);
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private profile: HeroProfile = {
    name: '',
    major: 'Undecided',
    dorm: 'Elm Hall',
    examPreference: 'TOEFL',
    isOnboarded: false
  };

  constructor() {
    const saved = localStorage.getItem('campus_hero_profile');
    if (saved) {
      try {
        this.profile = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
  }

  private save() {
    localStorage.setItem('campus_hero_profile', JSON.stringify(this.profile));
  }

  async getProfile(): Promise<HeroProfile> {
    return { ...this.profile };
  }

  async updateProfile(profile: Partial<HeroProfile>): Promise<HeroProfile> {
    this.profile = { ...this.profile, ...profile };
    this.save();
    return { ...this.profile };
  }
}

export class InMemoryProgressRepository implements IProgressRepository {
  private progress: UserProgress = {
    skills: {
      [SkillType.LISTENING]: 0,
      [SkillType.SPEAKING]: 0,
      [SkillType.WRITING]: 0,
      [SkillType.READING]: 0
    },
    completedChapterIds: [],
    currentChapterId: '1',
    friendshipPoints: {}
  };

  private listeners: (() => void)[] = [];

  constructor() {
    const saved = localStorage.getItem('campus_user_progress');
    if (saved) {
      try {
        this.progress = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private save() {
    localStorage.setItem('campus_user_progress', JSON.stringify(this.progress));
    this.notify();
  }

  async getProgress(): Promise<UserProgress> {
    return { ...this.progress };
  }

  async updateProgress(progress: Partial<UserProgress>): Promise<UserProgress> {
    this.progress = { ...this.progress, ...progress };
    this.save();
    return { ...this.progress };
  }

  async incrementSkill(skill: SkillType, amount: number): Promise<UserProgress> {
    const currentVal = this.progress.skills[skill] || 0;
    this.progress.skills[skill] = Math.min(100, currentVal + amount);
    this.save();
    return { ...this.progress };
  }

  async completeChapter(chapterId: string): Promise<UserProgress> {
    if (!this.progress.completedChapterIds.includes(chapterId)) {
      this.progress.completedChapterIds.push(chapterId);
      
      // Determine next chapter
      const nextId = String(Number(chapterId) + 1);
      // We dynamically load chapters based on the saved major and dorm to verify if next chapter exists
      const saved = localStorage.getItem('campus_hero_profile');
      let major: HeroProfile['major'] = 'Undecided';
      let dorm = 'Elm Hall';
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed) {
            if (parsed.major) major = parsed.major;
            if (parsed.dorm) dorm = parsed.dorm;
          }
        } catch (e) {}
      }
      const chs = getDynamicChapters(major, dorm);
      const nextExists = chs.some(c => c.id === nextId);
      if (nextExists) {
        this.progress.currentChapterId = nextId;
      }
    }
    this.save();
    return { ...this.progress };
  }

  async incrementFriendship(npcName: string, amount: number): Promise<number> {
    const current = this.progress.friendshipPoints[npcName] || 0;
    const nextVal = current + amount;
    this.progress.friendshipPoints[npcName] = nextVal;
    this.save();
    return nextVal;
  }
}

export class SupabaseStoryRepository implements IStoryRepository {
  async getChapters(): Promise<Chapter[]> {
    const saved = localStorage.getItem('campus_hero_profile');
    let major: HeroProfile['major'] = 'Undecided';
    let dorm = 'Elm Hall';
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.major) major = parsed.major;
          if (parsed.dorm) dorm = parsed.dorm;
        }
      } catch (e) {
        // ignore
      }
    }
    return getDynamicChapters(major, dorm);
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    const chapters = await this.getChapters();
    const chapter = chapters.find(c => c.id === id);
    return chapter || null;
  }

  async getChaptersByLocation(locationId: string): Promise<Chapter[]> {
    const chapters = await this.getChapters();
    return chapters.filter(c => c.locationId === locationId);
  }
}

export class SupabaseUserRepository implements IUserRepository {
  async getProfile(): Promise<HeroProfile> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      return { name: '', major: 'Undecided', dorm: 'Elm Hall', examPreference: 'TOEFL', isOnboarded: false };
    }

    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        throw new Error('STALE_SESSION');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      localStorage.setItem('campus_hero_profile', JSON.stringify(data));
      return data;
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        throw e;
      }
      console.error('[SupabaseUserRepository] getProfile error, falling back to local storage:', e);
      const saved = localStorage.getItem('campus_hero_profile');
      if (saved) return JSON.parse(saved);
      return { name: '', major: 'Undecided', dorm: 'Elm Hall', examPreference: 'TOEFL', isOnboarded: false };
    }
  }

  async updateProfile(profile: Partial<HeroProfile>): Promise<HeroProfile> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const saved = localStorage.getItem('campus_hero_profile');
      let current: HeroProfile = saved ? JSON.parse(saved) : { name: '', major: 'Undecided', dorm: 'Elm Hall', examPreference: 'TOEFL', isOnboarded: false };
      current = { ...current, ...profile };
      localStorage.setItem('campus_hero_profile', JSON.stringify(current));
      return current;
    }

    const response = await fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    if (response.status === 401) {
      throw new Error('STALE_SESSION');
    }
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    const data = await response.json();
    localStorage.setItem('campus_hero_profile', JSON.stringify(data));
    return data;
  }
}

export class SupabaseProgressRepository implements IProgressRepository {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  async getProgress(): Promise<UserProgress> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const saved = localStorage.getItem('campus_user_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.completionDates) parsed.completionDates = [];
        return parsed;
      }
      return {
        skills: {
          [SkillType.LISTENING]: 0,
          [SkillType.SPEAKING]: 0,
          [SkillType.WRITING]: 0,
          [SkillType.READING]: 0
        },
        completedChapterIds: [],
        currentChapterId: '1',
        friendshipPoints: {},
        completionDates: []
      };
    }

    try {
      const response = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        throw new Error('STALE_SESSION');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      const data = await response.json();
      localStorage.setItem('campus_user_progress', JSON.stringify(data));
      return data;
    } catch (e: any) {
      if (e.message === 'STALE_SESSION') {
        throw e;
      }
      console.error('[SupabaseProgressRepository] getProgress error, falling back to local storage:', e);
      const saved = localStorage.getItem('campus_user_progress');
      if (saved) return JSON.parse(saved);
      return {
        skills: {
          [SkillType.LISTENING]: 0,
          [SkillType.SPEAKING]: 0,
          [SkillType.WRITING]: 0,
          [SkillType.READING]: 0
        },
        completedChapterIds: [],
        currentChapterId: '1',
        friendshipPoints: {}
      };
    }
  }

  async updateProgress(progress: Partial<UserProgress>): Promise<UserProgress> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const saved = localStorage.getItem('campus_user_progress');
      let current: UserProgress = saved ? JSON.parse(saved) : {
        skills: {
          [SkillType.LISTENING]: 0,
          [SkillType.SPEAKING]: 0,
          [SkillType.WRITING]: 0,
          [SkillType.READING]: 0
        },
        completedChapterIds: [],
        currentChapterId: '1',
        friendshipPoints: {}
      };
      current = { ...current, ...progress };
      localStorage.setItem('campus_user_progress', JSON.stringify(current));
      this.notify();
      return current;
    }

    const response = await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(progress)
    });
    if (response.status === 401) {
      throw new Error('STALE_SESSION');
    }
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    const data = await response.json();
    localStorage.setItem('campus_user_progress', JSON.stringify(data));
    this.notify();
    return data;
  }

  async incrementSkill(skill: SkillType, amount: number): Promise<UserProgress> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const progress = await this.getProgress();
      progress.skills[skill] = Math.min(100, (progress.skills[skill] || 0) + amount);
      return this.updateProgress(progress);
    }

    const response = await fetch('/api/user/progress/increment-skill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ skill, amount })
    });
    if (response.status === 401) {
      throw new Error('STALE_SESSION');
    }
    if (!response.ok) {
      throw new Error('Failed to increment skill');
    }
    const data = await response.json();
    localStorage.setItem('campus_user_progress', JSON.stringify(data));
    this.notify();
    return data;
  }

  async completeChapter(chapterId: string): Promise<UserProgress> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const progress = await this.getProgress();
      if (!progress.completedChapterIds.includes(chapterId)) {
        progress.completedChapterIds.push(chapterId);
      }
      if (!progress.completionDates) {
        progress.completionDates = [];
      }
      const todayStr = new Date().toISOString().split('T')[0];
      if (!progress.completionDates.includes(todayStr)) {
        progress.completionDates.push(todayStr);
      }

      if (!progress.encounteredPoses) {
        progress.encounteredPoses = [];
      }
      const MILESTONE_POSES: Record<number, string> = {
        5: 'plus_kitten_1',
        10: 'plus_kitten_2',
        15: 'plus_kitten_3',
        21: 'plus_adolescent_1',
        27: 'plus_adolescent_2',
        33: 'plus_adolescent_3',
        38: 'plus_adult_1',
        44: 'plus_adult_2',
        49: 'plus_adult_3',
        50: 'plus_semester_finale',
      };
      const num = Number(chapterId);
      if (MILESTONE_POSES[num] && !progress.encounteredPoses.includes(MILESTONE_POSES[num])) {
        progress.encounteredPoses.push(MILESTONE_POSES[num]);
      }

      const nextId = String(Number(chapterId) + 1);
      if (!isNaN(Number(chapterId)) && Number(nextId) <= 50) {
        progress.currentChapterId = nextId;
      }
      return this.updateProgress(progress);
    }

    const response = await fetch('/api/user/progress/complete-chapter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ chapterId })
    });
    if (response.status === 401) {
      throw new Error('STALE_SESSION');
    }
    if (!response.ok) {
      throw new Error('Failed to complete chapter');
    }
    const data = await response.json();
    localStorage.setItem('campus_user_progress', JSON.stringify(data));
    this.notify();
    return data;
  }

  async incrementFriendship(npcName: string, amount: number): Promise<number> {
    const token = localStorage.getItem('campus_auth_token');
    if (!token) {
      const progress = await this.getProgress();
      const current = Number(progress.friendshipPoints[npcName] || 0);
      const newVal = current + amount;
      progress.friendshipPoints[npcName] = newVal;
      await this.updateProgress(progress);
      return newVal;
    }

    const response = await fetch('/api/user/progress/increment-friendship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ npcName, amount })
    });
    if (response.status === 401) {
      throw new Error('STALE_SESSION');
    }
    if (!response.ok) {
      throw new Error('Failed to increment friendship');
    }
    const data = await response.json();
    this.notify();
    return Number(data.friendshipPoints[npcName] || 0);
  }
}


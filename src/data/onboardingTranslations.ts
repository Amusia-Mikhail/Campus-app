/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OnboardingTranslationText {
  title: string;
  desc: string;
}

export type SupportedLanguage = 'en' | 'ru' | 'de' | 'es' | 'zh' | 'ko' | 'ja' | 'it';

export const ONBOARDING_TRANSLATIONS: Record<string, Record<SupportedLanguage, OnboardingTranslationText>> = {
  // Step 1: Welcome / Navigation
  welcome_nav: {
    en: {
      title: 'Campus Navigation',
      desc: 'Use the bottom bar to navigate between Home, Story, Map, Progress, and Settings.'
    },
    ru: {
      title: 'Навигация по кампусу',
      desc: 'Используйте нижнюю панель для переключения между Главной, Историей, Картой, Прогрессом и Настройками.'
    },
    de: {
      title: 'Campus-Navigation',
      desc: 'Verwenden Sie die untere Leiste, um zwischen Startseite, Story, Karte, Fortschritt und Einstellungen zu wechseln.'
    },
    es: {
      title: 'Navegación del Campus',
      desc: 'Usa la barra inferior para navegar entre Inicio, Historia, Mapa, Progreso y Configuración.'
    },
    zh: {
      title: '校园导航',
      desc: '使用底部导航栏在首页、故事、地图、进度和设置之间进行切换。'
    },
    ko: {
      title: '캠퍼스 탐색',
      desc: '하단 탐색 바를 사용하여 홈, 스토리, 지도, 진도 및 설정 간을 이동하세요.'
    },
    ja: {
      title: 'キャンパスナビゲーション',
      desc: '下部バーを使用して、ホーム、ストーリー、マップ、進捗、設定を切り替えます。'
    },
    it: {
      title: 'Navigazione del Campus',
      desc: 'Usa la barra inferiore per navigare tra Home, Storia, Mappa, Progressi e Impostazioni.'
    }
  },

  // Step 2: Continue Story / Focus Area
  continue_story: {
    en: {
      title: 'Continue Story',
      desc: 'Tap here to jump directly into your current active story chapter.'
    },
    ru: {
      title: 'Продолжить историю',
      desc: 'Нажмите здесь, чтобы перейти непосредственно к текущей главе истории.'
    },
    de: {
      title: 'Story fortsetzen',
      desc: 'Tippen Sie hier, um direkt zum aktuellen aktiven Kapitel zu gelangen.'
    },
    es: {
      title: 'Continuar Historia',
      desc: 'Toca aquí para ir directamente a tu capítulo activo actual.'
    },
    zh: {
      title: '继续故事',
      desc: '点击此处直接进入您当前激活的故事章节。'
    },
    ko: {
      title: '스토리 이어하기',
      desc: '여기를 터치하여 현재 진행 중인 스토리 장으로 바로 이동하세요.'
    },
    ja: {
      title: 'ストーリーを続ける',
      desc: 'ここをタップして、現在アクティブなストーリーの章に直接移動します。'
    },
    it: {
      title: 'Continua la Storia',
      desc: 'Tocca qui per passare direttamente al tuo capitolo attivo.'
    }
  },

  // Step 3: Skill Breakdown
  skill_breakdown: {
    en: {
      title: 'Skill Breakdown',
      desc: 'Track your progress across Listening, Speaking, Writing, and Reading skills.'
    },
    ru: {
      title: 'Детализация навыков',
      desc: 'Отслеживайте свой прогресс в Аудировании, Говорении, Письме и Чтении.'
    },
    de: {
      title: 'Fähigkeiten-Übersicht',
      desc: 'Verfolgen Sie Ihren Fortschritt in den Bereichen Hörverstehen, Sprechen, Schreiben und Lesen.'
    },
    es: {
      title: 'Desglose de Habilidades',
      desc: 'Sigue tu progreso en Escuchar, Hablar, Escribir y Leer.'
    },
    zh: {
      title: '技能拆解',
      desc: '在听力、口语、写作和阅读技能方面跟踪您的进步。'
    },
    ko: {
      title: '영역별 실력 분석',
      desc: '듣기, 말하기, 쓰기, 읽기 능력의 진도를 한눈에 확인하세요.'
    },
    ja: {
      title: 'スキル分析',
      desc: 'リスニング、スピーキング、ライティング、リーディングの進捗を追跡します。'
    },
    it: {
      title: 'Analisi delle Abilità',
      desc: 'Monitora i tuoi progressi in Ascolto, Parlato, Scrittura e Lettura.'
    }
  },

  // Step 4: Campus Map
  campus_map: {
    en: {
      title: 'Campus Map',
      desc: 'Locations unlock as you complete chapters, turning from grayscale to full color.'
    },
    ru: {
      title: 'Карта кампуса',
      desc: 'Локации разблокируются по мере прохождения глав, меняя цвет с черно-белого на цветной.'
    },
    de: {
      title: 'Campus-Karte',
      desc: 'Orte werden mit dem Abschluss von Kapiteln freigeschaltet und färben sich bunt.'
    },
    es: {
      title: 'Mapa del Campus',
      desc: 'Las ubicaciones se desbloquean al completar capítulos, pasando de escala de grises a color.'
    },
    zh: {
      title: '校园地图',
      desc: '随着您完成章节，各个地点将逐步解锁，从灰度变为绚丽彩色。'
    },
    ko: {
      title: '캠퍼스 지도',
      desc: '챕터를 완료함에 따라 장소가 해금되며 흑백에서 선명한 컬러로 변경됩니다.'
    },
    ja: {
      title: 'キャンパスの地図',
      desc: '章をクリアすると場所が解放され、モノクロからフルカラーへと変化します。'
    },
    it: {
      title: 'Mappa del Campus',
      desc: 'I luoghi si sbloccano completando i capitoli, passando da bianco e nero a colori.'
    }
  },

  // Step 5: Biscuit Album / Dorm Room Cat
  biscuit_album: {
    en: {
      title: "Biscuit's Album",
      desc: 'Tap Biscuit the campus cat to view collectible poses unlocked through milestones.'
    },
    ru: {
      title: 'Альбом Бисквита',
      desc: 'Нажмите на кота Бисквита, чтобы посмотреть коллекционные позы, открытые за достижения.'
    },
    de: {
      title: 'Biscuits Album',
      desc: 'Tippen Sie auf Biscuit, die Campus-Katze, um freigeschaltete Posen anzuzeigen.'
    },
    es: {
      title: 'Álbum de Biscuit',
      desc: 'Toca a Biscuit, el gato del campus, para ver las poses coleccionables desbloqueadas.'
    },
    zh: {
      title: '饼干小猫相册',
      desc: '点击校园猫咪Biscuit，查看通过达成里程碑解锁的系列猫咪姿势。'
    },
    ko: {
      title: '비스킷의 앨범',
      desc: '캠퍼스 고양이 비스킷을 터치하여 달성한 목표에 따라 해금된 포즈를 감상하세요.'
    },
    ja: {
      title: 'ビスケットのアルバム',
      desc: 'キャンパスキャットのビスケットをタップして、解放されたポーズを閲覧できます。'
    },
    it: {
      title: "L'Album di Biscuit",
      desc: 'Tocca il gatto del campus Biscuit per vedere le pose collezionabili sbloccate.'
    }
  },

  // Step 6: Exam Score Predictor
  exam_predictor: {
    en: {
      title: 'Exam Score Predictor',
      desc: 'View a motivational TOEFL or IELTS score range estimate based on your overall progress.'
    },
    ru: {
      title: 'Прогноз баллов за экзамен',
      desc: 'Оцените примерный диапазон баллов TOEFL или IELTS на основе вашего общего прогресса.'
    },
    de: {
      title: 'Prüfungsschätzer',
      desc: 'Sehen Sie eine motivierende Schätzung Ihrer TOEFL- oder IELTS-Punktzahl.'
    },
    es: {
      title: 'Predictor de Examen',
      desc: 'Consulta una estimación del rango de puntuación de TOEFL o IELTS según tu progreso.'
    },
    zh: {
      title: '考试成绩预测',
      desc: '基于您的总体学业进度，查看 TOEFL 或 IELTS 的预测分数区间。'
    },
    ko: {
      title: '시험 점수 예측기',
      desc: '전체 학업 진행 상황을 기반으로 예상 TOEFL 또는 IELTS 점수 범위를 확인하세요.'
    },
    ja: {
      title: '試験スコア予測',
      desc: '全体の進捗状況に基づいて、TOEFLまたはIELTSの予測スコア範囲を確認します。'
    },
    it: {
      title: 'Predittore di Punteggio',
      desc: 'Visualizza una stima del punteggio TOEFL o IELTS basata sui tuoi progressi.'
    }
  },

  // Step 7: Semester Report
  semester_report: {
    en: {
      title: 'Semester Report',
      desc: 'Generate and download a shareable summary card of your academic achievements.'
    },
    ru: {
      title: 'Отчет за семестр',
      desc: 'Создайте и скачайте карточку ваших академических достижений.'
    },
    de: {
      title: 'Semesterbericht',
      desc: 'Erstellen und herunterladen Sie eine Zusammenfassung Ihrer akademischen Leistungen.'
    },
    es: {
      title: 'Informe del Semestre',
      desc: 'Genera y descarga una tarjeta con el resumen de tus logros académicos.'
    },
    zh: {
      title: '学期学术报告',
      desc: '生成并下载一张展现您学业成就的精美总结卡片。'
    },
    ko: {
      title: '학기 성적 리포트',
      desc: '학업 성과 요약 카드를 생성하고 다운로드하여 공유해보세요.'
    },
    ja: {
      title: '学期レポート',
      desc: '学業実績の要約カードを生成してダウンロードできます。'
    },
    it: {
      title: 'Rapporto Semestrale',
      desc: 'Genera e scarica una scheda riassuntiva dei tuoi risultati accademici.'
    }
  },

  // Step 8: Achievements & Badges
  achievements_badges: {
    en: {
      title: 'Achievements & Badges',
      desc: 'Earn collectible campus badges as you hit learning milestones and complete chapters.'
    },
    ru: {
      title: 'Достижения и значки',
      desc: 'Зарабатывайте значки кампуса по мере достижения учебных целей и прохождения глав.'
    },
    de: {
      title: 'Erfolge & Abzeichen',
      desc: 'Sammeln Sie Campus-Abzeichen für das Erreichen von Meilensteinen und Kapiteln.'
    },
    es: {
      title: 'Logros e Insignias',
      desc: 'Gana insignias coleccionables a medida que alcanzas metas y completas capítulos.'
    },
    zh: {
      title: '成就与徽章',
      desc: '当您达成学习里程碑并通关章节时，收集独具特色的校园徽章。'
    },
    ko: {
      title: '업적 및 배지',
      desc: '학습 목표를 달성하고 챕터를 완료하여 수집용 배지를 획득하세요.'
    },
    ja: {
      title: '実績とバッジ',
      desc: '学習の節目や章のクリアに応じて、コレクション用バッジを獲得できます。'
    },
    it: {
      title: 'Obiettivi e Distintivi',
      desc: 'Ottieni distintivi collezionabili completando traguardi e capitoli.'
    }
  },

  // Step 9: App Settings
  app_settings: {
    en: {
      title: 'App Settings',
      desc: 'Customize interface language, dark theme, audio effects, and student profile.'
    },
    ru: {
      title: 'Настройки приложения',
      desc: 'Настройте язык интерфейса, тёмную тему, звуки и профиль студента.'
    },
    de: {
      title: 'App-Einstellungen',
      desc: 'Passen Sie Sprache, dunkles Design, Audioeffekte und Ihr Profil an.'
    },
    es: {
      title: 'Ajustes de la App',
      desc: 'Personaliza el idioma de la interfaz, el tema oscuro, efectos de audio y perfil.'
    },
    zh: {
      title: '应用设置',
      desc: '自定义界面语言、深色主题、音效以及您的学生个人资料。'
    },
    ko: {
      title: '앱 설정',
      desc: '인터페이스 언어, 다크 테마, 사운드 효과 및 학생 프로필을 설정하세요.'
    },
    ja: {
      title: 'アプリ設定',
      desc: '言語、ダークテーマ、効果音、学生プロフィールをカスタマイズします。'
    },
    it: {
      title: 'Impostazioni App',
      desc: 'Personalizza la lingua, il tema scuro, gli effetti audio e il profilo studente.'
    }
  },

  // Step 10: Official Academic Transcript
  official_transcript: {
    en: {
      title: 'Official Academic Transcript',
      desc: 'Track your core academic skill evaluations, grades, and export an official PDF transcript anytime.'
    },
    ru: {
      title: 'Официальная академическая выписка',
      desc: 'Отслеживайте оценки по академическим навыкам и экспортируйте официальную выписку в PDF.'
    },
    de: {
      title: 'Offizielles Leistungsverzeichnis',
      desc: 'Verfolgen Sie Ihre akademischen Bewertungen und exportieren Sie ein PDF-Dokument.'
    },
    es: {
      title: 'Certificado Académico Oficial',
      desc: 'Sigue las evaluaciones de tus habilidades académicas y exporta un certificado en PDF.'
    },
    zh: {
      title: '官方学术成绩单',
      desc: '跟踪核心学术技能评估和成绩，随时导出官方 PDF 成绩单。'
    },
    ko: {
      title: '공식 학업 성적표',
      desc: '핵심 학업 역량 평가와 성적을 확인하고 언제든 공식 PDF 성적표로 내보내세요.'
    },
    ja: {
      title: '公式学術成績証明書',
      desc: '主要な学術スキルの評価と成績を追跡し、いつでも公式PDFをエクスポートできます。'
    },
    it: {
      title: 'Certificato Accademico Ufficiale',
      desc: 'Monitora le valutazioni delle tue competenze e esporta un certificato PDF ufficiale.'
    }
  },

  // Step 11: Jordan Friendship Stories
  jordan_stories_counter: {
    en: {
      title: 'Jordan Friendship Stories',
      desc: 'Earn Friendship Points through lessons to unlock exclusive campus dialogues with Jordan marked on the map.'
    },
    ru: {
      title: 'Истории дружбы с Джорданом',
      desc: 'Зарабатывайте очки дружбы на уроках, чтобы открыть эксклюзивные диалоги с Джорданом на карте.'
    },
    de: {
      title: 'Jordan Freundschaftsgeschichten',
      desc: 'Sammeln Sie Freundschaftspunkte, um exklusive Campus-Dialoge mit Jordan freizuschalten.'
    },
    es: {
      title: 'Historias de Amistad con Jordan',
      desc: 'Gana puntos de amistad para desbloquear diálogos exclusivos con Jordan en el mapa.'
    },
    zh: {
      title: 'Jordan 友谊的故事',
      desc: '通过完成课程赚取友谊积分，解开地图上标注的 Jordan 独家校园对话。'
    },
    ko: {
      title: '조던 우정 스토리',
      desc: '수업을 통해 우정 포인트를 쌓고 지도에 표시된 조던과의 특별한 캠퍼스 대화를 해금하세요.'
    },
    ja: {
      title: 'ジョーダン友情ストーリー',
      desc: 'レッスンで友情ポイントを溜めて、マップ上のジョーダンとの特別対話を解放しましょう。'
    },
    it: {
      title: 'Storie di Amicizia con Jordan',
      desc: 'Guadagna Punti Amicizia nelle lezioni per sbloccare dialoghi esclusivi con Jordan sulla mappa.'
    }
  },

  // Step 12: Dorm Room & Decor
  dorm_room_decor: {
    en: {
      title: 'Dorm Room & Decor',
      desc: 'Personalize your study space! Master campus locations to unlock unique decorative items and equip them in your room.'
    },
    ru: {
      title: 'Комната в общежитии и декор',
      desc: 'Персонализируйте ваше пространство! Осваивайте локации, чтобы открывать предметы декора и украшать комнату.'
    },
    de: {
      title: 'Wohnheimzimmer & Deko',
      desc: 'Gestalten Sie Ihren Lernraum! Meistern Sie Campus-Orte, um Deko-Objekte freizuschalten.'
    },
    es: {
      title: 'Habitación y Decoración',
      desc: '¡Personaliza tu espacio de estudio! Domina las ubicaciones del campus para desbloquear objetos decorativos.'
    },
    zh: {
      title: '宿舍房间与装饰',
      desc: '个性化打造您的学习空间！探索校园地点以解锁独特色彩的装饰物品并摆放在房间中。'
    },
    ko: {
      title: '기숙사 방 & 인테리어',
      desc: '나만의 공부 공간을 꾸며보세요! 캠퍼스 장소를 다 모아 특별한 데코 아이템을 해금하고 방을 장식하세요.'
    },
    ja: {
      title: '寮の部屋とインテリア',
      desc: '学習スペースを自分らしくカスタマイズ！キャンパスを探索してインテリアを解放し部屋を飾りましょう。'
    },
    it: {
      title: 'Camera del Convitto e Arredo',
      desc: 'Personalizza il tuo spazio di studio! Domina i luoghi del campus per sbloccare oggetti decorativi.'
    }
  },

  // Step 13: Morning Coffee Conversations
  coffee_dialogue: {
    en: {
      title: 'Morning Coffee Conversations',
      desc: 'Maintain your daily coffee streak to enjoy cozy morning chats with Jordan and earn extra Friendship Points.'
    },
    ru: {
      title: 'Утренний кофе и разговоры',
      desc: 'Поддерживайте ежедневную серию кофе, чтобы наслаждаться уютными утренними беседами с Джорданом.'
    },
    de: {
      title: 'Morgenkaffee-Gespräche',
      desc: 'Halten Sie Ihre Kaffee-Serie aufrecht, um gemütliche Plaudereien mit Jordan zu genießen.'
    },
    es: {
      title: 'Conversaciones con Café',
      desc: 'Mantén tu racha diaria de café para disfrutar de acogedoras charlas matutinas con Jordan.'
    },
    zh: {
      title: '晨间咖啡对话',
      desc: '保持每日咖啡连胜，与 Jordan 享受温馨的晨间对话并赚取额外友谊积分。'
    },
    ko: {
      title: '아침 커피 대화',
      desc: '매일 커피 연속 기록을 유지하여 조던과 따뜻한 아침 대화를 나누고 추가 우정 포인트를 획득하세요.'
    },
    ja: {
      title: 'モーニングコーヒー会話',
      desc: '毎日のストリークを維持して、ジョーダンとの温かい朝の会話と友情ポイントを楽しみましょう。'
    },
    it: {
      title: 'Conversazioni al Caffè Mattutino',
      desc: 'Mantieni la tua serie quotidiana di caffè per goderti accoglienti chiacchierate con Jordan.'
    }
  },

  // Step 14: Academic Vocabulary Notebook
  academic_vocabulary_notebook: {
    en: {
      title: 'Academic Vocabulary Notebook',
      desc: 'Save complex Academic Word List (AWL) terms during lessons and review them anytime using interactive flashcards.'
    },
    ru: {
      title: 'Тетрадь академической лексики',
      desc: 'Сохраняйте сложные слова из AWL во время уроков и повторяйте их с помощью карточек.'
    },
    de: {
      title: 'Akademisches Vokabelheft',
      desc: 'Speichern Sie komplexe Begriffe der Academic Word List (AWL) und wiederholen Sie diese mit Karteikarten.'
    },
    es: {
      title: 'Cuaderno de Vocabulario Académico',
      desc: 'Guarda términos complejos de la AWL durante las lecciones y repásalos con tarjetas de estudio.'
    },
    zh: {
      title: '学术词汇笔记本',
      desc: '在课程中保存学术词汇表 (AWL) 中的高级词汇，并使用互动闪卡随时复习。'
    },
    ko: {
      title: '학술 어휘 단어장',
      desc: '수업 중 학술 어휘 목록(AWL) 단어를 저장하고 대화형 플래시카드로 언제든 복습하세요.'
    },
    ja: {
      title: '学術ボキャブラリーノート',
      desc: 'レッスン中に学術単語リスト（AWL）の語彙を保存し、インタラクティブな単語カードで復習しましょう。'
    },
    it: {
      title: 'Quaderno del Vocabolario Accademico',
      desc: 'Salva i termini complessi dell\'Academic Word List (AWL) e ripassali con le schede didattiche.'
    }
  }
};

// Aliases for alternate key names
ONBOARDING_TRANSLATIONS.welcome = ONBOARDING_TRANSLATIONS.welcome_nav;
ONBOARDING_TRANSLATIONS.focus_area = ONBOARDING_TRANSLATIONS.continue_story;
ONBOARDING_TRANSLATIONS.dorm_room = ONBOARDING_TRANSLATIONS.biscuit_album;
ONBOARDING_TRANSLATIONS.coffee_widget = ONBOARDING_TRANSLATIONS.coffee_dialogue;
ONBOARDING_TRANSLATIONS.vocab_badge = ONBOARDING_TRANSLATIONS.achievements_badges;
ONBOARDING_TRANSLATIONS.academic_profile = ONBOARDING_TRANSLATIONS.exam_predictor;
ONBOARDING_TRANSLATIONS.settings = ONBOARDING_TRANSLATIONS.app_settings;

export function getOnboardingTranslation(
  stepKey: string,
  lang: string = 'en'
): OnboardingTranslationText {
  const normLang = (lang || 'en').toLowerCase().trim() as SupportedLanguage;
  const validLang: SupportedLanguage = ['en', 'ru', 'de', 'es', 'zh', 'ko', 'ja', 'it'].includes(normLang)
    ? normLang
    : 'en';

  const entry = ONBOARDING_TRANSLATIONS[stepKey];
  if (entry && entry[validLang]) {
    return entry[validLang];
  }
  if (entry && entry.en) {
    return entry.en;
  }

  // Generic fallback if key is unknown
  return {
    title: 'Campus Tour',
    desc: 'Explore key campus features and master academic English.'
  };
}

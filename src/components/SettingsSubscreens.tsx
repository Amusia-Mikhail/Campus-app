/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  User,
  Mail,
  Lock,
  X,
  ShieldAlert,
  Key,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  GraduationCap,
  Landmark,
  MapPin,
  Bell,
  ArrowLeft,
  HelpCircle,
  Info,
  RefreshCw,
  Award,
  ChevronRight,
  ShieldCheck,
  Eye,
  Server,
  Crown,
  Zap,
  ExternalLink,
  Star,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { SkillType } from '../data/models';
import { BADGE_DEFINITIONS, getBadgeTitle } from '../utils/badgeHelper';
import { BadgeMedallion } from './BadgeMedallion';
import { PremiumProfileFrame } from './PremiumProfileFrame';
import { getDynamicChapters } from '../data/repositories';
import { translations } from '../utils/translations';

import {
  openPlayStoreSubscriptions,
  PRODUCT_ID_MONTHLY,
  PRODUCT_ID_ANNUAL,
  PRODUCT_ID_REMOVE_ADS
} from '../utils/digitalGoodsBilling';

interface SubscreenProps {
  onBack: () => void;
}

const subTranslations: Record<string, {
  backBtn: string;
  studentIdentity: string;
  studentProfile: string;
  studentProfileDesc: string;
  successUpdated: string;
  studentRegistry: string;
  editProfile: string;
  charName: string;
  academicMajor: string;
  residenceHall: string;
  emailLabel: string;
  lockedLabel: string;
  editAcademicCard: string;
  nameRequired: string;
  cancelBtn: string;
  updateBtn: string;
  savingBtn: string;
  passwordHeader: string;
  passRequired: string;
  passNoMatch: string;
  passMinLength: string;
  passSuccess: string;
  currPassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePasswordBtn: string;
  updatingPasswordBtn: string;
  dangerZoneHeader: string;
  deleteTitle: string;
  deleteDesc: string;
  deleteBtn: string;
  deleteConfirmText: string;
  deleteConfirmPlaceholder: string;
  permanentlyDeleteBtn: string;
  deletingBtn: string;
  preferencesHeader: string;
  dailyReminderTitle: string;
  dailyReminderDesc: string;
  browserAlert: string;
  permissionBlockedAlert: string;
  deviceLevelHeader: string;
  deviceLevelDesc: string;
  faqHeader: string;
  faqSubtitle: string;
  faqHelpful: string;
  feedbackSuccess: string;
  feedbackDesc: string;
  checkingUpdates: string;
  checkUpdatesBtn: string;
  updatedMsg: string;
  aboutHeader: string;
  aboutSubtitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  learningPhilosophy: string;
  learningPhilosophyDesc: string;
  academicBuild: string;
  earnedAchievements?: string;
  viewAllAchievements?: string;
  noAchievementsYet?: string;
  activeStudentTag?: string;
  medalsEarnedCount?: string;
  targetExam?: string;
}> = {
  EN: {
    backBtn: "Back to Settings",
    studentIdentity: "Student Identity",
    studentProfile: "Student Profile",
    studentProfileDesc: "View and update your academic information and security settings.",
    successUpdated: "Academic profile successfully updated!",
    studentRegistry: "Student Registry",
    editProfile: "Edit Profile",
    charName: "Character Name",
    academicMajor: "Academic Major",
    residenceHall: "Residence Hall",
    emailLabel: "Account Email (Non-Editable)",
    lockedLabel: "Locked",
    editAcademicCard: "Edit Academic Card",
    nameRequired: "Please enter your name.",
    cancelBtn: "Cancel",
    updateBtn: "Update Profile",
    savingBtn: "Saving...",
    passwordHeader: "Security Settings (Password)",
    passRequired: "All fields are required.",
    passNoMatch: "New passwords do not match.",
    passMinLength: "New password must be at least 6 characters.",
    passSuccess: "Password successfully updated!",
    currPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePasswordBtn: "Change Password",
    updatingPasswordBtn: "Updating Password...",
    dangerZoneHeader: "Academic Danger Zone",
    deleteTitle: "Delete Student Registry Record",
    deleteDesc: "Permanently delete your profile, skill gains, completed assignments, and Auth account. This cannot be undone.",
    deleteBtn: "Delete Academic Account",
    deleteConfirmText: "To confirm deletion, type your character name \"{name}\" or \"DELETE\":",
    deleteConfirmPlaceholder: "Type {name} or DELETE",
    permanentlyDeleteBtn: "Permanently Delete",
    deletingBtn: "Deleting...",
    preferencesHeader: "Preferences",
    dailyReminderTitle: "Daily Story Reminder",
    dailyReminderDesc: "Receive a browser reminder to check in and review your active English chapters daily.",
    browserAlert: "This browser does not support desktop notifications.",
    permissionBlockedAlert: "Browser Notification permissions are blocked. Daily reminders cannot be fired on this device. Please update your browser site settings for \"Campus\" to re-enable.",
    deviceLevelHeader: "Device Level Setting",
    deviceLevelDesc: "This choice is stored in your local browser cache keyed directly to your student character ({name}). It is not sent to the cloud database.",
    faqHeader: "Academic Helpdesk",
    faqSubtitle: "Find answers to frequently asked questions about the Campus English syllabus.",
    faqHelpful: "Was this FAQ helpful to your studies?",
    feedbackSuccess: "Response Logged!",
    feedbackDesc: "Thank you for your feedback! It helps our academic office improve the campus experience.",
    checkingUpdates: "Checking academic registry...",
    checkUpdatesBtn: "Check for Updates",
    updatedMsg: "All academic modules are up to date!",
    aboutHeader: "About Campus",
    aboutSubtitle: "Learn about the design philosophy and current build of the Campus program.",
    aboutDesc1: "Campus is an immersive role-playing language simulator designed to help students master academic and social English. Step into the shoes of a first-semester international student at an American college.",
    aboutDesc2: "Experience critical milestones including orientation chats, classroom lectures, active discussion forums, and homework essays. Level up core skills like Listening, Speaking, Reading, and Writing to complete your semester.",
    learningPhilosophy: "Learning Philosophy",
    learningPhilosophyDesc: "By embedding English practice inside rich story decisions, Campus leverages contextual acquisition. Active chatbot dialogue, reading materials, and immediate AI score feedback mimic high-stakes real-world college pressures.",
    academicBuild: "Academic Build",
    earnedAchievements: "Earned Achievements",
    viewAllAchievements: "View All Achievements",
    noAchievementsYet: "No achievement medals earned yet. Complete story chapters on campus to unlock your first badge!",
    activeStudentTag: "Active Student • Semester 1",
    medalsEarnedCount: "Medals Earned",
    targetExam: "Target Exam",
  },
  RU: {
    backBtn: "Назад в настройки",
    studentIdentity: "Личность студента",
    studentProfile: "Профиль студента",
    studentProfileDesc: "Просматривайте и обновляйте свою академическую информацию и настройки безопасности.",
    successUpdated: "Профиль успешно обновлен!",
    studentRegistry: "Реестр студентов",
    editProfile: "Редактировать профиль",
    charName: "Имя персонажа",
    academicMajor: "Специальность",
    residenceHall: "Общежитие",
    emailLabel: "Email аккаунта (не редактируется)",
    lockedLabel: "Заблокировано",
    editAcademicCard: "Редактировать профиль",
    nameRequired: "Пожалуйста, введите имя.",
    cancelBtn: "Отмена",
    updateBtn: "Обновить профиль",
    savingBtn: "Сохранение...",
    passwordHeader: "Настройки безопасности (Пароль)",
    passRequired: "Все поля обязательны для заполнения.",
    passNoMatch: "Новые пароли не совпадают.",
    passMinLength: "Новый пароль должен содержать не менее 6 символов.",
    passSuccess: "Пароль успешно обновлен!",
    currPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    updatePasswordBtn: "Изменить пароль",
    updatingPasswordBtn: "Обновление пароля...",
    dangerZoneHeader: "Опасная зона",
    deleteTitle: "Удалить академический профиль",
    deleteDesc: "Навсегда удалить ваш профиль, полученные навыки, выполненные задания и учетную запись. Это действие нельзя отменить.",
    deleteBtn: "Удалить аккаунт",
    deleteConfirmText: "Для подтверждения удаления введите имя вашего персонажа \"{name}\" или \"DELETE\":",
    deleteConfirmPlaceholder: "Введите {name} или DELETE",
    permanentlyDeleteBtn: "Удалить навсегда",
    deletingBtn: "Удаление...",
    preferencesHeader: "Настройки",
    dailyReminderTitle: "Ежедневное напоминание",
    dailyReminderDesc: "Получайте ежедневное напоминание в браузере о необходимости прочитать активные главы английского.",
    browserAlert: "Этот браузер не поддерживает уведомления на рабочем столе.",
    permissionBlockedAlert: "Разрешения на уведомления заблокированы в браузере. Ежедневные напоминания не могут быть отправлены на этом устройстве. Пожалуйста, включите уведомления в настройках сайта для \"Campus\".",
    deviceLevelHeader: "Локальная настройка",
    deviceLevelDesc: "Этот выбор сохраняется в локальном кэше вашего браузера непосредственно для вашего персонажа ({name}). Он не отправляется в облачную базу данных.",
    faqHeader: "Служба поддержки",
    faqSubtitle: "Найдите ответы на часто задаваемые вопросы об учебной программе Campus English.",
    faqHelpful: "Помог ли вам этот раздел?",
    feedbackSuccess: "Отзыв записан!",
    feedbackDesc: "Спасибо за ваш отзыв! Он помогает нашему академическому офису улучшить работу кампуса.",
    checkingUpdates: "Проверка реестра...",
    checkUpdatesBtn: "Проверить обновления",
    updatedMsg: "Все академические модули обновлены!",
    aboutHeader: "О программе",
    aboutSubtitle: "Узнайте о философии дизайна и текущей версии программы Campus.",
    aboutDesc1: "Campus — это иммерсивный ролевой языковой симулятор, разработанный для того, чтобы помочь студентам освоить академический и разговорный английский язык. Почувствуйте себя первокурсником американского колледжа.",
    aboutDesc2: "Пройдите ключевые этапы, включая ознакомительные беседы, лекции, обсуждения на форумах и написание эссе. Повышайте уровень ключевых навыков (аудирование, говорение, чтение и письмо).",
    learningPhilosophy: "Философия обучения",
    learningPhilosophyDesc: "Встраивая практику английского языка в сюжетные решения, Campus использует контекстное обучение. Диалоги, чтение и мгновенная обратная связь от ИИ имитируют реальные академические условия.",
    academicBuild: "Академическая сборка",
    earnedAchievements: "Заработанные достижения",
    viewAllAchievements: "Смотреть все достижения",
    noAchievementsYet: "Медали за достижения еще не получены. Проходите сюжетные главы, чтобы открыть первую награду!",
    activeStudentTag: "Активный студент • 1 семестр",
    medalsEarnedCount: "Получено медалей",
  },
  ES: {
    backBtn: "Volver a Configuración",
    studentIdentity: "Identidad del Estudiante",
    studentProfile: "Perfil del Estudiante",
    studentProfileDesc: "Ver y actualizar su información académica y configuración de seguridad.",
    successUpdated: "¡Perfil académico actualizado con éxito!",
    studentRegistry: "Registro de Estudiantes",
    editProfile: "Editar Perfil",
    charName: "Nombre de Personaje",
    academicMajor: "Especialidad",
    residenceHall: "Residencia",
    emailLabel: "Correo Electrónico (No Editable)",
    lockedLabel: "Bloqueado",
    editAcademicCard: "Editar Ficha Académica",
    nameRequired: "Por favor, ingrese su nombre.",
    cancelBtn: "Cancelar",
    updateBtn: "Actualizar Perfil",
    savingBtn: "Guardando...",
    passwordHeader: "Configuración de Seguridad (Contraseña)",
    passRequired: "Todos los campos son obligatorios.",
    passNoMatch: "Las nuevas contraseñas no coinciden.",
    passMinLength: "La nueva contraseña debe tener al menos 6 caracteres.",
    passSuccess: "¡Contraseña actualizada con éxito!",
    currPassword: "Contraseña Actual",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Nueva Contraseña",
    updatePasswordBtn: "Cambiar Contraseña",
    updatingPasswordBtn: "Actualizando Contraseña...",
    dangerZoneHeader: "Zona de Peligro Académico",
    deleteTitle: "Eliminar Registro Académico",
    deleteDesc: "Eliminar permanentemente su perfil, habilidades obtenidas, tareas completadas y cuenta. Esto no se puede deshacer.",
    deleteBtn: "Eliminar Cuenta Académica",
    deleteConfirmText: "Para confirmar la eliminación, escriba el nombre de su personaje \"{name}\" o \"DELETE\":",
    deleteConfirmPlaceholder: "Escriba {name} o DELETE",
    permanentlyDeleteBtn: "Eliminar Permanentemente",
    deletingBtn: "Eliminando...",
    preferencesHeader: "Preferencias",
    dailyReminderTitle: "Recordatorio Diario",
    dailyReminderDesc: "Reciba un recordatorio diario en su navegador para revisar sus capítulos de inglés activos.",
    browserAlert: "Este navegador no admite notificaciones de escritorio.",
    permissionBlockedAlert: "Los permisos de notificación del navegador están bloqueados. No se pueden activar los recordatorios diarios en este dispositivo. Actualice la configuración del sitio para \"Campus\" para volver a habilitarlos.",
    deviceLevelHeader: "Ajuste del Dispositivo",
    deviceLevelDesc: "Esta opción se almacena en la caché de su navegador local directamente para su personaje ({name}). No se envía a la base de datos.",
    faqHeader: "Servicio de Ayuda",
    faqSubtitle: "Encuentre respuestas a preguntas frecuentes sobre el programa de inglés de Campus.",
    faqHelpful: "¿Le resultó útil esta pregunta frecuente?",
    feedbackSuccess: "¡Respuesta Registrada!",
    feedbackDesc: "¡Gracias por sus comentarios! Ayudan a nuestra oficina académica a mejorar la experiencia.",
    checkingUpdates: "Comprobando registro...",
    checkUpdatesBtn: "Buscar Actualizaciones",
    updatedMsg: "¡Todos los módulos académicos están actualizados!",
    aboutHeader: "Acerca de Campus",
    aboutSubtitle: "Conozca la filosofía de diseño y la versión actual del programa Campus.",
    aboutDesc1: "Campus es un simulador de idiomas inmersivo diseñado para ayudar a los estudiantes a dominar el inglés académico y social. Póngase en el lugar de un estudiante internacional en su primer semestre.",
    aboutDesc2: "Experimente hitos críticos que incluyen charlas de orientación, conferencias en el aula, foros de discusión activos y ensayos de tareas. Suba de nivel en comprensión auditiva, expresión oral, lectura y escritura.",
    learningPhilosophy: "Filosofía de Aprendizaje",
    learningPhilosophyDesc: "Al integrar la práctica del inglés dentro de decisiones narrativas, Campus aprovecha la adquisición contextual. Diálogos, lecturas y comentarios de IA simulan las presiones universitarias reales.",
    academicBuild: "Versión Académica",
    earnedAchievements: "Logros Obtenidos",
    viewAllAchievements: "Ver Todos los Logros",
    noAchievementsYet: "Aún no ha obtenido medallas de logro. ¡Complete capítulos de la historia para desbloquear su primera insignia!",
    activeStudentTag: "Estudiante Activo • Semestre 1",
    medalsEarnedCount: "Medallas Obtenidas",
  },
  DE: {
    backBtn: "Zurück zu Einstellungen",
    studentIdentity: "Studentische Identität",
    studentProfile: "Studentenprofil",
    studentProfileDesc: "Ansehen und Aktualisieren Ihrer akademischen Informationen und Sicherheitseinstellungen.",
    successUpdated: "Akademisches Profil erfolgreich aktualisiert!",
    studentRegistry: "Studentenregister",
    editProfile: "Profil bearbeiten",
    charName: "Name des Charakters",
    academicMajor: "Hauptfach",
    residenceHall: "Wohnheim",
    emailLabel: "Konto-E-Mail (Nicht bearbeitbar)",
    lockedLabel: "Gesperrt",
    editAcademicCard: "Akademische Karte bearbeiten",
    nameRequired: "Bitte geben Sie Ihren Namen ein.",
    cancelBtn: "Abbrechen",
    updateBtn: "Profil aktualisieren",
    savingBtn: "Wird gespeichert...",
    passwordHeader: "Sicherheitseinstellungen (Passwort)",
    passRequired: "Alle Felder sind Pflichtfelder.",
    passNoMatch: "Neue Passwörter stimmen nicht überein.",
    passMinLength: "Das neue Passwort muss mindestens 6 Zeichen lang sein.",
    passSuccess: "Passwort erfolgreich aktualisiert!",
    currPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Neues Passwort bestätigen",
    updatePasswordBtn: "Passwort ändern",
    updatingPasswordBtn: "Passwort wird aktualisiert...",
    dangerZoneHeader: "Gefahrenzone",
    deleteTitle: "Studentenregistereintrag löschen",
    deleteDesc: "Löschen Sie Ihr Profil, Ihre erworbenen Fähigkeiten, Ihre abgeschlossenen Aufgaben und Ihr Konto dauerhaft. Dies kann nicht rückgängig gemacht werden.",
    deleteBtn: "Akademisches Konto löschen",
    deleteConfirmText: "Um das Löschen zu bestätigen, geben Sie den Namen Ihres Charakters \"{name}\" oder \"DELETE\" ein:",
    deleteConfirmPlaceholder: "Geben Sie {name} oder DELETE ein",
    permanentlyDeleteBtn: "Dauerhaft löschen",
    deletingBtn: "Wird gelöscht...",
    preferencesHeader: "Präferenzen",
    dailyReminderTitle: "Tägliche Erinnerung",
    dailyReminderDesc: "Erhalten Sie täglich eine Browser-Erinnerung, um Ihre aktiven Englisch-Kapitel zu überprüfen.",
    browserAlert: "Dieser Browser unterstützt keine Desktop-Benachrichtigungen.",
    permissionBlockedAlert: "Browser-Benachrichtigungen sind blockiert. Tägliche Erinnerungen können auf diesem Gerät nicht gesendet werden. Bitte aktivieren Sie die Benachrichtigungen in Ihren Browsereinstellungen für \"Campus\" wieder.",
    deviceLevelHeader: "Geräteeinstellung",
    deviceLevelDesc: "Diese Wahl wird in Ihrem lokalen Browser-Cache direkt für Ihren Charakter ({name}) gespeichert. Sie wird nicht an die Cloud-Datenbank gesendet.",
    faqHeader: "Hilfezentrum",
    faqSubtitle: "Finden Sie Antworten auf häufig gestellte Fragen zum Campus-Englisch-Lehrplan.",
    faqHelpful: "War diese FAQ für Ihr Studium hilfreich?",
    feedbackSuccess: "Rückmeldung registriert!",
    feedbackDesc: "Vielen Dank für Ihr Feedback! Es hilft unserem akademischen Büro, das Campus-Erlebnis zu verbessern.",
    checkingUpdates: "Überprüfung des akademischen Registers...",
    checkUpdatesBtn: "Nach Updates suchen",
    updatedMsg: "Alle akademischen Module sind auf dem neuesten Stand!",
    aboutHeader: "Über Campus",
    aboutSubtitle: "Erfahren Sie mehr über die Designphilosophie und den aktuellen Stand des Campus-Programms.",
    aboutDesc1: "Campus ist ein immersiver Rollenspiel-Sprachsimulator, der entwickelt wurde, um Studenten beim Erlernen des akademischen und sozialen Englisch zu helfen. Schlüpfen Sie in die Rolle eines internationalen Studenten im ersten Semester.",
    aboutDesc2: "Erleben Sie kritische Meilensteine wie Orientierungsgespräche, Vorlesungen im Klassenzimmer, aktive Diskussionsforen und Hausaufgaben-Essays. Verbessern Sie Kernkompetenzen wie Hören, Sprechen, Lesen und Schreiben.",
    learningPhilosophy: "Philosophie des Lernens",
    learningPhilosophyDesc: "Durch die Einbettung der englischen Praxis in reichhaltige Story-Entscheidungen nutzt Campus den kontextuellen Erwerb. Aktive Chatbot-Dialoge, Lesematerialien und direktes KI-Score-Feedback ahmen den realen Druck am College nach.",
    academicBuild: "Akademische Version",
    earnedAchievements: "Errungene Erfolge",
    viewAllAchievements: "Alle Erfolge anzeigen",
    noAchievementsYet: "Noch keine Erfolgsmedaillen erworben. Schließe Kapitel ab, um deine erste Auszeichnung freizuschalten!",
    activeStudentTag: "Aktiver Student • Semester 1",
    medalsEarnedCount: "Medaillen errungen",
  },
  ZH: {
    backBtn: "返回设置",
    studentIdentity: "学生身份",
    studentProfile: "学生个人资料",
    studentProfileDesc: "查看和更新您的学术信息与安全设置。",
    successUpdated: "学术资料更新成功！",
    studentRegistry: "学生注册处",
    editProfile: "编辑资料",
    charName: "角色姓名",
    academicMajor: "学术专业",
    residenceHall: "学生宿舍",
    emailLabel: "账户邮箱 (不可编辑)",
    lockedLabel: "已锁定",
    editAcademicCard: "编辑学术卡片",
    nameRequired: "请输入您的名字。",
    cancelBtn: "取消",
    updateBtn: "更新资料",
    savingBtn: "正在保存...",
    passwordHeader: "安全设置 (密码)",
    passRequired: "所有字段均为必填项。",
    passNoMatch: "新密码不匹配。",
    passMinLength: "新密码必须至少为 6 个字符。",
    passSuccess: "密码更新成功！",
    currPassword: "当前密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    updatePasswordBtn: "修改密码",
    updatingPasswordBtn: "正在更新密码...",
    dangerZoneHeader: "学术危险区",
    deleteTitle: "删除学生注册记录",
    deleteDesc: "永久删除您的个人资料、获得的技能、完成的作业及验证账户。此操作无法撤销。",
    deleteBtn: "删除学术账户",
    deleteConfirmText: "为确认删除，请输入您的角色姓名 \"{name}\" 或 \"DELETE\":",
    deleteConfirmPlaceholder: "输入 {name} 或 DELETE",
    permanentlyDeleteBtn: "永久删除",
    deletingBtn: "正在删除...",
    preferencesHeader: "偏好设置",
    dailyReminderTitle: "每日学习提醒",
    dailyReminderDesc: "每日在浏览器中接收提醒，以及时阅读和复习您活跃的英语章节。",
    browserAlert: "此浏览器不支持桌面通知。",
    permissionBlockedAlert: "浏览器通知权限已被阻止。无法在此设备上触发每日提醒。请在浏览器设置中重新启用 \"Campus\" 的通知权限。",
    deviceLevelHeader: "设备级设置",
    deviceLevelDesc: "此选项保存在本地浏览器缓存中，直接关联到您的学生角色 ({name})。它不会发送到云端数据库。",
    faqHeader: "学术咨询台",
    faqSubtitle: "查找有关 Campus 英语教学大纲的常见问题解答。",
    faqHelpful: "此常见问题解答对您的学习有帮助吗？",
    feedbackSuccess: "反馈已记录！",
    feedbackDesc: "感谢您的反馈！这有助于我们的教务处改进校园体验。",
    checkingUpdates: "正在检查学术注册...",
    checkUpdatesBtn: "检查更新",
    updatedMsg: "所有学术模块均已是最新版本！",
    aboutHeader: "关于 Campus",
    aboutSubtitle: "了解 Campus 项目的设计理念和当前构建版本。",
    aboutDesc1: "Campus 是一款沉浸式角色扮演语言模拟器，旨在帮助学生掌握学术和社交英语。化身为美国大学的第一学期国际留学生。",
    aboutDesc2: "体验关键里程碑，包括新生入学指导、课堂听讲、活跃的论坛讨论和课后作业论文。提升您的听力、口语、阅读和写作核心技能。",
    learningPhilosophy: "教学理念",
    learningPhilosophyDesc: "通过将英语练习嵌入到丰富的故事情节决定中，Campus 利用情境习得。主动的聊天机器人对话、阅读材料和即时 AI 评分反馈模拟了真实世界的大学高压环境。",
    academicBuild: "学术版本",
    earnedAchievements: "获得的成就",
    viewAllAchievements: "查看全部成就",
    noAchievementsYet: "尚未获得成就勋章。完成校园故事章节以解锁您的第一枚徽章！",
    activeStudentTag: "在校学生 • 第一学期",
    medalsEarnedCount: "获得的勋章",
  },
  JA: {
    backBtn: "設定に戻る",
    studentIdentity: "学生の身元",
    studentProfile: "プロフィール",
    studentProfileDesc: "学術情報とセキュリティ設定의 확인 및 업데이트를 수행합니다.",
    successUpdated: "プロフィールの更新が完了しました！",
    studentRegistry: "学生レジストリ",
    editProfile: "プロフィールを編集",
    charName: "キャラクター名",
    academicMajor: "専攻",
    residenceHall: "寮",
    emailLabel: "アカウントのメール（編集不可）",
    lockedLabel: "ロック中",
    editAcademicCard: "プロフィールの変更",
    nameRequired: "名前を入力してください。",
    cancelBtn: "キャンセル",
    updateBtn: "更新する",
    savingBtn: "保存中...",
    passwordHeader: "セキュリティ設定（パスワード）",
    passRequired: "すべての項目が必須です。",
    passNoMatch: "新しいパスワードが一致しません。",
    passMinLength: "新しいパスワードは6文字以上にする必要があります。",
    passSuccess: "パスワードを変更しました！",
    currPassword: "現在のパスワード",
    newPassword: "新しいパスワード",
    confirmPassword: "新しいパスワードの確認",
    updatePasswordBtn: "パスワードを変更する",
    updatingPasswordBtn: "パスワードを更新中...",
    dangerZoneHeader: "危険エリア",
    deleteTitle: "登録情報の削除",
    deleteDesc: "プロフィール、習得スキル、完了した課題、ログインアカウントを完全に削除します。この操作は取り消せません。",
    deleteBtn: "アカウントを削除する",
    deleteConfirmText: "削除を確認するには、キャラクター名 \"{name}\" または \"DELETE\" と入力してください:",
    deleteConfirmPlaceholder: "{name} または DELETE と入力",
    permanentlyDeleteBtn: "完全に削除する",
    deletingBtn: "削除中...",
    preferencesHeader: "環境設定",
    dailyReminderTitle: "毎日のストーリー通知",
    dailyReminderDesc: "毎日英語の学習を継続するために、ブラウザの通知を受け取ります。",
    browserAlert: "このブラウザはデスクトップ通知をサポートしていません。",
    permissionBlockedAlert: "ブラウザ의 알림 권한이 차단되었습니다. 이 기기에서는 알림을 활성화할 수 없습니다. 다시 활성화하려면 브라우저 설정에서 \"Campus\"의 알림 허용을 업데이트하십시오.",
    deviceLevelHeader: "デバイス設定",
    deviceLevelDesc: "この設定はローカルブラウザのキャッシュに保存され、学生キャラクター ({name}) に直接紐づけられます。クラウドのデータベースには送信されません。",
    faqHeader: "ヘルプデスク",
    faqSubtitle: "Campus 英語カリキュラムに関するよくある質問と回答を掲載しています。",
    faqHelpful: "このFAQは学習の役に立ちましたか？",
    feedbackSuccess: "フィードバックを受け付けました！",
    feedbackDesc: "フィードバックありがとうございます！ キャンパスでの体験向上に役立てさせていただきます。",
    checkingUpdates: "プログラムの更新を確認中...",
    checkUpdatesBtn: "アップデートを確認",
    updatedMsg: "すべての学習モジュールが最新です！",
    aboutHeader: "Campus について",
    aboutSubtitle: "Campus プログラムのデザイン哲学と現在のビルドについて紹介します。",
    aboutDesc1: "Campus は、学生がアカデミック英語とソーシャル英語を習得できるように設計された、没入型ロールプレイング言語シミュレーターです。アメリカの大学の1学期目の留学生としての生活を体験してください。",
    aboutDesc2: "オリエンテーションでの会話、講義、フォーラムでの活発なディスカッション、課題エッセイなど、重要なマイルストーンを体験。リスニング、スピーキング、リーディング、ライティングを向上させましょう。",
    learningPhilosophy: "教育方針",
    learningPhilosophyDesc: "物語の中での決定に英語の実践を組み込むことで、Campusは文脈による習得を促します。対話チャット、リーディング素材、即時のAIフィードバックにより、リアルな大学生活を再現します。",
    academicBuild: "アカデミックビルド",
    earnedAchievements: "獲得した実績",
    viewAllAchievements: "すべての実績を見る",
    noAchievementsYet: "実績メダルはまだ獲得していません。キャンパスのストーリーをクリアして最初のバッジを解放しましょう！",
    activeStudentTag: "在学生 • 第1学期",
    medalsEarnedCount: "獲得したメダル",
  },
  IT: {
    backBtn: "Torna alle Impostazioni",
    studentIdentity: "Identità dello Studente",
    studentProfile: "Profilo dello Studente",
    studentProfileDesc: "Visualizza e aggiorna le tue informazioni accademiche e le impostazioni di sicurezza.",
    successUpdated: "Profilo accademico aggiornato con successo!",
    studentRegistry: "Registro degli Studenti",
    editProfile: "Modifica Profilo",
    charName: "Nome del Personaggio",
    academicMajor: "Specializzazione",
    residenceHall: "Residenza",
    emailLabel: "Email dell'Account (Non Modificabile)",
    lockedLabel: "Bloccato",
    editAcademicCard: "Modifica Scheda Accademica",
    nameRequired: "Inserisci il tuo nome.",
    cancelBtn: "Annulla",
    updateBtn: "Aggiorna Profilo",
    savingBtn: "Salvataggio...",
    passwordHeader: "Impostazioni di Sicurezza (Password)",
    passRequired: "Tutti i campi sono obbligatori.",
    passNoMatch: "Le nuove password non corrispondono.",
    passMinLength: "La nuova password deve contenere almeno 6 caratteri.",
    passSuccess: "Password aggiornata con successo!",
    currPassword: "Password Attuale",
    newPassword: "Nuova Password",
    confirmPassword: "Conferma Nuova Password",
    updatePasswordBtn: "Cambia Password",
    updatingPasswordBtn: "Aggiornamento Password...",
    dangerZoneHeader: "Zona di Pericolo Accademico",
    deleteTitle: "Elimina Registro Accademico",
    deleteDesc: "Elimina permanentemente il tuo profilo, le abilità acquisite, i compiti completati e l'account. Questa azione non può essere annullata.",
    deleteBtn: "Elimina Account Accademico",
    deleteConfirmText: "Per confermare l'eliminazione, digita il nome del tuo personaggio \"{name}\" o \"DELETE\":",
    deleteConfirmPlaceholder: "Digita {name} o DELETE",
    permanentlyDeleteBtn: "Elimina Permanentemente",
    deletingBtn: "Eliminazione...",
    preferencesHeader: "Preferenze",
    dailyReminderTitle: "Promemoria Giornaliero",
    dailyReminderDesc: "Ricevi un promemoria sul tuo browser per controllare e ripassare i capitoli di inglese ogni giorno.",
    browserAlert: "Questo browser non supporta le notifiche desktop.",
    permissionBlockedAlert: "Le notifiche del browser sono bloccate. Non è possibile inviare promemoria quotidiani su questo dispositivo. Aggiorna le impostazioni del tuo browser per \"Campus\" per riabilitarle.",
    deviceLevelHeader: "Impostazione del Dispositivo",
    deviceLevelDesc: "Questa scelta viene memorizzata nella cache locale del browser associata direttamente al tuo studente ({name}). Non viene inviata al database cloud.",
    faqHeader: "Supporto Accademico",
    faqSubtitle: "Trova le risposte alle domande più frequenti sul programma di inglese di Campus.",
    faqHelpful: "Questa FAQ è stata utile per i tuoi studi?",
    feedbackSuccess: "Risposta Registrata!",
    feedbackDesc: "Grazie per il tuo feedback! Aiuta il nostro ufficio accademico a migliorare l'esperienza nel campus.",
    checkingUpdates: "Verifica del registro accademico...",
    checkUpdatesBtn: "Verifica Aggiornamenti",
    updatedMsg: "Tutti i moduli accademici sono aggiornati!",
    aboutHeader: "Informazioni su Campus",
    aboutSubtitle: "Scopri la filosofia del design e la versione corrente del programma Campus.",
    aboutDesc1: "Campus è un simulatore linguistico di ruolo inmersivo progettato per aiutare gli studenti a padroneggiare l'inglese accademico e sociale. Mettiti nei panni di uno studente internazionale al primo semestre.",
    aboutDesc2: "Sperimenta traguardi fondamentali, tra cui conversazioni di orientamento, lezioni in aula, forum di discussione attivi e saggi per i compiti a casa. Migliora le competenze di ascolto, parlato, lettura e scrittura.",
    learningPhilosophy: "Filosofia di Apprendimento",
    learningPhilosophyDesc: "Integrando la pratica dell'inglese all'interno di decisioni narrative, Campus sfrutta l'acquisizione contestuale. Chatbot interattivi, letture e feedback immediati dell'IA simulano le pressioni reali del college.",
    academicBuild: "Versione Accademica",
    earnedAchievements: "Obiettivi Raggiunti",
    viewAllAchievements: "Vedi Tutti gli Obiettivi",
    noAchievementsYet: "Nessuna medaglia ancora ottenuta. Completa i capitoli per sbloccare il tuo primo distintivo!",
    activeStudentTag: "Studente Attivo • Semestre 1",
    medalsEarnedCount: "Medaglie Ottenute",
  },
  KO: {
    backBtn: "설정으로 돌아가기",
    studentIdentity: "학생 신원",
    studentProfile: "학생 프로필",
    studentProfileDesc: "학업 정보 및 보안 설정을 확인하고 업데이트합니다.",
    successUpdated: "학생 프로필이 성공적으로 업데이트되었습니다!",
    studentRegistry: "학생 등록부",
    editProfile: "프로필 수정",
    charName: "캐릭터 이름",
    academicMajor: "전공",
    residenceHall: "기숙사",
    emailLabel: "계정 이메일 (수정 불가)",
    lockedLabel: "잠금",
    editAcademicCard: "학업 카드 수정",
    nameRequired: "이름을 입력하세요.",
    cancelBtn: "취소",
    updateBtn: "프로필 업데이트",
    savingBtn: "저장 중...",
    passwordHeader: "보안 설정 (비밀번호)",
    passRequired: "모든 필드를 입력해야 합니다.",
    passNoMatch: "새 비밀번호가 일치하지 않습니다.",
    passMinLength: "새 비밀번호는 최소 6자 이상이어야 합니다.",
    passSuccess: "비밀번호가 성공적으로 업데이트되었습니다!",
    currPassword: "현재 비밀번호",
    newPassword: "새 비밀번호",
    confirmPassword: "새 비밀번호 확인",
    updatePasswordBtn: "비밀번호 변경",
    updatingPasswordBtn: "비밀번호 업데이트 중...",
    dangerZoneHeader: "학업 제한 위험 지역",
    deleteTitle: "학생 등록 기록 삭제",
    deleteDesc: "프로필, 획득한 기술, 완료한 과제 및 인증 계정을 영구적으로 삭제합니다. 이는 되돌릴 수 없습니다.",
    deleteBtn: "학업 계정 삭제",
    deleteConfirmText: "삭제를 확인하려면 캐릭터 이름 \"{name}\" 또는 \"DELETE\"를 입력하십시오:",
    deleteConfirmPlaceholder: "{name} 또는 DELETE 입력",
    permanentlyDeleteBtn: "영구 삭제",
    deletingBtn: "삭제 중...",
    preferencesHeader: "환경 설정",
    dailyReminderTitle: "일일 학습 알림",
    dailyReminderDesc: "매일 활성화된 영어 챕터를 확인하고 검토할 수 있도록 브라우저 알림을 받습니다.",
    browserAlert: "이 브라우저는 데스크톱 알림을 지원하지 않습니다.",
    permissionBlockedAlert: "브라우저 알림 권한이 차단되었습니다. 이 기기에서는 일일 알림을 활성화할 수 없습니다. 다시 활성화하려면 브라우저 사이트 설정에서 \"Campus\"에 대한 알림 허용을 업데이트하십시오.",
    deviceLevelHeader: "기기 수준 설정",
    deviceLevelDesc: "이 선택 사항은 학생 캐릭터({name})에 직접 할당된 로컬 브라우저 캐시에 저장되며, 클라우드 데이터베이스로 전송되지 않습니다.",
    faqHeader: "학업 헬프데스크",
    faqSubtitle: "Campus 영어 교육과정에 관해 자주 묻는 질문과 답변을 찾을 수 있습니다.",
    faqHelpful: "이 자주 묻는 질문이 학업에 도움이 되었습니까?",
    feedbackSuccess: "피드백이 기록되었습니다!",
    feedbackDesc: "피드백을 보내주셔서 감사합니다! 이는 학무처가 캠퍼스 환경을 개선하는 데 큰 도움이 됩니다.",
    checkingUpdates: "학업 등록부 확인 중...",
    checkUpdatesBtn: "업데이트 확인",
    updatedMsg: "모든 학업 모듈이 최신 버전입니다!",
    aboutHeader: "Campus 소개",
    aboutSubtitle: "Campus 프로그램의 디자인 철학과 현재 빌드에 대해 알아보십시오.",
    aboutDesc1: "Campus는 학생들이 학술 및 사회적 영어를 마스터할 수 있도록 설계된 몰입형 역할 수행 언어 시뮬레이터입니다. 미국 대학의 첫 학기 유학생이 되어 보십시오.",
    aboutDesc2: "오리엔테이션 대화, 강의실 수업, 활발한 토론 게시판 및 과제 에세이를 포함한 중요한 이정표를 경험하십시오. 듣기, 말하기, 읽기, 쓰기 핵심 기술을 향상하십시오.",
    learningPhilosophy: "학습 철학",
    learningPhilosophyDesc: "풍부한 스토리의 결정 사항 내에 영어 실습을 포함시킴으로써 Campus는 상황별 습득 방식을 활용합니다. 대화형 챗봇, 읽기 자료, 즉각적인 AI 점수 피드백은 실제 대학 환경의 긴장감을 재현합니다.",
    academicBuild: "학술 빌드",
    earnedAchievements: "획득한 업적",
    viewAllAchievements: "모든 업적 보기",
    noAchievementsYet: "획득한 업적 훈장이 없습니다. 첫 번째 뱃지를 해제하려면 캠퍼스 스토리 챕터를 완료하세요!",
    activeStudentTag: "재학생 • 1학기",
    medalsEarnedCount: "획득한 훈장",
  }
};

// ---------------- STUDENT PROFILE SUBSCREEN ----------------
export const StudentProfileSubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const { profile, progress, updateProfile, changePassword, deleteAccount, uiLanguage, setActiveTab, isCampusPlus } = useCampus();
  const st = subTranslations[uiLanguage] || subTranslations.EN;
  const t = translations[uiLanguage] || translations.EN;
  
  // Calculate earned badges for showcase
  const chapters = getDynamicChapters(profile.major, profile.dorm);
  const earnedBadges = BADGE_DEFINITIONS.filter(badge => badge.check(progress, chapters));

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name || '');
  const [editMajor, setEditMajor] = useState(profile.major || 'Undecided');
  const [editDorm, setEditDorm] = useState(profile.dorm || 'Elm Hall');
  const [editExamPreference, setEditExamPreference] = useState<'TOEFL' | 'IELTS' | 'NONE'>(profile.examPreference === 'IELTS' ? 'IELTS' : profile.examPreference === 'NONE' ? 'NONE' : 'TOEFL');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Change Password States
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete Account States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Sync edits when profile changes
  useEffect(() => {
    if (!isEditing) {
      setEditName(profile.name || '');
      setEditMajor(profile.major || 'Undecided');
      setEditDorm(profile.dorm || 'Elm Hall');
      setEditExamPreference(profile.examPreference === 'IELTS' ? 'IELTS' : profile.examPreference === 'NONE' ? 'NONE' : 'TOEFL');
    }
  }, [profile, isEditing]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setSaveError(st.nameRequired);
      return;
    }
    setSaveError('');
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        name: editName.trim(),
        major: editMajor,
        dorm: editDorm,
        examPreference: editExamPreference
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(st.passRequired);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(st.passNoMatch);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(st.passMinLength);
      return;
    }

    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(st.passSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordForm(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanConfirm = confirmText.trim();
    if (cleanConfirm !== 'DELETE' && cleanConfirm !== profile.name) {
      setDeleteError('Confirmation input does not match.');
      return;
    }

    setDeleteError('');
    setDeleteLoading(true);
    try {
      await deleteAccount();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  const majors: { value: typeof editMajor; label: string; icon: React.ReactNode }[] = [
    { value: 'Psychology', label: uiLanguage === 'RU' ? 'Психология' : (uiLanguage === 'ES' ? 'Psicología' : (uiLanguage === 'ZH' ? '心理学' : (uiLanguage === 'JA' ? '心理学' : 'Psychology'))), icon: <Sparkles className="w-4 h-4" /> },
    { value: 'Computer Science', label: uiLanguage === 'RU' ? 'Информатика' : (uiLanguage === 'ES' ? 'Informática' : (uiLanguage === 'ZH' ? '计算机科学' : (uiLanguage === 'JA' ? 'コンピュータサイエンス' : 'Computer Science'))), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'Business', label: uiLanguage === 'RU' ? 'Бизнес' : (uiLanguage === 'ES' ? 'Negocios' : (uiLanguage === 'ZH' ? '商业' : (uiLanguage === 'JA' ? 'ビジネス' : 'Business'))), icon: <Landmark className="w-4 h-4" /> },
    { value: 'Undecided', label: uiLanguage === 'RU' ? 'Не определено' : (uiLanguage === 'ES' ? 'Indeciso' : (uiLanguage === 'ZH' ? '未定' : (uiLanguage === 'JA' ? '未定' : 'Undecided'))), icon: <User className="w-4 h-4" /> }
  ];

  const dorms = [
    { value: 'Elm Hall', label: uiLanguage === 'RU' ? 'Элм Холл' : (uiLanguage === 'ES' ? 'Elm Hall' : (uiLanguage === 'ZH' ? '榆树宿舍' : (uiLanguage === 'JA' ? 'エルムホール' : 'Elm Hall'))) },
    { value: 'Oak Hall', label: uiLanguage === 'RU' ? 'Оук Холл' : (uiLanguage === 'ES' ? 'Oak Hall' : (uiLanguage === 'ZH' ? '橡树宿舍' : (uiLanguage === 'JA' ? 'オークホール' : 'Oak Hall'))) },
    { value: 'Pine Hall', label: uiLanguage === 'RU' ? 'Пайн Холл' : (uiLanguage === 'ES' ? 'Pine Hall' : (uiLanguage === 'ZH' ? '松树宿舍' : (uiLanguage === 'JA' ? 'パインホール' : 'Pine Hall'))) }
  ];

  return (
    <div className="space-y-6" id="profile-subscreen">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="profile-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {st.backBtn}
      </button>

      {/* 1. Profile Header Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-terracotta/10 to-burgundy/10 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-terracotta/20 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="profile-hero-header">
        <div className="flex items-center gap-4 relative z-10">
          {/* Illustrated Seal / Avatar Motif with optional Plus frame */}
          {isCampusPlus ? (
            <PremiumProfileFrame size="lg">
              <GraduationCap className="w-9 h-9 sm:w-10 sm:h-10 text-amber-100 dark:text-amber-50" />
            </PremiumProfileFrame>
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-terracotta to-burgundy text-white dark:from-amber-500 dark:to-terracotta flex items-center justify-center shadow-md relative group shrink-0 border-2 border-white/50 dark:border-slate-700">
              <GraduationCap className="w-9 h-9 sm:w-10 sm:h-10 text-amber-100 dark:text-amber-50" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-terracotta/80 dark:bg-slate-800 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[9px] text-white font-bold shadow-xs">
                🎓
              </span>
            </div>
          )}

          {/* Hero Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-terracotta dark:text-amber-400 bg-terracotta/10 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-terracotta/20 dark:border-amber-400/30">
                {st.activeStudentTag || "Active Student • Semester 1"}
              </span>
              {isCampusPlus && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>{t.plusBadgeLabel || 'Plus Subscriber'}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy dark:text-slate-100 flex items-center gap-2">
              <span>{profile.name || 'Alex'}</span>
            </h1>
            <p className="text-xs font-semibold text-navy/70 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
              <span>{majors.find(m => m.value === profile.major)?.label || profile.major}</span>
              <span className="text-navy/30 dark:text-slate-600">•</span>
              <span>{dorms.find(d => d.value === profile.dorm)?.label || profile.dorm}</span>
            </p>
          </div>
        </div>

        {/* Quick Badge Stat Pill */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-terracotta/15 dark:border-slate-700 rounded-2xl px-4 py-2.5 flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start shadow-xs">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 dark:text-slate-400 block">
              {st.medalsEarnedCount || "Medals Earned"}
            </span>
            <span className="text-sm font-bold text-navy dark:text-slate-100 font-mono">
              {earnedBadges.length} <span className="text-xs text-navy/40 dark:text-slate-500 font-normal">/ {BADGE_DEFINITIONS.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Earned Achievements Medal Showcase Card */}
      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4" id="profile-achievements-card">
        <div className="flex items-center justify-between pb-2.5 border-b border-navy/5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-navy dark:text-slate-200">
                {st.earnedAchievements || "Earned Achievements"}
              </h3>
              <span className="text-[10px] font-mono text-navy/40 dark:text-slate-500 block">
                {earnedBadges.length} {st.medalsEarnedCount ? st.medalsEarnedCount.toLowerCase() : "earned"}
              </span>
            </div>
          </div>

          <button
            id="profile-view-all-achievements-btn"
            onClick={() => setActiveTab('progress')}
            className="text-xs font-semibold text-terracotta hover:text-terracotta-dark dark:text-amber-400 dark:hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {st.viewAllAchievements || "View All Achievements"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1" id="profile-earned-medals-grid">
            {earnedBadges.map((badge) => {
              const title = getBadgeTitle(badge, t);
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-2.5 rounded-xl bg-cream-card/60 dark:bg-slate-800/40 border border-navy/5 dark:border-slate-800/80 hover:border-amber-500/30 transition-all hover:scale-105 group text-center"
                  title={title}
                >
                  <BadgeMedallion badgeId={badge.id} isEarned={true} size="md" />
                  <span className="text-[10.5px] font-semibold text-navy/80 dark:text-slate-200 line-clamp-1 mt-1.5 w-full">
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-cream-card/50 dark:bg-slate-800/30 border border-dashed border-navy/10 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-navy/60 dark:text-slate-400">
              {st.noAchievementsYet || "No achievement medals earned yet. Complete story chapters on campus to unlock your first badge!"}
            </p>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs font-semibold text-terracotta dark:text-amber-400 underline cursor-pointer"
            >
              {st.viewAllAchievements || "View All Achievements"}
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn" id="profile-success-banner">
          <Check className="w-4 h-4" />
          {st.successUpdated}
        </div>
      )}

      {/* Profile Form (View & Edit Mode) */}
      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5" id="profile-card">
        {!isEditing ? (
          // VIEW MODE
          <div className="space-y-4" id="profile-view-mode">
            <div className="flex items-center justify-between pb-2 border-b border-navy/5 dark:border-slate-800">
              <h3 className="text-xs uppercase tracking-wider font-bold text-navy/40 dark:text-slate-500">{st.studentRegistry}</h3>
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-terracotta hover:text-terracotta-dark dark:hover:text-rose-300 transition-colors cursor-pointer"
              >
                {st.editProfile}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy/40 dark:text-slate-500 block">{st.charName}</span>
                <p className="text-sm font-semibold text-navy dark:text-slate-200">{profile.name || 'Alex'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy/40 dark:text-slate-500 block">{st.academicMajor}</span>
                <p className="text-sm font-semibold text-navy dark:text-slate-200">
                  {majors.find(m => m.value === profile.major)?.label || profile.major}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy/40 dark:text-slate-500 block">{st.residenceHall}</span>
                <p className="text-sm font-semibold text-navy dark:text-slate-200">
                  {dorms.find(d => d.value === profile.dorm)?.label || profile.dorm}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy/40 dark:text-slate-500 block">{st.targetExam || 'Target Exam'}</span>
                <p className="text-sm font-semibold text-navy dark:text-slate-200">
                  {profile.examPreference === 'IELTS'
                    ? (t.examOptionIelts || 'IELTS')
                    : profile.examPreference === 'NONE'
                    ? (t.examOptionNone || 'Already took it / Not sure')
                    : (t.examOptionToefl || 'TOEFL iBT')}
                </p>
              </div>
            </div>

            {/* Read-Only Account Email */}
            <div className="pt-3 border-t border-navy/5 dark:border-slate-800 space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-navy/40 dark:text-slate-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-navy/40 dark:text-slate-500" />
                {st.emailLabel}
              </label>
              <div className="flex items-center justify-between bg-cream-card dark:bg-slate-800/50 border border-navy/5 dark:border-slate-800 rounded-xl p-3">
                <span className="text-xs font-semibold text-navy/60 dark:text-slate-300 font-mono">{profile.email || 'N/A'}</span>
                <span className="text-[10px] font-mono bg-navy/5 dark:bg-slate-800 text-navy/50 dark:text-slate-400 py-1 px-2 rounded-md flex items-center gap-1 border border-navy/10 dark:border-slate-700">
                  <Lock className="w-3 h-3" /> {st.lockedLabel}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSaveProfile} className="space-y-5" id="profile-edit-mode">
            <div className="pb-2 border-b border-navy/5 dark:border-slate-800">
              <h3 className="text-xs uppercase tracking-wider font-bold text-navy/40 dark:text-slate-500">{st.editAcademicCard}</h3>
            </div>

            {saveError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{saveError}</p>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="edit-hero-name" className="text-xs font-bold text-navy dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-terracotta" /> {st.charName}
              </label>
              <input
                id="edit-hero-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Student Name"
                className="w-full bg-cream-card dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                maxLength={20}
                disabled={saveLoading}
              />
            </div>

            {/* Major Chip-Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-terracotta" /> {st.academicMajor}
              </label>
              <div className="grid grid-cols-2 gap-2" id="edit-major-grid">
                {majors.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setEditMajor(m.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs border font-medium transition-all text-left cursor-pointer ${
                      editMajor === m.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-sm dark:bg-terracotta/20'
                        : 'bg-cream-card dark:bg-slate-800 hover:bg-navy/5 dark:hover:bg-slate-800/60 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                    disabled={saveLoading}
                  >
                    <span className={editMajor === m.value ? 'text-terracotta' : 'text-navy/40 dark:text-slate-500'}>
                      {m.icon}
                    </span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dorm Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> {st.residenceHall}
              </label>
              <div className="flex gap-2" id="edit-dorm-grid">
                {dorms.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setEditDorm(d.value)}
                    className={`flex-1 text-center p-2.5 rounded-xl text-xs border font-medium transition-all cursor-pointer ${
                      editDorm === d.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-sm dark:bg-terracotta/20'
                        : 'bg-cream-card dark:bg-slate-800 hover:bg-navy/5 dark:hover:bg-slate-800/60 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                    disabled={saveLoading}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Exam Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-terracotta" /> {st.targetExam || 'Target Exam'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" id="edit-exam-grid">
                {[
                  { value: 'TOEFL', label: t.examOptionToefl || 'TOEFL iBT' },
                  { value: 'IELTS', label: t.examOptionIelts || 'IELTS' },
                  { value: 'NONE', label: t.examOptionNone || 'Already took it / Not sure' }
                ].map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setEditExamPreference(e.value as 'TOEFL' | 'IELTS' | 'NONE')}
                    className={`text-center p-2.5 rounded-xl text-xs border font-medium transition-all cursor-pointer ${
                      editExamPreference === e.value
                        ? 'bg-terracotta/10 border-terracotta text-terracotta shadow-sm dark:bg-terracotta/20'
                        : 'bg-cream-card dark:bg-slate-800 hover:bg-navy/5 dark:hover:bg-slate-800/60 border-navy/10 dark:border-slate-800 text-navy/70 dark:text-slate-300'
                    }`}
                    disabled={saveLoading}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer"
                disabled={saveLoading}
              >
                {st.cancelBtn}
              </button>
              <button
                type="submit"
                className="flex-1 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-55"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {st.savingBtn}
                  </>
                ) : (
                  st.updateBtn
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4" id="password-section">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-navy/50 dark:text-slate-500 cursor-pointer"
          id="toggle-password-form-btn"
        >
          <span className="flex items-center gap-1.5">
            <Key className="w-4 h-4 text-terracotta" /> {st.passwordHeader}
          </span>
          {showPasswordForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPasswordForm && (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2 border-t border-navy/5 dark:border-slate-800 animate-slideDown" id="password-form">
            {passwordError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">{passwordSuccess}</p>
            )}

            <div className="space-y-1">
              <label htmlFor="current-password" className="text-xs font-semibold text-navy dark:text-slate-300">{st.currPassword}</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-card dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta"
                disabled={passwordLoading}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="new-password" className="text-xs font-semibold text-navy dark:text-slate-300">{st.newPassword}</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-card dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta"
                disabled={passwordLoading}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-xs font-semibold text-navy dark:text-slate-300">{st.confirmPassword}</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-card dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta"
                disabled={passwordLoading}
              />
            </div>

            <button
              id="change-password-submit-btn"
              type="submit"
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-55"
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {st.updatingPasswordBtn}
                </>
              ) : (
                st.updatePasswordBtn
              )}
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="space-y-2" id="profile-danger-zone">
        <h3 className="text-[10px] uppercase tracking-wider font-bold text-red-600 px-1">{st.dangerZoneHeader}</h3>
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-600 border border-red-100 dark:border-red-900/40 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-navy dark:text-slate-200">{st.deleteTitle}</h4>
              <p className="text-[11px] text-navy/60 dark:text-slate-400 leading-relaxed">
                {st.deleteDesc}
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              id="delete-account-trigger-btn"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 hover:bg-red-500 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-600 dark:text-red-400 hover:text-white text-xs font-semibold py-3 px-4 rounded-xl border border-red-200 dark:border-red-950 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {st.deleteBtn}
            </button>
          ) : (
            <form onSubmit={handleDeleteAccountSubmit} className="space-y-3 pt-2 border-t border-navy/5 dark:border-slate-800 animate-slideDown" id="delete-confirm-form">
              {deleteError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{deleteError}</p>
              )}
              <div className="space-y-1.5">
                <p className="text-[11px] text-navy/70 dark:text-slate-300 font-medium">
                  {st.deleteConfirmText.replace('{name}', profile.name || 'Alex')}
                </p>
                <input
                  id="delete-confirm-input"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={st.deleteConfirmPlaceholder.replace('{name}', profile.name || 'Alex')}
                  className="w-full bg-cream-card dark:bg-slate-900 border border-red-200 dark:border-red-950 rounded-xl p-3 text-xs text-navy dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={deleteLoading}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmText('');
                    setDeleteError('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer"
                  disabled={deleteLoading}
                >
                  {st.cancelBtn}
                </button>
                <button
                  id="delete-account-submit-btn"
                  type="submit"
                  disabled={deleteLoading || (confirmText.trim() !== 'DELETE' && confirmText.trim() !== profile.name)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {st.deletingBtn}
                    </>
                  ) : (
                    st.permanentlyDeleteBtn
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


// ---------------- ACADEMIC NOTIFICATIONS SUBSCREEN ----------------
export const NotificationsSubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const { profile, uiLanguage } = useCampus();
  const st = subTranslations[uiLanguage] || subTranslations.EN;
  const storageKey = `campus_notify_daily_reminder_${profile.name || 'Alex'}`;
  
  const [dailyReminder, setDailyReminder] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === 'true';
  });
  const [permissionBlocked, setPermissionBlocked] = useState<boolean>(false);

  // Sync initial state and check current browser notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'denied') {
        setPermissionBlocked(true);
      }
    }
  }, []);

  const handleToggleReminder = async (checked: boolean) => {
    if (!checked) {
      // Toggle off is simple and requires no browser API confirmation
      localStorage.setItem(storageKey, 'false');
      setDailyReminder(false);
      return;
    }

    // Toggle on requests permission
    if (!('Notification' in window)) {
      alert(st.browserAlert);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem(storageKey, 'true');
        setDailyReminder(true);
        setPermissionBlocked(false);
      } else {
        setPermissionBlocked(true);
        localStorage.setItem(storageKey, 'false');
        setDailyReminder(false);
        alert('Notification permission was blocked.');
      }
    } catch (e) {
      console.error('Error requesting notification permission:', e);
    }
  };

  return (
    <div className="space-y-6" id="notifications-subscreen">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="notify-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {st.backBtn}
      </button>

      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{st.preferencesHeader}</span>
        <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">{st.dailyReminderTitle}</h2>
        <p className="text-xs text-navy/50 dark:text-slate-400">{st.dailyReminderDesc}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5" id="notifications-card">
        <div className="flex items-center justify-between pb-3 border-b border-navy/5 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-navy dark:text-slate-200">{st.dailyReminderTitle}</h3>
            <p className="text-[11px] text-navy/60 dark:text-slate-400 leading-relaxed max-w-[200px]">
              {st.dailyReminderDesc}
            </p>
          </div>

          <button
            id="daily-reminder-toggle-btn"
            onClick={() => handleToggleReminder(!dailyReminder)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              dailyReminder ? 'bg-terracotta' : 'bg-navy/10'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                dailyReminder ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {permissionBlocked && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-[11px] font-semibold leading-relaxed" id="notify-blocked-alert">
            {st.permissionBlockedAlert}
          </div>
        )}

        <div className="flex items-start gap-3 p-3.5 bg-cream-card dark:bg-slate-800/40 border border-navy/5 dark:border-slate-800 rounded-xl">
          <Bell className="w-5 h-5 text-terracotta stroke-[1.5] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-navy dark:text-slate-300">{st.deviceLevelHeader}</h4>
            <p className="text-[10px] text-navy/50 dark:text-slate-400 leading-relaxed">
              {st.deviceLevelDesc.replace('{name}', profile.name || 'Alex')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// ---------------- ACADEMIC HELPDESK SUBSCREEN ----------------
export const HelpdeskSubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const { uiLanguage } = useCampus();
  const st = subTranslations[uiLanguage] || subTranslations.EN;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [feedbackLogged, setFeedbackLogged] = useState<'yes' | 'no' | null>(null);

  const faqs = [
    {
      q: uiLanguage === 'RU' ? 'Как мне повысить уровень отношений с NPC?' : 
         uiLanguage === 'ES' ? '¿Cómo aumento las puntuaciones de relación de los NPC?' : 
         'How do I raise NPC relationship scores?',
      a: uiLanguage === 'RU' ? 'Очки отношений с NPC повышаются при взаимодействии с персонажами в главах историй. Выбор эмпатичных, конструктивных и грамматически точных вариантов диалога укрепляет дружбу!' :
         uiLanguage === 'ES' ? 'Los puntos de relación con los NPC se incrementan al interactuar con los personajes del campus en los capítulos de la historia. ¡Elegir opciones de diálogo empáticas, constructivas y gramaticalmente precisas aumenta la amistad!' :
         'NPC relationship points are raised by interacting with campus characters during narrative chapters. Choosing empathetic, constructive, and grammatically precise dialog options increases friendship! Check your standing in the Progress tab.'
    },
    {
      q: uiLanguage === 'RU' ? 'Как работает оценивание письменных заданий?' :
         uiLanguage === 'ES' ? '¿Cómo funciona la calificación de las tareas escritas?' :
         'How does grading work for writing assignments?',
      a: uiLanguage === 'RU' ? 'Ваши эссе и посты на дискуссионных форумах обрабатываются и оцениваются нашим академическим движком на основе четырех измерений: аудирование, устная речь, чтение и академическое письмо. Вы получите персонализированную оценку и отчет.' :
         uiLanguage === 'ES' ? 'Tus ensayos y publicaciones de discusión son procesados y calificados por nuestro motor académico de IA basado en cuatro dimensiones: comprensión auditiva, fluidez al hablar, comprensión lectora y claridad en la escritura.' :
         'Your essays and discussion posts are processed and graded by our Academic AI Engine based on four dimensions: listening accuracy, speaking fluency, reading comprehension, and writing clarity. You will get a personalized letter grade and feedback report.'
    },
    {
      q: uiLanguage === 'RU' ? 'Для чего используются баллы навыков?' :
         uiLanguage === 'ES' ? '¿Para qué se utilizan las puntuaciones de habilidades?' :
         'What are academic skill scores used for?',
      a: uiLanguage === 'RU' ? 'Они представляют собой ваш общий прогресс. Завершение лекций повышает навык аудирования, ответы в дискуссионных ветках — устную речь и письмо. Высокие баллы открывают новые главы.' :
         uiLanguage === 'ES' ? 'Representan tu progreso general. Completar clases aumenta tu puntuación de comprensión auditiva; responder a hilos de discusión aumenta la expresión oral/escrita.' :
         'These represent your general progress. Completing lectures boosts your Listening score; responding to discussion threads boosts Speaking/Writing. High skill scores unlock advanced chapters and new campus maps.'
    },
    {
      q: uiLanguage === 'RU' ? 'Могу ли я играть в Campus без интернета?' :
         uiLanguage === 'ES' ? '¿Puedo jugar a Campus sin conexión?' :
         'Can I play Campus offline?',
      a: uiLanguage === 'RU' ? 'Да! Campus сохраняет ваш текущий прогресс, состояние карты и загруженные истории. Вы можете читать, исследовать карту и проверять настройки полностью офлайн.' :
         uiLanguage === 'ES' ? '¡Sí! Campus almacena tu progreso actual, el estado del mapa y las historias cargadas. Puedes leer, explorar y comprobar la configuración completamente sin conexión.' :
         'Yes! Campus caches your current progress, map state, and loaded stories. You can read, explore, and check settings entirely offline. Reconnect to submit quizzes or get AI grading reviews!'
    }
  ];

  const handleFeedback = (val: 'yes' | 'no') => {
    setFeedbackLogged(val);
    localStorage.setItem('campus_helpdesk_feedback_logged', val);
  };

  useEffect(() => {
    const saved = localStorage.getItem('campus_helpdesk_feedback_logged') as 'yes' | 'no' | null;
    if (saved) setFeedbackLogged(saved);
  }, []);

  return (
    <div className="space-y-6" id="helpdesk-subscreen">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="helpdesk-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {st.backBtn}
      </button>

      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{st.academicBuild}</span>
        <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">{st.faqHeader}</h2>
        <p className="text-xs text-navy/50 dark:text-slate-400">{st.faqSubtitle}</p>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5" id="faq-accordion-list">
        {faqs.map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-250"
            >
              <button
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-xs text-navy dark:text-slate-200 hover:bg-navy/[0.01] dark:hover:bg-slate-800/20 cursor-pointer"
              >
                <span className="flex items-center gap-2 pr-2">
                  <HelpCircle className="w-4 h-4 text-terracotta shrink-0" />
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-navy/30 dark:text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-navy/30 dark:text-slate-500 shrink-0" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-40 border-t border-navy/5 dark:border-slate-800' : 'max-h-0'
                }`}
              >
                <p className="p-4 text-[11px] leading-relaxed text-navy/70 dark:text-slate-300 bg-cream-card/30 dark:bg-slate-800/10">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Feedback Widget */}
      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 text-center space-y-3 shadow-inner" id="faq-feedback-card">
        {!feedbackLogged ? (
          <>
            <h4 className="text-xs font-bold text-navy dark:text-slate-200">{st.faqHelpful}</h4>
            <div className="flex justify-center gap-3">
              <button
                id="faq-feedback-yes-btn"
                onClick={() => handleFeedback('yes')}
                className="flex items-center gap-1.5 bg-cream-card hover:bg-navy/5 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy/80 dark:text-slate-200 text-xs font-semibold py-2 px-4 rounded-xl border border-navy/5 dark:border-slate-700 transition-all cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" /> Yes
              </button>
              <button
                id="faq-feedback-no-btn"
                onClick={() => handleFeedback('no')}
                className="flex items-center gap-1.5 bg-cream-card hover:bg-navy/5 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy/80 dark:text-slate-200 text-xs font-semibold py-2 px-4 rounded-xl border border-navy/5 dark:border-slate-700 transition-all cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-red-600" /> No
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-1 py-1 animate-fadeIn" id="faq-feedback-success">
            <p className="text-xs font-bold text-navy dark:text-slate-200 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> {st.feedbackSuccess}
            </p>
            <p className="text-[10px] text-navy/50 dark:text-slate-400">
              {st.feedbackDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


interface AboutSubscreenProps extends SubscreenProps {
  onOpenPrivacyPolicy?: () => void;
}

// ---------------- ABOUT CAMPUS SUBSCREEN ----------------
export const AboutSubscreen: React.FC<AboutSubscreenProps> = ({ onBack, onOpenPrivacyPolicy }) => {
  const { uiLanguage } = useCampus();
  const st = subTranslations[uiLanguage] || subTranslations.EN;
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleCheckUpdates = () => {
    setCheckingUpdates(true);
    setUpdateMessage('');
    setTimeout(() => {
      setCheckingUpdates(false);
      setUpdateMessage(st.updatedMsg);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="about-subscreen">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="about-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {st.backBtn}
      </button>

      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">{st.academicBuild}</span>
        <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">{st.aboutHeader}</h2>
        <p className="text-xs text-navy/50 dark:text-slate-400">{st.aboutSubtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5" id="about-card">
        {/* Branding Info */}
        <div className="text-center py-4 space-y-2 border-b border-navy/5 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto border border-terracotta/20 shadow-sm">
            <GraduationCap className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-rose-400">Campus</h3>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-navy/40 dark:text-slate-500 bg-navy/[0.03] dark:bg-slate-800 py-1 px-2 rounded-full inline-block">
              v1.2.0 ({st.academicBuild})
            </p>
          </div>
        </div>

        {/* Narrative & Description */}
        <div className="space-y-3 text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
          <p>{st.aboutDesc1}</p>
          <p>{st.aboutDesc2}</p>
        </div>

        {/* Educational Philosophy */}
        <div className="bg-cream-card dark:bg-slate-800/40 border border-navy/5 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {st.learningPhilosophy}
          </h4>
          <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-relaxed">
            {st.learningPhilosophyDesc}
          </p>
        </div>

        {/* Check for Updates */}
        <div className="pt-3 border-t border-navy/5 dark:border-slate-800 text-center space-y-2">
          {updateMessage && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">{updateMessage}</p>
          )}
          <button
            id="check-updates-btn"
            onClick={handleCheckUpdates}
            disabled={checkingUpdates}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl border border-navy/5 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {checkingUpdates ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {st.checkingUpdates}
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                {st.checkUpdatesBtn}
              </>
            )}
          </button>
        </div>

        {/* Privacy Policy Link */}
        <div className="pt-3 border-t border-navy/5 dark:border-slate-800">
          <button
            id="about-open-privacy-policy-btn"
            onClick={onOpenPrivacyPolicy}
            className="w-full bg-cream-card hover:bg-navy/5 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy dark:text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl border border-navy/10 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" />
              <span>Privacy Policy & Data Disclosures</span>
            </div>
            <ChevronRight className="w-4 h-4 text-navy/30 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};


// ---------------- PRIVACY POLICY SUBSCREEN ----------------
export const PrivacyPolicySubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const { uiLanguage } = useCampus();
  const st = subTranslations[uiLanguage] || subTranslations.EN;

  return (
    <div className="space-y-6" id="privacy-policy-subscreen">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-navy/60 dark:text-slate-400 hover:text-terracotta transition-colors cursor-pointer"
        id="privacy-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {st.backBtn}
      </button>

      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-terracotta uppercase tracking-wider block">Legal & Data Protections</span>
        <h2 className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">Privacy Policy</h2>
        <p className="text-xs text-navy/50 dark:text-slate-400">Last updated: July 2026 • Campus Academic Platform</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-navy/5 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5" id="privacy-policy-card">
        
        {/* Header Shield Banner */}
        <div className="flex items-center gap-3 p-3.5 bg-cream-card dark:bg-slate-800/60 rounded-xl border border-navy/5 dark:border-slate-800">
          <div className="p-2 bg-terracotta/10 text-terracotta rounded-lg shrink-0 border border-terracotta/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-navy dark:text-slate-200">Student Data Privacy & Protection</h3>
            <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-tight">
              Campus is built with high standards of data security, AI transparency, and student protection.
            </p>
          </div>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="space-y-2 border-b border-navy/5 dark:border-slate-800 pb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <User className="w-4 h-4 text-terracotta" />
            1. Information We Collect
          </h4>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
            When you register and use Campus, we process essential academic profile data required to deliver your personalized language learning curriculum:
          </p>
          <ul className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300 list-disc list-inside space-y-1 pl-1">
            <li><strong className="text-navy dark:text-slate-200">Student Hero Profile:</strong> Character name, chosen academic major, residence hall, and avatar choices.</li>
            <li><strong className="text-navy dark:text-slate-200">Account Credentials:</strong> Email address and encrypted account authentication credentials stored securely via cloud auth registry.</li>
            <li><strong className="text-navy dark:text-slate-200">Academic Progress Data:</strong> Chapter completion logs, skill scores (Listening, Speaking, Reading, Writing), study streaks, and earned badges.</li>
          </ul>
        </div>

        {/* Section 2: AI Processing & Gemini API */}
        <div className="space-y-2 border-b border-navy/5 dark:border-slate-800 pb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            2. AI Speech & Essay Grading (Gemini API)
          </h4>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
            Campus integrates Google Gemini API to provide real-time, interactive feedback on your English writing, seminar debates, and speaking roleplay exercises:
          </p>
          <ul className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300 list-disc list-inside space-y-1 pl-1">
            <li>Text prompts, essay submissions, and audio transcriptions are processed strictly for real-time pedagogical grading and dialogue response generation.</li>
            <li>AI evaluations do not retain or train permanent models on student identity data.</li>
          </ul>
        </div>

        {/* Section 3: Data Protection & Third Parties */}
        <div className="space-y-2 border-b border-navy/5 dark:border-slate-800 pb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-terracotta" />
            3. Data Protection & No Selling Policy
          </h4>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
            We hold a firm commitment to student privacy. Campus <strong className="text-navy dark:text-slate-200">never sells, rents, monetizes, or trades</strong> your personal account information, hero profile, or academic performance records to third parties.
          </p>
        </div>

        {/* Section 4: Advertising Disclosures & Family-Safe Rating */}
        <div className="space-y-2 border-b border-navy/5 dark:border-slate-800 pb-4 bg-amber-500/5 dark:bg-slate-800/30 p-3.5 rounded-xl border border-amber-500/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <Eye className="w-4 h-4 text-terracotta" />
            4. Web Advertising Disclosures & Family-Safe Policy
          </h4>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
            Currently, Campus does not deliver third-party banner advertisements or place ad-tracking cookies.
          </p>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300 font-medium">
            <strong className="text-navy dark:text-slate-200">Future Web Advertising Disclosures:</strong> Should advertising networks (e.g., Google AdSense) be enabled in future releases:
          </p>
          <ul className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300 list-disc list-inside space-y-1 pl-1">
            <li>Ad networks may collect non-personally identifiable device signals or cookies to render non-intrusive contextual banner ads.</li>
            <li>All ad placements are strictly enforced under a <strong className="text-terracotta">Family-Safe (G / PG) Rating Policy</strong> to protect teenage students and educational users.</li>
            <li>Any active ad partner cookie practices will be updated and explicitly detailed in this policy prior to ad deployment.</li>
          </ul>
        </div>

        {/* Section 5: User Rights & Account Deletion */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-terracotta" />
            5. Your Rights & Account Controls
          </h4>
          <p className="text-[11px] leading-relaxed text-navy/70 dark:text-slate-300">
            You retain complete authority over your student profile data. You can clear your academic progress, wipe local cache, or permanently delete your account record at any time in <strong className="text-navy dark:text-slate-200">Settings → Danger Zone</strong>.
          </p>
        </div>

      </div>
    </div>
  );
};

export const CampusPlusSubscreen: React.FC<SubscreenProps> = ({ onBack }) => {
  const {
    isCampusPlus,
    subscriptionPlan,
    hasRemovedAds,
    buyRemoveAds,
    toggleSandboxRemoveAds,
    isAdFree,
    subscribeCampusPlus,
    cancelCampusPlus,
    toggleSandboxSubscription,
    aiGradesUsedThisWeek,
    aiGradesFreeLimit,
    practiceAttemptsUsedThisWeek,
    practiceAttemptsFreeLimit,
    uiLanguage,
    isAdmin
  } = useCampus();

  const t = translations[uiLanguage] || translations.EN;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(PRODUCT_ID_MONTHLY);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBuyingRemoveAds, setIsBuyingRemoveAds] = useState<boolean>(false);
  const [purchaseStatusMsg, setPurchaseStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    setPurchaseStatusMsg(null);
    
    try {
      const res = await subscribeCampusPlus(selectedPlanId);
      if (res.success) {
        setPurchaseStatusMsg({
          type: 'success',
          text: t.plusWelcomeMsg || 'Welcome to Campus Plus! Unlimited AI grading, ad-free experience, and exclusive poses are now active.'
        });
      } else {
        setPurchaseStatusMsg({
          type: 'error',
          text: res.error || 'Unable to complete Play Billing transaction. Please try again.'
        });
      }
    } catch (err: any) {
      setPurchaseStatusMsg({
        type: 'error',
        text: err.message || 'An unexpected error occurred during subscription checkout.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyRemoveAds = async () => {
    setIsBuyingRemoveAds(true);
    setPurchaseStatusMsg(null);

    try {
      const res = await buyRemoveAds();
      if (res.success) {
        setPurchaseStatusMsg({
          type: 'success',
          text: t.plusRemoveAdsSuccessMsg || 'Ads removed forever! Enjoy a clean, ad-free campus experience.'
        });
      } else {
        setPurchaseStatusMsg({
          type: 'error',
          text: res.error || 'Unable to complete Play Billing transaction. Please try again.'
        });
      }
    } catch (err: any) {
      setPurchaseStatusMsg({
        type: 'error',
        text: err.message || 'An unexpected error occurred during purchase.'
      });
    } finally {
      setIsBuyingRemoveAds(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-navy/10 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-terracotta hover:text-terracotta-dark transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.plusBackToSettings || 'Back to Settings'}</span>
        </button>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold rounded-full flex items-center gap-1.5">
          <Crown className="w-3 h-3 fill-current" />
          {isCampusPlus
            ? (t.plusStatusActive || 'Campus Plus Active')
            : hasRemovedAds
            ? (t.plusRemoveAdsOwned || '✓ Ad-Free Unlocked')
            : (t.plusStatusFree || 'Freemium Member')}
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy via-navy to-slate-900 text-white p-6 shadow-lg border border-burgundy/20">
        <div className="absolute right-[-20px] top-[-20px] opacity-15 pointer-events-none">
          <Crown className="w-44 h-44 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.plusPassTitle || 'Campus Plus Pass'}
          </div>

          <h2 className="text-2xl font-serif font-bold text-cream leading-tight">
            {t.plusHeroHeading || 'Elevate Your Academic Mastery'}
          </h2>

          <p className="text-xs text-slate-200/90 max-w-md leading-relaxed font-sans">
            {t.plusHeroDesc || 'Enjoy an ad-free campus environment, unlimited real Gemini AI grading on every essay and discussion, unlimited practice sessions, and exclusive Biscuit poses.'}
          </p>

          {/* Current Status Pill */}
          <div className="pt-2 flex items-center gap-3">
            <div className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              isCampusPlus 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-white/10 text-slate-200 border border-white/20'
            }`}>
              {isCampusPlus ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {subscriptionPlan === 'annual'
                      ? (t.plusSubscribedAnnual || 'Subscribed (Annual Plan)')
                      : (t.plusSubscribedMonthly || 'Subscribed (Monthly Plan)')}
                  </span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 text-amber-300" />
                  <span>{t.plusFreeTierStatus || 'Free Tier (Weekly Limits Active)'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Message Notification */}
      {purchaseStatusMsg && (
        <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-3 ${
          purchaseStatusMsg.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : purchaseStatusMsg.type === 'error'
            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
            : 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
        }`}>
          {purchaseStatusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
          )}
          <span>{purchaseStatusMsg.text}</span>
        </div>
      )}

      {/* Usage Counters (For Free Users) */}
      {!isCampusPlus && (
        <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-burgundy dark:text-rose-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            {t.plusWeeklyAllowanceTitle || 'Your Free Weekly Allowance (Resets Every 7 Days)'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-cream-card/60 dark:bg-slate-800/60 p-3 rounded-xl border border-navy/5 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-navy dark:text-slate-200">
                <span>{t.plusRealAiFeedbackLabel || 'Real AI Feedback'}</span>
                <span className="font-mono font-bold text-terracotta">{aiGradesUsedThisWeek} / {aiGradesFreeLimit}</span>
              </div>
              <div className="w-full h-1.5 bg-navy/10 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-terracotta rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (aiGradesUsedThisWeek / aiGradesFreeLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400">
                {aiGradesUsedThisWeek >= aiGradesFreeLimit
                  ? (t.plusAiCapReached || 'Weekly AI cap reached — falling back to standard local feedback.')
                  : (t.plusAiGradesRemaining ? t.plusAiGradesRemaining.replace('{count}', String(aiGradesFreeLimit - aiGradesUsedThisWeek)) : `${aiGradesFreeLimit - aiGradesUsedThisWeek} real AI grades remaining this week.`)}
              </p>
            </div>

            <div className="bg-cream-card/60 dark:bg-slate-800/60 p-3 rounded-xl border border-navy/5 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-navy dark:text-slate-200">
                <span>{t.plusPracticeModeLabel || 'Practice Mode Sessions'}</span>
                <span className="font-mono font-bold text-terracotta">{practiceAttemptsUsedThisWeek} / {practiceAttemptsFreeLimit}</span>
              </div>
              <div className="w-full h-1.5 bg-navy/10 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-burgundy rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (practiceAttemptsUsedThisWeek / practiceAttemptsFreeLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-navy/60 dark:text-slate-400">
                {practiceAttemptsUsedThisWeek >= practiceAttemptsFreeLimit
                  ? (t.plusPracticeCapReached || 'Weekly practice cap reached.')
                  : (t.plusPracticeRemaining ? t.plusPracticeRemaining.replace('{count}', String(practiceAttemptsFreeLimit - practiceAttemptsUsedThisWeek)) : `${practiceAttemptsFreeLimit - practiceAttemptsUsedThisWeek} practice attempts remaining this week.`)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Free vs Campus Plus Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-serif font-bold text-navy dark:text-slate-100 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          {t.plusComparisonTitle || 'Plan Comparison'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-navy/10 dark:border-slate-800 text-xs">
                <th className="py-2.5 px-2 font-mono font-bold uppercase text-navy/60 dark:text-slate-400 w-2/5">
                  {t.plusColFeature || 'Feature'}
                </th>
                <th className="py-2.5 px-2 font-mono font-bold uppercase text-navy/60 dark:text-slate-400 text-center w-3/10">
                  {t.plusColFree || 'Free'}
                </th>
                <th className="py-2.5 px-2 font-mono font-bold uppercase text-terracotta dark:text-rose-400 text-center w-3/10">
                  {t.plusColPlus || 'Campus Plus'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5 dark:divide-slate-800/60 text-xs">
              {/* Row 1: Ads */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowAds || 'Advertisements'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{t.plusRowAdsFree || 'Banner Ads'}</span>
                  </span>
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.plusRowAdsPlus || '100% Ad-Free'}</span>
                  </span>
                </td>
              </tr>

              {/* Row 2: AI Grading */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowAi || 'Gemini AI Essay & Debate Grading'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowAiFree || '5 / week'}
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Crown className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>{t.plusRowAiPlus || 'Unlimited'}</span>
                  </span>
                </td>
              </tr>

              {/* Row 3: Practice Mode */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowPractice || 'Practice Mode Attempts'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowPracticeFree || '5 / week'}
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Crown className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>{t.plusRowPracticePlus || 'Unlimited'}</span>
                  </span>
                </td>
              </tr>

              {/* Row 4: Biscuit Poses */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowBiscuit || 'Exclusive Biscuit Poses'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowBiscuitFree || 'Standard Poses'}
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg text-[11px]">
                  {t.plusRowBiscuitPlus || 'Royal & Graduate Poses'}
                </td>
              </tr>

              {/* Row 5: Subscriber Profile Badge */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowBadge || 'Subscriber Profile Badge'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowBadgeFree || 'Standard'}
                </td>
                <td className="py-3 px-2 text-center text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5 dark:bg-amber-500/10 rounded-lg text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-current shrink-0" />
                    <span>{t.plusRowBadgePlus || 'Plus Badge'}</span>
                  </span>
                </td>
              </tr>

              {/* Row 6: Semester Report History */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowReport || 'Semester Report History'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowReportFree || 'Current Report Only'}
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg text-[11px]">
                  {t.plusRowReportPlus || 'Save & Compare Snapshots'}
                </td>
              </tr>

              {/* Row 7: Offline Chapter Cache */}
              <tr className="hover:bg-cream-card/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy dark:text-slate-200">
                  {t.plusRowCache || 'Offline Chapter Cache'}
                </td>
                <td className="py-3 px-2 text-center text-navy/70 dark:text-slate-400 text-[11px]">
                  {t.plusRowCacheFree || '2 Chapters'}
                </td>
                <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg text-[11px]">
                  {t.plusRowCachePlus || '10 Chapters (Expanded)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Selection & Checkout (If Not Subscribed) */}
      {!isCampusPlus ? (
        <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-serif font-bold text-navy dark:text-slate-100">
            {t.plusChoosePlanTitle || 'Choose Your Subscription Plan'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monthly Option */}
            <button
              type="button"
              onClick={() => setSelectedPlanId(PRODUCT_ID_MONTHLY)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                selectedPlanId === PRODUCT_ID_MONTHLY
                  ? 'border-terracotta bg-terracotta/5 dark:bg-terracotta/10 shadow-sm'
                  : 'border-navy/10 dark:border-slate-800 hover:border-navy/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-navy/70 dark:text-slate-300">
                  {t.plusMonthlyPlanTitle || 'Monthly'}
                </span>
                {selectedPlanId === PRODUCT_ID_MONTHLY && (
                  <CheckCircle2 className="w-4 h-4 text-terracotta" />
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">
                  {t.plusMonthlyPlanPrice || '$4.99 / month'}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-navy/70 dark:text-slate-300">
                {t.plusMonthlyPlanDesc || 'Flexible month-to-month access. Cancel anytime.'}
              </p>
            </button>

            {/* Annual Option (Discounted) */}
            <button
              type="button"
              onClick={() => setSelectedPlanId(PRODUCT_ID_ANNUAL)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                selectedPlanId === PRODUCT_ID_ANNUAL
                  ? 'border-terracotta bg-terracotta/5 dark:bg-terracotta/10 shadow-sm'
                  : 'border-navy/10 dark:border-slate-800 hover:border-navy/20'
              }`}
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white font-mono text-[9px] font-bold rounded-full">
                {t.plusSave33Percent || 'SAVE 33%'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-navy/70 dark:text-slate-300">
                  {t.plusAnnualPlanTitle || 'Annual'}
                </span>
                {selectedPlanId === PRODUCT_ID_ANNUAL && (
                  <CheckCircle2 className="w-4 h-4 text-terracotta" />
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-burgundy dark:text-rose-400">
                  {t.plusAnnualPlanPrice || '$39.99 / year'}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-navy/70 dark:text-slate-300">
                {t.plusAnnualPlanDesc || 'Just $3.33/mo billed annually. Best value for serious learners.'}
              </p>
            </button>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isSubmitting}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-terracotta to-burgundy hover:from-terracotta-dark hover:to-burgundy-dark text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.plusProcessingCheckout || 'Processing...'}</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 fill-current" />
                <span>{t.plusSubscribeBtn || 'Subscribe'}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Active Subscriber Controls */
        <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-serif font-bold text-navy dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {t.plusManageTitle || 'Subscription Management'}
          </h3>

          <p className="text-xs text-navy/70 dark:text-slate-300 leading-relaxed">
            {t.plusManageDesc || 'Your Campus Plus subscription is managed securely. You can view billing history or update payment methods anytime.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={openPlayStoreSubscriptions}
              className="py-2.5 px-4 bg-navy dark:bg-slate-800 hover:bg-navy-dark text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.plusManageBtn || 'Manage Subscription'}</span>
            </button>

            <button
              onClick={cancelCampusPlus}
              className="py-2.5 px-4 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <span>{t.plusCancelBtn || 'Cancel Subscription'}</span>
            </button>
          </div>
        </div>
      )}

      {/* One-Time "Remove Ads Forever" Option */}
      <div className="bg-white dark:bg-slate-900 border border-navy/10 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-serif font-bold text-navy dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta" />
              {t.plusRemoveAdsTitle || 'Just want ads gone?'}
            </h3>
            <p className="text-xs text-navy/70 dark:text-slate-300 mt-0.5">
              {t.plusRemoveAdsSubtitle || 'One-time purchase, no subscription.'}
            </p>
          </div>
          <span className="text-lg font-serif font-bold text-burgundy dark:text-rose-400">
            {t.plusRemoveAdsPrice || '$2.99'}
          </span>
        </div>

        <p className="text-[11px] text-navy/70 dark:text-slate-300 leading-relaxed">
          {t.plusRemoveAdsDesc || 'Permanently remove all advertisements from Campus with a single payment. No recurring fees, no expiration.'}
        </p>

        {isCampusPlus ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.plusRemoveAdsSubscribedNotice || 'Ads are already removed with your Campus Plus subscription.'}</span>
          </div>
        ) : hasRemovedAds ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.plusRemoveAdsOwned || '✓ Ad-Free Unlocked Forever'}</span>
          </div>
        ) : (
          <button
            onClick={handleBuyRemoveAds}
            disabled={isBuyingRemoveAds}
            className="w-full sm:w-auto py-2.5 px-5 bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isBuyingRemoveAds ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.plusRemoveAdsProcessing || 'Processing...'}</span>
              </>
            ) : (
              <span>{t.plusRemoveAdsBtn || 'Buy'}</span>
            )}
          </button>
        )}
      </div>

      {/* Web Preview Sandbox Testing Panel (Dev Admin Mode Only) */}
      {isAdmin && (
        <div className="p-4 bg-amber-500/5 dark:bg-slate-800/40 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> {t.plusSandboxTitle || 'Web Sandbox / Developer Test Mode'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSandboxRemoveAds}
                className="px-2.5 py-1 bg-terracotta text-white font-bold text-[10px] rounded-lg hover:bg-terracotta-dark transition-colors cursor-pointer"
              >
                {hasRemovedAds ? (t.plusResetRemoveAdsBtn || 'Reset Ad Removal') : (t.plusGrantRemoveAdsBtn || 'Grant Ad Removal')}
              </button>
              <button
                onClick={toggleSandboxSubscription}
                className="px-2.5 py-1 bg-amber-500 text-white font-bold text-[10px] rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
              >
                {isCampusPlus ? (t.plusSwitchFreeBtn || 'Switch to Free Tier') : (t.plusGrantPlusBtn || 'Grant Campus Plus')}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-navy/60 dark:text-slate-400 leading-snug">
            {t.plusSandboxDesc || 'Test free tier, Campus Plus, and one-time ad removal directly in web browser previews.'}
          </p>
        </div>
      )}

    </div>
  );
};

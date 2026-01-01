import { openDB, IDBPDatabase } from 'idb';

interface AttemptValue {
  id: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  timestamp: number;
  synced: boolean;
}

interface QuestionValue {
  id: string;
  subject: string;
  topic: string;
  questionText: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  difficulty: number;
  svgData: string | null;
}

interface SyncQueueValue {
  id: string;
  action: 'insert' | 'update' | 'delete';
  table: string;
  data: unknown;
  timestamp: number;
}

interface DailyGoalValue {
  id: string;
  date: string;
  target: number;
  completed: number;
  type: 'questions' | 'minutes';
}

interface StreakValue {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

let db: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (db) return db;
  
  db = await openDB('navodaya-exam', 2, {
    upgrade(database, oldVersion) {
      if (oldVersion < 1) {
        const attemptsStore = database.createObjectStore('attempts', { keyPath: 'id' });
        attemptsStore.createIndex('by-synced', 'synced');
        attemptsStore.createIndex('by-question', 'questionId');
        database.createObjectStore('questions', { keyPath: 'id' });
        database.createObjectStore('syncQueue', { keyPath: 'id' });
      }
      if (oldVersion < 2) {
        if (!database.objectStoreNames.contains('dailyGoal')) {
          database.createObjectStore('dailyGoal', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('streak')) {
          database.createObjectStore('streak', { keyPath: 'id' });
        }
      }
    },
  });
  
  return db;
}

export async function saveAttempt(attempt: AttemptValue): Promise<void> {
  const database = await initDB();
  await database.put('attempts', attempt);
}

export async function getAttempts(): Promise<AttemptValue[]> {
  const database = await initDB();
  return database.getAll('attempts');
}

export async function getUnsyncedAttempts(): Promise<AttemptValue[]> {
  const database = await initDB();
  const all = await database.getAll('attempts');
  return (all as AttemptValue[]).filter(a => !a.synced);
}

export async function markAttemptSynced(id: string): Promise<void> {
  const database = await initDB();
  const attempt = await database.get('attempts', id) as AttemptValue | undefined;
  if (attempt) {
    attempt.synced = true;
    await database.put('attempts', attempt);
  }
}

export async function saveQuestions(questions: QuestionValue[]): Promise<void> {
  const database = await initDB();
  const tx = database.transaction('questions', 'readwrite');
  await Promise.all([
    ...questions.map(q => tx.store.put(q)),
    tx.done,
  ]);
}

export async function getQuestions(): Promise<QuestionValue[]> {
  const database = await initDB();
  return database.getAll('questions') as Promise<QuestionValue[]>;
}

export async function addToSyncQueue(item: Omit<SyncQueueValue, 'id' | 'timestamp'>): Promise<void> {
  const database = await initDB();
  await database.put('syncQueue', {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
}

export async function getSyncQueue(): Promise<SyncQueueValue[]> {
  const database = await initDB();
  return database.getAll('syncQueue') as Promise<SyncQueueValue[]>;
}

export async function clearSyncQueue(): Promise<void> {
  const database = await initDB();
  await database.clear('syncQueue');
}

export async function saveDailyGoal(goal: DailyGoalValue): Promise<void> {
  const database = await initDB();
  await database.put('dailyGoal', goal);
}

export async function getDailyGoal(date: string): Promise<DailyGoalValue | undefined> {
  const database = await initDB();
  return database.get('dailyGoal', date) as Promise<DailyGoalValue | undefined>;
}

export async function saveStreak(streak: StreakValue): Promise<void> {
  const database = await initDB();
  await database.put('streak', streak);
}

export async function getStreak(): Promise<StreakValue | undefined> {
  const database = await initDB();
  const all = await database.getAll('streak') as StreakValue[];
  return all[0];
}

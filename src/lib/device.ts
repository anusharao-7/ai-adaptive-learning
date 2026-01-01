import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'navodaya_device_id';
const NICKNAME_KEY = 'navodaya_nickname';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function getNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) || `Student_${getDeviceId().slice(0, 6)}`;
}

export function setNickname(nickname: string): void {
  localStorage.setItem(NICKNAME_KEY, nickname);
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getDifficultyLabel(level: number): string {
  const labels: Record<number, string> = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Very Hard',
    5: 'Expert',
  };
  return labels[level] || 'Unknown';
}

export function getDifficultyColor(level: number): string {
  const colors: Record<number, string> = {
    1: 'text-success',
    2: 'text-info',
    3: 'text-warning',
    4: 'text-accent',
    5: 'text-destructive',
  };
  return colors[level] || 'text-muted-foreground';
}

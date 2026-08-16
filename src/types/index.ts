export type TimePeriodId =
  | 'dawn'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'heavy-rain'
  | 'golden-hour'
  | 'evening'
  | 'night'
  | 'deep-night';

export interface TimePeriod {
  id: TimePeriodId;
  name: string;
  hindiName: string;
  tagline: string;
  startHour: number;
  endHour: number;
  bgImage: string;
  bgImages?: string[];
  skyGradient: string;
  skyColorTop: string;
  skyColorBottom: string;
  roomLightLevel: number; // 0 (dark) to 1 (bright daylight)
  lampGlowIntensity: number; // 0 to 1
  rainIntensity: number; // 0 to 1
  windSpeed: number; // -1 (left) to 1 (right)
  lightningChance: number; // 0 to 1
  trafficActivity: number; // 0 to 1
  description: string;
}

export interface Song {
  id: string;
  title: string;
  titleHi?: string;
  artist: string;
  film?: string;
  year?: number;
  youtubeId: string;
  thumbnailUrl: string;
  spotifyUrl?: string;
  youtubeMusicUrl?: string;
  durationSeconds: number;
  programId: string;
  mood: string;
  blurb?: string;
  blurbHi?: string;
}

export interface RadioProgram {
  id: string;
  title: string;
  titleHi: string;
  timeRange: string;
  frequency: string;
  hostName: string;
  tagline: string;
  description: string;
}

export interface AmbientSettings {
  masterVolume: number;
  musicVolume: number;
  rainVolume: number;
  trafficVolume: number;
  roomVolume: number;
  thunderVolume: number;
  isMuted: boolean;
}

export interface NotebookEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  titleHi: string;
  city: string;
  content: string;
  contentHi: string;
  author: string;
}

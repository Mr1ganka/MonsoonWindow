import { TimePeriod, TimePeriodId, RadioProgram } from '@/types';
import { getScenesForLocation, TIME_PERIODS } from '@/data/scenes';
import { RADIO_PROGRAMS } from '@/data/programs';
import { SONGS_DATABASE } from '@/data/songs';

export function getTimePeriodForHour(hourDecimal: number, location?: string): TimePeriod {
  const scenes = getScenesForLocation(location);
  let period: TimePeriod | undefined;
  if (hourDecimal >= 5 && hourDecimal < 7) {
    period = scenes['dawn'];
  } else if (hourDecimal >= 7 && hourDecimal < 10.5) {
    period = scenes['morning'];
  } else if (hourDecimal >= 10.5 && hourDecimal < 13.5) {
    period = scenes['midday'];
  } else if (hourDecimal >= 13.5 && hourDecimal < 16.5) {
    period = scenes['afternoon'];
  } else if (hourDecimal >= 16.5 && hourDecimal < 18.5) {
    period = scenes['golden-hour'];
  } else if (hourDecimal >= 18.5 && hourDecimal < 21.5) {
    period = scenes['evening'];
  } else if (hourDecimal >= 21.5 || hourDecimal < 1) {
    period = scenes['night'];
  } else {
    period = scenes['deep-night'];
  }

  return period || scenes['morning'] || Object.values(scenes)[0];
}

export function getProgramForPeriod(periodId: string): RadioProgram {
  switch (periodId) {
    case 'dawn':
      return RADIO_PROGRAMS[0]; // Baarish Ki Subah
    case 'morning':
      return RADIO_PROGRAMS[1]; // Chai & Clouds
    case 'midday':
    case 'afternoon':
    case 'heavy-rain':
      return RADIO_PROGRAMS[2]; // Dopahar Ki Baarish
    case 'golden-hour':
      return RADIO_PROGRAMS[3]; // Shaam Ka Safar
    case 'evening':
      return RADIO_PROGRAMS[4]; // Baarish After Dark
    case 'night':
    case 'deep-night':
    default:
      return RADIO_PROGRAMS[5] || RADIO_PROGRAMS[0]; // Raat Aur Sannata
  }
}

export function getCurrentTimeData(overrideHour?: number, location?: string) {
  const now = new Date();

  let hours: number;
  let minutes: number;
  let seconds: number;

  if (overrideHour !== undefined && !isNaN(overrideHour)) {
    hours = Math.floor(overrideHour) % 24;
    minutes = Math.floor((overrideHour - Math.floor(overrideHour)) * 60);
    seconds = 0;
  } else {
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();
  }

  const hourDecimal = hours + minutes / 60 + seconds / 3600;
  const currentPeriod = getTimePeriodForHour(hourDecimal, location);

  // Format 12-hour clock
  const displayHours = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedTime = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  const formattedShortTime = `${pad(displayHours)}:${pad(minutes)} ${ampm}`;

  // Find matching program
  let activeProgram = RADIO_PROGRAMS[0];
  if (hourDecimal >= 6 && hourDecimal < 9) {
    activeProgram = RADIO_PROGRAMS[0]; // Baarish Ki Subah
  } else if (hourDecimal >= 9 && hourDecimal < 12) {
    activeProgram = RADIO_PROGRAMS[1]; // Chai & Clouds
  } else if (hourDecimal >= 12 && hourDecimal < 16) {
    activeProgram = RADIO_PROGRAMS[2]; // Dopahar Ki Baarish
  } else if (hourDecimal >= 16 && hourDecimal < 18.5) {
    activeProgram = RADIO_PROGRAMS[3]; // Shaam Ka Safar
  } else if (hourDecimal >= 18.5 && hourDecimal < 22) {
    activeProgram = RADIO_PROGRAMS[4]; // Baarish After Dark
  } else {
    activeProgram = RADIO_PROGRAMS[5]; // Raat Aur Sannata
  }

  if (!activeProgram) {
    activeProgram = RADIO_PROGRAMS[0];
  }

  // Songs for active program
  const programSongs = SONGS_DATABASE.filter((s) => s.programId === activeProgram.id);

  return {
    hours,
    minutes,
    seconds,
    hourDecimal,
    formattedTime,
    formattedShortTime,
    currentPeriod,
    activeProgram,
    programSongs: programSongs.length > 0 ? programSongs : SONGS_DATABASE,
  };
}

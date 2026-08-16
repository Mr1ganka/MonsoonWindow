import { AmbientSettings } from '@/types';

class MonsoonAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Gain nodes
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private trafficGain: GainNode | null = null;
  private roomGain: GainNode | null = null;
  private thunderGain: GainNode | null = null;

  // Rain filters & nodes
  private rainLowFilter: BiquadFilterNode | null = null;
  private rainHighFilter: BiquadFilterNode | null = null;

  // Active sources
  private rainSource: AudioBufferSourceNode | null = null;
  private trafficSource: AudioBufferSourceNode | null = null;
  private roomSource: AudioBufferSourceNode | null = null;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Rain Channel
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      
      this.rainLowFilter = this.ctx.createBiquadFilter();
      this.rainLowFilter.type = 'lowpass';
      this.rainLowFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);

      this.rainHighFilter = this.ctx.createBiquadFilter();
      this.rainHighFilter.type = 'highpass';
      this.rainHighFilter.frequency.setValueAtTime(150, this.ctx.currentTime);

      this.rainGain.connect(this.rainHighFilter);
      this.rainHighFilter.connect(this.rainLowFilter);
      this.rainLowFilter.connect(this.masterGain);

      // Traffic Channel
      this.trafficGain = this.ctx.createGain();
      this.trafficGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      const trafficFilter = this.ctx.createBiquadFilter();
      trafficFilter.type = 'lowpass';
      trafficFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.trafficGain.connect(trafficFilter);
      trafficFilter.connect(this.masterGain);

      // Room / Fan Hum Channel
      this.roomGain = this.ctx.createGain();
      this.roomGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      const roomFilter = this.ctx.createBiquadFilter();
      roomFilter.type = 'bandpass';
      roomFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
      roomFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);
      this.roomGain.connect(roomFilter);
      roomFilter.connect(this.masterGain);

      // Thunder Channel
      this.thunderGain = this.ctx.createGain();
      this.thunderGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.thunderGain.connect(this.masterGain);

      // Start procedural noise buffers
      this.startRainLoop();
      this.startTrafficLoop();
      this.startRoomLoop();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  private createNoiseBuffer(durationSeconds = 5, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        output[i] = white * 0.15;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      } else {
        // Brown noise
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.5;
      }
    }
    return buffer;
  }

  private startRainLoop() {
    if (!this.ctx || !this.rainGain) return;
    const buffer = this.createNoiseBuffer(6, 'pink');
    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = buffer;
    this.rainSource.loop = true;
    this.rainSource.connect(this.rainGain);
    this.rainSource.start();
  }

  private startTrafficLoop() {
    if (!this.ctx || !this.trafficGain) return;
    const buffer = this.createNoiseBuffer(8, 'brown');
    this.trafficSource = this.ctx.createBufferSource();
    this.trafficSource.buffer = buffer;
    this.trafficSource.loop = true;
    this.trafficSource.connect(this.trafficGain);
    this.trafficSource.start();
  }

  private startRoomLoop() {
    if (!this.ctx || !this.roomGain) return;
    const buffer = this.createNoiseBuffer(5, 'brown');
    this.roomSource = this.ctx.createBufferSource();
    this.roomSource.buffer = buffer;
    this.roomSource.loop = true;
    this.roomSource.connect(this.roomGain);
    this.roomSource.start();
  }

  public triggerThunder() {
    if (!this.ctx || !this.thunderGain || !this.isInitialized) return;
    try {
      const now = this.ctx.currentTime;
      const buffer = this.createNoiseBuffer(4, 'brown');
      const thunderSource = this.ctx.createBufferSource();
      thunderSource.buffer = buffer;

      const thunderFilter = this.ctx.createBiquadFilter();
      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.setValueAtTime(140, now);
      thunderFilter.frequency.exponentialRampToValueAtTime(60, now + 3.5);

      const thunderEnvelope = this.ctx.createGain();
      thunderEnvelope.gain.setValueAtTime(0.01, now);
      thunderEnvelope.gain.exponentialRampToValueAtTime(0.7, now + 0.25);
      thunderEnvelope.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      thunderSource.connect(thunderFilter);
      thunderFilter.connect(thunderEnvelope);
      thunderEnvelope.connect(this.thunderGain);

      thunderSource.start(now);
      thunderSource.stop(now + 4);
    } catch (e) {
      console.warn('Thunder trigger failed:', e);
    }
  }

  public updateSettings(settings: AmbientSettings, rainIntensity: number) {
    if (!this.ctx || !this.isInitialized) return;
    try {
      const now = this.ctx.currentTime;
      const safeIntensity = Math.max(0, Math.min(1, typeof rainIntensity === 'number' && !isNaN(rainIntensity) ? rainIntensity : 0.5));

      if (this.masterGain) {
        const targetMaster = settings.isMuted ? 0 : Math.max(0, Math.min(1, settings.masterVolume ?? 0.8));
        this.masterGain.gain.setTargetAtTime(targetMaster, now, 0.05);
      }

      if (this.rainGain) {
        const safeRainVol = Math.max(0, Math.min(1, settings.rainVolume ?? 0.8));
        const targetRain = safeRainVol * (0.3 + safeIntensity * 0.7);
        this.rainGain.gain.setTargetAtTime(targetRain, now, 0.1);
      }

      if (this.rainLowFilter) {
        // Scale frequency with intensity for heavier sound
        const freq = Math.max(200, Math.min(18000, 1200 + safeIntensity * 2800));
        this.rainLowFilter.frequency.setTargetAtTime(freq, now, 0.1);
      }

      if (this.trafficGain) {
        const targetTraffic = Math.max(0, Math.min(1, settings.trafficVolume ?? 0.6));
        this.trafficGain.gain.setTargetAtTime(targetTraffic, now, 0.1);
      }

      if (this.roomGain) {
        const targetRoom = Math.max(0, Math.min(1, settings.roomVolume ?? 0.2));
        this.roomGain.gain.setTargetAtTime(targetRoom, now, 0.1);
      }
    } catch (e) {
      console.warn('Error updating ambient audio settings:', e);
    }
  }
}

export const audioEngine = typeof window !== 'undefined' ? new MonsoonAudioEngine() : null;

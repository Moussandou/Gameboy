class AudioService {
    private context: AudioContext | null = null;
    private masterVolume: number = 0.5;

    constructor() {
        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    setMasterVolume(vol: number) {
        this.masterVolume = vol;
    }

    playButtonPress() {
        if (!this.context) return;
        if (this.context.state === 'suspended') this.context.resume();

        const t = this.context.currentTime;

        // 1. High-Pass Filtered Noise (The "Click")
        const bufferSize = this.context.sampleRate * 0.05; // 50ms buffer
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = this.context.createGain();
        noiseGain.gain.setValueAtTime(0.04 * this.masterVolume, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.context.destination);
        noise.start(t);

        // 2. Low sine thump (The "Thock")
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        gain.gain.setValueAtTime(0.03 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.start(t);
        osc.stop(t + 0.05);
    }
}

export const audioService = new AudioService();

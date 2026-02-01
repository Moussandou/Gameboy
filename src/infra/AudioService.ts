class AudioService {
    private context: AudioContext | null = null;

    constructor() {
        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    playButtonPress() {
        if (!this.context) return;

        // Resume context if suspended (browser policy)
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, this.context.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    }
}

export const audioService = new AudioService();

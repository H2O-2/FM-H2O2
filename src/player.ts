import Song from './song'

const DEFAULT_VOL: number = 0.8;
const UNIT_VOL: number = 0.01;
const AUTO_PLAY: boolean = true;

export default class Player {
    private audio: HTMLAudioElement;
    private volumeIcon: JQuery;
    private volumeSlider: JQuery;

    private curSong: Song | null = null;
    private paused: boolean = !AUTO_PLAY;
    private prevVolume: number = 0;

    constructor(audio: HTMLAudioElement) {
        this.audio = audio;
        this.volumeIcon = $('#volumeIcon');
        this.volumeSlider = $('#volumeSlider');
        if (!this.audio || !this.volumeIcon || !this.volumeSlider) {
            throw Error("Some DOM element is missing!");
        }

        this.audio.autoplay = AUTO_PLAY;
        this.audio.volume = DEFAULT_VOL;
    }

    playerIsPaused() : boolean {
        return this.paused;
    }

    setPlayerPaused(paused: boolean) : void {
        this.paused = paused;
        this.updateSongStatus();
    }

    togglePlayerPaused() : void {
        this.paused = !this.paused;
        this.updateSongStatus();
    }

    setSong(song: Song): void {
        this.curSong = song;
        this.audio.src = this.curSong.getSrc();
    }

    updateSongStatus() : void {
        if (this.paused) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }

    volumeUnitUp() : number {
        if (this.audio.volume >= 1)
            return 100

        this.audio.volume = parseFloat((this.audio.volume + UNIT_VOL).toFixed(2));
        return this.audio.volume * 100;
    }

    volumeUnitDown() : number {
        if (this.audio.volume <= 0)
            return 0

        this.audio.volume = parseFloat((this.audio.volume - UNIT_VOL).toFixed(2));
        return this.audio.volume * 100;
    }

    setVolume(volume: number): void {
        this.audio.volume = volume;
        this.prevVolume = 0;
    }

    toggleMute() : number {
        // Swap the value of this.preVolume with the current volume
        const tmp: number = this.prevVolume;
        this.prevVolume = this.audio.volume;
        this.audio.volume = tmp;

        return this.audio.volume * 100;
    }
}


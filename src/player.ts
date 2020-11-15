import Song from './song'

const DEFAULT_VOL: number = 0.8;
const UNIT_VOL: number = 0.01;
// Due to policy change on browsers, autoplay is disabled by default
const AUTOPLAY: boolean = false;

export default class Player {
    private audio: HTMLAudioElement;
    private audioPromise: Promise<void>;
    private volumeIcon: JQuery;
    private volumeSlider: JQuery;

    private curSong: Song | null = null;
    private paused: boolean = !AUTOPLAY;
    private prevVolume: number = 0;

    constructor(audio: HTMLAudioElement) {
        this.audio = audio;
        this.audio.volume = DEFAULT_VOL;

        this.volumeIcon = $('#volumeIcon');
        this.volumeSlider = $('#volumeSlider');
        if (!this.audio || !this.volumeIcon || !this.volumeSlider) {
            throw Error("Some DOM element is missing!");
        }

        this.audioPromise = AUTOPLAY ? this.audio.play() : Promise.resolve();
        if (!AUTOPLAY) this.audio.load();
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
        // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
        if (this.paused) {
            this.audioPromise .then(() => this.audio.pause())
            .catch((e) => console.log(e));
        } else {
            this.audioPromise = this.audio.play();
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


import Song from './song'

const DEFAULT_VOL: number = 0.8;
const AUTO_PLAY: boolean = true;

export default class Player {
    private audio: HTMLAudioElement;
    private volumeIcon: JQuery;
    private volumeSlider: JQuery;

    private curSong: Song | null = null;
    private paused: boolean = !AUTO_PLAY;
    private prevVolume: number = 0;

    constructor() {
        this.audio = document.getElementById('song') as HTMLAudioElement;
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
    };

    togglePlayerPaused() : void {
        this.paused = !this.paused;
        this.updateSongStatus();
    }

    setSong(song: Song): void {
        this.curSong = song;
        this.audio.src = this.curSong.songSrc;
    }

    updateSongStatus() : void {
        if (this.paused) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }

    toggleMute() : void {
        const tmp: number = this.prevVolume;
        this.prevVolume = this.audio.volume;
        this.audio.volume = tmp;
    }
}


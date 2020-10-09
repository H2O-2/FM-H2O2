import Song from './song'

export default class Player {
    private curSong: Song | null = null;
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = document.getElementById('song') as HTMLAudioElement;
        if (!this.audio) {
            throw Error("Song Element Not Found!");
        }

    }

    setSong(song: Song): void {
        this.curSong = song;
        this.updateAudio();
    }

    updateAudio(): void {
        if (!this.curSong) {
            return
        }

        this.audio.src = this.curSong.songSrc;
    }
}


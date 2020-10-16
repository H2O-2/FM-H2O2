import jsmediatags from "jsmediatags";
import { jsmediatagsError, PictureType, TagType } from "jsmediatags/types";

export default class Song {
    private songDuration: number = -1;
    private songSrc: string;
    private songTitle: string | undefined;
    private songArtist: string | undefined;
    private songAlbum: string | undefined;
    private songCover: PictureType | undefined;

    constructor(songSrc: string, updateUI: (song: Song) => void) {
        this.songSrc = songSrc;
        jsmediatags.read(this.songSrc, {
            onSuccess: (tag: TagType) => {
                this.songTitle = tag.tags.title;
                this.songArtist = tag.tags.artist;
                this.songAlbum = tag.tags.album;
                this.songCover = tag.tags.picture;
                // Update UI after song metadata is loaded
                updateUI(this);
            },
            onError: (err: jsmediatagsError) => {
                console.log("Error:", err);
            }
        })
    }

    getDuration(): number {
        return this.songDuration;
    }

    setDuration(duration: number): void {
        this.songDuration = duration;
    }

    getSrc(): string {
        return this.songSrc;
    }

    getTitle(): string {
        return this.songTitle ? this.songTitle : "";
    }

    getArtist(): string {
        return this.songArtist ? this.songArtist : "";
    }

    getAlbum(): string {
        return this.songAlbum ? this.songAlbum : "";
    }
}

import jsmediatags from "jsmediatags";
import { jsmediatagsError, PictureType, TagType } from "jsmediatags/types";

const DEFAULT_ALBUM_URL: string = "../img/noThankYou.jpg"

export default class Song {
    private songDuration: number = -1;
    private songSrc: string;
    private songTitle: string | undefined;
    private songArtist: string | undefined;
    private songAlbum: string | undefined;
    private songCoverURL: string = DEFAULT_ALBUM_URL;

    constructor(songSrc: string, updateUI: (song: Song) => void) {
        this.songSrc = songSrc;
        jsmediatags.read(this.songSrc, {
            onSuccess: (tag: TagType) => {
                this.songTitle = tag.tags.title;
                this.songArtist = tag.tags.artist;
                this.songAlbum = tag.tags.album;

                const cover: PictureType | undefined = tag.tags.picture;
                if (cover) {
                    const blob = new Blob([new Uint8Array(cover.data)], { type: cover.format });
                    this.songCoverURL = URL.createObjectURL(blob);
                }

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

    getAlbumName(): string {
        return this.songAlbum ? this.songAlbum : "";
    }

    getAlbumCover(): string {
        return this.songCoverURL;
    }

    cleanup(): void {
        URL.revokeObjectURL(this.songCoverURL);
    }
}

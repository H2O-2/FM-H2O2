import Song from './song'
import Player from './player'
import jQuery from 'jquery'
import UI from './ui';

const DEFAULT_SONG_SRC: string = "https://fm.h2o2.me/testMusic2.mp3"
// const DEFAULT_SONG_SRC: string = "http://localhost:8080/testMusic2.mp3";

jQuery(() => {
    const $window:JQuery<Window> = $(window);
    const volumeIcon:JQuery<HTMLSpanElement> = $("#volumeIcon");
    const volumeSlider: HTMLInputElement = document.getElementById("volumeSlider") as HTMLInputElement;

    UI.init($window);

    let audio: HTMLAudioElement = document.getElementById('song') as HTMLAudioElement;
    let player: Player = new Player(audio);
    let song: Song = new Song(DEFAULT_SONG_SRC, UI.updateSongInfo);

    // Set current playing song and update song duration
    player.setSong(song);
    audio.onloadedmetadata = () => {
        song.setDuration(audio.duration);
        UI.updateSongDuration(song);
    }

    /*
     * Keyboard controls:
     * Space: Play/Pause
     * Ctrl+m : Mute/Unmute
     * Up: Volume + 1
     * Shift+Up: Volume + 10
     * Down: Volume - 1
     * Shift+Down: Volume - 10
    */
    $window.on('keydown', (e: JQuery.KeyDownEvent) => {
        switch(e.key) {
            case ' ':
                player.togglePlayerPaused();
                break;
            case 'm':
                if (e.ctrlKey) UI.updateVolumeUI(player.toggleMute());
                break;
            case 'ArrowUp':
                UI.updateVolumeUI(player.volumeUnitUp());
                break;
            case 'ArrowDown':
                UI.updateVolumeUI(player.volumeUnitDown());
                break;
            default:
                // DEBUG
                console.log(e.key);
                break;
        }
    })

    /*
     * Register volume slider and key handlers.
     *
     * Specific `onmouseup` and `onkeyup` handlers * are
     * present because the span element `volumeIcon`
     * changes size when the font-awesome icon changes
     * and cause slider input to jump.
     *
     * Could be solved either by using two icons of the
     * same size or by keeping the size of the span
     * element constant
    */
    volumeSlider.oninput = (): any => {
        player.setVolume(parseInt(volumeSlider.value) / 100);
    }
    volumeSlider.onmouseup = () => {
        UI.updateVolumeUI(parseInt(volumeSlider.value));
    }
    volumeSlider.onkeyup = () => {
        UI.updateVolumeUI(parseInt(volumeSlider.value));
    }
    volumeIcon.on("click", () => {
        UI.updateVolumeUI(player.toggleMute());
    })
})

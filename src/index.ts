import Song from './song'
import Player from './player'
import jQuery from 'jquery'
import UI from './ui';

// const DEFAULT_SONG_SRC: string = "https://fm.h2o2.me/testMusic2.mp3"
const DEFAULT_SONG_SRC: string = "http://localhost:8080/testMusic2.mp3";

jQuery(() => {
    const $window:JQuery<Window> = $(window);

    UI.init($window);

    let player: Player = new Player();
    player.setSong(new Song(DEFAULT_SONG_SRC));

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
                if (e.ctrlKey) player.toggleMute();
                break;
            default:
                // DEBUG
                console.log(e.key);
                break;
        }
    })
})

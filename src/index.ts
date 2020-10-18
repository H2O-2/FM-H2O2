import Song from './song'
import Player from './player'
import jQuery from 'jquery'
import UI from './ui';

const DEFAULT_SONG_SRC: string = "https://fm.h2o2.me/testMusic.mp3"

jQuery(() => {
    const $window:JQuery<Window> = $(window);
    const volumeIcon:JQuery<HTMLSpanElement> = $("#volumeIcon");
    const volumeSlider: HTMLInputElement = document.getElementById("volumeSlider") as HTMLInputElement;

    UI.init($window);

    const progressController = $(".progressCircle").eq(0);

    const audio: HTMLAudioElement = document.getElementById('song') as HTMLAudioElement;
    const player: Player = new Player(audio);
    const song: Song = new Song(DEFAULT_SONG_SRC, UI.updateSongInfo);

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
    volumeSlider.oninput = () => {
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

    // Register audio buffering handler
    audio.addEventListener("progress", () => {
        const buffered: TimeRanges = audio.buffered;

        if (buffered.length > 0 && audio.duration)
            UI.updateBufferProgress((buffered.end(buffered.length - 1) / audio.duration) * 100);
    });

    // Register time update handler (player controller & current time update)
    const timeUpdateHandler = () =>
        UI.timeUpdate(audio.currentTime, audio.currentTime / song.getDuration(), progressController);
    audio.addEventListener('timeupdate', timeUpdateHandler);

    // Register player controller drag
    let timeAfterDrag = 0;
    progressController.on('mousedown', () => {
        // Dragging event
        $("body").on('mousemove', (e: JQuery.MouseMoveEvent) => {
            audio.removeEventListener('timeupdate', timeUpdateHandler);
            timeAfterDrag = UI.dragProgressController(e.pageX, e.pageY, song.getDuration(), progressController);
        });

        // Finish dragging
        $("body").on('mouseup', (e: JQuery.MouseUpEvent) => {
            if ($(e.target).is('#volumeControl') || $(e.target).is('#bg') || $(e.target).is('#showAlbum')) return;

            $('body').off("mousemove");
            audio.addEventListener('timeupdate', timeUpdateHandler);
            audio.currentTime = timeAfterDrag;
        });
    });

    $("#showAlbum").on("mouseenter", UI.displayAlbum);
    $("#showAlbum").on("mouseleave", UI.hideAlbum);

    $window.on("resize", () => {
        UI.resize($window);
    });

    window.onunload = () => {
        song.cleanup();
    }
})

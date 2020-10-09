import Song from './song'
import Player from './player'
import jQuery from 'jquery'

jQuery(() => {
    let player: Player = new Player();

    player.setSong(new Song("https://fm.h2o2.me/testMusic2.mp3"));
})

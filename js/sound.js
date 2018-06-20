var MOBS_VOLUME = 0.3;
var AMBIENCE_VOLUME = 0.7;

var walking_sound;

Array.prototype.choice = function () {
    return this[Math.floor(Math.random() * this.length)];
}

// https://minecraft.gamepedia.com/Category:Soundtrack
// https://minecraft.gamepedia.com/Category:Sound_effects
function initSounds() {
    walking_sound = new Audio('snd/sound.ogg');

    var xp = [new Audio('snd/xp.ogg')];
    // FIXME: XP volume doesn't working
    xp[0].volume = MOBS_VOLUME;

    var move_speed = new Audio('snd/gallop1.ogg');
    move_speed.volume = MOBS_VOLUME + 0.4;

    var chicken_hurt = new Audio('snd/chickenhurt.ogg');
    chicken_hurt.volume = MOBS_VOLUME;

    var chicken = new Audio('snd/chicken.ogg');
    chicken.volume = MOBS_VOLUME * 3.0;

    var pigdeath = new Audio('snd/pigdeath.mp3');
    pigdeath.volume = MOBS_VOLUME;

    var pig = new Audio('snd/pig.mp3');
    pig.volume = MOBS_VOLUME * 3.0;

    var cowhurt = new Audio('snd/cowhurt.ogg');
    cowhurt.volume = MOBS_VOLUME;

    var cow = new Audio('snd/cow.ogg');
    cow.volume = 1;

    sounds = {
        //"CHICKEN"
        16: [chicken_hurt, chicken], 
        //"PIG"
        17: [pigdeath, pig],
        //"COW"
        18: [cowhurt, cow],
        //"XP"
        19: xp, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        20: xp, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        21: xp, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        22: xp, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        23: [move_speed]
    };

    walking_sound.volume = AMBIENCE_VOLUME;
    walking_sound.loop = true;
}

function startSound() {
    walking_sound.play();
}

function stopSound() {
    var dead = new Audio('snd/dead.ogg');
    dead.volume = MOBS_VOLUME;

    var hurt = new Audio('snd/hurt.ogg');
    hurt.volume = MOBS_VOLUME;

    [dead, hurt].choice().play();

    walking_sound.pause();
}

function playSound(sound_id) {
    if (sound_id) {
        sound = sounds[sound_id];
        if (sound) {
            sound.choice().play();
        }
    }
}

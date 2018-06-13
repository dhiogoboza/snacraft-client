var MOBS_VOLUME = 0.3;
var AMBIENCE_VOLUME = 0.1;

var walking_sound;

Array.prototype.choice = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// https://minecraft.gamepedia.com/Category:Soundtrack
// https://minecraft.gamepedia.com/Category:Sound_effects
function initSounds() {
    walking_sound = new Audio('snd/sound.mp3');

    var xp_sound = [new Audio('snd/xp.ogg')];
    // FIXME: XP volume doesn't working
    xp_sound.volume = MOBS_VOLUME;

    var chicken_hurt = new Audio('snd/chickenhurt.ogg');
    chicken_hurt.volume = MOBS_VOLUME;

    var chicken = new Audio('snd/chicken.ogg');
    chicken.volume = MOBS_VOLUME;

    var pigdeath = new Audio('snd/pigdeath.ogg');
    pigdeath.volume = MOBS_VOLUME;

    var pig = new Audio('snd/pig.ogg');
    pig.volume = MOBS_VOLUME;

    var cowhurt = new Audio('snd/cowhurt.ogg');
    cowhurt.volume = MOBS_VOLUME;

    var cow = new Audio('snd/cow.ogg');
    cow.volume = MOBS_VOLUME * 2; // this sound volume is very low

    sounds = {
        //"CHICKEN"
        16: [chicken_hurt, chicken], 
        //"PIG"
        17: [pigdeath, pig],
        //"COW"
        18: [cowhurt, cow],
        //"XP"
        19: xp_sound, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        20: xp_sound, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        21: xp_sound, // https://minecraft.gamepedia.com/File:XP_Old.ogg
        22: xp_sound // https://minecraft.gamepedia.com/File:XP_Old.ogg
    };

    walking_sound.volume = AMBIENCE_VOLUME;
    walking_sound.loop = true;
}

function startSound() {
    walking_sound.play();
}

function stopSound() {
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

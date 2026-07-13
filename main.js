/* ===========================================
   Incremental Piece v0.3.0
   Main Game Script
=========================================== */

const game = {

    player:{

        name:"Captain Maru",

        level:1,

        exp:0,

        expNeeded:100,

        power:12,

        hp:100,

        maxHP:100,

        beli:1000,

        gems:50

    },

    enemy:{

        name:"Bandit",

        level:2,

        hp:120,

        maxHP:120,

        reward:150,

        exp:25

    },

    battleRunning:false,

    questProgress:0

};

/* ===========================================
    ELEMENTS
=========================================== */

const ui={

    beli:document.getElementById("beli"),

    gems:document.getElementById("gems"),

    power:document.getElementById("power"),

    playerHealth:document.getElementById("playerHealth"),

    enemyHealth:document.getElementById("enemyHealth"),

    playerHP:document.getElementById("playerHP"),

    enemyHP:document.getElementById("enemyHP"),

    expFill:document.getElementById("expFill"),

    expText:document.getElementById("expText"),

    playerLevel:document.getElementById("playerLevel"),

    battleLog:document.getElementById("battleLog"),

    battleBtn:document.getElementById("battleBtn"),

    claimBtn:document.getElementById("claimBtn"),

    questFill:document.getElementById("questFill"),

    questText:document.getElementById("questText")

};

/* ===========================================
    UI
=========================================== */

function updateUI(){

    ui.beli.textContent=game.player.beli;

    ui.gems.textContent=game.player.gems;

    ui.power.textContent=game.player.power;

    ui.playerHealth.textContent=
    `${game.player.hp} / ${game.player.maxHP}`;

    ui.enemyHealth.textContent=
    `${game.enemy.hp} / ${game.enemy.maxHP}`;

    ui.playerLevel.textContent=
    `Lv.${game.player.level}`;

    ui.expText.textContent=
    `${game.player.exp} / ${game.player.expNeeded}`;

    ui.playerHP.style.width=
    (game.player.hp/game.player.maxHP*100)+"%";

    ui.enemyHP.style.width=
    (game.enemy.hp/game.enemy.maxHP*100)+"%";

    ui.expFill.style.width=
    (game.player.exp/game.player.expNeeded*100)+"%";

    ui.questFill.style.width=
    (game.questProgress/10*100)+"%";

    ui.questText.textContent=
    `${game.questProgress} / 10`;

}

/* ===========================================
    SAVE
=========================================== */

function saveGame(){

    localStorage.setItem(
        "incremental_piece_save",
        JSON.stringify(game)
    );

}

function loadGame(){

    const save=localStorage.getItem(
        "incremental_piece_save"
    );

    if(save){

        Object.assign(
            game,
            JSON.parse(save)
        );

    }

}

/* ===========================================
    LOG
=========================================== */

function log(text){

    ui.battleLog.innerHTML=text;

}

/* ===========================================
    LEVEL
=========================================== */

function gainExp(amount){

    game.player.exp+=amount;

    while(game.player.exp>=game.player.expNeeded){

        game.player.exp-=game.player.expNeeded;

        game.player.level++;

        game.player.expNeeded+=50;

        game.player.maxHP+=15;

        game.player.hp=game.player.maxHP;

        game.player.power+=4;

        log("🎉 Level Up!");

    }

}

/* ===========================================
    ENEMY
=========================================== */

function respawnEnemy(){

    game.enemy.hp=game.enemy.maxHP;

    log("A new Bandit appeared.");

}

/* ===========================================
    BATTLE
=========================================== */

function battleTick(){

    if(!game.battleRunning)return;

    if(game.player.hp<=0){

        game.battleRunning=false;

        game.player.hp=game.player.maxHP;

        respawnEnemy();

        log("☠ You were defeated.");

        updateUI();

        saveGame();

        return;

    }

    const playerDamage=
    Math.floor(Math.random()*8)+
    game.player.power;

    game.enemy.hp-=playerDamage;

    if(game.enemy.hp<0)
    game.enemy.hp=0;

    log(
    `⚔ You dealt ${playerDamage} damage!`
    );

    if(game.enemy.hp<=0){

        game.player.beli+=game.enemy.reward;

        gainExp(game.enemy.exp);

        game.questProgress++;

        log(
        `🏆 Victory!<br>
        +${game.enemy.reward} Beli<br>
        +${game.enemy.exp} EXP`
        );

        respawnEnemy();

        updateUI();

        saveGame();

        return;

    }

    const enemyDamage=
    Math.floor(Math.random()*6)+4;

    game.player.hp-=enemyDamage;

    if(game.player.hp<0)
    game.player.hp=0;

    log(
    `⚔ You dealt ${playerDamage} damage.<br>
     👊 Bandit dealt ${enemyDamage} damage.`
    );

    updateUI();

    saveGame();

}

/* ===========================================
    EVENTS
=========================================== */

ui.battleBtn.onclick=()=>{

    game.battleRunning=
    !game.battleRunning;

    ui.battleBtn.textContent=
    game.battleRunning
    ? "⏸ Stop Battle"
    : "⚔ Start Battle";

};

ui.claimBtn.onclick=()=>{

    const reward=500;

    game.player.beli+=reward;

    log(`💰 Claimed ${reward} Beli!`);

    updateUI();

    saveGame();

};

/* ===========================================
    GAME LOOP
=========================================== */

loadGame();

updateUI();

setInterval(battleTick,1000);

setInterval(saveGame,5000);
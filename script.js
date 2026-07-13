let player={

level:1,

power:12,

beli:1000,

gems:50

};

function refresh(){

document.getElementById("power").textContent=player.power;

document.getElementById("beli").textContent=player.beli;

document.getElementById("gems").textContent=player.gems;

}

refresh();

document.getElementById("trainBtn").onclick=()=>{

player.power+=2;

refresh();

};

document.getElementById("claimBtn").onclick=()=>{

player.beli+=500;

refresh();

};

document.getElementById("battleBtn").onclick=()=>{

let reward=Math.floor(Math.random()*150)+50;

player.beli+=reward;

player.power++;

alert(
"Victory!\n\n+"+reward+" Beli\n+1 Power"
);

refresh();

};
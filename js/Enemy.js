import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {
    static preload(scene){
        scene.load.atlas('enemies','assets/images/enemies.png','assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anim','assets/images/enemies_anim.json');
        scene.load.audio('bear','assets/audio/bear.wav');
        scene.load.audio('wolf','assets/audio/wolf.wav');
        scene.load.audio('ent','assets/audio/wolf.wav');
    }

    constructor(data){
        let {scene,enemy} = data;
        let drops = JSON.parse(enemy.properties.find(p=>p.name=='drops').value);
        let health = enemy.properties.find(p=>p.name==='health').value;
        super({scene,x:enemy.x,y:enemy.y,texture:'enemies',frame:`${enemy.name}_idle_1`,drops,health,name:enemy.name});
    }

    update(){
        console.log('enemy updates');
    }
}
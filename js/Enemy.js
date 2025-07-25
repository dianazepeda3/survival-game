import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {
    static preload(scene){
        scene.load.atlas('enemies','assets/images/enemies.png','assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anim','assets/images/enemies_anim.json');
    }

    constructor(data){
        let {scene,enemy} = data;
        let drops = JSON.parse(enemy.propety.find(p=>p.name==='drops'.value));
        let health = enemy.propety.find(p=>p.name==='health'.value);
        super({scene,x:enemy.x,y:enemy.y,texture:'enemies',frame:'bear_idle_1',drops,health,name:enemy.name});
    }

    update(){
        console.log('enemy updates');
    }
}
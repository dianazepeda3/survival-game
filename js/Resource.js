import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {
    static preload(scene){
        scene.load.atlas('resources','assets/images/resources.png','assets/images/resources_atlas.json');
        // Load Audios
        scene.load.audio('tree','assets/audio/tree.wav');
        scene.load.audio('rock','assets/audio/rock.mp3');
        scene.load.audio('bush','assets/audio/bush.wav');
        scene.load.audio('pickup','assets/audio/pickup.wav');
        scene.load.audio('player','assets/audio/pickup.wav');
    }

    constructor(data){
        let {scene, resource} = data;     
        let drops = JSON.parse(resource.properties.find(p => p.name === 'drops').value);
        let depth = resource.properties.find(p => p.name === 'depth').value;
        super({scene,x:resource.x,y:resource.y,texture:'resources',frame:resource.type,drops,depth,health:5,name:resource.type});
       
        let yOrigin = resource.properties.find(p => p.name === "yOrigin")?.value;     
        this.y = this.y + this.height * (yOrigin - 0.5);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x,this.y,12,{isSensor:false,label:'collider'});
        this.setExistingBody(circleCollider);
        this.setStatic(true);  // to prevent it from moving
        this.setOrigin(0.5,yOrigin);      
    }       
}
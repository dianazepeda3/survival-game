import DropItem from "./DropItem.js";

export default class Resource extends Phaser.Physics.Matter.Sprite {
    static preload(scene){
        scene.load.atlas('resources','assets/images/resources.png','assets/images/resources_atlas.json');
        // Load Audios
        scene.load.audio('tree','assets/audio/tree.wav');
        scene.load.audio('rock','assets/audio/rock.mp3');
        scene.load.audio('bush','assets/audio/bush.wav');
        scene.load.audio('pickup','assets/audio/pickup.wav');
    }

    constructor(data){
        let {scene, resource} = data;
        super(scene.matter.world,resource.x,resource.y,'resources',resource.type);
        this.scene.add.existing(this);

        this.name = resource.type;
        this.health = 5;
        this.sound = this.scene.sound.add(this.name);
        this.drops = JSON.parse(resource.properties.find(p => p.name === 'drops').value);

        let yOrigin = resource.properties.find(p => p.name === "yOrigin")?.value;
        this.x += this.width/2;
        this.y -= this.height/2;
        this.y = this.y + this.height * (yOrigin - 0.5);

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x,this.y,12,{isSensor:false,label:'collider'});
        this.setExistingBody(circleCollider);
        this.setStatic(true);  // to prevent it from moving
        this.setOrigin(0.5,yOrigin);      
    }

    get dead() {
        return this.health <= 0;
    }

    hit = () => {
        if(this.sound) this.sound.play();
        this.health--;
        console.log(`Hitting:${this.name} Health:${this.health}`);

        // Drop items when is dead
        if(this.dead){
            this.drops.forEach(drop => new DropItem({scene:this.scene,x:this.x,y:this.y,frame:drop}));
        }
    }
}
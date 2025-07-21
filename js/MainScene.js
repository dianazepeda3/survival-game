import Player from "./Player.js";

// The class can be imported in other files "export default"
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload(){     
        Player.preload(this); // Preload the player assets
        // Load the tilemap and tileset
        this.load.image('titles','assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json'); 
        this.load.atlas('resources','assets/images/resources.png','assets/images/resources_atlas.json');  
    }

    create(){  
        // Create an object of the tilemap
        const map = this.make.tilemap({key: 'map'});       
        this.map = map; // store the map in the scene
        const tileset = map.addTilesetImage('RPG Nature Tileset','titles',32,32,0,0);  
        const layer1 = map.createStaticLayer('Capa de patrones 1', tileset,0,0);
        const layer2 = map.createStaticLayer('Capa de patrones 2', tileset,0,0);

        layer1.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(layer1);
        
        this.addResources();

        // create a sprite of the player using the Matter.js physics engine       
        this.player = new Player({scene:this,x:100,y:100,texture:'female',frame:'townsfolk_f_idle_1'}); 
        // Add controls
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    addResources(){
        const resources = this.map.getObjectLayer('Resources');
        resources.objects.forEach(resource => {
            let resItem = new Phaser.Physics.Matter.Sprite(this.matter.world,resource.x,resource.y,'resources',resource.type);
            let yOrigin = resource.properties.find(p => p.name === "yOrigin")?.value;
            //console.log(resItem.type);
            resItem.x += resItem.width/2;
            resItem.y -= resItem.height/2;
            resItem.y = resItem.y + resItem.height * (yOrigin - 0.5);

            const {Body, Bodies} = Phaser.Physics.Matter.Matter;
            var circleCollider = Bodies.circle(resItem.x,resItem.y,12,{isSensor:false,label:'collider'});
            
            resItem.setExistingBody(circleCollider);
            resItem.setStatic(true);  // to prevent it from moving           
            resItem.setOrigin(0.5,yOrigin);
            this.add.existing(resItem);
        })
    }
    
    update(){
        this.player.update();
    }
}
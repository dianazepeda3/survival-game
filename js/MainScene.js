import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Resource from "./Resource.js";

// The class can be imported in other files "export default"
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.enemies = [];
    }

    preload(){     
        Player.preload(this); // Preload the player assets
        Enemy.preload(this);
        Resource.preload(this);
        // Load the tilemap and tileset
        this.load.image('titles','assets/images/RPG Nature Tileset-extruded.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');         
    }

    create(){  
        // Create an object of the tilemap
        const map = this.make.tilemap({key: 'map'});       
        this.map = map; // store the map in the scene
        const tileset = map.addTilesetImage('RPG Nature Tileset','titles',32,32,1,2);  
        const layer1 = map.createStaticLayer('Capa de patrones 1', tileset,0,0);
        const layer2 = map.createStaticLayer('Capa de patrones 2', tileset,0,0);

        layer1.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(layer1);
        
        // Set the elements like tree and rock
        this.map.getObjectLayer('Resources').objects.forEach(resource => new Resource({scene:this,resource}));
        this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({scene:this,enemy})));

        // create a sprite of the player using the Matter.js physics engine       
        this.player = new Player({scene:this,x:200,y:220,texture:'female',frame:'townsfolk_f_idle_1'}); 
        // Add controls
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
        let camera = this.cameras.main;
        camera.zoom = 2;
        camera.startFollow(this.player);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0,0,this.game.config.with,this.game.config.height);
    }
    
    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();
    }
}
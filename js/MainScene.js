// The class can be imported in other files "export default"
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload(){        
        console.log("preload");        
    }

    create(){  
        // create a sprite of the player using the Matter.js physics engine       
        this.player = new Phaser.Physics.Matter.Sprite(this.matter.world);
        // Add controls
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }
    
    update(){
        // Define the player movement
        const speed = 2.5;
        // Velocity vector (0,0)
        let playerVelocity = new Phaser.Math.Vector2();
        // Key and direction control
        if(this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        }else if(this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if(this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        }else if(this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize(); // normalize the vector to avoid diagonal speed increase
        playerVelocity.scale(speed); // Multiply the vector by the velocity
        // Apply the velocity vector to the player's sprite
        this.player.setVelocity(playerVelocity.x,playerVelocity.y); 
    }
}
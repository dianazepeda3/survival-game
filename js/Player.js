export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);        
    }

    static preload(scene){
        // Load the atlas for the player
        scene.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
        // Load the animations for the player
        scene.load.animation('female_anim','assets/images/female_anim.json');
    }

    get velocity(){
        return this.body.velocity;
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
        this.setVelocity(playerVelocity.x,playerVelocity.y); 

        // Play walking or idle animation for the player
        if(Math.abs(this.velocity.x) > 0.1 || (Math.abs(this.velocity.y) > 0.1)){
            this.anims.play('female_walk',true);
        }else{
            this.anims.play('female_idle',true);
        }
    }   
}
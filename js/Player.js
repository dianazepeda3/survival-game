import MatterEntity from "./MatterEntity.js";

export default class Player extends MatterEntity {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super({...data,health:20,drops:[],name:'player'});        
        this.touching = [];

        // Weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene,0,0,'items',162);
        this.spriteWeapon.setScale(0.8); // Scale the weapon sprite
        this.spriteWeapon.setOrigin(0.25,0.75); // Set the origin for the weapon sprite
        this.scene.add.existing(this.spriteWeapon);
        
        const{Body, Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x,this.y,12,{isSensor:false, label:'playerCollider'})
        let playerSensor = Bodies.circle(this.x,this.y,24,{isSensor:true, label:'playerSensor'})
        const compundBody = Body.create({
            parts:[playerCollider, playerSensor],
            frictionAir: 0.35,            
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.CreateMiningCollisions(playerSensor);
        this.CreatePickupCollisions(playerCollider);
        // Change the position of the player left or right depending on the pointer position
        this.scene.input.on('pointermove',pointer => { if(!this.dead) this.setFlipX(pointer.worldX < this.x) });
    }

    static preload(scene){
        // Load the atlas for the player
        scene.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
        // Load the animations for the player
        scene.load.animation('female_anim','assets/images/female_anim.json');
        scene.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
    } 

    onDeath = () => {
        this.anims.stop();
        this.setTexture('items',0);
        this.setOrigin(0.5);
        this.spriteWeapon.destroy();
    };

    update(){  
        if(this.dead) return;
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

        // Set the weapon position to follow the player
        this.spriteWeapon.setPosition(this.x,this.y);
        this.weaponRotate();
    }   

    // Rotate the weapon if is clicked
    weaponRotate(){
        // Obtain the pointer position
        let pointer = this.scene.input.activePointer;
        if(pointer.isDown){
            this.weaponRotation += 6;
        }else{
            this.weaponRotation = 0;
        }
        if(this.weaponRotation > 100){
            this.whackStuff();
            this.weaponRotation = 0;
        }

        if(this.flipX){
            this.spriteWeapon.setAngle(-this.weaponRotation -90);
        }else{
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
        
    }

    CreateMiningCollisions(playerSensor){
        // matterCollision stablish collision detection
        // In contact with a object
        this.scene.matterCollision.addOnCollideStart({
            objectA:[playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                console.log(this.touching.length,other.gameObjectB.name);                
            },
            context: this.scene,
        });

        // Quit object if we go away from it
        this.scene.matterCollision.addOnCollideEnd({
            objectA:[playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                console.log(this.touching.length);     
            },
            context: this.scene,
        });
    }

    CreatePickupCollisions(playerCollider){
        this.scene.matterCollision.addOnCollideStart({
            objectA:[playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
            context: this.scene,
        });

        // Quit object if we go away from it
        this.scene.matterCollision.addOnCollideActive({
            objectA:[playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
            context: this.scene,
        });
    }

    whackStuff(){
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameObject => {
            gameObject.hit();
            if(gameObject.dead) gameObject.destroy();
        })
    }
}
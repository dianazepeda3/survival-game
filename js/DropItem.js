export default class DropItem extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,frame} = data;
        super(scene.matter.world,x,y,'items',frame);
        this.scene.add.existing(this);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        let circleCollider = Bodies.circle(this.x,this.y,10,{isSensor:false, label:'collider'});
        this.setExistingBody(circleCollider);
        this.setFrictionAir(1);
        this.setScale(0.5);
        this.sound = this.scene.sound.add('pickup');
    }

    pickup = () => {
        this.destroy();
        this.sound.play();
        return true;
    }
}
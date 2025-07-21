const config = {
    width: 512,
    height: 512,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'survival-game',
    scene:[],
    scale: {
        zoom: 2,
    },
    physics: { // Using Matter.js physics engine
        default: 'matter',
        matter: {
            debug: true,
            gravity:{y:0},
        }
    },
    plugins: { // Registering the Phaser Matter Collision Plugin
        scene:[
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    }
}

// Create a instance of Phaser.Game with the configuration
new Phaser.Game(config);
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game (config);
var platforms;
var player;
var cursors;

//Variables needed in create()
var screenLimit = window.innerWidth/2;
var speedLimit = 500;
var levelVelocity = 160;
var blockAcceleration = -50;
var blocks = [];
var blockNumber = 5;
var xblock = 800; var yblock = 150;
var speed;
var runnerMass = 1;

//Variables needed in update()
var collisionRB = [];
var newPositionX = 0;
var newPositionY;
var oldSpeed;
var oldTime = Date.now();
var score = Date.now()-oldTime;
var text;var text2; var text2prime;var text3;
var newSpeed = 0;
var gameOver = false;
var wonGame = false;
var replay;

function preload () {
    this.load.image ('background', "img/background.png");
    this.load.image ('platform', "img/platform.png");
    this.load.image ('gold', "img/gold.png");
    this.load.spritesheet ('runner', "img/runner.png", {frameWidth: 32, frameHeight: 48});
}

function create () {

    text = this.add.text(16, 16, 'Time: ', { fontSize: '32px', fill: '#000' });

    //Let us add the bacground for our game 
    this.add.image (400, 300, 'background');
    //this.add.image (400, 300, 'platform');
    //this.add.image (750, 300, 'gold').setScale (2).refreshBody ();
    //this.add.image (750, 300, 'gold');
    gold = this.physics.add.staticGroup();
    gold.create (750, 300, 'gold');

    //Create thte moving blocks
    platforms = this.physics.add.group ();
    platforms.setGravityX = blockAcceleration;
    platforms.setGravityY = 0;
    //platforms.body.acceleration.allowDrag = false;
    


    for (var i=0; i<blockNumber; i++) {
        blocks[i] = platforms.create(xblock, yblock, 'platform');
        xblock = Phaser.Math.Between(0, 2*screenLimit); 
        yblock += 100;
        speed = Phaser.Math.Between(-speedLimit, 0);
        blocks[i].setVelocityX (speed);
        blocks[i].setMaxVelocity(speedLimit, 0);
        blocks[i].body.setMass(100*runnerMass);
        blocks[i].body.setFriction(1,1);
        blocks[i].body.prev.stopVelocityOnCollide = false;
        blocks[i].body.allowDrag = false;
    }

    //Let's create the player
    player = this.physics.add.sprite(600, 0, 'runner');
    player.setBounce(0.2);
    player.body.setMass(0.001);

    this.anims.create;
    
    //Collision between player and each blocks
    //blocks.children.iterate (runner_blocks(child));

    //Config variable object to go left
    var goLeft = {
        key: 'left',
        frames: this.anims.generateFrameNumbers('runner', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    }
    this.anims.create(    {
        key: 'left',
        frames: this.anims.generateFrameNumbers('runner', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    //Config variable object to turn
    var goTurn = {
        key: 'turn',
        frames: [{key: 'runner', frame: 4}],
        frameRate: 20
    }
    this.anims.create(goTurn);

    //Config variable object to go right
    var goRight = {
        key: 'right',
        frames: this.anims.generateFrameNumbers('runner', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    }
    this.anims.create(goRight);

    //First there needs to be a collider
    //for (var i=0; i<blockNumber; i++){
    //    this.physics.add.collider (player, blocks[i]);
    //}

    //Collision between the blocks and themselves
    for (var i=0; i<blockNumber; i++){
        for (var j=0; j<blockNumber; j++){
            if (i!=j){
                this.physics.add.collider(blocks[i], blocks[j]);
            }
        }
    }

    //Create the cursor element that will handle keyboards inputs
    cursors = this.input.keyboard.createCursorKeys();

    //We need to create the text LAST so that it won't be coverred by other canvas elements
    text = this.add.text(16, 16, 'Time: 0', { fontSize: '32px', fill: '#000' });
    text2 = this.add.text(300, 16, 'You have 30 seconds to catch the star', { fontSize: '22px', fill: '#FFF000' });
    text2 = this.add.text(295, 38, 'TIP: Try to land only on the top of the blocks', { fontSize: '18px', fill: '#FFF000' });
    text3 = this.add.text(300, 300, ' ', { fontSize: '50px', fill: '#FFF000' });

    //console.log (blocks[3]);
    //console.log (player);
    console.log (text);
}

//function maintainVelocity(player, block){
 //   block.setVelocityX = block.setVelocityX;
//}
function catchGold (player, gold){
    score = Date.now()-oldTime;
    //text3.style.color = '#FFF000';
    wonGame = true;
    text3.setText ('You Win !');
    this.physics.pause();
    //alert ('Thank you for playing, Press F5 to reload the game');

}
function update () {
    score = Date.now()-oldTime;
    if (score > 25000)
        text.style.color = '#FF0000';

    if (score > 30000){
        this.physics.pause();
        player.anims.play('turn');
        text3.style.color = '#FF0000';
        if (wonGame != true)
            text3.setText ('You Lose !');
        //player.setTint(0x000);
        gameOver = true;
        //replay = confirm ("Replay?");
        //if (replay == true){
            //score = 0;      // Do not forget to reset the score
            //gameOver = false;
            //location.reload();
            //alert ('Thank you for playing, Press F5 to reload the game');
        //} else {
            //alert ('Thank you for playing !');
        //}
    }

    if (gameOver != true)
        text.setText('Time:' + score+'ms');

    //if (gameOver == true || wonGame == true)
        //alert ('Thank you for playing, Press F5 to reload the game');

    //this.physics.add.collider(gold, player);
    this.physics.add.overlap(player, gold, catchGold, null, this);
    //console.log (collisionRB);
    oldSpeed = player.body.velocity.x;  //Variable to adjust the x position after reapearing up
    if (player.y > 625){
        player.setVelocityY(0);
        player.setY(-25);
        player.setVelocityX(0);
    }
    if (player.x > -250 && player.x < 15){
        player.setX(15);
    }
    if (player.x > 825){
        player.setX(15);
    }



    for (var i=0; i<blockNumber; i++) {
        if (blocks[i].x <= -100) {
            //block.destroy();
            //newPositionX = Phaser.Math.Between(900, screenLimit+300);
            newPositionX = 950;
            newPositionY = Phaser.Math.Between(150 + 100 * i - 25, 150 + 100 * i + 25);
            //newPositionY = newPositionY;
            blocks[i].setX(newPositionX);
            blocks[i].setY(newPositionY);
            newSpeed = Phaser.Math.Between(blocks[i].body.velocity.x - 100, blocks[i].body.velocity.x + 100);
            blocks[i].setVelocityX(newSpeed);
        }
    }

    for (var i=0; i<blockNumber; i++) {
        //Function to adjust the runner's properties after collision
        //oldSpeed is the speed before collision, it should be unchanged
        //oldPos =
        oldSpeed = blocks[i].body.velocity;
        collisionRB [i]= this.physics.world.collide(player, blocks[i]);
        if (collisionRB[i]){
            player.setGravityX(blockAcceleration);
            player.setGravityY(0);
            player.setVelocityX(oldSpeed.x);
            player.setVelocityY(0);
            blocks[i].setVelocityX(oldSpeed.x);
            //blocks[i].setVelocityY(0);
        } else {
            player.setGravityX(0);
            player.setGravityY(300);
        }
    
    }

if (cursors.left.isDown){
    player.setVelocityX(-levelVelocity);
    player.anims.play('left', true);
} else if (cursors.right.isDown) {
    player.setVelocityX(levelVelocity);
    player.anims.play('right', true);
} else {
    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-2*levelVelocity);
    player.setVelocityX(0);
}

if (cursors.space.isDown){
    player.setVelocityX(0);
    player.setVelocityY(-300);
    player.setGravityY(0);
}

if (cursors.shift.isDown){
    player.setVelocityY(300);
    player.setGravityY(300);
}
}

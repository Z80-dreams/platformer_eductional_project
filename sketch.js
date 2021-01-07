// Make sure 'const' and 'class' can be used, and not parsed as reserved keyword. 


/*

The Game Project

2b - using variables

*/

var floorPos_y;
var tempGroundHeight; // To account for changes in ground height. 

// These two variables has been merged into one class. See variable x and y in class "Character" .
//var gameChar_x;
//var gameChar_y;
var scrollPos;
var scrollPosChanged;

// Used for won and game over curtain
var curtainDown;
var movementActive;
var enemyCollision;


// These two variable has been merged into one class. See variable x and y in class "Tree".
//var treePos_x;
//var treePos_y;

var canyons;
var collectables;

var mountains;
var clouds;

// Variables for controlling the movement of the character. 
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isRunning;
var isJumping;




const spriteWidth = 32;
const spriteHeight = 32;

const canvasWidth = 800;
const canvasHeight = 600;
const gravity = 1;

var objectGround;
var objectMountain;
var objectCloud;
var objectFlagPole;


// Calling the game score variable gameScore instead of game_score.
var gameScore;
var lives;

//Setting up colours, so I don't have to type the colour values every time. 

const skyColour1 = '#1f1c75';
const skyColour2 = '#19165e';
const skyColour3 = '#131146';
const skyColour4 = '#0c0b2f';
const skyColour5 = '#060617';

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//            THIS CLASS IS USED FOR DRAWING GROUND AND CANYON.            //
//                                                                         //
//                 EACH TILE IS AN OBJECT OF CLASS SPRITE.                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Ground {
    //Constructor for the ground. Sprite 1 and 2 are for dirt, sprite 3 and 4 are for grass. 
    constructor(sprite1, sprite2, sprite3, sprite4, groundHeight, widtht) {
        this.sprite1 = sprite1; //Dirt
        this.sprite2 = sprite2; //Dirt
        this.sprite3 = sprite3; //Grass
        this.sprite4 = sprite4; //Grass


        this.xSprites = (width + canvasWidth) / spriteWidth;
        this.ySprites = groundHeight;



        this.groundArray = [];



        for (let i = 0; i < this.xSprites; i++) {
            let verticalArray = [];

            for (let j = 0; j < this.ySprites; j++) {
                // Choosing different sprites next to each other, so it looks more varied. 

                if ((i + j) % 2 == 0) {
                    this.spriteType = this.sprite1;
                    // Cannot put return here, need to run more code.
                } else {
                    this.spriteType = this.sprite2;
                    // Cannot put return here, need to run more code.
                }

                let sprite = new Sprite(spriteWidth * i, canvasHeight - spriteHeight * j, this.spriteType, i, j);
                sprite.draw();
                append(verticalArray, sprite);

            }

            // Choosing different grass-sprites next to each other, so it looks more varied. 
            if (i % 2 == 0) {
                this.spriteType = this.sprite3;
            } else {
                this.spriteType = this.sprite4;
            }
            // End if-constuction.

            let sprite = new Sprite(spriteWidth * i, canvasHeight - spriteHeight * this.ySprites, this.spriteType, i, this.ySprites);
            sprite.draw();
            append(verticalArray, sprite);

            append(this.groundArray, verticalArray);

        }
    }

    redraw(x_element, y_element, newImg) {
        this.groundArray[x_element][y_element].redraw(newImg);

    }
    redrawAll() {
        for (let i = 0; i < this.groundArray.length; i++) {

            for (let j = 0; j < this.groundArray[i].length; j++) {
                this.groundArray[i][j].draw();
            }
        }
    }

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//            THIS CLASS IS USED FOR DRAWING INDIVIDUAL SPRITES.           //
//                                                                         //
//                     EACH SPRITE IS AN INDIVIDUAL OBJECT.                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

// Make a class to handle the image and position of all sprites
class Sprite {
    constructor(x, y, img, x_index, y_index) {
        this.img = img;
        this.x_pos = x;
        this.y_pos = y;


        this.xindex = x_index;
        this.yindex = y_index;

    }
    draw() {
        noStroke();
        noFill();
        image(this.img, this.x_pos, this.y_pos, spriteWidth, spriteHeight);
        rect(this.x_pos, this.y_pos, spriteWidth, spriteHeight);
    }
    move(x, y) {
        this.x_pos = x;
        this.y_pos = y;
        this.draw();
    }
    redraw(newImg) {
        this.img = newImg;
        // No drawing function here, as the new images will be drawn in the mail redraw-loop anyway. 

    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//            THIS CLASS IS USED FOR DRAWING EACH STRIPE IN SKY.           //
//                                                                         //
//                     EACH STRIPE IS A NEW OBJECT.                        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

// Class to hold a single strip of background gradient
class BackgroundGradient {
    constructor(beginning, thickness, fillColour, width) {
        this.beginning = beginning;
        this.fillColour = String(fillColour);
        this.thickness = thickness;
        this.width = width;
    }

    draw() {

        noStroke();
        fill(this.fillColour);
        rect(0, this.beginning, this.width, this.thickness);
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//               THIS CLASS IS USED FOR DRAWING GRADIENTS IN SKY.          //
//                                                                         //
//               EACH STRIPE IS AN OBJECT OF CLASS BACKGROUNDGRADIENT.     //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

// Class to hold all background gradient stripes.
class BackgroundGradients {
    constructor(numberOfStripes, colourArray, width) {
        this.stripes = [];
        this.numberOfStripes = numberOfStripes;
        this.stripeThickness = canvasHeight / ((numberOfStripes + 1) * 2);
        this.colours = colourArray;
        this.width = width;


        for (let i = 0; i < this.numberOfStripes; i++) {


            append(this.stripes, new BackgroundGradient(this.stripeThickness * i, this.stripeThickness, this.colours[i], this.width));
        }
    }
    draw() {
        for (let i = 0; i < this.numberOfStripes; i++) {
            this.stripes[i].draw();
        }

    }

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING MOUNTAINS.           //
//                                                                         //
//                     EACH MOUNTAIN IS A NEW OBJECT.                      //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Mountain {
    constructor(x_pos, y_pos, scale) {
        this.x = x_pos;
        this.y = y_pos;
        this.scale = scale;
    }
    redraw() {
        // To be changed to pixel art in future game... 
        noStroke();
        fill('#808080');
        beginShape();
        vertex(this.x, this.y + 472);
        vertex(this.x + 100, this.y + 350);
        vertex(this.x + 150, this.y + 400);
        vertex(this.x + 300, this.y + 150);
        vertex(this.x + 400, this.y + 250);
        vertex(this.x + 500, this.y + 472);
        endShape(CLOSE);

        fill('#FFFFFF');
        beginShape();
        vertex(this.x + 100, this.y + 350);
        vertex(this.x + 65, this.y + 393);
        curveVertex(this.x + 80, this.y + 400);
        curveVertex(this.x + 120, this.y + 380);
        vertex(this.x + 140, this.y + 390);
        endShape(CLOSE);

        fill('#FFFFFF');
        beginShape();
        vertex(this.x + 300, this.y + 150);
        vertex(this.x + 250, this.y + 233);
        curveVertex(this.x + 300, this.y + 210);
        curveVertex(this.x + 330, this.y + 230);
        vertex(this.x + 350, this.y + 200);
        endShape(CLOSE);

    }

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING CLOUDS.              //
//                                                                         //
//                     EACH CLOUD IS A NEW OBJECT.                         //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Cloud {
    constructor(x_pos, y_pos, scale) {
        this.x = x_pos;
        this.y = y_pos;
        this.scale = scale;

    }
    redraw() {
        // To be changed to pixel art later... 
        noStroke();
        fill('#FFFFFF');
        ellipse(this.x, this.y + 50, 50, 50);
        ellipse(this.x + 60, this.y + 50, 50, 50);
        ellipse(this.x + 30, this.y + 30, 50, 50);
        rect(this.x, this.y + 40, 60, 35);

        stroke(0, 0, 0);
        strokeWeight(2);
        curve(this.x, this.y + 40, this.x + 20, this.y + 60, this.x + 40, this.y + 60, this.x + 60, this.y + 40);
        line(this.x + 25, this.y + 33, this.x + 25, this.y + 40);
        line(this.x + 35, this.y + 33, this.x + 35, this.y + 40);
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING TREES.               //
//                                                                         //
//                     EACH TREE IS A NEW OBJECT.                          //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Tree {
    constructor(x_pos, y_pos, scale) {
        this.x = x_pos;
        this.y = y_pos;
        this.scale = scale;
    }
    redraw() {
        fill('#4d2600');
        rect(this.x + 50, this.y + 10, 20, 70);
        fill('#669900');
        ellipse(this.x + 30, this.y, 50, 50);
        ellipse(this.x + 90, this.y, 50, 50);
        ellipse(this.x + 45, this.y - 40, 50, 50);
        ellipse(this.x + 75, this.y - 40, 50, 50);
        fill('#449900');
        ellipse(this.x + 60, this.y - 5, 30, 30);
        ellipse(this.x + 100, this.y + 10, 20, 20);
        ellipse(this.x + 30, this.y - 40, 30, 30);
        ellipse(this.x + 75, this.y - 40, 10, 10);
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR THE ENEMY.                   //
//                                                                         //
//SEPARATE METHODS ARE USED FOR MOVEMENT AND DRAWING.                      //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Enemy {
    constructor(leftTurnPoint, rightTurnPoint, y, speed) {
        this.ltp = leftTurnPoint;
        this.rtp = rightTurnPoint;
        this.x = round(random(leftTurnPoint, rightTurnPoint));
        this.y = y;
        this.dir = 'left';
        this.speed = speed;
        this.initResetTimer = 120;
        this.currentResetTimer = 0;
        this.pointDeduction = 10;
        this.collission = false;
    }
    redrawLeft() {
        noStroke();
        fill('#d08ddc');
        ellipse(this.x + 5, this.y - 10, 10, 20);
        ellipse(this.x + 15, this.y - 10, 10, 20);
        ellipse(this.x - 5, this.y - 10, 10, 20);
        ellipse(this.x - 15, this.y - 35, 50, 50);
        ellipse(this.x + 15, this.y - 35, 50, 50);
        ellipse(this.x, this.y - 50, 60, 80);
        ellipse(this.x + 30, this.y - 50, 35, 35);
        ellipse(this.x - 30, this.y - 50, 25, 25);
        ellipse(this.x - 10, this.y - 80, 60, 50);
        fill('#000000');
        ellipse(this.x - 25, this.y - 90, 5, 5);

        //ellipse();
    }
    redrawRight() {
        noStroke();
        fill('#d08ddc');
        ellipse(this.x - 5, this.y - 10, 10, 20);
        ellipse(this.x - 15, this.y - 10, 10, 20);
        ellipse(this.x + 5, this.y - 10, 10, 20);
        ellipse(this.x - 15, this.y - 35, 50, 50);
        ellipse(this.x + 15, this.y - 35, 50, 50);
        ellipse(this.x, this.y - 50, 60, 80);
        ellipse(this.x - 30, this.y - 50, 35, 35);
        ellipse(this.x + 30, this.y - 50, 25, 25);
        ellipse(this.x + 10, this.y - 80, 60, 50);
        fill('#000000');
        ellipse(this.x + 25, this.y - 90, 5, 5);

    }
    update() {
        if (this.x <= this.ltp) {
            this.dir = 'right';
        } else if (this.x >= this.rtp) {
            this.dir = 'left';
        }

        if (this.dir == 'left') {
            this.x -= this.speed;
            this.redrawLeft();
        } else {
            this.x += this.speed;
            this.redrawRight();
        }
    }
    checkCollission() {

        if (dist(objectCharacter.x - scrollPos, (objectCharacter.y + 125), this.x, this.y) < 50 && this.currentResetTimer <= 0 && enemyCollision == false) {
            enemyCollision = true; //To prevent that another enemy is also attacking while recovering, a global variable is then used. 
            this.collission = true; //To control the countdown of current enemy.
            this.currentResetTimer = this.initResetTimer;



            if (gameSound.soundOn == true) {
                enemyGetYourHands.setVolume(0.9);
                enemyGetYourHands.play();
            }
            collectablesScore.increase(-this.pointDeduction);
        }



        if (enemyCollision == true && this.collission == true) {

            this.currentResetTimer--;
            if (this.currentResetTimer <= 0) {
                enemyCollision = false;
                this.collission = false;

            }

            textSize(16);
            fill(255, 255, 255);
            text("- " + this.pointDeduction + " points!", this.x, round(3 * this.currentResetTimer + 200));

        }






    }

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING CHARACTER.           //
//                                                                         //
//SEPARATE METHODS ARE USED FOR MOVEMENT AND DRAWING FROM DIFFERENT ANGLES.//
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Character {
    constructor(x_pos, y_pos, scale, walkingSpeed, runningSpeed) {
        this.x = x_pos;
        this.y = y_pos;
        this.scale = scale;
        this.ws = walkingSpeed;
        this.rs = runningSpeed;
        this.ySpeed = 0;


    }
    redrawFront() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 35, this.y + 100, 20, 20);

        fill('#0033cc');
        rect(this.x + 35, this.y + 120, 20, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 30, this.y + 68, 10, 15);
        ellipse(this.x + 60, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 48, 36);
        fill('#ffcc99');
        ellipse(this.x + 45, this.y + 90, 36, 24);
        strokeWeight(5);
        point(this.x + 40, this.y + 85);
        point(this.x + 50, this.y + 85);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 35, this.y + 85);
        curveVertex(this.x + 40, this.y + 95);
        curveVertex(this.x + 50, this.y + 95);
        curveVertex(this.x + 55, this.y + 85);
        endShape();
        pop();
        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 65, this.y + 105,
            this.x + 35, this.y + 105,
            this.x + 25, this.y + 120,
            this.x + 25, this.y + 150);
        //Right Arm
        curve(this.x + 25, this.y + 105,
            this.x + 55, this.y + 105,
            this.x + 65, this.y + 120,
            this.x + 65, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 35, this.y + 139,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 55, this.y + 139,
            this.x + 60, this.y + 170);
        pop();

    }
    redrawLeft() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 35, this.y + 100, 15, 20);

        fill('#0033cc');
        rect(this.x + 35, this.y + 120, 15, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 40, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 38, 36);
        fill('#ffcc99');
        arc(this.x + 27, this.y + 90, 24, 24, -PI / 2, PI / 3);
        strokeWeight(5);
        point(this.x + 30, this.y + 85);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 20, this.y + 85);
        curveVertex(this.x + 30, this.y + 95);
        curveVertex(this.x + 33, this.y + 95);
        curveVertex(this.x + 55, this.y + 85);
        endShape();
        pop();
        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 45, this.y + 105,
            this.x + 45, this.y + 105,
            this.x + 30, this.y + 120,
            this.x + 30, this.y + 150);
        //Right Arm
        curve(this.x + 45, this.y + 105,
            this.x + 52, this.y + 115,
            this.x + 55, this.y + 120,
            this.x + 55, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 35, this.y + 139,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 55, this.y + 139,
            this.x + 60, this.y + 170);
        pop();
    }
    redrawRight() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 40, this.y + 100, 15, 20);

        fill('#0033cc');
        rect(this.x + 40, this.y + 120, 15, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 50, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 38, 36);
        fill('#ffcc99');
        arc(this.x + 63, this.y + 90, 24, 24, 2 * PI / 3, -PI / 2);
        strokeWeight(5);
        point(this.x + 60, this.y + 85);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 70, this.y + 85);
        curveVertex(this.x + 60, this.y + 95);
        curveVertex(this.x + 57, this.y + 95);
        curveVertex(this.x + 35, this.y + 85);
        endShape();
        pop();
        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 45, this.y + 105,
            this.x + 45, this.y + 105,
            this.x + 30, this.y + 120,
            this.x + 30, this.y + 150);
        //Right Arm
        curve(this.x + 50, this.y + 105,
            this.x + 57, this.y + 115,
            this.x + 60, this.y + 120,
            this.x + 60, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 35, this.y + 139,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 55, this.y + 139,
            this.x + 60, this.y + 170);
        pop();
    }
    redrawJumpFront() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 35, this.y + 100, 20, 20);

        fill('#0033cc');
        rect(this.x + 35, this.y + 120, 20, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 30, this.y + 68, 10, 15);
        ellipse(this.x + 60, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 48, 36);
        fill('#ffcc99');
        ellipse(this.x + 45, this.y + 80, 36, 24);
        strokeWeight(5);
        point(this.x + 40, this.y + 75);
        point(this.x + 50, this.y + 75);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 35, this.y + 75);
        curveVertex(this.x + 40, this.y + 85);
        curveVertex(this.x + 50, this.y + 85);
        curveVertex(this.x + 55, this.y + 75);
        endShape();
        pop();

        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 65, this.y + 105,
            this.x + 35, this.y + 105,
            this.x + 25, this.y + 80,
            this.x + 25, this.y + 50);
        //Right Arm
        curve(this.x + 25, this.y + 105,
            this.x + 55, this.y + 105,
            this.x + 65, this.y + 120,
            this.x + 65, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 40, this.y + 139,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 65, this.y + 125,
            this.x + 60, this.y + 170);
        pop();
    }
    redrawJumpLeft() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 35, this.y + 100, 15, 20);

        fill('#0033cc');
        rect(this.x + 35, this.y + 120, 15, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 50, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 38, 36);
        fill('#ffcc99');
        arc(this.x + 27, this.y + 81, 24, 24, -PI / 3, PI / 2);
        strokeWeight(5);
        point(this.x + 32, this.y + 76);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 17, this.y + 76);
        curveVertex(this.x + 27, this.y + 86);
        curveVertex(this.x + 30, this.y + 86);
        curveVertex(this.x + 52, this.y + 76);
        endShape();
        pop();
        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 45, this.y + 105,
            this.x + 45, this.y + 105,
            this.x + 30, this.y + 80,
            this.x + 30, this.y + 50);
        //Right Arm
        curve(this.x + 45, this.y + 105,
            this.x + 52, this.y + 115,
            this.x + 55, this.y + 120,
            this.x + 55, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 25, this.y + 125,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 55, this.y + 139,
            this.x + 60, this.y + 170);
        pop();
    }
    redrawJumpRight() {
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        //body
        fill('#3366ff');
        rect(this.x + 40, this.y + 100, 15, 20);
        fill('#0033cc');
        rect(this.x + 40, this.y + 120, 15, 10);
        //head
        fill(255, 255, 255);
        ellipse(this.x + 40, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 68, 10, 15);
        ellipse(this.x + 45, this.y + 85, 38, 36);
        fill('#ffcc99');
        arc(this.x + 63, this.y + 81, 24, 24, PI / 2, -2 * PI / 3);
        strokeWeight(5);
        point(this.x + 58, this.y + 76);
        strokeWeight(2);
        beginShape();
        curveVertex(this.x + 73, this.y + 76);
        curveVertex(this.x + 63, this.y + 86);
        curveVertex(this.x + 60, this.y + 86);
        curveVertex(this.x + 38, this.y + 76);
        endShape();
        pop();
        push();
        stroke('#ffcc99')
        strokeWeight(3);
        noFill();
        //Left Arm
        curve(this.x + 45, this.y + 105,
            this.x + 45, this.y + 105,
            this.x + 60, this.y + 80,
            this.x + 60, this.y + 50);
        //Right Arm
        curve(this.x + 46, this.y + 105,
            this.x + 39, this.y + 115,
            this.x + 36, this.y + 120,
            this.x + 36, this.y + 150);
        //Left Leg
        stroke('#0033cc')
        curve(this.x + 45, this.y + 120,
            this.x + 40, this.y + 130,
            this.x + 35, this.y + 139,
            this.x + 30, this.y + 170);
        //Right Leg
        curve(this.x + 45, this.y + 120,
            this.x + 50, this.y + 130,
            this.x + 65, this.y + 125,
            this.x + 60, this.y + 170);
        pop();
    }
    new_position() {

        this.y = this.y + this.ySpeed;
        this.ySpeed = this.ySpeed + gravity;



    }
    walk(direction) {
        if (direction == "left") {
            this.x = this.x - this.ws;
            this.new_position();
        } else if (direction == "right") {
            this.x = this.x + this.ws;
            this.new_position();
        }
    }
    run(direction) {
        if (direction == "left") {
            this.x = this.x - this.rs;
            this.new_position();
        } else if (direction == "right") {
            this.x = this.x + this.rs
            this.new_position();
        }
    }


}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING HEARTS.              //
//                                                                         //
//              METHODS ARE USED TO KEEP TRACK OF NUMBER OF LIVES.         //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class LivesCounter {
    constructor(numberOfLives, filledHeart, emptyHeart) {
        this.startLives = numberOfLives;
        this.currentLives = numberOfLives;
        this.filledHeart = filledHeart;
        this.emptyHeart = emptyHeart;
    }
    redraw() {
        for (var i = 0; i < this.startLives; i++) {
            if (i < this.currentLives) {
                image(this.filledHeart, (10 + i * spriteWidth), 10, spriteWidth, spriteHeight);
            } else {
                image(this.emptyHeart, (10 + i * spriteWidth), 10, spriteWidth, spriteHeight);
            }
        }
    }
    loseLife() {
        this.currentLives -= 1;

    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR COUNTING SCORES.             //
//                                                                         //
//              METHODS ARE USED TO KEEP TRACK OF NUMBER OF SCORES.        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class ScoreCounter {
    constructor(initValue) {
        this.score = initValue;
    }
    increase(value) {
        this.score += value;
    }
    redraw() {
        textSize(16);
        fill(255, 255, 255);
        text("Score: " + this.score, width - 200, 50);
    }

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR CONTROLLING THE FLAG POLE.   //
//                                                                         //
//              METHODS ARE USED TO KEEP TRACK OF FLAG STATE.              //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class FlagPole {
    constructor(x_pos) {
        this.x = x_pos;
        this.poleHeight = 200;
        this.isReached = false;
        this.flagW = 50;
        this.flagH = 25;
        this.flagCol = '#2ec61d';
        this.isRaised = false;
        this.flagPos = floorPos_y - this.flagH;
        this.raiseSpeed = 10;
    }
    checkIfFound(CharXPos) {
        if (CharXPos - scrollPos >= this.x) {
            this.isReached = true;
        }

    }
    redraw() {
        stroke(0);
        strokeWeight(4);
        line(this.x, floorPos_y, this.x, floorPos_y - this.poleHeight);


        noStroke();
        fill(this.flagCol);
        rect(this.x, this.flagPos, this.flagW, this.flagH);

        if (this.isReached && this.isRaised) {
            this.flagPos = floorPos_y - this.poleHeight - this.flagH;
            curtain("won");
        } else if (this.isReached && this.isRaised == false) {

            this.flagPos -= this.raiseSpeed;

            if (this.flagPos < (floorPos_y - this.poleHeight - this.flagH)) {
                this.isRaised = true;
            }
        } else {
            this.flagPos = floorPos_y - this.flagH;
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR CONTROLLING THE AUDIO.       //
//                                                                         //
//              METHODS ARE USED TO KEEP TRACK OF PAUSE STATE.             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class SoundControls {
    constructor(musicFile) {
        this.soundOn = false;
        this.x = width - spriteWidth - 20;
        this.y = 20;
        this.music = musicFile;
        this.music.setVolume(0.05);
    }
    redraw() {
        if (this.soundOn == true) {
            image(soundOn, this.x, this.y);
            if (!this.music.isPlaying()) {
                this.music.loop();
                this.music.play();
            }
        } else {
            image(soundOff, this.x, this.y);
            if (this.music.isPlaying()) {
                this.music.stop();

            }

        }
    }
    buttonClick(xPos, yPos) {

        if (xPos > this.x && xPos < this.x + spriteWidth && yPos > this.y && yPos < this.y + spriteHeight) {
            if (this.soundOn == true) {
                this.soundOn = false;
            } else {
                this.soundOn = true;
            }


        }

    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS CLASS IS USED FOR DRAWING PLATFORMS            //
//                                                                         //
//              GRASS-SPRITES ARE USED TO DRAW THE PLATFORM                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

class Platform {
    constructor(x, y, length) {
        this.x = round(x);
        this.y = round(y);
        this.len = round((length + (spriteWidth / 2)) / spriteWidth);
        this.sprites = [];
        //Put all the sprites in the array, different sprite every second time. 
        for (var i = 0; i < this.len; i++) {
            if (i % 2 == 0) {
                this.sprites.push(new Sprite(this.x + i * spriteWidth, this.y, grass1sprite, i, 0));
            } else {
                this.sprites.push(new Sprite(this.x + i * spriteWidth, this.y, grass2sprite, i, 0));
            }

        }
        //Replacing the edges with rounded sprites
        if (this.sprites.length > 0) {
            this.sprites[0].redraw(edgeLeftTopSprite);
            this.sprites[this.sprites.length - 1].redraw(edgeRightTopSprite);
        }


    }

    redraw() {
        for (var i = 0; i < this.len; i++) {
            this.sprites[i].draw();

        }

    }
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
////                                                                     ////
////                                                                     ////
////             N  O    M O R E    C L A S S E S                        ////
////                                                                     ////
////             O N L Y        F U N C T I O N S                        ////
////                                                                     ////
////                                                                     ////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function startGame() {

    curtainDown = false;
    movementActive = true;

    ground = {
        // Get how many tiles high the ground is. 
        floorPos_y_tiles: round((canvasHeight - floorPos_y) / spriteHeight), //Number of tiles high
        width: canvasWidth * 3
    };

    floorPos_y = canvasHeight - (ground.floorPos_y_tiles * spriteHeight);
    //New floorPos_y, adjusted for the discrete steps of the tiles.



    // Set speaker symbol and start sound
    gameSound = new SoundControls(backgroundMusic);

    // Set movement variables to the right initial value
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isRunning = false;
    enemyCollision = false;


    scrollPos = 0;


    //Initialize number of lives and score counter.
    collectablesScore = new ScoreCounter(0) // Start with 0 points

    //Create object for flag pole. 
    objectFlagPole = new FlagPole(1400); // 1600 pixels from the left edge.


    //Create object for canion
    canyons = [{
            x_pos: 96, // Left side start
            width: 96
        },
        {
            x_pos: 564, // Left side start
            width: 64
        }];

    //tranlate canyon.x_pos and canyon.width into which tile it affects.
    canyon_tiles = [];
    for (let i = 0; i < canyons.length; i++) {
        canyon_tiles.push({
            x_pos: round(canyons[i].x_pos / spriteWidth),
            width: round(canyons[i].width / spriteWidth)
        });
    }


    collectables = [{
            x_pos: 432,
            y_pos: 160, //Should not be in the sky! 
            size: 50,
            isFound: false,
            isRedrawn: true,
            reappearTimeout: 120,
            score: 20
        },
        {
            x_pos: 32,
            y_pos: 160, //Should not be in the sky! 
            size: 32,
            isFound: false,
            isRedrawn: true,
            reappearTimeout: 120, // How many frame updates until collectables appear again.
            score: 10
        },
        {
            x_pos: 700,
            y_pos: 160, //Should not be in the sky! 
            size: 32,
            isFound: false,
            isRedrawn: true,
            reappearTimeout: 120, // How many frame updates until collectables appear again.
            score: 10
        }];

    collectable_tiles = [];
    for (let i = 0; i < collectables.length; i++) {
        collectable_tiles.push({
            x_pos: round(collectables[i].x_pos / spriteWidth),
            y_pos: round(collectables[i].y_pos / spriteHeight),
            size: round(collectables[i].size / spriteWidth)
        });
    }


    mountains = [{
            x_pos: 300,
            y_pos: 0, //0 Meters over ground, if ground is 432.
            scale: 1.0
        },
        {
            x_pos: 700,
            y_pos: 0, //0 Meters over ground, if ground is 432.
            scale: 1.0
        }]; // I know the assienment calls for size, but I think a scale makes more sense here... 

    clouds = [{
            x_pos: 1200,
            y_pos: 150,
            scale: 1.0
        },
        {
            x_pos: 350,
            y_pos: 170,
            scale: 1.0
        },
        {
            x_pos: 750,
            y_pos: 120,
            scale: 1.0
        }]; // I know the assienment calls for size, but I think a scale makes more sense here... 

    trees_x = [3 * width / 9, 4 * width / 9, 8 * width / 9];
    tree = {
        y_pos: floorPos_y - 65,
        scale: 1.0
    };

    gameChar = {
        x_pos: 3 * width / 9,
        y_pos: floorPos_y - 125, //Compensating for the fact that the zero point for the character is not by the feet. 
        scale: 1.0,
        walking_speed: 2,
        running_speed: 5
    };


    //Making mountain
    objectMountains = [];
    for (let i = 0; i < mountains.length; i++) {

        objectMountains.push(new Mountain(mountains[i].x_pos, mountains[i].y_pos, mountains[i].scale));

    }
    //Making clouds    
    objectClouds = [];
    for (let i = 0; i < clouds.length; i++) {

        objectClouds.push(new Cloud(clouds[i].x_pos, clouds[i].y_pos, clouds[i].scale));

    }
    //Making trees
    objectTrees = [];
    for (let i = 0; i < trees_x.length; i++) {
        objectTrees.push(new Tree(trees_x[i], tree.y_pos, tree.scale));
    }

    //Making Finn, the human.      
    objectCharacter = new Character(gameChar.x_pos, gameChar.y_pos, gameChar.scale, gameChar.walking_speed, gameChar.running_speed)

    // Making some ground    
    objectGround = new Ground(rock1sprite, rock2sprite, grass1sprite, grass2sprite, ground.floorPos_y_tiles, ground.width);



    // Making Canyon
    for (let index = 0; index < canyon_tiles.length; index++) {

        for (let i = canyon_tiles[index].x_pos; i < canyon_tiles[index].x_pos + canyon_tiles[index].width; i++) {
            objectGround.redraw(i, ground.floorPos_y_tiles, edgeTopSprite);
            for (let j = ground.floorPos_y_tiles; j > 0; j--) {
                objectGround.redraw(i, j, sky5Sprite);
            }
        }
        objectGround.redraw(canyon_tiles[index].x_pos - 1, ground.floorPos_y_tiles, edgeRightTopSprite);

        objectGround.redraw(canyon_tiles[index].x_pos + canyon_tiles[index].width, ground.floorPos_y_tiles, edgeLeftTopSprite);
    }


    // Initialize variable to check if scrollPos has changed or not. 
    scrollPosChanged = false;

    //Making gradient sky
    backgroundStripes = new BackgroundGradients(4, [skyColour5, skyColour4, skyColour3, skyColour2], ground.width);


    // Making platforms
    platforms = [{
            x: 96,
            y: floorPos_y - 64,
            len: 128
        },
        {
            x: 900,
            y: floorPos_y - 96,
            len: 300
        },
        {
            x: 1200,
            y: floorPos_y - 160,
            len: 100
        }];

    platformArray = [];
    for (var i = 0; i < platforms.length; i++) {
        platformArray.push(new Platform(platforms[i].x, platforms[i].y, platforms[i].len))
    }

    // Making enemies

    enemies = [{
            leftTurn: 700,
            rightTurn: 1000,
            yPos: floorPos_y,
            speed: 2
        },
        {
            leftTurn: 1300,
            rightTurn: 1500,
            yPos: floorPos_y,
            speed: 1
        }];

    enemiesArray = [];

    for (var i = 0; i < enemies.length; i++) {
        enemiesArray.push(new Enemy(enemies[i].leftTurn, enemies[i].rightTurn, enemies[i].yPos, enemies[i].speed));
    }



}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//            THIS FUNCION IS USED TO DIM THE SCREEN AND SHOW A MESSAGE    //
//                                                                         //
//               THE USER CAN RESET THE GAME.                              //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function curtain(situationState) {


    if (situationState == "gameover") {
        fill(0, 200); //Grey
        rect(0, 0, canvasWidth, canvasHeight);
        fill(255, 255);
        textSize(64);
        text("GAME OVER!", (canvasWidth / 2 - 200), (canvasHeight / 2));
        textSize(24);
        text("DO YOU WANT TO TRY AGAIN?", (canvasWidth / 2 - 200), (canvasHeight / 2 + 100));
        curtainDown = true;
        movementActive = false;

        if (mouseX > (canvasWidth / 2 - 210) && mouseX < (canvasWidth / 2 - 140) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160)) {
            fill(64, 255, 64);

        }

        textSize(24);
        text("YES!", (canvasWidth / 2 - 200), (canvasHeight / 2 + 150));
        fill(255, 255);

        if (mouseX > (canvasWidth / 2 + 190) && mouseX < (canvasWidth / 2 + 260) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160)) {
            fill(255, 64, 64);
        }
        textSize(24);
        text("NO!", (canvasWidth / 2 + 200), (canvasHeight / 2 + 150));
    }
    if (situationState == "won") {
        push();
        translate(-scrollPos, 0);

        fill(0, 200); //Grey
        rect(0, 0, canvasWidth, canvasHeight);
        fill(255, 255);
        textSize(64);
        text("YOU WON!", (canvasWidth / 2 - 200), (canvasHeight / 2));
        textSize(24);
        text("DO YOU WANT TO TRY AGAIN?", (canvasWidth / 2 - 200), (canvasHeight / 2 + 100));
        curtainDown = true;
        movementActive = false;

        if (mouseX > (canvasWidth / 2 - 210) && mouseX < (canvasWidth / 2 - 140) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160)) {
            fill(128, 255, 128);

        }
        textSize(24);
        text("YES!", (canvasWidth / 2 - 200), (canvasHeight / 2 + 150));
        fill(255, 255);

        if (mouseX > (canvasWidth / 2 + 190) && mouseX < (canvasWidth / 2 + 260) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160)) {
            fill(255, 64, 64);
        }

        textSize(24);
        text("NO!", (canvasWidth / 2 + 200), (canvasHeight / 2 + 150));
        pop();
    }


}

function preload() {
    // Use preloader function to define all sprites, so I don't have to type the path each time.
    rock1sprite = loadImage('sprites/Sprite-0001.bmp');
    rock2sprite = loadImage('sprites/Sprite-0002.bmp');
    grass1sprite = loadImage('sprites/Sprite-0003.bmp');
    grass2sprite = loadImage('sprites/Sprite-0004.bmp');
    edgeLeftTopSprite = loadImage('sprites/Sprite-0005.bmp');
    edgeRightTopSprite = loadImage('sprites/Sprite-0006.bmp');
    edgeTopSprite = loadImage('sprites/Sprite-0007.bmp');
    chestClosedSprite = loadImage('sprites/Sprite-0008.bmp');
    sky5Sprite = loadImage('sprites/Sprite-0009.bmp');
    chestOpenedSprite = loadImage('sprites/Sprite-0010.bmp');
    filledHeart = loadImage('sprites/Sprite-0011.bmp');
    emptyHeart = loadImage('sprites/Sprite-0012.bmp');
    soundOn = loadImage('sprites/Sprite-0013.bmp');
    soundOff = loadImage('sprites/Sprite-0014.bmp');

    soundFormats('mp3', 'ogg');
    backgroundMusic = loadSound('assets/bg_music.mp3');
    characterMathematical = loadSound('assets/mathematical.ogg');
    characterHahaa = loadSound('assets/hahaa.ogg');
    enemyGetYourHands = loadSound('assets/lsp-get-your-hands-off-me.ogg');

}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//     THIS FUNCTION IS USED FOR CONTROLLING IF CHARACTER IF PLUMMETING.   //
//                                                                         //
//                     BOTH DIRECTION AND SPEED IS CHECKED.                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function checkIfPlummeting() {
    //Set plummeting to true if character is inside canyon. 
    tempGroundHeight = floorPos_y;



    for (let index = 0; index < canyons.length; index++) {

        if (((round(objectCharacter.x) + 40 - scrollPos) < ((canyons[index].x_pos) + (canyons[index].width))) && ((round(objectCharacter.x) + 40 - scrollPos) > (canyons[index].x_pos)) && objectCharacter.y + 125 >= tempGroundHeight) {
            isPlummeting = true;
            movementActive = false;
            break;

        } else if (objectCharacter.y + 120 > tempGroundHeight) {
            isPlummeting = true;
            movementActive = false;
            break;
        } else {
            isPlummeting = false;
        }
    }
    // Reset plummeting to false again, if the character if on a platform. 
    for (let index = 0; index < platformArray.length; index++) {

        if (((objectCharacter.x + 40 - scrollPos) < ((platformArray[index].x) + (platformArray[index].len * spriteWidth))) && ((objectCharacter.x + 40 - scrollPos) > (platformArray[index].x)) && objectCharacter.y + 125 <= platformArray[index].y) {
            isPlummeting = false;
            tempGroundHeight = platformArray[index].y;

        }
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//     THIS FUNCTION IS USED FOR CONTROLLING LIVES OF THE CHARACTER.       //
//                                                                         //
//                     BOTH LIVES AND CURTAIN IS CONTROLLED                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function checkPlayerDie() {
    if ((objectCharacter.y > canvasHeight * 2) && (lives.currentLives <= 1)) {
        lives.loseLife();
        curtain("gameover")
    } else if (objectCharacter.y > canvasHeight * 2) {
        lives.loseLife();
        scrollPos = 0;
        objectCharacter.y = gameChar.x_pos;
        objectCharacter.x = gameChar.y_pos;
        isPlummeting = false;
        movementActive = true;
    }
}


/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//     THIS FUNCTION IS USED FOR CONTROLLING MOVEMENT OF CHARACTER.        //
//                                                                         //
//                     BOTH DIRECTION AND SPEED IS CHECKED.                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function checkMovement() {
    // Logic to move


    if (isLeft == true && isRunning == false && isFalling == false) {
        if (objectCharacter.x > width * 0.2) {
            objectCharacter.redrawLeft();
            objectCharacter.walk("left");
        } else {
            scrollPos += objectCharacter.ws;
            objectCharacter.redrawLeft();
            objectCharacter.new_position();

        }
    } else if (isRight == true && isRunning == false && isFalling == false) {
        if (objectCharacter.x < width * 0.8) {
            objectCharacter.redrawRight();
            objectCharacter.walk("right");
        } else {
            scrollPos -= objectCharacter.ws; // negative for moving against the background
            objectCharacter.redrawRight();
            objectCharacter.new_position();

        }
    } else if (isLeft == true && isRunning == true && isFalling == false) {

        if (objectCharacter.x > width * 0.2) {
            objectCharacter.redrawLeft();
            objectCharacter.run("left");
        } else {
            scrollPos += objectCharacter.rs;
            objectCharacter.redrawLeft();
            objectCharacter.new_position();

        }
    } else if (isRight == true && isRunning == true && isFalling == false) {
        if (objectCharacter.x < width * 0.8) {
            objectCharacter.redrawRight();
            objectCharacter.run("right");
        } else {
            scrollPos -= objectCharacter.rs; // negative for moving against the background
            objectCharacter.redrawRight();
            objectCharacter.new_position();
        }
    } else if (isLeft == true && isRunning == false && isFalling == true) {
        if (objectCharacter.x > width * 0.2) {
            objectCharacter.redrawJumpLeft();
            objectCharacter.walk("left");
        } else {
            scrollPos += objectCharacter.ws;
            objectCharacter.redrawJumpLeft();
            objectCharacter.new_position();
        }
    } else if (isRight == true && isRunning == false && isFalling == true) {
        if (objectCharacter.x < width * 0.8) {
            objectCharacter.redrawJumpRight();
            objectCharacter.walk("right");
        } else {
            scrollPos -= objectCharacter.ws; // negative for moving against the background
            objectCharacter.redrawJumpRight();
            objectCharacter.new_position();
        }
    } else if (isLeft == true && isRunning == true && isFalling == true) {
        if (objectCharacter.x > width * 0.2) {
            objectCharacter.redrawJumpLeft();
            objectCharacter.run("left");
        } else {
            scrollPos += objectCharacter.rs;
            objectCharacter.redrawJumpLeft();
            objectCharacter.new_position();

        }
    } else if (isRight == true && isRunning == true && isFalling == true) {
        if (objectCharacter.x < width * 0.8) {
            objectCharacter.redrawJumpRight();
            objectCharacter.run("right");
        } else {
            scrollPos -= objectCharacter.rs; // negative for moving against the background
            objectCharacter.redrawJumpRight();
            objectCharacter.new_position();
        }
    } else if (isFalling == true) {
        objectCharacter.redrawJumpFront();
        objectCharacter.new_position();
    } else {
        objectCharacter.redrawFront();
        objectCharacter.new_position();
    }

    if (objectCharacter.y > tempGroundHeight - 125 && isPlummeting == false) {
        objectCharacter.ySpeed = 0;
        objectCharacter.y = tempGroundHeight - 125;
        isFalling = false;
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//       THIS FUNCTION CHECKS IF COLLECTABLES HAS BEEN FOUND OR NOT.       //
//           AND ASSIGN SCORES ACCORDINGLY.                                //
//       COLLECTABLES ARE RESET AFTER SOME TIME.                           //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function checkCollectables() {
    // Controlling the collectables
    for (let index = 0; index < collectable_tiles.length; index++) {
        if (dist(objectCharacter.x - scrollPos, (objectCharacter.y - 125), (collectable_tiles[index].x_pos * spriteWidth), (collectable_tiles[index].y_pos * spriteHeight)) < 40) {
            collectables[index].isFound = true;
        }


        // Controlling if the collectable is found or not, making sure that the sprite is only changed onced. 
        if (collectables[index].isFound == false && collectables[index].isRedrawn == true) {
            for (let i = 0; i < collectable_tiles[index].size; i++) {
                objectGround.redraw(collectable_tiles[index].x_pos + i, collectable_tiles[index].y_pos, chestClosedSprite);
            }

            collectables[index].isRedrawn = false; // Make sure it is only updated once. The rest of the redrawn will be handelded by the objectGround.redrawAll()-method. 

        } else if (collectables[index].isFound == true && collectables[index].isRedrawn == false) {
            for (let i = 0; i < collectable_tiles[index].size; i++) {
                objectGround.redraw(collectable_tiles[index].x_pos + i, collectable_tiles[index].y_pos, chestOpenedSprite);

            }

            collectables[index].isRedrawn = true; // Make sure it is only updated once. The rest of the redrawn will be handelded by the objectGround.redrawAll()-method. 
            collectables[index].reappearTimeout = 240; //How many frames until collectable comes back.

            collectablesScore.increase(collectables[index].score); // Update score.

            if (gameSound.soundOn) {
                characterHahaa.setVolume(0.1);
                characterHahaa.play(); //Playing sound        
            }



        } else if (collectables[index].isFound == true && collectables[index].isRedrawn == true && collectables[index].reappearTimeout > 0) {
            collectables[index].reappearTimeout -= 1;
            textSize(16);
            fill(255, 255, 255);
            text("Found!\nResetting in " + floor(collectables[index].reappearTimeout / frameRate()) + "!", collectables[index].x_pos, 500);
            text("+ " + collectables[index].score + " points!", collectables[index].x_pos, round(3 * collectables[index].reappearTimeout - 200));

        } else if (collectables[index].isFound == true && collectables[index].isRedrawn == true && collectables[index].reappearTimeout <= 0) {
            collectables[index].isFound = false;
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS IS THE SETUP FUNCTION.                         //
//                                                                         //
//                     LOTS OF VARIABLES ARE INITIALIZED HERE!             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function setup() {


    createCanvas(canvasWidth, canvasHeight);
    lives = new LivesCounter(3, filledHeart, emptyHeart); // 3 lives
    floorPos_y = 432; //NB. we are now using a variable for the floor position
    startGame();






}

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//                     THIS IS THE MAIN DRAW LOOP.                         //
//                                                                         //
//                     THIS IS WHERE THE ACTION HAPPENS.                   //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

function draw() {


    push();
    translate(scrollPos, 0);
    background(skyColour1); //fill the sky blue
    backgroundStripes.draw();


    // Loops for redrawing stuff. 
    for (let i = 0; i < objectMountains.length; i++) {
        objectMountains[i].redraw();
    }
    for (let i = 0; i < objectClouds.length; i++) {
        objectClouds[i].redraw();
    }



    objectGround.redrawAll();



    for (let i = 0; i < platformArray.length; i++)

    {
        platformArray[i].redraw();
    }
    for (var i = 0; i < enemies.length; i++) {
        enemiesArray[i].update();
        enemiesArray[i].checkCollission();
    }
    for (let i = 0; i < objectTrees.length; i++) {
        objectTrees[i].redraw();
    }

    objectFlagPole.redraw();


    checkCollectables();

    // Adding some instructions... 
    textSize(16);
    fill(255, 255, 255);
    text("Use arrow keys to control Finn.\nHold down Ctrl to run faster.\nPress spacebar to jump.\nYou need to run to cross some canyons.\nCollectable chests open instead of disappear.\nThen the chest reset.\nClick on the speaker-icon to enable sound.", 20, 60);

    //Control plummeting
    checkIfPlummeting();

    pop();





    checkPlayerDie();
    checkMovement();
    lives.redraw();
    collectablesScore.redraw();
    objectFlagPole.checkIfFound(objectCharacter.x);

    gameSound.redraw();





}

function keyPressed() {
    if (keyCode == LEFT_ARROW && movementActive) {
        isLeft = true;
        isRight = false;
    } else if (keyCode == RIGHT_ARROW && movementActive) {
        isLeft = false;
        isRight = true;
    }

    if (keyCode == CONTROL && movementActive) {
        isRunning = true;
    }
    if (keyCode == "32" && movementActive) {
        isFalling = true;
        objectCharacter.ySpeed = -15;
        if (gameSound.soundOn) {

            characterMathematical.setVolume(0.25);
            characterMathematical.play();
        }
    }

}

function keyReleased() {
    if (keyCode == LEFT_ARROW) {
        isLeft = false;
    }
    if (keyCode == RIGHT_ARROW) {
        isRight = false;
    }
    if (keyCode == CONTROL) {
        isRunning = false;
    }
}

function mousePressed() {
    if (mouseX > (canvasWidth / 2 - 210) && mouseX < (canvasWidth / 2 - 140) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160) && curtainDown == true) {
        window.location.reload(false);
    }



    if (mouseX > (canvasWidth / 2 + 190) && mouseX < (canvasWidth / 2 + 260) && mouseY > (canvasHeight / 2 + 120) && mouseY < (canvasHeight / 2 + 160) && curtainDown == true) {
        window.location.href = "https://london.ac.uk/courses/computer-science";
    }

    gameSound.buttonClick(mouseX, mouseY);

}
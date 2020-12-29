// Create variables here
var dog ,happyDog,sadDog;
var database;
var foodS,foodStock;
var feed,lastFed;
var fedTime,lastTime;
var foodObj;
var gameState,readState ;
var bedroom,garden,washroom;
var currentTime;


function preload()
{
  //load images here
  sadDog = loadImage("images/Dog.png");
  happyDog = loadImage("images/happy dog.png");
  bedroom = loadImage("images/Bed.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash.png");
}

function setup() {
  

  database = firebase.database();

  createCanvas( 400,500);

  foodObj = new Food();
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);


  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){

   lastFed=data.val();

 })

  readState = database.ref('gameState');
  readState.on("value",function(data){

    gameState=data.val();

  })

  dog = createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

 

  feed = createButton("Feed the Dog ");
  feed.position(450,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(550,95);
  addFood.mousePressed(addFoods);



}


function draw() { 
  

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

 
   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
  }

  

  drawSprites();

} 
function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);


}

function feedDog(){

  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    

  })


}

function addFoods(){

    foodS++;
    database.ref('/').update({
        Food:foodS
    })

}

function update(state){

  database.ref('/').update({
    gameState:state
  })

}







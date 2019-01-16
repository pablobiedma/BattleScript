var number = 0;
var board = null;
//new board
var board2=null;
var boats = null;
var rows = 8;
var columns=8;
var numofhits=15;
var flag=0;
var temp=0;
var temp2=0;
var turn=0;
//var playertype=null;
var sendShoot=null;
var s = new Array(2);

//AFTER BOAT SET SEND MATRIX BOARD2 THROUGH SOCKET
//RECIEVE BOARD THROUGH SOCKET

$(document).ready(function(){
  //Is there local storage left? (we save the configuration there)
  if(typeof(Storage)!=="undefined"){
    boats = JSON.parse(localStorage.getItem("boats"));

    console.log(boats);
    if(boats===null){
      boats = [
        {size:3, location:'r', coin:1},
        {size:3, location:'r', coin:1},
        {size:3, location:'r', coin:1},
        {size:3, location:'r', coin:1},
     ];
     localStorage.setItem("boats", JSON.stringify(boats));


    }
    rows = parseInt(localStorage.getItem("rows"));
    columns = parseInt(localStorage.getItem("columns"));
    if(isNaN(rows)|| isNaN(columns)){
      rows = 8;
      columns = 8;
      localStorage.setItem("rows", 8);
      localStorage.setItem("columns", 8);
    }
  }else {
    //there is no localStorage, we cannot save neither match information nor scores
    console.log("We don't have localStorage")
  }
});

var socket=new WebSocket("ws://localhost:3000");
// socket.onopen=function(){
//   alert("connected to port 3000");
//
// }


function createMatrix(row,col){
  var matrix;
  matrix = new Array(row);
  for (var i=0; i<row; i++){
    matrix[i] = new Array(col);
  }
  return matrix;
}

// function matrix2console(matrix){
//   var aux;
//   for(var i=0; i<matrix.length; i++){
//     aux = "";
//     for(var j=0; j<matrix[i].length; j++){
//       aux+=matrix[i][j]+'\t';
//     }
//     console.log(aux);
//   }
// }

function createBoardjQ(){
  $("#match").empty();
  var table = $("<table />");
  for(var i=0; i<rows; i++){
    var row = $("<tr/>");
    for(var j=0; j<columns; j++){
      var celd = $('<td id="celd_'+i+'_'+j+'"  onclick=shoot("celd_'+i+'_'+j+'",'+i+','+j+') > </td>');
      celd.addClass("water");
      row.append(celd);
    }
    table.append(row);
  }
  $("#match").append(table);
}
// mouseover=placeBoats("celd_'+i+'_'+j+'",'+i+','+j+','+3+')
//send matrix from socket
function createBoard2jQ(){
  $("#match2").empty();
  var table = $("<table />");
  for(var i=0; i<rows; i++){
    var row = $("<tr/>");
    for(var j=0; j<columns; j++){
      board2[i][j]='a';
  var celd2 = $('<td id="celd2_'+i+'_'+j+'"  onmouseover=colortile('+i+','+j+') onmouseleave=notcolortile('+i+','+j+') onclick= setBoats('+i+','+j+') </td>');
        celd2.addClass("miss");

      row.append(celd2);
    }
    table.append(row);
  }
  $("#match2").append(table);
}


function colortile(i,j){

  if(flag>4){
  return;}

  $('#'+'celd2_'+(i-1)+'_'+j+'').addClass('color');
  $('#'+'celd2_'+i+'_'+j+'').addClass('color');
  $('#'+'celd2_'+(i+1)+'_'+j+'').addClass('color');
}

function notcolortile(i,j)
{
  // if(flag>4){
  // return;}

  $('#'+'celd2_'+(i-1)+'_'+j+'').removeClass('color')
  $('#'+'celd2_'+i+'_'+j+'').removeClass('color')
  $('#'+'celd2_'+(i+1)+'_'+j+'').removeClass('color')

}
//
// function createMatch(){
//   //create a matrix row x col
//   board = createMatrix(rows,columns);
//   board2=createMatrix(rows,columns);
//   //fill matrix "a"
//   startMatrix('a',board);
//
// //  setBoats(board);
//   createBoardjQ();
//   createBoard2jQ();
//   matrix2console(board);
// }
//
// var sendBoard=Messages.O_BOARD_SETUP_A;
// sendBoard.data=board2;
// socket.send(JSON.stringify(sendBoard));

function shoot(celd, i, j){
if(turn==0)
return;
if(flag!=5)
{
  alert("set the boats first");
  return;
}
let l=0;
s[0]=i;s[1]=j;
  if(board[i][j]=='a')
  {
           $('#'+celd).removeClass('water');
           $('#'+celd).addClass('miss')
  }
    if(board[i][j]!='a')
  {
           $('#'+celd).removeClass('water');
           $('#'+celd).addClass('color2')
           numofhits--;
           if(numofhits<=0)
           {
             alert("YOU WON");
             var res= Messages.O_GAME_OVER
             res.data=s;
             socket.send(JSON.stringify(res));
             turn=0;
           }

    }
if(turn!=0)
{turn=0;
 sendShoot=Messages.O_MAKE_A_SHOOT_A
 sendShoot.data=s;
 socket.send(JSON.stringify(sendShoot));
}
}
function startMatrix(data, matrix){
  for(var i=0; i<matrix.length;i++){
    for(var j=0; j<matrix[i].length;j++){
      matrix[i][j]=data;
    }
  }
}

function coin(i,j){

   // if((j+1>7)||(j-1<0)||(board2[i][j-1]==='r')||(board2[i][j+1]==='r'))
   // return;

   if((j+1>=8)||(j-1<0)||(board2[i][j-1]==='r')||(board2[i][j+1]==='r'))
   return;

   $('#'+'celd2_'+(i-1)+'_'+j+'').removeClass('color2');
   $('#'+'celd2_'+(i+1)+'_'+j+'').removeClass('color2');
   board2[i+1][j]='a';
   board2[i-1][j]='a';
  // }
  board2[i][j]='r';
  board2[i][j+1]='r';
  board2[i][j-1]='r';

  $('#'+'celd2_'+i+'_'+(j-1)+'').addClass('color2');
  $('#'+'celd2_'+i+'_'+(j)+'').addClass('color2');
  $('#'+'celd2_'+i+'_'+(j+1)+'').addClass('color2');
  //number--


}

function Rotate()
{
    coin(temp,temp2);
    return;
}

function setBoats(i,j){

  if(flag>4){
  return;}
  // if ((i+1)>9||board2[i][j]==='r'||board2[i+1][j]==='r'||board2[i-1][j]==='r'){
  //   return;
  // }
  if((i+1>=8)||(board2[i][j]==='r')||(board2[i+1][j]==='r')||(board2[i-1][j]==='r'))
  return;
  //console.log(flag);
flag++;
temp=i;temp2=j;
  board2[i-1][j]='r';
  board2[i][j]='r';
  board2[i+1][j]='r';

   $('#'+'celd2_'+(i-1)+'_'+j+'').addClass('color2');
   $('#'+'celd2_'+i+'_'+j+'').addClass('color2');
   $('#'+'celd2_'+(i+1)+'_'+j+'').addClass('color2');
  }

function Reset()
{
  flag=0;
  for(var i=0; i<rows; i++){

    for(var j=0; j<columns; j++){
      if(board2[i][j]!='a')
      {  board2[i][j]='a';
        $('#'+'celd2_'+i+'_'+j+'').removeClass('color2');
      $('#'+'celd2_'+i+'_'+j+'').addClass('miss')
      }
    }
    }
}


function boatSet()
{
  if(flag>4){
  document.getElementById("reset").disabled = true;
  document.getElementById("rotate").disabled = true;
  flag=5;
  var sendBoard=Messages.O_BOARD_SETUP_A;
  sendBoard.data=board2;
  socket.send(JSON.stringify(sendBoard));

}
  else {
    alert("set all boats first");
  }
}

socket.onopen=function()
{
//  alert("connected to the server");
  board2= createMatrix(rows,columns);
}

socket.onmessage=function(event){
//  alert("set your ships");
  let msg=JSON.parse(event.data);

  if(msg.type==Messages.T_PLAYER_TYPE){
    playerType=msg.data;
    if(playerType=="A")
    {
      alert("waiting for player B");
    }
    else {
      let Omsg=Messages.O_READY;
      socket.send(JSON.stringify(Omsg));
    }
  }

  if(msg.type==Messages.T_READY)
  {
    createBoard2jQ();
    alert("set your ships");
  }

  if(msg.type==Messages.T_BOARD_SETUP)
  {

  //  alert("rr");
    board = createMatrix(rows,columns);
  //  startMatrix('a',board);
    createBoardjQ();
    board=msg.data;
    if(playerType=="A"){
      turn=1;
      alert("first turn");
    }
    else {
      turn=0;
    }
  }

  if(msg.type==Messages.T_MAKE_A_SHOOT)
  {
    alert("your turn to  shoot");
    s=msg.data;
    if(board2[s[0]][s[1]]!='a')
    {
        $('#'+'celd2_'+s[0]+'_'+s[1]+'').removeClass('color2');
        $('#'+'celd2_'+s[0]+'_'+s[1]+'').addClass('color');
    }
    turn =1;
  }

  if(msg.type==Messages.T_GAME_OVER)
  {
    alert("YOU LOSE");
    s=msg.data;
    $('#'+'celd2_'+s[0]+'_'+s[1]+'').removeClass('color2');
    $('#'+'celd2_'+s[0]+'_'+s[1]+'').addClass('color');
    turn =0;

  }
}
function fullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
//  <button id="fullscreen" onclick="fullScreen();" style="background: url(../images/fullscreen.png)" type="button">fullscreen</button>

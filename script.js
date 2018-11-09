var Values=[[]];

var squareSize = 5; //размер квадрата
var s123 = ''; //строка со всеми цифрами по прорядку

function rotate(matrix) {
    var result = [], y, h, x, w;
    for (y = 0, h = matrix.length; y < h; y++)
        for (x = 0, w = matrix[y].length; x < w; x++) {
            if (!result[x]) result[x] = [];
            result[x][h-y-1] = matrix[y][x];
        }
    return result;
}

function rep(s, ss) { //Удалить в строке s символы ss
  return s.replace(new RegExp("[" + ss + "]", 'g'), '');
}

function rules(vals){ //замена нулей всеми возможными значениями
	var matrix=$.extend(true, [], vals);
  	for(var w=1; w<squareSize+1;w++)
 			for(var h=1; h<squareSize+1;h++)
     		if(matrix[w][h]===0) matrix[w][h]=s123;
        else matrix[w][h]=String(matrix[w][h]);
  return matrix;
}

function rule0(matrix){ //убираем отмеченые из строки
	var repStr='';
  for(var rot=0;rot<4; rot++){
  	matrix=rotate(matrix);
  	for(var w=1; w<squareSize+1;w++){
    	repStr='';
 			for(var h=1; h<squareSize+1;h++)
     		if(matrix[w][h].length==1) repStr+=matrix[w][h];
        else matrix[w][h]=rep(matrix[w][h],repStr);
    }
  }
  return matrix;
}

function rule1(matrix){ //убираем невозможные от крайних указанных значений
	var repStr='';
  for(var rot=0;rot<4; rot++){
  	matrix=rotate(matrix);
  	for(var w=1; w<squareSize+1;w++){
    	if (matrix[w][0]){
      	repStr='';
        if (matrix[w][0] > 1 && matrix[w][0] < squareSize)
 					for (var j = squareSize; j > squareSize - matrix[w][0] + 1; j--) repStr = j + repStr;
        else repStr = rep(s123, squareSize - matrix[w][0] + 1);
        for(var h=1; h<squareSize+1;h++)
          if (repStr.length){
          	matrix[w][h]=rep(matrix[w][h],repStr);
            if (repStr.length < squareSize - 1) repStr = repStr.substr(1);
            else if (matrix[w][0] == squareSize) repStr= rep(s123, h % (squareSize + 1) + 1);
            else repStr='';
        	}
      }
    }
  }
  return matrix;
}

function rule2(matrix){ //выделяем единственное значение в строке
	var allStr='';
	var repStr='';
  for(var rot=0;rot<4; rot++){
  	matrix=rotate(matrix);
  	for(var w=1; w<squareSize+1;w++){
    	allStr='';
      repStr='';
 			for(var h=1; h<squareSize+1;h++)
      	if (matrix[w][h].length>1) allStr+=matrix[w][h];
        else allStr+=matrix[w][h]+matrix[w][h];
      for (var j = 1; j <= squareSize; j++)
      	if (rep(allStr, rep(s123, j)).length == 1) repStr = String(j);
      if (repStr)
      	for(h=1; h<squareSize+1;h++)
        	if(matrix[w][h].indexOf(repStr)+1) matrix[w][h]=repStr;
    }
  }
  return matrix;
}

function posVals(vals){ //все возможные варианты строки
	var sZnVals='';
  var sAllVals='';
  var result=[];
  var tempVals=vals.slice();
	for(var h=1; h<squareSize+1;h++){
  	tempVals[h]=rep(tempVals[h],sAllVals);
  	if (tempVals[h].length==0) return [];
  	else if (tempVals[h].length==1){
    	sAllVals=sAllVals+tempVals[h]; 
    	if(!sZnVals.length || sZnVals[sZnVals.length-1]<tempVals[h]) sZnVals=sZnVals+tempVals[h];
    	if(sZnVals.length>tempVals[0]) return [];
    } else {
    	sAllVals=tempVals[h];
    	for(var i=0; i<sAllVals.length; i++) {
      	tempVals[h]=sAllVals[i];
				result=result.concat(posVals(tempVals));
      }
      return result;
    }
  }
  if(sZnVals.length==tempVals[0]) result.push(tempVals);
  return result;
}


function rule3(matrix){ //оставляем только возможные варианты
	var tempRows =[];
  var repStr='';
  for(var rot=0;rot<4; rot++){
  	matrix=rotate(matrix);
  	for(var w=1; w<squareSize+1;w++){
    	if (matrix[w][0])
        if (matrix[w][0] > 1 && matrix[w][0] < squareSize){
 					tempRows=posVals(matrix[w]);
          for(var h=1; h<squareSize+1;h++){
          	repStr='';
          	for(var i=0; i<tempRows.length;i++)
              repStr=repStr+tempRows[i][h];
            
            if(repStr.length) matrix[w][h]=rep(matrix[w][h],rep(s123,repStr));
          }
      	}
    }
  }
  return matrix;
}

function isNorm(vals){ //выполняем правила и смотрим наличие пустых клеток
	var matrix=$.extend(true, [], vals);
  var btrue=1;
  matrix=rule0(matrix);
  matrix=rule2(matrix);
  matrix=rule3(matrix);
  for(var w=1; w<squareSize+1;w++)
 		for(var h=1; h<squareSize+1;h++)
    	if(!matrix[w][h].length) btrue=0;
  return btrue;
}

function rule4(matrix){ //проверяем каждое из возможных значений строки на поле
	var tempRows =[];
  var repStr='';
  for(var rot=0;rot<4; rot++){
  	matrix=rotate(matrix);
  	for(var w=1; w<squareSize+1;w++){
    	if (matrix[w][0])
        if (matrix[w][0] > 1 && matrix[w][0] < squareSize){
 					tempRows=posVals(matrix[w]);
          tempRows.push(matrix[w]);
          for(var i=0; i<tempRows.length;i++){
						matrix[w]=tempRows[i];
            if (!isNorm(matrix)) tempRows.splice(i,1);
          }
          tempRows.pop();
          for(var h=1; h<squareSize+1;h++){
          	repStr='';
          	for(i=0; i<tempRows.length;i++)
              repStr=repStr+tempRows[i][h];
            
            if(repStr.length) matrix[w][h]=rep(matrix[w][h],rep(s123,repStr));
          }
      	}
    }
  }
  return matrix;
} 

function rulef(matrix){
var btrue =0;
var col = Math.floor(255 / squareSize); //вычисляем цвет
  	for(var w=1; w<squareSize+1;w++)
 			for(var h=1; h<squareSize+1;h++)
     		if(Values[w][h]===0){
        	if (matrix[w][h].length==1) btrue=1;
        	$('#w' + w + 'h' + h).html(matrix[w][h]);
      		$('#w' + w + 'h' + h).css("background-color", "rgb(127, " + col * (squareSize - matrix[w][h].length) + "," + col * matrix[w][h].length + ")");
        }
  return btrue;
}

function zap() {
	var matrix=rules(Values);
  matrix=rule1(matrix);
  if (rulef(matrix)) return 0; //выводим если есть хоть одно значение для выбора
  matrix=rule0(matrix);
  if (rulef(matrix)) return 0;
  matrix=rule2(matrix);
  if (rulef(matrix)) return 0;
  matrix=rule3(matrix);
  if (rulef(matrix)) return 0;
	matrix=rule4(matrix);
	rulef(matrix);
}

function print() {
 var d = $('#main').empty();
 s123='';
 for (var i = 1; i <= squareSize; i++) s123 += String(i);
 var outherBox=0;
 for(var w=0; w<squareSize+2;w++)
 	for(var h=0; h<squareSize+2;h++){
  	outherBox=0;
  	if (w==0) outherBox+=1;
    if (h==0) {outherBox+=1; if(w) d.append('<div class="dc"/>'); Values[w]=[];}
    if (w==squareSize+1) outherBox+=1;
    if (h==squareSize+1) outherBox+=1;
    Values[w][h]=0;
    if (outherBox==2)
    	outherBox='noclick';
    else if (outherBox==1)
    	outherBox='outher';
    else
    	outherBox='lev0';
  	d.append('<div id="w' + w + 'h' + h + '" class="box ' + outherBox + '"/>');
  }

$('.box').click(function() {
	if (!$(this).hasClass('noclick')) {
    var wh=($(this).attr('id').match(/\d+/g));
    var olev = Values[wh[0]][wh[1]];
    if ($(this).text()!=olev) nlev = +$(this).text().substr(0,1);
    else nlev=olev+1;
    if(nlev >squareSize) {nlev=0; $(this).html('');}
    else $(this).html(nlev);
    if (!$(this).hasClass('outher')) {
      $(this).removeClass('lev' + olev);
      $(this).addClass('lev' + nlev);
    }
    Values[wh[0]][wh[1]]=nlev;
    zap();
  }
});

}

print();

$('select').change(function() {
  squareSize = +($("select option:selected").text().substr(2));
  print();
});

$('#clear').click(function() {
  print();
});

var squareSize = 5; //размер квадрата
var a = []; //числа в квадрате и по краям
var m = []; //возможные цифры в ячейках
var ma = []; //возможные цифры в ячейках по умолчанию
var p = []; //порядок прохождения строк и столбцов
var sa = ''; //строка со всеми цифрами по прорядку
var rule=[1,1,1,1];

function rep(s, ss) { //Удалить в строке s символы ss
  return s.replace(new RegExp("[" + ss + "]", 'g'), '');
}

function step(s) { //сколько ступенек
	var j=0;
  var n=0;
	for(var i=0; i<s.length;i++) if(s[i]>j) {j=s[i]; n++;}
  return n;
}

function stepmax(s) {
	var j='';
	for(var i=0; i<s.length;i++) if(s[i]>j) j=s[i];
  return j;
}

function zap() {
  var s = '';
  var s2 = '';
  var s3 ='';
  var i2 = 0;
  var p2 = 0;
  m = ma.slice(); //заменяем массив с возможными цифрами в ячейках массиво по умолчанию
  var j = 0;
  var i3 = 0;
  var iter=0;
  var iterCount=3;
  
  for (iter=0; iter<iterCount; iter++)
  	for (var i = 0; i < p.length; i++)
    	if (i % (squareSize + 1) == 0) {
      	p2=p[i];
      	if (iter==0){
        	m[p2]='';
					if(rule[1]) {
          	s2='';
            	if (a[p2])
        				if (a[p2] > 1 && a[p2] < squareSize)
 									for (j = squareSize; j > squareSize - a[p2] + 1; j--) s2 = j + s2;
                else s2 = rep(sa, squareSize - a[p2] + 1);
      				else s2 = '';
           }
        } else if (iter==1){
        	if(rule[2]) s2=m[p2];
          m[p2]='';
          s='';
        } else if (iter==2){
        	s2='';
        	if(rule[3])
        		for (j = 1; j <= squareSize; j++) 
        			if (rep(m[p[i]], rep(sa, j)).length == 1) s2 = String(j);
      	}
      } else {
      	if (iter==0){
        	if (a[p[i]])
          	m[p2]=m[p2]+a[p[i]];
        	else
          	m[p[i]] = rep(m[p[i]], (rule[0]?m[p2]:'')+ (rule[1]?s2:''));
            if(rule[1])
            	if (s2.length)
        				if (s2.length < squareSize - 1)
          				s2 = s2.substr(1);
        				else
        					if (a[p2] == squareSize)
          					s2 = rep(sa, i % (squareSize + 1) + 1);
        					else
	         					s2 = '';
        } else if (iter==1){
        	if (a[p[i]])
          	s=s+a[p[i]];
          else{
            if (rule[2] && s2)
            	if (a[p2]>1){
              	s3=rep(sa,s2);
                s2=rep(s2,s);
              	for (j = 0; j < s3.length; j++) if(step(stepmax(rep(m[p2]+s,s3[j]))+s3[j]+s2)>a[p2]) {m[p[i]]=rep(m[p[i]],s3[j]);}
              }
            m[p2]=m[p2]+m[p[i]];
          }	
        } else if (iter==2){
  				if(rule[3] && s2 && m[p[i]].indexOf(s2) + 1) m[p[i]] = s2;
      	}
      
      }

  var col = Math.floor(255 / squareSize); //вычисляем цвет
  for (j = squareSize + 3; j < a.length - squareSize - 3; j++)
    if (!a[j] && j % (squareSize + 2) && (j % (squareSize + 2) != squareSize + 1)) {
      $('#i' + j).html(m[j]);
      $('#i' + j).css("background-color", "rgb(127, " + col * (squareSize - m[j].length) + "," + col * m[j].length + ")");
    } //записываем возможные варианты и цвета
}


function print() {
  var d = $('#main').empty();
  var ij = 0;
  var j = 0;
  a = [];
  m = [];
  ma = [];
  p = [];
  for (var i = 0; i < squareSize + 2; i++) {
    d.append('<div class="dc"/>');
    for (j = 0; j < squareSize + 2; j++) {
      ij = i * (squareSize + 2) + j;
      if (i == 0 || i == squareSize + 1 || j == 0 || j == squareSize + 1)
        d.append('<div id="i' + String(ij) + '" class="box ur0"/>'); //рисуем крайник клетки
      else d.append('<div id="i' + String(ij) + '" class="box"/>'); //рисуем клетки квадрата
      a[ij] = 0;
    }
  }
  sa = '';
  for (i = 0; i < squareSize; i++) sa += String(i + 1);
  for (j = 0; j < a.length; j++) ma[j] = sa;
  m = ma.slice();
  var k = (squareSize + 1) * 3;
  var ji = 0;
  for (i = 0; i < squareSize; i++) {
    for (j = 0; j < squareSize + 2; j++) {
      ij = (i + 1) * (squareSize + 2) + j;
      ji = (j) * (squareSize + 2) + i + 1;
      if (j < squareSize + 1) {
        p[k] = ij;
        p[k - ((squareSize + 1) * 2)] = ji;
      }
      if (j > 0) {
        p[k - (j * 2)] = ij;
        p[k - ((squareSize + 1) * 2) - (j * 2)] = ji;
      } //заполняем путь просмотра квадрата, ячейка с краю и горизонталь или вертикаль в обе стороны
      k++;
    }
    k += (squareSize + 1) * 3 - 1
  }

  $('.box').click(function() { //отрабатываем клик
    var ij = $(this).attr('id').substr(1);
    var olda = 0;
    if (!(ij == 0 || ij == squareSize + 1 || ij == (squareSize + 2) * (squareSize + 2) - 1 || ij == (squareSize + 2) * (squareSize + 1))) olda = a[ij]++;
    if (olda == 0 && m[ij].length == 1) a[ij] = m[ij];
    if (a[ij] > squareSize) a[ij] = 0;
    var s = String(a[ij]);
    if (s == "0") s = "";
    $(this).html(s);
    if (!$(this).hasClass('ur0')) {
      $(this).removeClass('ur' + olda);
      if (s.length) $(this).addClass('ur' + s);
    }
    zap(); //запускаем основную функцию поиска и раскраски
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

$('.rule').click(function() {
  var trule=$(this).text().substr(4,1);
  var trulezn=1-$(this).text().substr(6);
  rule[trule]=trulezn;
  zap();
  $(this).html('rule'+trule+'='+trulezn);
});

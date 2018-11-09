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

<<<<<<< HEAD
function rep(s, ss) { //Удалить в строке s символы ss
  return s.replace(new RegExp("[" + ss + "]", 'g'), '');
}

function zap() {
  var s = '';
  var s2 = '';
  var i2 = 0;
  var p2 = 0;
  m = ma.slice(); //заменяем массив с возможными цифрами в ячейках массиво по умолчанию
  var j = 0;
  var i3 = 0;
  for (var i = 0; i < p.length; i++) //проходим по всем строкам и столбцам
    if (i % (imax + 1) == 0) { //если это число с краю квадрата
      i2 = a[p[i]]; //запоминаем это число
      p2 = 0;
      m[p[i]] = ''; //очищаем возможные цифры на боковой клеточке
      if (i2) //если есть число с краю квадрата
        if (i2 > 1 && i2 < imax) //если оно не минимальное и не максимальное
      {
        p2 = p[i]; //запоминаем координаты ячейки
		s2='';
        for (j = imax; j > imax - i2 + 1; j--) s2 = j + s2;
      } //указываем какие цифры не могут стоять сразу после
      else
        s2 = rep(sa, imax - i2 + 1); //указываем каие цифры не могут стоять сразу после
      else
        s2 = ''; //могут идти любые цифры
      s = ''; //очищаем перечень убираемых цифр
    } else {
      if (a[p[i]]) {
        s += a[p[i]]; //если есть число в клеточке квадрата записываем его в перечень убираемых цифр
        m[p2] = m[p2] + a[p[i]];
      } //и сохраняем им клеточку с краю
      else if (m[p2].indexOf(imax) + 1) m[p2] = ''; //если есть пустая клетка после того как была максимальная цифра очищаем перечень с краю
      m[p[i]] = rep(m[p[i]], s + s2); //убираем из возможных в ячейке оба перечня
      if (s2.length) {
        if (s2.length < imax - 1) // если с краю не минимальная и не максимальная цифра
          s2 = s2.substr(1); //укорачиваем удаляемый перечень на еденицу
        else
        if (i2 == imax) //если с краю максимальное число
          s2 = s2 = rep(sa, i % (imax + 1) + 1); //рисуем лесенку
        else
          s2 = ''; //если с краю еденица - очищаем удаляемый перечень
      }
    }

  for (i = 0; i < p.length; i++) //проходим по всем строкам и столбцам
    if (i % (imax + 1) == 0) { //если это клетка с краю квадрата
      p2 = p[i]; //запоминаем ее положение
      i3 = ''; //башни по порядку
      for (j = 0; j < m[p2].length; j++)
        if (j == 0 || i3[0] < m[p2][j]) i3 = m[p2][j] + i3; //убираем невидимые башни
      for (j = 0; j < i3.length; j++)
        if (i3[j] != String(imax - j)) i3 = ''; //если это башни по порядку до максимальной
      if (i3.length < a[p2] - 1) i3 = ''; //если их колличество меньше числа с краю минус один
      m[p2] = ''; //очищаем перечисление башен в клетке скраю
    } else {
      if (i3.length) {
        if (a[p[i]] == 0) m[p[i]] = m[p[i]][m[p[i]].length - 1];
        i3 = '';
      } //подставляем в крайней клетке максимально возможное число
      if (a[p[i]] == 0) m[p2] += m[p[i]]; //если в клетке нет цифр собираем в строку все возможные варианты
    }

  for (i = 0; i < p.length; i++) //проходим по всем строкам и столбцам
    if (i % (imax + 1) == 0) { //если это клетка с краю квадрата
      i3 = 0;
      for (j = 1; j <= imax; j++) //проходя по всем размерам башен
        if (rep(m[p[i]], rep(sa, j)).length == 1) i3 = String(j); //удаляем все кроме него, если оно осталось одно в списке, запоминаем
    } else
  if (i3 && m[p[i]].indexOf(i3) + 1) m[p[i]] = i3; //записываем это число если оно есть в строчке или столбце


  var col = Math.floor(255 / imax); //вычисляем цвет
  for (j = imax + 3; j < a.length - imax - 3; j++)
    if (!a[j] && j % (imax + 2) && (j % (imax + 2) != imax + 1)) {
      $('#i' + j).html(m[j]);
      $('#i' + j).css("background-color", "rgb(127, " + col * (imax - m[j].length) + "," + col * m[j].length + ")");
    } //записываем возможные варианты и цвета
}

=======
>>>>>>> cd27aa7bcafcb8472d89c8ed204b93da063d6ab8
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

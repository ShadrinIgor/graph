// Загружаем Konva
var transport = new XMLHttpRequest();
transport.open('get', './source/lib/konva.min.js', false);
transport.send(null);
var code = transport.responseText;
eval(code);


var stage = new Konva.Stage({
    container: 'container',
    width: 1000,
    height: 400
});

Konva.Circle.prototype.toString = function () {
    return this._id;
}

Konva.Line.prototype.toString = function () {
    return this._id;
}

var layer = new Konva.Layer();  // Слой для вершин
var layer2 = new Konva.Layer(); // Слой для ребер
var layer3 = new Konva.Layer(); // Слой для расщитанного пути
var points = [];                // Масив всех вершин
var adges = [];                 // Связи вершин к ребрам
var adgesAll = [];              // Все ребра
var addStatus = 1;              // Статус добавление: 1 - вершины, 2 - ребра, 3 - расчет пути
var pathPoint1;                 // Первая выделенная точка
var pathPoint2;                 // Вторая выделенная точка
var needAdd = true;
var pathes = [];                // Все пути которые мы нашли от точки 1 до 2
var path = [];                  // Минимальный путь

document.getElementById("container").addEventListener( 'click', function( e ) {
    if( addStatus == 1 && needAdd ) {

        let triangle2 = new Konva.Circle({
            x: e.layerX,
            y: e.layerY,
            radius: 10,
            fill: '#ffD200',
            stroke: '#ff0000',
            strokeWidth: 0
        });

        triangle2.on('click', function( e ) {

            var menu = document.getElementById( "menu-"+this._id );
            if( !menu ){ // Создаем меню для точки если оно еще не созданно
                var menu = document.getElementById("menus").appendChild( document.createElement("div") );
                menu.id = "menu-"+this._id;
                menu.className = "menu";
                let div1 = menu.appendChild( document.createElement("div") );
                div1.innerText = "Выделить точку";
                div1.addEventListener( "click", ()=>{
                    selectPoint.call( this, e.evt );
                    menu.style.display = 'none';
                } );

                let div2 = menu.appendChild( document.createElement("div") );
                div2.innerText = "Удалить точку";
                div2.addEventListener( "click", ()=>{
                    deletePoint.call( this, e.evt );
                    menu.style.display = 'none';
                } );

                menu.style.left = ( this.attrs.x + 10 ) + 'px';
                menu.style.top = ( this.attrs.y + 320 ) + 'px';
            }

            if( addStatus != 3 )menu.style.display = menu.style.display == 'block' ? 'none' : 'block';

        });

        triangle2.on('mouseover', function() {
            needAdd = false;
        });

        triangle2.on('mouseout', function() {
            needAdd = true;
        });

        points.push( triangle2 );
        drawLine();

        layer.add(triangle2);
        layer.draw();
    }
});

function deletePoint( e ) {

    // После расчета запрещяем удалять
    if( addStatus != 3 ) {
        if( pathPoint1 && this._id == pathPoint1._id ) {
            pathPoint1 = null;
        }

        if( pathPoint2 && this._id == pathPoint2._id ) {
            pathPoint2 = null;
        }

        // Удаляем связанное меню
        document.getElementById( "menu-"+this._id ).remove();

        // Удаляем связаные ребра
        for( let i=0;i<adgesAll.length;i++ ){
            if( adgesAll[i].point1._id ==  this._id || adgesAll[i].point2._id ==  this._id ){
                adgesAll[i].destroy();
            }
        }

        this.destroy();
        layer.draw();
        layer2.draw();
    }

    e.stopPropagation();
}

function selectPoint( e ) {

    if( !pathPoint1 || !pathPoint2 || ( ( pathPoint1 &&  this._id == pathPoint1._id ) || ( pathPoint2 && this._id == pathPoint2._id ) ) ){

        if( pathPoint1 && this._id == pathPoint1._id ) {
            pathPoint1 = null;
        }

        if( pathPoint2 && this._id == pathPoint2._id ) {
            pathPoint2 = null;
        }

        if( this.fill() == "#ff0000" ) {
            this.fill("#ffD200");
        }
        else {
            this.fill("#ff0000");

            if( !pathPoint1 )pathPoint1 = this;
            else pathPoint2 = this;
        }

        layer.draw();

    } else alert('Вы уже выделили 2 точки, вам необхдимо снять выделение');

    e.stopPropagation();
}

function drawLine() {
    if( points.length >1 ){

        layer.clear();

        for( let i=0;i<points.length;i++ ) {
            for (let n = 0; n < points.length-1; n++) {

                if( points[i]._id != points[n]._id ) {

                    let redLine = new Konva.Line({
                        points: [points[i].attrs.x, points[i].attrs.y, points[n].attrs.x, points[n].attrs.y],
                        stroke: '#ffffff',
                        strokeWidth: 14,
                        opacity: 0,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });

                    redLine.point1 = points[i];
                    redLine.point2 = points[n];

                    // Регестрируем все скрытые ребра
                    adgesAll.push( redLine );

                    redLine.on('click', function( e ) {
                        if( addStatus == 2 ){

                            if( this.stroke() == '#0000ff' ){
                                var fill = '#ffffff';
                                adges[ this.point1._id ][ this.point2._id ] = null;
                                adges[ this.point2._id ][ this.point1._id ] = null;
                            }
                                else {
                                var fill = '#0000ff';
                                if( !Array.isArray( adges[ this.point1._id ] ) )adges[ this.point1._id ] = [];
                                if( !Array.isArray( adges[ this.point2._id ] ) )adges[ this.point2._id ] = [];
                                adges[ this.point1._id ][ this.point2._id ] = this;
                                adges[ this.point2._id ][ this.point1._id ] = this;
                            }

                            this.stroke(fill);
                            layer2.draw();
                        }
                    });
                    redLine.on('mouseover', function( ) {
                        if( addStatus == 2 && this.stroke() == "#ffffff" ) {
                            this.stroke("#ff0000");
                            this.opacity(1);
                            layer2.draw();
                        }
                        if( this.stroke() == "#0000ff" )console.log("Line id:"+this._id);
                    });
                    redLine.on('mouseout', function( ) {
                        if( addStatus == 2 && this.stroke() == "#ff0000" ) {
                            this.stroke("#ffffff");
                            this.opacity(0);
                            layer2.draw();
                        }
                    });
                    layer2.add(redLine);
                }
            }
        }
        layer2.draw();
    }
}

function addPointer() {
    if( addStatus == 2 ) {
        addStatus = 1;
    }

    document.getElementById( "vertex" ).disabled = true;
    document.getElementById( "edge" ).disabled = false;
}

function addReb() {
    if( addStatus == 1 ) {
        addStatus = 2;

    }

    document.getElementById( "vertex" ).disabled = false;
    document.getElementById( "edge" ).disabled = true;
}

function calculate( testPoints, textAdgesAll, textAdges, testPoint1, testPoint2 ) {

    document.getElementById( "vertex" ).disabled = true;
    document.getElementById( "edge" ).disabled = true;
    addStatus = 3;
    pathes = [];
    if( ( !pathPoint1 || !pathPoint2 ) && ( !testPoint1 || !testPoint1 ) ){

        // Если идет тест
        if( testPoints && textAdges ) {
            return {'error':'error-select-point'}
        }
         else alert("Для расчета необходимо указать 2 точки");
    }
    else {

        // Если идет тест
        if( testPoints && testPoint1 && testPoint2 ) {
            pathPoint1 = testPoint1;
            pathPoint2 = testPoint2;
            points = testPoints;
            adges = textAdges;
            adgesAll = textAdgesAll;
        }

        let storageKey = "path-"+pathPoint1._id + '-' + pathPoint2._id;
        let storageValue = localStorage.getItem( storageKey );
        if( !storageValue ) {
            getVertextPath( [], pathPoint1, 0 );

            console.log("------------------------Расчитал");
        }

        document.getElementById( "saveButton" ).disabled = false;

        if( pathes.length >0 || storageValue ){

            // Выделяем путь
            selectBestPath(storageKey, storageValue);

            // Если идет тест
            if( testPoints ) {
                return {'status':'calculate-ok', 'pathes' : pathes, 'path' : path};
            }

        }
            else {
            // Если идет тест
            if( testPoints )return {'status':'calculate-error', 'error': 'can`t calculate path'};
                else alert("Не смог проложить путь");
        }
    }
}

function getVertextPath( path, point, parentAdgeId ) {
    // Проверяем если ли грани у этой вершины
    if( adges[ pathPoint1._id ] && adges[ pathPoint1._id ].length > 1 ){

        return adges[ point._id ].map( function( edgesItem ){

            if( path.length > points.length*2 )
                return;

            // Если Текущая вершина это то что мы искали
            if( edgesItem.point1._id == pathPoint2._id || edgesItem.point2._id == pathPoint2._id ){
                pathes.push( path.concat( edgesItem ) );
                return;
            }

            if( parentAdgeId != edgesItem._id ){

                if( edgesItem.point1._id != point._id ){
                    getVertextPath( path.concat( [ edgesItem, edgesItem.point1 ] ), edgesItem.point1, edgesItem._id );
                }
                else {
                    getVertextPath( path.concat( [ edgesItem, edgesItem.point1 ] ), edgesItem.point2, edgesItem._id );
                }
            }

        })
    }
}

function selectBestPath( storageKey, storageValue ){

    path = [];
    if( pathes.length >0 ){
        var minWidth = 0;
        pathes.map( ( pathItem ) => {
            var width = 0;

            pathItem.map( ( pathItemSub )=> {
                if( pathItemSub instanceof Konva.Line )
                    width += Math.sqrt( Math.pow( pathItemSub.point2.attrs.x - pathItemSub.point1.attrs.x, 2 ) + Math.pow( pathItemSub.point2.attrs.y - pathItemSub.point1.attrs.y, 2 ) );
            });

            if( minWidth ==  0 ){
                minWidth = width;
                path = pathItem;
            } else
                if( minWidth >  width ) {
                    minWidth = width;
                    path = pathItem;
                }

        });

        // Сохраняем путь в Storage
        if( window.localStorage ){
            localStorage.setItem( storageKey, path );
        }

        // Выделяем минимальный путь
        path.map( ( item )=> {
            if( item instanceof Konva.Line ) item.stroke("#00ff00");
                else item.fill("#00ff00");

        });
        layer.draw();
        layer2.draw();

        // Запускаем анимацию
        startAnimation( path );
    }

    if( storageValue ) {
        let valueArray = storageValue.split( "," );
        let allElements = adgesAll.concat( points );
        valueArray.map( ( element ) =>{

            allElements.map( ( item ) =>{
                if( item._id == element ){
                    path.push( item );
                    return;
                }
            } )
        })

        console.log("------------------------Восстановил", storageValue, path );

        // Выделяем минимальный путь
        path.map( ( item )=> {
            if( item instanceof Konva.Line ) item.stroke("#00ff00");
            else item.fill("#00ff00");

        });
        layer.draw();
        layer2.draw();

        // Запускаем анимацию
        startAnimation( );
    }
}

function clearAll() {
    document.getElementById( "vertex" ).disabled = true;
    document.getElementById( "edge" ).disabled = false;

    layer.remove();
    layer2.remove();
    layer3.remove();

    layer = new Konva.Layer();
    layer2 = new Konva.Layer();
    layer3 = new Konva.Layer();
    stage.add(layer2);
    stage.add(layer);
    stage.add(layer3);

    points = [];
    adges = [];
    adgesAll = [];
    addStatus = 1;
    pathPoint1 = null;
    pathPoint2 = null;
    needAdd = true;
    pathes = [];

}

stage.add(layer2);
stage.add(layer);
stage.add(layer3);

function startAnimation(  ) {

    if (path.length > 0) {


        var pointFrom = null;
        var pointTo = null;
        // Выделяем только вершины
        var pathPoints = [];
        pathPoints[0] = pathPoint1;
        path.map((item)=> {
            if (item instanceof Konva.Circle)
                pathPoints[pathPoints.length] = item;
        });
        pathPoints[pathPoints.length] = pathPoint2;

        // Определеяем началный отрезок
        pointFrom = 0;
        pointTo = 1;

        let circle = new Konva.Circle({
            x: pathPoints[pointFrom].attrs.x,
            y: pathPoints[pointFrom].attrs.y,
            radius: 10,
            fill: '#ff00ff',
            stroke: '#ff0000',
            strokeWidth: 0
        });

        layer3.add(circle);
        layer3.draw();

        var animation = new Konva.Animation(function (frame) {
            // проверяем не дошол ли шарик то вершины назначения
            if (Math.round(circle.attrs.x) == pathPoints[pointTo].attrs.x && Math.round(circle.attrs.y) == pathPoints[pointTo].attrs.y) {
                if (pointTo < pathPoints.length - 1) {
                    pointTo++;
                    pointFrom++;
                }
                else {
                    animation.stop();
                    animationBack.start();
                }
            }

            var diff = frame.timeDiff / 10;

            let newX = ( circle.attrs.x > pathPoints[pointTo].attrs.x ) ? circle.attrs.x - diff : circle.attrs.x + diff;
            let newY = ( circle.attrs.y > pathPoints[pointTo].attrs.y ) ? circle.attrs.y - diff : circle.attrs.y + diff;

            let k = (pathPoints[pointTo].attrs.y - pathPoints[pointFrom].attrs.y) / (pathPoints[pointTo].attrs.x - pathPoints[pointFrom].attrs.x);
            let b = pathPoints[pointFrom].attrs.y - k * pathPoints[pointFrom].attrs.x;

            circle.setX(newX);
            circle.setY(k * newX + b);

        }, layer3);

        var animationBack = new Konva.Animation(function (frame) {
            // проверяем не дошол ли шарик то вершины назначения
            if (Math.round(circle.attrs.x) == pathPoints[pointFrom].attrs.x && Math.round(circle.attrs.y) == pathPoints[pointFrom].attrs.y) {
                if (pointTo > 0) {
                    pointTo--;
                    pointFrom--;
                }
                else animationBack.stop();
            }

            var diff = frame.timeDiff / 10;
            let newX = ( circle.attrs.x > pathPoints[pointFrom].attrs.x ) ? circle.attrs.x - diff : circle.attrs.x + diff;
            let newY = ( circle.attrs.y > pathPoints[pointFrom].attrs.y ) ? circle.attrs.y - diff : circle.attrs.y + diff;

            let k = (pathPoints[pointFrom].attrs.y - pathPoints[pointTo].attrs.y) / (pathPoints[pointFrom].attrs.x - pathPoints[pointTo].attrs.x);
            let b = pathPoints[pointTo].attrs.y - k * pathPoints[pointTo].attrs.x;

            circle.setX(newX);
            circle.setY(k * newX + b);

        }, layer3);

        animation.start();
    }
}

function save() {
    if( path.length >0 ){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/', true);
        xhr.send( JSON.stringify( path ) );

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                alert(xhr.responseText);
            }

        }
    }
}
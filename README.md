<h3>Используемые технологии JavaScript, Konva.js, Node.js</h3>

<h3>Как запустить</h3>
<h4>Устанавливаем все необходимые модули</h4>
    npm i
<h4>Запускаем Node.js</h4>
    cd /node/
    node /bin/www
    В файле /node/routes/index.js, строчка 10, вместо "http://graph.loc" укажите свой локальный адресс

<h3>Как это работает</h3>
<li>Кликаем на зоне( обрамленной красной рамкой ) чтобы выставиь вершины</li>
<li>Кликаем на кнопку ребра, чтобы перейти в режим добавление ребер.</li>
<li>Водим мышкой между вершинами и когда ребра подсветится красным, кликаем мышкой на ней чтобы выставить ребро</li>
<li>Кликаем на вершина которая будет началом расчета, на всплывающем меню клкаем на ВЫДЕЛИТЬ ТОЧКУ ( она должна будет подстветится красным )</li>
<li>Для удаление вершины кликаем на нужной вершине, затем  на всплывающем меню клкаем на УДАЛИТЬ ТОЧКУ</li>
<li>Кликаем на еще одну вершина которая будет концом расчета ( она должна будет подстветится красным )</li>
<li>Нажимае на кнопку расчитать чтобы начать рассчет</li>
<li>Если все получилось, то вы должны увидеть:
    <ul>
        - Минимальный путь должен подстветится зеленым<br/>
        - Фиолетовый шарик должен пройти от старта до финиша пути<br/>
        - затем фиолетовый шарик должен должен сделать обратный путь<br/>
        - Активируется кнопка СОХРАНИТЬ, которая делает запрос на NODE.js сервер, которы получает найденный путь и имитирует сохранение<br/>
    </ul>
</li>
<br/>
<h3>Где можно посмотреть</h3>
<a href="http://test.world-travel.uz" target="_blank">Тут можно посмотреть</a> ( только без сохранение, на том сервере не запущен Node.js )
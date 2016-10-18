function popup() {
    document.getElementById("popup-name").innerHTML = buyersArray[Math.floor(Math.random() * buyersArray.length + 0)], document.getElementById("popup-color").innerHTML = colorsArray[Math.floor(Math.random() * colorsArray.length + 0)], document.getElementById("popup-city").innerHTML = cityArray[Math.floor(Math.random() * cityArray.length + 0)], document.getElementById("popup-price").innerHTML = "Оформил заказ на " + price + "руб.", $("#popup").fadeIn(1e3), setTimeout(function() {
        $("#popup").fadeOut(1e3)
    }, 4e3);
    var e = new Audio;
    e.preload = "auto", e.src = "./sounds/popupsound.mp3", e.play(), popupCounter < 10 && (popupCounter++, window.setTimeout(popup, Math.floor(25e3 * Math.random() + 2e4)))
}! function() {
    function e() {
        var t = new Date;
        val = 10 + 42 * t.getHours() + parseInt(.7 * t.getMinutes(), 10), document.getElementById("visitorsToday").value = val, window.setTimeout(e, Math.floor(1e4 * Math.random() + 1e3))
    }

    function t() {
        Math.floor(2 * Math.random() + 1) > 1 ? parseInt(document.getElementById("visitorsNow").value, 10) < visitorsMax && (value = parseInt(document.getElementById("visitorsNow").value, 10) + Math.floor(5 * Math.random() + 1), value <= visitorsMax && (document.getElementById("visitorsNow").value = value)) : parseInt(document.getElementById("visitorsNow").value, 10) > visitorsMin && (value = parseInt(document.getElementById("visitorsNow").value, 10) - Math.floor(5 * Math.random() + 1), value >= visitorsMin && (document.getElementById("visitorsNow").value = value)), window.setTimeout(t, Math.floor(1e4 * Math.random() + 9e3))
    }

    function o() {
        var e = new Date,
            t = 1;
        e.getHours() < 8 && (t += 2 * e.getHours(), e.getMinutes() > 30 && (t += 1)), e.getHours() >= 8 && (t = t + 16 + 6 * (e.getHours() - 8) + parseInt(e.getMinutes() / 10, 10)), document.getElementById("boughtToday").value = t, window.setTimeout(o, Math.floor(1e4 * Math.random() + 100))
    }
    price = 3190, popupCounter = 0, e();
    var n = new Date;
    n.getHours() > 8 && n.getHours() < 22 ? (document.getElementById("visitorsToday").value < 50 ? (new_value = Math.floor(Math.random() * parseInt(document.getElementById("visitorsToday").value, 10) + 1), visitorsMax = parseInt(document.getElementById("visitorsToday").value, 10), visitorsMin = 5) : (new_value = Math.floor(50 * Math.random() + 50), visitorsMax = 100, visitorsMin = 50), document.getElementById("visitorsNow").value = new_value) : (document.getElementById("visitorsToday").value < 50 ? (new_value = Math.floor(Math.random() * parseInt(document.getElementById("visitorsToday").value, 10) + 1), visitorsMax = parseInt(document.getElementById("visitorsToday").value, 10), visitorsMin = 5) : (new_value = Math.floor(40 * Math.random() + 10), visitorsMax = 50, visitorsMin = 10), document.getElementById("visitorsNow").value = new_value), setTimeout(function() {
        t()
    }, 900), o()
}();

var buyersArray = ["Григорьева Любава", "Новомейский Лукьян", "Челпанова Вероника", "Агейкин Денис", "Тянникова Ирина", "Собачкин Артур", "Остроумов Кирилл", "Кидин Юрий", "Чилаев Лукьян", "Близнюк Егор", "Янютина Каролина", "Молчанова Юлия", "Шурыгин Николай", "Ястребова Вероника", "Снытко Нина", "Комракова Анна", "Ишеев Семён", "Онипченко Рената", "Кумиров Глеб", "Дюженкова Любава", "Федулова Надежда", "Шуличенко Бронислав", "Храмова Ольга", "Егорова Полина", "Журов Адам", "Куцак Савелий", "Зёмина Светлана", "Сафронов Роман", "Ёжина Александра", "Пелёвина Альбина", "Изюмов Тихон", "Головченко Роза", "Легкодимова Варвара", "Килиса Татьяна", "Индик Иннокентий", "Яблоновский Артур", "Ковшутина Анна", "Ядов Иван", "Ларичева Марина", "Худовекова Дарья", "Рыбакова Мария", "Москвитин Кондратий", "Шевцов Фадей", "Голодяев Максим", "Чайка Александр", "Буриличева Диана", "Ожегов Богдан", "Казаков Руслан", "Уржумцева Александра", "Тукаева Ольга", "Козлитина Нина", "Маматов Тимур", "Завразина Пелагея", "Заболотный Филимон", "Кабанова Нина", "Климцова Наталья", "Луковникова Элеонора", "Осенныха Варвара", "Лямин Дементий", "Шашлов Максим", "Козлитин Вячеслав", "Филиппова Ксения", "Килик Егор", "Касьяненко Алиса", "Вольпов Виктор", "Курганов Евгений", "Сабанцев Леонид", "Тютчев Арсений", "Серов Ярослав", "Приказчиков Савелий", "Дежнёв Артур", "Мандрыка Юлия", "Дульцева Рада", "Разбойникова Жанна", "Зубок Мефодий", "Быстров Вячеслав", "Суриков Роман", "Гаврюшина Ефросинья", "Иванков Вадим", "Фокина Надежда", "Диденкова Варвара", "Лобана Рада", "Яшина Екатерина", "Староволкова Анна", "Дубровский Алексей", "Ясногородский Ярослав", "Телицын Сергей", "Емелин Мефодий", "Бальсунова Марина", "Фёдоров Виктор", "Савкина Диана", "Кокорин Егор", "Коврова Майя", "Черкасов Леонид", "Карпюка Марина", "Катаева Ольга", "Пишенина Анна", "Низьев Глеб", "Ноздрёв Юлиан", "Кравченко Лаврентий"];
cityArray = ["Москва", "Санкт Петербург", "Новосибирск", "Екатеринбург", "Нижний Новгород", "Казань", "Челябинск", "Омск", "Самара", "Ростов-на-Дону", "Уфа", "Красноярск", "Пермь", "Воронеж", "Волгоград", "Саратов", "Тольятти", "Тюмень", "Ижевск"];
var colorsArray = ["розовый", "голубой", "зелёный"];

setTimeout(function() {
    popup()
}, 2e4);
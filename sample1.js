function imgError(image) {
    image.onerror = "";
    image.src = "images/hotel1.jpg";
    return true;
}
countriesIds = [];
countryToSearch = [];
resortToSearch = [];
searchResortLeftover = [];
countryOptGroup = [];
resortOptGroup = [];
currentRequest = 0;
dataCount = 0;

var callbackForCountry = function(countryOpt, countryId, countryName) {

   $.get('http://stage.tourspo.ru:3000/api/v2/country/'+countryId+'+.json',
    function(data){
        var iso_code = data.iso_code;
        if (!iso_code) {
            iso_code = "eu";
        }
        countriesIds.push(countryId);
        countryToSearch.push({
            value: countryName,
            data: {
                category: countryId,
                data: countryId,
                class: 'country',
                type: 'country',
                flag: iso_code
            }
        });
    });
};

function callbackForResort(resortOpt, resortId, resortName, resortCountry, countryName) {

    resortOptGroup.push(resortOpt);
    resortToSearch.push({
        value: resortName,
        data: {
            category: resortCountry,
            data: resortId,
            class: 'resort',
            type: 'resort',
            countryName: countryName
        }
    });

}

$(document).ready(function() {

    var sendData = {};
    $.ajax({
        
        data: $.extend(sendData, {
            '_csrf': $('meta[name="csrf-token"]').attr('content')
        }),
        type: 'post',
        url: '/?Reference=countryTo',
        dataType: 'json',
        
        success: function(data, textStatus, jqXHR) {

            $.each(data, function(i, item) {
                callbackForCountry(data[i], data[i].id, data[i].name);
                var countryName = data[i].name;


                var countryId = data[i].id;

                var sendData = {
                    'countryId': countryId,
                };

                $.ajax({
                   
                    data: $.extend(sendData, {
                        '_csrf': $('meta[name="csrf-token"]').attr('content')
                    }),
                    type: 'post',
                    url: '/?Reference=resort',
                    dataType: 'json',
                    error: function(jqXHR, textStatus, errorThrown) {

                    },
                    success: function(data, textStatus, jqXHR) {
                        group = $('optgroup[data-id=' + countryId + ']');

                        $.each(data, function(i, item) {
                            callbackForResort({
                                countryId: countryId,
                                value: data[i].name,
                                name: data[i].name
                            }, data[i].id, data[i].name, countryId, countryName);
                        
                        });
                    },
                    complete: function(jqXHR, textStatus) {

                        serviceUrl = 'http://stage.tourspo.ru:3000/api/v2/hotels+?country_id=&q=&operator_id=';
                        $('#autocomplete').autocomplete({
                            onSearchComplete: function(query, suggestions) {
                                if (!suggestions.length) {
                                    console.log('no suggestion');
                                }
                            },
                            minChars: 0,
                            lookup: function(query, done) {
                                var data;
                                query = query.toLowerCase();
                                var htmlQuery = '';
                                for (var i = 0; i < countriesIds.length; i++) {
                                    htmlQuery = htmlQuery + 'country_id[]=' + countriesIds[i] + '&';
                                }
                                var promise = $.getJSON('http://stage.tourspo.ru:3000/api/v2/hotels+?' + htmlQuery + 'q=' + query + '&operator_id=3', function(data)  {

                                    lookupCallback(data);
                                });
                                var lookupCallback = function(data) {
                                    
                                    var searchArray = [];
                                    var searchResortLeftover = [];
                                    var hotelsToSearch = [];
                                    var searchResortLeftover = resortToSearch.slice();
                                    for (var i = 0; i < data.length; i++) {

                                        hotelsToSearch.push({
                                            value: data[i].name,
                                            data: {

                                                category: 'hotels',
                                                data: data[i].id,
                                                class: 'hotel',
                                                type: 'hotel',
                                                countryId: data[i].country.id,
                                                resortId: data[i].resort.id,
                                                countryName: data[i].country.name

                                            }
                                        });
                                    }
                                    var searchHotelsLeftover = hotelsToSearch.slice();              
                                    for (var i = 0; i < countryToSearch.length; i++) {

                                        if (countryToSearch[i].value.toLowerCase().search(query) >= 0 || countryToSearch[i].value.search(query) >= 0) {

                                            searchArray.push(countryToSearch[i]);

                                            for (var z = 0; z < resortToSearch.length; z++) {

                                                if (resortToSearch[z].data.category === countryToSearch[i].data.category) {

                                                    if (resortToSearch[z].value.toLowerCase().search(query) >= 0 || resortToSearch[z].value.search(query) >= 0) {
                                                        searchResortLeftover[z].data.class = "resort";
                                                        searchArray.push(resortToSearch[z]);
                                                        for (var x = 0; x < searchHotelsLeftover.length; x++) {

                                                            if (searchHotelsLeftover[x] !== "1") {

                                                                if (searchHotelsLeftover[x].data.resortId === resortToSearch[z].data.data) {
                                                                    searchArray.push(searchHotelsLeftover[x]);
                                                                    searchHotelsLeftover[x] = '1';
                                                                }
                                                            }
                                                        }
                                                        searchResortLeftover[z] = '1';
                                                    }
                                                }
                                            }
                                            for (var x = 0; x < searchHotelsLeftover.length; x++) {
                                                if (searchHotelsLeftover[x] !== '1') {
                                                    if (searchHotelsLeftover[x].data.countryId === countryToSearch[i].data.category) {
                                                        searchHotelsLeftover[x].data.class = 'resort';
                                                        searchArray.push(searchHotelsLeftover[x]);
                                                        searchHotelsLeftover[x] = '1';
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    for (var z = 0; z < searchResortLeftover.length; z++) {
                                        if (searchResortLeftover[z] !== '1') {


                                            if (searchResortLeftover[z].value.toLowerCase().search(query) >= 0 || searchResortLeftover[z].value.search(query) >= 0) {
                                                searchResortLeftover[z].data.class = "country";
                                                searchArray.push(searchResortLeftover[z]);
                                                for (var x = 0; x < hotelsToSearch.length; x++) {
                                                    if (searchHotelsLeftover[x] !== '1') {
                                                        if (hotelsToSearch[x].data.resortId === resortToSearch[z].data.data) {
                                                            searchArray.push(hotelsToSearch[x]);
                                                            searchHotelsLeftover[x] = '1';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (var x = 0; x < searchHotelsLeftover.length; x++) {
                                        if (searchHotelsLeftover[x] !== '1') {

                                            searchHotelsLeftover[x].data.class = 'country';
                                            searchArray.push(searchHotelsLeftover[x]);
                                            searchHotelsLeftover[x] = '1';
                                        }
                                    }

                                    var result = {
                                        suggestions: searchArray
                                    };
                                    done(result);
                                };
                            },

                            onSelect: function(suggestion) {
                               
                                if (suggestion.data.type === "resort") {
                                    $('#countryList').selectpicker('val', suggestion.data.category);

                                    changeResort(suggestion.data.category, suggestion.data.data);

                                }
                                if (suggestion.data.type === "hotel") {
                                    window.location.href = '/hotel/' + suggestion.data.data;
                                }
                                if (suggestion.data.type === "country") {
                                    $('#countryList').selectpicker('val', suggestion.data.category);
                                    searchByCountry();
                                }

                            },
                            showNoSuggestionNotice: true,
                        });
                        $('.autocomplete-suggestions').enscroll({
                            showOnHover: false,
                            verticalTrackClass: 'track3',
                            verticalHandleClass: 'handle3'
                        });

                    },
                });
            });
        },
        complete: function(jqXHR, textStatus) {
            References.submit('enable');
        },

    });

});
var doOnce = 0;

var sendData = {};

$.ajax({
    
    data: $.extend(sendData, {
        '_csrf': $('meta[name="csrf-token"]').attr('content')
    }),
    type: 'post',
    url: '/?Reference=countryTo',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {

    },
    success: function(data, textStatus, jqXHR) {
        var myNode = document.getElementById("countryList");

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        var myNode = document.getElementById("countryListMobile");

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        $.each(data, function(i, item) {
            var countryName = data[i].name;
            var countryId = data[i].id;
            $('#countryList').append('<option value="' + countryId + '" data-id="' + countryId + '">' + countryName + '</option>');
            $('#countryListMobile').append('<option value="' + countryId + '" data-id="' + countryId + '">' + countryName + '</option>');
            $('#countryList').selectpicker('refresh');
            $('#countryListMobile').selectpicker('refresh');
        });
    },
    complete: function(jqXHR, textStatus) {
        if (doOnce !== 1) {
            if (params[1] === undefined) {
                var countryId = $('#countryList').val();
                changeResort(countryId);
            } else {
                $('#countryList').selectpicker('val', params[1]);
                changeResort(params[1]);
            }
        }
    },

});

function changeResort(countryId, resortId) {

    var sendData = {
        'countryId': countryId,
    };
    var myNode = document.getElementById("resortList");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    $('#resortList').append('<option value="-1" data-id="-1">Загрузка...</option>');

    $.ajax({
        
        data: $.extend(sendData, {
            '_csrf': $('meta[name="csrf-token"]').attr('content')
        }),
        type: 'post',
        url: '/?Reference=resort',
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {

        },
        success: function(data, textStatus, jqXHR) {
            var myNode = document.getElementById("resortList");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            var myNode = document.getElementById("resortListMobile");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            $('#resortList').append('<option value="0" data-id="0">Все курорты</option>');
            $('#resortListMobile').append('<option value="0" data-id="0">Все курорты</option>');
            $.each(data, function(i, item) {
                $('#resortList').append('<option value="' + data[i].id + '" data-id="' + data[i].id + '">' + data[i].name + '</option>');
                $('#resortListMobile').append('<option value="' + data[i].id + '" data-id="' + data[i].id + '">' + data[i].name + '</option>');
                $('#resortList').selectpicker('refresh');
                $('#resortListMobile').selectpicker('refresh');
            });
        },
        complete: function(jqXHR, textStatus) {

            if (resortId !== undefined) {
                $('#resortList').selectpicker('val', resortId);
                searchByResort();
            }
            if (doOnce !== 1) {
                if (params[2] === undefined) {
                    searchByCountry();
                } else {
                    $('#resortList').selectpicker('val', params[2]);
                    searchByResort();
                }
                doOnce = 1;
            }
        },
    });
}

function searchByCountry() {

    var countryId = $('#countryList').val();
    changeResort(countryId);
    currentTS = Date.now();
    dataCount = 0;
    counterValue = 0;
    var starId = [5, 6, 2, 7, 8, 3];
    var selected1 = "0";
    $('#hotels_all').innerHTML = '';
    getHotels(countryId, selected1, starId, currentTS);

}

$("#countryList").change(function() {
    searchByCountry();
});

$("#countryListMobile").change(function() {
    var value = $('#countryListMobile').val();
    $('#countryList').selectpicker('val', value);
    searchByCountry();
});

function searchByResort() {

    var starId = [5, 6, 2, 7, 8, 3];
    var selected = $('#resortList').val();
    var countryId = $('#countryList').val();
    currentTS = Date.now();
    dataCount = 0;
    counterValue = 0;
    $('#hotels_all').innerHTML = '';
    getHotels(countryId, selected, starId, currentTS);
}

$("#resortList").change(function() {
    searchByResort();
});

$("#resortListMobile").change(function() {
    var value = $('#resortListMobile').val();
    $('#resortList').selectpicker('val', value);
    searchByResort();
});

function getHotels(countryId, resortId, starId, oldTS) {

    if (resortId === "0" || resortId === undefined || resortId === null) {
        var sendData = {
            'countryId': countryId,
            'starId': starId,
            'operatorId': 3,
        };

    } else {

        var sendData = {
            'countryId': countryId,
            'starId': starId,
            'operatorId': 3,
            'resortId': resortId,
        };
    }

    var myNode = document.getElementById("hotels_all");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    $('.search_tour_message').hide();
    $('.search_tour_preloader').show();

    var iWantToBreak = 0;
    $.ajax({
        beforeSend: function(jqXHR, settings) {

        },

        data: $.extend(sendData, {
            '_csrf': $('meta[name="csrf-token"]').attr('content')
        }),
        type: 'post',
        url: '/?Reference=hotel',
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {

        },
        success: function(data, textStatus, jqXHR) {
            dataCount = 0;
            console.log(data);
            if (data.length <= 0) {

                $('.search_tour_message').show();
                $('.search_tour_preloader').hide();

            }
            currentRequest = data;
            delayRequest(data, oldTS);
        },
       
    });
}

counterValue = 0;
amountOfLoadedHotels = 5;
pause = 0;
$(window).scroll(function() {
    if ($(window).scrollTop() > $(document).height() - $(window).height() - 300) {
        if (pause === 0) {
            pause = 1;
            console.log(dataCount);
            dataCount = dataCount + 5;
            console.log(dataCount);
            delayRequest(currentRequest, currentTS, dataCount);
        }
    }
});

function delayRequest(data, oldTS) {

    function sendRequests(dataCount) {
        for (var i = dataCount, len = dataCount + amountOfLoadedHotels; i < len; i++) {
            requestHotelInfo(data[i]);
        }
    }

    sendRequests(dataCount);

    function checkIfFinished(data) {
        if (currentTS === oldTS) {
            if (counterValue === amountOfLoadedHotels) {
                pause = 0;
                counterValue = 0;
                if ($('.one_country_tour:visible').length <= 3) {
                    if (pause === 0) {
                        pause = 1;
                        console.log(dataCount);
                        dataCount = dataCount + 5;
                        console.log(dataCount);
                        delayRequest(currentRequest, currentTS, dataCount);
                    }
                }
            }
        }
    }

    function requestHotelInfo(data) {
        if (data !== undefined) {
            request = $.getJSON('http://stage.tourspo.ru:3000/api/v2/hotel/' + data.id + '+.json', function(dataHotel) {
                starsCount = dataHotel.star.name.charAt(0);
                console.log(starsCount);
                if (currentTS === oldTS) {
                    var stars = "";
                    for (s = 0; s < starsCount; s++) {
                        stars = stars + '<i></i>';
                    }
                    var hotelDescription = dataHotel.description;
                    if (!dataHotel.description) {
                        hotelDescription = "Описание отсутствует";
                    }
                    // $.getJSON('http://cors.io/?u=http://tourspo.ru/api/v1/hotel/'+data.id+'/info ',function(data){
                    //     description = data.hotel.description;
                    // });
                    //todo
                    // console.log(description);
                    var hotelHTML = '<div data-CatalogStars=' + starsCount + ' class="row one_country_tour" style="display:none;"><div class="col-xs-12 col-sm-3 "><div class="full_title visible-xs"><div class="pretitle">' + dataHotel.country.name + ', ' + dataHotel.resort.name + '</div><a href="hotel/' + dataHotel.id +'"><h3>' + dataHotel.name + '<span class="stars">' + stars + '</span></h3></a></div><div class="img_box hotel_img"><a href="hotel/' + dataHotel.id +'"><img src="http://assets.tourspo.ru/img/hotel/' + data.id + '/original/0.jpg" onerror="imgError(this);" alt=""></a></div></div><div class="col-xs-12 col-sm-9 "><div class="full_title hidden-xs"><div class="pretitle">' + dataHotel.country.name + ', ' + dataHotel.resort.name + '</div><a href="hotel/' + dataHotel.id + '"><h3>' + dataHotel.name + '<span class="stars">' + stars + '</span></h3></a></div><div class="description"><p></p><p class="middle">' + hotelDescription + '</p></div><p class="centered visible-xs"><a href="" class="btn_under toggle_arrow_gray" data-target="description" data-parent="one_country_tour" data-text="Описание"><span>Описание</span></a></p><div class="hidden-xs"></div></div></div>';
                    //$('#hotels_all').append();
                    $(hotelHTML).appendTo('#hotels_all').fadeIn(500);
                    counterValue++;
                    hideByStars();
                    checkIfFinished(counterValue);
                }
            });
        }
    }
}

var url = window.location.href;
var params = url.split('?');

function hideByStars(mobile) {
    if (window.innerWidth < 768) {
        var selector = 'smth1';
        var starsCount = $('.starsMobile li .active').length;
    } else {
        var selector = 'smth';
        var starsCount = $('.stars li .active').length;
    }
    if (document.getElementById(selector).checked) {

        for (var i = 0; i < starsCount; i++) {
            $('div[data-CatalogStars=' + i + ']').hide();
        }

        for (var i = starsCount; i < 6; i++) {
            $('div[data-CatalogStars=' + i + ']').fadeIn(500);
        }

    } else {

        $('div[data-CatalogStars=' + starsCount + ']').fadeIn(500);
        switch (starsCount) {
            case 1:
                $('div[data-CatalogStars=2]').hide();
                $('div[data-CatalogStars=3]').hide();
                $('div[data-CatalogStars=4]').hide();
                $('div[data-CatalogStars=5]').hide();
                break;
            case 2:
                $('div[data-CatalogStars=3]').hide();
                $('div[data-CatalogStars=4]').hide();
                $('div[data-CatalogStars=5]').hide();
                $('div[data-CatalogStars=1]').hide();
                break;
            case 3:
                $('div[data-CatalogStars=2]').hide();
                $('div[data-CatalogStars=4]').hide();
                $('div[data-CatalogStars=5]').hide();
                $('div[data-CatalogStars=1]').hide();
                break;
            case 4:
                $('div[data-CatalogStars=2]').hide();
                $('div[data-CatalogStars=3]').hide();
                $('div[data-CatalogStars=5]').hide();
                $('div[data-CatalogStars=1]').hide();
                break;
            case 5:
                $('div[data-CatalogStars=2]').hide();
                $('div[data-CatalogStars=3]').hide();
                $('div[data-CatalogStars=4]').hide();
                $('div[data-CatalogStars=1]').hide();
                break;
        }
    }

    if ($('.one_country_tour:visible').length <= 0) {
        if ((dataCount+5) >= currentRequest.length){
            $('.search_tour_message').show();
            $('.search_tour_preloader').hide();
        } else {
            $('.search_tour_preloader').show();
            if (pause === 0) {
            pause = 1;
            dataCount = dataCount + 5;
            delayRequest(currentRequest, currentTS, dataCount);
            }
        }
    } else {
        $('.search_tour_message').hide();
        $('.search_tour_preloader').hide();
    }
}

function startSearch() {

    if (params[1] !== undefined) {
        if (params[2] === undefined) {
            $('#countryList').selectpicker('val', params[1]);
            searchByCountry();
        } else {

            $('#countryList').selectpicker('val', params[1]);
            changeResort(params[1]);
            setTimeout(function() {
                $('#resortList').selectpicker('val', params[2]);
                searchByResort();
            }, 400);
        }
    }
}
$(document).on('click', '.stars:eq(0) li:gt(0) span, .stars:eq(1) li:gt(0) span', function() {
    hideByStars();
});

$(document).on('click', '.starsMobile:eq(0) li:gt(0) span, .starsMobile:eq(1) li:gt(0) span', function() {
    hideByStars();
});
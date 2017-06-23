/* ----------------- DATASET FOR TESTING -----------------*/


var toOutput = "";
var iterator = 1;
var iterator2 = 1;
var list = $("#list");

/* ----------------- API FORMATS -----------------*/

function formatDoctorsSmall(item) {
    toOutput += '<div class="col-sm-4 preCards">';
    toOutput += '<a href="../doctors/dottore.html?' + item.id + '">';
    toOutput += '<div class="row cards card-small">';
    toOutput += '<div class="col-sm-3 col-xs-2"><img src="../../assets/img/' + item.image + '" width="40px"></div>';
    toOutput += '<div class="col-sm-9 col-xs-10"><b>' + item.name + ' ' + item.surname + '</b><br>' + item.location + '</div>';
    toOutput += '</div></a></div>';
    if (iterator % 3 == 0) {
        toOutput += '</div><div class="row">';
    }
    iterator++;
}
function formatLocations(item) {
    toOutput += '<div class="col-sm-6 preCards">';
    toOutput += '<a href="../locations/sede.html?' + item.id + '">';
    toOutput += '<div class="box">';
    toOutput += '<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';
    toOutput += '<div class="cityname">' + item.name + '</div>';
    toOutput += '</div></a></div>';
    if (iterator % 2 == 0) {
        toOutput += '</div></div><div class="row"><div class="col-md-8 col-md-offset-2">';
    }
    iterator++;
}

function formatDoctorsBig(item) {
    toOutput += '<div class="col-sm-6 preCards">';
    toOutput += '<a href="../doctors/dottore.html?' + item.id + '">';
    toOutput += '<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
    toOutput += '<div class="cards card-big">';
    toOutput += '<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';
    toOutput += '<div class="col-md-10 col-xs-9">Email: ' + item.email + '<br>Telefono: ' + item.phonenumber + '<br>Ufficio: #' + item.office + ', ' + item.location + '</div>';
    toOutput += '</div></a></div>';
    if (iterator2 % 2 == 0) {
        toOutput += '</div><div class="row">';
    }
    iterator2++;
}

function levelFormatterDoctorsServices(item) {
    toOutput += '<br /><a class="serviceTitle" href="../services/service.html?' + item.serviceid + '"><h3>' + item.service_name + '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></h3></a>';
    list.append((item.doctors).map(formatDoctorsBig));
    toOutput += '</div><div class="row">';
    iterator2 = 1;
}

function levelFormatterDoctorsLocations(item) {
    toOutput += '<a class="serviceTitle" href="../locations/sede.html?' + item.location_id + '"><h3>' + item.location_name + '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></h3></a>';
    list.append((item.doctors).map(formatDoctorsBig));

    iterator2 = 1;
}

function formatDoctorsForService(item) {
    var cont = $('#content');
    var dynamicbreadcrumb = $('#dynamicbreadcrumb');
    var out = '';

    dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="../services/index.html">Servizi</a></li><li class="breadcrumb-item active">' + item[1].service_name + '</li></ol>');

    out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Dottori che operano in</span><a href="../services/service.html?' + item[1].service_id + '" class="green">' + item[1].service_name + '</a></h2><br />';
    out += '<br />';

    cont.append(out);
    item.map(formatDoctorsForServiceDetail);
}

// NOT BREADCRUMBABLE
function formatDoctorsForServiceDetail(item) {
    var cont = $('#content');
    var out = '';

    out += '<div class="col-sm-6 preCards">';
    out += '<a href="../doctors/id/' + item.id + '.html">';
    out += '<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
    out += '<div class="cards card-big">';
    out += '<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';
    out += '<div class="col-md-10 col-xs-9">Email: ' + item.email + '<br>Telefono: ' + item.phonenumber + '<br>Ufficio: #' + item.office + ', ' + item.location + '</div>';
    out += '</div></a></div>';

    cont.append(out);
}

/* ----------------- NAV JS -----------------*/

$(document).ready(function () {
    $('#nav-menu').click(function () {
        $('#nav-menu').toggleClass('open');
        $('.nav-resp').toggleClass('open');
    });
    if (typeof init === "function") {
        init();
    }
    //This variable must been set on the html page to call the APIs
    if (apiCall != "") {
        show(apiCall);
    }
});


/* ----------------- API -----------------*/
function show(what, callback) {
    var levels = what.split("/");
    var level1 = levels[0];
    var level2 = levels[1];
    var parameters = window.location.search.substr(1);

    if (level1 == "services" && level2 == "locations") {
        what = what + '/' + window.location.search.substr(1);
    }

    console.log(what);

    fetch("/api/" + what)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            toOutput += '<div class="row">';

            switch (level1) {
                case "locations":
                case "location":
                case "howtoreach":
                case "faq":
                case "work":
                case "presentazione":
                case "services":
                case "service":
                case "doctor":
                    data.map(format);
                    break;
                case "doctors":
                    switch (level2) {
                        case "services":

                            if (parameters != "") {
                                formatDoctorsForService(data);
                            }
                            else {
                                data.map(levelFormatterDoctorsServices);
                            }

                            break;
                        case "locations":
                            data.map(levelFormatterDoctorsLocations);
                            break;
                        default:
                            data.map(formatDoctorsSmall);
                            break;
                    }

                    break;
                default:
                    console.log("NoSuchParameter");
                    break;
            }
            toOutput += '</div>';
            list.append(toOutput);
        });

}

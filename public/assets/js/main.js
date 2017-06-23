var toOutput = "";
var iterator = 1;
var iterator2 = 1;

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

    //console.log(what);

    fetch("/api/" + what)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            toOutput += '<div class="row">';

            data.map(format);

            toOutput += '</div>';
            $("#list").append(toOutput);
        });
}
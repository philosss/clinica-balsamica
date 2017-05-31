/* ----------------- DATASET FOR TESTING -----------------*/


/*
var data = [
{
name: "prova1",
address: "via roma, milano",
phonenumber: "333333333",
description: "che bella questa sede",
id: 1
}
];
*/



/* ----------------- API FORMATS -----------------*/

function formatDoctors(item) {
    console.log(item);
    return '<div class="card">Nome: ' + item.firstname + '<br>Cognome: ' + item.lastname + '</div>';
}

function formatLocations(item) {
    return '<div class="card">Nome: '+item.name+'</div>';
}








/* ----------------- NAV JS -----------------*/

$(document).ready(function() {
    $('#nav-menu').click(function() {
        $('#nav-menu').toggleClass('open');
        $('.nav-resp').toggleClass('open');
    });
});



/* ----------------- API -----------------*/
function show(what, callback) {
    var levels = what.split("/");
    var level1 = levels[0];
    fetch("/" + what)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var list = $("#list");
            switch (level1) {
                case "locations":
                    list.append(data.map(formatLocations));
                    break;
                case "services":
                    list.append(data.map(formatServices));
                    break;
                case "doctors":
                    list.append(data.map(formatDoctors));
                    break;
                default:
                    console.log("NoSuchParameter");
            }
        });

}
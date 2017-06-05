/* ----------------- DATASET FOR TESTING -----------------*/


var toOutput="";

/* ----------------- API FORMATS -----------------*/


function formatDoctorsSmall(item) {
    toOutput+='<div class="col-sm-4">';
    toOutput+='<a href="../doctors/id/'+ item.id +'.html">';
    toOutput+='<div class="row cards-small">';
    toOutput+='<div class="col-sm-3 col-xs-2"><img src="../../assets/img/' + item.image + '" / width="40px"></div>';       
    toOutput+='<div class="col-sm-9 col-xs-10"><b>' + item.name + ' ' + item.surname + '</b><br>'+item.location+'</div>';
    toOutput+='</div></a></div>';
    if(item.id%3==0){
        toOutput+='</div><div class="row">';
    }
}




function formatDoctorsServices(item) {

    toOutput+='<div class="col-sm-6">';
    toOutput+='<a class="nodec" href="../doctors/id/'+ item.id +'.html">';
    toOutput+='<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
    toOutput+='<div class="card">';
    toOutput+='<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';       
    toOutput+='<div class="col-md-10 col-xs-9">Email: '+item.email+'<br>Telefono: '+item.phonenumber+'<br>Ufficio: #'+item.office+', '+item.location+'</div>';
    toOutput+='</div></a></div>';
    if(item.id%2==0){
        toOutput+='</div><div class="row">';
    }

}







function formatLocations(item) {
    //return '<div class="card">Nome: '+item.name+'</div>';
}








/* ----------------- NAV JS -----------------*/

$(document).ready(function() {
    $('#nav-menu').click(function() {
        $('#nav-menu').toggleClass('open');
        $('.nav-resp').toggleClass('open');
    });
    //This variable must been set on the html page to call the APIs
    if(apiCall!=""){ 
    	show(apiCall);
    }
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
                	toOutput+='<div class="row">';
                    level2=levels[1];
                    switch(level2){
                        case "services":
                            data.map(formatDoctorsServices);
                        case "locations":
                            data.map(formatDoctorsLocations);
                        break;
                        case "id":
                            //doctor's profile
                        break;
                        default:
                            data.map(formatDoctorsSmall);
                        break;
                    }
                    toOutput+='</div>';
                    break;
                default:
                    //console.log("NoSuchParameter");
                    break;
            }
            list.append(toOutput);
        });

}
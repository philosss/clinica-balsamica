/* ----------------- DATASET FOR TESTING -----------------*/


var toOutput="";
var iterator=1;

/* ----------------- API FORMATS -----------------*/


function formatDoctorsSmall(item) {
    toOutput+='<div class="col-sm-4 preCards">';
    toOutput+='<a href="../doctors/id/'+ item.id +'.html">';
    toOutput+='<div class="row cards card-small">';
    toOutput+='<div class="col-sm-3 col-xs-2"><img src="../../assets/img/' + item.image + '" width="40px"></div>';       
    toOutput+='<div class="col-sm-9 col-xs-10"><b>' + item.name + ' ' + item.surname + '</b><br>'+item.location+'</div>';
    toOutput+='</div></a></div>';
    if(iterator%3==0){
        toOutput+='</div><div class="row">';
    }
    iterator++;
}
function formatLocations(item) {
    toOutput+='<div class="col-sm-6 preCards">';
    toOutput+='<a href="../locations/id/'+ item.id +'.html">';
    toOutput+='<div class="box">';
    toOutput+='<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';       
    toOutput+='<div class="cityname">' + item.name + '</div>';
    toOutput+='</div></a></div>';
    if(iterator%2==0){
        toOutput+='</div><div class="row">';
    }
    iterator++;
}



function formatDoctorsServices(item) {


    toOutput+='<div class="col-sm-6 preCards">';
    toOutput+='<a href="../doctors/id/'+ item.id +'.html">';
    toOutput+='<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
    toOutput+='<div class="cards card-big">';
    toOutput+='<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';       
    toOutput+='<div class="col-md-10 col-xs-9">Email: '+item.email+'<br>Telefono: '+item.phonenumber+'<br>Ufficio: #'+item.office+', '+item.location+'</div>';
    toOutput+='</div></a></div>';
    if(iterator%2==0){
        toOutput+='</div><div class="row">';
    }
    iterator++;
}

function levelFormatterDoctorsServices(item){
    console.log("asas");
    toOutput+='<h1>1</h1>';
    list.append(data.map(formatDoctorsServices));

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
            toOutput+='<div class="row">';
            switch (level1) {
                case "locations":
                    list.append(data.map(formatLocations));
                    break;
                case "services":
                    list.append(data.map(formatServices));
                    break;
                case "doctors":
                	
                    level2=levels[1];
                    switch(level2){
                        case "services":
                            data.map(levelFormatterDoctorsServices);
                        case "locations":
                            data.map(levelFormatterDoctorsLocations);
                        break;
                        case "id":
                            //doctor's profile
                        break;
                        default:
                            data.map(formatDoctorsSmall);
                        break;
                    }
                    
                    break;
                default:
                    //console.log("NoSuchParameter");
                    break;
            }
            toOutput+='</div>';
            list.append(toOutput);
        
        });

}
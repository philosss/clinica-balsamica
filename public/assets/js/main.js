/* ----------------- DATASET FOR TESTING -----------------*/


var toOutput="";
var iterator=1;
var iterator2=1;
var list = $("#list");

/* ----------------- API FORMATS -----------------*/

function formatFaq(item) {
    toOutput+='<div><h3>'+item.question+'</h3>';
    toOutput+='<p>'+item.answer+'</p></div>';
}
function formatAbout(item) {
    toOutput+='<p>'+item+'</p>';
}
function formatDoctorsSmall(item) {
    toOutput+='<div class="col-sm-4 preCards">';
    toOutput+='<a href="../doctors/dottore.html?"'+item.id+'>';
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
    toOutput+='<a href="../locations/sede.html?'+ item.id +'">';
    toOutput+='<div class="box">';
    toOutput+='<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';
    toOutput+='<div class="cityname">' + item.name + '</div>';
    toOutput+='</div></a></div>';
    if(iterator%2==0){
        toOutput+='</div></div><div class="row"><div class="col-md-8 col-md-offset-2">';
    }
    iterator++;
}
function formatServices(item) {
    toOutput+='<div class="col-sm-6 preCards">';
    toOutput+='<a href="../services/service.html?'+ item.id +'">';
    toOutput+='<div class="box">';
    toOutput+='<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';
    toOutput+='<div class="cityname">' + item.name + '</div>';
    toOutput+='</div></a></div>';
    if(iterator%2==0){
        toOutput+='</div></div><div class="row"><div class="col-md-8 col-md-offset-2">';
    }
    iterator++;
}
function formatHowToReach(item) {
    toOutput+='<div class="col-sm-6 preCards">';
    toOutput+='<a href="../locations/sede.html?'+ item.id +'">';
    toOutput+='<div class="HowToReachbox">';
    toOutput+='<div class="coverimg"><img src="../../assets/img/' + item.image + '"></div>';
    toOutput+='<div class="cityname"><span>' + item.name + '</span><br>'+ item.address + '<br>'+ item.phonenumber + '</div>';
    toOutput+='</div></a></div>';
    if(iterator%2==0){
        toOutput+='</div></div><div class="row"><div class="col-md-8 col-md-offset-2">';
    }
    iterator++;
}

function formatDoctorsBig(item) {
    toOutput+='<div class="col-sm-6 preCards">';
    toOutput+='<a href="../doctors/dottore.html?'+ item.id +'">';
    toOutput+='<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
    toOutput+='<div class="cards card-big">';
    toOutput+='<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';
    toOutput+='<div class="col-md-10 col-xs-9">Email: '+item.email+'<br>Telefono: '+item.phonenumber+'<br>Ufficio: #'+item.office+', '+item.location+'</div>';
    toOutput+='</div></a></div>';
    if(iterator2%2==0){
        toOutput+='</div><div class="row">';
    }
    iterator2++;
}

function levelFormatterDoctorsServices(item){
    toOutput+='<br /><a class="serviceTitle" href="../services/service.html?'+item.serviceid+'"><h3>'+item.service_name+'<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></h3></a>';
    list.append((item.doctors).map(formatDoctorsBig));
    toOutput+='</div><div class="row">';
    iterator2=1;
}

function levelFormatterDoctorsLocations(item){
    toOutput+='<a class="serviceTitle" href="../locations/sede.html?'+item.location_id+'"><h3>'+item.location_name+'<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></h3></a>';
    list.append((item.doctors).map(formatDoctorsBig));

    iterator2=1;
}

function formatServicesInDoctor(item) {
    $("#services").append('<a href="../../pages/services/service.html?'+item.id+'"><span class="colored">'+item.name+'</span></a><br/>')
}

function formatResponsibleOfInDoctor(item) {
    $("#responsibleOf").append('<a href="../../pages/services/service.html?'+item.id+'"><span class="colored">'+item.name+'</span></a><br/>')
}

function formatDoctorDetails(item) {
    $(".doctorProfileImage").css("background-image", "url('../../assets/img/"+item.image+"')")
    $("#name-surname").html(item.name+" "+item.surname);
    $("#email").html(item.email);
    $("#phonenumber").html(item.phonenumber);
    $("#office").html("#"+item.office+", "+item.locationName);
    
    if(item.services.length>0) {
        item.services.map(formatServicesInDoctor);
    } else {
         $("#services").html("Nessuno");
    }
    if(item.responsibleOf.length>0) {
        item.responsibleOf.map(formatResponsibleOfInDoctor);
    } else {
         $("#responsibleOf").html("Nessuno");
    }
}

function formatServiceDetails(item) {
  var cont = $('#content');
  var image = $('#imageSpacer');
  var dynamicbreadcrumb = $('#dynamicbreadcrumb');

  image.css("background-image", 'url("../../assets/img/'+item.image+'")');
  dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="index.html">Servizi</a></li><li class="breadcrumb-item active">'+item.name+'</li></ol>');

  var out = '';

  out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Scopri Questo Servizio</span>'+item.name+'</h2><br />';
  out += item.description;
  out += '<br />';

  out += '<div class="col-md-6 col-sm-12 text-center"><a href="../../pages/doctors/for_service.html?' + item.id + '" class="btn btn-primary btn-md">Scopri i dottori che offrono questo servizio</a></div>';
  out += '<div class="col-md-6 col-sm-12 text-center"><a href="../../pages/locations/for_service.html?' + item.id + '" class="btn btn-primary btn-md">Dov\'è disponibile questo servizio</a></div>';

  cont.append(out);
}

function formatLocationDetails(item) {
  var cont = $('#content');
  var image = $('#imageSpacer');
  var dynamicbreadcrumb = $('#dynamicbreadcrumb');
  image.css("background-image", 'url("../../assets/img/background/'+item.image+'")');

  //console.log(item);
  dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="index.html">Sedi</a></li><li class="breadcrumb-item active">'+item.name+'</li></ol>');
  var out = '';

  out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Le nostre sedi</span>'+item.name+'</h2><br />';
  out += item.description;
  out += '<br />';

  out += '<div class="text-center"><a class="btn btn-primary btn-md" href="../services/for_location.html?'+item.id+'">Scopri i servizi disponibili qui</a></div>';

  cont.append(out);
}

function formatDoctorsForService(item) {
  var cont = $('#content');
  var dynamicbreadcrumb = $('#dynamicbreadcrumb');
  var out = '';

  dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="../services/index.html">Servizi</a></li><li class="breadcrumb-item active">'+item[1].service_name+'</li></ol>');

  out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Dottori che operano in</span><a href="../services/service.html?'+ item[1].service_id +'" class="green">'+item[1].service_name+'</a></h2><br />';
  out += '<br />';

  cont.append(out);
  item.map(formatDoctorsForServiceDetail);
}

// NOT BREADCRUMBABLE
function formatDoctorsForServiceDetail(item) {
  var cont = $('#content');
  var out = '';

  out+='<div class="col-sm-6 preCards">';
  out+='<a href="../doctors/id/'+ item.id +'.html">';
  out+='<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
  out+='<div class="cards card-big">';
  out+='<div class="col-md-2 col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';
  out+='<div class="col-md-10 col-xs-9">Email: '+item.email+'<br>Telefono: '+item.phonenumber+'<br>Ufficio: #'+item.office+', '+item.location+'</div>';
  out+='</div></a></div>';

  cont.append(out);
}


// location for service
function formatLocationsForService(item) {

  var cont = $('#content');
  var dynamicbreadcrumb = $('#dynamicbreadcrumb');
  dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="../services/index.html">Servizi</a></li><li class="breadcrumb-item active">'+item[1].service_name+'</li></ol>');


  var out = '';

  out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Sedi disponibili per</span><a href="../services/service.html?'+ item[1].service_id +'" class="green">'+item[1].service_name+'</a></h2><br />';
  out += '<br />';



  out += '<div class="row"><div class="col-md-8 col-md-offset-2">';

  for (var i = 0; i<item.length; i++) {
    out+='<div class="col-sm-6 preCards">';
    out+='<a href="../locations/sede.html?'+ item[i].id +'">';
    out+='<div class="box">';
    out+='<div class="coverimg"><img src="../../assets/img/cards/' + item[i].image + '"></div>';
    out+='<div class="cityname">' + item[i].name + '</div>';
    out+='</div></a></div>';

    if(i%2!=0){
        out+='</div></div><div class="row"><div class="col-md-8 col-md-offset-2">';
    }
  }



  cont.append(out);
}
function formatServicesForLocation(item) {
  var cont = $('#content');
  var image = $('#imageSpacer');
  var dynamicbreadcrumb = $('#dynamicbreadcrumb');

  image.css("background-image", 'url("../../assets/img/background/'+item[1].location_image+'")');
  dynamicbreadcrumb.html('<ol class="breadcrumb col-sm-offset-1"><li class="breadcrumb-item"><a href="../../index.html">Home</a></li><li class="breadcrumb-item"><a href="index.html">Sedi</a></li><li class="breadcrumb-item active">'+item[1].location_name+'</li></ol>');



  var out = '';

  out = '<h2 class="text-uppercase" style="text-align:center;"><span class="eyebrow">Servizi disponibili per</span><a href="../locations/sede.html?'+ item[1].location_id +'" class="green">'+item[1].location_name+'</a></h2><br />';





  for (var i = 0; i<item.length; i++) {
    out+='<div class="col-sm-6 preCards">';
    out+='<a href="../services/service.html?'+ item[i].id +'">';
    out+='<div class="box">';
    out+='<div class="coverimg"><img src="../../assets/img/cards/' + item[i].image + '"></div>';
    out+='<div class="cityname">' + item[i].name + '</div>';
    out+='</div></a></div>';
    if(iterator%2==0){
        out+='</div><div class="row">';
    }
    iterator++;
  }

  cont.append(out);
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
    var level2 = levels[1];
    var parameters = window.location.search.substr(1);

    if (level1 == "service" || level1 == "location") {
      what=what+'/'+window.location.search.substr(1);
    }
    if (level1 == "doctors" && level2 == "services" && parameters != '') {
      what=what+'/'+parameters;
    }
    if (level1 == "locations" && level2 == "services" && parameters != '') {
      what=what+'/'+parameters;
    }
    if (level1 == "services" && level2 == "locations") {
      what=what+'/'+window.location.search.substr(1);
    }

    console.log(what);

    fetch("/api/" + what)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            toOutput+='<div class="row">';

            switch (level1) {
                case "locations":
                    if (level2 == "services") {
                      formatLocationsForService(data);
                    }
                    else {
                      toOutput += '<div class="col-md-8 col-md-offset-2">';
                      data.map(formatLocations);
                    }

                  break;
                case "location":
                  data.map(formatLocationDetails);
                  break;
                case "howtoreach":
                    toOutput += '<div class="col-md-8 col-md-offset-2">';
                    data.map(formatHowToReach);
                    break;
                case "faq":
                    data.map(formatFaq);
                    break;
                case "work":
                    data.map(formatFaq);
                    break;
                case "presentazione":
                    data.map(formatAbout);
                    break;
                case "services":
                  if (level2 == "locations") {
                      formatServicesForLocation(data);
                    }
                    else {
                      toOutput += '<div class="col-md-8 col-md-offset-2">';
                      data.map(formatServices);
                    }

                  break;
                case "service":
                  data.map(formatServiceDetails);
                  break;
                case "doctor":
                  data.map(formatDoctorDetails);
                  break;
                case "doctors":
                    switch(level2){
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
            toOutput+='</div>';
            list.append(toOutput);
        });

}

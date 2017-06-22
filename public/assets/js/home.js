$(document).ready(function() {
    fetchTopDoctors(6);
    fetchTopServices(3);
});


let doctorsContainer = $('#content-doctors');
let servicesContainer = $('#content-services');

function fetchTopDoctors(limit) {
  fetch("/api/top-doctors/"+limit)
      .then(function(response) {
          return response.json();
      })
      .then(function(data) {
        data.map(formatTopDoctors);
      });
}

function fetchTopServices(limit) {
  fetch("/api/top-services/"+limit)
      .then(function(response) {
          return response.json();
      })
      .then(function(data) {
        data.map(formatTopServices);
      });
}


function formatTopDoctors(item) {
  var out = '';

  out+='<div class="col-sm-4 preCards">';
  out+='<a href="../doctors/id/'+ item.id +'.html">';
  out+='<div class="row green-bar">DR.' + item.name + ' ' + item.surname + '</div>';
  out+='<div class="cards card-big">';
  out+='<div class="col-xs-3"><img src="../../assets/img/' + item.image + '" / width="60px"></div>';
  out+='<div class="col-xs-9">Email: '+item.email+'<br>Telefono: '+item.phonenumber+'<br>Ufficio: #'+item.office+', '+item.location+'</div>';
  out+='</div></a></div>';

  doctorsContainer.append(out);
}

function formatTopServices(item) {
  var out = '';

  out+='<div class="col-sm-4 preCards">';
  out+='<a href="../services/service.html?'+ item.id +'">';
  out+='<div class="box">';
  out+='<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';
  out+='<div class="cityname">' + item.name + '</div>';
  out+='</div></a></div>';

  servicesContainer.append(out);
}

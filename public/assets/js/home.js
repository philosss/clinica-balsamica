let infoForm = $("#info-form");  // Form reference

$(document).ready(function() {
    fetchTopDoctors(6);
    fetchTopServices(3);

    infoForm.on('submit', validateForm);

});


// Form Validation
function validateForm(e) {
  e.preventDefault();

  let email = $("#email");
  let message = $("#comment");

  console.log(email.val());
  console.log(message.val());

  if (validateEmail(email.val())) {
    if (message.val() != "" && message.val().length > 20) {

      //Send Data

      console.log("/api/email/info?message=" + message.val() + "&email=" + email.val());

      fetch("/api/email/info?message=" + message.val() + "&email=" + email.val())
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        if (data.status == "OK") {
          alert("Messaggio Inviato correttamente, riceverai una risposta a breve!");
        }
        else {
          alert("Si è verificato un'errore... Riprova...");
        }
      });


    }
    else {
      alert("Il messaggio che hai scritto è troppo corto... Deve essere lungo almeno 20 caratteri!");
    }
  }
  else {
    alert("Inserisci una mail valida...");
  }

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


// DOCTORS AND SERVICES SERVER METHODS

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
  out+='<a href="../pages/doctors/dottore.html?'+ item.id +'">';
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
  out+='<a href="../pages/services/service.html?'+ item.id +'">';
  out+='<div class="box">';
  out+='<div class="coverimg"><img src="../../assets/img/cards/' + item.image + '"></div>';
  out+='<div class="cityname">' + item.name + '</div>';
  out+='</div></a></div>';

  servicesContainer.append(out);
}

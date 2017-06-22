let infoForm = $("#contacts-form");  // Form reference

$(document).ready(function() {


    infoForm.on('submit', validateForm);

});


// Form Validation
function validateForm(e) {
  e.preventDefault();
  let name = $("#name");
  let email = $("#email");
  let subject = $("#object");
  let message = $("#message");

  console.log(name.val());
  console.log(email.val());
  console.log(subject.val());
  console.log(message.val());

  if (validateEmail(email.val())) {
    if (message.val() != "" && message.val().length > 20) {
      if(name.val() != ""){

      //Send Data

      console.log("/api/email/info?trype=1&message=" + message.val() + "&email=" + email.val()+"&name="+name.val()+"&subject="+subject.val());

      fetch("/api/email/info?trype=1&message=" + message.val() + "&email=" + email.val()+"&name="+name.val()+"&subject="+subject.val())
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
    
    }else{
      alert("Il nome inserito non è valido")
    }


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
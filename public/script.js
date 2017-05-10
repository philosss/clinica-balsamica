/* eslint-env browser */
console.log("# Starting up the application");

function clearTable() {
  $("#myrows").find("tr").remove();
}

function addRow(pet) {
  console.log("Adding row");
  let age = new Date().getFullYear() - pet.born;
  $("#myrows").append(
    `
    <tr>
       <td>${pet.id}</td>
       <td>${pet.name}</td>
       <td>${pet.tag}</td>
       <td>${age}</td>
       <td><button onclick="deletePet(${pet.id})">X</button></td>
    </ tr>
`
  );
}

function deletePet(id) {
  let idn = parseInt(id);
  fetch(`/pets/${idn}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(response => {
      if (response.error === "400") {
        showResponse("KO");
      } else {
        showResponse("OK");
        updatePetsList();
      }
    });
}

function clickAddPet() {
  /* Disable button and show dialog for inserting pet */
  $("#addPetButton").hide();
  $("#addPetFormDiv").show();
}

function showResponse(type /* OK, KO*/) {
  $("#addPetFormDiv").hide();
  $(`#responseData${type}`).show();
  setTimeout(
    () => {
      $(`#responseData${type}`).hide();
      $("#addPetButton").show();
      updatePetsList();
    },
    2000
  );
}

window.showResponse = showResponse;

function formDataAsJSON(formData) {
  let x = {};
  for (var pair of formData.entries()) {
    x[pair[0]] = pair[1];
  }
  return JSON.stringify(x);
}

function clickSubmitPetData() {
  let headers = new Headers();
  headers.set("Content-Type", "application/json");

  let formdata = formDataAsJSON(new FormData(
    document.getElementById("addpetform")
  ));

  fetch("/pets", {
    method: "POST",
    body: formdata,
    headers: headers
  })
    .then(response => response.json())
    .then(response => {
      if (response.error === "400") {
        showResponse("KO");
      } else {
        showResponse("OK");
      }
    });
}

function clickCancelPetSubmit() {
  $("#addPetButton").show();
  $("#addPetFormDiv").hide();
}

/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

let start = 0;
let count = 5;
let sortby = "none"; /* Can be none, "+age", "-age"*/

function setSort(x) {
  sortby = x;
  updatePetsList();
}

function nextPage() {
  start = start + count;
  updatePetsList();
}

function previousPage() {
  if (start >= count) {
    start = start - count;
    updatePetsList();
  }
}

function updatePetsList() {
  fetch(`/pets?start=${start}&limit=${count}&sort=${sortby}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearTable();
      data.map(addRow);
    });
}

function startup() {
  $(`#responseDataOK`).hide();
  $(`#responseDataKO`).hide();
  $("#addPetFormDiv").hide();
  updatePetsList();
}

startup();

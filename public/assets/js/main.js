
console.log("Startup");

var data = [
    {firstname : "Malcom", lastname: "Reynolds"},
    {firstname : "Kaylee", lastname: "Frye"},
    {firstname : "Jayne", lastname: "Cobb"}
];



/*function showAll(what){
	/*fetch("/${what}")
	.then(function(response) {
      return response.json();
    })
    .then(function(data) {
      document.getElementById("list").innerHTML = data.map(getFullName);
    //});
}*/


function showAll(what) {
	var list=$("#list")
	switch(what) {
		case "doctors":
			list.append(data.map(formatDoctors));
		break;
	}
}

function formatDoctors(item,index) {
    return [item.firstname,item.lastname].join(" ");
}



$(document).ready(function(){
	$('#nav-icon4').click(function(){
		$('#nav-icon4').toggleClass('open');
    $('.nav-resp').toggleClass('open');
	});
});

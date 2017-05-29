/* ----------------- DATASET FOR TESTING -----------------*/


var data = [
    {firstname : "Malcom", lastname: "Reynolds"},
    {firstname : "Kaylee", lastname: "Frye"},
    {firstname : "Jayne", lastname: "Cobb"}
];



/* ----------------- API FORMATS -----------------*/

function formatDoctors(item) {
    return '<div class="card">Nome: '+item.firstname+'<br>Cognome: '+item.lastname+'</div>';
}









/* ----------------- OTHER JS -----------------*/

$(document).ready(function(){
	$('#nav-icon4').click(function(){
		$('#nav-icon4').toggleClass('open');
    $('.nav-resp').toggleClass('open');
	});
});



/* ----------------- API -----------------*/
function show(what) {
	var levels=what.split("/");
	var level1=levels[0];
	/*fetch("/"+what)
	.then(function(response) {
      return response.json();
    })
    .then(function(data) {*/
    var list=$("#list");
	switch(level1) {
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
    //});
	
}

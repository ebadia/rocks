(function() {
'use strict';

/* Services */

angular.module('myApp.services', [])

// put your services here!
//.service('serviceName', ['dependency', function(dependency) {}]);

.factory('Invoice', ['$http', function( $http){
	var factory = {};
	var invoice_url = "http://104.197.17.246:5984//eneresinvoice/_design/facturas/_view/argos";
	//var invoice_url = "http://127.0.0.1:5984/eneresinvoice/_design/facturas/_view/argos";

	factory.facturas = function(){
		return $http.get(invoice_url).then( function(data) {
			//console.log("usuario",data);
			return data.data;
		});
	};


	return factory;
}])

.factory('Global',[ '$http' , function( $http ){

	var factory = {};

	factory.CSV = function(JSONData, ReportTitle, ShowLabel){

		//-- sacado de http://jsfiddle.net/hybrid13i/JXrwM/

	    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	    
	    var CSV = '';    
	    //Set Report title in first row or line
	    
	    //CSV += ReportTitle + '\r\n\n';

	    //This condition will generate the Label/Header
	    if (ShowLabel) {
	        var row = "";
	        
	        //This loop will extract the label from 1st index of on array
	        for (var index in arrData[0]) {
	            
	            //Now convert each value to string and comma-seprated
	            row += index + ',';
	        }

	        row = row.slice(0, -1);
	        
	        //append Label row with line break
	        CSV += row + '\r\n';
	    }
	    
	    //1st loop is to extract each row
	    for (var i = 0; i < arrData.length; i++) {
	        var row = "";
	        
	        //2nd loop will extract each column and convert it in string comma-seprated
	        for (var index in arrData[i]) {
	            row += '"' + arrData[i][index] + '",';
	        }

	        row.slice(0, row.length - 1);
	        
	        //add a line break after each row
	        CSV += row + '\r\n';
	    }

	    if (CSV == '') {        
	        alert("Invalid data");
	        return;
	    }

	    return CSV;

	};

	return factory;
}])

//**********************************************************************
.factory('AuthService', ['$http', 'URL', function($http, URL ) {

	var factory = {};

	factory.login = function(user){
		user.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		console.log(user);
		return $http.post(URL+"getUser", user).then( function(data) {
			console.log("usuario",data);
			return data;
		});
	};

	factory.isAuthenticated = function () {
		//console.log('servicio auth: ' + sessionStorage.logged);
		return !!sessionStorage.logged;
	};

	factory.logout = function () {
		delete sessionStorage.logged;
		return false;
	};

	return factory;

}])

//**********************************************************************
.factory('Sms', ['$rootScope', '$http', 'URL' ,'URL_STATS', function($rootScope, $http, URL, URL_STATS ) {

	var factory = {};

	factory.smsTM = function(obj){

		obj.prefijo = "";
		if ( obj.to.length === 9 )
			obj.to = "34"+obj.to;
		console.log("sms a enviar", obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"sendSMSTM",obj).then( function(data) {
			return data.data;
		});
	};

	factory.putSMS = function(obj){
		console.log("service putSmssss",obj);

		obj.fecha = moment().format('YYYY-MM-DD');
		obj.centre_id = $rootScope.user.centre;
		obj.user_id = $rootScope.user.id;
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"putSMS", obj).then( function(data) {
			return data;
		});
	};

	factory.citasSMS = function(centro, fecha){

		// obj.fecha = moment().format('YYYY-MM-DD');

		return $http.get(URL+"citasSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha).then( function(data) {
			return data.data;
		});
	};

	factory.citasSinMovilSMS = function(centro, fecha){

		// obj.fecha = moment().format('YYYY-MM-DD');

		return $http.get(URL_STATS+"getCitasSinMovil?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha).then( function(data) {
			return data.data;
		});
	};

	factory.citasNoSMS = function(centro, fecha){
		return $http.get(URL+"citasNoSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha).then( function(data) {
			return data.data;
		});
	};

	factory.citasNoSMSReprogramada = function(sms){
		return $http.get(URL+"citasNoSMSReprogramada?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+sms.id).then( function(data) {
			return data.data;
		});
	};
	factory.citasNoSMSLlamada = function(sms){
		return $http.get(URL+"citasNoSMSLlamada?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+sms.id).then( function(data) {
			return data.data;
		});
	};

	

	factory.cumples = function(centro, fecha, phones){

		// obj.fecha = moment().format('YYYY-MM-DD');
		console.log("peticion sms cumples", URL_STATS+"cumples?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha+"&phones="+phones);
		return $http.get(URL_STATS+"cumples?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha+"&phones="+phones).then( function(data) {
			return data.data.data;
			console.log("peticion sms cumples result", data.data.data );
		});
	};

	factory.smscumples = function(centro, fecha){

		// obj.fecha = moment().format('YYYY-MM-DD');

		return $http.get(URL+"cumplesSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha).then( function(data) {
			// console.log("servicio cumplessms",data);
			return data.data;
		});
	};

	factory.sendSMS = function(obj){

		console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"sendSMS", obj).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.SMS = function(centro,fecha){

		return $http.get(URL+"SMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&fecha="+fecha).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.confirmaSMS = function(id){

		return $http.get(URL+"confirmaSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.reprogramaSMS = function(id){

		return $http.get(URL+"reprogramaSMS?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.marcaCitaAvisadaSinMovil = function(centro, cita){
		console.log(cita);

		cita.centro = centro;
		cita.apikey='HAFvxoLmhNeqKj5oN3uWqA';

		console.log(cita);

		return $http.post(URL_STATS+"marcaCitaAvisadaSinMovil", cita).then( function(data) {
			//console.log(data);
			return data;
		});
	};


	return factory;

}])

//**********************************************************************
.factory('Users', ['$http', 'URL', function($http, URL) {

	
	var factory = {};

	factory.getUser = function(login,password){

		var obj = { "login": login, "password": password };
		console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"getUser", obj).then( function(data) {
			return data;
		});
	};

	factory.addUser = function(user){};
	factory.updateUser = function(user){};
	factory.deleteUser = function(id){};


	return factory;

 }])

//**********************************************************************
.factory('PresusPac', ['$http', 'URL', 'URL_STATS', function($http, URL, URL_STATS ) {

	
	var factory = {};

	factory.getPresusPacGesdent = function(centro,numpac){
		return $http.get(URL_STATS+"getDatosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac).then( function(data) {
			return data.data;
		});
	};
	factory.updatePac = function(user){};
	factory.deletePac = function(id){};

	// comprueba si el paciente existe en bd rocks
	factory.comprueba = function(centro,numpac){
		return $http.get(URL+"comprueba?NumPac="+numpac+"&apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			return data.data;
		});
	};

	// da de alta un nuevo paciente en rocks procedente del gesdent
	factory.altapaciente = function(obj){
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"altapaciente", obj).then( function(data) {
			return data.data;
		});
	};

	// recupera datos del paciente del rocks
	factory.getPresusPac = function(centro,numpac){
		return $http.get(URL+"getDatosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac).then( function(data) {
			return data.data;
		});
	};

	return factory;

 }])

//**********************************************************************
.factory('Paciente', ['$http', 'URL', function($http, URL) {

	
	var factory = {};

	factory.ppto = {};

	return factory;

 }])

//**********************************************************************
.factory('Presus', ['$http', 'URL', 'URL_STATS', function($http, URL, URL_STATS) {


	var factory = {};

	factory.recalls = {};

	factory.getPptos = function(centro,tipo){
		return $http.get(URL+"getPptos?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&estado="+tipo).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data;
		});
	};
	// per estadistica
	factory.getPptosMA = function(centro,mes,ano){
		return $http.get(URL+"getPptosMA?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&mes="+mes+"&ano="+ano).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};
	factory.graficosPpto = function(mes,any,centre){
		return $http.get(URL+"graficosPpto?mes="+mes+"&any="+any+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&centre="+centre).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};
	factory.presupuestados = function(centre){
		return $http.get(URL_STATS+"pptosPresupuestados?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centre).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};
	factory.aceptados = function(centre){
		return $http.get(URL_STATS+"pptosAceptados?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centre).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};
	factory.cartera = function(centre, year){
		return $http.get(URL_STATS+"carteraAceptados?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centre+"&year="+year).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};

	// incentivos
	factory.getAprobadosHastaHoy = function(centre){
		return $http.get(URL+"getAprobadosHastaHoy?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centre).then( function(data) {
			//console.log(data.data);
			return data.data.data[0];
		});
	};
	factory.getObjetivosDelTrimestre = function(centre){
		return $http.get(URL+"getObjetivosDelTrimestre?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centre).then( function(data) {
			//console.log(data.data);
			return data.data.data[0];
		});
	};
	// ----- incentivos

	factory.getPptoRecalls = function(id,centro){
		return $http.get(URL+"getPptoRecalls?NumPac="+id+"&apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//factory.recalls = data.data;
			return data.data;
		});
	};
	factory.getPpto = function(id){
		return $http.get(URL+"getPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			console.log(data);
			return data;
		});
	};
	factory.getPptosPaciente = function(centro,id){
		return $http.get(URL+"getPptosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.lastPpto = function(id){
  		return $http.get(URL+"lastPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
  		//console.log(data);
  			return data.data;
		});
	};

	factory.addPpto = function(ppto){
		console.log("desde el servicio...", ppto);
		ppto.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addPpto", ppto).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.addPptoExterno = function(ppto){
		console.log("desde el servicio...", ppto);
		ppto.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addPptoExterno", ppto).then( function(data) {
			//console.log(data);
			return data;
		});

	};
	
	factory.duplicaPpto = function(ppto){
		//console.log(ppto);
		ppto.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"duplicaPpto", ppto).then( function(data) {
			//console.log(data);
			return data;
		});

	};
	
	factory.getLastTtosNumPac = function(centro,id){
		return $http.get(URL_STATS+"getLastTtosNumPac?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+id).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.addRecall = function(recall){
		recall.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addRecall", recall).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.addRecallGD = function(recall){
		recall.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_STATS+"addAnotacionesNumPac", recall).then( function(data) {
			console.log("anotadoooooooo ",data);
			return data;
		});
	};

	factory.updatePpto = function(ppto){
		console.info("para ser actualizado",ppto);
		ppto.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"updatePpto", ppto).then( function(data) {
			//console.log(data);
			return data;
		});

	};
	factory.deletePpto = function(id){
		console.log("borrame " + id);
		return $http.get(URL+"deletePpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.aceptaPpto = function(id){
		console.log("aceptame " + id);
		return $http.get(URL+"aceptaPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.noaceptaPpto = function(id){
		console.log("aceptame " + id);
		return $http.get(URL+"noaceptaPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.deniegaPpto = function(id){
		console.log("deniegame " + id);
		return $http.get(URL+"denegadoPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.conviertePpto = function(id){
		console.log("convierteme " + id);
		return $http.get(URL+"convertidoPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};
	factory.opcionalPpto = function(id){
		console.log("convierteme " + id);
		return $http.get(URL+"opcionalPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.aceptaRecall = function(id,ppto){
		console.log("aceptame " + id);
		return $http.get(URL+"aceptaRecall?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			return data;
		});
	};

	factory.aceptaRecallGD = function(id,ppto){
		ppto.apikey = 'HAFvxoLmhNeqKj5oN3uWqA';
		ppto.centro = id;
		console.log(ppto);
		return $http.post(URL_STATS+"aceptaRecalldeHoyGD", ppto).then( function(data) {
			return data;
		});
	};

	factory.aceptaTodosRecalls = function(id){
		console.log("aceptame " + id);
		return $http.get(URL+"aceptaTodosRecalls?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			return data;
		});
	};
	factory.borraTodosRecalls = function(id){
		console.log("aceptame " + id);
		return $http.get(URL+"borraTodosRecalls?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			return data;
		});
	};
	factory.getRecallsActius = function(centre){
		return $http.get(URL+"getRecallsActius?apikey=HAFvxoLmhNeqKj5oN3uWqA&centre="+centre).then( function(data) {
			console.log("getRecallsActius ", data);
			return data;
		});
	};
	factory.getRecallsActiusGD = function(centro){
		return $http.get(URL_STATS+"getRecallsActiusGD?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			return data.data.data;
		});
	};
	factory.countRecallsActius = function(centre){
		return $http.get(URL+"countRecallsActius?apikey=HAFvxoLmhNeqKj5oN3uWqA&centre="+centre).then( function(data) {
			//console.log("getRecallsActius ", data);
			return data;
		});
	};
	factory.countRecallsActiusGD = function(centre){
		return $http.get(URL_STATS+"countRecallsActiusGD?apikey=HAFvxoLmhNeqKj5oN3uWqA&centre="+centre).then( function(data) {
			//console.log("getRecallsActius ", data);
			return data;
		});
	};

	// Postmark Mail
	factory.sendMail = function(text,dest,tema){
		//console.log("sendMail ");
		//console.log(text);
		//console.log(dest);
		var cap = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width'><title>EneresiRocks</title><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>  <meta name='viewport' content='width=device-width, initial-scale=1.0'>  <meta http-equiv='X-UA-Compatible' content='IE=edge'>  <meta name='format-detection' content='telephone=no'>  <style type='text/css'>  /* RESET */  #outlook a {padding:0;} body {width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; mso-line-height-rule:exactly;}  table td { border-collapse: collapse; }  .ExternalClass {width:100%;}  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}  table td {border-collapse: collapse;}  /* IMG */  img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}  a img {border:none;}  /* Becoming responsive */  @media only screen and (max-device-width: 480px) {  table[id='container_div'] {max-width: 480px !important;}  table[id='container_table'], table[class='image_container'], table[class='image-group-contenitor'] {width: 100% !important; min-width: 320px !important;}  table[class='image-group-contenitor'] td, table[class='mixed'] td, td[class='mix_image'], td[class='mix_text'], td[class='table-separator'], td[class='section_block'] {display: block !important;width:100% !important;}  table[class='image_container'] img, td[class='mix_image'] img, table[class='image-group-contenitor'] img {width: 100% !important;}  table[class='image_container'] img[class='natural-width'], td[class='mix_image'] img[class='natural-width'], table[class='image-group-contenitor'] img[class='natural-width'] {width: auto !important;}  a[class='button-link justify'] {display: block !important;width:auto !important;}  td[class='table-separator'] br {display: none;}  td[class='cloned_td']  table[class='image_container'] {width: 100% !important; min-width: 0 !important;} } table[class='social_wrapp'] {width: auto;} </style></head>";
		var qua = "</html>";
		var obj = {
			"texto": cap+text+qua,
			"destino": dest,
			"tema": tema
		};
		//console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"sendMail", obj).then( function(data) {
			return data;
		});
	};
	factory.purgaPpto = function(data){
		return $http.get(URL+"purgaPpto?apikey=HAFvxoLmhNeqKj5oN3uWqA&data="+data).then( function(data) {
		//console.log("sendMail ");
			//console.log(data.data);
			return data.data;
		});
	};
	factory.users = function(centro){
		return $http.get(URL_STATS+"users?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
		//console.log("sendMail ");
			//console.log(data.data);
			return data.data;
		});
	};

	// ESTADISTICAS 
	factory.operaciones = function(operacion,centro){
		return $http.get(URL_STATS+operacion+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};
	// para operaciones con filtro de colaborador...
	factory.operacionesCol = function(operacion,centro,col){
		return $http.get(URL_STATS+operacion+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro+"&col="+col).then( function(data) {
			console.log(data.data);
			return data.data;
		});
	};

	factory.RatioFracasoImplantes = function(centro){
		return $http.get(URL_STATS+"RatioFracasoImplantes?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data.data;
		});
	};
	factory.RatioFracasoImplantesAnual = function(centro){
		return $http.get(URL_STATS+"RatioFracasoImplantesAnual?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data.data;
		});
	};

	factory.operacionesFacturacion = function(operacion,centro){
		return $http.get(URL_STATS+'f'+operacion+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};

	factory.operacionesFacturacionCol = function(operacion,centro,col){
		return $http.get(URL_STATS+'f'+operacion+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro+"&col="+col).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};

	factory.getUnicosAnuales = function(centro){
		return $http.get(URL_STATS+"getUnicosAnuales?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log(data.data);
			return data.data;
		});
	};

	factory.ratios = function(operacion,centro){
		console.info("service.ratios ", "Aprobar"+operacion);
		return $http.get(URL_STATS+"Aprobar"+operacion+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};

	factory.objetivo = function(centro,mes,ano){
		return $http.get(URL+"facturacionDelMes?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro+"&mes="+mes+"&ano="+ano).then( function(data) {
			//console.log("objetivoooo",data.data);
			return data.data.data;
		});
	};

	factory.objetivoAny = function(centro,ano){
		return $http.get(URL+"facturacionDelAny?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro+"&ano="+ano).then( function(data) {
			//console.log("objetivoooo",data.data);
			return data.data.data;
		});
	};

	factory.feina = function(centro,d){
		//console.log("dataaaaa",d);
		var desde = d.dany+'-'+d.dmes+'-'+d.ddia;
		var hasta = d.hany+'-'+d.hmes+'-'+d.hdia;

		return $http.get(URL+"feina?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log(data.data.data[0]);
			return data.data.data[0];
		});
	};
	factory.feinaGD = function(centro,d){
		console.log("dataaaaa",d);
		var desde = d.dany+''+d.dmes+''+d.ddia;
		var hasta = d.hany+''+d.hmes+''+d.hdia;

		return $http.get(URL_STATS+"feinaGD?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log("FFGGDD...",data.data.data);
			return data.data.data;
		});
	};
	factory.feinaPresusGD = function(centro,d){
		console.log("dataaaaa",d);
		var desde = d.dany+''+d.dmes+''+d.ddia;
		var hasta = d.hany+''+d.hmes+''+d.hdia;

		return $http.get(URL_STATS+"feinaPresusGD?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log("FFGGDD...",data.data.data);
			return data.data.data;
		});
	};
	factory.feina_ao = function(centro,d){
		console.log("dataaaaa",d);
		var desde = d.dany+'-'+d.dmes+'-'+d.ddia;
		var hasta = d.hany+'-'+d.hmes+'-'+d.hdia;

		return $http.get(URL+"feina_ao?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log(data.data.data[0]);
			return data.data.data[0];
		});
	};
	factory.feina_jt = function(centro){
		return $http.get(URL+"feina?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};
	factory.oportunitat = function(centro){
		return $http.get(URL+"oportunitat?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};
	factory.exito = function(centro){
		return $http.get(URL+"exito?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};

	factory.lista = function(centro,d){
		//console.log("dataaaaa",d);
		var desde = d.dany+'-'+d.dmes+'-'+d.ddia;
		var hasta = d.hany+'-'+d.hmes+'-'+d.hdia;

		return $http.get(URL+"listaTipo?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log(data.data);
			return data.data.data;
		});
	};

	factory.listaABC = function(centro,tipo){
		//console.log("dataaaaa",d);

		return $http.get(URL+"listaABC?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&tipo="+tipo).then( function(data) {
			console.log(data.data);
			return data.data.data;
		});
	};

	factory.getGesdent = function(centro,desde){
		return $http.get(URL_STATS+"getPresupuestosGesdent?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data.data.data;
		});
	};
	factory.getPptosGesdentDesde = function(centro,numpac,desde){
		return $http.get(URL_STATS+"getPresupuestosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac+"&desde="+desde).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data.data.data;
		});
	};
	factory.listaPresupuestosPaciente = function(centro,numpac){
		return $http.get(URL_STATS+"listaPresupuestosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac).then( function(data) {
			//console.log("servicio get");
			console.log("listaPresupuestosPaciente", data.data);
			return data.data.data.data;
		});
	};
	factory.getPptosGesdent = function(centro,numpac,numpre){
		return $http.get(URL_STATS+"getPresupuestosPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac+"&NumPre="+numpre).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data.data.data;
		});
	};
	factory.getPptosDetallesGesdent = function(centro,numpac,numpres){
		return $http.get(URL_STATS+"getPresupuestosDetallesPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac+"&NumPre="+numpres).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data.data.data;
		});
	};
	factory.getPptosAnotacionesGesdent = function(centro,numpac,numpres){
		return $http.get(URL_STATS+"getPresupuestosAnotacionesPaciente?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&NumPac="+numpac+"&NumPre="+numpres).then( function(data) {
			//console.log("servicio get");
			//console.log(data.data);
			return data.data.data.data;
		});
	};

	factory.facturacionFechas = function( centro,d ){
		//console.log("dataaaaa",d);
		var desde = d.dany+d.dmes+d.ddia;
		var hasta = d.hany+d.hmes+d.hdia;

		return $http.get(URL_STATS+"facturacionFechas?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&desde="+desde+"&hasta="+hasta).then( function(data) {
			//console.log(data.data.data.data);
			return data.data.data.data;
		});
	};


	return factory;

 }])

//**********************************************************************
.factory('Controles', ['$http', 'URL', 'URL_STATS', function($http, URL, URL_STATS) {


	var factory = {};

	factory.recalls = {};

	factory.getControles = function(centro){
		return $http.get(URL+"getcontroles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			return data.data.data;
		});
	};
	factory.getControlesTipo = function(centro,tipo,ano,mes){
		return $http.get(URL_STATS+"getcontrolestipo?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&tipo="+tipo+"&ano="+ano+"&mes="+mes).then( function(data) {
			return data.data.data;
		});
	};
	factory.addControl = function(obj){
		console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addcontrol", obj).then( function(data) {
			//console.info("devuelto de add",data);
			return data.data;
		});
	};

	factory.deleteControl = function(id){
		//console.log("borrame " + id);
		return $http.get(URL+"deletecontrol?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			//console.log(data);
			return data.data;
		});
	};


	// ligados al Gesdent
	factory.getListadoControles = function(centro,mes,ano){
		console.log('getcontroles....', URL_STATS+"getControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&mes="+mes+"&ano="+ano);
		return $http.get(URL_STATS+"getControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&mes="+mes+"&ano="+ano).then( function(data) {
			console.log('getcontroles DATA....', data);
			return data.data.data;
		});
	};
	factory.getPacienteControles = function(centro,idpac,mes,ano){

		return $http.get(URL_STATS+"getPacienteControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac+"&mes="+mes+"&ano="+ano).then( function(data) {
			//console.info("services getPacienteControles",centro,idpac,mes,ano);
			//console.info("services getPacienteControles",data.data);
			return data.data.data;
		});
	};

	factory.getDetallesControles = function(centro,idpac){
		return $http.get(URL_STATS+"getDetalles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac).then( function(data) {
			return data.data.data;
		});
	};
	factory.getTodosControles = function(centro,idpac){
		return $http.get(URL_STATS+"getPacienteTodosControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac).then( function(data) {
			return data.data.data;
		});
	};
	factory.getTtosControles = function(centro,idpac){
		return $http.get(URL_STATS+"getTtosDetalles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac).then( function(data) {
			return data.data.data;
		});
	};
	factory.getTtosControlesNumPac = function(centro,idpac){
		return $http.get(URL_STATS+"getTtosDetallesNumPac?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac).then( function(data) {
			return data.data.data;
		});
	};



	factory.getAlertasControles = function(centro,idpac){
		return $http.get(URL_STATS+"getAlertasDetalles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&idpac="+idpac).then( function(data) {
			return data.data.data;
		});
	};
	factory.smsCT = function(obj){
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_STATS+"sendSMSCT",obj).then( function(data) {
			return data.data;
		});
	};
	factory.controladoComo = function(tipo,centro,reg,estado){

		return $http.get(URL_STATS+tipo+"?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&numrec="+reg+"&estado="+estado).then( function(data) {
			return data.data.data;
		});
	};
	factory.getCartasControles = function(centro,mes,ano){
		return $http.get(URL_STATS+"getCartasControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&mes="+mes+"&ano="+ano).then( function(data) {
			return data.data.data;
		});
	};
	factory.getTotalControles = function(centro){
		return $http.get(URL_STATS+"getTotalControles?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			return data.data.data;
		});
	};




	return factory;

 }])

//**********************************************************************
.factory('Colectivos', ['$http', 'URL', 'URL_STATS', function($http, URL, URL_STATS) {


	var factory = {};

	factory.recalls = {};

	factory.getColectivos = function(centro){
		return $http.get(URL+"getcolectivos?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			console.log("colectivoooooo", data);
			return data.data.data;
		});
	};

	factory.addColectivo = function(obj){
		console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addcolectivo", obj).then( function(data) {
			//console.log(data);
			return data.data;
		});
	};

	factory.deleteColectivo = function(id){
		//console.log("borrame " + id);
		return $http.get(URL+"deletecolectivo?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			console.log(data);
			return data.data;
		});
	};

	return factory;

 }])

//**********************************************************************
.factory('Incluyes', ['$http', 'URL', 'URL_STATS', function($http, URL, URL_STATS) {


	var factory = {};

	factory.recalls = {};

	factory.getSiNo = [
			{"id": "si"},
			{"id": "no"}
	];

	factory.getIncluyes = function(){
		return $http.get(URL+"getincluyes?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			return data.data.data;
		});
	};

	factory.addIncluye = function(obj){
		console.log(obj);
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"addincluye?apikey=HAFvxoLmhNeqKj5oN3uWqA", obj).then( function(data) {
			//console.log(data);
			return data.data;
		});
	};

	factory.deleteIncluye = function(id){
		//console.log("borrame " + id);
		return $http.get(URL+"deleteincluye?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			console.log(data);
			return data.data;
		});
	};

	return factory;

 }])

//**********************************************************************
.factory('Globales', ['$http', 'URL', function($http, URL ) {

	var factory = {};

	factory.tratamientos = function(){

		//console.log(user);
		return $http.get(URL+"getTtos?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.centros = function(){

		//console.log(user);
		return $http.get(URL+"getCentros?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.meses = function(datos){

		var meses = [];
		// los datos son comunes
		var i;
		for ( i=1; i<=12; i++ ){
			meses.push( {"mes": i} );
			angular.forEach(datos, function(value,key){
				if ( i === value.mes ){
					meses.pop();
					meses.push(value);
				}
			});
		}

		return meses;
	};

	factory.localizacion = function(){
		return $http.get('https://freegeoip.net/json/').then( function(data){
			console.log("localizame", data.data);
			return data.data;
		})
	}

	return factory;

}])

//**********************************************************************
.factory('Books', ['$http', 'URL', function($http, URL ) {

	var factory = {};

	//factory.colectivos = [
	//	{"nom": "Ninguno", 		"a":10 , "b":0 , "c":0 , "d":0},
	//	{"nom": "Platino",		"a":20 , "b":15 , "c":5 , "d":5 },
	//	{"nom": "Oro", 			"a":15 , "b":10 , "c":0 , "d":0 },
	//	{"nom": "Plata",		"a":5 , "b":5 , "c":0 , "d":0 },	
	//];
	
	factory.colectivos = function(centro){
		//console.log(user);
		return $http.get(URL+"colectivos?apikey=HAFvxoLmhNeqKj5oN3uWqA&clinicaid="+centro).then( function(data) {
			//console.log(data.data.data);
			return data.data.data;
		});
	};
	
	factory.actualizappto = function(aguardar){
		console.log("servicio a guardar", aguardar);
		aguardar.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL+"actualizappto", aguardar).then( function(data) {
			//console.log(data.data.data);
			return data.data.data;
		});
	};
	
	factory.quecolectivos = function(colectivo,centro){
		//console.log( centro);
		//console.log( colectivo);
		return $http.get(URL+"quecolectivos?apikey=HAFvxoLmhNeqKj5oN3uWqA&clinicaid="+centro+"&colectivoid="+colectivo).then( function(data) {
			console.log(data.data.data);
			return data.data.data;
		});
	};

	factory.quecolectivo = function(id){
		//console.log( centro);
		//console.log( colectivo);
		return $http.get(URL+"quecolectivo?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			console.log(data.data.data);
			return data.data.data;
		});
	};
	
	factory.incluye = function(){
		return $http.get(URL+"incluye?apikey=HAFvxoLmhNeqKj5oN3uWqA&sino=si").then( function(data) {
			//console.log(data.data.data);
			return data.data.data;
		});
	};
	factory.noincluye = function(){
		return $http.get(URL+"incluye?apikey=HAFvxoLmhNeqKj5oN3uWqA&sino=no").then( function(data) {
			//console.log(data.data.data);
			return data.data.data;
		});
	};
	

	factory.read = function(){

		//return $http.get('base.docx', {'responseType': 'text'}).then(function(data) {
		//    //console.log(data.data);
		//    return data.data;
		//});
	};

	return factory;

	/*
	var lastags = {
		"nom": "Enric Badia",
		"clinica": "Eneresi Lleida",
		"doctor": "Dr. Ariza",
		"tto": "Una rehabilitación sobre implantes con retirada de piezas, colocación de prótesis completa y sedación consciente en clínica.",
		"caracteristicas":
			[ 
				{"parrafo" : "Es un tratamiento que lleva realizándose más de 20 años en nuestro país con un éxito superior al 90%."}, 
				{"parrafo" : "Una vez finalizado el tratamiento de rehabilitación sobre implantes, es necesario mantener una serie de controles que nos ayudarán a mantener en el mejor estado posible la rehabilitación. "},
				{"parrafo" : "Por este motivo la incluiremos en el Programa de Revisiones de Implantología. Este programa de prevención consiste en la realización de visitas periódicas cada 6 meses en las que se realizará: "},
				{"parrafo" : "- Higiene de profilaxis. "},
				{"parrafo" : "- Control radiográfico. "},
				{"parrafo" : "- Desmontaje, revisión y limpieza de la prótesis, si es necesario. "},
				{"parrafo" : "- Revisión odontológica general. "},
				{"parrafo" : "Este control exhaustivo de su rehabilitación nos ayudará a mantener un buen estado de la rehabilitación y de esta forma aumentar su duración."}
			],
		"incluye":
			[ 
				{"incluido" : "Todos los materiales necesarios para la realización del tratamiento propuesto"}, 
				{"incluido" : "Todas las visitas programadas y las urgencias que puedan surgir durante el proceso"}, 
				{"incluido" : "La primera revisión del Programa de Revisiones de Implantología"}, 
				{"incluido" : "En caso de seguir de forma adecuada el Programa de Revisiones de Implantología la reposición parcial o total de los implantes o de la prótesis:"}, 
				{"incluido" : "- sin ningún coste durante los dos primeros años posteriores a la rehabilitación"}, 
				{"incluido" : "- con un 30% de descuento entre el tercer y quinto año posteriores a la rehabilitación"}, 
				{"incluido" : "- con un 10% de descuento a partir del quinto año posterior a la rehabilitación"}, 
			],
		"noincluye":
			[ 
				{"noincluido" : "La primera visita de diagnóstico y estudio"}, 
				{"noincluido" : "Las visitas del Programa de Revisiones de Implantología a partir de la segunda visita"}, 
			],
		"coste": "El coste total del tratamiento propuesto es de 10.485 euros",
		"textodto1": "Sobre este coste total aplicaríamos un 20% de descuento, ",
		"costefinal1": "siendo el coste final de 9.436,50 euros",
		"textodto2": "Sobre este coste total aplicaríamos un 15% de descuento, ",
		"costefinal2": "siendo el coste final de 8.436,50 euros",
		"textodto3": "Sobre este coste total aplicaríamos un 15% de descuento, ",
		"costefinal3": "siendo el coste final de 9.836,50 euros",
		"textodto4": "Sobre este coste total aplicaríamos un 5% de descuento, ",
		"costefinal4": "siendo el coste final de 9.936,50 euros",
		"entrada": "2.097 euros",
		"meses": "12",
		"cuota": "699,90",
		"mesessin": "12",
		"cuotasin": "789,90",
		"frontdesk": "Aurora Ortiz"
	};
	*/

}])

//**********************************************************************
.factory('Control', ['$http', 'URL_TABLEAU', 'URL', function($http, URL_TABLEAU, URL ) {

	var factory = {};

	factory.centros = function(){
		//console.log(user);
		// lista de centros
		return $http.get(URL+"centros?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			//console.log(data);
			return data.data;
		});
	};


	factory.todos = function(id,ano){

		//console.log(user);
		return $http.get(URL_TABLEAU+"especialidadesRatios?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id+"&ano="+ano).then( function(data) {
			//console.log(data);
			return data;
		});
	};

	factory.centro = function(variable,ano,id,nom){
		//console.log(user);
		return $http.get(URL_TABLEAU+"unRatio?apikey=HAFvxoLmhNeqKj5oN3uWqA&var="+variable+"&id="+id+"&ano="+ano).then( function(data) {
			//console.log(data);
			data.nom = nom;
			return data;
		});
	};


	return factory;

}])

//**********************************************************************
.factory('Citas', ['$http', 'URL_STATS', 'URL', function($http, URL_STATS, URL ) {

	var factory = {};

	factory.citas = function(centro,dia){

		// lista de centros
		return $http.get(URL_STATS+"getCitas?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&dia="+dia).then( function(data) {
			//console.log(data);
			return data.data;
		});
	};


	return factory;

}])

//**********************************************************************
.factory('Compras', ['$http', 'URL_COMPRAS', function($http, URL_COMPRAS ) {

	var factory = {};

	factory.allArticles = function () {
		console.log("peticionnnn", URL_COMPRAS+"allArticles");
		// lista de centros
		return $http.get(URL_COMPRAS+"allArticles?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.getArticle = function (item) {
		console.log("peticionnnn", URL_COMPRAS+"allArticles");
		// lista de centros
		return $http.get(URL_COMPRAS+"getArticle?apikey=HAFvxoLmhNeqKj5oN3uWqA&item="+item).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.allProveedores = function () {
		// lista de centros
		return $http.get(URL_COMPRAS+"allProveedores?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.carro = function (centro) {
		// lista de centros
		return $http.get(URL_COMPRAS+"carro?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.pedidos = function (centro) {
		// lista de centros
		return $http.get(URL_COMPRAS+"pedidos?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.devoluciones = function (centro) {
		// lista de centros
		return $http.get(URL_COMPRAS+"devoluciones?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.proveidors = function () {
		// lista de centros
		return $http.get(URL_COMPRAS+"proveidors?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			//	console.log(data);
			return data.data.data;
		});
	};

	factory.recibidos = function (centro) {
		// lista de centros
		return $http.get(URL_COMPRAS+"recibidos?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			console.log(data);
			return data.data.data;
		});
	};

	factory.deletefromcart = function(linea) {
		console.log("peticionnnn", linea);
		// lista de centros
		linea.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"deletefromcart", linea).then( function(data) {
			console.log('esto es despeues de borrar del carro', data);
			return data.data.data;
		});
	};
	factory.massdeletefromcart = function(compras) {
		//console.log("peticionnnn", compras);
		// lista de centros
		var obj = {};
		obj.compras = compras;
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"massdeletefromcart", obj).then( function(data) {
			console.log('esto es despues de borrar del carro', data);
			return data.data.data;
		});
	};

	factory.addarticle = function (data) {
		//console.log("peticionnnn", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"addarticle",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.addproveedor = function (data) {
		//console.log("peticionnnn", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"addproveedor",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.addtocart = function (data) {
		//console.log("peticionnnn", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"addtocart",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.addtopedido = function (datos) {
		console.log("peticionnnn para addtopedido", datos);
		// lista de centros
		var obj = {};
		obj.datos = datos;
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"addtopedido",obj).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};


	factory.updatearticle = function (data) {
		console.log("updatecart", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"updatearticle",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.updateproveedor = function (data) {
		console.log("updatecart", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"updateproveedor",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.updatecart = function (data) {
		console.log("updatecart", data);
		// lista de centros
		data.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"updatecart",data).then( function(data) {
				//console.log("de insertar en el carro", data);
				return data;
		}).catch( function(data){
				console.error("hay algun poblema", data.data);
			}
		);
	};

	factory.pedidoinactivo = function (linea) {
		// 
		return $http.get(URL_COMPRAS+"pedidoinactivo?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+linea.id).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data;
		});
	};
	factory.pedidonuevacantidad = function (linea) {
		// 
		return $http.get(URL_COMPRAS+"pedidoinactivo?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+linea.id+"&q="+linea.cantidad).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data;
		});
	};
	factory.pedidodevuelve = function (linea) {
		// 
		return $http.get(URL_COMPRAS+"pedidodevuelve?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+linea.id+"&motivo="+linea.motivo).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data;
		});
	};


	factory.addtorecibido = function (linea) {
		// 
		linea.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"addtorecibido", linea).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data;
		});
	};

	factory.cartsize = function (centro) {
		//console.log("peticionnnn", centro);
		// lista de centros
		return $http.get(URL_COMPRAS+"cartsize?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data[0];
		});
	};
	factory.pedidossize = function (centro) {
		//console.log("peticionnnn", centro);
		// lista de centros
		return $http.get(URL_COMPRAS+"pedidossize?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data[0];
		});
	};
	factory.recibidossize = function (centro) {
		//console.log("peticionnnn", centro);
		// lista de centros
		return $http.get(URL_COMPRAS+"recibidossize?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data.data.data[0];
		});
	};
	factory.savefile = function (nom,que) {
		var salva = {
			'nom': nom,
			'contenido': que
		};
		console.log('salvarrrr', salva);
		// lista de centros
		salva.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"savefile",salva).then( function(data) {
			//console.log("cuanto carrooooo", data.data.data[0]);
			return data;
		});
	};
	factory.sendfile = function (centro, mail, nom, tipo, que) {
		var salva = {
			'nom': nom,
			'mail': mail,
			'contenido': que,
			'tipo': tipo,
			'centro': centro
		};
		console.log("cuanto carrooooo", salva);
		// lista de centros
		salva.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		return $http.post(URL_COMPRAS+"sendPMail",salva).then( function(data) {
			console.log("cuanto envioooo", data);
			return data;
		});
	};

	factory.getGasto = function (centro,en) {
		console.log("factory.getGasto ennnn", en);
		return $http.get(URL_COMPRAS+"getGasto?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&en="+en).then( function(data) {
			console.log("factory.getGasto", data);
			return data.data.data;
		});
	};
	factory.getGastoAnual = function (centro,en) {
		return $http.get(URL_COMPRAS+"getGastoAnual?apikey=HAFvxoLmhNeqKj5oN3uWqA&centro="+centro+"&en="+en).then( function(data) {
			console.log("factory.getGastoAnual", data);
			return data.data.data;
		});
	};

	return factory;

}])

//**********************************************************************
.factory('Fitxa', ['$http', 'URL', function($http, URL ) {

	var factory = {};

	factory.fichar = function (pin,accion) {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		return $http.get(URL+"fichar?apikey=HAFvxoLmhNeqKj5oN3uWqA&pin="+pin+"&accion="+accion).then( function(data) {
			//console.log("servisio ficharrrr",data);
			return data.data.data;
		});
	};

	factory.ultimofichado = function (res) {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		return $http.get(URL+"ultimofichado?apikey=HAFvxoLmhNeqKj5oN3uWqA&centre="+res.centre_id+"&aux="+res.personal_id).then( function(data) {
			//console.log("servisio ficharrrr",data);
			return data.data.data;
		});
	};

	factory.fichando = function (res,accion) {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		var obj = res[0];
		obj.accion = accion;
		obj.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		//console.log("fichandoooo", obj);
		return $http.post(URL+"fichando", obj).then( function(data) {
			//console.log("resultado fichando",data);
			return data;
		});
	};

	factory.listafichado = function (mes,any,centre){
		// console.log("peticionnnn", URL+"listafichado?apikey=HAFvxoLmhNeqKj5oN3uWqA&mes="+mes+"&any="+any+"&centre="+centre);
		return $http.get(URL+"listafichado?apikey=HAFvxoLmhNeqKj5oN3uWqA&mes="+mes+"&any="+any+"&centre="+centre).then( function(data) {
			// console.log("servisio listafichado",data.data.data);
			return data.data.data;
		});
	}
	factory.listadetallefichado = function (mes,any,centre){
		// console.log("peticionnnn", URL+"listafichado?apikey=HAFvxoLmhNeqKj5oN3uWqA&mes="+mes+"&any="+any+"&centre="+centre);
		return $http.get(URL+"listadetallefichado?apikey=HAFvxoLmhNeqKj5oN3uWqA&mes="+mes+"&any="+any+"&centre="+centre).then( function(data) {
			// console.log("servisio listafichado",data.data.data);
			return data.data.data;
		});
	}

	return factory;

}])

//**********************************************************************
.factory('Personal', ['$http', 'URL', function($http, URL ) {

	var factory = {};

	factory.lista = function (centro) {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		console.log("mi sentrooooo ", URL+"listarpersonal?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro);
		return $http.get(URL+"listarpersonal?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+centro).then( function(data) {
			console.log("servisio Personal lista",data);
			return data.data.data;
		});
	};
	factory.edita = function (id) {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		// console.log("mi sentrooooo ", URL+"listarpersonal?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id);
		return $http.get(URL+"editarpersonal?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+id).then( function(data) {
			// console.log("servisio Personal lista",data);
			return data.data.data[0];
		});
	};
	factory.centros = function () {
		//console.log("peticionnnn", URL+" pin "+pin+" accion "+accion);
		// lista de centros
		return $http.get(URL+"personalcentros?apikey=HAFvxoLmhNeqKj5oN3uWqA").then( function(data) {
			console.log("servisio Personal centros",data);
			return data.data.data;
		});
	};

	factory.addpersona = function (persona) {
		// lista de centros
		persona.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		console.log("fichandoooo", persona);
		return $http.post(URL+"addpersona", persona).then( function(data) {
			//console.log("resultado fichando",data);
			return data;
		});
	};

	factory.updatepersona = function (persona) {
		// lista de centros
		persona.apikey='HAFvxoLmhNeqKj5oN3uWqA';
		console.log("fichandoooo", persona);
		return $http.post(URL+"updatepersona", persona).then( function(data) {
			//console.log("resultado fichando",data);
			return data;
		});
	};

	factory.deletepersona = function (persona) {
		console.log("borrandooooo", persona);
		return $http.get(URL+"deletepersona?apikey=HAFvxoLmhNeqKj5oN3uWqA&id="+persona).then( function(data) {
			//console.log("resultado fichando",data);
			return data;
		});
	};

	return factory;

}])

})();


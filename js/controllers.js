'use strict';

/* Controllers */

(function(){


angular.module('myApp.controllers', [])

.controller('AppCtrl', ['$scope', 'localize', '$location', 'Presus',
				function( $scope, localize, $location, Presus ) {
	//===============================================

	//localize.setLanguage('es');
	console.log("APP");

	$scope.isSpecificPage = function() {
        var path;
        path = $location.path();
        return _.contains(['/404', '/login', '/logout'], path);
    };

    //var deuda = function(){
    //	Presus.datos("deuda").then( function(data){
    //		console.log(data.data);
    //		$scope.deuda = data.data;
    //	});
    //}

    //deuda();

}])

.controller('HomeCtrl', ['$rootScope','$scope', 'Users', 'AuthService', '$location',
				function($rootScope, $scope, Users, AuthService, $location ) {
	//===============================================
	//$scope.login = AuthService.isAuthenticated();
	//localize.setLanguage('es');
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

}])

.controller('NavCtrl', ['$rootScope','$scope', 'Presus', 'AuthService', 'Globales', '$route', 'Compras',
				function($rootScope, $scope, Presus, AuthService, Globales, $route, Compras ) {
	//===============================================
	//$scope.login = AuthService.isAuthenticated();
	//localize.setLanguage('es');
	//console.info('user centre', $rootScope.user.centre);

	$scope.centro = {};

	Globales.centros().then( function(data){
	   	$rootScope.centros = data.data.data;
	   	//console.log($rootScope.centros);
	   	$scope.centro.cual = {"id" : $rootScope.user.centre };
	});

	$scope.centro = function(){

		console.log("cambiooooooo",$scope.centro.cual);
		$rootScope.user.centre = $scope.centro.cual.id;
		$rootScope.user.marca = $scope.centro.cual.marca;
		$rootScope.user.lloc = $scope.centro.cual.nom;
		$rootScope.user.telefono = $scope.centro.cual.telefono;
		console.log("$rootScope.user",$rootScope.user);

		$scope.centro.id = $rootScope.user.centre;
		$route.reload();
	};

	if ($rootScope.user.centre != ""){
		Presus.countRecallsActiusGD($rootScope.user.centre).then( function(res){
			// console.log("detallessssss",res.data.data[0]);
			$scope.recalls = res.data.data.data[0].recalls;
		});
		Compras.cartsize($rootScope.user.centre).then( function(res){
			// console.log("detallessssss",res.data.data[0]);
			$scope.carro = res.size;
		});
		Compras.pedidossize($rootScope.user.centre).then( function(res){
			// console.log("detallessssss",res.data.data[0]);
			$scope.pedidos = res.size;
		});
		Compras.recibidossize($rootScope.user.centre).then( function(res){
			// console.log("detallessssss",res.data.data[0]);
			$scope.recibidos = res.size;
		});
	}

	$scope.$on('recallsChangeHandle', function(e,v){
		$scope.recalls = v.recalls;
	});
	$scope.$on('addedtocartHandle', function(e,v){
		$scope.carro = v.compro;
	});
	$scope.$on('addedtopedidoHandle', function(e,v){
		$scope.pedidos = v.size;
	});
	$scope.$on('addedtorecibidoHandle', function(e,v){
		$scope.recibidos = v.size;
	});

}])

.controller('RecallCtrl', ['$rootScope','$scope', '$routeParams', 'Users', 'AuthService',  'Presus', '$location', '$route', 'Controles',
				function($rootScope, $scope, $routeParams, Users, AuthService, Presus, $location, $route, Controles ) {
	//===============================================

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
	//$scope.login = AuthService.isAuthenticated();
	//localize.setLanguage('es');
	$scope.id = $routeParams.id;
	$scope.nom = $routeParams.nom;

	$scope.recall = {"NumPac": $routeParams.id};
	$scope.recalls = {};

	//console.log(Presus.recalls.data);
	//$scope.recalls = Presus.recalls.data;

	$scope.opened = false;
	$scope.dateOptions = {
    		formatYear: 'yyyy',
    		startingDay: 1
  	};

  	//console.log($rootScope.user);
  	//console.log($rootScope.user.id);

  	$scope.recall.responsable = $rootScope.user.id;

  	Presus.countRecallsActius($rootScope.user.centre).then( function(res){
  		$scope.countrecalls = res.data.data[0].recalls;
  	});

  	// recoge primero los presupuestos entregados del paciente
	//Presus.getPptosPaciente($routeParams.id).then( function(data){
	//	console.info("Presus.getPptosPaciente",data.data.data);
	//	$scope.pptos = data.data.data;
	//});

  	// recoge primero los recalls del paciente
	Presus.getPptoRecalls($routeParams.id,$rootScope.user.centre).then( function(data){
		console.info("Controles.getPptoRecalls",data.data);
		$scope.recalls = data.data;
	});

  	// recoge primero los recalls del paciente en gesden
	//Presus.getPptoRecallsGD($routeParams.id,$rootScope.user.centre).then( function(data){
	//	console.info("Controles.getPptoRecalls",data.data);
	//	$scope.recallsgd = data.data;
	//});

	//++++++++++
	// recogemos las entradas medicas de gesdent para verlas en pantalla...
	//++++++++++

	// recogemos las entradas medicas y ponemos los
	// codigos de colores de los ttos
	var entradasmedicas = function() {
		Controles.getTtosControlesNumPac($rootScope.user.centre, $routeParams.id).then( function(data){
			//console.info("Controles.getTtosControles",data.data);
			angular.forEach(data.data, function(value,key){
				//console.info("valor",value);
				//console.info("clave",key);
				if (value.StaTto == 3) 			value.color = "red";
				if (value.StaTto == 2) 			value.color = "green";
				if (value.StaTto == 5) 			value.color = "cyan";
				if (value.StaTto == 8) 			value.color = "#66CDAA";
				if (value.IdTipoOdg == 11) 		value.color = "yellow";
				if (value.IdTipoOdg == 12) 		value.color = "	#808080";

				// entramos los marcadores para saber si tierne alarma en esa fecha
				//console.log("dataaaaa", value.FecFin);
				if (value.FecFin !== null){
					var tienealarma = moment(value.FecFin,'MMM DD YYYY hh:mm:ss:SSA').format('H');
					if (tienealarma == 11){
						value.alarma = 1;
						value.fechaalarma = moment(value.FecFin,'MMM DD YYYY hh:mm:ss:SSA').format('DD-MM-YYYY');
					}
				}
				console.log("dataaaaa", value.alarma);

			});
			$scope.ttos = data.data;
			$scope.ttosmed = data.data[data.data.length-1].NumTto;
		});
	}

	entradasmedicas();

	$scope.addRecall = function(recall){

		/* 	esto es lo que poniamos para poner recalls en el rocks
			ahora los ponemos directamente en gesden
		*******
			//console.log("mes " + $rootScope.centre);
			console.log(recall);
			recall.responsable_id = $rootScope.user.id;
			recall.pacient = $routeParams.nom;
			recall.centro = $rootScope.user.centre;
			Presus.addRecall(recall).then( function(data){
				//console.log(data);

				Presus.countRecallsActius($rootScope.user.centre).then( function(res){
					//console.log("detallessssss",res.data.data[0].recalls);
					//$scope.countrecalls = res.data.data[0].recalls;
					$scope.$emit('recallsChange', {recalls: res.data.data[0].recalls} );
					$location.path("/listaRecalls/"+$routeParams.id+"/"+$routeParams.nom);
				});

			});
		*/
		console.log(" vassioooo ",recall.data);
		recall.fecini = moment().format('YYYY-MM-DD 00:00:00');
		if (recall.data !== undefined ){
			recall.fecfin = moment(recall.data).format('YYYY-MM-DD 11:11:00');
		} else {
			recall.fecfin = moment().format('YYYY-MM-DD 00:00:00');
		}

		Presus.getLastTtosNumPac($rootScope.user.centre,recall.NumPac).then( function(res){
			console.log("resssss anotacionn en gesden",res);
			// preparara el envio del recall con las variables necesarias
			recall.IdCentro = 0;
			recall.IdPac = res.data[0].IdPac;
			recall.NumTto = res.data[0].NumTto+1;
			if (res.data[0].IdCentro)
				recall.IdCentro = res.data[0].IdCentro;
			recall.centro = $rootScope.user.centre;
			console.log("ponerr anotacionn en gesden",recall);
			// envia el recall para ser intoducido en gesden como anotacion medica
			Presus.addRecallGD(recall).then( function(res){
				$scope.recall = {};
				entradasmedicas();
			});

		});

	}

	$scope.openCalendar = function($event){
		//console.log("mes " + $rootScope.centre);
		console.log("abrete sesamo");
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	}

	$scope.en = function(semanas){
		//console.log("mes " + $rootScope.centre);
		$scope.recall.data = moment().add(semanas, 'week').format('YYYY-MM-DD');;
	}

	$scope.aceptaRecall = function(ppto){

		//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		//console.log("recall done");
		Presus.aceptaRecall(ppto.id).then( function(data){
			//console.log(data);
			//console.log("/addRecall/"+ppto.pressupost_id);
			//$location.path("/addRecall/"+ppto.pressupost_id+"/"+$routeParams.nom);
			Presus.countRecallsActius($rootScope.user.centre).then( function(res){
				$scope.$emit('recallsChange', {recalls: res.data.data[0].recalls} );
				$route.reload();
			});

			//$location.path("/listaRecalls/"+$routeParams.id+"/"+$routeParams.nom);
		});
	}

	var getRecallsGD = function(){
		Presus.getRecallsActiusGD($rootScope.user.centre).then( function(data){
			$scope.listarecallsGD = data.data;
			angular.forEach($scope.listarecallsGD, function(v,k){
				 console.log("uveeeee antesssss", v.FecFin);
				 console.log("uveeeee antesssss", +moment(v.FecFin));
				 console.log("hooyyyy antesssss", +moment(moment().format('YYYY.MM.DD')));
				// convertimos la fecha para reflejar solo la parte de fecha sin hora
				if ( +moment(v.FecFin) < +moment(moment().format('YYYY.MM.DD')) ) {
					v.color = "Se";
				} else {
					v.color = "";
				}
				v.FecFin = moment(v.FecFin).format('DD-MM-YYYY');
				// console.log("uveeeee", v.color);
			});
			 console.log("recallsssssss de gddd",data);
		});
	};

	$scope.aceptaRecalldeHoyGD = function(ppto){

		ppto.FecFin = moment(ppto.FecFin, "MM-DD-YYYY").format('YYYY-DD-MM');
		console.log("recall done", ppto);
		Presus.aceptaRecallGD($rootScope.user.centre,ppto).then( function(data){
			getRecallsGD();
			Presus.countRecallsActiusGD($rootScope.user.centre).then( function(res){
				console.log("detallessssss",res.data.data.data[0]);
				$scope.$emit('recallsChange', {recalls: res.data.data.data[0].recalls} );
				$scope.recalls = res.data.data.data[0].recalls;
			});

			// $location.path("/addRecall/"+ppto.NumPac+"/"+ppto.Nombre+" "+ppto.Apellidos);

		});
	}
}])

.controller('RecallsHoyCtrl', ['$rootScope','$scope', '$routeParams', 'Users', 'AuthService',  'Presus', '$location', '$route', 'postman', 'Sms', 'Controles',
				function($rootScope, $scope, $routeParams, Users, AuthService, Presus, $location, $route, postman, Sms, Controles ) {
	//===============================================

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
	//$scope.login = AuthService.isAuthenticated();
	//localize.setLanguage('es');
	var obj = $routeParams.id;

	$scope.dateOptions = {
    		formatYear: 'yyyy',
    		startingDay: 1
  	};

	var getRecallsGD = function(){
		Presus.getRecallsActiusGD($rootScope.user.centre).then( function(data){
			$scope.listarecallsGD = data.data;
			// console.log("getRecallsGD", data.data);
			angular.forEach($scope.listarecallsGD, function(v,k){
				// console.log("uveeeee antesssss", v.FecFin);
				// console.log("uveeeee antesssss", +moment(v.FecFin));
				// console.log("hooyyyy antesssss", +moment(moment().format('YYYY-MM-DD')));
				// convertimos la fecha para reflejar solo la parte de fecha sin hora
				if ( +moment(v.FecFin) < +moment(moment().format('YYYY-MM-DD')) ) {
					v.color = "Se";
				} else {
					v.color = "";
				}
				v.FecFin = moment(v.FecFin).format('DD-MM-YYYY');
				// console.log("v.FecFin final", v.FecFin);
			});
			// console.log("recallsssssss de gddd",data);
		});
	};

	var recalls6meses = function(centro,mes,any){

		$scope.recalls6m = new Array();

		Controles.getListadoControles(centro,mes,any).then( function(data){
			// console.info("controller getListadoControles",data);
			angular.forEach(data.data, function(value,key){
				if (
					moment.unix(value.Fecha).format('DD') == moment().format('DD') &&
					moment.unix(value.Fecha).month() == moment().month() &&
					moment.unix(value.Fecha).year() == moment().year()
				){
					//console.log("recalls de la fecha", moment.unix(value.Fecha).format('DD'));
					//console.log("recalls de la fecha HOY", moment().format('DD'));
					$scope.recalls6m.push(value);
				}
			});
			// $scope.recalls = data.data;
			//console.log("recalls de la fecha", $scope.recalls6m);
		});
	}

	var citasNoSMS = function(centro, fecha){
		console.log("smssss,", centro + " --- " + fecha);
		Sms.citasNoSMS(centro, fecha).then( function(res) {
			console.log("citas de la fecha de sms", res);
			$scope.citas = res.data;
		});
	}

	var recallsRocks = function() {
		Presus.getRecallsActius($rootScope.user.centre).then( function(data){

			//console.log("recallsssssss",data.data.data);

			$scope.listarecalls = data.data.data;
			// recopilar los ttos dados de cada paciente
			angular.forEach($scope.listarecalls, function(v,k){
				// si tiene fecha anterior a hoy lo marca en su css
				if ( +moment(v.data) <= +moment() ) {
					v.color = "Se";
				} else {
					v.color = "";
				}
				// pedir los pptos
				//console.info("pido",v);
			  	// recoge primero los presupuestos entregados del paciente
				Presus.getPptosPaciente($rootScope.user.centre, v.NumPac).then( function(data){
					var presus = {};
					//console.info("Presus.getPptosPaciente",data.data.data);
					v.presus = data.data.data;
				});
			});

		});

		$scope.reprogramado = function(sms,index){
			// console.log("reprogramadooo", sms);
			Sms.citasNoSMSReprogramada(sms).then( function(res) {
				// console.log("citas de la fecha de sms", res);
				citasNoSMS($rootScope.user.centre, $scope.fecha);
			});
		}
		$scope.llamado = function(sms,index){
			// console.log("llamadooo", sms);
			Sms.citasNoSMSLlamada(sms).then( function(res) {
				// console.log("citas de la fecha de sms", res);
				citasNoSMS($rootScope.user.centre, $scope.fecha);
			});
		}
	}

	var init = function(){
		//console.log("mes " + $rootScope.centre);
		//console.log(recall);

		//console.log($scope.recalls);
		$scope.fecha = moment().format('YYYY-MM-DD');
		console.log("scopefechadehoyyyyy se supone", $scope.fecha);
		// smsv.fecha = '2015-08-19';
		recallsRocks();
		getRecallsGD();
		citasNoSMS($rootScope.user.centre, $scope.fecha);
		recalls6meses($rootScope.user.centre, moment().format('MM'),moment().format('YYYY'));

		Presus.countRecallsActiusGD($rootScope.user.centre).then( function(res){
			console.log("detallessssss",res.data.data.data[0]);
			$scope.$emit('recallsChange', {recalls: res.data.data.data[0].recalls} );
			$scope.recalls = res.data.data.data[0].recalls;
		});

		$scope.$on('recallsChangeHandle', function(e,v){
			console.log("vvvvvvvvvvvv",v);
			$scope.recalls = v.recalls;
		})
	}

	init();

	$scope.refresca = function(){
		init();
	}


	$scope.aceptaRecalldeHoy = function(ppto){

		//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		//console.log("recall done");
		Presus.aceptaRecall(ppto.id).then( function(data){
			//console.log(data);
			//console.log("/addRecall/"+ppto.pressupost_id);
			console.info("aceptadoderecallsdehoy",data);
			//$location.path("/recallsdehoy");

			Presus.countRecallsActius($rootScope.user.centre).then( function(res){
				$scope.$emit('recallsChange', {recalls: res.data.data[0].recalls} );
				$route.reload();
			});

			$location.path("/addRecall/"+recall.NumPac+"/"+recall.Nombre+" "+recall.Apellidos);


		});
	}

	$scope.aceptaRecalldeHoyGD = function(ppto){

		ppto.FecFin = moment(ppto.FecFin, "MM-DD-YYYY").format('YYYY-DD-MM');
		console.log("recall done", ppto);
		Presus.aceptaRecallGD($rootScope.user.centre,ppto).then( function(data){
			getRecallsGD();
			Presus.countRecallsActiusGD($rootScope.user.centre).then( function(res){
				console.log("detallessssss",res.data.data.data[0]);
				$scope.$emit('recallsChange', {recalls: res.data.data.data[0].recalls} );
				$scope.recalls = res.data.data.data[0].recalls;
			});

			$location.path("/addRecall/"+ppto.NumPac+"/"+ppto.Nombre+" "+ppto.Apellidos);

		});
	}


	$scope.sendMailRecalls = function(){
		//console.log("borra " + id);
		var recalls = "<div><strong>Listado de Recalls pendientes.</strong></div><br/><br/>";
		var recalls = recalls + "<div>";
		Presus.getRecallsActius($rootScope.user.centre).then( function(data){
			//console.log(data.data);
			// reformatea la salida
			angular.forEach(data.data.data, function(value,key){
				recalls = recalls + "<span><strong>» " + value.nom + "</strong></span>";
				recalls = recalls + "<ul>";
				recalls = recalls + "<li>" + value.data + "</li>";
				recalls = recalls + "<li>" + value.encarregat + "</li>";
				recalls = recalls + "<li>" + value.telefon + "</li>";
				recalls = recalls + "<li>" + value.notas + "</li>";
				recalls = recalls + "</ul>";
				recalls = recalls + "<hr/>";
			});
			recalls = recalls + "</div>";
			// envia el mail
			Presus.sendMail(recalls,$rootScope.user.email).then( function(data){
				//console.log(data);
				postman.success('SUCCESS!!!', 'Correo enviado a su destinatario. Fenómeno.');
				//$scope.tots('Seguimiento');
				$location.path("/presupuestos");
			});
		});

	}
}])

.controller('EditaPresupuestosCtrl', ['$routeParams','$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', 'Paciente',
					function($routeParams, $rootScope, $scope, $location, Users, AuthService, Presus, Paciente) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){
		$scope.dateOptions = {
			dateInit : moment().format('YYYY-MM-DD')
		};
		//console.log("edita " + $routeParams.id);
		Presus.getPpto($routeParams.id).then( function(data){
			$scope.ppto = data.data.data[0];
			console.log("para el modelo",$scope.ppto);
			var motiu = $scope.ppto.motiu_id;

			console.info("tal cual ",data.data.data);

			// para recoger el motivo del ppto y ponerlo en el desplegable
			$scope.ppto.motiu_id = {};
			for (var i = 0; i < $rootScope.ttos.length; i++) {
			    if ($rootScope.ttos[i].id == motiu) {
			        $scope.ppto.motiu_id = $rootScope.ttos[i];
			    }
			}
		});
	}

	init();


	$scope.edita = function(ppto){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		ppto.id = $routeParams.id;
		// console.log("Actualizameeeeee",ppto);
		ppto.motiu_id = ppto.motiu_id.id;
		//ppto.entrega = moment(ppto.entrega).format('YYYY-MM-DD');
		ppto.notas = ppto.notas.replace("\'", ",");
		Presus.updatePpto(ppto).then( function(data){
			//console.log(data);
			$location.path("/presupuestos");
		});
	}

	$scope.duplica = function(ppto){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		ppto.motiu_id = ppto.motiu_id.id;
		console.log(ppto);
		Presus.duplicaPpto(ppto).then( function(data){
			//console.log(data);
			$location.path("/presupuestos");
		});
	}

	$scope.imprime = function(ppto){
		console.log(ppto);
		Paciente.ppto = ppto;
		$location.path("/books");
	}

	$scope.openCalendar = function($event){
		//console.log("mes " + $rootScope.centre);
		console.log("abrete sesamo");
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	}

}])

.controller('GraficoEvolPresupuestosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $timeout) {

	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.any = moment().format('YYYY');

	// los datos son comunes
	$scope.chart_options_cuantos = {
		xkey: 'mes',
		ykeys: ['cuantos', 'cuantosaprobados'],
		labels: ['Dados', 'Aprobados'],
		hideHover: "true",
		resize: true
	};

	$scope.chart_options_aprobacion = {
		xkey: 'mes',
		ykeys: ['aprobacion'],
		labels: ['Aprobacion de casos'],
		barColors: ['#009999'],
		hideHover: "true",
		resize: true
	};

	$scope.chart_options_ratios = {
		xkey: 'mes',
		ykeys: ['ratiocuantos', 'ratioaprobados'],
		labels: ['Numero', 'Valores'],
		hideHover: "true",
		resize: true
	};

	var init = function(){

		Presus.graficosPpto(0,$scope.any,$rootScope.user.centre).then( function(data){

			// recuperamos los datos del servidor

			if ( data.data.text != "No existe."){
				console.log(data.data);
				$scope.data = data.data;
			} else {
				console.log("NO hay datos en el servidor");
				$scope.data = [{
					any: $scope.any,
					aprobacion: "0",
					cuantos: "0",
					cuantosaprobados: "0",
					mes: "0",
					ratioaprobados: "0",
					ratiocuantos: "0",
					suma: "0",
					sumaaprobados: "0"
				}];
			}
		});

		// calcula los primeros datos de los formularios de fecha: mes actual hasta la fecha de hoy...

		var d = {};
		d.ddia = '01';
		d.dmes = moment().format('MM');
		d.dany = moment().format('YYYY');
		d.hdia = moment().format('DD');
		d.hmes = moment().format('MM');
		d.hany = moment().format('YYYY');

		console.log("ddddddd", d);

		$scope.pres = angular.copy( d );

		$scope.todos(d);

	}

	$scope.graficoAny = function(any){
		$scope.any = any;
		init();
	}

	$scope.todos = function(d){
		$scope.fppto(d);
		$scope.facepta(d);
		$scope.frealiza(d);
		$scope.fsigue(d);
		// replica los datos de la fecha
		$scope.acep = angular.copy( d );
		$scope.real = angular.copy( d );
		$scope.sigo = angular.copy( d );
	}

	$scope.fppto = function(d){
		var desde = d.dany+d.dmes+d.ddia;
		var hasta = d.hany+d.hmes+d.hdia;
		Presus.porFechas('ppto',$rootScope.user.centre,desde,hasta).then( function(res){
			$scope.ppto = res[0];
		});
	}
	$scope.facepta = function(d){
		var desde = d.dany+d.dmes+d.ddia;
		var hasta = d.hany+d.hmes+d.hdia;
		Presus.porFechas('aceptado',$rootScope.user.centre,desde,hasta).then( function(res){
			console.log('porFechassss num', res[0].num);
			console.log('porFechassss pag', res[0].pago);
			$scope.acepta = res[0];
		});
	}
	$scope.frealiza = function(d){
		var desde = d.dany+d.dmes+d.ddia;
		var hasta = d.hany+d.hmes+d.hdia;
		Presus.porFechas('realizado',$rootScope.user.centre,desde,hasta).then( function(res){
			console.log('porFechassss num', res[0].num);
			console.log('porFechassss pag', res[0].pago);
			$scope.realiza = res[0];
		});
	}
	$scope.fsigue = function(d){
		var desde = d.dany+d.dmes+d.ddia;
		var hasta = d.hany+d.hmes+d.hdia;
		Presus.porFechas('seguimiento',$rootScope.user.centre,desde,hasta).then( function(res){
			console.log('porFechassss num', res[0].num);
			console.log('porFechassss pag', res[0].pago);
			$scope.sigue = res[0];
		});
	}

	init();


}])

.controller('FacturacionCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	var init = function(){

		// obtenemos los ususarios...
		Presus.users($rootScope.user.centre).then( function(data){
			console.log('userrrrsss', data.data);
			$scope.users = data.data.data;
			console.log('userrrrsss', $scope.users);
		});

		Presus.objetivoAny($rootScope.user.centre,$scope.any).then( function(res){

			console.log("del anyyyyyyy",res);
			var resacum = [];
			var suma = 0;

			Presus.operaciones("facturacion",$rootScope.user.centre).then( function(data){
				// console.log("opciones de graficos ", data.data);
				$scope.titulo = $routeParams.operacion;

				// ponemos los objetivos en el mensual y calculamos el acumulado para despues
				if ( res !== undefined ){
					//for ( var i = 0; i <= res.length; i++)
					angular.forEach(data.data, function(v,k){
						//console.log("del anyyyyyyy",v);
						v.objetivo = res[k].fact;
						resacum.push((v.objetivo)*1 + suma);
						suma = (v.objetivo)*1 + suma;
					});
				}


				var anyactual = moment().format('YYYY');
				$scope.anys = {};

				var arrayKeysLabels = [];
				var sec = 5;
				for (var i = anyactual; i >= anyactual-4; i-- ){
					arrayKeysLabels.unshift( i );
					$scope.anys[sec] = i;
					sec--;
				}
				$scope.anys[6] = 'objetivo';

				//console.log($scope.anys);

				$scope.chart_options = {
					xkey: 'mes',
					ykeys: arrayKeysLabels,
					labels: arrayKeysLabels,
					hideHover: "true",
					resize: true
				};

				// los datos son comunes
				//console.log("annyyyyssss",$scope.anys);
				console.log("facturacionnnnn",data.data);
				$scope.data = data.data;

				// acumulados
				var acum = [];
				var any = {};
				for (var i = anyactual; i >= anyactual-4; i-- ){
					any[i] = 0;
				}
				acum.push(any);
				angular.forEach(data.data, function(value,key){
					//console.log(key);
					var temp = {};
					temp['mes']  = (key+1).toString();
					for (var i = anyactual; i >= anyactual-4; i-- ){
						temp[i] = acum[key][i] + Math.floor(value[i]);
					}
					//console.log(temp);
					acum.push(temp);
				});

				//console.log("facturacionnnnn",resacum);

				acum.shift();

				// ponemos los objetivos en el acumulado
				angular.forEach(acum, function(v,k){
					//console.log("del anyyyyyyy",v);
					v.objetivo = resacum[k];
				});

				$scope.data_acum = acum;
			});

		});
	}

	init();

	$scope.porColaborador = function(col){
		if (col === undefined){
			init();
			return;
		}

		//var resacum = [];
		var suma = 0;

		Presus.operacionesCol("facturacion",$rootScope.user.centre,col).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			// ponemos los objetivos en el mensual y calculamos el acumulado para despues
			//angular.forEach(data.data, function(v,k){
			//	//console.log("del anyyyyyyy",v);
			//	v.objetivo = res[k].fact;
			//	resacum.push((v.objetivo)*1 + suma);
			//	suma = (v.objetivo)*1 + suma;
			//});

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}
			// $scope.anys[6] = 'objetivo';

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			//console.log("annyyyyssss",$scope.anys);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});

			//console.log("facturacionnnnn",resacum);
			// saca el primer valor del array
			acum.shift();

			// ponemos los objetivos en el acumulado
			//angular.forEach(acum, function(v,k){
			//	//console.log("del anyyyyyyy",v);
			//	v.objetivo = resacum[k];
			//});
			console.log("facturacionn acumm",acum);
			$scope.data_acum = acum;
		});
	}

	$scope.exportarMes = function(){
		// alasql.com
		// https://github.com/agershun/alasql
		var name =
		alasql('SELECT * INTO XLSX("facturacion-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data]);
	}
	$scope.exportarAcum = function(){
		alasql('SELECT * INTO XLSX("facturacion-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum]);
	}

	$scope.exportarAcumCol = function(){
		alasql('SELECT * INTO XLSX("facturacion-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum_col]);
	}

}])

.controller('EmitidasCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	var init = function(){

		Presus.operaciones("facturasEmitidas",$rootScope.user.centre).then( function(data){
			// console.log("opciones de graficos ", data.data);
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			//console.log("annyyyyssss",$scope.anys);
			console.log("facturacionnnnn",data.data);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});

			//console.log("facturacionnnnn",resacum);
			acum.shift();
			$scope.data_acum = acum;
		});

	}

	init();

	$scope.exportarMes = function(){
		// alasql.com
		// https://github.com/agershun/alasql
		var name =
		alasql('SELECT * INTO XLSX("emitidas-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data]);
	}
	$scope.exportarAcum = function(){
		alasql('SELECT * INTO XLSX("emitidas-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum]);
	}

}])

.controller('PagosCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.operaciones("pagos",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});
	}

	init();

}])

.controller('PresupuestadosCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.presupuestados($rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = "Tratamientos presupuestados";

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});
	}

	init();

	$scope.calcula = function(real) {
		console.log("reeeallll", real);
	}

	$scope.exportarMes = function(){
		// alasql.com
		// https://github.com/agershun/alasql
		var name =
		alasql('SELECT * INTO XLSX("presupuestados-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data]);
	}
	$scope.exportarAcum = function(){
		alasql('SELECT * INTO XLSX("presupuestados-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum]);
	}


}])
.controller('AceptadosCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.aceptados($rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = "Tratamientos aceptados";

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});
	}

	init();

	$scope.exportarMes = function(){
		// alasql.com
		// https://github.com/agershun/alasql
		var name =
		alasql('SELECT * INTO XLSX("aceptados-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data]);
	}
	$scope.exportarAcum = function(){
		alasql('SELECT * INTO XLSX("aceptados-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum]);
	}


}])

.controller('CarteraCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		$scope.titulo = "Cartera de tratamientos";
		$scope.cartera = [];
		var yearactual = moment().format('YYYY');

		var obj = {};

		Presus.cartera( $rootScope.user.centre, yearactual-2 ).then( function(data){
			$scope.anyo2 = yearactual-2;
			$scope.cartera2 = data.data[0].importe;
		});
		Presus.cartera( $rootScope.user.centre, yearactual-1 ).then( function(data){
			$scope.anyo1 = yearactual-1;
			$scope.cartera1 = data.data[0].importe;
		});
		Presus.cartera( $rootScope.user.centre, yearactual ).then( function(data){
			$scope.anyo0 = yearactual;
			$scope.cartera0 = data.data[0].importe;
		});
		console.log("carterraaaaaa", $scope.cartera);
	}

	init();

	$scope.exportarMes = function(){
		// alasql.com
		// https://github.com/agershun/alasql
		var name =
		alasql('SELECT * INTO XLSX("cartera-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data]);
	}
	$scope.exportarAcum = function(){
		alasql('SELECT * INTO XLSX("cartera-acum-'+$rootScope.user.centre+'.xlsx",{headers:true}) FROM ?',[$scope.data_acum]);
	}

}])

.controller('FacturacionOperacionesCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){

/*
		Presus.operaciones($routeParams.operacion,$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			console.log(data.data[0]);
			var datos = [];
			angular.forEach(data.data[0], function(value,key){
				if ( key > anyactual-4 ){
					var temp = {};
					temp['any'] = key;
					temp['value'] = value;
					datos.push(temp);
				}
			});
			console.log(datos);

			$scope.chart_options = {
				xkey: 'any',
				ykeys: ['value'],
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};


			// los datos son comunes
			//$scope.data = data.data;
			$scope.data = datos;

			$scope.variable = $routeParams.operacion;

		});
		*/

	// ******************************************************************
	// para los calculos de las facturaciones mensuales de especialidades
	// ******************************************************************

		Presus.operaciones("m"+$routeParams.operacion,$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			 console.log(data.data);
			$scope.data = data.data;

			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});

	}

	init();

}])

.controller('FacturacionEspecialidadesCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.operaciones($routeParams.operacion,$rootScope.user.centre).then( function(data){

			var anyactual = moment().format('YYYY');

			$scope.queso0 = [];
			$scope.queso1 = [];
			$scope.queso2 = [];
			$scope.queso3 = [];

			$scope.suma0 = 0;
			$scope.suma1 = 0;
			$scope.suma2 = 0;
			$scope.suma3 = 0;

			angular.forEach(data.data[0], function(value,key){
				//console.log(key);
				//console.log(value);

				var acum = {};

				acum['value'] = value[0][anyactual];
				acum['label'] = key;
				$scope.queso0.push(acum);
				$scope.suma0 += acum['value'];
				acum = {};
				acum['value'] = value[0][anyactual-1];
				acum['label'] = key;
				$scope.queso1.push(acum);
				$scope.suma1 += acum['value'];
				acum = {};
				acum['value'] = value[0][anyactual-2];
				acum['label'] = key;
				$scope.queso2.push(acum);
				$scope.suma2 += acum['value'];
				acum = {};
				acum['value'] = value[0][anyactual-3];
				acum['label'] = key;
				$scope.queso3.push(acum);
				$scope.suma3 += acum['value'];
				acum = {};
			});

			//console.log($scope.queso0);
			//console.log($scope.queso1);
			//console.log($scope.queso2);

			$scope.chart_options = { "data": [] };

			$scope.any0 = anyactual;
			$scope.any1 = anyactual-1;
			$scope.any2 = anyactual-2;
			$scope.any3 = anyactual-3;


		});
	}

	init();

}])

.controller('DeudaCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.operaciones('deuda',$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");

			var anyactual = moment().format('YYYY');

			console.log(data.data);

			$scope.chart_options = {
				xkey: 'any',
				ykeys: ['spositivo','snegativo'],
				labels: ['spositivo','snegativo'],
				hideHover: "true",
				resize: true
			};


			// los datos son comunes
			//$scope.data = data.data;
			$scope.data = data.data;

		});

		Presus.operaciones('deudaAnterior',$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");

			var anyactual = moment().format('YYYY');

			console.log(data.data);

			$scope.chart_options = {
				xkey: 'any',
				ykeys: ['spositivo','snegativo'],
				labels: ['spositivo','snegativo'],
				hideHover: "true",
				resize: true
			};


			// los datos son comunes
			//$scope.data = data.data;
			$scope.dataAnterior = data.data;

		});
	}

	init();

}])

.controller('PacsunicosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.operaciones("pacsunicos",$rootScope.user.centre).then( function(data){

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			//console.log("opciones de graficos ");
			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			console.log(data.data);
			$scope.data = data.data;
		});

		Presus.operaciones("pacsunicosanual",$rootScope.user.centre).then( function(data){

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			//console.log($scope.anys);

			//console.log("opciones de graficos ");
			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			// console.log(data.data);
			$scope.data_acum = data.data;
		});


		Presus.getUnicosAnuales($rootScope.user.centre).then( function(data){

			// los datos son comunes
			 console.info("anuales",data.data.data);
			$scope.data_acum_anuales = data.data.data;
		});

		Presus.operaciones("ticket",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");


			$scope.chart_options_any = {
				xkey: 'ano',
				ykeys: ['ticket'],
				labels: ['Año'],
				hideHover: "true",
				resize: true
			};

			$scope.data_ticketany = data.data;

		});
	}

	init();

}])

.controller('RatiosCtrl', ['$rootScope','$routeParams', '$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $routeParams, $scope, $location, Users, AuthService, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){
		$scope.variable = $routeParams.operacion;

		Presus.ratios($routeParams.operacion,$rootScope.user.centre).then( function(data){

			//console.log("opciones de graficos ");
			$scope.chart_options = {
				xkey: 'ano',
				ykeys: ['aprobado'],
				labels: ['aprobado'],
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			console.log(data.data);
			$scope.data = data.data;
		});

	}

	init();

}])


.controller('TratamientosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		var anyactual = moment().format('YYYY');
		$scope.anys = {};

		var arrayKeysLabels = [];
		var sec = 5;
		for (var i = anyactual; i >= anyactual-4; i-- ){
			arrayKeysLabels.unshift( i );
			$scope.anys[sec] = i;
			sec--;
		}

		//console.log("opciones de graficos ");
		$scope.chart_options = {
			xkey: 'mes',
			ykeys: arrayKeysLabels,
			labels: arrayKeysLabels,
			hideHover: "true",
			resize: true
		};
		Presus.operaciones("tratamientos",$rootScope.user.centre).then( function(data){
			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;
			//console.log(data.data);
		});
		Presus.operaciones("tiempostratamientos",$rootScope.user.centre).then( function(data){
			// los datos son comunes
			// console.log(data.data);
			$scope.datatiempos = data.data;
			//console.log(data.data);
		});
		Presus.operaciones("mediastiempostratamientos",$rootScope.user.centre).then( function(data){
			// los datos son comunes
			// console.log(data.data);
			$scope.datamedias = data.data;
			//console.log(data.data);
		});

	}

	init();

}])


.controller('CitasCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		var anyactual = moment().format('YYYY');
		$scope.anys = {};

		var arrayKeysLabels = [];
		var sec = 5;
		for (var i = anyactual; i >= anyactual-4; i-- ){
			arrayKeysLabels.unshift( i );
			$scope.anys[sec] = i;
			sec--;
		}

		//console.log("opciones de graficos ");
		$scope.chart_options = {
			xkey: 'mes',
			ykeys: arrayKeysLabels,
			labels: arrayKeysLabels,
			hideHover: "true",
			resize: true
		};

		Presus.operaciones("totalcitas",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");

			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;
			//console.log(data.data);
			// acumulados
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});

		Presus.operaciones("citasedad",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.chart_options_edad = {
				xkey: 'ano',
				ykeys: ['E_00_08','E_09_12','E_13_18','E_19_25','E_26_35','E_36_45','E_46_55','E_56_65','E_66_99'],
				labels: ['E_00_08','E_09_12','E_13_18','E_19_25','E_26_35','E_36_45','E_46_55','E_56_65','E_66_99'],
				hideHover: "true"
			};

			// los datos son comunes
			// console.log(data.data);
			$scope.data_edad = data.data;
			//console.log(data.data);
		});
	}

	init();

}])

.controller('OperacionesCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Presus', '$timeout', 'Globales',
					function($rootScope, $scope, $location, Users, $routeParams, Presus, $timeout, Globales ) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		// obtenemos los ususarios...
		Presus.users($rootScope.user.centre).then( function(data){
			// console.log('userrrrsss', data.data);
			$scope.users = data.data.data;
			// console.log('userrrrsss', $scope.users);
		});

		$scope.ratiofracasoimplantes = 0;

		//console.log($routeParams.operacion);
		// si estamos en implantes fracasados, calcula el ratio de fracaso
		// ImplantesFracasados
		if ($routeParams.operacion==='ImplantesFracasados') {
			Presus.RatioFracasoImplantes($rootScope.user.centre).then( function(data){
				//console.log('ImplantesFracasados', data);
				$scope.ratiofracasoimplantes = (data[0].fracasados/data[0].realizados*100).toFixed(1);
				//console.log('ImplantesFracasados', $scope.ratiofracasoimplantes);
			});
			// anuales anteriores
			Presus.RatioFracasoImplantesAnual($rootScope.user.centre).then( function(data){
				console.log('RatioFracasoImplantesAnual', data);
				$scope.ratios = data;
				// console.log('ImplantesFracasados', $scope.ratiofracasoimplantes);
			});
		}


		// PARA EL NUMERO DE LAS OPERACIONES DE PROCEDIMIENTOS
		Presus.operaciones($routeParams.operacion,$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			// coloca el anys en un array
			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			// opcions del grafic
			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			$scope.data = Globales.meses(data.data);

			// acumulados: primer els calculem de la variable original
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.info("KEY ",key);
				//console.info("VALUE",value);
				var temp = {};
				//temp['mes']  = (key+1).toString();
				temp['mes']  = value.mes;
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
					//console.info("any ",i);
					//console.info("acumla ",temp[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});

			acum.shift();

			$scope.data_acum = Globales.meses(acum);

			// PARA LA FACTURACION DE LAS OPERACIONES DE PROCEDIMIENTOS
			// va aqui dentro porque necesitamos esperar la recepcion de la variable $scope.data_acum
			//
			Presus.operacionesFacturacion($routeParams.operacion,$rootScope.user.centre).then( function(data){
				//console.log("opciones de graficos ");
				$scope.titulo = $routeParams.operacion;

				var anyactual = moment().format('YYYY');
				$scope.anys = {};

				// coloca el anys en un array
				var arrayKeysLabels = [];
				var sec = 5;
				for (var i = anyactual; i >= anyactual-4; i-- ){
					arrayKeysLabels.unshift( i );
					$scope.anys[sec] = i;
					sec--;
				}

				// opcions del grafic
				$scope.chart_options = {
					xkey: 'mes',
					ykeys: arrayKeysLabels,
					labels: arrayKeysLabels,
					hideHover: "true",
					resize: true
				};

				$scope.datafactur = Globales.meses(data.data);

				// acumulados: primer els calculem de la variable original
				var acum = [];
				var any = {};
				for (var i = anyactual; i >= anyactual-4; i-- ){
					any[i] = 0;
				}
				acum.push(any);
				angular.forEach(data.data, function(value,key){
					//console.log(key);
					var temp = {};
					//temp['mes']  = (key+1).toString();
					temp['mes']  = value.mes;
					for (var i = anyactual; i >= anyactual-4; i-- ){
						temp[i] = acum[key][i] + Math.floor(value[i]);
					}
					//console.log(temp);
					acum.push(temp);
				});

				acum.shift();


				$scope.datafactur_acum = Globales.meses(acum);
				//console.info("$scope.datafactur_acum",$scope.datafactur_acum);

				// preu mitg per tractament
				acum = [];
				var temp = {};
				for (var i = anyactual; i >= anyactual-4; i-- ){
					//console.info("preus ", $scope.datafactur_acum[11][i]);
					//console.info("altre ", $scope.data_acum[11][i]);
					//console.log($scope.datafactur_acum[11][i]);
					//console.log($scope.datafactur_acum[11][i]/$scope.data_acum[11][i]);
					temp[i] = Math.floor( $scope.datafactur_acum[11][i]/$scope.data_acum[11][i] );
				}
				acum.push(temp);
				//console.log(acum);
				$scope.datafactur_media = acum;

			});
		});
	}

	init();

	// ************ Añadido por peticion de E.Ariza 12-12-2016
	// Operaciones por colaborador
	$scope.porColaborador = function(col){
		console.log("por colaborador ", col);
		console.log("para  ", $routeParams.operacion);

		if (col === undefined){
			init();
			return;
		}

		var suma = 0;

		// aqui va lo mismo que en la llamada normal pero con el colaborador enganchado
		Presus.operacionesCol($routeParams.operacion,$rootScope.user.centre,col).then( function(data){
			console.log("opciones de graficos ");
			$scope.titulo = $routeParams.operacion;

			var anyactual = moment().format('YYYY');
			$scope.anys = {};

			// coloca el anys en un array
			var arrayKeysLabels = [];
			var sec = 5;
			for (var i = anyactual; i >= anyactual-4; i-- ){
				arrayKeysLabels.unshift( i );
				$scope.anys[sec] = i;
				sec--;
			}

			// opcions del grafic
			$scope.chart_options = {
				xkey: 'mes',
				ykeys: arrayKeysLabels,
				labels: arrayKeysLabels,
				hideHover: "true",
				resize: true
			};

			$scope.data = Globales.meses(data.data);

			// acumulados: primer els calculem de la variable original
			var acum = [];
			var any = {};
			for (var i = anyactual; i >= anyactual-4; i-- ){
				any[i] = 0;
			}
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.info("KEY ",key);
				//console.info("VALUE",value);
				var temp = {};
				//temp['mes']  = (key+1).toString();
				temp['mes']  = value.mes;
				for (var i = anyactual; i >= anyactual-4; i-- ){
					temp[i] = acum[key][i] + Math.floor(value[i]);
					//console.info("any ",i);
					//console.info("acumla ",temp[i]);
				}
				//console.log(temp);
				acum.push(temp);
			});

			acum.shift();

			$scope.data_acum = Globales.meses(acum);

			// PARA LA FACTURACION DE LAS OPERACIONES DE PROCEDIMIENTOS
			// va aqui dentro porque necesitamos esperar la recepcion de la variable $scope.data_acum
			//
			Presus.operacionesFacturacionCol($routeParams.operacion,$rootScope.user.centre,col).then( function(data){
				//console.log("opciones de graficos ");
				$scope.titulo = $routeParams.operacion;

				var anyactual = moment().format('YYYY');
				$scope.anys = {};

				// coloca el anys en un array
				var arrayKeysLabels = [];
				var sec = 5;
				for (var i = anyactual; i >= anyactual-4; i-- ){
					arrayKeysLabels.unshift( i );
					$scope.anys[sec] = i;
					sec--;
				}

				// opcions del grafic
				$scope.chart_options = {
					xkey: 'mes',
					ykeys: arrayKeysLabels,
					labels: arrayKeysLabels,
					hideHover: "true",
					resize: true
				};

				$scope.datafactur = Globales.meses(data.data);

				// acumulados: primer els calculem de la variable original
				var acum = [];
				var any = {};
				for (var i = anyactual; i >= anyactual-4; i-- ){
					any[i] = 0;
				}
				acum.push(any);
				angular.forEach(data.data, function(value,key){
					//console.log(key);
					var temp = {};
					//temp['mes']  = (key+1).toString();
					temp['mes']  = value.mes;
					for (var i = anyactual; i >= anyactual-4; i-- ){
						temp[i] = acum[key][i] + Math.floor(value[i]);
					}
					//console.log(temp);
					acum.push(temp);
				});

				acum.shift();


				$scope.datafactur_acum = Globales.meses(acum);
				//console.info("$scope.datafactur_acum",$scope.datafactur_acum);

				// preu mitg per tractament
				acum = [];
				var temp = {};
				for (var i = anyactual; i >= anyactual-4; i-- ){
					//console.info("preus ", $scope.datafactur_acum[11][i]);
					//console.info("altre ", $scope.data_acum[11][i]);
					//console.log($scope.datafactur_acum[11][i]);
					//console.log($scope.datafactur_acum[11][i]/$scope.data_acum[11][i]);
					temp[i] = Math.floor( $scope.datafactur_acum[11][i]/$scope.data_acum[11][i] );
				}
				acum.push(temp);
				//console.log(acum);
				$scope.datafactur_media = acum;

			});
		});


	}

}])


.controller('PrimerasCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$timeout',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $timeout) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }


	var init = function(){

		Presus.operaciones("primeras",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			$scope.chart_options = {
				xkey: 'mes',
				ykeys: ['2008', '2009', '2010', '2011', '2012', '2013', '2014'],
				labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014'],
				xLabel: 'month',
				hideHover: "true",
				resize: true
			};


			// los datos son comunes
			// console.log(data.data);
			$scope.data = data.data;
			//console.log(data.data);
			var acum = [];
			var any = {};
			any['2008'] = 0;
			any['2009'] = 0;
			any['2010'] = 0;
			any['2011'] = 0;
			any['2012'] = 0;
			any['2013'] = 0;
			any['2014'] = 0;
			acum.push(any);
			angular.forEach(data.data, function(value,key){
				//console.log(key);
				var temp = {};
				temp['mes']  = (key+1).toString();
				temp['2008'] = acum[key]['2008'] + Math.floor(value['2008']);
				temp['2009'] = acum[key]['2009'] + Math.floor(value['2009']);
				temp['2010'] = acum[key]['2010'] + Math.floor(value['2010']);
				temp['2011'] = acum[key]['2011'] + Math.floor(value['2011']);
				temp['2012'] = acum[key]['2012'] + Math.floor(value['2012']);
				temp['2013'] = acum[key]['2013'] + Math.floor(value['2013']);
				temp['2014'] = acum[key]['2014'] + Math.floor(value['2014']);
				//console.log(temp);
				acum.push(temp);
			});
			acum.shift();
			//console.log(acum);
			$scope.data_acum = acum;
		});

		Presus.operaciones("primerasedad",$rootScope.user.centre).then( function(data){
			//console.log("opciones de graficos ");
			//$scope.chart_options_edad = {
			//	xkey: 'ano',
			//	ykeys: ['E_00_08','E_09_12','E_13_18','E_19_25','E_26_35','E_36_45','E_46_55','E_56_65','E_66_99'],
			//	labels: ['E_00_08','E_09_12','E_13_18','E_19_25','E_26_35','E_36_45','E_46_55','E_56_65','E_66_99'],
			//	hideHover: "true"
			//};
			var anyactual = moment().format('YYYY');
			var arranys = [];
			for (var i=anyactual-4; i<=anyactual;i++){
				arranys.push(i);
			}
			$scope.chart_options_edad = {
				xkey: 'label',
				//ykeys: ['2012','2013','2014','2015','2016'],
				ykeys: arranys,
				labels: arranys,
				hideHover: "true",
				resize: true
			};

			// los datos son comunes
			// console.log(data.data);
			//$scope.data_edad = data.data;
			console.log(data.data);

			var acum = [];
			var any = {};
			any['E_00_08'] = {};
			any['E_09_12'] = {};
			any['E_13_18'] = {};
			any['E_19_25'] = {};
			any['E_26_35'] = {};
			any['E_36_45'] = {};
			any['E_46_55'] = {};
			any['E_56_65'] = {};
			any['E_66_99'] = {};
			//acum.push(any);
			angular.forEach(data.data, function(value,key){
				{};
				//console.log(value);
				var quinany = value.ano;
				angular.forEach(value, function(valor,clave){
					if ( clave !== "ano"){
						any[clave][quinany] = valor;
						any[clave]['label'] = clave;
					}
					//acum.push(any);
				})
			});
			//acum.shift();
			var res = [];
			angular.forEach(any, function(value,key){
				res.push(value);
			});
			console.log(res);
			$scope.data_edad = res;
			//$scope.anys = ['2012','2013','2014','2015','2016'];
			$scope.anys = arranys;

		});
	}

	init();

}])

.controller('OportunidadesCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	Presus.oportunitat($rootScope.user.centre).then( function(res){
    	console.log("oportunidad", res);
    	//return res[res.length - 1];
    	$scope.oportunidad = res[0];
    	$scope.lista('A');
    });



	$scope.lista = function(tipo){
		console.log("listaaaaaaaaa 300000", tipo);
		Presus.listaABC($rootScope.user.centre,tipo).then( function(res){
			console.log("listaaaaaaaaa 300000", res);
			$scope.listado = res;
			$scope.cuentalistado = res.length;
		});
	}


	//$scope.$watch('mes',function(newVal,oldVal){
	//    if(newVal){
	//     	//console.log(newVal + "---" + oldVal);
	//     	tots();
	//        //$scope.calculated=2*newVal;
	//	}
	//});

}])

.controller('NewResumenPresupuestosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', '$q', '$compile', '$timeout', '$http',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman, $q, $compile, $timeout, $http) {
	//===============================================
	// por defecto listado de pptos


	//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	console.log("roootttt", $rootScope);

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	$scope.listado = [];
	$scope.exito = {};
	$scope.tipo = 'A';

	$scope.easypiechart = {
	//percent: Number(perc),
		options: {
			animate: {
				duration: 1500,
				enabled: true
			},
			barColor: '#2EC1CC',
			lineCap: 'round',
			size: 180,
			lineWidth: 5
		}
	};

	//===============================================
	//funciones de peticion de exito y feina
	//===============================================

	$scope.calcula = function(d){

		// treintadias con fecha final la ultima del rango (en $scope.real)
		var treintadias = {};
		var estemes = {};
		var esteany = {};
		var vengodeformulario = 0;

		if ( d === null ){

			// calculo para el dia de la fecha de hoy
			var d = {};
			// hoy
			d.hdia = moment().format('DD');
			d.hmes = moment().format('MM');
			d.hany = moment().format('YYYY');
			// ultimos 7 dias
			d.ddia = moment().subtract(7, 'days').format('DD');
			d.dmes = moment().subtract(7, 'days').format('MM');
			d.dany = moment().subtract(7, 'days').format('YYYY');

			var desde = d.hany+'-'+d.hmes+'-'+d.hdia;
			treintadias.ddia = moment(desde).subtract(30, 'days').format('DD');
			treintadias.dmes = moment(desde).subtract(30, 'days').format('MM');
			treintadias.dany = moment(desde).subtract(30, 'days').format('YYYY');

			treintadias.hdia = d.hdia;
			treintadias.hmes = d.hmes;
			treintadias.hany = d.hany;

		} else {
			// cuando forzamos el calculo desde el formulario

			vengodeformulario = 1;

			// hasta
			d.hdia = $scope.real.hdia;
			d.hmes = $scope.real.hmes;
			d.hany = $scope.real.hany;
			// desde
			d.ddia = $scope.real.ddia;
			d.dmes = $scope.real.dmes;
			d.dany = $scope.real.dany;

			// hasta
			treintadias.hdia = $scope.real.hdia;
			treintadias.hmes = $scope.real.hmes;
			treintadias.hany = $scope.real.hany;
			// desde
			treintadias.ddia = $scope.real.ddia;
			treintadias.dmes = $scope.real.dmes;
			treintadias.dany = $scope.real.dany;

		}

		$scope.real = angular.copy( d );

		// para el calculo de la facturacion de semana, mes, año
		esteany.ddia = '01';
		esteany.dmes = '01';
		esteany.dany = moment().format('YYYY');

		estemes.ddia = '01';
		estemes.dmes = $scope.real.hmes;
		estemes.dany = moment().format('YYYY');
		estemes.hdia = $scope.real.hdia;
		estemes.hmes = $scope.real.hmes;
		estemes.hany = moment().format('YYYY');

		esteany.hdia = treintadias.hdia = $scope.real.hdia;
		esteany.hmes = treintadias.hmes = $scope.real.hmes;
		esteany.hany = treintadias.hany = $scope.real.hany;

		console.log("fechasssss", d);

		// calculo del rango estandar
		Presus.feinaGD($rootScope.user.centre,d).then( function(res){
			console.log("feinaaaa GGDDDD", res.data[0]);
			$scope.feina = res.data[0];
		});
		Presus.feinaPresusGD($rootScope.user.centre,d).then( function(res){
			console.log("feinaaaa GGDDDD", res.data[0]);
			$scope.pfeina = res.data[0];
		});

		// calculo del rango de 30 dias
		Presus.feinaGD($rootScope.user.centre,treintadias).then( function(res){
			console.log("feinaaaa GGDDDD", res.data[0]);
			$scope.mfeina = res.data[0];
		});
		Presus.feinaPresusGD($rootScope.user.centre,treintadias).then( function(res){
			console.log("feinaaaa GGDDDD", res.data[0]);
			$scope.pmfeina = res.data[0];
		});

		// FACTURACION
		// semana
		Presus.facturacionFechas($rootScope.user.centre,d).then( function(res){
			console.log("factweek", d);
			$scope.factweek = res[0].pago;

			if ( vengodeformulario === 0 ){
				// solo calcula las facturaciones si es el informe de dia de hoy
				// si viene de formulario no se calcula
				// mes
				Presus.facturacionFechas($rootScope.user.centre,estemes).then( function(res){
					//console.log("factmes", res);
					$scope.factmes = res[0].pago;
				});
				// any
				Presus.facturacionFechas($rootScope.user.centre,esteany).then( function(res){
					//console.log("factany", res);
					$scope.factany = res[0].pago;
				});
			} else {
				$scope.factmes = $scope.factweek;
				//$scope.factany = $scope.factweek;
				$scope.vengodeformulario = vengodeformulario;
			}

		});

		// calculo de la cartera
		Presus.cartera($rootScope.user.centre,esteany.dany).then( function(res){
			console.log("carterraaa GGDDDD", res.data[0]);
			$scope.cartera = res.data[0].importe;
		});


		// captura de la lista de 30 dias
		// lista(treintadias);
	}

	var feina_jt = function(){
		Presus.feina($rootScope.user.centre,d).then( function(res){
			//console.log("feinaaaa", res);
			$scope.feina = {};
			angular.forEach(res, function(v){
				if ( v.ano == $scope.any && v.mes == $scope.mes ){
					$scope.feina = v;
				}
			});
		});

	}

	var lista = function(treintadias){
		//console.log("listaaaaaaaaa 300000", treintadias);
		Presus.lista($rootScope.user.centre,treintadias).then( function(res){
			//console.log("listaaaaaaaaa 300000", res);
			$scope.listado = res;
			$scope.cuentalistado = res.length;
		});
	}

	//===============================================
	//llamadas a inicio
	//===============================================
	//exito();
	//feina();

	console.log("weeekkkkkk", moment().calendar('Last Week') );

	// var d = {};
	// // hoy
	// d.hdia = moment().format('DD');
	// d.hmes = moment().format('MM');
	// d.hany = moment().format('YYYY');
	// // ultimos 7 dias
	// d.ddia = moment().subtract(7, 'days').format('DD');
	// d.dmes = moment().subtract(7, 'days').format('MM');
	// d.dany = moment().subtract(7, 'days').format('YYYY');
//
	// $scope.real = angular.copy( d );
	$scope.calcula(null);

}])

.controller('AuroraResumenPresupuestosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', '$q', '$compile', '$timeout', '$http',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman, $q, $compile, $timeout, $http) {
	//===============================================
	// por defecto listado de pptos


	//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	console.log("roootttt", $rootScope);

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	$scope.listado = [];
	$scope.exito = {};
	$scope.tipo = 'A';

	$scope.easypiechart = {
	//percent: Number(perc),
		options: {
			animate: {
				duration: 1500,
				enabled: true
			},
			barColor: '#2EC1CC',
			lineCap: 'round',
			size: 180,
			lineWidth: 5
		}
	};

	$scope.calcula = function(d){

		// fecha del rango (en $scope.real)
		//console.log("ddddddd", d);

		// treinatdias con fecha final la ultima del rango (en $scope.real)
		var treintadias = {};
		var estemes = {};
		var esteany = {};

		var desde = $scope.real.hany+'-'+$scope.real.hmes+'-'+$scope.real.hdia;

		treintadias.ddia = moment(desde).subtract(30, 'days').format('DD');
		treintadias.dmes = moment(desde).subtract(30, 'days').format('MM');
		treintadias.dany = moment(desde).subtract(30, 'days').format('YYYY');

		esteany.ddia = '01';
		esteany.dmes = '01';
		esteany.dany = moment().format('YYYY');

		estemes.ddia = '01';
		estemes.dmes = $scope.real.hmes;
		estemes.dany = moment().format('YYYY');
		estemes.hdia = $scope.real.hdia;
		estemes.hmes = $scope.real.hmes;
		estemes.hany = moment().format('YYYY');

		esteany.hdia = treintadias.hdia = $scope.real.hdia;
		esteany.hmes = treintadias.hmes = $scope.real.hmes;
		esteany.hany = treintadias.hany = $scope.real.hany;

		//console.log("treintadiassssssss", treintadias);

		$scope.real = angular.copy( d );

		// calculo del rango estandar
		Presus.feina_ao($rootScope.user.centre,d).then( function(res){
			//console.log("feinaaaa 777", res);
			$scope.feina = res;
		});
		// calculo del rango de 30 dias
		Presus.feina_ao($rootScope.user.centre,treintadias).then( function(res){
			//console.log("feinaaaa messs", res);
			$scope.mfeina = res;
		});
		// FACTURACION
		// semana
		Presus.facturacionFechas($rootScope.user.centre,d).then( function(res){
			//console.log("factweek", res);
			$scope.factweek = res[0].pago;
		});
		// mes
		Presus.facturacionFechas($rootScope.user.centre,estemes).then( function(res){
			//console.log("factmes", res);
			$scope.factmes = res[0].pago;
		});
		// any
		Presus.facturacionFechas($rootScope.user.centre,esteany).then( function(res){
			//console.log("factany", res);
			$scope.factany = res[0].pago;
		});

		// captura de la lista de 30 dias
		lista(treintadias);
	}

	var feina_jt = function(){
		Presus.feina($rootScope.user.centre,d).then( function(res){
			//console.log("feinaaaa", res);
			$scope.feina = {};
			angular.forEach(res, function(v){
				if ( v.ano == $scope.any && v.mes == $scope.mes ){
					$scope.feina = v;
				}
			});
		});

	}

	var lista = function(treintadias){
		//console.log("listaaaaaaaaa 300000", treintadias);
		Presus.lista($rootScope.user.centre,treintadias).then( function(res){
			//console.log("listaaaaaaaaa 300000", res);
			$scope.listado = res;
			$scope.cuentalistado = res.length;
		});
	}

	console.log("weeekkkkkk", moment().calendar('Last Week') );

	var d = {};
	// hoy
	d.hdia = moment().format('DD');
	d.hmes = moment().format('MM');
	d.hany = moment().format('YYYY');
	// ultimos 7 dias
	d.ddia = moment().subtract(7, 'days').format('DD');
	d.dmes = moment().subtract(7, 'days').format('MM');
	d.dany = moment().subtract(7, 'days').format('YYYY');

	$scope.real = angular.copy( d );
	$scope.calcula(d);

}])

.controller('AddPresupuestoCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', 'logger',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman, logger) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	console.log("add ppto");
	$scope.ppto = {
		"responsable" : $rootScope.user.id,
		"centre" : $rootScope.user.centre,
		"notas" : $rootScope.user.nom
	};
	console.log($scope.ppto);

	$scope.add = function(ppto){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		console.log("this is the new pac for ppto....", ppto);
		var pac = ppto;

		Presus.addPptoExterno(ppto).then( function(data){
			//

			// Existo como paciente en Rocks pero NO tengo ningun presupuesto
				// te crearmos un presupuesto de valor 0 para dar inicio...
				// datos base del presupuesto...
				logger.log("Paciente sin ningún presupuesto. Vamos a creale uno.");
				var ppto = {
					"pacient"		: pac.Nombre + " " + pac.Apellidos,
					"telefon"   	: pac.TelMovil,
					"responsable" 	: $rootScope.user.id,
					"motiu_id" 		: "",
					"centre" 		: $rootScope.user.centre,
					"edat" 			: 0,
					"notas" 		: $rootScope.user.nom,
					"import" 		: 0,
			    	"NumPac" 		: pac.NumPac
				};
				console.info('ppto',ppto);
				Presus.addPpto(ppto).then( function(data){
					console.log(data);
					// podemos buscar aqui el id del ultimo ppto recien entrado para editarlo...
					//(mysql_insert_id)
					Presus.lastPpto().then( function(datalast){
						var ultimo = datalast.data[0];
						console.info('ultimo',ultimo);
						$location.path("/editappto/"+ultimo.id);
					});
					//$location.path("/presupuestos");
				});
		});
	}

}])

.controller('AddPacPresupuestoCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', 'PresusPac', 'logger', 'dialogs',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman, PresusPac, logger, dialogs ) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	console.log("AddPacPresupuestoCtrl");
	console.log("user", $rootScope.user);
	$scope.eneresi = 0;
	if ( $rootScope.user.marca === 'Eneresi'){
		$scope.eneresi = 1;
		//$route.reload();
	}
	else {
		$location.path("/addPpto");
	}


	$scope.getPresusPacGesdent = function(pac){

		var retorn;

		PresusPac.getPresusPacGesdent($rootScope.user.centre,pac.numpac).then( function(data){
			// busca el paciente en gesdent
			console.log("colllooonnss", data);
			if (data.data.length == 0){
				console.info("no estoy");
				$scope.pac = {};
				logger.log("No hay ningun paciente con este identificador.");
			}else{
				//console.info("getPresusPac", data.data.data[0]);
				retorn = data.data.data[0];
				console.log("retoorrrrn", retorn);
				retorn.centro = $rootScope.user.centre;

				logger.log("Paciente localizado. Comprobando posibles duplicados.");
				$scope.pacient = retorn.Nombre + " " + retorn.Apellidos;

				// comprueba que no este duplicado en nuestra bd del rocks
				PresusPac.comprueba($rootScope.user.centre,pac.numpac).then( function(data){
					console.info("existo como paciente de esta clinica? ",data.data);

					// existo como paciente de esta clinica?
					if (data.error == 0){
						// SI existo como paciente de esta clinica
						Presus.getPptosPaciente($rootScope.user.centre,pac.numpac).then( function (data){
							console.info("quizas me han borrado todos los presupuestos? ",data.data);

							if ( data.data.error == 1 ){
								// Existo como paciente en Rocks pero NO tengo ningun presupuesto
									// te crearmos un presupuesto de valor 0 para dar inicio...
									// datos base del presupuesto...
									logger.log("Paciente existente sin ningún presupuesto. Vamos a creale uno.");
									var ppto = {
										"pacient"		: retorn.Nombre + " " + retorn.Apellidos,
										"telefon"   	: retorn.TelMovil,
										"responsable" 	: $rootScope.user.id,
										"motiu_id" 		: "",
										"centre" 		: $rootScope.user.centre,
										"edat" 			: 0,
										"notas" 		: $rootScope.user.nom,
										"import" 		: 0,
								    	"NumPac" 		: pac.numpac
									};
									console.info('ppto',ppto);
									Presus.addPpto(ppto).then( function(data){
										console.log(data);
										// podemos buscar aqui el id del ultimo ppto recien entrado para editarlo...
										//(mysql_insert_id)
										Presus.lastPpto().then( function(datalast){
											var ultimo = datalast.data[0];
											console.info('ultimo',ultimo);
											$location.path("/editappto/"+ultimo.id);
										});
										//$location.path("/presupuestos");
									});
							} else {
								// Existo como paciente en Rocks y SI tengo ningun presupuesto
								logger.log("Paciente duplicado. Vamos a activar su ficha");
								$location.path("/verPacPpto/"+pac.numpac);
							}

						});
					}else{
						// NO existo como paciente de esta clinica
						// damos de alta el paciente en el rocks
						console.info("soc el retorn", retorn);
						var confirmacion = dialogs.confirm("Confirmacion de alta", "Vamos a dar de alta como nuevo paciente a "+retorn.Nombre+" "+retorn.Apellidos+", con Historia "+retorn.NumPac+". ¿Quieres continuar con el alta en Rocks?");
						confirmacion.result.then(
							function(){
								PresusPac.altapaciente(retorn).then( function(data){
									// paciente dado de alta, pasamos a su ficha para añadir presupuestos
									logger.log("Paciente dado de alta. Vamos a activar su ficha.");
									//deberia crear un presupuesto de valor 0 para dar inicio...
									// datos base del presupuesto...
									var ppto = {
										"pacient"		: retorn.Nombre + " " + retorn.Apellidos,
										"telefon"   	: retorn.TelMovil,
										"responsable" 	: $rootScope.user.id,
										"motiu_id" 		: "",
										"centre" 		: $rootScope.user.centre,
										"edat" 			: 0,
										"notas" 		: $rootScope.user.nom,
										"import" 		: 0,
								    	"NumPac" 		: pac.numpac
									};
									console.info('ppto',ppto);
									Presus.addPpto(ppto).then( function(data){
										console.log(data);
										// podemos buscar aqui el id del ultimo ppto recien entrado para editarlo...
										//(mysql_insert_id)
										Presus.lastPpto().then( function(datalast){
											var ultimo = datalast.data[0];
											console.info('ultimo',ultimo);
											$location.path("/editappto/"+ultimo.id);
										});
										//$location.path("/presupuestos");
									});
									// nos deja en el presupuesto nuevo de valor 0 editado para introducirlo

									//$location.path("/verPacPpto/"+pac.numpac);
								});
							},
							function(){
								$location.path("/presupuestos");
							}
						);
					}
				});
			}
		});
	}

}])

.controller('VerPacPresupuestoCtrl', ['$rootScope','$scope', '$location', '$route', '$routeParams', 'Users', 'AuthService', 'Presus', '$filter', 'postman', 'PresusPac', 'logger', 'Paciente', 'dialogs',
					function($rootScope, $scope, $location, $route, $routeParams, Users, AuthService, Presus, $filter, postman, PresusPac, logger, Paciente, dialogs ) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.pac;
	$scope.sumapptos = 0;

	//console.log("VerPacPresupuestoCtrl");
	$scope.ppto = {
		"NumPac" : $routeParams.numpac,
		"responsable" : $rootScope.user.id,
		"centre" : $rootScope.user.centre,
		"notas" : $rootScope.user.nom
	};

	// al entrar recuperamos al paciente y luego sus pptos
	PresusPac.getPresusPac($rootScope.user.centre,$routeParams.numpac).then( function(data){

		$scope.pac = data.data[0];
		// cargar los presupuestos de este paciente
		Presus.getPptosPaciente($rootScope.user.centre,$routeParams.numpac).then( function(data){
			console.info("Presus.getPptosPaciente -> ",data.data.data);
			$scope.error = data.error;
			$scope.pptos = data.data.data;
			$scope.colectivo = data.data.data[0].colectivo;
			$scope.idioma = data.data.data[0].idioma;
			// calcula el importe total de todos los presupuestos
			angular.forEach($scope.pptos, function(value,key){
				//console.info("Presus.getPptosPaciente forEach -> ",value);
				$scope.sumapptos = $scope.sumapptos + Number(value.import);
			});
		});
	});

	$scope.add = function(ppto){

		console.info("por si esta el paciente -> ",$scope.pac);

		if ( ppto.notas === "" ) ppto.notas = " ";

		console.log(ppto);

		// si el importe o el motivo estan vacios ponemos nota en pantalla y no hacemos nada
		if ( typeof ppto.motiu_id != 'undefined' && ppto.import != 0 ){

			// para ajustar el valor del select
			ppto.motiu_id = ppto.motiu_id.id;
			// de relleno
			ppto.pacient = $scope.pac.Nombre + " " + $scope.pac.Apellidos;
			ppto.edat = "";
			ppto.telefon = $scope.pac.TelMovil;

			Presus.addPpto(ppto).then( function(data){
				//console.log(data);
				// podemos buscar aqui el id del ultimo ppto recien entrado para poder sugerir añadir un recall...
				//(mysql_insert_id)
				//Presus.lastPpto().then( function(datalast){
				//	var ultimo = datalast.data[0];
				//	//console.info('ultimo',ultimo);
				//	$location.path("/addRecall/"+ultimo.id+"/"+ultimo.pacient);
				//});
				//$location.path("/presupuestos");
				$scope.motiu_id = {},
				$scope.import = "",
				$route.reload();
			});
		} else {
			logger.log("Hay que especificar el importe/motivo del presupuesto.");
		}
	}

	$scope.imprime = function(ppto){

		console.info("imprime ", ppto);
		ppto.motiu_id = {};
		ppto.motiu_id.nom = ppto.tto;
		Paciente.ppto = ppto;
		$location.path("/books");
	}

	$scope.imprimeglobal = function(){

		var ppto = {};
		ppto.pacient = $scope.pac.Nombre + " " + $scope.pac.Apellidos;
		ppto.import = $scope.sumapptos;
		ppto.NumPac = $routeParams.numpac;
		ppto.motiu_id = {};
		ppto.colectivo = $scope.colectivo;
		ppto.idioma = $scope.idioma;
		ppto.motiu_id.nom = "Global";

		console.info("imprime ", ppto);

		Paciente.ppto = ppto;
		$location.path("/books");
	}

	$scope.edita = function(ppto){
		console.info("$scope.edita >",ppto);
	}

	$scope.borrappto = function(ppto){
		console.info("$scope.borra >",ppto);
		var borraPpto = dialogs.confirm('Borrar presupuesto', "¿Estas seguro de borrar este presupuesto?");
		borraPpto.result.then(
			function(){
				ppto.NumPac = "-1";
				Presus.updatePpto(ppto).then( function(data){
					$location.path("/presupuestos");
				});
			}
		);

	}

}])

.controller('PresupuestosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', '$modal', '$log',
					function($rootScope, $scope, $location, Users, AuthService, Presus, $filter, postman, $modal, $log) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;

	var perc = 0;
	$scope.easypiechart = {
	//percent: Number(perc),
		options: {
			animate: {
				duration: 1500,
				enabled: true
			},
			barColor: '#2EC1CC',
			lineCap: 'round',
			size: 180,
			lineWidth: 5
		}
	};

	$scope.tots = function(centro, tipo){
		$scope.pptos = null;
		$scope.total = 0;
		$scope.suma = 0;
		$scope.aprobados = 0;
		$scope.sumaaprobados = 0;
		$scope.mesactual = moment().format('YYYY-MM');

		$scope.detallame = 1;

		$scope.tipo = tipo;


		console.log(centro);
		console.log(tipo);

		Presus.getPptos(centro, tipo).then( function(data){
			console.log(data);
			$scope.pptos = data.data;
			$scope.cuenta = $scope.pptos.length;
			// si hi han elements de la categoria...
			if ( $scope.cuenta > 0 ){
				angular.forEach(data.data, function(value,key){
					//escurça la etiqueta d'estat
					value.estat_curt = value.estat.substring(0,2);
					//console.log(value.acceptacio);
					value.mes = moment(value.entrega).month()+1;
					value.any = moment(value.entrega).year();
					if ( value.mes == moment().format('M') ){
						$scope.total = $scope.total + 1;
						$scope.suma = $scope.suma + Number(value.import);
						$scope.aprobados = $scope.aprobados + Number( (value.acceptacio===null)?0:1 );
						$scope.sumaaprobados = $scope.sumaaprobados + Number( (value.acceptacio===null)?0:Number(value.import) );
						// porcentaje de facturacion sobre propuestos
						$scope.easypiechart.ratiocuantos = Math.floor(Number($scope.aprobados)/Number($scope.cuenta)*100);
						$scope.easypiechart.ratioimportes = Math.floor(Number($scope.sumaaprobados)/Number($scope.suma)*100);
					}
					// calcula els dies que fa que esta donar al presu
					var diferencia = moment().diff(moment(value.entrega),'days');
					if ( diferencia <= 7 ) value.color = 'white';
					if ( diferencia >  7 & diferencia <= 15 ) value.color = 'lightyellow';
					if ( diferencia > 15 & diferencia <= 30 ) value.color = 'gold';
					if ( diferencia > 30 ) value.color = 'tomato';
				});
			}
		});
	}


	$scope.tots($rootScope.user.centre, 'Seguimiento');

	$scope.addPpto = function(){
		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		console.log("nuevo ppto");
		//console.log($rootScope.user.id);
		$location.path("/addPpto");
	}

	$scope.detallamelos = function(){
		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		//console.log("nuevo ppto");
		$scope.detallame = ($scope.detallame == 0? 1:0);
	}



	$scope.recall = function(id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		//console.log("nuevo recall");
		$location.path("/addRecall/"+id);
	}

	$scope.acepta = function(centro,id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		Presus.aceptaPpto(id).then( function(data){
			//console.log(data);
			//
			// hay que cancelar todos los recalls ya que nos ha aprobado el ppto
			Presus.aceptaTodosRecalls(id).then( function(data){
				$scope.tots(centro, 'Seguimiento');
				$location.path("/presupuestos");
			});
			//
		});
	}
	$scope.noacepta = function(centro,id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		Presus.noaceptaPpto(id).then( function(data){
			//console.log(data);
			$scope.tots(centro, 'Seguimiento');
			$location.path("/presupuestos");
		});
	}
	$scope.deniega = function(centro,id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		Presus.deniegaPpto(id).then( function(data){
			//console.log(data);
			$scope.tots(centro, 'Rechazado');
			$location.path("/presupuestos");
		});
	}

	$scope.convierte = function(centro,id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		Presus.conviertePpto(id).then( function(data){
			//console.log(data);
			$scope.tots(centro, 'Convertido');
			$location.path("/presupuestos");
		});
	}

	$scope.opcional = function(centro,id){

		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

		Presus.opcionalPpto(id).then( function(data){
			//console.log(data);
			$scope.tots(centro, 'Opcional');
			$location.path("/presupuestos");
		});
	}

	$scope.delete = function(ppto){
		//console.log("borra " + id);
		Presus.deletePpto(ppto.id).then( function(data){
			console.log(data);
			$scope.tots('Seguimiento');
			$location.path("/presupuestos");
		});
	}


	$scope.resetFiltros = function(){
		console.log("reset filtros");
		$scope.busca = {};
	}

	// modal de purga
	$scope.purga = function() {

	 	var modalInstance;
	 	$log.info("vamos a purgar...");
	 	$scope.title = " Cuidado amigo! Esto cambiará el estado de los presupuestos de mas de 60 dias. Ahora pasarán a Denegados... Esto no se puede deshacer. ¿Quieres Continuar?";
	 	modalInstance = $modal.open(
	 	{
	 	 	templateUrl: "partials/modals/yesno.html",
	 	 	controller: 'YesNoController',
	 	 	resolve: {
	 	 	 	title: function(){
	 	 	 		return $scope.title;
	 	 	 	}
	 		}
		});

		modalInstance.result.then(
			function(res) {
				console.log("Modal closed at: " + new Date());
				var desde = moment().subtract('days', 60).format('YYYY-MM-DD');
				Presus.purgaPpto(desde).then( function(data){
				 	//$modalInstance.close();
					$location.path("/presupuestos");
				});
			},

			function() {
			  	console.log("Modal dismissed at: " + new Date());
			}
		);
	};


}])

.controller('ControlesCtrl', ['$rootScope','$scope', '$location', '$routeParams', 'Users', 'AuthService', 'Controles', '$filter', 'postman', '$modal', '$log', 'Books',
					function($rootScope, $scope, $location, $routeParams, Users, AuthService, Controles, $filter, postman, $modal, $log, Books) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;
	$scope.tipo = $routeParams.tipo;
	$scope.ano = $routeParams.ano;
	$scope.mes = $routeParams.mes;

	$scope.colectivos = [];

	$scope.init = function(){

		Controles.getControlesTipo($scope.centre,$scope.tipo,$scope.ano,$scope.mes).then( function(data){
			console.info("controller getcontroles",data);
			$scope.colectivos = data.data;
		});

	}

	$scope.init();

	$scope.addControl = function(obj){
		var envia = {
			"clinica_id" : $scope.centre,
			"ano" : obj.ano,
			"mes" : obj.mes,
			"programado" : obj.programado,
			"noprograma" : obj.noprograma,
			"nocontesta" : obj.nocontesta
		};
		Controles.addControl(envia).then( function(data){
			if (data.error == 0){
				$scope.obj = {};
				Controles.getControles($scope.centre).then( function(data){
					//console.info("controles",data);
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.deleteControl = function(id){
		//console.info("borra " , id);
		Controles.deleteControl(id).then( function(data){
			//console.log(data);
			if (data.error == 0){
				$scope.obj = {};
				Controles.getControles($scope.centre).then( function(data){
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.fitrotipo = function(){
		console.log("reset filtros");
		$scope.filtratipo={};
	}
	$scope.fitronom = function(){
		console.log("reset filtros");
		$scope.filtranom="";
	}


}])

.controller('ControlesListadoCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Controles', '$filter', 'postman', '$modal', '$log', 'Books',
					function($rootScope, $scope, $location, Users, AuthService, Controles, $filter, postman, $modal, $log, Books) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;
	$scope.mes = $rootScope.fecharecalls.mes;
	$scope.ano = $rootScope.fecharecalls.ano;
	//$scope.colectivos = [];

	$scope.init = function(){

		$scope.recalls = [];

		Controles.getListadoControles($scope.centre, $scope.mes, $scope.ano).then( function(data){
			// console.info("controller getListadoControles",data);
			angular.forEach(data.data, function(value,key){
				if (
					moment.unix(value.Fecha).month() == moment().month() &&
					moment.unix(value.Fecha).year() == moment().year()
				){
					value.color = "yellow";
				}
				if (
					moment.unix(value.Fecha).date() == moment().date() &&
					moment.unix(value.Fecha).month() == moment().month() &&
					moment.unix(value.Fecha).year() == moment().year()
				){
					value.color = "green";
				}
			});
			$scope.recalls = data.data;
		});

	}

	$scope.init();

	$scope.setMes = function(i){
		$rootScope.fecharecalls.mes = i;
		$scope.mes = $rootScope.fecharecalls.mes;
		$scope.init();
	}
	$scope.setAno = function(i){
		$rootScope.fecharecalls.ano = i;
		$scope.ano = $rootScope.fecharecalls.ano;
		$scope.init();
	}
	$scope.resetFiltros = function(i){
		$scope.busca.Apellidos = "";
	}

}])

.controller('ControlesEstadoCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Controles', '$filter', 'postman', '$modal', '$log', 'Books',
					function($rootScope, $scope, $location, Users, AuthService, Controles, $filter, postman, $modal, $log, Books) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;
	//$scope.colectivos = [];

	$scope.init = function(){

		$scope.recalls = [];

		$scope.easypiechart = {
		//percent: Number(perc),
			options: {
				animate: {
					duration: 1500,
					enabled: true
				},
				barColor: '#2EC1CC',
				lineCap: 'round',
				size: 180,
				lineWidth: 5
			}
		};


		Controles.getTotalControles($scope.centre).then( function(data){
			//console.info("controller estados",data);
			$scope.recalls = data;
		});

	}

	$scope.init();

}])

.controller('ControlesCartasCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Controles', '$filter', 'postman', '$modal', '$log', 'Books',
					function($rootScope, $scope, $location, Users, AuthService, Controles, $filter, postman, $modal, $log, Books) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	// --
	// inicializamos variables globales del controlador
	// --
	$scope.centre = $rootScope.user.centre;
	$scope.mes = $rootScope.fecharecalls.mes;
	$scope.ano = $rootScope.fecharecalls.ano;

	// --
	// funcion de inicializacion
	// --
	var init = function(){

		// --
		// recogemos el listado de pacientes con carta prevista del mes/año que hemos escogido
		// --
		Controles.getCartasControles($scope.centre,$rootScope.fecharecalls.mes, $rootScope.fecharecalls.ano).then( function(data){

			// --
			// recogemos las citas. loop para cada recall que tenemos en el array de controles con carta del mes/año
			// --
			angular.forEach(data.data, function(v,k){
				//console.info("controller getDetallesControles k",k);
				//console.info("controller getDetallesControles v",v);
				// --
				// añade la ultima cita que tiene en el objeto de su resultado de controles
				// --
				Controles.getDetallesControles($scope.centre, v.IdPac).then( function(data){
					//console.info("controller getDetallesControles citas",data.data);
					//$scope.citas = data.data;
					v.Cita = data.data[0].Fecha;
				});

			});
			// --
			// devolvemos el resultado en $scope.recalls
			// --
			$scope.recalls = data.data;
			//console.info("controller getCartasControles",$scope.recalls);
		});

	}

	init();

	// --
	// hemos pulsado el boton de NO enviar carta en el listado de cartas porque vemos que
	// tiene una cita mas adelante. Lo ponemos de forma forzada en citado.
	// --
	$scope.carta = function(registro,estado){
		// --
		// hemos de poner la linea del paciente como carta NO
		// --
		//console.info("citado", registro);
		//console.info("citado", estado);
		Controles.controladoComo("carta", $scope.centre, registro, estado).then( function(data){
			// --
			// hemos de poner la linea del paciente como citado SI.
			// por eso lo cambiamos, porque ya tiene una cita futura
			// --
			//console.info("controller getAlertasControles",data);
			Controles.controladoComo("citado", $scope.centre, registro, true).then( function(data){
				//console.info("controller getAlertasControles",data);
				init();
			});
		});
	}

}])

.controller('ControlesDetallesCtrl', ['$rootScope','$scope', '$routeParams','$location', 'Users', 'AuthService', 'Controles', '$filter', 'postman', '$modal', '$log', 'Books', 'logger', 'Sms',
					function($rootScope, $scope, $routeParams, $location, Users, AuthService, Controles, $filter, postman, $modal, $log, Books, logger, Sms) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;
	//$scope.colectivos = [];

	$scope.init = function(){

		$scope.recall = {};

		Controles.getPacienteControles($scope.centre, $routeParams.idpac, $rootScope.fecharecalls.mes, $rootScope.fecharecalls.ano).then( function(data){
			console.info("controller getPacienteControles",data.data);
			// hemos de recuperar si tiene llamadas anteriores
			// ponerlas en $scope.recall.llamada1/2/3
			var tieneLlamadas = 0;
			if (data.data[0].Comentario != null )
				tieneLlamadas = data.data[0].Comentario.split("#");
			//console.info("controller tieneLlamadas",tieneLlamadas);
			//console.info("devuelveme  ",data.data[0]);
			//
			$scope.recall = data.data[0];

			if (tieneLlamadas.length >= 2) $scope.recall.llamada1 = true;
			if (tieneLlamadas.length >= 3) $scope.recall.llamada2 = true;
			if (tieneLlamadas.length == 4) $scope.recall.llamada3 = true;
			//console.info("controller $scope.recall",$scope.recall);

			if (data.data[0].SMS)
				$scope.recall.SMS = true;

			// recogemos el resto de infromacion del paciente

			var idpac = data.data[0].IdPac;

			// recogemos las citas
			Controles.getDetallesControles($scope.centre, idpac).then( function(data){
				console.info("controller getDetallesControles CITAS",data);
				$scope.citas = data.data;
			});

			// recogemos los controles
			Controles.getTodosControles($scope.centre, idpac).then( function(data){
				//console.info("controller getTodosControles",data);
				$scope.controles = data.data;
			});

			// recogemos las alertas
			Controles.getAlertasControles($scope.centre, idpac).then( function(data){
				//console.info("controller getAlertasControles",data);
				$scope.alertas = data.data;
			});

			// recogemos las entradas medicas y ponemos los
			// codigos de colores de los ttos
			Controles.getTtosControles($scope.centre, idpac).then( function(data){
				//console.info("Controles.getTtosControles",data);
				angular.forEach(data.data, function(value,key){
					//console.info("valor",value);
					//console.info("clave",key);
					if (value.StaTto == 3) 			value.color = "red";
					if (value.StaTto == 2) 			value.color = "green";
					if (value.StaTto == 5) 			value.color = "cyan";
					if (value.IdTipoOdg == 11) 		value.color = "yellow";
				});
				$scope.ttos = data.data;
				$scope.ttosmed = data.data[data.data.length-1].NumTto;
			});

		});

	}

	$scope.init();

	$scope.llama1 = function(registro,estado){
		// si es para poner verdadero lo actualiza, si es para poner en falso no deja hacerlo porque se supone que ya has llamado
		if (estado){
			console.info("registro NumRec", estado);
			Controles.controladoComo("llama1", $scope.centre, registro, estado).then( function(data){
				//console.info("controller getAlertasControles",data);
				$scope.init();
			});
		} else {
			$scope.recall.llamada1 = true;
		}
	}
	$scope.llama2 = function(registro,estado){
		// si es para poner verdadero lo actualiza, si es para poner en falso no deja hacerlo porque se supone que ya has llamado
		if (estado){
			Controles.controladoComo("llama2", $scope.centre, registro, estado).then( function(data){
				//console.info("controller getAlertasControles",data);
				$scope.init();
			});
		} else {
			$scope.recall.llamada2 = true;
		}
	}
	$scope.llama3 = function(registro,estado){
		// si es para poner verdadero lo actualiza, si es para poner en falso no deja hacerlo porque se supone que ya has llamado
		if (estado){
			Controles.controladoComo("llama3", $scope.centre, registro, estado).then( function(data){
				//console.info("controller getAlertasControles",data);
				$scope.init();
				//$scope.carta(registro,estado);
				//$location("#!/controles/listado");
			});
		} else {
			$scope.recall.llamada3 = true;
		}
	}
	$scope.citado = function(registro,estado){
		//console.info("citado", registro);
		//console.info("citado", estado);
		Controles.controladoComo("citado", $scope.centre, registro, estado).then( function(data){
			//console.info("controller getAlertasControles",data);
			$scope.init();
		});
	}
	$scope.carta = function(registro,estado){
		//console.info("citado", registro);
		//console.info("citado", estado);
		Controles.controladoComo("carta", $scope.centre, registro, estado).then( function(data){
			//console.info("controller getAlertasControles",data);
			//$scope.init();
		});
	}

	$scope.sendSMS = function(registro,estado){

		// aqui viene el registro del recall entero...
		console.info("citado", registro);
		//console.info("citado", estado);

		// configura el objeto del envio
		var obj = {
			from: 'Eneresi',
			to: "34601007366",
			message: registro.Nombre + ", recuerda llamar a Eneresi al "+$rootScope.user.telefono+" para reservar tu cita de Control Dental y seguir cuidando tu salud bucal. Gracias."
		}

		// envia el sms
		if (estado) {
			Sms.smsTM(obj).then( function(data){
				console.log("de enviar sms",data);
				if ( !data.error ){
					// para registro del sms en la bbdd y poder controlar los envios
					obj.motivo = 'recall';
					Sms.putSMS(obj).then( function(res){
						// init();
						Controles.controladoComo("sms", $rootScope.user.centre, registro, estado);
						postman.success('BIEENNN!', 'SMS enviado a su destinatario. Eres un fenómeno.');
					});
				} else {
					postman.error('OHHHH!', 'Algo ha ido mal con el mensaje. Deberias intentar de nuevo.');
				}
			});
		} else {
			$scope.recall.SMS = true;
		}

	};

	$scope.sms = function(registro,estado){
		// aqui viene el registro del recall entero...
		 console.info("citado", registro);
		//console.info("citado", estado);

		// envia el sms

		var obj = {
			from: 'Eneresi',
			to: "34601007366",
			message: "Recuerda "+registro.Nombre+", llama a Eneresi al "+$rootScope.user.telefono+" y reserva tu cita de Control Dental Semestral para seguir cuidando tu salud y tu sonrisa"
		}

		if ( estado ) {
			Sms.smsCT(obj).then( function(res){
				// comprueba que se ha enviado
				//console.log('ressss sms', res);
				if ( !res.error ){
					// ponemos el gesdent la marca de sms

					//Controles.controladoComo("sms", $scope.centre, registro.NumRec, estado).then( function(data){
					//	//console.info("controller getAlertasControles",data);
					//	//$scope.init();
					//});

					// para registro del sms en la bbdd y poder controlar los envios
					Sms.putSMS(obj).then( function(res){
						logger.log("Superior!!! SMS enviado a su destinatario.");
					});

				} else {
					// ha habido un error
					logger.log("Vaya,vaya. No he podido enviar el SMS. ¿Lo vuelves a intentar?. Gracias");
				}
			});
		}

	}

}])

.controller('ColectivosCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Colectivos', '$filter', 'postman', '$modal', '$log', 'Books',
					function($rootScope, $scope, $location, Users, AuthService, Colectivos, $filter, postman, $modal, $log, Books) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;

	$scope.init = function(){

		Colectivos.getColectivos($scope.centre).then( function(data){
			$scope.colectivos = data;
		});

		Books.colectivos($scope.centre).then( function(data) {
			$scope.tipos = data;
		});

	}

	$scope.init();

	$scope.addColectivo = function(obj){
		var envia = {
			"clinica_id" : $scope.centre,
			"nom" : obj.nom,
			"colectivo_id" : obj.tipo.id
		};
		Colectivos.addColectivo(envia).then( function(data){
			if (data.error == 0){
				$scope.colectivo.nom = "";
				$scope.colectivo.tipo = "";
				Colectivos.getColectivos($scope.centre).then( function(data){
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.deleteColectivo = function(id){
		//console.info("borra " , id);
		Colectivos.deleteColectivo(id).then( function(data){
			//console.log(data);
			if (data.error == 0){
				$scope.colectivo.nom = "";
				$scope.colectivo.tipo = "";
				Colectivos.getColectivos($scope.centre).then( function(data){
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.fitrotipo = function(){
		console.log("reset filtros");
		$scope.filtratipo={};
	}
	$scope.fitronom = function(){
		console.log("reset filtros");
		$scope.filtranom="";
	}


}])

.controller('IncluyesCtrl', ['$rootScope','$scope', '$location', 'Users', 'AuthService', 'Incluyes', '$filter', 'postman', '$modal', '$log',
					function($rootScope, $scope, $location, Users, AuthService, Incluyes, $filter, postman, $modal, $log) {

	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.centre = $rootScope.user.centre;

	$scope.init = function(){

		Incluyes.getIncluyes().then( function(data){
			$scope.colectivos = data;
		});

		$scope.tipos = Incluyes.getSiNo;

	}

	$scope.init();

	$scope.addIncluye = function(obj){
		var envia = {
			"nom" : obj.nom,
			"sino" : obj.tipo.id
		};
		Incluyes.addIncluye(envia).then( function(data){
			if (data.error == 0){
				$scope.colectivo.nom = "";
				$scope.colectivo.tipo = "";
				Incluyes.getIncluyes().then( function(data){
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.deleteIncluye = function(id){
		//console.info("borra " , id);
		Incluyes.deleteIncluye(id).then( function(data){
			//console.log(data);
			if (data.error == 0){
				Incluyes.getIncluyes().then( function(data){
					$scope.colectivos = data;
				});
			}
		});
	}

	$scope.fitrotipo = function(){
		console.log("reset filtros");
		$scope.filtratipo={};
	}
	$scope.fitronom = function(){
		console.log("reset filtros");
		$scope.filtranom="";
	}


}])

.controller('LoginCtrl', ['$rootScope','$scope', '$location', 'AuthService', 'AUTH_EVENTS', 'logger', 'Presus',
					function($rootScope, $scope, $location, AuthService, AUTH_EVENTS, logger, Presus ) {
	//===============================================


	$scope.login = function(user){

		//$scope.user.email = "ebadia@eneresi.com";
		//$scope.user.password = "eneresi";

		if ( user.email.indexOf('@') < 0 )
			user.email += '@eneresi.com';

		AuthService.login(user).then( function(data) {
			console.log("vamos padentrooooo.....",data);
			if ( data.data.error === 0 ){
				console.log("login",data.data.data);
				$rootScope.logged = true;
				$rootScope.user.id = data.data.data[0].id;
				$rootScope.user.centre = data.data.data[0].centre_id;
				$rootScope.user.marca = data.data.data[0].marca;
				$rootScope.user.nom = data.data.data[0].nom;
				$rootScope.user.email = data.data.data[0].email;
				$rootScope.user.telefono = data.data.data[0].telefono;
				$rootScope.user.privilegis_id = data.data.data[0].privilegis_id;
				$rootScope.user.super = data.data.data[0].super;
				//console.log("logeado con centro " + $rootScope.centre);
				$rootScope.user.envio = {};
				$rootScope.user.envio.adressa = data.data.data[0].adressa;
				$rootScope.user.envio.cp = data.data.data[0].cp;
				$rootScope.user.envio.localitat = data.data.data[0].localitat;
				$rootScope.user.envio.provincia = data.data.data[0].provincia;


				Presus.countRecallsActiusGD($rootScope.user.centre).then( function(res){
					console.log("detallessssss",res.data.data.data[0]);
					$scope.recalls = res.data.data.data[0].recalls;
				});

				$scope.$on('recallsChangeHandle', function(e,v){
					console.log("vvvvvvvvvvvv",v);
					$scope.recalls = v.recalls;
				})

				$location.path('/recallsdehoy');

			} else {
				//$scope.user = {};
				logger.log("Vaya,vaya. logProviderarece que no has puesto bien tus datos de acceso. ¿Lo vuelves a intentar?. Gracias");
				//console.info("mal", data);
				// $scope.error = data.data.data.text;
				$location.path('/login');
			}

		});
	};

}])

.controller('LogoutCtrl', ['$rootScope','$scope', '$location', 'AuthService', 'AUTH_EVENTS',
					function($rootScope, $scope, $location, AuthService, AUTH_EVENTS) {
	//===============================================
	console.log("logout");
	$rootScope.logged = false;
	$rootScope.user = {
         "id":          "",
         "centre":      "",
         "nom":         "",
         "email":       "",
         "privilegis":  ""
      };
	$location.path('/login');


}])

.controller('ModalDemoCtrl', [ '$scope', '$modal', '$log',
					function($scope, $modal, $log) {
	//===============================================
 	$scope.open = function(ppto) {
 	 	var modalInstance;
 	 	$scope.bppto = ppto;
 	 	modalInstance = $modal.open(
 	 	{
 	 	 	templateUrl: "partials/modals/borrar.html",
 	 	 	controller: 'ModalInstanceCtrl',
 	 	 	resolve: {
 	 	 	 	bppto: function() {
 	 	 	 		return $scope.bppto;
 	 	 	 	}
 	 		}
 		});

 		modalInstance.result.then(
			function(bppto) {
				$log.info(bppto);
			},

			function() {
			 	$log.info("Modal dismissed at: " + new Date());
			}
		);
 	};

}])

.controller('ModalInstanceCtrl', [ '$scope', '$modalInstance', 'bppto', 'Presus', '$location',
					function($scope, $modalInstance, bppto, Presus, $location) {

	$scope.ok = function() {
		console.log(bppto);
		Presus.deletePpto(bppto.id).then( function(data){
			// borra tambien los recalls de este ppto borraTodosRecalls
			Presus.borraTodosRecalls(bppto.id).then( function(data){
	        		$modalInstance.close();
				$location.path("/presupuestos");
			});
		});
 	};
 	$scope.cancel = function() {
		//console.log(bppto);
        	$modalInstance.dismiss("cancel");
	};

}])

.controller('YesNoController', [ '$scope', '$modalInstance', '$log', 'title', 'Presus', '$location',
					function($scope, $modalInstance, $log, title, Presus, $location) {
	//===============================================

	$scope.title = title;

	$scope.close = function(result) {
		if (result){
			// do the right thing
			//console.log(moment().subtract('days', 60).format('YYYY-MM-DD'));
			//var desde = moment().subtract('days', 60).format('YYYY-MM-DD');
			//Presus.purgaPpto(desde).then( function(data){
			 	$modalInstance.close();
			//	$location.path("/presupuestos");
		} else {
			$modalInstance.dismiss("cancel");
		}
		//close(result, 500); // close, but give 500ms for bootstrap to animate
	};
}])

.controller('BooksMainCtrl', ['$rootScope','$scope', '$location', 'Users', '$routeParams', 'Books', '$timeout', 'Paciente', 'logger',
					function($rootScope, $scope, $location, Users, $routeParams, Books, $timeout, Paciente, logger) {
	//===============================================
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	// para buscar el indice dentro del array de colectivos si hay por defecto
	function findIndexByKeyValue(arraytosearch, key, valuetosearch) {
		for (var i = 0; i < arraytosearch.length; i++) {
			if (arraytosearch[i][key] == valuetosearch) {
				return i;
			}
		}
		return null;
	}

	var init = function(){
		$scope.cargado = true;
		$scope.ver = false;

		Books.colectivos($rootScope.user.centre).then( function(data) {
			console.log("colectivoooooo", data);
			$scope.colectivos = data;
			//
			console.log("paccccccc222", Paciente.ppto);
			$scope.ppto = Paciente.ppto;
			// carga los valores de un presupuesto anterior si ha sido ya "impreso" previamente
			if ( Paciente.ppto.idioma === null || Paciente.ppto.origen === 'gesden'){
				$scope.ppto.colectivo = data[findIndexByKeyValue(data,"nom","Ninguno")] //data[0];
				$scope.ppto.quecolectivo = {"nom": ""};
				$scope.ppto.idioma = "cas";
			} else {
				$scope.ppto.colectivo = data[findIndexByKeyValue(data,"nom",Paciente.ppto.colectivo)] //data[0];
				// carga los valores del colectivo concreto si lo tiene guardado
				Books.quecolectivos( $scope.ppto.colectivo.id, $rootScope.user.centre ).then( function(qdata) {
					$scope.quecolectivos = qdata;
					$scope.ppto.quecolectivo = qdata[findIndexByKeyValue(qdata,"nom",Paciente.ppto.quecolectivo)];
				});
				$scope.ppto.idioma = Paciente.ppto.idioma;
			}
			$scope.colectivo($scope.ppto.colectivo, $scope.ppto.import);
		});

		Downloadify.create('downloadify',{
			width: 100,
			height: 30,
			transparent: true,
			append: false
		});

	}

	// toggle selection de incluyes
	$scope.toggleIncluye = function toggleIncluye(obj) {
		var idx = $scope.ppto.incluye.map(function(e) { return e.id; }).indexOf(obj.id);
	  // is currently selected
	  if (idx > -1) {
	    $scope.ppto.incluye.splice(idx, 1);
	  }
	  // is newly selected
	  else {
	    $scope.ppto.incluye.push(obj);
	  }
	};

	// toggle selection de NO incluyes
	$scope.toggleNoIncluye = function toggleNoIncluye(obj) {
	  //var idx = $scope.ppto.incluye.indexOf(id);
		var idx = $scope.ppto.noincluye.map(function(e) { return e.id; }).indexOf(obj.id);
	  // is currently selected
	  if (idx > -1) {
	    $scope.ppto.noincluye.splice(idx, 1);
	  }
	  // is newly selected
	  else {
	    $scope.ppto.noincluye.push(obj);
	  }
	};


	$scope.colectivo = function(colectiu,cost){

		console.log(colectiu);

		$scope.ver = false;

		if (colectiu !== undefined ){
			if ( colectiu.nom === "Ninguno"){
				$scope.ppto.dto1 = 0;
				if ( cost > 1000 && cost <= 3000 ) 	$scope.ppto.dto1 = colectiu.d;
				if ( cost > 3000 && cost <= 6000 ) 	$scope.ppto.dto1 = colectiu.c;
				if ( cost > 6000 ) 					$scope.ppto.dto1 = colectiu.b;
				$scope.ppto.dto2 = 0;
				$scope.ppto.dto3 = 0;
				// de moment no es anar, es per cas sense entrada -> $scope.ppto.dto4 = colectiu.d;
			} else {
				$scope.ppto.dto1 = colectiu.a;
				$scope.ppto.dto2 = colectiu.b;
				$scope.ppto.dto3 = colectiu.c;
				// de moment no es anar, es per cas sense entrada -> $scope.ppto.dto4 = colectiu.d;
			}
		}
		//
		$scope.ppto.c1 = Math.round( (100 - $scope.ppto.dto1)/100 * cost );
		$scope.ppto.c2 = Math.round( (100 - $scope.ppto.dto2)/100 * cost );
		$scope.ppto.c3 = Math.round( (100 - $scope.ppto.dto3)/100 * cost );
		// de moment no es anar, es per cas sense entrada -> $scope.ppto.c4 = Math.round( (100 - $scope.ppto.dto4)/100 * cost );
		//
		if ( cost <= 3000 ) 				$scope.ppto.meses = 12;
		if ( cost > 3000 && cost <= 6000 ) 	$scope.ppto.meses = 18;
		if ( cost > 6000 ) 					$scope.ppto.meses = 24;
		//
		$scope.ppto.entrada = Math.round(0.3 * $scope.ppto.c3 * 100) / 100;
		$scope.ppto.cuota = Math.round(0.7 * $scope.ppto.c3 * 100  / $scope.ppto.meses) / 100;
		// de moment no es anar, es per cas sense entrada -> $scope.ppto.cuotasin = Math.round($scope.ppto.c4 * 100  / $scope.ppto.meses) / 100;

		console.info("pressupost -> ", $scope.ppto);
		console.log($scope.ppto.quecolectivo);

		//if ( $scope.ppto.quecolectivo.nom === "" ){
			Books.quecolectivos( colectiu.id, $rootScope.user.centre ).then( function(data) {
				$scope.quecolectivos = data;
			});
		//}
	}

	$scope.quecolectivo = function(colectiu){

		Books.quecolectivo( colectiu.id ).then( function(data) {
			$scope.quecolectivo = data[0];
		});
	}

	var guardaValoresPpto = function(ppto){

		// primero hemos de guardar los valores del formulario
		if (ppto.quecolectivo===null || ppto.quecolectivo === undefined){
			ppto.quecolectivo = {};
			ppto.quecolectivo.nom = "";
		}
		var aguardar = {
			"id": 				ppto.id,
			"import": 			ppto.import,
			"colectivo": 		ppto.colectivo.nom,
			"quecolectivo": 	ppto.quecolectivo.nom,
			"idioma":  			ppto.idioma
		}
		console.info("tienes que actualizar estooooo >", aguardar);
		// solo guarda si tenemos ppto.id (si es de un ppto concreto, si es global no guarda)
		if (ppto.id != null || ppto.id != undefined){
			Books.actualizappto(aguardar).then( function(data){
				console.log("actualizado ppto", data);
			});
		}
	}

	$scope.descarga = function(ppto){

		console.info("$scope.descarga >", ppto);

		// primero hemos de guardar los valores del formulario
		if (Paciente.ppto.origen != 'gesden')
			guardaValoresPpto(ppto);

		// y porfin, decargamos el presupuesto...
		if ( ppto.idioma === "cat" )
			descargaCatala(ppto);
		else
			descargaCas(ppto);

	}

	$scope.infoorto = function(ppto){

		console.info("$scope.descarga >", ppto);

		if ( ppto.idioma === "cat" )
			infoortoCatala(ppto);
		else
			infoortoCas(ppto);
	}


	// funciones privadas

	var descargaCas = function(ppto){

		console.info("$scope.descarga >", ppto);

		var docx = "docs/eneresi-presupuestos_4.docx";
		if ($rootScope.user.centre==1) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==2) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==3) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==4) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==5) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==6) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==7) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==8) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ( ppto.import <= 1000 ){
			if ( 	($rootScope.user.centre==1)
					|| ($rootScope.user.centre==2)
					|| ($rootScope.user.centre==3)
					|| ($rootScope.user.centre==5)
					|| ($rootScope.user.centre==7)
					|| ($rootScope.user.centre==8)
				){
				docx = "docs/eneresi-presupuestos-1000_3.docx";
			}
		}
		if ( ppto.motiu_id.nom === "Ortodoncia" || ppto.motiu_id.nom === "Invisalign"){
			docx = "docs/eneresi-presupuestos_orto.docx";
		}
		//console.log(docx);
		// docxtemplater
		new DocxGen().loadFromFile(docx,{async:true}).success(function(doc){
			//console.log(ppto);

			var lastags = {
				"nom": ppto.pacient,
				"clinica": ppto.centre,
				"doctor": ppto.doctor,
				"tto": (ppto.motiu_id.nom!==""?ppto.motiu_id.nom:""),
				"detalle": ppto.detalle,
				"colectivo": (ppto.colectivo.nom!==""?ppto.colectivo.nom:""),
				"quecolectivo": (ppto.quecolectivo.nom!==""?ppto.quecolectivo.nom.nom:""),
				"coste": "El coste total del tratamiento propuesto es de "+ppto.import+" euros.",
				"entrada": ppto.entrada + " euros",
				"meses": ppto.meses,
				"cuota": ppto.cuota,
				"mesessin": ppto.meses,
				"cuotasin": ppto.cuotasin,
				"frontdesk": (ppto.frontdesk!==""?ppto.frontdesk:""),
				"frontdesktel": (ppto.frontdesktel!==""?ppto.frontdesktel:""),
				"frontdeskmail": (ppto.frontdeskmail!==""?ppto.frontdeskmail:"")
			};

			var incluye = [];
			angular.forEach(ppto.incluye, function(value,key){
				incluye.push({"incluido": value.nom});
			});
			lastags.incluye = incluye;

			var noincluye = [];
			angular.forEach(ppto.noincluye, function(value,key){
				noincluye.push({"noincluido": value.nom});
			});
			lastags.noincluye = noincluye;

			if (ppto.dto1==0) {lastags.textodto1	= 	""} else {lastags.textodto1	= 		"Sobre este coste total se aplicará un "+ppto.dto1+"% de descuento, "}
			if (ppto.dto1==0) {lastags.costefinal1=  ""} else {lastags.costefinal1	= 	"siendo el coste final de "+ppto.c1+" euros."}

			if (ppto.dto2==0) {lastags.textodto2	= 	""} else {lastags.textodto2	= 		"Sobre este coste total se aplicará un "+ppto.dto2+"% de descuento, "}
			if (ppto.dto2==0) {lastags.costefinal2=	""} else {lastags.costefinal2	= 	"siendo el coste final de "+ppto.c2+" euros."}

			if (ppto.dto3==0) {lastags.textodto3	= 	""} else {lastags.textodto3	= 		"Sobre este coste total se aplicará un "+ppto.dto3+"% de descuento, "}
			if (ppto.dto3==0) {lastags.costefinal3=	""} else {lastags.costefinal3	= 	"siendo el coste final de "+ppto.c3+" euros."}

			if (ppto.dto4==0) {lastags.textodto4	=	""} else {lastags.textodto4	=		"Sobre este coste total se aplicará un "+ppto.dto4+"% de descuento, "}
			if (ppto.dto4==0) {lastags.costefinal4=	""} else {lastags.costefinal4	= 	"siendo el coste final de "+ppto.c4+" euros."}

			if (ppto.colectivo.nom != "Ninguno"){
				lastags.textocolectivo = "Hemos tenido en cuenta que forma parte del Colectivo "+ppto.colectivo.nom+ " ("+ppto.quecolectivo.nom+") y hemos aplicado al tratamiento las ventajas y descuentos correspondientes a dicho Colectivo."
			} else {
				lastags.textocolectivo = "";
			}

			doc.setTags(lastags); //set the templateVariables
			//console.log(doc.getTags());
			//console.log(lastags);
			doc.applyTags(); //apply them (replace all occurences of {first_name} by Hipp, ...)
			//doc.output({"name" : ppto.pacient+".docx"}); //Output the document using Data-URI
			logger.log("Procesando el documento. Esperar a que salga el boton de impresión.");
			// console.log("teh doc....", doc.output());
			//doc.output();
			// $scope.contenido = doc.output();
			$scope.$apply();
			doc.download("lib/media/downloadify.swf","img/download.png",ppto.pacient+"-"+ppto.motiu_id.nom.replace(/\//g, "_")+".docx");
		});

	}
	$scope.ocultarlo = function(){
		$scope.ver = false;
	}
	$scope.verlo = function(ppto){

		// primero hemos de guardar los valores del formulario
		guardaValoresPpto(ppto);

		$scope.ver = true;
		var lastags = {
			"nom": ppto.pacient,
			"clinica": ppto.centre,
			"doctor": ppto.doctor,
			"tto": (ppto.motiu_id.nom!==""?ppto.motiu_id.nom:""),
			"detalle": ppto.detalle,
			"colectivo": (ppto.colectivo.nom!==""?ppto.colectivo.nom:""),
			"coste": "El coste total del tratamiento propuesto es de "+ppto.import+" euros.",
			"entrada": ppto.entrada + " euros",
			"meses": ppto.meses,
			"cuota": ppto.cuota,
			"mesessin": ppto.meses,
			"cuotasin": ppto.cuotasin,
			"frontdesk": (ppto.frontdesk!==""?ppto.frontdesk:""),
			"frontdesktel": (ppto.frontdesktel!==""?ppto.frontdesktel:""),
			"frontdeskmail": (ppto.frontdeskmail!==""?ppto.frontdeskmail:"")
		};

		var incluye = [];
		angular.forEach(ppto.incluye, function(value,key){
			incluye.push({"incluido": value.nom});
		});
		lastags.incluye = incluye;

		var noincluye = [];
		angular.forEach(ppto.noincluye, function(value,key){
			noincluye.push({"noincluido": value.nom});
		});
		lastags.noincluye = noincluye;

		if (ppto.dto1==0) {lastags.textodto1	= 	""} else {lastags.textodto1	= 		"Sobre este coste total se aplicará un "+ppto.dto1+"% de descuento, "}
		if (ppto.dto1==0) {lastags.costefinal1=  ""} else {lastags.costefinal1	= 	"siendo el coste final de "+ppto.c1+" euros."}

		if (ppto.dto2==0) {lastags.textodto2	= 	""} else {lastags.textodto2	= 		"Sobre este coste total se aplicará un "+ppto.dto2+"% de descuento, "}
		if (ppto.dto2==0) {lastags.costefinal2=	""} else {lastags.costefinal2	= 	"siendo el coste final de "+ppto.c2+" euros."}

		if (ppto.dto3==0) {lastags.textodto3	= 	""} else {lastags.textodto3	= 		"Sobre este coste total se aplicará un "+ppto.dto3+"% de descuento, "}
		if (ppto.dto3==0) {lastags.costefinal3=	""} else {lastags.costefinal3	= 	"siendo el coste final de "+ppto.c3+" euros."}

		if (ppto.dto4==0) {lastags.textodto4	=	""} else {lastags.textodto4	=		"Sobre este coste total se aplicará un "+ppto.dto4+"% de descuento, "}
		if (ppto.dto4==0) {lastags.costefinal4=	""} else {lastags.costefinal4	= 	"siendo el coste final de "+ppto.c4+" euros."}

		if (ppto.colectivo.nom != "Ninguno"){
			lastags.textocolectivo = "Hemos tenido en cuenta que forma parte del Colectivo "+ppto.colectivo.nom+ " ("+ppto.quecolectivo.nom+") y hemos aplicado al tratamiento las ventajas y descuentos correspondientes a dicho Colectivo."
		} else {
			lastags.textocolectivo = "";
		}
		// $scope.contenido = doc.output();
		$scope.lastags = lastags;
		// doc.download("lib/media/downloadify.swf","img/download.png",ppto.pacient+"-"+ppto.motiu_id.nom+".docx");
		console.log("$scope.ver >", $scope.lastags);

	}

	var descargaCatala = function(ppto){

		console.info("$scope.descargaCatala >", ppto);

		var docx = "docs/eneresi-presupuestos_4_cat.docx";
		if ($rootScope.user.centre==1) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cat.docx";
		if ($rootScope.user.centre==2) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cat.docx";
		if ($rootScope.user.centre==6) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cat.docx";
		if ($rootScope.user.centre==7) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cas.docx";
		if ($rootScope.user.centre==8) docx = "docs/eneresi-presupuestos-"+$rootScope.user.centre+"_5_cat.docx";
		if ( ppto.import <= 1000 ){
			//docx = "docs/eneresi-presupuestos-1000-"+$rootScope.user.centre+"_3_cat.docx";
			if ( ($rootScope.user.centre==1)
				|| ($rootScope.user.centre==2)
				|| ($rootScope.user.centre==6)
				|| ($rootScope.user.centre==8)
			)
				docx = "docs/eneresi-presupuestos-1000_3_cat.docx";
		}
		if ( ppto.motiu_id.nom === "Ortodoncia" || ppto.motiu_id.nom === "Invisalign"){
			docx = "docs/eneresi-presupuestos_orto_cat.docx";
		}
		//console.log(docx);
		// docxtemplater
		new DocxGen().loadFromFile(docx,{async:true}).success(function(doc){
			//console.log(ppto);

			var lastags = {
				"nom": ppto.pacient,
				"clinica": ppto.centre,
				"doctor": ppto.doctor,
				"tto": (ppto.motiu_id.nom!==""?ppto.motiu_id.nom:""),
				"detalle": ppto.detalle,
				"colectivo": (ppto.colectivo.nom!==""?ppto.colectivo.nom:""),
				"quecolectivo": (ppto.quecolectivo.nom!==""?ppto.quecolectivo.nom.nom:""),
				"coste": "El cost total del tractament proposat és de "+ppto.import+" euros.",
				"entrada": ppto.entrada + " euros",
				"meses": ppto.meses,
				"cuota": ppto.cuota,
				"mesessin": ppto.meses,
				"cuotasin": ppto.cuotasin,
				"frontdesk": (ppto.frontdesk!==""?ppto.frontdesk:""),
				"frontdesktel": (ppto.frontdesktel!==""?ppto.frontdesktel:""),
				"frontdeskmail": (ppto.frontdeskmail!==""?ppto.frontdeskmail:"")
			};

			var incluye = [];
			angular.forEach(ppto.incluye, function(value,key){
				incluye.push({"incluido": value.nom});
			});
			lastags.incluye = incluye;

			var noincluye = [];
			angular.forEach(ppto.noincluye, function(value,key){
				noincluye.push({"noincluido": value.nom});
			});
			lastags.noincluye = noincluye;

			if (ppto.dto1==0) {lastags.textodto1	= 	""} else {lastags.textodto1	= 		"Sobre aquest cost total s’aplicarà un "+ppto.dto1+"% de descompte, "}
			if (ppto.dto1==0) {lastags.costefinal1=  ""} else {lastags.costefinal1	= 	"i el cost final serà de "+ppto.c1+" euros."}

			if (ppto.dto2==0) {lastags.textodto2	= 	""} else {lastags.textodto2	= 		"Sobre aquest cost total s’aplicarà un "+ppto.dto2+"% de descompte, "}
			if (ppto.dto2==0) {lastags.costefinal2=	""} else {lastags.costefinal2	= 	"i el cost final serà de "+ppto.c2+" euros."}

			if (ppto.dto3==0) {lastags.textodto3	= 	""} else {lastags.textodto3	= 		"Sobre aquest cost total s’aplicarà un "+ppto.dto3+"% de descompte, "}
			if (ppto.dto3==0) {lastags.costefinal3=	""} else {lastags.costefinal3	= 	"i el cost final serà de "+ppto.c3+" euros."}

			if (ppto.dto4==0) {lastags.textodto4	=	""} else {lastags.textodto4	=		"Sobre aquest cost total s’aplicarà un "+ppto.dto4+"% de descompte, "}
			if (ppto.dto4==0) {lastags.costefinal4=	""} else {lastags.costefinal4	= 	"i el cost final serà de "+ppto.c4+" euros."}

			if (ppto.colectivo.id > 1){
				lastags.textocolectivo = "Hem tingut en compte que forma part del Col·lectiu "+ppto.colectivo.nom+ " ("+ppto.quecolectivo.nom+") i hem aplicat al tractament els avantatges i els descomptes corresponents a aquest Col·lectiu."
			} else {
				lastags.textocolectivo = "";
			}

			doc.setTags(lastags); //set the templateVariables
			//console.log(doc.getTags());
			//console.log(lastags);
			doc.applyTags(); //apply them (replace all occurences of {first_name} by Hipp, ...)
			//doc.output({"name" : ppto.pacient+".docx"}); //Output the document using Data-URI
			logger.log("Procesando el documento. Esperar a que salga el boton de impresión.");
			$scope.$apply();
			doc.download("lib/media/downloadify.swf","img/download.png",ppto.pacient+"-"+ppto.motiu_id.nom.replace(/\//g, "_")+".docx");
		});

	}

	var infoortoCatala = function(ppto){

		console.info("$scope.infoortoCatala >", ppto);

		var docx = "docs/eneresi-info-ortodoncia-cat.docx";

		//console.log(docx);
		// docxtemplater
		new DocxGen().loadFromFile(docx,{async:true}).success(function(doc){
			//console.log(ppto);

			var lastags = {
				"nom": ppto.pacient,
			};

			doc.setTags(lastags); //set the templateVariables
			//console.log(doc.getTags());
			//console.log(lastags);
			doc.applyTags(); //apply them (replace all occurences of {first_name} by Hipp, ...)
			//doc.output({"name" : ppto.pacient+".docx"}); //Output the document using Data-URI
			logger.log("Procesando el documento. Esperar a que salga el boton de impresión.");
			$scope.$apply();
			doc.download("lib/media/downloadify.swf","img/download.png","infoorto-"+ppto.pacient+".docx");
		});

	}

	init();

}])

.controller('TableauCentroCtl', ['$rootScope','$scope', 'localize', '$location', 'Control', '$q',
				function( $rootScope, $scope, localize, $location, Control, $q ) {
	//===============================================

	$scope.variables = [
		{ id :"TB_Promedio" },
		{ id :"TB_ImplantesColocados" },
		{ id :"TB_ProtesisSobreImplantes" },
		{ id :"TB_ProtesisHibridas" },
		{ id :"TB_ProtesisFija" },
		{ id :"TB_ProtesisRemovible" },
		{ id :"TB_OrtodonciaFija" },
		{ id :"TB_Invisalign" },
		{ id :"TB_OrtodonciaInterceptiva" },
		{ id :"TB_OrtodonciaFI" },
		{ id :"TB_OrtodonciaTotal" },
		{ id :"TB_Carillas" },
		{ id :"TB_CarillaCeramica" },
		{ id :"TB_CarillaComposite" },
		{ id :"TB_Blanqueamiento" },
		{ id :"TB_EsteticaFacial" },
		{ id :"TB_DPH" },
		{ id :"TB_DPHColectivos" },
		{ id :"TB_RevisionesConservadora" },
		{ id :"TB_RevisionesOdontopediatria" },
		{ id :"TB_MantenimientosPeridontales" },
		{ id :"TB_RevisionesHibrida" }
	];

	Control.centros().then( function(res){
		console.log("centrossss", res);
		$scope.centros = res.data;
	});

	$scope.todos = function(centro,ano) {
		$scope.recalls = [];
        Control.todos(centro,ano).then( function(res){
        	console.log("todosss", res);
        	$scope.recalls = res.data;
        })
    };

	$scope.ratiosCentros = function(variable,ano) {

		$scope.recalls = [];

		var promises = [];

		if ( ano !== undefined ){

			angular.forEach($scope.centros, function(v){
				// para cada centro buscamos el valor de sus variables
				promises.push(Control.centro(variable.id,ano,v.id, v.nom));
			});

			$q.all(promises).then( function(res) {
				var resultados = [];
				angular.forEach(res, function(v){
					//ponemos el nombre de la ciudad en su sitio...
					v.data[0].ciudad = v.nom;
					resultados.push(v.data[0]);
				});
				$scope.recalls = resultados;
				$scope.res = "";
			});

		}

    };

	$scope.setCentro = function(id,nom) {
		$scope.centro = id;
		$scope.centronom = nom;
    };
	$scope.setAno = function(ano) {
		$scope.ano = ano;
    };

    //$scope.todos(2014);


}])

.controller('EmailObjetivosCtrl', ['$routeParams','$rootScope','$scope', '$location', 'Users', 'Presus', 'Paciente', '$q',
					function($routeParams, $rootScope, $scope, $location, Users, Presus, Paciente, $q) {

	var promises = [];
	var htmlstring = "";

	promises.push(
		Presus.feina($rootScope.user.centre).then( function(res){
			console.log("feinaaaa", res);
			$scope.feina = res[res.length - 1];
		})
	);
	promises.push(
		Presus.oportunitat($rootScope.user.centre).then( function(res){
			console.log("oportunidad", res);
			$scope.oportunidad = res[res.length - 1];
		})
	);
	promises.push(
		Presus.exito($rootScope.user.centre).then( function(res){
			console.log("exito", res);
			$scope.exito = res[res.length - 1];

			Presus.objetivo($rootScope.user.centre,$scope.mes,$scope.any-1).then( function(res){
				console.log("objetivo", res[res.length - 1]);
				$scope.objetivo = res[res.length - 1].fact;
				$scope.easypiechart.ratioexito = Math.floor( $scope.exito.daprobado / $scope.objetivo * 100 );
			});
		})
	);

	htmlstring = " <div class='page page-dashboard'>		    <a href='#!/presupuestos' type='button' class='btn btn-warning btn-sm'>		        <span class='glyphicon glyphicon-arrow-left'></span>		    </a>			<!-- stats -->			<div class='panel panel-default'>				<div class='panel-heading'>					<strong><span class='glyphicon glyphicon-th'></span><span>Resumen del mes {{mes}}/{{any}}</span></strong>										</div>				<div class='panel-body'>					<!-- //////////////// -->					<!-- FILA DE OBJETIVO -->					<!-- //////////////// -->					<div class='row'>						<div class='panel panel-profile'>				            <div class='panel-heading text-center bg-info'>				                <h3 class='ng-binding'>Objetivo</h3>				            </div>				            <div class='list-justified-container'>				                <ul class='list-justified text-center'>				                    <li>				                        <p class='size-h3'>{{objetivo}}</p>				                        <p class='text-muted'>Euros</p>				                        <p>				                        	<progressbar animate='true' value='easypiechart.ratioexito' type='success'><b>{{easypiechart.ratioexito}}%</b></progressbar>										</p>				                    </li>				                </ul>				            </div>				        </div>				    </div>					<!-- //////////////// -->					<!-- PROPUESTO / EXITO / OPORTUNIDADES -->					<!-- //////////////// -->					<div class='row'>						<!-- PROPUESTO -->						<div class='col-lg-4 col-xsm-4'>							<div class='panel panel-profile'>					            <div class='panel-heading text-center bg-info'>					                <h3 class='ng-binding'>Propuesto</h3>					            </div>					            <div class='list-justified-container'>					                <ul class='list-justified text-center'>					                    <li>					                        <p class='size-h3'>{{feina.dentregado}}</p>					                        <p class='text-muted'>Euros</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{feina.entregado}}</p>					                        <p class='text-muted'>Número</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{feina.TMA}}</p>					                        <p class='text-muted'>TMP</p>					                    </li>					                </ul>					            </div>					        </div>					    </div>						<!-- EXITO -->						<div class='col-lg-4 col-xsm-4'>							<div class='panel panel-profile'>					            <div class='panel-heading text-center bg-info'>					                <h3 class='ng-binding'>Éxito</h3>					            </div>					            <div class='list-justified-container'>					                <ul class='list-justified text-center'>					                    <li>					                        <p class='size-h3'>{{exito.daprobado}}</p>					                        <p class='text-muted'>Euros</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{exito.aprobado}}</p>					                        <p class='text-muted'>Número</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{exito.raprobado}}</p>					                        <p class='text-muted'>TMA</p>					                    </li>					                </ul>					            </div>					        </div>					    </div>						<!-- OPORTUNIDADES -->						<div class='col-lg-4 col-xsm-4'>							<div class='panel panel-profile'>					            <div class='panel-heading text-center bg-info'>					                <h3 class='ng-binding'>Oportunidad</h3>					            </div>					            <div class='list-justified-container'>					                <ul class='list-justified text-center'>					                    <li>					                        <p class='size-h3'>{{oportunidad.dseguimiento}}</p>					                        <p class='text-muted'>Euros</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{oportunidad.seguimiento}}</p>					                        <p class='text-muted'>Número</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{oportunidad.TMS}}</p>					                        <p class='text-muted'>TMS</p>					                    </li>					                </ul>					            </div>					            <div class='list-justified-container'>					                <ul class='list-justified text-center'>					                    <li>					                        <p class='size-h3'>{{oportunidad.A}}</p>					                        <p class='text-muted'>A</p>					                        <p class='text-muted'>{{oportunidad.dA}}</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{oportunidad.B}}</p>					                        <p class='text-muted'>B</p>					                        <p class='text-muted'>{{oportunidad.dB}}</p>					                    </li>					                    <li>					                        <p class='size-h3'>{{oportunidad.C}}</p>					                        <p class='text-muted'>C</p>					                        <p class='text-muted'>{{oportunidad.dC}}</p>					                    </li>					                </ul>					            </div>					        </div>					    </div>				    </div>				</div>			</div>		</div>	";

	$q.all(promises).then( function(){
		$compile(htmlstring)($scope);
		$scope.$apply();
		alert(htmlstring.html());
	})

}])

.controller('PresupuestosGesdentCtrl', ['$rootScope','$scope', '$routeParams','$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', '$q', '$compile', '$timeout', 'Paciente',
					function($rootScope, $scope, $routeParams, $location, Users, AuthService, Presus, $filter, postman, $q, $compile, $timeout, Paciente) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');
	$scope.numero = $routeParams.numpre;

	var desde = moment().subtract(6, 'months').format('YYYYMMDD');
	console.log("detallessssss",desde);

	// Presus.getPpto($routeParams.id).then( function(res){
	// 	console.log("detallessssss",res.data.data);
	// 	$scope.base = res.data.data[0];
	// });

	Presus.getPptosGesdent($rootScope.user.centre, $routeParams.numpac, $routeParams.numpre).then( function(res){
		console.log("feinaaaa inici", res);
		$scope.pptos = res;
		angular.forEach($scope.pptos, function(v){
			Presus.getPptosDetallesGesdent($rootScope.user.centre, $routeParams.numpac, v.NumPre).then( function(det){
				v.detalles = det;
				//console.log("detallessssss", det);
				v.importeAprobado = 0;
				v.importePresupuestado = 0;
				angular.forEach(det, function(vv){
					if (vv.FecAceptaBool == 1)
						v.importeAprobado += vv.ImporteFinal;
					if (vv.StaTto == 7)
						v.importePresupuestado += vv.ImporteFinal;
				});
			})
		console.log("feinaaaa final", $scope.pptos);
		});

		// si hay anotaciones del ttos las recogemos
		Presus.getPptosAnotacionesGesdent($rootScope.user.centre, $routeParams.numpac, $routeParams.numpre).then( function(det){
			// console.log('notasssss', det[0].notas);
			$scope.notas = det[0].notas;
		});

	});
	Presus.listaPresupuestosPaciente($rootScope.user.centre, $routeParams.numpac).then( function(res){
		$scope.lista = res;
	});

	// porta al sistema tradicional de pressupost amb word.
	$scope.book = function(){
		Paciente.ppto.pacient = $scope.pptos[0].Nombre + " " + $scope.pptos[0].Apellidos;
		Paciente.ppto.import = $scope.pptos[0].Importe;
		Paciente.ppto.centre_id = $rootScope.user.centre;
		Paciente.ppto.motiu_id = {};
		Paciente.ppto.motiu_id.nom = $scope.pptos[0].Titulo;
		Paciente.ppto.NumPac = $scope.pptos[0].NumPac;
		Paciente.ppto.NumPre = $scope.pptos[0].NumPre;
		Paciente.ppto.origen = 'gesden';
		console.log("booookkkkk", Paciente);
		$location.path("/books");
	}

	$scope.openPdf = function(){

		// console.log("vamos pdffff", $scope.pptos[0].detalles);

		// crear los array de la tabla
		// $scope.pptos[0].detalles
		var lineas = new Array();

		lineas.push(
		          [	{text: 'Descripción', style: 'header'},
		          	{text: 'Piezas', style: 'header'},
		          	{text: 'Unidades', style: 'header'},
		          	{text: 'Importe', style: 'header'},
		          	{text: 'Dto', style: 'header'},
		          	{text: 'Final', style: 'header'}
		          ]);

		angular.forEach($scope.pptos[0].detalles, function(v,k){
			//console.log("lineaaaaa", v);
			var columns = [];
			//console.log("columnaaaaaa anteesss", columns);
			columns.push( v.DescripPac.toString().substr(0) );
			columns.push( v.Piezas.toString().substr(0) );
			columns.push( v.Unidades.toString().substr(0) );
			if (v.ImportePre !== null)
				columns.push( v.ImportePre.toString().substr(0) );
			else
				columns.push( 0 );
			columns.push( v.Dto.toString().substr(0) );
			if (v.ImporteFinal !== null)
				columns.push( v.ImporteFinal.toString().substr(0) );
			else
				columns.push( 0 );
			console.log("columnaaaaaa", columns);
			lineas.push(columns);
		});

		console.log("totesss", lineas);

		function toTitleCase(string)
		{
		    // \u00C0-\u00ff for a happy Latin-1
		    return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
		        return initial.toUpperCase();
		    }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
		        return match.toLowerCase();
		    });
		}

		//console.log("tablaaaaaa", lineas);

		var docDefinition = {
			pageSize: 'A4',
			pageOrientation: 'portrait',

		    content: [
		    // pagina 1: portada
		    	{
		    		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAAlgAAAAEAAQCWAAAAAQAB/+E8Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL2pwZWc8L2RjOmZvcm1hdD4KICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5sb2dvX2VuZXJlc2k8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICA8L2RjOnRpdGxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBHSW1nPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvZy9pbWcvIj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNS0wNi0xMVQxMjowMzowMSswMjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTUtMDYtMTFUMTA6MDM6MDhaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMDYtMTFUMTI6MDM6MDErMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIENTNiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOlRodW1ibmFpbHM+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6d2lkdGg+MjU2PC94bXBHSW1nOndpZHRoPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpoZWlnaHQ+Njg8L3htcEdJbWc6aGVpZ2h0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpmb3JtYXQ+SlBFRzwveG1wR0ltZzpmb3JtYXQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmltYWdlPi85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83UUFzVUdodmRHOXphRzl3SURNdU1BQTRRa2xOQSswQUFBQUFBQkFBU0FBQUFBRUEmI3hBO0FRQklBQUFBQVFBQi8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFCZ1FFQkFVRUJnVUZCZ2tHQlFZSkN3Z0dCZ2dMREFvS0N3b0smI3hBO0RCQU1EQXdNREF3UURBNFBFQThPREJNVEZCUVRFeHdiR3hzY0h4OGZIeDhmSHg4Zkh3RUhCd2NOREEwWUVCQVlHaFVSRlJvZkh4OGYmI3hBO0h4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zi84QUFFUWdBUkFFQUF3RVImI3hBO0FBSVJBUU1SQWYvRUFhSUFBQUFIQVFFQkFRRUFBQUFBQUFBQUFBUUZBd0lHQVFBSENBa0tDd0VBQWdJREFRRUJBUUVBQUFBQUFBQUEmI3hBO0FRQUNBd1FGQmdjSUNRb0xFQUFDQVFNREFnUUNCZ2NEQkFJR0FuTUJBZ01SQkFBRklSSXhRVkVHRTJFaWNZRVVNcEdoQnhXeFFpUEImI3hBO1V0SGhNeFppOENSeWd2RWxRelJUa3FLeVkzUENOVVFuazZPek5oZFVaSFREMHVJSUpvTUpDaGdaaEpSRlJxUzBWdE5WS0JyeTQvUEUmI3hBOzFPVDBaWFdGbGFXMXhkWGw5V1oyaHBhbXRzYlc1dlkzUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8rQ2s1U1ZscGVZbVomI3hBO3FibkoyZW41S2pwS1dtcDZpcHFxdXNyYTZ2b1JBQUlDQVFJREJRVUVCUVlFQ0FNRGJRRUFBaEVEQkNFU01VRUZVUk5oSWdaeGdaRXkmI3hBO29iSHdGTUhSNFNOQ0ZWSmljdkV6SkRSRGdoYVNVeVdpWTdMQ0IzUFNOZUpFZ3hkVWt3Z0pDaGdaSmpaRkdpZGtkRlUzOHFPend5Z3AmI3hBOzArUHpoSlNrdE1UVTVQUmxkWVdWcGJYRjFlWDFSbFptZG9hV3ByYkcxdWIyUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8mI3hBOytEbEpXV2w1aVptcHVjblo2ZmtxT2twYWFucUttcXE2eXRycSt2L2FBQXdEQVFBQ0VRTVJBRDhBOVU0cTdGWFlxN0ZYWXE3RlhZcTcmI3hBO0ZYWXE3RlZrODhOdkM4OHppT0tNY25kdWdBd3hpU2FER2N4RVdkZ0dEYWw1MzFLK3VSYWFOR1l3NTRvOU9Vci9BQ0hSYzJ1UFJSaUwmI3hBO204L243VnlaSmNPSWZyY1BKZm1TK1gxTCs5QVp0K0VqdklSODZmRDl4eC9PWW8vU0Yva3pQazNuTDdiUzNVUEtHdTZhcG5RZXRHdTUmI3hBO2tnSjVBZTQyYjdzdXg2dkhQYmw3M0Z6ZG01c1c0M0hrbWZrelVmTWx4ZXJHWkhuc0UybmFiNGd1MndESGV2dGxHc3g0aEcrVW5MN00mI3hBO3paNVRxN2gxdG5lYXA2RjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFZSdkwyenNiV1M3dlo0N1cxaEhLYTQmI3hBO21kWTQwWHhaMklVRDU0cWtHbS9tWitYT3FhZ3VuYWQ1bzBxOHZuWUpGYlFYc0VqeU13cUJHRmM4ei9xMXhWa3VLdXhWMktzZXZ2ekUmI3hBOzhoV056RmEzZm1IVG9ycWFkYldLMyt0UkdVek8zQUp3REZxOHRqdHQzeFdrUnJublR5Zm9FaXhhNXJ1bjZWSzY4MGp2YnFHM2RsOFYmI3hBO1dSbEo2ZHNWUmVqYS9vV3QyaHZORjFHMTFPMERGRGNXYzBkeEh5SFZlY2JNdFJpcU94VjJLc0svTVhVSkZXMnNFTkVjR1dVZU5EUlImI3hBOyt2Tm4yZGpHOG5ROXRaaUJHQTY3cVA1YjI4TFhGN093QmxpV05ZejRCeTNML2lJeVhhTWpRRFgySkFHVWoxRmZwWjNtcWVpZGlyZ0EmI3hBO09ncFhjNHE3RlVoMXp6LzVIMEZaanJHdldGaTF2dE5GTmNSTElwTzRIcDh1WlBzQlhGVlhWL08za3pSVEFOWTE3VHROTnlnbHRoZVgmI3hBO2NFSHFSbm82ZW82OGw5eGlxY0k2U0lza2JCMGNCa2RUVUVIY0VFWXEzaXJzVlN6WFBOUGxuUUlrbDEzVnJQU281SyttMTdjUlc0YW4mI3hBO1hqNmpMeStqRlZQeS93Q2IvS25tT0pwZEExaXkxVlVDdEw5VG5qbUtjaFVlb3FNU2g5bXBpcWI0cTdGWFlxd1h6UitlUDVVK1Y5U2YmI3hBO1ROYTh3d1E2aEZVVFcwTWM5MDhaRzVXUVcwYzNBaW00YWh4Vk12SmY1b2VRdk8zcmp5eHJFT295V3loNTRRc2tVcXF4b0dNY3l4dlMmI3hBO3UxYVlxeWpGWFlxb1h0L1kyRnM5MWZYRVZyYkpUblBPNnhvdFRRVlppQU1WU3pTZk8zbERXZFVuMHJTTlpzOVIxQzJpRTl4YjJrNlQmI3hBO01rWmJoVnZUTEFmRjFIVWJlSXhWOGorY2Z6UDh1Zm1SK2NYMUx6bHJMYWIrV2VpelMvVjdWQk1WdXZRUEFNd2dWM0xUdnZ5b09NZXcmI3hBO28yNVVwOStjZm1EL0FKeGMxZnlCZFczbGxySzI4eFdhSzJqdnAxaFBiU3RJcEE0U1NlakdySXkxcjZqZTQrTEZYckgvQURpOTU0MXomI3hBO3pkK1ZzVnhyVXJYTjdwZDNKcHYxeVFreVRSeFJ4eUk4akg3VEJadUJicWFWTzlUaWg2NWlyc1ZmQi84QXprSjVRdDlGL1BaN0h5MmkmI3hBO1dENm05bmRXa2NYN3RJYm00SVdxVSt6V1ZlZTNTdTJLWDBsYS93RE9MWDVWdnBqUmE1YjNXdDYzT2hON3I5emQzSXVwWjJIeFNnTEomI3hBO3dIeGJxQ0cveXVYZFczaVAvT1AwT3ArU2YrY2tML3lYYlhiUzZlOGwvWVhOZGhOSGFwSk5CS3lkQS83c2ZLckR2aXI3TXhRN0ZXRS8mI3hBO21McDhyZlZyOUZyR2dNVXBIN05UVmZ2cWMyZloyUWJ4ZEQyMWhKNFpqbHlZNzVkMXlUUjc4VDhTOERqaFBHT3BYclVlNHpOMUdEeEkmI3hBOzExZFhvdFdjRTc2SG05TDA3V2ROMUdNUGFUcklTS21PdEhIelU3NXBNbUdVT1llcnc2bkhsRnhObzNLbTkyS3V4VjhXL3dET1pubGYmI3hBO1NkTDgrYVpxMWhBbHZMck5vNzN5eGppSko0WkNETWFmdE9ycUc4YVY2MXhWbmN2L0FEaURZK1pORjA3VnIvemJmdjVqdklZcHRSdTUmI3hBOzQwdVlXNUlwV09HTW1LUkZSUGdXc2hHM1FEYkZKZlJIbC9SclhROUIwM1JiUXMxcHBkckJaVzdTR3JtTzNqV0pDeEZOK0s3NG9SK0smI3hBO3NVL05QejFCNUY4aWFyNW1rUlpaYk9NTFoyN21nbHVKV0VjS0hjRWptd0xVMzRnbkZYeTErVDNtbjhvOVIxTFV2T241d2EzSHFmbW0mI3hBOzVuTWRwWVg5dlBkUVJRcW9JazRMRkpFYWxpcUowUUxzTjlsS0IvTnJ6NStXK2grZjlDODMvazdkcGI2aENIL1M5dmFXOHRyYU54S2MmI3hBO0FZM1NKU0psWmxrVkJUWUg3VytLdnRiVDd4YjJ3dHJ4VU1hM01TVENOdG1VU0tHb2EwM0ZjVUlqRlV0OHovcGIvRFdyZm9mL0FJNi8mI3hBOzFPNC9SM1QvQUhwOUp2UjYvd0NYVEZYeUgveml0K1pua255bnJPdFdQbTFoWWF0cXNpZWpyZDBLZ0ZTd2tnbWxiNG9xdTNJc2RqKzAmI3hBO1JRWXBmUm5sL3dES1R5L3BINW1YWDVnK1g3bU8xdHRYMDgyOTVwbHZFdjFlWjVIU1g2ekhJckJWNSttcElDN21yVitJNHE5Q3hRN0YmI3hBO1VwODJlV05LODArVzlROHY2dEVKYkRVWVRES3BGU3ArMGpyL0FKVWJnT3A3RURGWHlqL3poUkdZL1BmbUtNN2xOT0NtblNvdUVHS1UmI3hBO3IvNXhJdmRHc1B6SzFMUU5mZ2hGenFGcThGcWwwaU1mclZ2S0dNUTVBMFlyeitmSDVZcSt4LzhBRG5sNy9xMTJuL0lpTC9tbkZGb3kmI3hBOzJpdFlZaERhb2tjTVpLaU9JQlZVMXFSUmRoMXhWVnhWMkt2alQvbkl6LzFwUFJQKzNWL3lmT0tYMlhpaDhmOEFrZjhBOWJRMUQvbVAmI3hBOzFUL3FGbXhTK3dNVU94VlN1dnF2MWFUNjF3K3I4VDZ2cVU0OGZldTJTamQ3YzJHVGg0VHhmVDV2TGZNSTh2aTUvd0J4QmtLMVBxY3YmI3hBOzd2OEEyRmZpKy9ON3AvRXIxdkk2M3dPTDkxZjZQaDFRVVduNmpJb2todHBuWHFyb2pFZlFRTXRPU0kySkRqeHc1RHVJbjVNLzhtYVgmI3hBO3E5ckM5eHFFMGdFb0FqdFpHSjRnR3ZJZ25ZKzJhaldaWVNOUkh4ZWs3TTArV0FNcGs3OUdTNWhPMWRpcjVFLzV6Zy81U0h5dC93QXcmI3hBO2x6L3lkVEZYMVY1Yy93Q1VlMHYvQUpoSVArVFM0cVV4eFYyS3ZFUCtjd3JHOHVmeWZhYTNVbUt5MUsxbnV5T2dpSWVFRSszcVNwaXEmI3hBO2wvemlsZCtWTmQvS2F6c2paMnN1cDZMTlBiYWdza1ViU2Z2Wm5uaWMxQmJpeVNVQjhWUGhpbDdJTkM4dnduMWhwMXBHWS9qOVQwWTEmI3hBOzQ4ZCtWYWJVeFFtR0t1eFZKZk9mbTdTZktIbG05OHg2djZuNk9zQWpUK2l2T1Nra2l4THhVbGEvRTQ3NHE4cy9OSC9uSFB5UCtaTm4mI3hBOy9pWHk5TW1sYTVxRVF1NGRRaEJOcmVlcWdkR25pRktjNmcrb254YjFJYnBpcnpUL0FKeFU4NCtiTkIvTUxVUHl4MWwza3MwK3RJdG8mI3hBOzdCeGFYbG14OVgwMjMrQmdyQWhkcTBJNzFVdnJqRkRzVmRpcjQvOEErY0wvQVB5WVhtZi9BSmdEL3dCUktZcFpuK2RQL09MTjE1aDgmI3hBO3d6ZWJmSTk1RnArcjNNbjFtOXNabWFKSHVLOGpQRE1nWXBJemJrRVU1YjhoaXFqNWY4cS84NWtTcEhwZDc1a3RkT3NRdkI3KzQrcVgmI3hBO002cDBQRjBpa2xkNmRDelYvd0FvWXE5dS9MM3lKcDNrbnk2dWtXbHhOZXp5eXZkNm5xVnl4ZWU3dkpxZXJQSVNUdTNFYlY2QWJrMUomI3hBO1VNbHhWWmNHY1FTRzNDbTQ0dDZJa0pDRjZmRHlJQklGZXRCaXI1ajgvd0QvQURqOStkM25MejZubks0dmZMbG5lVzVnK3FXOFU5NjAmI3hBO2FDMlBLTU1XdGF0OFc1eFY5QVcwbm43L0FBcTczVnZwWCtMQXBFY01VOXoramkzS2lreU5GNndISGNqZ2Q5cTk4VmVBYVQrUVg1NTYmI3hBO2IrYWIvbVBGZmVXMzFhUzZ1THFTMWFhK0Z1UmRLOGNrWUF0dVZBa2hDbXRlaDN4VjlMMkJ2ellXeDFCSWt2ekVodTB0Mlo0Vm00ajEmI3hBO0JHenFqTWdhdkVsUWFkaGlxdVNBQ1NhQWRUaXJ5M3pONWp1Tld1bVZXSzJNYkVReGRBYWZ0c1BFL2htKzAybkdNZjBua05kclpacFUmI3hBO1BvSEw5YkpQS2ZsRzJpdDQ3Ky9qRXR4SUE4VVRDcW9wM0JJN3Qrck1IVjZzazhNZVR0ZXp1em94aUp6RnlQMk11QXBzTTE3dW5ZcTcmI3hBO0ZYWXErYi96ci9Jdjg0ZnpOOHdXOTlMY2VYN0d4MDVKSU5QaFc0dkRJWTNmbHpsUDFVam1hRFliRDhjVmV5ZmwvYi9tTlo2ZEZZZWImI3hBOzR0SXBhVzhVTnZjNlZOY3lOSTBZNGt5Unp3eEJQaEEreXgzeFZsbUt1eFZBNjdvbW1hN28xN28ycVFDNDAvVUlYdDdxRnYya2NVTkQmI3hBOzFCSFVFYmc3akZYeXRkZjg0eC9uRDVHOHluVmZ5ejF4Wm9DU0lYTW90cmtSazE5TzRqY0czbFViZDZFNzhCaWxuR2wvbFgrZTNuYU8mI3hBO096L05iek5GRDVaRGlTNjBUVGhFazEzd1lFUlRTVzhjU3JHYVYrMjN5Qm93VmUrUXd4UVF4d1FvSTRZbENSeHFLQlZVVUFBOEFNVUwmI3hBOzhWU1B6ejVUcy9OM2xIVlBMZDVLMEVHcHdHRXpvQVdqYW9aSEFPeDR1b05PK0t2SmZLUDVaLzhBT1Eza3JTVzh2YUQ1cDBTKzBTTUYmI3hBO0xHVFVvTGoxN1pXYXBNU29yRDVLN3NveFN5SDhvZnlHc2ZJdXEzL21UVk5UZlh2TnVxY3pkNmxJbnBvaG1mMUp2VFVseVdrZjdUc2EmI3hBO25zRnFRVkQxWEZYWXFrdm01dk9ZMG1ubENQVG4xWm5wWFZwSjQ3ZEl5clZZZWdrcnN3Zmo4T3dwWGZGWGdQNVEva0orZFA1YmVaYmomI3hBO1diUzY4dmFndDdBYmE3dDVybTlXcXRJc25OV1cxMmNGTzlSUW5GWDB4aXJzVmRpcnNWZGlyc1ZkaXJzVmRpcXllTDFZSklxMDlSV1cmI3hBO3ZoVVV3eE5HMk00MkNIalZ6YnpXMDhrRXlsSlltS3VwOFJuU3hrSkN3OE5rZ1lTTVR6RDByUy9PT2kzVnNobW5XMm5BQWtpaytFQS8mI3hBOzVKNkVacE11am5FN0N3OVZwKzBzVTQ3bmhQbTNmZWRkQnRSOE14dVgva2hITC9oalJmeHhob3NrdWxlOU9YdFRERHJ4ZTVQRWNPaXUmI3hBO0FRR0FJQjJPL2ptS1E1NE5odkFsMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjImI3hBO0t1eFYyS3V4VjJLcGJxM2wzU3RVbzExRis5QW9Ka1BGNmZQdjlPWDR0UlBIeUxpNmpSWTgzMURmdlNRL2x6cHZPb3VwZ244cDRFL2YmI3hBO1QrR1pQOG95N2c0SDhpWTcrby9ZbW1tK1VkRTA5MWxqaE1zeS9aa21QTWcrSUd5MStqS01tcnlUMkoyY3ZCMmRoeG13TFBtbk9Zem4mI3hBO094VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3NBL0x2OEFOSzY4NlhpbUxRTG15MGU0dFpMeXkxVngmI3hBO09ZbUVjNGhFVWpTVzhNUWxkVzVnUlN5Q2xkNmc0cElYNkgrYVA2VS9NRzk4b0hUa3RXczJ1VjlXYTRaTGgxdHlvV1ZMZDRVV1NPVXMmI3hBO2FHT1ZpS2ZFQml0SURYUHpkMVRSOWI4dzIwMmd4UzZSNVp1Tk9pMUsranZtOWN3Nm1RSTVZN1kyd1Zpbkw0ME1vOWljSzBtdm4vOEEmI3hBO01pWHl4cU5ocE9uNlJMcldyWDhGemRwYVJldUtSV3FyL3dBczl2ZHVXa2R3cS9CeEhWbVVkUXRJdlgvUE11bDZQNWZ1bzlNZHRROHgmI3hBOzNWclpXbW4zVG0xOUthNmlhWXJjUHdsS2Vtc2JjaHdKcnRURlVxODgrWmRZai9LaTUxeTcwMjYwcTk0Uk5lV0VGOExhNmdIcnFqZWwmI3hBO2RSeFRDdlEvWUZWTk5zVlRuOHdQT2plVTlMdHJ5TzFpdlpycTVGc2tFdHg5WDZ4dkpWYVJ6eVNOV01LRWpqWnQ2MG9DY1ZER2ZPL20mI3hBO2lUWC9BTWhyenpacDBsMXBWeFBwWTFHMWEydUpZWm9aZUhMajZzSmpMQlRVZUI4TUtwMytaV3MzR2xyNWFLTE9ZYnpYOU9zNW50cnMmI3hBOzJqajE1Z2lod0lwaE5FVC9BSGtaS2NoM3dLRkQ4eXZ6TlBrcVN3VDlIcGNyZkxLMzFtNXVIdExkWGpNWVNFekxEY0lqeStvU3BsNEomI3hBOzhKcTR4VUJTL01qelI1djBiekg1T3N0Q2p0bnQ5WHYzdHJ4TGlVeGVvRmdlUVJraUM0S0w4UExtdTlSU2xEVUtoVy9NL3dETXVUeVImI3hBO2IyMHlhZEhxUHJRM2R4SWpYUWdkVXM0eElRa1N4WEVzaFlFL0VFNEpTcnNvcGlvQ004NitmVjh0ZVY3VFgxc211b2JxV0JHRE5JcVEmI3hBO1J6b1hNMHpReFhNZ1JBUGk0eHRpdEp0NVMxNCtZUExXbTYwWW80RHFFQ1RtR0taTGxFTERkVm1RQlhwNDBIeXhRbGZuSHpicmVpNngmI3hBO29PbDZWcE1HcHphOU5QYnh0UGVOYUxGSkJidmMvRnh0N21xbEltMzZqd09LcE4rWFA1cjNYbSs5c29KOUdYVFl0UzBvNnhaU0xkZlcmI3hBO0dNYVhIMVo0NVY5R0hnM1BkYU0xVjhEdGlraEw3anozcWQ1K2FzZHBhYWRxZHpvK2ozYTZSY0cwK3NpM0Z6Y3dpU1c2dVVqdDJoa2kmI3hBO2hWNDFIcVhDOGFsd3AySUtvZjhBT3p6cnFVZWsrWTlCME9PV08rMGpTRjFhNzFXSyttc1pMYjFKR2poRVhvS1dtZWlNeFZtVmFVcWEmI3hBOzRoUXlIelpxMTNhZVcvS2MxYmh4ZWFubzl2Y3pXOTIxcktQck1zY2ZKejZjM3JJWFllcEdTdkphL0ZnVkhlY3ZPOTlvbXFhZG8rbGEmI3hBO1QrbU5YMUszdmJ1RzJhNEZxcGpzSTFkbFZ6SEx5a2thUlZSYVU3c1FNVlY5ZjgzM0dtcm9WdEJwL3JhejVnbTlDMHNMaWIwRmpLMjcmI3hBOzNFeG1tVkpnb2lTTWc4VllrOUs0cWdyYjh4MHV2eSt2dk5sdHBzczl4WWZXWXB0SmlibklibTBtYUI0MWRWUElGa3FHVlNlUDdOZHMmI3hBO1ZwR2ZsOTUwWHpmb2N1cXBGQkVpWE10c24xYTRhNVJoSFNqRXZGYlN4c2VXNlNScXcra1lvS2VhaGZmVklveUU5U1NhVklZa3J4QmQmI3hBO3p0VnFHZytqTE1jT0krNXF6WmVBRHFTYVF1aXpTSlpYVFhETWZSbm1CQmRwYUtoNkJuK0lnWlBNQVpDdW9IazA2YVJFWmNYU1I2MnYmI3hBOzBuVnByNG5uYXZBaGpTV09ROHlwRDErR3JJZzVEMnFQZkJseENIVzA2ZlVISnpqVzEvalliL05SdDlkbGt2QkJMYkxIRzF4SmFySXMmI3hBO2hZODQxTFY0OEYySUhqa3BZQUkyRDB0aERWa3lvamJpTWVmVWI5eXM5M2ZqWEV0VVZEYW1BeU5WaUdxSEFxQndQajBya1JDUGgzMXQmI3hBO3NPU2ZpOElyaHI4ZEZ0N3JSdGIrTzE5RU9ydEVyT0grSUdaeWdQQUJ0Z2U3RWUyR0dIaWpkOS8ySXk2bmdtSTEzZGU4MXkvWFMrOUwmI3hBO3JxMm5jWGNDUXlxNkJtQ3NCR1NLclhpZC9iQkQ2SmZCT1d4a2g4ZnVVNzNXM2d2V3RZclY3Z3hyRzh4UU9TQkl4QTRoVVlHZ0JPNUcmI3hBO0dHRzQyVFRITHF1R2ZDSWsxVi9INGZxWDZ2cS82UE1WWWd3a0RIMUhZb2dLMG9wWUs0QmF1M0tnOThHTER4c3RScVBEcmJuOG1KZVEmI3hBO2YrVlcvcEQvQUoxUDFmVTQzWDFUbjlmK3FjUFdYNjM5USt0ZjZOeDlYajZuMWJicFhLWEtYK1h2K1ZZLzR2bC9SZnJmcDM2eHFYcCsmI3hBO3Y5ZjlENng2dy9TWDFUNnovb3ZQMWY3MzBQMVlxd2ovQUoxWC9sYzNuVC9GM0w2ajlZMFA2clg2OTlTK3Nla1BxMzFyMHY4QVEvdDgmI3hBO2FmV051WDJjS3ZRZlAzK0F2cm1qL3dDSlBySDZUNVhINkYvUi93QmYrdS8zWSt0ZWwramY5STRlblQxUDJlbGNDSGVhL3dEbFhIK0QmI3hBOzlOL1RmRC9EM08xL1EzMWY2eHo5WGovb24xVDZwKy81OGZzZW52aWxENjkveXJiL0FKVnJKK2xmckgrRGYrUG5qK2tQVzVldjhmcismI3hBO2wvcG5QNnhYMU9meGNxODk4VlZQUFgvS3ZmcUdpLzRvK3NVOVJ2MFA2ZjZRK3U4L3F6K3IvdkwvQUtWVDZ2ejlYbnRUN2VLb0NiL2wmI3hBO1UvOEF5cCtQbjlZLzVWejZIdzhmMG55K3JlcWZ0Y2Y5TTlMbDQvRHhwK3pUQ3FQODcvNEIvUW1oZjRuK3ZmVXZybHAraHVQNlQrc2YmI3hBO1hkdnF2UDZ2L3BIcmN1bnE3OHV2eFlGVXZ6QS81VnIra1l2OFYvV1ByUDFHYm42SDZSOUw2aDZpZXY4QVd2cWY3cjBlZkhsNjN3NHEmI3hBO2pmekUvd0FEZlZ0Si93QVZldnordkwraHZxWDEzNjU5YzlONmVoK2p2OUpyNmZPdE52SHRpaEsvelA4QStWVS9XYlQvQUJ0Nm4xbjYmI3hBO3BlZWw5WCt2OC9xTkUrdCt2OVEzOUQ3UEwxZmgvSEZJUnV0LzRFL3c1NWQrdi9wRDlIK3ZGL2gvNnY4QXBYNjk2MzFXYmhUNnQvcHQmI3hBO2ZxM3E4dlU3VjVZcW4vbFgvRC8rSE5PL3c3NmY2RDlCUDBmNlZlUHBVMisxOGZMK2JsOFZhOHQ2NG9TUHp2OEE0SC9UbWcvNGcrdi8mI3hBO0FLVjV6L29MNmorbEsrcDZMZXR4L1IvdzgvUjUvYTM0MTdWeFN4Lzh2ZjhBbFRQNlkwZi9BQWY5ZCt1L28yYjlFOHYwejZQNk85WnYmI3hBO1UvM3EvY2VuNi9UbisxU243T0ZVeW4vNVZYL2oyNHI2ditKUHJOcDlmOUg2L3dEVS9ybkQvUlByUHAvNkQ2L0ducCtyOFhTbTlNQ28mI3hBO1g4enYrVlAvQUtSay93QVordDllL1JqZlcvcW42UzVmb3YxdC9yWDZPMjlEMXZzK3J0eXJUQ3FaZWFQK1ZmZjRQMFg5TmZYdjBIOWEmI3hBO3N2MFA2UDZVK3MvV2EvNkZYNnQvcGZMbFRqNm43Zkg5cmpnVkVlZnY4Q2V0cFA4QWlYMS9yM3FTL29iNmo5ZSt1OHVBOWYwZjBkL3AmI3hBO0hIaFRuK3pUcmlxenpQOEE4cTUvdzlvWDZVcitqUFZ0L3dERG4xSDYxOVk5WDBqNkgxUDZqL3BOZlJyOWo5bnJ0aXFHaC81VmQveXEmI3hBOzMvUi8rVUY0YitqOWM5U3YxamV2RC9UUFYrc2ZhL2I1ZGNWVHJ5VC9BSVUvUmx6L0FJYjUraDlibCt2ZXY5WitzZlhOdlYrc2ZXLzkmI3hBO0k5VDdOZlUzcFR0aWhOdFYvUi8xVC9UL0FPNTVyeHB5NWM2L0R3NGZIeXIwNDVaaTRyOVBOcHo4SEQ2K1g0N3QxTFMvMFg2Rng5VTUmI3hBOytsNmpmV1BWOVgrOHA4ZGZXMytlU3k4ZGkvMGZvWVlQRG84UEs5N3ZuMTVyZEkvUkZEOVE1Y2VJNGMvVnA2ZGR2VDlYOWl2OG0yT1gmI3hBO2ovaS9SOXRJMC9oL3dmcDVlVjlQZHNoWS93RERuMXFQaDZ2ci9XMzRWK3MwK3MwK1ByOFBUclhhbVdIeEs2VncrWEpxSGdjUTUzeGYmI3hBOzB2cTYvamtqN2o5SGZwTzM5VGw5ZjRONlBEMVA3dW81YytIdzhhMCszdFhLbzhYQ2ErbjRmajVOOCtEeEJmMTlPZkx6cnA3MEhxUCsmI3hBO0gvcnpmV3ZVK3RWaDUrbjY5T1hMOXpYMHZoNWN2czk4c3grSnc3Y3QrNzQ4Mm5ONFBINnI0dHY1MytieTY5M1ZHWGYxRDYvWit2eismI3hBO3RWZjZyeDlUalhqOFZlSHdkUDVzcmh4Y0pybDE1TitUZzQ0MzlYVG4vWjgxSysvUTMxNWZySEw2endITGg2dFBUNWJlcjZmdzhlWDgmI3hBOysyU2h4OE8zTDRmWit4aGw4TGo5WDFWNTh2T3VudmRxbjZJOVZmcjNQbDZiMTQrcng5S281OC9UK0hqMHJ5d1l1T3ZUK2hjL2gzNismI3hBOzd6NWRicnA3My8vWjwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyI+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06UmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC94bXBNTTpSZW5kaXRpb25DbGFzcz4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+dXVpZDplZTM5NjdiOC1mMTM4LTQ3NGMtYTAxYy0xZWNhYWU4MTE5MDE8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6QzM3QzJDM0I0NTIwNjgxMTgyMkFFQ0VBQjNEQTA5MDI8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6cmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC9zdFJlZjpyZW5kaXRpb25DbGFzcz4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOkMzN0MyQzNCNDUyMDY4MTE4MjJBRUNFQUIzREEwOTAyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTAzLTIzVDEyOjQzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjA0ODAxMTc0MDcyMDY4MTE4M0QxQTEyNUE5N0JFOTE2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA2LTExVDEyOjAzOjAxKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iPgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+UHJpbnQ8L2lsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgbGlicmFyeSAxMC4wMTwvcGRmOlByb2R1Y2VyPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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",
					width: 180, margin: [ 0, 20, 0, 40 ]
				},
				{
			        text: "Propuesta económica de Enéresi para " + $scope.pptos[0].Nombre+ " " + $scope.pptos[0].Apellidos,
			        fontSize: 14, color: '#666'
			    },
			    {	text: '', pageBreak: 'after' },
		    // pagina 2: detalle de presupuesto
		    	{
		    		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAAlgAAAAEAAQCWAAAAAQAB/+E8Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL2pwZWc8L2RjOmZvcm1hdD4KICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5sb2dvX2VuZXJlc2k8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICA8L2RjOnRpdGxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBHSW1nPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvZy9pbWcvIj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNS0wNi0xMVQxMjowMzowMSswMjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTUtMDYtMTFUMTA6MDM6MDhaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMDYtMTFUMTI6MDM6MDErMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIENTNiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOlRodW1ibmFpbHM+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6d2lkdGg+MjU2PC94bXBHSW1nOndpZHRoPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpoZWlnaHQ+Njg8L3htcEdJbWc6aGVpZ2h0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpmb3JtYXQ+SlBFRzwveG1wR0ltZzpmb3JtYXQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmltYWdlPi85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83UUFzVUdodmRHOXphRzl3SURNdU1BQTRRa2xOQSswQUFBQUFBQkFBU0FBQUFBRUEmI3hBO0FRQklBQUFBQVFBQi8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFCZ1FFQkFVRUJnVUZCZ2tHQlFZSkN3Z0dCZ2dMREFvS0N3b0smI3hBO0RCQU1EQXdNREF3UURBNFBFQThPREJNVEZCUVRFeHdiR3hzY0h4OGZIeDhmSHg4Zkh3RUhCd2NOREEwWUVCQVlHaFVSRlJvZkh4OGYmI3hBO0h4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zi84QUFFUWdBUkFFQUF3RVImI3hBO0FBSVJBUU1SQWYvRUFhSUFBQUFIQVFFQkFRRUFBQUFBQUFBQUFBUUZBd0lHQVFBSENBa0tDd0VBQWdJREFRRUJBUUVBQUFBQUFBQUEmI3hBO0FRQUNBd1FGQmdjSUNRb0xFQUFDQVFNREFnUUNCZ2NEQkFJR0FuTUJBZ01SQkFBRklSSXhRVkVHRTJFaWNZRVVNcEdoQnhXeFFpUEImI3hBO1V0SGhNeFppOENSeWd2RWxRelJUa3FLeVkzUENOVVFuazZPek5oZFVaSFREMHVJSUpvTUpDaGdaaEpSRlJxUzBWdE5WS0JyeTQvUEUmI3hBOzFPVDBaWFdGbGFXMXhkWGw5V1oyaHBhbXRzYlc1dlkzUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8rQ2s1U1ZscGVZbVomI3hBO3FibkoyZW41S2pwS1dtcDZpcHFxdXNyYTZ2b1JBQUlDQVFJREJRVUVCUVlFQ0FNRGJRRUFBaEVEQkNFU01VRUZVUk5oSWdaeGdaRXkmI3hBO29iSHdGTUhSNFNOQ0ZWSmljdkV6SkRSRGdoYVNVeVdpWTdMQ0IzUFNOZUpFZ3hkVWt3Z0pDaGdaSmpaRkdpZGtkRlUzOHFPend5Z3AmI3hBOzArUHpoSlNrdE1UVTVQUmxkWVdWcGJYRjFlWDFSbFptZG9hV3ByYkcxdWIyUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8mI3hBOytEbEpXV2w1aVptcHVjblo2ZmtxT2twYWFucUttcXE2eXRycSt2L2FBQXdEQVFBQ0VRTVJBRDhBOVU0cTdGWFlxN0ZYWXE3RlhZcTcmI3hBO0ZYWXE3RlZrODhOdkM4OHppT0tNY25kdWdBd3hpU2FER2N4RVdkZ0dEYWw1MzFLK3VSYWFOR1l3NTRvOU9Vci9BQ0hSYzJ1UFJSaUwmI3hBO204L243VnlaSmNPSWZyY1BKZm1TK1gxTCs5QVp0K0VqdklSODZmRDl4eC9PWW8vU0Yva3pQazNuTDdiUzNVUEtHdTZhcG5RZXRHdTUmI3hBO2tnSjVBZTQyYjdzdXg2dkhQYmw3M0Z6ZG01c1c0M0hrbWZrelVmTWx4ZXJHWkhuc0UybmFiNGd1MndESGV2dGxHc3g0aEcrVW5MN00mI3hBO3paNVRxN2gxdG5lYXA2RjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFZSdkwyenNiV1M3dlo0N1cxaEhLYTQmI3hBO21kWTQwWHhaMklVRDU0cWtHbS9tWitYT3FhZ3VuYWQ1bzBxOHZuWUpGYlFYc0VqeU13cUJHRmM4ei9xMXhWa3VLdXhWMktzZXZ2ekUmI3hBOzhoV056RmEzZm1IVG9ycWFkYldLMyt0UkdVek8zQUp3REZxOHRqdHQzeFdrUnJublR5Zm9FaXhhNXJ1bjZWSzY4MGp2YnFHM2RsOFYmI3hBO1dSbEo2ZHNWUmVqYS9vV3QyaHZORjFHMTFPMERGRGNXYzBkeEh5SFZlY2JNdFJpcU94VjJLc0svTVhVSkZXMnNFTkVjR1dVZU5EUlImI3hBOyt2Tm4yZGpHOG5ROXRaaUJHQTY3cVA1YjI4TFhGN093QmxpV05ZejRCeTNML2lJeVhhTWpRRFgySkFHVWoxRmZwWjNtcWVpZGlyZ0EmI3hBO09ncFhjNHE3RlVoMXp6LzVIMEZaanJHdldGaTF2dE5GTmNSTElwTzRIcDh1WlBzQlhGVlhWL08za3pSVEFOWTE3VHROTnlnbHRoZVgmI3hBO2NFSHFSbm82ZW82OGw5eGlxY0k2U0lza2JCMGNCa2RUVUVIY0VFWXEzaXJzVlN6WFBOUGxuUUlrbDEzVnJQU281SyttMTdjUlc0YW4mI3hBO1hqNmpMeStqRlZQeS93Q2IvS25tT0pwZEExaXkxVlVDdEw5VG5qbUtjaFVlb3FNU2g5bXBpcWI0cTdGWFlxd1h6UitlUDVVK1Y5U2YmI3hBO1ROYTh3d1E2aEZVVFcwTWM5MDhaRzVXUVcwYzNBaW00YWh4Vk12SmY1b2VRdk8zcmp5eHJFT295V3loNTRRc2tVcXF4b0dNY3l4dlMmI3hBO3UxYVlxeWpGWFlxb1h0L1kyRnM5MWZYRVZyYkpUblBPNnhvdFRRVlppQU1WU3pTZk8zbERXZFVuMHJTTlpzOVIxQzJpRTl4YjJrNlQmI3hBO01rWmJoVnZUTEFmRjFIVWJlSXhWOGorY2Z6UDh1Zm1SK2NYMUx6bHJMYWIrV2VpelMvVjdWQk1WdXZRUEFNd2dWM0xUdnZ5b09NZXcmI3hBO28yNVVwOStjZm1EL0FKeGMxZnlCZFczbGxySzI4eFdhSzJqdnAxaFBiU3RJcEE0U1NlakdySXkxcjZqZTQrTEZYckgvQURpOTU0MXomI3hBO3pkK1ZzVnhyVXJYTjdwZDNKcHYxeVFreVRSeFJ4eUk4akg3VEJadUJicWFWTzlUaWg2NWlyc1ZmQi84QXprSjVRdDlGL1BaN0h5MmkmI3hBO1dENm05bmRXa2NYN3RJYm00SVdxVSt6V1ZlZTNTdTJLWDBsYS93RE9MWDVWdnBqUmE1YjNXdDYzT2hON3I5emQzSXVwWjJIeFNnTEomI3hBO3dIeGJxQ0cveXVYZFczaVAvT1AwT3ArU2YrY2tML3lYYlhiUzZlOGwvWVhOZGhOSGFwSk5CS3lkQS83c2ZLckR2aXI3TXhRN0ZXRS8mI3hBO21McDhyZlZyOUZyR2dNVXBIN05UVmZ2cWMyZloyUWJ4ZEQyMWhKNFpqbHlZNzVkMXlUUjc4VDhTOERqaFBHT3BYclVlNHpOMUdEeEkmI3hBOzExZFhvdFdjRTc2SG05TDA3V2ROMUdNUGFUcklTS21PdEhIelU3NXBNbUdVT1llcnc2bkhsRnhObzNLbTkyS3V4VjhXL3dET1pubGYmI3hBO1NkTDgrYVpxMWhBbHZMck5vNzN5eGppSko0WkNETWFmdE9ycUc4YVY2MXhWbmN2L0FEaURZK1pORjA3VnIvemJmdjVqdklZcHRSdTUmI3hBOzQwdVlXNUlwV09HTW1LUkZSUGdXc2hHM1FEYkZKZlJIbC9SclhROUIwM1JiUXMxcHBkckJaVzdTR3JtTzNqV0pDeEZOK0s3NG9SK0smI3hBO3NVL05QejFCNUY4aWFyNW1rUlpaYk9NTFoyN21nbHVKV0VjS0hjRWptd0xVMzRnbkZYeTErVDNtbjhvOVIxTFV2T241d2EzSHFmbW0mI3hBOzVuTWRwWVg5dlBkUVJRcW9JazRMRkpFYWxpcUowUUxzTjlsS0IvTnJ6NStXK2grZjlDODMvazdkcGI2aENIL1M5dmFXOHRyYU54S2MmI3hBO0FZM1NKU0psWmxrVkJUWUg3VytLdnRiVDd4YjJ3dHJ4VU1hM01TVENOdG1VU0tHb2EwM0ZjVUlqRlV0OHovcGIvRFdyZm9mL0FJNi8mI3hBOzFPNC9SM1QvQUhwOUp2UjYvd0NYVEZYeUgveml0K1pua255bnJPdFdQbTFoWWF0cXNpZWpyZDBLZ0ZTd2tnbWxiNG9xdTNJc2RqKzAmI3hBO1JRWXBmUm5sL3dES1R5L3BINW1YWDVnK1g3bU8xdHRYMDgyOTVwbHZFdjFlWjVIU1g2ekhJckJWNSttcElDN21yVitJNHE5Q3hRN0YmI3hBO1VwODJlV05LODArVzlROHY2dEVKYkRVWVRES3BGU3ArMGpyL0FKVWJnT3A3RURGWHlqL3poUkdZL1BmbUtNN2xOT0NtblNvdUVHS1UmI3hBO3IvNXhJdmRHc1B6SzFMUU5mZ2hGenFGcThGcWwwaU1mclZ2S0dNUTVBMFlyeitmSDVZcSt4LzhBRG5sNy9xMTJuL0lpTC9tbkZGb3kmI3hBOzJpdFlZaERhb2tjTVpLaU9JQlZVMXFSUmRoMXhWVnhWMkt2alQvbkl6LzFwUFJQKzNWL3lmT0tYMlhpaDhmOEFrZjhBOWJRMUQvbVAmI3hBOzFUL3FGbXhTK3dNVU94VlN1dnF2MWFUNjF3K3I4VDZ2cVU0OGZldTJTamQ3YzJHVGg0VHhmVDV2TGZNSTh2aTUvd0J4QmtLMVBxY3YmI3hBOzd2OEEyRmZpKy9ON3AvRXIxdkk2M3dPTDkxZjZQaDFRVVduNmpJb2todHBuWHFyb2pFZlFRTXRPU0kySkRqeHc1RHVJbjVNLzhtYVgmI3hBO3E5ckM5eHFFMGdFb0FqdFpHSjRnR3ZJZ25ZKzJhaldaWVNOUkh4ZWs3TTArV0FNcGs3OUdTNWhPMWRpcjVFLzV6Zy81U0h5dC93QXcmI3hBO2x6L3lkVEZYMVY1Yy93Q1VlMHYvQUpoSVArVFM0cVV4eFYyS3ZFUCtjd3JHOHVmeWZhYTNVbUt5MUsxbnV5T2dpSWVFRSszcVNwaXEmI3hBO2wvemlsZCtWTmQvS2F6c2paMnN1cDZMTlBiYWdza1ViU2Z2Wm5uaWMxQmJpeVNVQjhWUGhpbDdJTkM4dnduMWhwMXBHWS9qOVQwWTEmI3hBOzQ4ZCtWYWJVeFFtR0t1eFZKZk9mbTdTZktIbG05OHg2djZuNk9zQWpUK2l2T1Nra2l4THhVbGEvRTQ3NHE4cy9OSC9uSFB5UCtaTm4mI3hBOy9pWHk5TW1sYTVxRVF1NGRRaEJOcmVlcWdkR25pRktjNmcrb254YjFJYnBpcnpUL0FKeFU4NCtiTkIvTUxVUHl4MWwza3MwK3RJdG8mI3hBOzdCeGFYbG14OVgwMjMrQmdyQWhkcTBJNzFVdnJqRkRzVmRpcjQvOEErY0wvQVB5WVhtZi9BSmdEL3dCUktZcFpuK2RQL09MTjE1aDgmI3hBO3d6ZWJmSTk1RnArcjNNbjFtOXNabWFKSHVLOGpQRE1nWXBJemJrRVU1YjhoaXFqNWY4cS84NWtTcEhwZDc1a3RkT3NRdkI3KzQrcVgmI3hBO002cDBQRjBpa2xkNmRDelYvd0FvWXE5dS9MM3lKcDNrbnk2dWtXbHhOZXp5eXZkNm5xVnl4ZWU3dkpxZXJQSVNUdTNFYlY2QWJrMUomI3hBO1VNbHhWWmNHY1FTRzNDbTQ0dDZJa0pDRjZmRHlJQklGZXRCaXI1ajgvd0QvQURqOStkM25MejZubks0dmZMbG5lVzVnK3FXOFU5NjAmI3hBO2FDMlBLTU1XdGF0OFc1eFY5QVcwbm43L0FBcTczVnZwWCtMQXBFY01VOXoramkzS2lreU5GNndISGNqZ2Q5cTk4VmVBYVQrUVg1NTYmI3hBO2IrYWIvbVBGZmVXMzFhUzZ1THFTMWFhK0Z1UmRLOGNrWUF0dVZBa2hDbXRlaDN4VjlMMkJ2ellXeDFCSWt2ekVodTB0Mlo0Vm00ajEmI3hBO0JHenFqTWdhdkVsUWFkaGlxdVNBQ1NhQWRUaXJ5M3pONWp1Tld1bVZXSzJNYkVReGRBYWZ0c1BFL2htKzAybkdNZjBua05kclpacFUmI3hBO1BvSEw5YkpQS2ZsRzJpdDQ3Ky9qRXR4SUE4VVRDcW9wM0JJN3Qrck1IVjZzazhNZVR0ZXp1em94aUp6RnlQMk11QXBzTTE3dW5ZcTcmI3hBO0ZYWXErYi96ci9Jdjg0ZnpOOHdXOTlMY2VYN0d4MDVKSU5QaFc0dkRJWTNmbHpsUDFVam1hRFliRDhjVmV5ZmwvYi9tTlo2ZEZZZWImI3hBOzR0SXBhVzhVTnZjNlZOY3lOSTBZNGt5Unp3eEJQaEEreXgzeFZsbUt1eFZBNjdvbW1hN28xN28ycVFDNDAvVUlYdDdxRnYya2NVTkQmI3hBOzFCSFVFYmc3akZYeXRkZjg0eC9uRDVHOHluVmZ5ejF4Wm9DU0lYTW90cmtSazE5TzRqY0czbFViZDZFNzhCaWxuR2wvbFgrZTNuYU8mI3hBO096L05iek5GRDVaRGlTNjBUVGhFazEzd1lFUlRTVzhjU3JHYVYrMjN5Qm93VmUrUXd4UVF4d1FvSTRZbENSeHFLQlZVVUFBOEFNVUwmI3hBOzhWU1B6ejVUcy9OM2xIVlBMZDVLMEVHcHdHRXpvQVdqYW9aSEFPeDR1b05PK0t2SmZLUDVaLzhBT1Eza3JTVzh2YUQ1cDBTKzBTTUYmI3hBO0xHVFVvTGoxN1pXYXBNU29yRDVLN3NveFN5SDhvZnlHc2ZJdXEzL21UVk5UZlh2TnVxY3pkNmxJbnBvaG1mMUp2VFVseVdrZjdUc2EmI3hBO25zRnFRVkQxWEZYWXFrdm01dk9ZMG1ubENQVG4xWm5wWFZwSjQ3ZEl5clZZZWdrcnN3Zmo4T3dwWGZGWGdQNVEva0orZFA1YmVaYmomI3hBO1diUzY4dmFndDdBYmE3dDVybTlXcXRJc25OV1cxMmNGTzlSUW5GWDB4aXJzVmRpcnNWZGlyc1ZkaXJzVmRpcXllTDFZSklxMDlSV1cmI3hBO3ZoVVV3eE5HMk00MkNIalZ6YnpXMDhrRXlsSlltS3VwOFJuU3hrSkN3OE5rZ1lTTVR6RDByUy9PT2kzVnNobW5XMm5BQWtpaytFQS8mI3hBOzVKNkVacE11am5FN0N3OVZwKzBzVTQ3bmhQbTNmZWRkQnRSOE14dVgva2hITC9oalJmeHhob3NrdWxlOU9YdFRERHJ4ZTVQRWNPaXUmI3hBO0FRR0FJQjJPL2ptS1E1NE5odkFsMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjImI3hBO0t1eFYyS3V4VjJLcGJxM2wzU3RVbzExRis5QW9Ka1BGNmZQdjlPWDR0UlBIeUxpNmpSWTgzMURmdlNRL2x6cHZPb3VwZ244cDRFL2YmI3hBO1QrR1pQOG95N2c0SDhpWTcrby9ZbW1tK1VkRTA5MWxqaE1zeS9aa21QTWcrSUd5MStqS01tcnlUMkoyY3ZCMmRoeG13TFBtbk9Zem4mI3hBO094VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3NBL0x2OEFOSzY4NlhpbUxRTG15MGU0dFpMeXkxVngmI3hBO09ZbUVjNGhFVWpTVzhNUWxkVzVnUlN5Q2xkNmc0cElYNkgrYVA2VS9NRzk4b0hUa3RXczJ1VjlXYTRaTGgxdHlvV1ZMZDRVV1NPVXMmI3hBO2FHT1ZpS2ZFQml0SURYUHpkMVRSOWI4dzIwMmd4UzZSNVp1Tk9pMUsranZtOWN3Nm1RSTVZN1kyd1Zpbkw0ME1vOWljSzBtdm4vOEEmI3hBO01pWHl4cU5ocE9uNlJMcldyWDhGemRwYVJldUtSV3FyL3dBczl2ZHVXa2R3cS9CeEhWbVVkUXRJdlgvUE11bDZQNWZ1bzlNZHRROHgmI3hBOzNWclpXbW4zVG0xOUthNmlhWXJjUHdsS2Vtc2JjaHdKcnRURlVxODgrWmRZai9LaTUxeTcwMjYwcTk0Uk5lV0VGOExhNmdIcnFqZWwmI3hBO2RSeFRDdlEvWUZWTk5zVlRuOHdQT2plVTlMdHJ5TzFpdlpycTVGc2tFdHg5WDZ4dkpWYVJ6eVNOV01LRWpqWnQ2MG9DY1ZER2ZPL20mI3hBO2lUWC9BTWhyenpacDBsMXBWeFBwWTFHMWEydUpZWm9aZUhMajZzSmpMQlRVZUI4TUtwMytaV3MzR2xyNWFLTE9ZYnpYOU9zNW50cnMmI3hBOzJqajE1Z2lod0lwaE5FVC9BSGtaS2NoM3dLRkQ4eXZ6TlBrcVN3VDlIcGNyZkxLMzFtNXVIdExkWGpNWVNFekxEY0lqeStvU3BsNEomI3hBOzhKcTR4VUJTL01qelI1djBiekg1T3N0Q2p0bnQ5WHYzdHJ4TGlVeGVvRmdlUVJraUM0S0w4UExtdTlSU2xEVUtoVy9NL3dETXVUeVImI3hBO2IyMHlhZEhxUHJRM2R4SWpYUWdkVXM0eElRa1N4WEVzaFlFL0VFNEpTcnNvcGlvQ004NitmVjh0ZVY3VFgxc211b2JxV0JHRE5JcVEmI3hBO1J6b1hNMHpReFhNZ1JBUGk0eHRpdEp0NVMxNCtZUExXbTYwWW80RHFFQ1RtR0taTGxFTERkVm1RQlhwNDBIeXhRbGZuSHpicmVpNngmI3hBO29PbDZWcE1HcHphOU5QYnh0UGVOYUxGSkJidmMvRnh0N21xbEltMzZqd09LcE4rWFA1cjNYbSs5c29KOUdYVFl0UzBvNnhaU0xkZlcmI3hBO0dNYVhIMVo0NVY5R0hnM1BkYU0xVjhEdGlraEw3anozcWQ1K2FzZHBhYWRxZHpvK2ozYTZSY0cwK3NpM0Z6Y3dpU1c2dVVqdDJoa2kmI3hBO2hWNDFIcVhDOGFsd3AySUtvZjhBT3p6cnFVZWsrWTlCME9PV08rMGpTRjFhNzFXSyttc1pMYjFKR2poRVhvS1dtZWlNeFZtVmFVcWEmI3hBOzRoUXlIelpxMTNhZVcvS2MxYmh4ZWFubzl2Y3pXOTIxcktQck1zY2ZKejZjM3JJWFllcEdTdkphL0ZnVkhlY3ZPOTlvbXFhZG8rbGEmI3hBO1QrbU5YMUszdmJ1RzJhNEZxcGpzSTFkbFZ6SEx5a2thUlZSYVU3c1FNVlY5ZjgzM0dtcm9WdEJwL3JhejVnbTlDMHNMaWIwRmpLMjcmI3hBOzNFeG1tVkpnb2lTTWc4VllrOUs0cWdyYjh4MHV2eSt2dk5sdHBzczl4WWZXWXB0SmlibklibTBtYUI0MWRWUElGa3FHVlNlUDdOZHMmI3hBO1ZwR2ZsOTUwWHpmb2N1cXBGQkVpWE10c24xYTRhNVJoSFNqRXZGYlN4c2VXNlNScXcra1lvS2VhaGZmVklveUU5U1NhVklZa3J4QmQmI3hBO3p0VnFHZytqTE1jT0krNXF6WmVBRHFTYVF1aXpTSlpYVFhETWZSbm1CQmRwYUtoNkJuK0lnWlBNQVpDdW9IazA2YVJFWmNYU1I2MnYmI3hBOzBuVnByNG5uYXZBaGpTV09ROHlwRDErR3JJZzVEMnFQZkJseENIVzA2ZlVISnpqVzEvalliL05SdDlkbGt2QkJMYkxIRzF4SmFySXMmI3hBO2hZODQxTFY0OEYySUhqa3BZQUkyRDB0aERWa3lvamJpTWVmVWI5eXM5M2ZqWEV0VVZEYW1BeU5WaUdxSEFxQndQajBya1JDUGgzMXQmI3hBO3NPU2ZpOElyaHI4ZEZ0N3JSdGIrTzE5RU9ydEVyT0grSUdaeWdQQUJ0Z2U3RWUyR0dIaWpkOS8ySXk2bmdtSTEzZGU4MXkvWFMrOUwmI3hBO3JxMm5jWGNDUXlxNkJtQ3NCR1NLclhpZC9iQkQ2SmZCT1d4a2g4ZnVVNzNXM2d2V3RZclY3Z3hyRzh4UU9TQkl4QTRoVVlHZ0JPNUcmI3hBO0dHRzQyVFRITHF1R2ZDSWsxVi9INGZxWDZ2cS82UE1WWWd3a0RIMUhZb2dLMG9wWUs0QmF1M0tnOThHTER4c3RScVBEcmJuOG1KZVEmI3hBO2YrVlcvcEQvQUoxUDFmVTQzWDFUbjlmK3FjUFdYNjM5USt0ZjZOeDlYajZuMWJicFhLWEtYK1h2K1ZZLzR2bC9SZnJmcDM2eHFYcCsmI3hBO3Y5ZjlENng2dy9TWDFUNnovb3ZQMWY3MzBQMVlxd2ovQUoxWC9sYzNuVC9GM0w2ajlZMFA2clg2OTlTK3Nla1BxMzFyMHY4QVEvdDgmI3hBO2FmV051WDJjS3ZRZlAzK0F2cm1qL3dDSlBySDZUNVhINkYvUi93QmYrdS8zWSt0ZWwramY5STRlblQxUDJlbGNDSGVhL3dEbFhIK0QmI3hBOzlOL1RmRC9EM08xL1EzMWY2eHo5WGovb24xVDZwKy81OGZzZW52aWxENjkveXJiL0FKVnJKK2xmckgrRGYrUG5qK2tQVzVldjhmcismI3hBO2wvcG5QNnhYMU9meGNxODk4VlZQUFgvS3ZmcUdpLzRvK3NVOVJ2MFA2ZjZRK3U4L3F6K3IvdkwvQUtWVDZ2ejlYbnRUN2VLb0NiL2wmI3hBO1UvOEF5cCtQbjlZLzVWejZIdzhmMG55K3JlcWZ0Y2Y5TTlMbDQvRHhwK3pUQ3FQODcvNEIvUW1oZjRuK3ZmVXZybHAraHVQNlQrc2YmI3hBO1hkdnF2UDZ2L3BIcmN1bnE3OHV2eFlGVXZ6QS81VnIra1l2OFYvV1ByUDFHYm42SDZSOUw2aDZpZXY4QVd2cWY3cjBlZkhsNjN3NHEmI3hBO2pmekUvd0FEZlZ0Si93QVZldnordkwraHZxWDEzNjU5YzlONmVoK2p2OUpyNmZPdE52SHRpaEsvelA4QStWVS9XYlQvQUJ0Nm4xbjYmI3hBO3BlZWw5WCt2OC9xTkUrdCt2OVEzOUQ3UEwxZmgvSEZJUnV0LzRFL3c1NWQrdi9wRDlIK3ZGL2gvNnY4QXBYNjk2MzFXYmhUNnQvcHQmI3hBO2ZxM3E4dlU3VjVZcW4vbFgvRC8rSE5PL3c3NmY2RDlCUDBmNlZlUHBVMisxOGZMK2JsOFZhOHQ2NG9TUHp2OEE0SC9UbWcvNGcrdi8mI3hBO0FLVjV6L29MNmorbEsrcDZMZXR4L1IvdzgvUjUvYTM0MTdWeFN4Lzh2ZjhBbFRQNlkwZi9BQWY5ZCt1L28yYjlFOHYwejZQNk85WnYmI3hBO1UvM3EvY2VuNi9UbisxU243T0ZVeW4vNVZYL2oyNHI2ditKUHJOcDlmOUg2L3dEVS9ybkQvUlByUHAvNkQ2L0ducCtyOFhTbTlNQ28mI3hBO1g4enYrVlAvQUtSay93QVordDllL1JqZlcvcW42UzVmb3YxdC9yWDZPMjlEMXZzK3J0eXJUQ3FaZWFQK1ZmZjRQMFg5TmZYdjBIOWEmI3hBO3N2MFA2UDZVK3MvV2EvNkZYNnQvcGZMbFRqNm43Zkg5cmpnVkVlZnY4Q2V0cFA4QWlYMS9yM3FTL29iNmo5ZSt1OHVBOWYwZjBkL3AmI3hBO0hIaFRuK3pUcmlxenpQOEE4cTUvdzlvWDZVcitqUFZ0L3dERG4xSDYxOVk5WDBqNkgxUDZqL3BOZlJyOWo5bnJ0aXFHaC81VmQveXEmI3hBOzMvUi8rVUY0YitqOWM5U3YxamV2RC9UUFYrc2ZhL2I1ZGNWVHJ5VC9BSVUvUmx6L0FJYjUraDlibCt2ZXY5WitzZlhOdlYrc2ZXLzkmI3hBO0k5VDdOZlUzcFR0aWhOdFYvUi8xVC9UL0FPNTVyeHB5NWM2L0R3NGZIeXIwNDVaaTRyOVBOcHo4SEQ2K1g0N3QxTFMvMFg2Rng5VTUmI3hBOytsNmpmV1BWOVgrOHA4ZGZXMytlU3k4ZGkvMGZvWVlQRG84UEs5N3ZuMTVyZEkvUkZEOVE1Y2VJNGMvVnA2ZGR2VDlYOWl2OG0yT1gmI3hBO2ovaS9SOXRJMC9oL3dmcDVlVjlQZHNoWS93RERuMXFQaDZ2ci9XMzRWK3MwK3MwK1ByOFBUclhhbVdIeEs2VncrWEpxSGdjUTUzeGYmI3hBOzB2cTYvamtqN2o5SGZwTzM5VGw5ZjRONlBEMVA3dW81YytIdzhhMCszdFhLbzhYQ2ErbjRmajVOOCtEeEJmMTlPZkx6cnA3MEhxUCsmI3hBO0gvcnpmV3ZVK3RWaDUrbjY5T1hMOXpYMHZoNWN2czk4c3grSnc3Y3QrNzQ4Mm5ONFBINnI0dHY1MytieTY5M1ZHWGYxRDYvWit2eismI3hBO3RWZjZyeDlUalhqOFZlSHdkUDVzcmh4Y0pybDE1TitUZzQ0MzlYVG4vWjgxSysvUTMxNWZySEw2endITGg2dFBUNWJlcjZmdzhlWDgmI3hBOysyU2h4OE8zTDRmWit4aGw4TGo5WDFWNTh2T3VudmRxbjZJOVZmcjNQbDZiMTQrcng5S281OC9UK0hqMHJ5d1l1T3ZUK2hjL2gzNismI3hBOzd6NWRicnA3My8vWjwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyI+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06UmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC94bXBNTTpSZW5kaXRpb25DbGFzcz4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+dXVpZDplZTM5NjdiOC1mMTM4LTQ3NGMtYTAxYy0xZWNhYWU4MTE5MDE8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6QzM3QzJDM0I0NTIwNjgxMTgyMkFFQ0VBQjNEQTA5MDI8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6cmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC9zdFJlZjpyZW5kaXRpb25DbGFzcz4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOkMzN0MyQzNCNDUyMDY4MTE4MjJBRUNFQUIzREEwOTAyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTAzLTIzVDEyOjQzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjA0ODAxMTc0MDcyMDY4MTE4M0QxQTEyNUE5N0JFOTE2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA2LTExVDEyOjAzOjAxKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iPgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+UHJpbnQ8L2lsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgbGlicmFyeSAxMC4wMTwvcGRmOlByb2R1Y2VyPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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",
					width: 180, margin: [ 0, 20, 0, 40 ]
				},
			    { 	text: 'Detalle de los tratamientos propuestos.',
			    	margin: [ 0, 20, 0, 20 ]
			    },
			    {
			    	style: 'demoTable',
			    	table: {
			    	  widths: ['50%', '10%', '10%', '10%','10%','10%'],
			    	  body: lineas
			    	},
			    	layout: 'lightHorizontalLines'
		    	},
			    { 	text: 'El coste total de los tratamientos propuestos es de ' + $scope.pptos[0].importePresupuestado + ' €',
			    	margin: [ 0, 40, 0, 40 ] , fontSize: 14, bold: true
			    },

			    { 	text: 'Este presupuesto tiene una validez de tres meses',
			    	margin: [ 0, 30, 0, 10 ]
			    },
			    { 	text: 'Como todo procedimiento médico, el presente plan de tratamiento puede verse alterado por divesas vriables que pueden a su vez modificar el presupuesto. En caso de que esto suceda usted será debidamente informado.',
			    	margin: [ 0, 0, 0, 10 ]
			    },
			    { 	text: 'En conformidad con el plan de tratamiento y presupuesto, firmo el presente y acepto cooperar en las recomendaciones de mi médico, entendiendo que la falta de seguimiento de las misma puede provocar resultados inferiores a los deseados.',
			    	margin: [ 0, 0, 0, 10 ]
			    },
			    { 	text: 'En caso de un tratamiento iniciado y finalizado por el paciente, Enéresi se reserva el derecho de cobro de los trabajos realizados hasta la fecha de interrupción.',
			    	margin: [ 0, 0, 0, 10 ]
			    },
			    { 	text: 'Firmado,' },
			    { 	text: moment().format('DD/MM/YYYY HH:mm:ss') },
			    {	text: '', pageBreak: 'after' },

		    // pagina 3: formas de pago
		    	{
		    		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAAlgAAAAEAAQCWAAAAAQAB/+E8Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL2pwZWc8L2RjOmZvcm1hdD4KICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5sb2dvX2VuZXJlc2k8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICA8L2RjOnRpdGxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBHSW1nPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvZy9pbWcvIj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNS0wNi0xMVQxMjowMzowMSswMjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTUtMDYtMTFUMTA6MDM6MDhaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMDYtMTFUMTI6MDM6MDErMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIENTNiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOlRodW1ibmFpbHM+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6d2lkdGg+MjU2PC94bXBHSW1nOndpZHRoPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpoZWlnaHQ+Njg8L3htcEdJbWc6aGVpZ2h0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpmb3JtYXQ+SlBFRzwveG1wR0ltZzpmb3JtYXQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmltYWdlPi85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83UUFzVUdodmRHOXphRzl3SURNdU1BQTRRa2xOQSswQUFBQUFBQkFBU0FBQUFBRUEmI3hBO0FRQklBQUFBQVFBQi8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFCZ1FFQkFVRUJnVUZCZ2tHQlFZSkN3Z0dCZ2dMREFvS0N3b0smI3hBO0RCQU1EQXdNREF3UURBNFBFQThPREJNVEZCUVRFeHdiR3hzY0h4OGZIeDhmSHg4Zkh3RUhCd2NOREEwWUVCQVlHaFVSRlJvZkh4OGYmI3hBO0h4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zi84QUFFUWdBUkFFQUF3RVImI3hBO0FBSVJBUU1SQWYvRUFhSUFBQUFIQVFFQkFRRUFBQUFBQUFBQUFBUUZBd0lHQVFBSENBa0tDd0VBQWdJREFRRUJBUUVBQUFBQUFBQUEmI3hBO0FRQUNBd1FGQmdjSUNRb0xFQUFDQVFNREFnUUNCZ2NEQkFJR0FuTUJBZ01SQkFBRklSSXhRVkVHRTJFaWNZRVVNcEdoQnhXeFFpUEImI3hBO1V0SGhNeFppOENSeWd2RWxRelJUa3FLeVkzUENOVVFuazZPek5oZFVaSFREMHVJSUpvTUpDaGdaaEpSRlJxUzBWdE5WS0JyeTQvUEUmI3hBOzFPVDBaWFdGbGFXMXhkWGw5V1oyaHBhbXRzYlc1dlkzUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8rQ2s1U1ZscGVZbVomI3hBO3FibkoyZW41S2pwS1dtcDZpcHFxdXNyYTZ2b1JBQUlDQVFJREJRVUVCUVlFQ0FNRGJRRUFBaEVEQkNFU01VRUZVUk5oSWdaeGdaRXkmI3hBO29iSHdGTUhSNFNOQ0ZWSmljdkV6SkRSRGdoYVNVeVdpWTdMQ0IzUFNOZUpFZ3hkVWt3Z0pDaGdaSmpaRkdpZGtkRlUzOHFPend5Z3AmI3hBOzArUHpoSlNrdE1UVTVQUmxkWVdWcGJYRjFlWDFSbFptZG9hV3ByYkcxdWIyUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8mI3hBOytEbEpXV2w1aVptcHVjblo2ZmtxT2twYWFucUttcXE2eXRycSt2L2FBQXdEQVFBQ0VRTVJBRDhBOVU0cTdGWFlxN0ZYWXE3RlhZcTcmI3hBO0ZYWXE3RlZrODhOdkM4OHppT0tNY25kdWdBd3hpU2FER2N4RVdkZ0dEYWw1MzFLK3VSYWFOR1l3NTRvOU9Vci9BQ0hSYzJ1UFJSaUwmI3hBO204L243VnlaSmNPSWZyY1BKZm1TK1gxTCs5QVp0K0VqdklSODZmRDl4eC9PWW8vU0Yva3pQazNuTDdiUzNVUEtHdTZhcG5RZXRHdTUmI3hBO2tnSjVBZTQyYjdzdXg2dkhQYmw3M0Z6ZG01c1c0M0hrbWZrelVmTWx4ZXJHWkhuc0UybmFiNGd1MndESGV2dGxHc3g0aEcrVW5MN00mI3hBO3paNVRxN2gxdG5lYXA2RjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFZSdkwyenNiV1M3dlo0N1cxaEhLYTQmI3hBO21kWTQwWHhaMklVRDU0cWtHbS9tWitYT3FhZ3VuYWQ1bzBxOHZuWUpGYlFYc0VqeU13cUJHRmM4ei9xMXhWa3VLdXhWMktzZXZ2ekUmI3hBOzhoV056RmEzZm1IVG9ycWFkYldLMyt0UkdVek8zQUp3REZxOHRqdHQzeFdrUnJublR5Zm9FaXhhNXJ1bjZWSzY4MGp2YnFHM2RsOFYmI3hBO1dSbEo2ZHNWUmVqYS9vV3QyaHZORjFHMTFPMERGRGNXYzBkeEh5SFZlY2JNdFJpcU94VjJLc0svTVhVSkZXMnNFTkVjR1dVZU5EUlImI3hBOyt2Tm4yZGpHOG5ROXRaaUJHQTY3cVA1YjI4TFhGN093QmxpV05ZejRCeTNML2lJeVhhTWpRRFgySkFHVWoxRmZwWjNtcWVpZGlyZ0EmI3hBO09ncFhjNHE3RlVoMXp6LzVIMEZaanJHdldGaTF2dE5GTmNSTElwTzRIcDh1WlBzQlhGVlhWL08za3pSVEFOWTE3VHROTnlnbHRoZVgmI3hBO2NFSHFSbm82ZW82OGw5eGlxY0k2U0lza2JCMGNCa2RUVUVIY0VFWXEzaXJzVlN6WFBOUGxuUUlrbDEzVnJQU281SyttMTdjUlc0YW4mI3hBO1hqNmpMeStqRlZQeS93Q2IvS25tT0pwZEExaXkxVlVDdEw5VG5qbUtjaFVlb3FNU2g5bXBpcWI0cTdGWFlxd1h6UitlUDVVK1Y5U2YmI3hBO1ROYTh3d1E2aEZVVFcwTWM5MDhaRzVXUVcwYzNBaW00YWh4Vk12SmY1b2VRdk8zcmp5eHJFT295V3loNTRRc2tVcXF4b0dNY3l4dlMmI3hBO3UxYVlxeWpGWFlxb1h0L1kyRnM5MWZYRVZyYkpUblBPNnhvdFRRVlppQU1WU3pTZk8zbERXZFVuMHJTTlpzOVIxQzJpRTl4YjJrNlQmI3hBO01rWmJoVnZUTEFmRjFIVWJlSXhWOGorY2Z6UDh1Zm1SK2NYMUx6bHJMYWIrV2VpelMvVjdWQk1WdXZRUEFNd2dWM0xUdnZ5b09NZXcmI3hBO28yNVVwOStjZm1EL0FKeGMxZnlCZFczbGxySzI4eFdhSzJqdnAxaFBiU3RJcEE0U1NlakdySXkxcjZqZTQrTEZYckgvQURpOTU0MXomI3hBO3pkK1ZzVnhyVXJYTjdwZDNKcHYxeVFreVRSeFJ4eUk4akg3VEJadUJicWFWTzlUaWg2NWlyc1ZmQi84QXprSjVRdDlGL1BaN0h5MmkmI3hBO1dENm05bmRXa2NYN3RJYm00SVdxVSt6V1ZlZTNTdTJLWDBsYS93RE9MWDVWdnBqUmE1YjNXdDYzT2hON3I5emQzSXVwWjJIeFNnTEomI3hBO3dIeGJxQ0cveXVYZFczaVAvT1AwT3ArU2YrY2tML3lYYlhiUzZlOGwvWVhOZGhOSGFwSk5CS3lkQS83c2ZLckR2aXI3TXhRN0ZXRS8mI3hBO21McDhyZlZyOUZyR2dNVXBIN05UVmZ2cWMyZloyUWJ4ZEQyMWhKNFpqbHlZNzVkMXlUUjc4VDhTOERqaFBHT3BYclVlNHpOMUdEeEkmI3hBOzExZFhvdFdjRTc2SG05TDA3V2ROMUdNUGFUcklTS21PdEhIelU3NXBNbUdVT1llcnc2bkhsRnhObzNLbTkyS3V4VjhXL3dET1pubGYmI3hBO1NkTDgrYVpxMWhBbHZMck5vNzN5eGppSko0WkNETWFmdE9ycUc4YVY2MXhWbmN2L0FEaURZK1pORjA3VnIvemJmdjVqdklZcHRSdTUmI3hBOzQwdVlXNUlwV09HTW1LUkZSUGdXc2hHM1FEYkZKZlJIbC9SclhROUIwM1JiUXMxcHBkckJaVzdTR3JtTzNqV0pDeEZOK0s3NG9SK0smI3hBO3NVL05QejFCNUY4aWFyNW1rUlpaYk9NTFoyN21nbHVKV0VjS0hjRWptd0xVMzRnbkZYeTErVDNtbjhvOVIxTFV2T241d2EzSHFmbW0mI3hBOzVuTWRwWVg5dlBkUVJRcW9JazRMRkpFYWxpcUowUUxzTjlsS0IvTnJ6NStXK2grZjlDODMvazdkcGI2aENIL1M5dmFXOHRyYU54S2MmI3hBO0FZM1NKU0psWmxrVkJUWUg3VytLdnRiVDd4YjJ3dHJ4VU1hM01TVENOdG1VU0tHb2EwM0ZjVUlqRlV0OHovcGIvRFdyZm9mL0FJNi8mI3hBOzFPNC9SM1QvQUhwOUp2UjYvd0NYVEZYeUgveml0K1pua255bnJPdFdQbTFoWWF0cXNpZWpyZDBLZ0ZTd2tnbWxiNG9xdTNJc2RqKzAmI3hBO1JRWXBmUm5sL3dES1R5L3BINW1YWDVnK1g3bU8xdHRYMDgyOTVwbHZFdjFlWjVIU1g2ekhJckJWNSttcElDN21yVitJNHE5Q3hRN0YmI3hBO1VwODJlV05LODArVzlROHY2dEVKYkRVWVRES3BGU3ArMGpyL0FKVWJnT3A3RURGWHlqL3poUkdZL1BmbUtNN2xOT0NtblNvdUVHS1UmI3hBO3IvNXhJdmRHc1B6SzFMUU5mZ2hGenFGcThGcWwwaU1mclZ2S0dNUTVBMFlyeitmSDVZcSt4LzhBRG5sNy9xMTJuL0lpTC9tbkZGb3kmI3hBOzJpdFlZaERhb2tjTVpLaU9JQlZVMXFSUmRoMXhWVnhWMkt2alQvbkl6LzFwUFJQKzNWL3lmT0tYMlhpaDhmOEFrZjhBOWJRMUQvbVAmI3hBOzFUL3FGbXhTK3dNVU94VlN1dnF2MWFUNjF3K3I4VDZ2cVU0OGZldTJTamQ3YzJHVGg0VHhmVDV2TGZNSTh2aTUvd0J4QmtLMVBxY3YmI3hBOzd2OEEyRmZpKy9ON3AvRXIxdkk2M3dPTDkxZjZQaDFRVVduNmpJb2todHBuWHFyb2pFZlFRTXRPU0kySkRqeHc1RHVJbjVNLzhtYVgmI3hBO3E5ckM5eHFFMGdFb0FqdFpHSjRnR3ZJZ25ZKzJhaldaWVNOUkh4ZWs3TTArV0FNcGs3OUdTNWhPMWRpcjVFLzV6Zy81U0h5dC93QXcmI3hBO2x6L3lkVEZYMVY1Yy93Q1VlMHYvQUpoSVArVFM0cVV4eFYyS3ZFUCtjd3JHOHVmeWZhYTNVbUt5MUsxbnV5T2dpSWVFRSszcVNwaXEmI3hBO2wvemlsZCtWTmQvS2F6c2paMnN1cDZMTlBiYWdza1ViU2Z2Wm5uaWMxQmJpeVNVQjhWUGhpbDdJTkM4dnduMWhwMXBHWS9qOVQwWTEmI3hBOzQ4ZCtWYWJVeFFtR0t1eFZKZk9mbTdTZktIbG05OHg2djZuNk9zQWpUK2l2T1Nra2l4THhVbGEvRTQ3NHE4cy9OSC9uSFB5UCtaTm4mI3hBOy9pWHk5TW1sYTVxRVF1NGRRaEJOcmVlcWdkR25pRktjNmcrb254YjFJYnBpcnpUL0FKeFU4NCtiTkIvTUxVUHl4MWwza3MwK3RJdG8mI3hBOzdCeGFYbG14OVgwMjMrQmdyQWhkcTBJNzFVdnJqRkRzVmRpcjQvOEErY0wvQVB5WVhtZi9BSmdEL3dCUktZcFpuK2RQL09MTjE1aDgmI3hBO3d6ZWJmSTk1RnArcjNNbjFtOXNabWFKSHVLOGpQRE1nWXBJemJrRVU1YjhoaXFqNWY4cS84NWtTcEhwZDc1a3RkT3NRdkI3KzQrcVgmI3hBO002cDBQRjBpa2xkNmRDelYvd0FvWXE5dS9MM3lKcDNrbnk2dWtXbHhOZXp5eXZkNm5xVnl4ZWU3dkpxZXJQSVNUdTNFYlY2QWJrMUomI3hBO1VNbHhWWmNHY1FTRzNDbTQ0dDZJa0pDRjZmRHlJQklGZXRCaXI1ajgvd0QvQURqOStkM25MejZubks0dmZMbG5lVzVnK3FXOFU5NjAmI3hBO2FDMlBLTU1XdGF0OFc1eFY5QVcwbm43L0FBcTczVnZwWCtMQXBFY01VOXoramkzS2lreU5GNndISGNqZ2Q5cTk4VmVBYVQrUVg1NTYmI3hBO2IrYWIvbVBGZmVXMzFhUzZ1THFTMWFhK0Z1UmRLOGNrWUF0dVZBa2hDbXRlaDN4VjlMMkJ2ellXeDFCSWt2ekVodTB0Mlo0Vm00ajEmI3hBO0JHenFqTWdhdkVsUWFkaGlxdVNBQ1NhQWRUaXJ5M3pONWp1Tld1bVZXSzJNYkVReGRBYWZ0c1BFL2htKzAybkdNZjBua05kclpacFUmI3hBO1BvSEw5YkpQS2ZsRzJpdDQ3Ky9qRXR4SUE4VVRDcW9wM0JJN3Qrck1IVjZzazhNZVR0ZXp1em94aUp6RnlQMk11QXBzTTE3dW5ZcTcmI3hBO0ZYWXErYi96ci9Jdjg0ZnpOOHdXOTlMY2VYN0d4MDVKSU5QaFc0dkRJWTNmbHpsUDFVam1hRFliRDhjVmV5ZmwvYi9tTlo2ZEZZZWImI3hBOzR0SXBhVzhVTnZjNlZOY3lOSTBZNGt5Unp3eEJQaEEreXgzeFZsbUt1eFZBNjdvbW1hN28xN28ycVFDNDAvVUlYdDdxRnYya2NVTkQmI3hBOzFCSFVFYmc3akZYeXRkZjg0eC9uRDVHOHluVmZ5ejF4Wm9DU0lYTW90cmtSazE5TzRqY0czbFViZDZFNzhCaWxuR2wvbFgrZTNuYU8mI3hBO096L05iek5GRDVaRGlTNjBUVGhFazEzd1lFUlRTVzhjU3JHYVYrMjN5Qm93VmUrUXd4UVF4d1FvSTRZbENSeHFLQlZVVUFBOEFNVUwmI3hBOzhWU1B6ejVUcy9OM2xIVlBMZDVLMEVHcHdHRXpvQVdqYW9aSEFPeDR1b05PK0t2SmZLUDVaLzhBT1Eza3JTVzh2YUQ1cDBTKzBTTUYmI3hBO0xHVFVvTGoxN1pXYXBNU29yRDVLN3NveFN5SDhvZnlHc2ZJdXEzL21UVk5UZlh2TnVxY3pkNmxJbnBvaG1mMUp2VFVseVdrZjdUc2EmI3hBO25zRnFRVkQxWEZYWXFrdm01dk9ZMG1ubENQVG4xWm5wWFZwSjQ3ZEl5clZZZWdrcnN3Zmo4T3dwWGZGWGdQNVEva0orZFA1YmVaYmomI3hBO1diUzY4dmFndDdBYmE3dDVybTlXcXRJc25OV1cxMmNGTzlSUW5GWDB4aXJzVmRpcnNWZGlyc1ZkaXJzVmRpcXllTDFZSklxMDlSV1cmI3hBO3ZoVVV3eE5HMk00MkNIalZ6YnpXMDhrRXlsSlltS3VwOFJuU3hrSkN3OE5rZ1lTTVR6RDByUy9PT2kzVnNobW5XMm5BQWtpaytFQS8mI3hBOzVKNkVacE11am5FN0N3OVZwKzBzVTQ3bmhQbTNmZWRkQnRSOE14dVgva2hITC9oalJmeHhob3NrdWxlOU9YdFRERHJ4ZTVQRWNPaXUmI3hBO0FRR0FJQjJPL2ptS1E1NE5odkFsMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjImI3hBO0t1eFYyS3V4VjJLcGJxM2wzU3RVbzExRis5QW9Ka1BGNmZQdjlPWDR0UlBIeUxpNmpSWTgzMURmdlNRL2x6cHZPb3VwZ244cDRFL2YmI3hBO1QrR1pQOG95N2c0SDhpWTcrby9ZbW1tK1VkRTA5MWxqaE1zeS9aa21QTWcrSUd5MStqS01tcnlUMkoyY3ZCMmRoeG13TFBtbk9Zem4mI3hBO094VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3NBL0x2OEFOSzY4NlhpbUxRTG15MGU0dFpMeXkxVngmI3hBO09ZbUVjNGhFVWpTVzhNUWxkVzVnUlN5Q2xkNmc0cElYNkgrYVA2VS9NRzk4b0hUa3RXczJ1VjlXYTRaTGgxdHlvV1ZMZDRVV1NPVXMmI3hBO2FHT1ZpS2ZFQml0SURYUHpkMVRSOWI4dzIwMmd4UzZSNVp1Tk9pMUsranZtOWN3Nm1RSTVZN1kyd1Zpbkw0ME1vOWljSzBtdm4vOEEmI3hBO01pWHl4cU5ocE9uNlJMcldyWDhGemRwYVJldUtSV3FyL3dBczl2ZHVXa2R3cS9CeEhWbVVkUXRJdlgvUE11bDZQNWZ1bzlNZHRROHgmI3hBOzNWclpXbW4zVG0xOUthNmlhWXJjUHdsS2Vtc2JjaHdKcnRURlVxODgrWmRZai9LaTUxeTcwMjYwcTk0Uk5lV0VGOExhNmdIcnFqZWwmI3hBO2RSeFRDdlEvWUZWTk5zVlRuOHdQT2plVTlMdHJ5TzFpdlpycTVGc2tFdHg5WDZ4dkpWYVJ6eVNOV01LRWpqWnQ2MG9DY1ZER2ZPL20mI3hBO2lUWC9BTWhyenpacDBsMXBWeFBwWTFHMWEydUpZWm9aZUhMajZzSmpMQlRVZUI4TUtwMytaV3MzR2xyNWFLTE9ZYnpYOU9zNW50cnMmI3hBOzJqajE1Z2lod0lwaE5FVC9BSGtaS2NoM3dLRkQ4eXZ6TlBrcVN3VDlIcGNyZkxLMzFtNXVIdExkWGpNWVNFekxEY0lqeStvU3BsNEomI3hBOzhKcTR4VUJTL01qelI1djBiekg1T3N0Q2p0bnQ5WHYzdHJ4TGlVeGVvRmdlUVJraUM0S0w4UExtdTlSU2xEVUtoVy9NL3dETXVUeVImI3hBO2IyMHlhZEhxUHJRM2R4SWpYUWdkVXM0eElRa1N4WEVzaFlFL0VFNEpTcnNvcGlvQ004NitmVjh0ZVY3VFgxc211b2JxV0JHRE5JcVEmI3hBO1J6b1hNMHpReFhNZ1JBUGk0eHRpdEp0NVMxNCtZUExXbTYwWW80RHFFQ1RtR0taTGxFTERkVm1RQlhwNDBIeXhRbGZuSHpicmVpNngmI3hBO29PbDZWcE1HcHphOU5QYnh0UGVOYUxGSkJidmMvRnh0N21xbEltMzZqd09LcE4rWFA1cjNYbSs5c29KOUdYVFl0UzBvNnhaU0xkZlcmI3hBO0dNYVhIMVo0NVY5R0hnM1BkYU0xVjhEdGlraEw3anozcWQ1K2FzZHBhYWRxZHpvK2ozYTZSY0cwK3NpM0Z6Y3dpU1c2dVVqdDJoa2kmI3hBO2hWNDFIcVhDOGFsd3AySUtvZjhBT3p6cnFVZWsrWTlCME9PV08rMGpTRjFhNzFXSyttc1pMYjFKR2poRVhvS1dtZWlNeFZtVmFVcWEmI3hBOzRoUXlIelpxMTNhZVcvS2MxYmh4ZWFubzl2Y3pXOTIxcktQck1zY2ZKejZjM3JJWFllcEdTdkphL0ZnVkhlY3ZPOTlvbXFhZG8rbGEmI3hBO1QrbU5YMUszdmJ1RzJhNEZxcGpzSTFkbFZ6SEx5a2thUlZSYVU3c1FNVlY5ZjgzM0dtcm9WdEJwL3JhejVnbTlDMHNMaWIwRmpLMjcmI3hBOzNFeG1tVkpnb2lTTWc4VllrOUs0cWdyYjh4MHV2eSt2dk5sdHBzczl4WWZXWXB0SmlibklibTBtYUI0MWRWUElGa3FHVlNlUDdOZHMmI3hBO1ZwR2ZsOTUwWHpmb2N1cXBGQkVpWE10c24xYTRhNVJoSFNqRXZGYlN4c2VXNlNScXcra1lvS2VhaGZmVklveUU5U1NhVklZa3J4QmQmI3hBO3p0VnFHZytqTE1jT0krNXF6WmVBRHFTYVF1aXpTSlpYVFhETWZSbm1CQmRwYUtoNkJuK0lnWlBNQVpDdW9IazA2YVJFWmNYU1I2MnYmI3hBOzBuVnByNG5uYXZBaGpTV09ROHlwRDErR3JJZzVEMnFQZkJseENIVzA2ZlVISnpqVzEvalliL05SdDlkbGt2QkJMYkxIRzF4SmFySXMmI3hBO2hZODQxTFY0OEYySUhqa3BZQUkyRDB0aERWa3lvamJpTWVmVWI5eXM5M2ZqWEV0VVZEYW1BeU5WaUdxSEFxQndQajBya1JDUGgzMXQmI3hBO3NPU2ZpOElyaHI4ZEZ0N3JSdGIrTzE5RU9ydEVyT0grSUdaeWdQQUJ0Z2U3RWUyR0dIaWpkOS8ySXk2bmdtSTEzZGU4MXkvWFMrOUwmI3hBO3JxMm5jWGNDUXlxNkJtQ3NCR1NLclhpZC9iQkQ2SmZCT1d4a2g4ZnVVNzNXM2d2V3RZclY3Z3hyRzh4UU9TQkl4QTRoVVlHZ0JPNUcmI3hBO0dHRzQyVFRITHF1R2ZDSWsxVi9INGZxWDZ2cS82UE1WWWd3a0RIMUhZb2dLMG9wWUs0QmF1M0tnOThHTER4c3RScVBEcmJuOG1KZVEmI3hBO2YrVlcvcEQvQUoxUDFmVTQzWDFUbjlmK3FjUFdYNjM5USt0ZjZOeDlYajZuMWJicFhLWEtYK1h2K1ZZLzR2bC9SZnJmcDM2eHFYcCsmI3hBO3Y5ZjlENng2dy9TWDFUNnovb3ZQMWY3MzBQMVlxd2ovQUoxWC9sYzNuVC9GM0w2ajlZMFA2clg2OTlTK3Nla1BxMzFyMHY4QVEvdDgmI3hBO2FmV051WDJjS3ZRZlAzK0F2cm1qL3dDSlBySDZUNVhINkYvUi93QmYrdS8zWSt0ZWwramY5STRlblQxUDJlbGNDSGVhL3dEbFhIK0QmI3hBOzlOL1RmRC9EM08xL1EzMWY2eHo5WGovb24xVDZwKy81OGZzZW52aWxENjkveXJiL0FKVnJKK2xmckgrRGYrUG5qK2tQVzVldjhmcismI3hBO2wvcG5QNnhYMU9meGNxODk4VlZQUFgvS3ZmcUdpLzRvK3NVOVJ2MFA2ZjZRK3U4L3F6K3IvdkwvQUtWVDZ2ejlYbnRUN2VLb0NiL2wmI3hBO1UvOEF5cCtQbjlZLzVWejZIdzhmMG55K3JlcWZ0Y2Y5TTlMbDQvRHhwK3pUQ3FQODcvNEIvUW1oZjRuK3ZmVXZybHAraHVQNlQrc2YmI3hBO1hkdnF2UDZ2L3BIcmN1bnE3OHV2eFlGVXZ6QS81VnIra1l2OFYvV1ByUDFHYm42SDZSOUw2aDZpZXY4QVd2cWY3cjBlZkhsNjN3NHEmI3hBO2pmekUvd0FEZlZ0Si93QVZldnordkwraHZxWDEzNjU5YzlONmVoK2p2OUpyNmZPdE52SHRpaEsvelA4QStWVS9XYlQvQUJ0Nm4xbjYmI3hBO3BlZWw5WCt2OC9xTkUrdCt2OVEzOUQ3UEwxZmgvSEZJUnV0LzRFL3c1NWQrdi9wRDlIK3ZGL2gvNnY4QXBYNjk2MzFXYmhUNnQvcHQmI3hBO2ZxM3E4dlU3VjVZcW4vbFgvRC8rSE5PL3c3NmY2RDlCUDBmNlZlUHBVMisxOGZMK2JsOFZhOHQ2NG9TUHp2OEE0SC9UbWcvNGcrdi8mI3hBO0FLVjV6L29MNmorbEsrcDZMZXR4L1IvdzgvUjUvYTM0MTdWeFN4Lzh2ZjhBbFRQNlkwZi9BQWY5ZCt1L28yYjlFOHYwejZQNk85WnYmI3hBO1UvM3EvY2VuNi9UbisxU243T0ZVeW4vNVZYL2oyNHI2ditKUHJOcDlmOUg2L3dEVS9ybkQvUlByUHAvNkQ2L0ducCtyOFhTbTlNQ28mI3hBO1g4enYrVlAvQUtSay93QVordDllL1JqZlcvcW42UzVmb3YxdC9yWDZPMjlEMXZzK3J0eXJUQ3FaZWFQK1ZmZjRQMFg5TmZYdjBIOWEmI3hBO3N2MFA2UDZVK3MvV2EvNkZYNnQvcGZMbFRqNm43Zkg5cmpnVkVlZnY4Q2V0cFA4QWlYMS9yM3FTL29iNmo5ZSt1OHVBOWYwZjBkL3AmI3hBO0hIaFRuK3pUcmlxenpQOEE4cTUvdzlvWDZVcitqUFZ0L3dERG4xSDYxOVk5WDBqNkgxUDZqL3BOZlJyOWo5bnJ0aXFHaC81VmQveXEmI3hBOzMvUi8rVUY0YitqOWM5U3YxamV2RC9UUFYrc2ZhL2I1ZGNWVHJ5VC9BSVUvUmx6L0FJYjUraDlibCt2ZXY5WitzZlhOdlYrc2ZXLzkmI3hBO0k5VDdOZlUzcFR0aWhOdFYvUi8xVC9UL0FPNTVyeHB5NWM2L0R3NGZIeXIwNDVaaTRyOVBOcHo4SEQ2K1g0N3QxTFMvMFg2Rng5VTUmI3hBOytsNmpmV1BWOVgrOHA4ZGZXMytlU3k4ZGkvMGZvWVlQRG84UEs5N3ZuMTVyZEkvUkZEOVE1Y2VJNGMvVnA2ZGR2VDlYOWl2OG0yT1gmI3hBO2ovaS9SOXRJMC9oL3dmcDVlVjlQZHNoWS93RERuMXFQaDZ2ci9XMzRWK3MwK3MwK1ByOFBUclhhbVdIeEs2VncrWEpxSGdjUTUzeGYmI3hBOzB2cTYvamtqN2o5SGZwTzM5VGw5ZjRONlBEMVA3dW81YytIdzhhMCszdFhLbzhYQ2ErbjRmajVOOCtEeEJmMTlPZkx6cnA3MEhxUCsmI3hBO0gvcnpmV3ZVK3RWaDUrbjY5T1hMOXpYMHZoNWN2czk4c3grSnc3Y3QrNzQ4Mm5ONFBINnI0dHY1MytieTY5M1ZHWGYxRDYvWit2eismI3hBO3RWZjZyeDlUalhqOFZlSHdkUDVzcmh4Y0pybDE1TitUZzQ0MzlYVG4vWjgxSysvUTMxNWZySEw2endITGg2dFBUNWJlcjZmdzhlWDgmI3hBOysyU2h4OE8zTDRmWit4aGw4TGo5WDFWNTh2T3VudmRxbjZJOVZmcjNQbDZiMTQrcng5S281OC9UK0hqMHJ5d1l1T3ZUK2hjL2gzNismI3hBOzd6NWRicnA3My8vWjwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyI+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06UmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC94bXBNTTpSZW5kaXRpb25DbGFzcz4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+dXVpZDplZTM5NjdiOC1mMTM4LTQ3NGMtYTAxYy0xZWNhYWU4MTE5MDE8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6QzM3QzJDM0I0NTIwNjgxMTgyMkFFQ0VBQjNEQTA5MDI8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6cmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC9zdFJlZjpyZW5kaXRpb25DbGFzcz4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOkMzN0MyQzNCNDUyMDY4MTE4MjJBRUNFQUIzREEwOTAyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTAzLTIzVDEyOjQzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjA0ODAxMTc0MDcyMDY4MTE4M0QxQTEyNUE5N0JFOTE2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA2LTExVDEyOjAzOjAxKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iPgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+UHJpbnQ8L2lsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgbGlicmFyeSAxMC4wMTwvcGRmOlByb2R1Y2VyPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgBigXEAwERAAIRAQMRAf/EAOUAAQACAgMBAQEAAAAAAAAAAAAICgcJBAUGAwIBAQEAAgMBAQEAAAAAAAAAAAAAAgMBBQYHBAgQAAAGAQIDBAQFCREKCwMNAAABAgMEBQYRByESCDFBEwlRYSIUcTIjsxWBQmJ1lRY2NxmRodFygpLSM7RVtdV2F1d3OFJDcyQ0xYYYSFixwbJTY4NUdJTUtiU1JvCiwpOj02TERYVGVpYRAQABAgIGBgUICAYDAQEBAAABAgMRBCExURIFBkFhcYGRsaHB0SIT8OEyQlJyFAdikrLCIzM0FvGCotIVNUNTJOJjRP/aAAwDAQACEQMRAD8A3+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+brrTDa3n3UMstlzOOrUSUpIu0zM+BDNNM1ThGtGquKIxqnCIY5ud3dv6TmQ9ftTn06/4vAI5JmZdpc6CNsvqqIbWxwTN3tVGEdej5/Q5/Oc18Ny2ibsVTsp970xo9LF9r1JVyOZNJjUiTr8V6a8hnT1mhsndf1xDb2eVa5/mXIjsjHzw8nNZn8w7UaLNmZ66piPRG95sfWHUFnUvmKG3XVafrDZYU4svhN5ayP9aNna5ZytP0t6rtn2YNFf584hc+hFFHZGM/6pnyeMm7qbhz9fHyua3r2+7GiN8wlHpH3W+D5OjVbjv0+eLT3uZ+JXfpX6u7Cn9mIeak5Lkc3U5l/ZSzVqSvGlPOa83b8ZR9o+ujKWaPo0Ux2RDXXOI5q59O7XPbVM+t07jrjqud1xTq+zmWZqP80xfERGp8lVU1TjM4vwMsOWxPnRdPdZr8bTXTwnFI017fimQhVbpq1xEraL9y39GqY7JmHooee5tAMvdcrtUJLsbVKdWj9atSk/nD5a+G5avXbp8Iffa45n7X0b9f60zHhL2ldvruJBNPjWEa1Qk9SRLjN9noM2fCUf5o+C7y7k69VM09kz68W4y/O3E7WuuK/vUx+7uyyLU9SStUovcZIy+vkwHtPzGnS/8ApjV3+Vf/AF3O6Y9cex0GV/MPov2e+mfVP+5lSl3n2+uTSj6Y+iX1/wB5sUGxp8LntNF+vGmzHAc3Z+rvR+jp9Gv0OmyfN/Dczo+JuTsrjd9P0fSydHkx5bSJEV9uSw4WrbzSiWhRepSTMjGpqommcJjCXSW7lNyN6mYmNsaX2EUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHg8p3Kw/EOdu0tEuzkf8A6XEInpGvoNJGRI/VmQ2OT4TmM1pop0bZ0R8/di0fE+Yslw/GLteNX2adNXh0d8wjxkfURfTOdnGq1mmZPgmZI0kSPUZJMibT8Bkr4R1GV5XtUabtU1TsjRHt8nA8Q5+zFzGMvRFEbZ96r/bHhLB9zkt/kLvjXdxKs1EeqEvuKUhP6RHxU/UIh0FjKWrEYW6Yjshxmc4jmc3ON65VV2zo7o1R3OkH0PjAAAAAAAAAAAAAAB29Rf3dA/7xS2sqsd1I1HHdUglady0keii9RkYov5a1fjC5TFUdcPqymev5Sres11Uz1Th47e9nLGuoe/gm2xk1ezdRy0JUxgijyS9JmRF4avgJKfhHPZvli1Xps1TTOydMe3zdrw7n7MWsKczTFcbY92r/AGz4R2pIYpuDiuZo0pbEjmJTzu1j5eFJQXefIZ+0Rd5pMy9Y5XO8Mv5Sf4lOjbGmPl2vQuF8eynEo/g1+99mdFUd3T2xjD2o+BuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeJzDcDGcJj89xN5pi080aqY0XJc9BkjUiSX2SjIvqjYZHhl/OT7kaOmZ1R8uppuLcdyvDacbtXvdFMaap7ujtnCES8x3syvJjei1zp47Ur1SUaKo/HWn/pH+CuPoTyl3HqO0yPAMvl8Jq9+rbOruj24vLeL85ZzO4025+HRsp+lPbVr8MI7WHDMzMzM9TPiZmN65F/AAAAAAAAAAAAAAAAAAAAAHIiy5MGSzMhSHIsqMsnGJDSjQtCi7DSouJGI10U10zTVGMSnau12qoromYqjVMa4bDNtsnfy7Dqm5l6e/qStieaSIiU8yo0GsiLgXORErTu1HmPFcpGVzFVunVrjsn2anvfL3EquIZKi9X9LVPbGjHv1973Q1zdgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/KlJQlS1qJCEEZqUZ6ERF2mZhEYsTMRGMozbjb7NxTfpsJcQ/ILVEnIDIlNoPvKOk+Cj+yMtPQR9o63hfLs1YXMxojop9vsec8wc7RRjZyc4z019Efd29urZjrRUlS5U6Q9MmyHJcqQo1vyXlGta1H3qUrUzMdlRRTREU0xhEdDzC7dru1TXXMzVOuZ0zLjiSAAAHbwLtAZHx3afOclSh6JTqgw1kRpnTz93bMj7DSSi51EfpSkyGqzXGsrl9FVWM7I0/N6XQ8P5X4hnYxpt7tO2r3Y9s90SzLT9NrJEhd/kq1mfx41e0SdPgdd5tf/qxor/NU/8Ait98z6o9rrsp+XlOu/e7qY/en/ayDA2K27h8vjVsmyUnsXKlOFqeuvEmTaI/zBrLnMWcr1VRHZEevFvrHJPDLeuiau2qf3d16Vja/b6OWjeJwFcNPlUG784ah8tXF83VruVeXk2FHLXDaNVinvjHzxH9sNv5BaOYnXpLTT5Nvwu31tmkYp4vm6dVyrz82a+W+G167FHdGHk8zYbE7dzSV4FfKq1K19uJJcPQz7yJ7xUl+ZoPstcxZyjXVFXbEerBrb/JPDLv0aaqPu1T+9vMa3XTc8lK3MeyNLqvrIlg0aP/ALZrm/5A2tjmqNV2jvifVPtc7nPy9qiMcvdx6qo/ej/awpke3OZYsTjttSPpht6mdgxo+wRF3qW3qSdfstBv8rxTLZnRRXGOydE+E+px3EOX89kcZu253ftR71PjGrvweIGwaYAAAAAAHJhw5VhKjwYMdcqZKWTUaM0RqWtaj0IiIhC5cpt0zVVOEQss2a71cUURM1TOERHS2K4FjJ4jidRROKSuTGbNc5xPEjfdUbjmh95EauUj9BDy/iWb/FZiq5GqdXZGiHv/AAPh3/H5O3YnXEafvTpn2PYD4W2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHxkyGIcd+XKeRHjRm1OyH3DJKEIQXMpSjPgRERamJU0zXMUxGMyhcuU26ZqqnCIjGZnoiELN0935WVOPUmPOuQ8bT7L7vFDs0y7TV3pb9Ce/tV6C73g/A6ctEXLum56Kfn6/B49zNzXXn5mzYmYs9PRNfbsp6unp2RgodE4oAAABkLBttchzp/WC2UKpaVyyrl8j8JJ96UFwNxXqL6pkNZxHitnJR72mropjX80N9wXl3M8Uq9yN2iNdU6u7bPVHfMJiYftXiWHIbdjQisbROhqt5hJcdJRf82WnK3x7OUtfSZjhs9xjMZucJnCnZGrv2vWuE8s5Ph0RNNO9X9qrTPd0U92nrlkgap0IAAAAAAAB28D7AGKct2dw7KSdfRDKjtF6mVhBSSCUo+9xr4ivXwI/WNzkuO5nLaMd6nZPqnX8tTmOK8pZHPY1RTuV/ap0eNOqfRPWipmu1GU4X4kl+P8ASlOjiVvEI1ISX/So+M38J+z6FGOyyHGbGb0RO7Vsn1bfPqeYcY5XzfDcapjet/ap1f5o10+XWxkNs5wAAHd0GO3GT2LNVSQlzJbvEyTwQ2nXitxR8EpL0mPnzOat5aia7k4R8tT7MjkL+euxas071U+jrmeiE3duNq6rBWEzHzRZZG8jSTZGXsNErtbYI+JF3GrtV6i4Dz/ivGLmdndjRR0Rt65+Wj0vZuXuWbPC6d+feuzGmrZ1U9XXrnq1MrDTOnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADs4n2AIXbyboryKW7jNFJNNBCXyzpDZ8JrqT9JdraDLh3Gftf3I73gXCIsUxeuR786v0Y9s+jVteP83cyznK5y1if4VM6Zj68/wC2OjbOnYwEOkcMAAAAy/tVtg/nM1U+w542NwHCKU6WqVSHC4+C2fdw+MfcXrPhpOM8XjJ07tOm5Orq659Tq+WOW6uJ3N+5os0zp/Sn7MeuehOWFBh1sSPAgRm4cOKgm48ZpJJQhJdxEQ88uXKrlU1VTjM9L2mzZos0RRbiIpjVEaocoQWgAAAAAAAAAAAP4pKVpUlSSUlRGSkmWpGR9pGQRODExjolH3Ptiay7N60xM2qa0Vqt2uMtIjx/YkRfJGfqLl9Rdo6bhvMVdnCi971O360e3zcJx3km1mcbmVwor+z9Sez7M+jqjWjJabf5rTPqjzsZsEqI9CdZZU+0r9K40S0H9Qx1tnieWuxjTcp8cJ8J0vOMzwLP5erdrs190b0eNOMPS4js/l+Ty2ik1z9DVkr/ABmxnNqbMk/9G0vlUsz7tC09Jj5M7xzL5enRVFVWyJx8Z1Q2PCuU87na43qJt0dNVUYeETpny600sUxCjw2tRW0sUmknocqWvRTz6y+vdXoWvqLsLuIhwWcz13N179yeyOiOx7BwvhOX4da+HZpw2z01TtmflEdD04+RsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYD3zz5WP1CcZrHuS3vGj97dQftMRD1So/Up09Ul6ubv0HScvcN+Pc+LXHu06uur5tfg4bnXjn4Sz+Gtz/ErjT+jR7atXZj1IWjvXj4AAADvcaoJmUXtZQweD9i8Tfiaak2gvaccMvQhJGo/gHz5vM05a1Vcq1RH+Ed77eHZGvPZiixRrqnDsjpnujS2OUdNAx6pgUtY14MKvaJplPDU+9SlGWmqlGZqM+8zHlmYv137k3K9cy/QWSydvKWabNuMKaYwj29s6563ail9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOHYz4tVAm2U1zwokBhciS56ENpNSu31ELLVuq7XFFOuZwhTmL9Fi3VcrnCmmJmeyGtvJ8gmZTfWd7OM/GsHjWhrXUm2y4Ntl6kJIiHqmUy1OWtU26dUR47Z73564ln689mK79euqfCOiO6NDoR9L4QAAAEounHH0rdvcoeRqbPLXQVH2EpRE68fwkXIX1THIc05nCKLMfenyj1vSvy+yETN3Mz0e5HnV+6lYONengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMB9QWRKrMViUbCzS/kUjR7Tt93jcq1l9VZoL4NR0nLOV+Jfm5OqiPTPzYuG584hNjJ02addydP3adM+nd9KFo714+AAAAAJ67IwUwtuaVZEROT3JMp3TvNTy0JP9YhI845gub+cr6sI9Hte4cm2It8Mtz01TVPpmPKIZZGldSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhFv8A2yp2dfR5K1apITLHJ3E46RvqP4TStJfUHoHLVncyu99qZnw0eqXjPPWa+LxD4fRRTEd8+95THgwcOhcYAAAAANh+1n4vcU/7in/lKHmHGP6u52vfOWf+tsfde/Gtb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABirNN9dlNuXHmM+3cw3DJTBmTkK5vIEKRzERnyky88lw1aEfAk6gME2XmFdF9SskSuoHHXTNakaw0TJpao4Hxix3S09B9h9wDsqHr06Osjcabr+obEI6nj0QdpLVVJL2iR7SrBEck8T7zLhx7CMwEmscyvFsxrkW+I5JVZTUuHoizqJjE6Oo/U7HWtB/mgO/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAY23J3i2r2dqFXm6O4FFg1dyKcZXbTGmHXyR2pjMGfivq+xaQpXqAao8w86LamBuPUYvt9tdc5zhD1gxEts7kS/ox5TTrnhrdgVaor7rxJJRKSTq2VKMuTkTqSiDdKAAAAAx3mm721G3BK/nB3NxTBjSRKNF/cQq5RkotU6JkvNmeuvAiLj3AMFyevTo6iPuR3eobEFuNGRKUzLU8g9S19lxpCkK+oYDn03XD0h3skokHqJwdp4zIiOfatV6DM9dNHJhso7vT/wgJH0OSY7lVe3bYvf12SVT37VZ1cpmZHVqRH7LrClpPgevAwHdAAAAAAAAAAAAAAAAAAAAAAAA10bkyzm59lzyu1Fm+xx9EdXgl+cgeo8Ko3Mpbj9GJ8dPrfn/mK78XiN+f05j9Wd31PEDYNMAAAAANgOzkope3GNL11Uy28wovR4T7iCLh6iIeacdo3c5c7p8Yh7tyld+JwuzOyJjwqmGTRqXRgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzWWZniGB00nI83ympw+ghlrKurqYxBio4a6KefWhGp6cC1Aamd8/OR2VwC3RR7QYhN3rdju8tpfHLVRVSUpMuZMV56LIffVwMubwUo7FJUsuADabtXuBXbr7aYFubUwZNZWZ9QV9/BrphJKQw1PYQ+ltzlM0maSXpqR6H2lwAe+AAHjsz3DwHbmvK23AzehwisMlGiwvrGNXMq5e0krkuNko+PYQCPf+vh0d++e4/wCsPh3jeJ4XP76fg82umvjcvh8v2XNp6wElMXy7FM3p2MhwvJ6nL6CUZlFvKSaxYQ3DIiM+R+MtxtXAyPgYD0IAAAAAAAAAAAAAAAAAAAAAAAAAAAPH5buFgGARkzM7zjH8KhqQpxMq+s4ta2aE/GUS5TjZaFpxPUBHe669OjqhW+id1DYg+qOWrh10tVkR+1y+wqCh8l8f7nXhx7AHVVfmF9F9u/7vE6gcdac5kJ5pqJsFGqz0L5SVHaTp6T10LtPQBIvCN29q9y2zd273JxfOkEjnWVBbw7FSC+zTGdcNOneSiLTvAZCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeRzjPsJ2zxybl24OVVeG4zX6FLu7eS3FjpUrXlbJbhlzLVpolCdVKPgRGYDUhvP5z2zWJvzKrZrB7fdWcwtTaMhsF/QdQrQzInGfEbelulw7Fsta/wB0A13Zz5wPV3k7zv3sScV23imZ+7pp6dE15KTIyLnctlzUKMu3Um0lr3acAGALLzDutK1kHJldQGQNOHr7MNqDDb4mav2uNGaR2n6PV2APjD8wfrOgvE+z1BZItZEaeWQUSQjQ/sHo60/V0AZkxTzautHHHGVWmY0OctMmRnHvaGE2laSIy5VKq0QFn8PNr6+0BMzbXzvHyWxF3g2QQtsz/wAavMOsDSpJfYV1gSub6ssgG1rp+60unbqX5IO2edtKyomjekYHcNnXXTaUJ5lmiM6fLIJCeK1R1uIT3qIBKkAAAAAAAAAAAAAAAAAAAAAAAAAAAHic83J2+2upV5FuPmtJg9IjUisruczCaWotPYbN5SedZ6kRJTqozMiIuIDUhu550e0eJ5MzS7T7c2m61LGf5LfLJcw6GM4gj4nAZdiyH3SMu95DPHuMj1AbjsfuomSUNJkUBDqIN/AjWMJDxEl0mpTSXkEtKTURKJKi1IjPj3gO3AAAAAAHVXl7SYxT2OQZJbwqChp2Fyra6sX24sWMw2Wq3XnnVJQhKS7TUZEA0ydSHnIYBhz9jjPTtjKNy7qPzNFndz40ShadI9DNiMnw5UwiMtNeZlJ9qVLT2hpe3d62+qLe1+T9+27943USDVpi9I8dPVpbMz0bVFg+Cl0kkehG9zq9KjARVMzUZqUZqUo9TM+JmZgOxTTW64J2aKqYutIjUdglhw2NEmaTPxOXl4GWh8QHWgPU4hnGZ7fXLGRYJllvht9FMvAuKWa/BkpIj108VhaFaH3kZ6GA27dNPnDbn4VKgY51E1ZboYlqhlWYVzTMTIIiOzncQnw40wiLuUTSz4qN1R8AFhXand3bne7DK7P9rsqh5bi9lqlE2KZk4w8kiNceSwskusOoJRczbiUqLUj00MjAZIAAAAAAAAAAAAAAAAAAAAAAFdnql81bqe263b3C2uxnb/HNuY2H3cyshSreDJn2smNHfUiPM5nXm4/JJaSTieVlRcquC1cFAIWWnmj9cdl4qE7zorWHkEhTELHqBvTTvS4qvU6kz9SwGKcn65ur3LmnmLjqFzNpmQXK83Vz1VJKTokjTpXFG4GSeJd/HXtPUIyW1zb389+1vbWZdWko+aVZT33JMhw/St11SlKP4TAey2hqSvt2NsKNSEOlc5bSQTbcM0oUUmey1ooy4kR83EyAXuAHm8tzHE8CoZ+U5tklZiWN1iOefeW8pqHFaLu5nXlJTqfYRa6mfAuIDT91A+crtbh7kyi2CxZ/dS4bI0Fl1qT1ZRtr04G2ypKZknlMtDI0spPtS4ogGnjd7zBerPedyS1f7s2WNUkgzIsYxJR0cJKDPU21HENL7yfU+64Ahm667IddffdW8+8tTjzzijUta1HqpSlHqZmZnqZmA+YAA9hhW4Od7bXLWQ7fZjc4VeMmk02lJNfgvGST1JK1MLTzJ9KVakfeQDdP0o+cJkdbYVWF9U0Vq7x940R2916qL4dhEPsJyxgx0+HIbL65bCEuJItfDdUYCwhR3lNk9NV5FjtpFu6G7itTae4hOpfjSYz6SW2604gzSpKkmRkZGA7UAAAAAAAAAAAAAAAAAAAABrRyzjlOSmfEztZmp/8AXrHrGS/kW/ux5Q/OnFP6u99+r9qXnx9L4QAAAABMTpzuEyMduaRSyN6smlIbSfb4UlBEWhepTavzRw3NNjdvU3OiqMO+P8XrX5f5uK8tcszrpqx7qo9sT4pFDl3fgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSl17+Y5v10z7wzdrMG2yoIFK3XwZtPnWSMzJn0siQwh19yE2xIitoSy6o2FEo1nzIUfDmToGtK182LrZsPF903DqKLxEklBwcdql8hkfFSfe48jiffrqXoAYsyLzDutLKEOosuoDIIxO/HOoag1BlroXsnWxoxp7O7T88wEWMrzfNM8sjuc5y+7zO3VrzWt7YSbGSfMep6vSXHF8dOPEB5cBeX6c6s6Pp72IpDbW0dPt5i8E2nTI1p93qYzeijLhqXLxAeyz/cTB9q8VtM33EyiBiGKUyOewurF0m20mfxUILipxxZlohtBGtR8EpM+ACvv1S+cPmOSv2OJdMdarCseI1Mubk27Db1xKTpyqVDiOE4zEQfHRThOOGWiiJlXABpiyvMctzy7k5Jm+T2uX5DN/yu8uZj06W4RGZkSnn1rWZFqeha6EA82AzRsd1BbsdOuYRMz2ryyVQzG3W1WlQa1rrLNlB6nHsIhKSh5sy1LjopPxkKSrRRBcV6Yd/sf6mdlsR3boYp1irtpyNf0Sl+IqvtIivClxjXoXMkllzNqMiNTakKMiM9CDP4AAAAAAAAAAAAAAAAAAAAAAANaPU95omwnT/Im4viqz3m3FhqW1KoaKUhutguoPQ0TrXldbSsj1I22UOrSZGThI4ANGe9XmadWe8j0uMznitr8ZfM0tY5hJLrDJHEi8Sw51zlmaT0UXjEg+5CewBAqxsrG4nSbO2nybSymrN2ZYS3VvvvLPtU444alKM/SZgP3BqbW08X6MrJdj4HL4/urK3uTm15ebkI9NdD01AcFaFtrU24k0LQZpWhRaGRlwMjI+zQByIU6bWy2J9dMfgToqycizYzimnW1l2KQtBkpJ+sjAbHOnzzSepjZWTX12VXqt6MGjmSJGP5Q8pdglov+zXHKuSlXYReN4yCLgSC7QFivpg6x9l+q6hcm7e3K4GVVjCXcl29teRm2g6mSTcJslGl9nmMiJ5o1J4kS+RZ8hBKsAAAAAAAAAAAAAAAAAAAAAAAABDHrL60MB6RMJRPs0tZLuRkLSywbb9t4m3ZJkfKqXLURKNmK2farTVavYRx5jSFT/fXqK3d6j8tey/dfLZN7JStw6elQZs1dW04ZfIQIZGaGk6ERGfFa9CNxa1e0Awsww9KeZjRmVyJEhaWo8dpJrWtaz0SlKS1MzMz0IiAbhenDyfd2Ny6uBlm9eRls5Qz20vw8XRGKbkLrauKfHaUttmHzEZGRLU44XxVtIMBsNqvJq6TYMQmZ9zuBdyTaUhcyRbw2jJav74hEevaSXL9aRkZenm7QGLdxvJM2nsYb7u1W7eT4ra8pqYjZIzEuYallrojWM3XutpPgXMZuGXborsAaX+pHo5316WbRtjcvGSdxyc6bVLn1OpUylmKLXRBSORCmXDIjMm30NrMiMySaeICLQDLWwu5cjZzena/dCO4tCcJyWvs56G9eZ2E28kpjPAjPR2Oa2z07lALzkeQxLjsS4ryJEaU2l2O+2ZKQttZEpKkmXAyMj1IwH2AAAAAAAAAAAAAAAAAAAAAAGg/rV8zfqS2S3qzPaPDtvKDC6vHJCUVORX0OTOnWkVTZG3OjmbzMYmXTMzSRNrMtOU1cxKIBr7tPNM64rI3Ca3iZqWXWjaXHhY7QpL2tdVJcdr3HEq0PQjSstNC048QGLMj68OsPKWls2nUNmEdtwuVf0VMKoPTTT41ciMZdvpARivchv8AKLJ65ya8sMit5P8AlFrZyXZclztP23nlLWfb3mA6cBfrp65unqaupaUS2quIxEaWSSQRpYbS2R8pcC4J7AHYgAAAAMGdQfURtn0z7fTdw9zbc4cFtRx6WljElywtZppNSIkNkzTzrPTUzMyShOqlqSktQFT/AKsut3eDqyv3TyWevGNuoUg3Ma2wrX1+4RySZ+G9LVog5cgk9rriSIjM/DQ2lRpAQ2AbKOjHy3NzOp9MHOMqef222ZU6RoyV9nWwuUoV8oipjuFoaOBpOQ4Xhkr4hOmlaUhYp2X6J+mXYeFDbwfauok3UVJc+ZXrCLa5cXpopfvcpKza5tOKWCbR6EkAlWAj5ux0qdO+90OXG3J2kx28mS0cn3wtREQrdv0G3ZRfCkp0Pjp4nKfeRkAry9cPlj5T0619nujtRPm59s/FV4lzEkIJdzQNn/fJXhJSiRGI+15CUmjX5RHKRuGGqABIvpm6ntzOlncKJnG39ityA+ttrLsNkOrKuuoaDPVmS2nUiWklKNp0i5m1HqWqTUlQW/8Ap46gtvupfbKn3N28nG5Bm6x7mkkGkptVYNkRvQpaEmfKtGpGR9i0GladUqIBnIAAAAAAAAAAAAAAAAAAAABGbqa6UNpeqfDZeOZ/SMsZAxGW3imfxWkFa1D3FSFNO8Dca5j1Wws+RZa9iuVaQp6b47N5hsDull21GcRiavMVlmymW2RkxNiuETkaZHM+1t9pSVp7y15VaKIyIMTgAD2e3OVN4LuFgebuxFWDWHZFV3jsBCiQp9NfLakm0SjIyI1k3proAsX76ecls1jmJQj2Fpp24ub3MQnSK6iSKytpnFFxbmkskOyXUH9ZHPwz/wCf7jDQbvh1H7zdReQnkO7WcTslWytS6qk5vAq68lFpyw4LXKy17JERqJPOrTValHxAcXazp23y3scUnavazIs0joUaHrWDDWVe2sj0NDk53kjIV6lOEYCZ1H5R/WfbNMOT8VxzGFOq5XGbO/huKaLQj5lnAOWky1PT2TM/qcQHyvvKT60adt5yBh+P5QbRqJLVXfwkKcJPYpPvyohaH3amR+oBCrdDYbebZWS1F3V2zyHBveVm1Dm2cJxuHIWntTHlpJTDpl38izAYlAAABuI8qzrSs9rs9q+nrcG5W/thuBMKNhkiW4Zpo72Sv5JtpSj9iPNcVyLR2JdUlwuXmdNQWdAAAAAAAAAAAAAAAAAAAAAGtrOY/uuaZYxpoTdxN5C119k31mn84yHqvD6t7LW5/Rp8n5541RuZ6/T/AP0q/al5YfY1gAAAAAyjs/lKcWzSC5JcJuuty+j56lHolJOqI21n3FyrJOp9xajT8cyf4nLTEfSp0x3a/Q6XlPicZHPUzVOFFfuz36p7pw7sU/R5s90AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGLd39l9s998NnYJunikPKaCYSjYS+nSRDfNJpKTDkJ0cYdSR8FoMj7j1IzIwqHdaPSpfdJe8M7CJMh24w28bXa7dZK6kiXLrVOGnwnzSSU+8R1fJukkiI/ZWRJStJAIjAAAAt6bg9bm0XTF027QZPlEsrvL8pwSinYXtvAeQdhOJ6uYUh11RcxMR0meinllpwMkEtXsgKznUr1Vbu9U2YLyfcm8P6LhOOfethUI1N1VQys/iR2dT5lmWnO6s1OL7DVyklKQjcAAAAAtBeS5V2kLpdzKfMWtNfc7jWL1PGUnRJoaraxh15CtdTJbiDRp3Gj1gNvQAAAAAAAAAAAAAAAAAAAADo8lyXH8Nx+4yvK7iJj+N4/EcnXV1OcSzHjR2U8y3HFq4ERF+gXEBWK64PM8zTfKTcbb7JzZ2C7OGSok+2RrGuMhQfBZvLL240ZfYTKTJS0/tp6K8JAalAEnumDpJ3b6rsvVju3lYmJRVikKyzO7FK0VVW0rsJxxKTNx5Za+GyjVau32UEpaQsndPnlkdMex0ODNuMXZ3fzdlKFSsry5huVHJ5OhmqJVq54rCSUWqDUTjif8AnTAbBYMCDVxGK+shMV0CKnkjQoraWWW0666IbQRJSWp9xAPD57tJtdunAcrNyNvMdziE4k0k3dVsaYpGpcvM046hS21EXYpBkou4wGlfq78oKlOqs886VVPwbGC0qRM2gsJC5LUpKeKiqpshanEOaFwafUol/WuI0JKgr8ToM2smzK2yhv19jXvuRp8CS2pp5h5pRocadbWRKQpCiMlJMtSPgYDv8KzbLducpps2wXIJuLZXjz5Sae8gOG0+w5oaT0PsNKkmaVJURpUkzSojSZkAtj9BHXVj/VpiTtDkKI2P714jEbcyzH2j5GLGORk39KV6TMz8NSjInW+JtLURamlSFGGwwAAAAAAAAAAAAAAAAAAAAAAeI3K3Ax3anAMx3Iy2ScXHMJqZVvbOJ0Nam4zZr8NojMuZxwyJCE/XKMi7wFJnfjevM+oTdPKt1c5mLetsjkqOHX85rYroLZmUWBGIyIibYRoktCLmPVatVqUZhiABvO8nXpcpstt8i6l8zrkWEfCbH6D2zhPoM202qWkPTLHlPQlKjtvNoZPiRLUtXBbaTILFwAAAPNZjh2LbgYxdYZmtFEyXFsiirh3NJObJxl9lwtDIy7SMu1KkmSknopJkZEYCpR1+dFNt0l7htTaApNrs5m77zuD3bhGtcJ0jNa6mW5qerrKT1bWrTxUe0XtJcJIa/wABdT6IdwV7n9Jmw+XPvnJmrxWLUWclR6qcl0il1UhxfH4y3IilH8ICVIAAAAAAAAAAAAAAAAAAAAAAwZv105bSdSeHv4furizFwylDn0JfNElq0qnnC08eDLIjW2rUiM08UL0InEqTwAU+Op7p4y3pg3gyLavKzOYiEZTcXyBKDbataiQpXusxtJmehnyqQ4nU+RxK0any6mEfQAB3WOR2ZeQ0MWS2T0eTYxWn2ldikLeSlST+EjAX4gAAAAGM94d28K2M24yjdHcGy+jcZxWIciTycqn5LyvZYiRkKNJLefcMm206kXMfEyTqZBTc6oOprcDqn3Nsdwc2kri17RrjYbiDTpuQ6WvNWqI7OpJJS1aEp100kpxXE9EklKQjkA2m+Wv0Lo6lMre3M3LgO/zKYPNJlyAfM398NogicKClZGRkw0SkqfUXE9Utp4qUpAWpYMGFWQodbWw2K+ur2G40CBGbS0www0kkNtNNoIkoQhJESUkWhFwIBygAAAfGRHjzI78SWw3Kiym1MyYzySW242sjSpC0qIyUlRHoZH2gKiPmPdKMfph3xW5isM421m5qH7rBGU/EguIWRTqsjMzMyjLcQpvX+9ONlqpSVGA17gJ09AXVlZdLO9VbMtJritq86dYqdyqzUzQ2wpRpYskJ7nIa1ms9C1U2biO1RGQXD2XmpDTT7DqH2H0JcZebUSkLQotUqSotSMjI9SMgH0AAAAAAAAAAAAAAAAAAAAAaH/Ov2YYlY7tZv5WQ0JnVExzDMrkoSXO5FlJcmVqlmRfFZcbkJ1PvdSQCvGAAAD7R48iXIYiRGHJUqU4lqNGaSa3HHFmSUoQlJGajUZ6ERdoCxL0P+VHj1RVUu6fVFTleZJNQ3MpNoJP+Q16FaqQq4SX+UPGWhmwZ+Gj4rpOK1SgN4ldW11PAiVdRAjVdZAaSzBrobSGGGWkFolDbTZJSlJF2ERaAOaAAOpvaGjyinsceyWnhZBQXDCo1tSWUduVEksr+M28y6lSFpPvJRaAK7HmJeWjWbY011vz09wHm8JgGqVn+26DU79DsaKU7YwFrUazipPTxWT1NrXnSfhEaWg0gAAD6NOux3Wn2HVsvsrS4y82o0rQtJ6pUlRaGRkZakZALr3RzvO5v902bU7mzXidvrSoKDlZ6lqdtWOLgzXDTqZp8V1k3Ukf1q0gJNAAAAAAAAAAAAAAAAAAAAgLvTXqr9xr4+XlbneBLZP0k40klH+vJQ9J4Dd38nR1Yx6fY8M5wsTa4nd2VYVR3xGPpxYrG4cyAAAAAACc2zO4CMso0VFg+R5BSNJQ8Sj9qRHTolDxa9plwSv16Gfxh55x7hk5W7v0x7lXonZ7Pme08ocdjP5f4Vyf4tEaf0qeir1VdenpZoGhdgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYfmzbMQ9zOle2zRiIlzJ9mZzOQ1UlKdXTr5C0RLNgldyDbWh9XrYSAqfgAAA76vhZLmd1TUVZGscoyCyXGqaCpYS7MlPK4MxosdpPMtWnBKEJL1EQDdRsR5LuY5JUQMg383CLAHJraXTwXH2Gp9iylWh8kqc4v3Zpwi11S2h5PEvb1I0gJQWnkndOztabVLuhuNX3HKRFOmv1EyNzcp6n7u3Wxl6c2h6eN2cNe8Bqi6tPLj3p6W40nLEOtbmbVsrInM5qI62XYJKVyp+k4KlOKjcx8CWlbjXEiNwlGSQGvYBkLazazOt6M6oduNuKF/IsryJ8moUJotENoLi4++4fstNNJ1UtajIkkWpgLqHTtsxTdPey23+0NI6UpnD6xLNjZERp98sZC1SJ8rQ+JE9JdcWlJn7KTJPcAzUAAAAAAAAAAAAAAAAAAAD5PvsRWHpMl5EeNHQp2RIdUSEIQguZSlKVoRERFqZmAql+Y113WPUjmEzbXbm2fi7E4jL5I5tKNssknMK0OxfToSvASov8XbV3ETqiJaiS2GrwBJbpQ6Zsv6qt3KjbfGlKrqppP0hm2UqRztVVU0pKXXjLgSnFmom2ka+0sy10SSlJC4xs/s/gGxOAUe2u2tG3RYxRN6IQWipEqQoi8aXLe0I3XnTLVaz9RERJJKSDJwAAAADQD5wfSVXRYkTqpwWrKLIckx6nd6FGRoh03tGYNuoi4JVzkmM6f1xqaPTXnUoNAIDIu026eY7K7h4tudgVkdZlGJTUy4LpkamnU8Uux30EZc7TzZqbcTrxSZ8SPiAus7DbyYz1AbSYTu3iZm3VZfAJ92vWolOwpbSjZlxHTTw5mHkLQZ9+nMXAyAZeAAAAAAAAAAAAAAAAAAAAAai/OV3FlYt0z49g0CQpl3c7LYsa0bI9Cdrqppc5xJ6dv+MojH9QBV3AAFvLysIMSJ0M7NyIzCWXrR/JZVg4nXV15OQ2Mclq9ZNsoT8BANhQAAAADBHUrsTjvUhsxmm02QpaaVfRDdx23WglKrbaORrgzEHoai8NwiJZJ0NTZrRroowFJfKMausMyXIMQySCuryLFrKVUXta5pzx5kJ5TD7StOGqFoMuAC0H5N+QyLrpGnVrxqNvEs+uqmISuwm3Y0CxPl4nw55qvRx/NAbXAAAAAAAAAAAAAAAAAAAAAAAAabvOY2XjZXsZi+9EGIX05tPcNwreWktDVTXi0RjJwy+N4cwo/IR9niL005j1CsoAAO/xP8Kca+2sP59AC+6AAAAAqv8Amq9Wb29e7jmz+I2hubYbQTHYz5sOczFpkSCU1LlnynyrTGI1R2u3T5VST0cAaowGR9odsci3n3OwfazFGyXe5xbMVkR1STUiOhw9X5LpFx8OO0lbq9OPKkwF3HabbDFNmNt8P2vwmEUHG8MrmoEFOiSW8pOqnpLxpIiU6+6pTritOK1KMBkQAAAAAAatvN728r8t6RbTMXm0Js9q8hqLiDK0Ln8KxkoqH2SPt5VnNQsyLvQn0AKpgAAtweVtvhK3k6VsdrrqWqXk+00tzDbR5xWrjsSK227WunrqehRXUM6mfFTSjAbHAAAAAAAAAAAAAAAAAAAAAEJ/MWwxvOOjHfWvNknZFLStZFEc0I1NqpJTNg4pOvZq0ytJ/YmYCm2AAADeD5QHSdAzLIbLqZzqsTLpsGnHW7YV8lslNPXSEkuRZaK4H7mlaUsnoZeKo1kaVskAsdgAAAAADjy4kWfFkwZ0ZqbBmtLYmQ30JcaeacSaVtuIURpUlSTMjIy0MgFLPrS2GT049R24e2sBtacYblJt8IcXqZnT2SfHjN8xmZqNjVTClH8ZTZn3gIrgACy75KGYO2exO6WEvO+J96WaJsIpHrq2xbwWUkgj7OXxIbii9aj9QDc+AAAAAAAAAAAAAAAAAAACLHUfQKM6DJ2kGZESq2av0cTdZ/4XPzh2PKuZ+nZn70eU+p5l+YWR/lZmPuT+1T+8iwOweZgAAAAAA7SlurLHrOJcVMlUWfCXzsulxLiWikqI+BpURmRkfaQpzFii/RNFcYxL6cnnLuUu03bU4VU6vlsnpT0273Fq88rSW2aId3FSX0nVGrik+zxG9eKmzPv7uw+7XzjinC7mSr06aJ1T6p63uHAOYLPFbWMaLkfSp9cbafLVLIw1boAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHhtz8Nj7ibbbgYBLSlUbNsctKJ7mIjIk2ER2Nrx07PE1AUPloW2tTbiTQtBmlaFFoZGXAyMj7NAH5AAFiLya+mqlj4rkHU3k9U3LyG1nyMf21ekJ5vc4MVPh2ExjXUiXIdUcfm05kpaWkj5XFahvaAAHzeZakNOsPtIfYfQpt5lxJKQtCi0UlST1IyMj0MjAQ7zfy+ejXcKyct8j2EoWp7yzdfco3p1AhxateZS2qeTDQozM9TM08T4nxAZl2h6fdlthK2TVbQ7c1GEMTSSVhLhtqdmyiR8VMidIU7JeJPaROOKIuOnaYDMYAAAAAAAAAAAAAAAAAAAADSz5u/VlI2+wqD044PZnHyvciEczcGZHXo5Dx9SjbRE1TxSqctKiVx18FCkmXK6RgK1IAAuB+XR0xMdNvT5Rlc13uu5m5LbGRbguupJL7C3kawq1XDVJQ2V6KSZn8sp0yPRRaBPkAAAAAAYx3p27g7t7R7k7Z2DDb7Gb45YVLROkRk3IkMLTHeLXgSmnuRxJ9ykkYCiiAAN8Pkqb4SouQ7k9PdtLUuttYn35Ye0tXstS4ymoti0jXveaWy4RF2eEs+8BYbAAAAAAAAAAAAAAAAAAAAAaFvPIKZ9CdNpoNH0eU7KikpP45veHVeCafVy+Jr9QBXsAAFjHyZuomnssIybpsvp6I2S43Ok5JgjLqkp98rJnIc2OyXDmXGfI3jLXU0umZFytqMg3lgAAAAADWt1M+V/sZ1G5xL3KTc3O2+Z3KycyeXSkw9DsnCSSPHeivpMkPGSS1W2tJK4mtKlHzAJVdN3Tbtv0t7dNbc7ax5a4T0tdleXdk4l6fYznUIbU/IWhDaC0Q2lCUoQlKUl2amozDP4AAAAAAAAAAAAAAAAAAAAAAAI+dWGFMbidM++uIPMpfctMJuHK9C9CSU2JFXKhqMzMiLlkMtq7e4BSGAAHf4n+FONfbWH8+gBfdAAABD3rt3/V049NWeZvWzPc8wt2ixvAFpPRxNvZpWht9HdzRmkuSC14H4eneApjrWtxanHFGtazNS1qPUzM+JmZn26gPyA3P+SrtpDyLe3czc6awiQe2mNMV9US06mzOyF5xBPoV3KKNCkN/A4YCy6AAAAAAOpuL+ix2IqfkF1AooKfjTbCS1FaLT0rdUlPf6QGmvzResjYi56eMr2OwPP6bcPNs7n1TExnHpSLCNWxa2wj2brz8uOa2CUa4qWibJZr1UZmkiSegVrQABvR8j/Kno2d784Qbqjj3FDUXiGTMzSldbKejKUktNCNRTiI+PHQu3TgFisAAAAAAAAAAAAAAAAAAAABiTf6pTf7Eb10SkoWm6wLJICkumpKDKTVyGtFGnUyL2uOnEBReAAABeA6W9sI2zXTxs9twxGRFkY7jEH6ZQhPISrOWj3uxc0+zlPOK48eIDPgAAAAAAAK6fnf4axDzvYbcFpkveciorjH5r6SPXlp5MeUwSz004/STnLx14H6AGi8AAWA/IyfeUz1PRlOKNhpeGONsmfspW4V4S1EXpMkJI/gIBv5AAAAAAAAAAAAAAAAAAAB5nMcbYy3G7WhfNKDmtf4s8r+9voMltL4cdCURa6d2pD68jmpyt6m5HROnrjpa7i3D6c/la7FX1o0TsqjTE+Poa4p8GVWTZddOZVHmQXVsSWVdqVoM0qL80h6nbuU3KYqpnGJjGH58v2a7Nyq3XGFVMzEx1w4gmqAAAAAABzq2zsKebHsquW5BnRVc7Elo9FJP/AIyPvI+B94ru2aLtM0VxjE9C7L5m5l7kXLVU01RqmEusB32q7dLNZl5t09nwQ3aF7MR4/Ssz/alH6/Z9Zdg4niXLtdrGux71Oz60e3zercC52tZjC3m8KK/tfVnt+zPo641JCIWhxCXG1EtCyJSFpPUjI+JGRl26jmZjDRLvImJjGNT9DDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKJG79Smg3Z3RokpQhNLl13ASho1KQRRp7zREk1aGZezw14gMdAAC6h0N4mzhfSF08UrLRMFIwquunWi1LR27Qdq7qR8SM1ylGfrASsAAAAAAAAAAAAAAAAAAAAAAAAAAHQ5Tk1LheM5FmGSTUVuPYrWS7e9sHPisQ4TKn33D/SoQZgKPm/G7t9vxu/n27WRrX9IZnauy2Iqj1KJDRo1CiJ4n7MeOhtovUnXtAYkASj6KNtIm7vVXsfgliyiTVz8kasbiG4RGh+FTNOWsplRH3ONRFIP1GAusgAAAAAD4yJEeIy5JlPtxo7Jczr7qiQhJelSlGREAiPvz1v9O+xeI5Fb2O6GN3+W18B92iwSosGLGymTCQfu7Ko8Rbi2UuOaEbjnKki1Pm4AKYIAAml5d+VPYh1n7CWLLqm02V85RvpIz0Wi4iP1/KoiI9S1fI+JcDIj4aakFyoAAAAAAAAAAAAAAAAAAAABqr833aqdnvSy3l9THVInbS5FEvZyEFzKOslIcgStE9vsLfZcUfclCj7OJBVXAAHpMPzDJ8AyejzTC7yXjeU43LRNpLuEvw3477fYpJ8SMjIzJSTI0qSZpURpMyAWdOjLzRtud74lTgm9MuBtpu5oiMxYPK93orxwz0SqM84oyjPK4EbLqtFKMvCWrXkSG2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHGmRGJ8OXBlJNcaay4xIQRmRmhxJpUWpcS4GAoKzIj8CZKgyUkiTCeWxIQRkZEttRpUWpcD0MgHGAd/if4U419tYfz6AF90AAAFcDzrd3F3G5W2GysCSaoGF0zuS37SD9lVhbuGzHbcI/rmY8bnLTuf7+4NIQAAyXtxvNuzs+7bPbW7jZDt+5fIZRd/QVg/CKWUc1mz46WlJJZt+IvkNRezzK0+MeoZU/11urj/eN3A+7kv9mAf663Vx/vG7gfdyX+zAP9dbq4/wB43cD7uS/2YDqZnV51WTnjfe6k9zkLMiTyx8rto6NC+wZkoT9XQB4iy3y3suS5bjeHN7VPMpfLMyCyfLmV8Y/lJCuJ94DG0uZMnvqkzpT02SsiJch9anFmRFoWqlGZnoQDjAAAA3e+SHj8yRurvdlSG1/R9RikCqfdJPsE9YzvHbI1dxmmCvQvhAWPwAAAAAAAAAAAAAAAAAAAAGP92fxV7l/yUuf3C8AohgAD222tAnKtxsAxdbXjoyTJKqrWx7Jc5TJjTBp9v2ePPpx4ekBfGAAAAAAAAAaIfPF/Bbp2+2uSfMV4CvCAAN/3kY/7UX+hP+fwG/4AAAAAAAAAAAAAAAAAAAABGzfHbVdm0vMqNg3J8Vsiu4badVPNILQnkkXE1ILgr0p4/W8er5e4rFufgXJ0T9Gdk7O/o6+155zpy7N+PxlmPeiPfiOmI+tHXHT1dmmIg7Z5SAAAAAAAAAPfYluXluGcrVXP8evI9VVMsjdj8eJ8pakpGv2BkNbneE5fN6a4wq2xon5+9vOFcxZzh2i1VjR9mrTT7Y7phJbGN/8AFrUm2L5h3HZh8FOq1fjGfqWguZOv2SdC9I5PN8tX7Wm3MVx4T8u96Lw3nrKX8Kb8Tbq/Wp8Y0x3x3s219lXWsdMusnR7CKv4siM4l1B/qkmZDQXbVdqd2uJievQ7KxmLV+nft1RVTticY9DmitcAAAAAAAAAAAAAAAAAAAAAAAAAAAAoxdQn4/d8P6wMm/hWSAxAAAL1+ykFus2a2krWlqcar8MoYzTi9OZSWq5hBGemhamRAMmgAAAAAAAAAAAAAAAAAAAAAAAAADVx5uW7bm3fSrKxGulnHud37uJjxE2vldKuY1nT1lxLVKiYQwsu8ndO8BVKAAHpMRzHK8AyOsy/CMjscSymmWtdVkFTJciTI5utqZc8N5pSVJ521qQoteKTNJ8DMBnv/XW6uP8AeN3A+7kv9mAf663Vx/vG7gfdyX+zAP8AXW6uP943cD7uS/2YDgTusTqwsCbKR1I7lNk0Zmn3bJ7OKZ66fGNh9vm7O8B5K06iuoK78X6a313Ct/HQTb/vuT20jnQXYlXiSVal6jAY0t8hv8ge94vrywu3yM1E/PkuyV6mREZ8zqlH2ERAOnAAABL/AKBMem5P1kdPldBQtx2JlbFs6SC1MmalpyweM9TLgTcdWpgLnoAAAAAAAAAAAAAAAAAAAADpsix+my3H7zFsigNWtBkkCTV3dY8WrciJLaUy+0svQtCjIwFLzq66Zco6Vt473b24afl43JWuw2+ydxPsWdQ4s/BWaiIk+M1+1vJL4qyMy9hSDMIvgAAA2F9L/mT9QHTgmtxyXY/zpbYwuVtOD5C8s3YjCSJJIrbHRb0YkkRElCicZSWujRGeoCxT0z9dWwPVDFiwsPyMsdz1TXNN22vlNxrRKkp5nDi+0bctsuJ8zKjMk8VoR2AJkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChFln4U5L9tZnz6wHQAO/xP8ACnGvtrD+fQAvugAAApddeGdObidX2/1+t4nmYWVyqCEtCuds2KAk1LZoPs0UmJzcOB6694CJAAAsL9NnlAbRZjtJt9uBu7nGXScmzWlg5A7RY9IgwYERixjpkMxlqeiS3XVoQ4nmWlxBc2uhacTCQ35G3pH/AHy3A+7MT+LwD8jb0j/vluB92Yn8XgH5G3pH/fLcD7sxP4vAPyNvSP8AvluB92Yn8XgH5G3pH/fLcD7sxP4vAPyNvSP++W4H3ZifxeAfkbekf98twPuzE/i8A/I29I/75bgfdmJ/F4DsK7yeej+E6bklvNbdB6aMS7tCUFoep8Y0VhXHsPiAnTsn0+7Q9O2NScU2gw2PiVVPfTKtVpeflSZkhKeQnZEmU466syLsI1cqdT5SIgGZgAAAAAAAAAAAAAAAAAAAAGP92fxV7l/yUuf3C8AohgADL/T3+P3Y/wDrAxn+FYwC86AAAAAAAAA0Q+eL+C3Tt9tck+YrwFeEAAb/ALyMf9qL/Qn/AD+A3/AAAAAAAAAAAAAAAAAAAAAACLO6uyy1rk5JhkXnNfM7Z0LepqNRnqpyMXfr2mgv1P8AcjsODcfiIi1fnsq9VXt8drzPmfk+Zmcxk6euqiPOn/b+rsRYUlSFKSpJpUkzJSTLQyMu0jIdjE4vMpjDRL+AAAAAAAAAADnV9nZVL5SquwkV0kux+M6tpfwcyDIxXds0XYwriJjrjFdYzN2xVvWqppnbEzE+hlal31z6qJLcmXHu2E8CROZLnIvU40bajP1qMxpr/LuUu6YiaZ6p9U4uoyfO3EbGiqqK4/Sj104T44sn1fUlXrJKbvGZEcy+O9BeQ9r6yQ4TWnwcxjUXuVa4/l3IntjDyx8nSZb8w7c/zrMx10zE+id3zZBr979up3KS7h2ucV2Ny47qfzVIStBfVMay7y/nKPq49kx80t9Y5z4Zd13Jpn9KmfOImPS9lCzfDrEk+55RVvqV2NlKaJfH7BSiUX5g+G5w/MW/pW6o7pbezxnJXvoXqJ/zRj4Y4vSNPMvoJ1h1DzaviuIUSkn8BlwHyVUzTOEthTXTVGNM4w+gwkAAAAAAAAAAAAAAAAAAAAAKMXUJ+P3fD+sDJv4VkgMQAAC95tN+KvbT+SlN+4WQGQAAAAAAAAAAAAAAAAAAAAAAAAAABW187bOnLLd/Z7bhDnNGxLE5V86lJloUi8mqjmlRF3k3WIPj3K9YDSaAANuXl8+XLhnVZt/ke6O52ZX1BjsG8eoKGlxtURmW+7GjsvvSXpEtiWhKNZCUJQTWpmlR82mgDZUXk2dJBERHabgqMi0NR3MPU/XwryAf38jb0j/vluB92Yn8XgH5G3pH/fLcD7sxP4vAPyNvSP8AvluB92Yn8XgH5G3pH/fLcD7sxP4vAPyNvSP++W4H3ZifxeAfkbekf98twPuzE/i8A/I29I/75bgfdmJ/F4D7R/Jy6RGXm3XJWeS0IPVUZ26jkhZehRtwUK/MUQCVOw3RJ03dN1w7k212Be5Za/EXBcyuymyrGaTDnKa0NHIcW2zz8vtG0hBmXAz04AJYAAAAAAAAAAAAAAAAAAAAAACNfVN0v7f9Vu2cvAM1bOBYxFqm4ZmEdBKmU9hyGlLzZGafEaWXsutGZJcT3pWlC0BUT6iem3dHpiz2Vgm5lMcdajW7j2SxSUust4iVaFIhvqSnmLs5kKIloPgtJGAwGAAADkRJcqBKjToMl2FOhOofhzGFqbdadbUSkONrSZKSpKiIyMj1IwG5vpE82/Ntv11mC9SRS9w8KQSY8PcFkicv65PAknLIzIp7ae8zMni4nzOnogBYqwTP8L3PxWpzfb7JoGXYpdteLWXda6TrLhFwUg9OKFoPVK0LIlIURpURKIyAevAAAAAAAAAAAAAAAAAAAAAAAAAAABQiyz8Kcl+2sz59YDoAHf4n+FONfbWH8+gBfdAAABQmzC9cynLcpyZ5Slu5FbzrN1a9SUapb63jM9TUepmv0n8IDzgAAvd7SkSdqts0pIkpTilKSUlwIiKCyAyCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMf7s/ir3L/AJKXP7heAUQwABl/p7/H7sf/AFgYz/CsYBedAAAAAAAAAaIfPF/Bbp2+2uSfMV4CvCAAN/3kY/7UX+hP+fwG/wCAAAAAAAAAAAAAAAAAAAAAAABiXPdocezPxZzBFS3ytVHYsoI0PK/6dvgSv0xaK9Z9g3XDeN3sp7s+9Rsno7J9Wpy3HOVMtxLGun3Lv2o6fvR09uvt1If5Zt/lGGPKTc1yvdOblatWNXIq9ezRwiLlM/QoiP1DuMlxOxm4/h1adk6/D2PJ+KcCzfDqv41Hu/ajTTPf0dk4S8WPvacAAAAAAAAAAAAAAHb019c49MRPpbF+ukoMj52VGRK07lp+KovUojIUX8tbv07tymJjrfVk89fylcV2a5pnq9cap7JT420zFWb4rGt320tT2HFQ7NCOCPHaJKjUn1KSpKtO7XTuHm/Fsj+DvzRGqdMdkvcuXeL/APJ5SLsxhVE7tWzejDV2xMT1Y4PfjWt6AAAAAAAAAAAAAAAAAAAAoxdQn4/d8P6wMm/hWSAxAAAL3m034q9tP5KU37hZAZAAAAAAAAAAAAAAAAAAAAAAAAAAAFSLzYLxy262tx4CzWacYqsdrGiURERJcqY0/RPE9S1ln6OOvwmGuAAAWvfKG/sbUv8AKu++eQA2fgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMXbv7Mba774XYYDuli0XKMdnEam23iNMiK/oZIkxJCNHGHUa8FoMj7j1SZkYVo+rvyt92dh3LTMtq25u7e1DJrfccis897Uskeuk2G0Wr6EEfF9hOmhGpxDSQGrAAAAABK/pS6wd1ekzME3WGTTt8Ps30KzLbqa6oq6zbIuQ1lpr4EhKfiPILUtCJRLRqgwtybB7+bc9SG3NTuVtrbFOqpxeDaVb3KmdVzkpI3YU1ojPw3W9S7zSpJktBqQpKjDNIAAAAAAAAAAAAAAAAAAAAAAAAAAoRZZ+FOS/bWZ8+sB0ADv8T/AApxr7aw/n0AL7oAAAKAYAAALyHTXkBZX077E5ITnirutv8AG5b6uBGTzlZHN1JkkiLVK9SPQtNewBmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY/3Z/FXuX/ACUuf3C8AohgADL/AE9/j92P/rAxn+FYwC86AAAAAAAAA0Q+eL+C3Tt9tck+YrwFeEAAb/vIx/2ov9Cf8/gN/wAAAAAAAAAAAAAAAAAAAAAAAAAA+brTT7TjL7SHmXUml1pxJKSpJ8DIyPgZGM01TTOMaJRqoiuJiqMYlhbKdiMQvfEkVJLxqerUyOMRLjGf2TBmRF+oNI3+T5izFnRX78devx9uLj+J8k5LNY1Wv4VXV9H9X2TCOWV7PZnirb8tcRNvVsEanLCCZr5EF3raMiWnQu09DIvSOpyXHMtmZinHdqnon1TqefcU5Sz2Ria5p36I+tTp8Y1x16MI2sVjcOZAAAAAAAAAAAAftttbq0NNIU444okttpIzUpRnoRERcTMzGJmIjGWaaZqnCNMynztBiczEcOYi2SPCsbJ9c+XHP4zRuIQhLavWSUFqXcZmQ8345nac1mZmj6MRhHXhjp9L3PlPhdfD8jFNzRXVO9MbMYiIjwjT1spDTulAAAAAAAAAAAAAAAAAAAAUYuoT8fu+H9YGTfwrJAYgAAF7zab8Ve2n8lKb9wsgMgAAAAAAAAAAAAAAAAAAAAAAAAAACnh5mSZyOuLfgrAzN85lKpvmMlH4CqGuOPxSZl+1GnQu0u/iAgkAALSPkz5AVr0pX9QpzV7GNwLWIlo9NUsyIUCWlXAi4Gt5fbx1I+7QBtrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABru6pPLV2D6j1WWS10L+avdCb4jqs0oWEe7zZCtT57Ou1Q1IM1GZqWg23VH8ZwyLQBXB6l+jLfPpYtja3Dxz33E5L/AINJuJT88mmmGrU0IN7lSph0yI/knkoUehmklJ9owikAAACZXRF1Z5B0nbv1+Rk9Jm7cZMtmu3OxlszUmRA5/ZlstGfKcmIajW0fAzLnb5iS4owFyCmuKvIaeqyCjnsWtJeQ2LCntIyycYkxZLaXWXmllwUhaFEpJl2kYDsgAAAAAAAAAAAAAAAAAAAAAAAAFCLLPwpyX7azPn1gOgAd/if4U419tYfz6AF90AAAFDHP8cXh+eZtiTrXgO4tfWVQ4xqZ8ioMpxg06qMzPQ0acTMB5EAAW1fKh3LYz7o9xGlU+TttthaWWLWaDUXPyJeOfEVy66kn3eWhBH2GaD9BgNk4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAx/uz+Kvcv+Slz+4XgFEMAAZf6e/wAfux/9YGM/wrGAXnQAAAAAAAAGiHzxfwW6dvtrknzFeArwgADf95GP+1F/oT/n8Bv+AAAAAAAAAAAAAAAAAAAAAAAAAAHyffYisuSJLyI8dlJqefdUSEJSXaalK0Ii+ESppmqcIjGUa66aKZqqmIiNczohg3L9+MYpmpETH/8A4hsySpLbqCMoaF9hGpw9DWRduiCMj7OYh0OR5cv3Ziq77lP+rw6O/wAHF8W53ymXiabH8Sv/AER2z0/5de2EK3Fm44txRJI3FGoySRJIjM9eBFwIh3sRhGDx2qd6Zl+BlgAAAAAAAAAftttx5xtlltTrzqiQ00gjUpSlHoSUkXEzM+whiZiIxnUzTTNUxERjMpk7QbTfe4lrJcjZSq9dRrAgKIjKGlX1yu35Uy9HxS4dvZwvG+NfiP4Vqfc6Z+183m9d5U5W/BxGZzEfxJ1R9j/9eXakEOZd2AAAAAAAAAAAAAAAAAAAAAKMXUJ+P3fD+sDJv4VkgMQAAC95tN+KvbT+SlN+4WQGQAAAAAAAAAAAAAAAAAAAAAAAAAABUt82jHlUvWrnFkpBpLLaPH7ZCj19omq5qu1LX1wjLgA1qgADev5I25UeDl+9O0kySlLuQ1lflFEwtWmq6x1cSaSNeBqUmWyehcdEGfYR6BYlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdPkGPUOWUtljeT00LIcfuWFRraksmG5MWSyrtbdZdJSFpP0GQCtr5gnlmPbORLbenYGHLtNsGTXJy/BNVyZeOt9qpUZxRqcfhJ+v5tVsl7SlLb5lNhplAAABaP8nzfCTuL09XG2F1POZe7LWiYUAnFczn0FaEuRAIzPifhvNyGkl9ahKE9mhANtoAAAAAAAAAAAAAAAAAAAAAAAAChFln4U5L9tZnz6wHQAO/xP8Kca+2sP59AC+6AAACnJ5jm3bm2/WRvPCJnwoOWWiMurXewnU3rSZkhZcC7JS3kn60mAg8AANuPlBdQUfbPfa02jyCaUbGt7IzUWqW4rRtrIIHOuEXE9E+8NrdZ4cVOG0QC0WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMf7s/ir3L/kpc/uF4BRDAAGX+nv8AH7sf/WBjP8KxgF50AAAAAAAABoh88X8Funb7a5J8xXgK8IAA3/eRj/tRf6E/5/Ab/gAAAAAAAAAAAAAAAAAAAAAAAfN11phpx591DLLSTU664okpSkuJmZnwIiGaaZqnCNMo1VxREzVOEQwHmW/lFTm7CxhlOQT06pOYZmmG2r1KLRTv6nQvQodJkOW7t33r07kbPrfN3+DhuL885fL40ZaPiVbfqR66u7COtFzJ83ybL3zdvLR2S0StWYKPk47f6VpOidfWep+kx1+U4fYysYW6cOvp8XmvEuM5viFWN+uZjojVTHZGrv19byg+1qwAAAAAAAAAAc+tq7C5msV1XDdnzpKuVmMyk1KP0n6iLvM+Bd4ru3qLVM1VzERHTK/L5a7mLkW7VM1VTqiEz9r9oIeIpZurwm5+SqTq0kvaah6lxS33KXofFXd2J9J8HxfjlWaxt29Fv01dvV1ePV6/y1ynRw/C9ewqveijs2ztnw2znAc87MAAAAAAAAAAAAAAAAAAAAAAFGLqE/H7vh/WBk38KyQGIAABe82m/FXtp/JSm/cLIDIAAAAAAAAAAAAAAAAAAAAAAAAAAArwed5t48xleyG67DBrj2lTYYnZySTwbXAfKdDQpX/SFMkGkvsFANEQAAkF0sb2yunjfzbfdhrxXK7HbNLeTQ2uKpFRMScawbSnUiUrwHFKQR8Ockn3ALtVTa1t9VVl5TTWrKouYjM6qsWFEtqRGkIJ1l1tRdqVoUSiP0GA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDPMtzrL9vOjzcvIMHyGbi185Ip69N1WuqYltx5tlHZkJaeRots1tqUg1JMj0M9DIBWz6UurTc3p93ew7I057eHgUm7hp3Hxp2U7Khzqtx1KJilRnTWg3kMmpTbhFzpURaHpqRhc6YfYlMMyYzyJEaQhLseQ0oloWhZcyVJUnUjIyPUjIB9QAAAAHzeZakNOsPtIfYfQpt5lxJKQtCi0UlST1IyMj0MjAVC/Mg6XIHTLv5IZxKGcPbTcmMvIMIipSZNQVeJyTq1Cj7SjumSkF9a042k9TIzMNfYAA3F+Stk8iu6jtwsWN5Sa/JcAkylsFqZKlV1jB8FR93stSHuPr9YCziAAAAAAAAAAAAAAAAAAAAAAAAAoRZZ+FOS/bWZ8+sB0ADv8T/CnGvtrD+fQAvugAAA0Oedbsk9PpNsOoKphm4qhWvDczebRzKTFkqXLrHVqL4qG3veGzM+HM6guBnxCvMAAObW2M+nsYFvVTHq60qpLUytsI6zbeYkMLJxp1tadDSpCkkZGXYYC4R0G9YNJ1X7TxZFhKYibtYWwxB3JoE8qDcd5eVuzjoL+8SuUz0L4i+ZvsJKlBOcAAAAAAAABx5cuLAiyJs6S1ChRG1PSpb60ttNNoLVS1rUZElJEWpmZgOJUXVNkEJFlQ20K7rnFKQ3PgPtyWFKQeiiJxpSkmZHwPiA7MAAAAAAAAAAAAAAAAAAAABj/dn8Ve5f8lLn9wvAKIYAAy/09/j92P8A6wMZ/hWMAvOgAAAAAAAANEPni/gt07fbXJPmK8BXhAAG/wC8jH/ai/0J/wA/gN/wAAAAAAAAAAAAAAAAAAAAAAxrnO6WN4QhbEh36SuuXVqmjqLnLUuBur4k2Xw8fQRjbcP4Pezk4xGFH2p9W35aXO8a5myvDImmqd659mNf+afq+eyEOMy3IyfNnVFZTPd64las1EYzQwnQ+BqLXVZ+tRn6tB3OR4VYyce5GNW2dfzdzyTi/MOb4lV/Eqwo6KY0U/PPXPoeCGyaMAAAAAcqHCmWD6IsCI9OlOftcaO2p1xXwJQRmYhXcptxvVTERtnQstWa71W7RTNUz0RGM+EMs0uxWe2xIckxI9GyrjzTndF6f4NonFEfqURDS5jmLKWtETNU9UeucHU5PkriOY01UxRH6U6fCMZ8cGSq/psjkSFWuUuOKPTnaiRiQRekiWtatf1o1V3mur6lvxn5vW6Kx+XlP/lvTP3acPTMz5PSs9OuEt8pu2Ny+ZFoojeYSkz9OiWCMvzR8lXNGZnVTTHdPtbGjkDIRrruT30/7XFl9OOKrbMoV3axneOi3jYeTr3eylpo/wA8To5pvxPvUUz2Yx65VXfy+ycx7lyuJ692fVT5vlXdOOOsOkuzvp89CT1JllDccj9SjPxD/M0GbvNN6Y9yiI7cZ9iOX/L7LUzjcu1VRsiIp/3M049ieO4rHOPQ1TFelZETzqSNTrmnZzuqM1q+qY0Oazt7MzjcqmfLw1OwyHC8tkKd2xRFO2eme2Z0y9EPlbAAAAAAAAAAAAAAAAAAAAAAAABRi6hPx+74f1gZN/CskBiAAAXvNpvxV7afyUpv3CyAyAAAAAAAAAAAAAAAAAAAAAAAAAAAIN+Yvsk9vn0pbh0tXDOblGFoRmWJsoR4jipVQla32mkl7RrehrfaQRcTUou3sAU5wAAAWJfKV60IdvSQ+lncq4SxfUqVq2ftZa9Cmwi1ccqDWo/22PxWwX1zeqC08NJKDeuAAAAAAAAAAOlrckx24mWNdUX9da2FQvw7aDDlMvvRV6mnlfbbUpTZ6pMtFEXEjAd0AAAAAAAAAAAAAAAAAAACB/mZ0J5B0Rb4R22yXIrotRaMK05jQUG5gvuqLiX96QstfQYCnmAtr+Vz1FN749NtPjFvO94zvZgmMXyBDiuZ16vQg/omWfaei2EGyZmeqlsrUfaA2SgAAAAADS952mNQJWwu02YOJI7Siz4qaGvl4lHtqubIfIla8NVVzXDTj9QBWkAAG3zyXKCXYdT2Z3qULKBj23s8pD5J1T48yxr22mlH3GpKXFF+lAWgAAAAAAAAAAAAAAAAAAAAAAAAAFCLLPwpyX7azPn1gOgAdjUTirLarslNm8mvlsSTZI+U1ky4lfLroemumgC/WAAADG+7+1+N707YZvtXlrXiUOcVT9bLdJJLXHcWXNHlNEfDxI7yUOo1+uSQCkfuzthlezG4+YbX5tCODkmGWLsCenRRIeSnRTMlk1ERqafaUl1tWnFCkn3gMdgADJ2z+8Gf7E5/R7lba3jlFk9E5qhZaqjyo6jLxoktnUidZdItFoP1GRkokqILXHR/5gO0nVTVw6VcpjBN3WWS+ldvJ76SOStJe29VPL5feWz4nyF8ogteZPKRLUE9gAAAAABwrKyrqavnW1vPjVVVWMOSrKzmOoYjx2GUmtx151w0oQhCSM1KUZERcTAVk/Me8xFG+zkrZPZWyfZ2hgPkeV5OjnZXkshlRKQ22gyStMJpaSURKIjdWRKMiSlOoZ/8kjD9x2E7yZ07MdibTWKIlPFq3SUbc6+jqJ5Uljjon3aOvkcPT2vFQWp+Gegb+gAAAAAAAAAAAAAAAAAAAAGON4pLELaLdOZKcJqNExC8ekOmRmSUNwH1KVoWp8CIBRKAAGT9kZ30XvRtFZ+F4/0dmtBK8Dm5efwbFhfLzaHprpproAvWgAAAAAAAANDPnkSmEUHTfCU5pKkWGUPstaHxbZaq0rPXTQtDdT2n3/CAr0gADfj5Gk5tux6mK00KN2XGxCShwtOUkx13KFEffqZvFp8BgLBYAAAAAAAAAAAAAAAAAAAPm660w24884lllpJrddWZJSlKS1M1GfAiIhmImZwjWjVVFMTMzhEIsbj76rWcilwd00ILVuVkOnFXcZRiPsL7M/1Jdih2PCuXcMLmY7qf93s8djzLmHnaZxs5Keqa/wDZ/u8NqMDrrr7rj77q3nnlGt15xRqUpSj1NSlHxMzPvHXU0xTGEaIeb1VTXM1VTjM9L5jKIAAADkRYsqdIZiQo7suVIVyMRmUGtxaj7kpSRmZ/AI1100RNVU4RHTKdq1XdqiiiJmqdURpmUj8K6fZksmp+ZyVV7B6KTTRlEb6u8vFc4pR6yTqfrIxyuf5mppxpsRjP2p1d0dPy1vQuD8iV3MK85O7H2Y+l3zqjsjGeuEnKLG6LGopQ6KrYrWdCJZtJ9tenYbjh6qWfrUZjksxm7uYq3rlUzPy1R0PR8lw7L5KjcsURTHVrntnXPe7sfO+0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRc38kMy99d6ZUZwno8nPMjdYdT2KQuzkKSovhIwGJgABet2RnFabMbRWaWzZTY4VQSUsmfMaCermF8uuha6a6AMngAAAAAAAAAAAAAAAAAAAAAAAAAAAp7+Yf0tyOmXfu3Zpq9TG2G4q37/bqShBkyw24sjmVhHpoSoTq+VKdTPwlNKPiowECwAByoM6bWTYdlWzH6+xr325MCfGcU08w80oltutOIMlIUhREaVEepHxIBZD6GfNPxrOYFHtV1KW8fGM9jobhU25spSWay500S2Vgv2URZJ8NVno04fHVtRklQbrG3G3m23WnEutOpJbTqDJSVJUWpGRlwMjIB+wAAAAABpz8xLzHafaKqvdlNjb5FlvBNSuDk+WQFpWxjDauDrbbpapXOMjNJJSfyB6qUZOJJIDU75YuK7m5f1h4DbYNZS4DGMqk3W490S1G2qkJJolR5PH5T3xxaGUkep86ic09g1EFu4AAAAAAAAAAAAAAAAAAAGEOpfFDznp33yxFto3pN/gmQRYCCTzH70qveOMok6lqaXSSZFrxAUcgErejTqbuulTe2i3CjJdnYpYF9Ebh0DZ/wCWU8haTdU2kzIvGYUlLzR6l7SeQzJK1ahcqw7MMZ3AxahzbDbmNkGLZPCasKO4iK5mn2HS1SZd5GXYpJkSkqI0qIjIyAelAAAAAaIfO63LgM4tsvs6xJQ7aWFrLzK1hpX7bEeGwuvhOLRr2PKkyCSen97UArwgAC0J5PWw0/bjYm/3YyCEcO63rnMSKZpxJk6mhqydahuHzcU+8POvuFoWim/CXqZGWgbeAAAAAAAAAAAAAAAAAAAAAAAAAFBO2nfSlrZ2fheB9Iy3pXgc3NyeMs18vNoWumumugDrwABf3YfZksMyY7iXo8hCXGHkHqlaFlqlRH3kZHqA+oAAANU3mZ9Dj3UViLW6+2dX4+8+BwjZcqmCIl5BUNqU4cQi75LBqUtjvVqpo9TNvlCrFIjyIkh+JLYciyorimpMZ1JocbcQZpUhaVERpNJloZH2APiAAPtHkSIkhiXEfciyoriXY0lpRocbcQZKStCkmRpNJlqRl2ANnmw3mydS+0bEWlzWRE3txeMSUIYyRa2rdttJEXK1bMkbijPvVJbeP1gNpe3XnJ9MWUNRmc7pcs2wsVII5jkiEm2rkK04pbfgKXIXx7zipASko/MK6L8hQy5A6gcdjpfMkoKzRMq1EZlr7SZ8dg0l61EXo7QHfWHXP0gVkf3mT1E4S43ry8sSyblua6Gr9rj+IvsLt09XaZAIsbp+b90q4RFlN4I7fbvXTZKTFj1UF2sgG6nXg9Ms0MLSjUtOZpl30kRlxAaO+qjzAN9eqg3qO8ntYTtoTpLj7cUS1oivciuZC7GQrR2YtJkR6L0aJREpDSFcQGKel7plz/qn3Prdv8LirjVzSm5OZ5c42a4dNXc2i5Dx6kSlq0NLTepG4rhwSSlJC5VtPtbh+y23eKbYYHX/AEbi+IQkw69pRkp11WprekPrIi53XnFKccVoWqlHwLsAZEAAAAAAAAAAAAAAAAAAAAARb62c1i7f9JfUDkUmQUY14XZU8F49OEy6a+i4uhHwM/GlI0AUpwABy4E2RWzoVjFUSJUB9uTGWZakTjSiWk9PhIBfKwnK6zO8NxPN6VxLtPmNNBu6pxCiWlUefHRIaMlFoR+ysuID04AAAAAAAK3Pnb5vEtN2dmdvmJBPSMOxifcTWUnqTS7yUhpKVehRoriVp26Gk+8gGkkAAbiPJczeJR9RedYXMfQx9/WFvLrEqVob0yqlsPk0lPefu7j6/gSYCzoAAAAAAAAAAAAAAAAAAOHYWEKqhSbGxkohwYaDckyXD0ShJd5/8Rd4natVXaoppjGZ1Qqv37di3Ny5MRTEYzMoRbnbtT80ecq6pTtfjDai0YP2XJRp+ve0P4uvEkdnefHTT0HhHBaMpG/XpueiOz2vGeZOabnEqptWsabMdHTV11dWyO+dOrDQ3rkQAAAAB7fCcBvs6nHGq2fChsKIp9q6RkyyR92v1yjLsSXH4C4jX8Q4layVONc6Z1R0z8trc8G4HmOKXN21GFMa6p1R7Z6k28K27x3BopIrY5SLFxOku4fIjfc17SSf1ifsU/V1PiPP+IcUvZyr35wp6KY1fPPW9l4PwDLcMowtxjX01T9KfZHVHfi94Nc3YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6bI7+sxXHr3KLuQUWmxuulWlvKPTRuLDaU+8viZF7KEGfaAoZX1vIyC8ur6X/ld3Pkz5XHX5SS6p1fEiLvV6AHUgAC6R0I5rGz7pA6frqM8l44GIQcflmR6qJ+gSdS6S9ePMaopmevp17wEtAAAAAAAAAAAAAAAAAAAAAAAAAAAARm6sumbE+qraC523yFSK65aM7DBsp5OdyqtmkKSy9oXFTSyUbbyNfaQZ6aLJKkhTf3U2rznZbO7/bfcaiex/KscfNmbDdLVDiD4tyI7nxXWXU6KbWngpJgMeAAAAml08dfnUn02sQqXEMwTkmDQj0b2+ydtVhWto115YyudEiKXEz5WHUI1PVSVANvO1vnW7SXLEeLu7thkOD2Z6IdsqBxi6rzMi4uKS6qHIbI/wC5Sh0y9JgJl475k/RPkrKXIu+dfWuaH4ka2r7SuWg06akZyYjaD7S+KoyPu7D0DIC+t7pERHVJV1F4GbaGzdNKbiOpzlIubQmyUazVp9aRa92moDCW4Hmn9GWCxn1QtxJm4Fkyg1Jp8Wq5cha9NdCTJlIixOJlp+3/AA8AGoTqd823eHd6FY4hs/XL2XwuaSmJdvHkePkcxk9SMvfEEhMNKi0MyYLxC7PGNJmRhq3xLEsq3Dyqmw/D6aZk+W5PMRDp6eGg3ZEmQ6fYXo04qUpRkSSI1KMiIzAXAehnpEpeknaZuifVHtNystNqx3IyNkuZDklCDJqFGWaUqOPFJSiRqXtKUtzQuflSE1QAAAAAAAAAAAAAAAAAAAfhxtt5txp1tLrTqTQ60siUlSVFoZGR8DIyAURN1cNd263P3GwB9BodwjJrahWlRmZ/+zpjsYj1PiepN6kff2gPAgNjHQz5guZdJ1j96WRxpWbbJ28rxrPF0OF77VOuH8rLqVOKSgjVrzOMqMkOGWvM2ozWYWhtnN+dpN/saayrabN67Lq7kQc+LHc5J0Fay1JqbDXyvR18D4OJLXtTqWhgMvAACNXUj1X7OdLmKv3+4+Rs/Tb7C3MawOE4hy4tXE8EpYj66pb5uCnnOVtPerUySYVAeoPfTMeo7djKN2M2Whuyv3Uor6llRqj10BguSLCY5tPYaR2noRqUaln7SjAYWAbHugToOybqky+Fl+XwJVJsRjctK8gu1ktlV26yrU6yuXwNXMZcrzqT0aTqWviGkgFtCsrK6lra+mqILFZU1MZqFV1sZCWmI8dhBNtNNISRElCEJJKSItCIgHOAAAAAAAAAAAAAAAAAAAAAAABjDezNI23Ozu6eeyn0x2sQxS3tkuKUadXIsN1xpBGk0nzLWRJSRHqZmRFxAUUgAAAXl+nbN4m5Gw2zucw5KZSMlw6nmSXEmXsyjiNplNK5eBKaeStCiLsURgMygAAAANSXXh5ZtF1AyLXdjZtUPEt43UG9d0z2jFXka09q3VEWkeWouHi6cjh6eLoZm6QVos929zja3KLLC9xMWscOympWaZtNZsKZdItTJLiNfZcbXoZocQZoWXFKjLiA8aAAAAAAAAAmx0m9Ce8vVbcRZVNXO4htiy9y3e59owsoSSQrRxqA2ZoOY+XEuVB8qT/bFo1LULWPT5077Z9M+30LbzbKoOHBbUUi6upJpcsLWaaSSuXMeIk86z00IiIkoTolCUpLQBnMAAAAAAAAAAAAAAAAAAAHgc/3U2z2prottubuBj2AV09xTNfKyCyjV6ZLqE8ym2PeHEG6ok8TSjU9OOgCJGY+Zr0V4a0/4m8bGSzWiUbdbj1dYWK3TSRHyofbjlGIz1Ii5nUl6+B6Boz69/MSsOrCNXbe4LQzcM2hppxWLrFipv6TuZjaVJYdmJZU42y2ySlGhlC1kaj51KUZIJAaxAAAAbhuhTzQV9P2J12z289FY5VtzUOKTieS1PhuWdOy8s1qjOsPLbTIjpWo1J0WS2y1SknE8iEBucw3zGejDN0xyr99Kelkvl7cXIWZlKbStNTSt2ewyzw9JOGn0GAmJRX1FlFPXZDjN1AyKguGEyam8rJLUuHKZX8V1iQypbbiT7lJMyAdsAAI/bjdVnTftLYz6XcPerE8bvqoi+k8ccsWn7OOakJcSTsGObshBqQolJI0amRkZagIN7w+cH0zYTWz2dsG7neDJUtqTWpiw3qmq8Yuz3iXYIafJJH3tR3Ne7gfMArY7v7r5jvhuTlm6mezUTcoy+Z71PNpJoYZQhCWmIzCFKUaWmGkJbQRmZklJamZ6mAxsAAPd7Y7kZbtBn+KbmYLYnVZXhs9uwqJehqQakkaXGnUEZc7TzalNuI19pClJ7wFlTZjzhem/NKiC1u21a7P5SltKbPnhyLeoW7pxVGkQG3pBJUfc6wnl7DUr4wCZ+H9aXShncmFCxrf/C359i6iPX186yarZL7zqkobabYn+7uKWtSiJKSTqZ8CIBJ4AAAAAAAAAAAAAAfN11php199xLLLKFOPOrMkpSlJaqUoz4ERF2jNNM1ThGuUaqooiaqpwiNaC+7G5r+a2B1tatTONV7h+7I1MjlOFw8ZwvR/cF3Fx7T4eicF4TGTo36/5k6+rqj1vFeaOY6uJXPh25ws0zo/Sn7U/ux65YdG8ckAAAAAMpbZ7aTs9nm88a4ePQnCTY2BF7S1aEfgs66kazIy1PsSXE+4j0/FuLUZKjCNNc6o9c9Xm6Xlzl25xW5jPu2qZ96r92nr8vCJnTT09bQV0aqqIiIUGKkktMtl+apR9qlH2mZ8THnd+/XfrmuucZl7XlMpaylqLVqmKaY6PlrnrdmKn0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOnv8hoMTp5+RZTeV+NY/VN+NaXtrJahw4zepJ53pD6kNoLUyLVRlxARKzDzC+jPCUyPpTfzHrN2PzETOPlJvTcUnhyoXWMyUHqfYfNy9+unEBpx66PNMjb34Va7ObE01rjuF5Ek4+a5jcJbYn2UQlEZwosdpx3wWHNPlFqXzuJ9jkQk1c4aXgAAAbN+gHzCZnSaq1wPOqafluz+QzDsTjVqm1WVPPUhKHH4aH1ttutvJQknGlLRxIlpUR8yXA3p4x5mfRPk8eM63vTHo5L5fKV91V2kFxlWhnyrccieCfAu1Lik92uoDLtR1k9J94SPcOo3btCnEpUhuZkMCEs+c9CIkSnmlc32OmvqASJr7Gvt4EK1qp0ezrLJhuTXWUR1DzD7DqSW26062akrSpJkZKSehl2AOYAAAAAAAAAAAAAAAAAAAAAAAAAh11gdF+23V3iDNfkJ/e1n9C04WFbhxWUuSYZr1V7vJb1T7xGUrips1EZH7SFIUZ6hVO6h+lzeTpiylWObpYu7ChyXVpx/LoZKfp7VCDP24kskkRq0LU2lkl1JGXOhOpAI8gAAAAAAAAMy7IdP+7HUTlzOGbT4lJyOy9ldnP08KBXMKPTx5stejbKOB6anzKP2UJUrQgFpvon6CMA6SKZV5KfZzTeK6ikxkOcLaNLUVpeilwqttftNM6kXOs/bd01Vyp5W0hPwAAAAAAAAAAAAAAAAAAAAAAacOtbyq6ve7JMj3d2UyFjFNyMhfXPyXFbhSzqLWUoiNbzL6ErciPOGRmrVK21qP8AvXtKMK/G7vTxvXsPZqq92dt7rDleKpqNZyWDcrpKknofu09k3Iz3/VuGAwyA73HMoybDreNkGI5FZ4rfQj1h3dPLegy2TPt8N+OtDifqGAmfi3mW9bOJsMQ4m9822hsFp4N3WVVo4v2TSXPJlw3JB6dv7ZxPt1AfDL/Ml61czjvQ5++NjTw3SNJM0EGup3EEZJI+WTBisyC15ddfF4cdNAELrq7usktJl3kVvNvrqxcN6wt7GQ5KlPuK7VuvPKUtaj9JmA9/tbshu7vZbJpNqdu7zOZviJakOVsVa4sY1GREcqWrljx0+0XtOuJSWvaA3e9LXk5R6+TW5j1SXLFo4ybchjamhfUcfmLjyWdijlNenYpuMZF/0yi4AN61FQ0mL01ZjuN1EOgoKaOiJUUteyiNFjMNlohtllskpQlJdhEQDtgAAAAAAAAAAAAAAAAAAAAAB5nLM1w3AaheQZ1ltNhdC24lld3fT49dES4olKSg35S22yUZJMyLXuMBFbLfMN6MsMbeXZb94/ZraIzSxQplXalqLsSk61iQnifAjNRF6TIuIDSr19eZnG6iMUkbN7M09lj+21g+y9l2SWyUM2FyUZZOtRW47a3CYjE6lLijNfiOGlJGTaSUlYafAAAAbb+gHzKW+mnHD2g3apLHJNrUS3ZeMXVTyOWFIuUs3JDHu7q20vxluKN3QlpWhSlmXiEokpDd5iPmH9GWZtR112/VDVuPknmjX6JVKttRlqaVqsWWEap00MyUafQZkZAJA/z37L/er9/f872FfeR7x7p9+X0/XfRXvHJ4vg+++P4HPye1y8+unHsAZQAAABhzeXp/2e6gMf8Avc3bwOty+G0lZV019BtT4Sl9q4c1k0PsGeha8iyJWntEZcAGlPezyUbRl6ba9Pu6DEyKZqcj4fmiTZeQXbyN2cNpSHDPsSS46O7mX2mA1n7g9BPV9to48WQbEZLYxWdTOxxxhN/HNBf3w11SpXInTj7ZJMu8iARcusbyLG3zi5FQ2NDKI+U41jFeiua6ErTleSk+xRH9UB0oDIWJbR7q586yzg22mVZk7ILVlNJTzZ/MXA+YjjtLLTRRHr2AJxbU+VP1ebkuxX7rEoG1VI+ZGu0y2ahp4kdp8sCJ7zKJWnYTjaCM+1RdoDbr09+UXsDtY9ByDdOXI3vyqNyuJhWTJQ8fZcLQ/ZrUKcVI0PUj94dWhRcfCSYDaxAgQaqDErKuExW1teyiPAr4raWWGGW0klDbTaCJKEpSREREWhEA5YAAAAAAAAAAAAAAAAAAAADWP5hnQjl/WDL2zu8Izmsxm1wdqwgzq2+95OE9GnG06TzCozbxodStkkqI0aLSZe0XhkSg10wfJH3pc8X6T3jwqJpy+B7qxYyebt5ubnZY5dOGmmuvq7w7D8iHup/Thin3OnfogH5EPdT+nDFPudO/RAPyIe6n9OGKfc6d+iAfkQ91P6cMU+5079EA/Ih7qf04Yp9zp36IDp5Xkk75ofcTC3dwSRFLTwnn02bLh8C11QmK6RaHqXxj/wCIBvA6Q9hpvTT0/wCC7P2l+3kttjpTZFtaR0qTGOTYTHpjrcZKySvw0G9ypNREatDUZJ15SCSwAA0A9QPlB7s7m727pbkYjunijFBuBklhkkWJdlPbmx3LWQuW9HWUeM82aWnHDQgyVxQRakRgMdMeSJu0pltUnezEWpBpI3mm4M9xCVd5JWZIMy9ZpL4AH1/Ih7qf04Yp9zp36IB+RD3U/pwxT7nTv0QD8iHup/Thin3OnfogH5EPdT+nDFPudO/RAflfkh7rEhRt73YmpZEfIlUCckjPuIzLXT8wB1td5JW9yrCCm23cwdirVIaKyeiFZOyERzWXiqZbciNpUsk6mklKSRnwMy7QFkiDERAhQ4LbjjyIbDbCHnj5nFk2kkkpaiItVHpqZ6AOUAAAAAAAAAAAAAi7v5n6mi+8eqe5VOJS7kLqD4kk9FNx9fWWilerQu8yHX8t8Nx/+iuPu+ufVHe805547NP/AMVqeuufTFPrnu60Ux2TzEAAAAAe0wPDJ2cX8eoimbMVHytnO01JhhJ8T9aj7El6fVqY+DiOfpydqa519EbZ+Wtt+CcIucTzMWqdEa6p+zT7eiOvqxbB6anrqCsh1FVGTFgwmybZaT6u1Sj71KPiZn2mPM79+u/XNdc4zL3nKZS1lLVNq1GFNMYR8ts9MuzFL6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFTrR6e7nqd6fsr2mx3ImMZv7GTBsKadN8T3Fx+BIS8liZ4KFuE0siMtUpUaVcq+VXLymGkhryTOoNTTRv7qbeNvmhJvNtu2y0JXp7RJUdeg1ER9hmktfQQDvIvki7vLYbVN3qw+PKPXxWWIdg82XE9NFqQ0Z6lofxS/4wHI/Ih7qf04Yp9zp36IB+RD3U/pwxT7nTv0QD8iHup/Thin3OnfogH5EPdT+nDFPudO/RAdPK8knfND7iYW7uCSIpaeE8+mzZcPgWuqExXSLQ9S+Mf8AxAOtmeSd1FIZNUDc/biTI1LRqRIt2Ead586K109f1IDfl0y7OydgNiNttoJt99807CqxcefdElSEPPyJDsp0mkrM1E02t40N68eRKeBdgDOwAAAAAAAAAAAAAAAAAAAAAAAAAA83luHYnntDPxbNsbrMtxuzRyT6O3itTIrpd3M08lSdS7SPTUj4lxAaeN+PJk2uyt6VdbDZlL2vsHNVliNwTttTGruSy+pfvjBH2malP+pJEA1T7meWZ1j7aPPGra1zPqxo1E3c4ZIbt0O8veiKnw5permjp1AQ6yjbfcPCFuNZpgWRYg6yZpdbu6uXXqSZGlJkopLTZkeqiLj6S9IDxYD0WP4hlmWPlFxbF7bJZKlk2mPVQn5jhrMyIkklhCz11UXD1kAl5tt5c/WLua8z7hsza4lXuGXi22XmihbaSentKYmmiSouP97ZUfqAbT9ivJYxGlkQ7nqF3DdzJ5lSVuYTihOwa1Zlpqh+xeSmU6hXEtGm2Fdh8/cA3M7f7b4FtTjUPDtt8Rq8LxmBxYqKqOiO0azIiU64aS5nHFae0tZmpR8VGZgPbAAAAAAAAAAAAAAAAAAAAAAAAAOHYV1fbQpVZawY9nXTmzZm18tpDzDzauCkONrI0qSfeRkAh5uB5enRxuQ49JutjKOonOnze+40qRQKJZ9qjarHY7KjPU9edCte3t4gIuX/AJMXSvZqddp8o3DxpxRfJMR7OvkR0nqXamTXOOHw4fthAPJ/kS9gv6V9wP11V/5IB6Ki8lzpfr3EvXOabiZCpKtTjLsK2LHUnUjIjSzWk5rwMtScLt7O8BJ/AfLl6M9vHGJVbslVZBPY0M5uTvSr0lmXeqNPdejF+paIBMypp6mhr41TR1cSlqoaeSJWQWG40dpPbohppKUpL4CAdiAAAAAAAAAAAAAAAAAAAAAAAAA13eYj0cZv1fYRgNVt/ltRjt/g1vKmFBv1yWa6YxNaQ24pbsRmS4h1rwi5PklEZKUWqQGqeH5J3UYtk1WG523EV/mMibjybd9HLw0PnXWMnr6uX6oDl/kS9/f6V9v/ANda/wDkQHYQfJH3pc8X6T3jwqJpy+B7qxYyebt5ubnZY5dOGmmuvq7w7D8iHup/Thin3OnfogOuneSPvU2bf0ZvHhMtJkfjHJYso5pPhpykhh/X6ugDgfkS9/f6V9v/ANda/wDkQHDm+Sf1GttJOu3O23lPmsiW3Jk28dBI0PUyUiseMz104cv1QGQPyN++f8zX3tfztYl9/X31fS30D71Z/e57l7p7v4vvHuHj+9a//huXl9nm7wFioAAAAAAAH8MiURpURKSotFJPiRkYDqIuPUEF9uVCo6+HKa18KSxGabcTzEaT0UlJGWpGZAO4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdDlF9HxjH7a+kkSm62OpxDZnpzuH7LaNfslmRfVH05PLTmb1NuOmf8AH0Ph4lnqcllq79WqmMe2eiO+cIa27CfKtJ0yymum9MnvLfkun9ctxRqUf5pj1W1bpt0xRTqiMIfnm/frv3Krlc41VTMz2y4YmqAAAAf0iMzIiLUz4ERANgO1WEt4XjEdp9ok3NoSZVw4Ze0SzL2GfgbI9P03MfePNOM8QnN35mPo06Kfb3+WD3bljg0cNykRVH8SrTV29FP+XzxZMGpdGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6aTjmPTX3JUyirpcl0yN2Q9FacWoyLQuZSkmZ8CAdyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf1G3ao1LR0DS9DtJK5Uki/5uMRElJ+o1Oa/qR1XK2X3rtdyfqxhHf8A4el57+YOcmixbsR9aZmeyn559CII7d5QAAAAAMt7LYwnJM2huyGvEgUSfpCUSi1SpaDImUH8KzI9O8iMaXj2b/D5aYjXVoj1+h1PJ/DYzmfpmqMabfvT2x9GPHT2RKeY84e4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIX9RUpTuZ1sXU/DiVLRkk+znceeNRl8JEkd5yvRhlqp21T5Q8g5/uzVnqKeiLceMzV8zAI6VwoAAAAAl/wBN9c23QZDbaF4suwREM+/ljtJcL894cRzVdmbtFGynHxnD1PV/y9y8Rlrt3pmvd/ViJ/eSPHKvQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKuodlbecQnT+JIqGFIPTh7LzyTLX6mv1R33LFWOVmNlU+UPHefqJjP0zttx51MDDo3EAAAAACZHTjMbcxW7gEer0W1N9afQh9htKfz2lDheaaJi/RV0TTh4TPtet/l9dicnco6Yrx7qqYw/ZlIYcw74AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFvqSqTNvGLxCPZSp+DJc9aiJ1ovzljsOVb2m5b7Jjyn1PNPzDyuizejrpnzp/eRVHYvMQAAAABl3ZnM2cSypLU93wqi9QmJNcM9Etua6suq9SVGaTM+wlGfcNJx7ITmrGNP0qdMde2PlsdVyhxenIZzCucKLnuz1T9WfHR2TMp49vEuwecvbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHg9y8ZPLMNt6tlvxJzaPeqwiLU/eGPaSlPrWWqP1Q2PCc3+FzNNc6tU9k+zX3NHzFw38fkblqIxqw3qfvU6fT9Hva7jIyMyMtDLgZGPUHgT+AAAAAACS+1e9KKxmNjeYPLVCa0brLs9VGynsS2/3mku5Xd2Hw4lyfGOA/EmbtiNPTTt646+p6LyzzhFmmMvm592NFNezqq6tk9HTo1SxjyI8thqTFfbkxn0ktiQ0oloWk+xSVJMyMj9JDjKqZpnCYwmHqNu5TcpiqmYmJ1TGmJfYRTAAAAAAB8n32YzTkiS8iOw0k1OvOKJCEkXaalHoREM00zVOERjKNddNETVVMREdMsE5jv3j1ItcPHGSyOck9FyUr5IiPgcIjNz9SWn2Q6PI8t3r3vXZ3I2fW8Ojv8ABxHFueMtlp3MvHxKtuqiO/63do63g6bqOtSnILIKOGuuWvRxcDxEPNoM+3Rxa0rMvR7OvqGxv8rW93+FXO914YeiIw9LSZT8wb3xI+Pbp3P0cYmPGZx9CV0KZGsIkWfDeTIiTWkPxn09i23CJSVF8JGONuUVW6ppqjCYnCXqFm7ReopronGmqImJ2xLkiCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQn3vwBzHrpeSVzB/Ql26anyQXsx5SuK0np2Jc4qT69S7iHf8v8Si/b+FXPv0+mn5tTxznPgU5S/+Itx/DrnT+jV0x2TrjvhgkdE4kAAAAAAHr8XzvKcPc5qO0cYjqVzO17nykdZ95m2rUiM/SWh+sfDnOHWM1H8SnGduqfFteG8bzfD5/g1zEfZnTTPd640s/UfUgwpKW8kx5ba/r5daslJP/qXTIy/XmObzHKs67VfdV7Y9jusl+YVMxhmLUx10T+7V/ulkmDvbtzNSnmu1wXFf3mVGeSZfCpKFI/8AnDU3OX85R9THsmP8XRWOcuGXddzdnZNM+qJj0u5/nT29/wD7XB/XK/Yij/h83/65fX/c3Df/AH0uBI3k22jErmyZtw06kSWmJDmpl3EaWjLj6ddBbTwLO1f+P0x7VFzm7hdGu9E9kVT5Q8tYdQuExSUUKLZWa+PKaGUNIPTs1NxZKLX9KPstcsZmr6U009+PlHray/z7kKPoRXV3REemcfQxrddRt9JStuipIlUSuBSJK1SnC9aSIm0kfwkobWxytap03K5q7NHt9Tns5+YOYrjCxbpo65nen1R5sLX+YZNlC+e9upNgklcyY6lcrKT9KWkElBfUIb/LZGxlo/h0xHn463HZ7i2az0437k1dXR+rGj0PNj6mvAGw7axiTG29xVqWSkunDJwiVrr4bi1Lb7fsFFoPMOMVU1Zu5NOrH/H0vfOWaKqOG2Yq17uPdMzMejBkAa1vQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB19rVwLuul1VnGTLgTmzakML7DI+8j7SMj4kZcSPiQts3q7NcV0ThMKM1lreZtVWrkY01RhMfL0T0IJbj7YWuCS1SGyXPx2QsyhWZFqaNexp/QtEr9B9iu7vIvROFcXt52nCdFca49cdXk8S5g5bvcLr3o961M6KtnVVsn0T0bIxcNw5oAAAAAAAAAAAAAAAAAZ12v2fsMmkRbvIGFwcbbUlxtlwjS7N04klCT4k2feo+0uCfSXO8X45Rl4m3anGv0U/P1ePX2vLXKdzO1U3r8btqNOE66+z9HbPT0bYmuhCG0JbbSSEIIkoQktCIi4EREXZoOBmcdMvY4iIjCNT9DDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhJjRpsd6JMjtyoshJofjvJJaFpPtSpKiMjI/WJUV1UTFVM4TCFy3TcpmmuImJ1xOmJRkzjp+S4p6xwh4m1HqpdDJX7OvoYeV2fAs/wBV3DreH8y4YU5iP80euPZ4POONciRONzJTh+hM/s1eqrxRmtqW2opaoNxXSK2UnX5GQg0GZF3pM+Ci9ZcB1lnMW71O9bqiY6nnOayd7K17l6iaatkxh/j3OsFz5gAAAAAAAAAAAGRcY2qzXKvDdh1SoMBzT/2lO1YZ0PvSRka1l+lSY1eb4zlstoqqxnZGmfZHe6DhvLGfz2E0UbtP2qvdj2z3RKT+F7IYxjSmptr/APEVs3opLkhBFGaUXHVtniRmXpWZ+kiIcjn+YL+Yxpo9ynq1z2z7HpHB+TMpkpiu7/Er6492Oyn1zj3M1dnAuwaB2IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADrrOoq7qMqHbV8eyiq4+BJbS4kj9JcxHofrIW2b9dmreoqmJ6nz5nK2czRuXaYqp2TGLC990+YhZKW7TypWPvK7G0H7wwRn38jh8/5ixvstzNmLeiuIqjwn0aPQ4/Pch5K9ptTVbn9anwnT/qYktenrMoZqVWS4Fw19YlLimHT+FLhchfrxu7PM+Wr+nFVM+MejT6HLZrkLPW/5dVNcdu7PhOj/AFMfz9ss/rTUUnE7BfLrzHGb95Lh62DcIbK3xbKXNVynv0eeDRX+XOI2fpWK+6N79nF5aTUW0MzKXWS4plrqTzDiNNO34yS7B9lF+3X9GqJ7Jhq7mUvW/p0VR2xMOuFqh92I0mUrkjR3ZCtSLlaQaz1Ps4ER9ojVXTTrnBOi3VXOFMTPY9NBwLNbI0+54raOJV8V1UZxtv0/HWSU/nj5LnEstb+lcp8YbGxwPP3voWa5/wAsxHjOh7ur2F3Anmg5UaHTtq4mqXISoyL9KwTp6+o9Brr3MeUo1TNXZHtwbvLcj8Su/SimiP0p/wBu8ydTdN9a0aXL/IX5neqNCbSwnX0G44bhmX6khqL/ADVXOi3REdczj6IwdJk/y9tU6b92auqmN30zj5QzFQbdYXjJoXVUEZElHFM18jffI/STjpqNP6nQaPM8UzOY+nXOGyNEeEOtyPL+RyWm1ajHbPvVeM44dz2w17cgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANNfmedZu8Gw+V4LtZtDbFh8q6oyyTIMsTFYlSHWnZT8RiJHOU0622STjLW4ZJ5z1QRGkubnnTGKdMYs4eWp1R7jdSm2eZI3RW3a5Tt9axoX32Mx2opWMaaytxsnWmEoa8ZpTSiUaEpI0mj2ebUzxVGDFUYNkgiiAAAAAAAAAACHfVF0/72bxyKW02f6lb3Y+TSQH40ihr25Hudm844S0OvvRpbC2jSXs8xNucO4ZiWYnBWh3W3Q6r9u88yXbjcPfLcJzJsIsH62wZXlttKaS4ky+UYWqTxQ6nlWk9C1SZakXYLYiFkYLhGNOuv47QPvuLeeerYq3nlmalLUplJqUpR8TMz4mZilU7oAAAFXrcvzQeqU95b68xTJo2MYbS3L0eo25drYb8RUKK8psmprjjSpC3HUp+VUl1Jkoz8PkIk6WRTCzdhZYwDKDzfBMKzQ4R1p5fQ1t2dcpRqOP9IRW5PhGoySZ8nicuuhdnYK1b1oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRt5mnXTlmE5RF2H2Oy+TjdxTtlK3My6odJEpp55GrFXHfT7TSkIPxXlIMlaqQglJNLiTnTSnTSnf5fU3fS06a8btd/p9lZZNaTpMrGJl0alWi6BxDXua5q3DNxa1r8VaVOe2bZoM9e0Rq1o1a02hhgAAAAAaleofo/wCsSRGznNNpusvOLN5cifdVG2CZVhUKJBuOPt18KbEsFEZpQrw2kKbSkzJOqk6+zKJhKJhqS6Ud9d7sm6pNioeSbx5xkES2zamjWsWyyGyltyWVyENqbeQ9IWTiTT7JkojLTgJzGhOY0La4qVAAAxZvhuK7tHs9uXubHritpWDY5YXEKsXz8j8iMwpbLbho1UlClkklqLsTqfcMwzCvf05+ZN1RW/UFgVZnGVtZriWf5PX0drh/0bCjtsNWkpEVCoKozLbqFsG6RoI1q59NF8xnzCc0xgnNMYLMYrVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwmZ4rfZGcNdJmUzFVxEOE4iMlSkPGs0mRr5XGz4aaF8I2OQzlrL4/EtRXjt6PRLScY4ZmM5uzZzFVrDHV09umEPc4e3Dw+7dorjL7aWaUJkRJCZ0k23Wl6klxKVL4cSUky7jIx3HD6cnmrXxLdqmOifdjROzU8m41XxPh9+bF6/XPTE79WExPTr7YS72qlSZu32NSpkh2XJdYdN2Q8tTi1aPOEWqlGZnwLQcTxmimjN3IpjCMY1dkPVuWLtdzhtmquZmZidMzjOuWQhrG+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdDk1TPu6eTXVl2/j0x40G1ax08zjfIolGRESkHorTQ+JD6cpeos3IrroiuI6J+Uvh4jlbmZsTbt3Jt1Th70a49MeaHm5ETcjBp0Zixze1soFohSokxqZIbQs2uUloU14hkky1I+8uPb2jueFV5LOUzNNqmJp1xhE6+vB5NzDa4pwy5FNzMV1U1apiqqNWuJjHROpnnYifOscIdkWE1+e+VnIQT0hxTqySSGjJPMszPTifAc3zHbot5rCmIiN2NUYbXb8kX7l7ITVcqmqd+dMzMzqjazQNC7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGvqL6Ttm+qKtpIe6FRLOfjbjiqPI6mQUSwjtvGk3mScNDiFtucpGaVoVoZap5T4jMTgzE4PZ7HbE7bdO+Cx9vtsKVVTSIkOTZ0h9w35k6Y6SUuSZT6iI1uGlCU8CIkpSSUkSSIgmcSZxZhGGAAAAAAAAAAAAFSzzMkJR1u72khJIIzxxRkRaFqrG6szP6pnqYtp1LadS1riv4MY59q4fzCBUqd8AAACBOYeWx0rZvuhM3UucWs27G1sDtbzF4lgpimnS1rNx5x6OSDcT4qz5lpbdQkz+t4q1lvSlvSnk000w02ww2hlllBIZZQRJShKS0SlKS4ERFwIiEUX0AAAAAAAAAAABWe8wTqX6gtvurvdvEMI3ky3FMXqPoD6MoKy0kRorHvFBXSHfDaQokp53XFLPQuJmZiymIwWUxGCyRjjzsnHqGRIcU8+/XRXHnVnqpS1MpNSjPvMzPUVq3cgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD9Su4edbY7O5Vk22OEWe4G4LiWazD6GriqmKTPsHExmZT7SCMzZYUvnXw46Ek+UjNScwzCBPSH5bkLDrhG9nU283uFvBaTF3LWOSXEzK+tmvrN5cmYtXMU2ZzqNXMerSFcUktRJcLM1bGZq2NtwiiAAAAAAAAp39LiEt9aWzaEJJCEbn16UISWhERWJERERC2dS2dS4gKlQAAOvtqmsvqqzo7qAxaU1zEeg21ZKQTjEmNIQbTzLqFakpC0KNKiPtIwEKdp/Ls6Zdmtyo+6eJ49ayr+sedkY5AtrA5sCrec1JLsVpSCWa20mZIU8tw0/GL2yJRSmqZSmqZTmEUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ46j/AMKaM+/6KLj/ANe6O65W/kV/e9UPJPzB/q7f3P3pZ+2g/Fxi/wDgHfn3BzXHP6y52x5Q7nlT/q7PZP7UskjVOiAAAAAAAAAAAAAAAAAAAAAET99ssyaiy6uiU17NrIrlQy85HjPKbQbhyJCTUZEfaZJIvqDs+XclYvZeqq5RFU70xpjqh5dztxTNZXO0UWblVNM24nCJmNO9Vp9CRuHSZEzEcWlynlyJUqogvSZDh8y1uLjoUpSjPtMzPUxy2eoijMXKaYwiKqojxl6Dwm5VcyVmuqcapt0TM7ZmmMZejHytgAAAAAAAAAAAAjZ1JEX0LjR6cSmvER/C2Q6vlX+bc7I83nn5h/yLP3p8noOnv8A3vtrI+baHy8zf1Ufdjzl93If/AF0/fq8oZzHPO1AAAAAAAAAAAAAAAAR26lupvbfpcwNWaZ9KckzZ61xsTxGEaDn20tBEam2UrMiS23zJN11XsoIy7VqQhWYjFmIxa7Nt97vMl6t4sjPdnKzBNjdsHHnWsdn5C0t/38mlcqyS89FnPSORWqTdbjNNGZGkvaSoilhEJYRDxOcdbPW30c7gU2NdT+J4xuTil4SnoOSUbJwkzWG1kl46+a02w14jPMXM0/GJfFJnypUSjYROowidTcLs9u5hO+e3eO7m7f2J2GOZGya20OkSJEV9szQ/FktkauR1lZGlRamX1yTUk0qOExgjMYMmgwAOmyPIaTEcfu8qySyZp8exuDIs7y1kGZNRokVtTrzq9CM9EISZnoWoDTtQ9ZfV71hZzkuP9HeI49ge3uKuNIn7hZegnnkk8ayZXINRPtoN0kGomWY7y0kWqlieERrTwiNbl7k7reZ90uVS9wNxoeAb4be1xk5k8ihir/xBjUuZbngR6yS2nTX5XwXW0dq+GmqIiTCJZ68tzqU3K6ldvNx7/dK3jWt9j2Uph16YkJmE2xBfiNOttkTKEkvRficVaq07TGKowYqjBsdEUQBHnqRy/qDwzDK606dNsardPKlWPJd0trMbiIYrksOrU+0TkqIbq/EShJISs1HrwSYzGDMYNHeYebd1bUd1cY1Z7e4Hh11RT3odpVSKi1KbFeYUptyO+mRZmRKSotFewk9SE92E92E27/rk6iN5osbHei3ZQ9w51dEiMZtuvZs+70LNq4wlcmLW+9yIrKvCWr47zx9+jSkcrisbsRrR3YjWh3l3XZ5i3Thk1czvtiUH3Sco/dq68o4zMKYlv9sTFsKlTSFrSSi15XV8vDVOnA87sSluxLb/ANJnV/t51Z4lNtsaYdxvMMe8JGY4LMdS6/DN4j8N5l5JIJ+O4aVElwkpPUtFoSemsJjBCYwS0GGAAAYE6iuo3bjplwCRnm4U5Z+Ks42OY3D5FWFrM01JiM2pSS0SXtLWoyShPEz1NJKzEYsxGLW3txv95jHV+3NzPY6iwfY/a5qQ6xSXeRtrklNUyZpW2l92NMckGhR8qnGojbXMXLrzJWQlMRCWEQ8fuJ1kddnRpmuP1nUnjeI7oYZkKlLhZDStHDbmIaNPjtwprDUcmnW+YjNEiJqZGRkWh8wYROowiW3bZHenBuoDbih3P29nLlUV0laHokhJIlwZbJ8r8OW0lSiQ60rtIjMlEaVoNSFJUcZjBGYwZZGGAAAauurrzKMd2OyeTtLtHjTe6W7rLyYVi2s3VVdZNdMibirRH0elyOZRJUy0pHKZ8puc5GgpRTilFOLylfWebzkdAeY/fZtniEmWj3qPtrLjxynoToRpZ5vcZbKTUR9jkzUuJKNJh7rPuug6SvMzvc53NibE9ReNVmN5tYWjlFTZfTGbcNy0bcNlMGbHNx9KVuupNtDrLhoUs0p5EkfOMzSTS3HiCAA8xm03KK3DctscIp2MhzSBSz5GIUEp1LDE60ajuLhxXXVrbS2h14koUo1pIiPUzLtAaK96PMo649kr6PjO42w2E7e2sxhbsRFlCs5jclCVcpuxJUa3KO6SD4HyKWRH2icUxKcUxLYf5fHUfuD1P7L5Lnu5Eeoj3tPmk3H4qaWM5FYOJHrq6Wg1odefM188tZGZGRaacO88VRgxVGCdgiiAADXJ1o+YZh3S5NTgWN0iM+3bkR0SZFK48bFfUMPI5mXJ7qCNanHCMlIYRoZo9pS2yNHPKKcUopxY8p6/zXM/xaNnsLcTafA1XkJuxp8DTES+tLLyfFQg5BwrFtKlINPL/jKy4lzKTxMNBoRl2r80renbTdF7bDq2w+H7rW2KajJ7mFCOvtqd4lEhUl6O2pTElkiMlmTSEGaD521LLlSeZp2MzTsb8o8hiWwxKivtyYsltLsaS0oltuNrIlJWhSTMjIyPUjIQQfYAAAFS7zNP7b29n+jf/pqrFtOpbTqWs8V/BjHPtXD+YQKlTvgABFDqn3D6ntu6rGLLpw2cq920ue/rzhqfJJD8Ftko/ufu0VMuK7IN41u8xNks08hezx1GYwZjDpaU73zfOq5iZKrX8K2/xudXSXWJsJVPapktONKNC2X0SbRZpUhRGSi5UmR9voE9yE9yFkilmu2NNU2D6UIenwmJDyUEZJJTraVqJJGZnpqfDUxWrdmAAOhynJ6HCsbvsvyiyap8cxmBIs7y0e15GIsVs3XXDIiMz0Sk+BEZn2EWoDT3jnWL1i9Yua5JS9IWJY9tztzi7yW5W4eXt+O4fOZ+EUhZoktIW8lPN4DMd1SC4qc00MTwiNaeERrcncrd3zOOlaqXn25kDAN8NvIakHkc6hiuEVe0Z6czhsMVshpJ97qmHW0npzaalqiIkwiUhvLc6i90epHarPMp3Vs4dtc0mXuVtbIhw2YSW4ioMV9LJoYJKVElbijJRkauPFR8NMVRgxVGDYmIogCHfVjuv1NbYfeD/q6bMRd3vpz6V+/H3lt9z6P929z9y5fBkx9PG8V7XXX4nDTvzEQzEQrIdW+V7m5x1CbgZRvHhbW3u49p9FffHh7KXEoh+BUw2I2hOuPK+UjttucVn8bu7BbGpbGpuapuqjzKo9RVMQujeskwmYbDcSQcedq40ltJIXwsS7S0MQwhDCG1DZ7Ic6yvbLDMi3MxhvDM9t69L+UYs0S0ohSjUojaSTi3FFoREfFRiMoyySMMACKfVd1c7d9J2Hw73K2XsgyjIFOtYfg0JxLUmetkk+K4t1RKJhhvmTzuGlWmpElKlcBmIxZiMUJtqd0PMf6scZa3X2zvNstltuLR6WzjEScyqfJmFFecjLNfPHsFlyPNKQpSyZ105ktmkyMSmIhKcIR/y/r463Ok3ddOCdR2PY3ncEiblqOPETATYVzitCk1NhEQyjtSpOrsdRpUSkrQSi4Z3Yk3YlvC2o3PxTefbvFNzsIlLl41l8IplebxEl5pRKU28w8lKlElxl1Cm1kRmRKSehmXEVzGCExgyGAAADVR1L9fuZVW77PTJ0qYXG3F3hemfRltczSU7BgziSa3orLKVtJcXHQk1PuuOJaZ5Vc5K5V8sop6ZSinplwrOk83XGqpWUNZvtZnD0VHvDmAwo7SZbpcprNklOV0FszLTl9mWRmfYo+0PdPdYv6TuvnqC306tcf2s3Bp6zDaByqtoeR4REgGwti2q4r7zjqlyycltK8RrkU0pwyT8IzNMRDM0xEN2gggAAAAAAAAiz1S7gdSm3eO0Nx057R1m7MrxZasxhTn+V6JGaQ2bCo0dMqM6+pxRqI0t86uBezxGYwZjBpZR5u3VHOyKtqJOIbfUKfpNuJYR0VVmTySU8ltbbvvFovlUjiR6JTx7RPchPchPPeTrw3UzDLrvbLod2rc3ltMaWcbLdzlRXZVJDkGo0eDEUhxllZkZHo868SFaHyIcQXOIxTtRinagHkPmIdfuxOcx6beamgsy20pkO4jkWPsQW5MZSjI3I8iCTClJPlNKXEOKTqXElaGQluxKW7EtnEbzM9jHen6o3kUzJezG6lu0cHZeK6l66cvWUoNUVJknjH0cbX7zyaci0ly+MfgiO6ju6UId1erHzRYlPP3Kb2cf2o29gtrkOR2ccRMXFiERLJ6cU/3iSnkSftuG20guJmlOnDMRDMRDLPQx5mWR7vZ5U7Nb6QK1nIskJTOGZzVtHFRKmoI1lDnRiNTaVupI/Dcb5U8xEg0aq5gqpKqW6IQQAAB+VrS2lS1qJCEEalrUehERcTMzMBp+3c8yLNMz3TLYforwKJudlz8lcL7+pxm9XuONEfjuQmUuMNmwzpqcp90muBmSFI5VqnFO1OKdr65g15t+3eKTM+ezLbncFqkjnOscDpK9EiyWylPM4lLX0ZD8U2y1M0syDWrTRHOfA2g0PfdE3mPUXUncs7Zbh0kTB913mHXqdUJxR1N0TCed1EUnlqdZfSglL8JSlkpKVKSvhyliacGJpwbQBFEAAGH98d9NuunnAbHcTcq4+jqeGZMwIDJJcm2MtZGbcSEyak+I6vQz7SSlJGtakoSpRZiMWYjFqWwzrU64esTMLqn6XMDxvbnDaI0fSGVXiSm+5ksz8Mpk2QhTKluknUmWIqlpLU9VJLnKWERrSwiNb3W4m8XmYdKtWnO906bAN9duYSiXlFjjrLrTleyZpLVxbUevdZIzPTxTjOtp+v01SEREmES049JU36T6wdi7LwvA+kNxqqT4PNzcnizkr5ebQtdNdNdBKdSc6lx0VKQAAa6er7qD6x9kLa7utp9hKPONo6anamSs3lKdmyGJBIWuUp6DCnsyEssERGpXhEnTU+fTslERKUREoQdN/mfdQ283UFtZtzktBg1XjWYW7dbbt1NbPbe8NSHFGttyTYyDSvUi7jLh2dozNMYMzTEQ36iCAAAOJYWEGpgTbS0mM11bWx3JVjYSVpaZYYZSa3HXHFGSUpQkjMzM9CIBpozvzKtzd3tzmtl+iPbmPl1rKecaZzq9bUaH2meL0piKtyO3GYRpr40pZ6kenhJUadZ7u1Pd2uXufkXmq7D4LZbsZTnW2OcY1jEYp+S0MGKz40aMXLzreSuDWmska6GTD6ldvLrwCMJNEpL9EHXXQdWkC3x64o2sO3UxaI3NuKKO6p2FOhmsmlzYKl/KJShxSUrbWZmjnRotepmWKqcGKqcGwARRAABra6yPMYwjpos3tvMQp29xd20NoVYU5vKZrqcnkEtk5zqCUtbq0qSomG9D5T1WtvVPNKKcUopxYsw57za92qSNm7GQ7a7NwLhlEmtxC7gG1KJlzVSFGwcG2eaMy09h91Ky4apI9RnQzoYzT5hnUz0wbkxNtOszbGvtq19KXm8vxttMeW/EUfIU2IaHPcpjZGk9WySwtJmZLNKi5A3YnUbsTqblcCz3ENz8Poc9wO8YyPE8ljFKpriNzEh1GppUSkLJK0LQpJpWhaSUlRGlREZGQgg9eAAADTxnPXvvTvbvPYbDdD2IU989T+8fTO5978rGNuKsm35cdKloZajIWZJS44TinTMvDbLVPNPdw1p7uGtz8vl+bTtDUPZvKuNt9662pbVItMSo4JuyfAbLmWomEwqh93Qi+Kw4pZ9yTDQaJcjy+utTdfqi3h3Zp8/fr6+hrKNi2xXEoMRCEwdJTcd4veuQnnCLnT+2KM+PDsCqMCqMG3AQQAAAAAAAAfwzJJGpRklKS1Mz4EREBM4I5ZZvm79KFj2AViLuet0o6LFwlONuOGenKw0gyNfqUaiL1GXEdTkuXo+H8XM1bsYY4dOHXPR2PPuKc6z8b8PkaN+rHDenTEz+jEa+3HDqmNLskRuoNEb39VhRuOERr+hVJR4np5OZLRI17v236oqmvhEzu7tf3vlOP8ApfRFvmSKd/etTP2NGPZqw/1d6OO5GW3OV28U8gqUU9vTRzgzY6OdJGtLil68i9TT8bs5j9Oo6nhWSt5a3Pwqt6mqcY8Hn3MPFb+fvU/Ho3LlEbsxp2zOqdWvbKYO0H4uMX/wDvz7g4fjn9Zc7Y8oescqf9XZ7J/alkkap0QAAMR7jbs1mDqTWRI/0vkTySUmCStG2SV8VTyi1PU+0klxMvRqRnu+F8Frznv1Tu0bdvZ7fNyvMHNNrhk/Dpjfuz0dEbN71Rrnq0PNQy6gLmKmzKZS0CX087VVIa5XSIy1IuU2nzSZ+hS9S79B9Vz/AIm1VuYV1YdMTo849ENdZjmPM0fE3rdvH6sxp8qsO+e10lNvZe0N85je5FW1FcYdJqRYRkmlTJq0MlrQRqStBkZHqjThxIjH0X+AWr1r4uVqxx6J6fZPb6Hx5TnLMZXMTl+I0RExOE1R0dcxpiY66ejaky24h1CHWlpcbcSSm3EmRpUky1IyMuBkZDk5iYnCXo1NUVRjGmJfsYZAGINx8vz/ABRb02hxmLZ4/Hipck2jpqWptzVXNzNNuoXypIiMz5dPWN5wrI5TMxFNy5MVzOiNsdsxhi5PmHi3EchM12LNNVqKcZqnThOnHRExOEaNOHexXim/OQWmSVsW/KpraRzxTsH22nUciG2lr5iUt1Z66kXDv7NBuM7y5Zt2aptb016MNMbY6oczwvnjM381RTf+HTb070xExhERM9NUu/stzdx8oU85t1iryaRpSktXD7HO49y9po8QybL9Loo/g7B81rhOTy2EZq5G/wDZidXhp8n3ZjmPieemZ4fZn4cfWmMZnsx93u0y8LXb655R2youUQ2pzbDnhz695goklv08ppJPKovskn/xjY3eXcret42Zwx1TjvR8uxpcvztxDK3t3M0xVETppmN2qPn7YlMCssYlvXQrSA740KwZQ/Gd001QstS1I+w/SQ4e9aqtVzRVricJesZbMUZi1TdonGmqImOyXOFa4AeMzm3yimqY8rEqRF9YuS0NPQ1koySwbbilOeypB8FJSXb3j7+H2LF25MXq92nDX14xo82o41ms3lrMVZW38SveiJj9HCdOuOnDxQs3Rucmu8hjSMrpUUVmxAbYbhoJREbJOOrSs+ZSj4msy7e4d7wexYs2ZizVvUzVM49eEPHuZc3mszmYqzVv4dcUxGHVjM4652yzHjWb7tsY9RR6rAWZ1ZFgR2IEw0uGbrLTaUIWejpFxItewaLN8P4fVermu9MVTVMzGjRMz2Ou4dxnjNGWt02stFVEU0xE6dMRGETrZ5w2zyG2pETMnqE0lqp5xC4KCUREhJ+yr2lKPj8I5zP2rNq7u2at6nDW7fhGZzOYsRXmaNyvGdHV0dMvVD42zAHlcwzCowqnct7ZajI1eHDiN6G6+6ZakhBH8GpmfAiH2ZHI3M5c3KO+eiIazi3FrPDbE3bs9URGuqdkfLQw5QZfuvuQmTY4v9D4zSRX1ME7I1fdUsiSo0HqlzUyJRHryILiN7mcjkOH4U3t6uuYx0aI9XnLkcjxXjHGYm5lvh2rcThjPvTjs1TtjopedyDcXdrbu2jxsoTXW8WSnnYeQzysvJI9FE262loyUnvJSeGpHppoPqy3C+H5+3M2d6mY69MdsTjofBn+YOM8HvRTmdyumdU4aJ24TG7p7Y7kh8PyuuzOijXlaSm0OmpuTFWZGtl5GnM2oy7dNSMj7yMjHMZ7JV5S7NuvunbG133CeKWuJZeL1vVOiY6YmNcfLoeoHxtkAACNvUl/7kxr/vz3zY6rlX+bc7I83nn5h/09n70+Tv8Ap7/AN77ayPm2h83M39VH3Y85fdyH/wBdP36vKGcxzztQAAY83A3Hp8BhNrlIOday0mdfVNq5VLIuBrWrQ+RBH36Hr3EfHTacM4Vcz1WjRTGuflrloOO8wWOFW4mr3q5+jTHT1zPRHyhjmns99Mxioua9ynxmtlJJyCzKbMjcbVxSoiNt9ehlxIz017S4DaX7XC8pV8OrerqjXhOqfGmHP5TM8wcRo+Nbm3aonTETGuNuque/Rj0OmPdzOMGvU0m4lUxMZUSV++xEk24bSj08Vo0/JuFwPhok9eBmQv8A+EyuctfEytUxOyduyemPS+T+6s/wvMfB4hRFUbadE4bY6JjqwhJWusYVvAiWddITKgzW0uxpCOxSVdnbxL1kfEhyl21VarmiqMJjW9Ey+Yt5i3TctzjTVGMS5orXADqry6r8dqZ11aPeBBr2/EfWRaqPiRJSku9SjMiIvSYuy+Xrv3It0RjMvlzuct5OzVeuzhTTGM/LbOqGA6nNt1txnpcnDIldjlHFcNtE6cRuGtRFryms0OcytNDPlRoXeY6S9w/IZCIi/NVdc9EfKPTLhsrxnjHGKqqsnTRbtxOGNWnuxwnGeynRtcfIcu3nwCM5Kv41XeVrpG2m1jNmaGXFlogz5SaNPtafHRofZqJZXJcNz1WFqaqatk9Men0Shn+K8c4TTNV+KLlE6N6I1T0at3p204TqxfX+crLP5n/vt98Z+nfpP3T3vwG+Xw/E/wCb05ddOHZ+eMf8Vl/+R+DhO5u44Yzs260v7izn/C/it6Pib+7jhGrHZqV1utfc6d1JdZ9njEy5KtxLHcnY26xh1xfLHhRo84ocuYfPyp+UkKcdUoyL2ORJmZIIczTGEPSYjCFmfHMz2YxLH6TFseznEqyixyDHraauZtoKW2IsVtLTTaSJ3sSlJEK1bXp5qdnttnPSxLlVuW49dZBiGTVNnTsQrCLIlfLLXBfShLS1LNJtyTUouz2SM/ikM062adaP/ktZ1ZLPe/bSQ+47UMFVZLUxzP2GJDhuw5iiL0upTH/WDNbNbfCIIACD/mPx7yT0Xb2t0KXFykRKp2ahojNz3Fq4guTDLQy0JLCVqWZ6+wShKnWzTram/LA6x9sNho+ZbV7sTlYtTZhatXVFmjiFuw2ZfgojORpZNIUtpK0toNLmhoLRXPylxEqoxTqjFYapchwncjHHJ2O3lLnOKXLC47syukx7KBJZeRyrbNbKnG1pUlWhlr2GK1aJXRn0pXHSs7vVTruay0w7NspK2wKLDOQqXDrm/HbaYnKeQlJuJaNotUGotSUevYJTOLMzim+IsAAAqieaLFjxutDctbDKWVS4GPvyTSWnO4dRESaj9ZkkhbTqW06lk3pqpKfH+nvZOsoqyNUV6cIopBQ4jSWm/GkwWX33TSkiI1uuuKWtR8VKM1HqZmK5VzrczfzZnGN/tqMv2uyqK07FyGGsqqwWklOV9i2k1Q5rKtDNK2XND4fGTzIPVKlEaJwInBVM6Sd1r/pz6nMEvnnna2NHvk4zuBX85pQ5WzHyiTm3SLUl+CfyySPhztpPu1FkxjCyYxhcVFSoAAFVHzEN2LTfbq7vMNbtCj4zt3aN4HjLLy+WPGkNPJZs5DhGrlJSphrJS+B+G22R/FFtMYQtpjCFknCMj2S29w/GcGxbOcUrsexOtjVVRDRbQSJLEZsm0mrR0tVK05lK7VKMzPiYr0q0IPM+tdss66Rcxdh5hj11fYhb0dxj8OJYRZMk33LBmud8JDbil8I8xwz0LsI9RmnWzTrRD8l3O7NrKd59snHnHaabVQcnhsGfybEmK/7k+pJa8FPIkNErhxJtPo4yrZrWABWgAIy9Ym88rYLpy3L3IqXUtZJAgIr8TUokq5bSzdRDjOkhRGlfgKd8Y0nwMkGQzEYyzEYy0O+VLttH3N6pJub5OlVwnbWll5K3IlqN9TtzKfbixnXTXqalp8Z14lGepOISrt4idU6E6tSz4K1apxhHRR1S1/UnjGN2O1eUGVVm0V6x3FXXSUUSo8Scl56xK0NHu5oU2g3EkTnOrglKTWZJFuMYLcYwWxxUqAABpu856DEc2X2lslx0KnxM1cjRpZl7aGZFdIW6gj9C1Mtmf6UhOhOh6jybP7MWd/1oWn8C0gxXrYr1ttIiiAADQT1i+W9v9u31NZfuBtu3T2OGbhSIc1dtaWiWF1jyYjMeQiQ2tJuqQTjSlN+CheiDSntITiqME4qjBvNwbGSwvCcOw4pzloWJ0dfTFZukSXJHuEZuP4yyLgRr5OYy9YggrFeavPxGz6s7ObillW2jrmM1LWUya2Q3J5bOOb7Cm5BtqUSXUMNspNJ6GREnUhbTqW06lhbpGsplt0u9Ps6e8qRLcwCgQ7IWZqWvwoLTZKUozMzUZJLUz7T4iudaudaRAwwAACpd5mn9t7ez/Rv/ANNVYtp1LadS1niv4MY59q4fzCBUqd8AAACoV5hUdiN1l77Nx2kMtquIjqkIIiI1u1sRxxWhd6lKNR+sxbTqW06ltfFfwYxz7Vw/mECpU74AAQP8y6PfSOjDd5FD4xqbKmdt0MfHOA3bw1SOwteUiLmXp9YStfZ1ISp1pU62rjyv+sva/YurzDaLdqy+9Ooym7Re43mDjS3IaJb0dqI/HmqaSpbKTTHaUhwyNBe3zmgtDOVUYpVRisHVlxhe5GMvSaa1p84xC/jOxX5MGQxYQJcd9HI60a2lLbWlSF6KLXsPiK1aJXRZ0o23SlD3eoZF9AusezHK1WuGNxDfN6NWNpW1Hbl+MhJeN4fLzcqlFqXxjEpnFKZxTeEUQAAVLvM0/tvb2f6N/wDpqrFtOpbTqWs8V/BjHPtXD+YQKlTvgAAAajfMq6Ld2+pHJNt832jjwbmdj9ZJpL+kmzmoKkNKf94jyGVPmltXFxxLhcxK4I0JXHlnTOCVM4Jk9F+xWQdOfT3h22OV2rNrksJ2bY3RxFm5Ejvz5C3zjR1KSk1JbJREZmXtL5lFwMhGZxliZxlrT86J/DZdXsq2za1zueUs+1ZlVDUhlU5qtmMR3Od9hJm6TZuMp5FKIi4q07TEqEqEhvKAtZVh0qXESR4nhUWf28GFznqnwlwq6WfhlpwT4khfD06jFetivW2niKIAAKjWwm97/TN1mT9xdyKydYFVZFkNVuHESlKrBBznJEeU8gnNNXWnlE4adSNZJUjUubUWzGMLZjGFobajf3ZvfCrbtdrNw6fLkKbJ1+ujPk3YR0n/ANpgvcklk/8ACNkK5jBXMYI7X3SHKc64MA6r8UtKulpq+nmw9xseMnkS7Kc7Wza9iU3yINpXsPsEslqT+1EotVGM46MGcdGCdAiiAAAAAAAAAKdfXLGjxerrf9qMyhhtWWynlIbSSSNx5KHXFmRd61qNRn3meotp1LadS2vtjtnhez2DY/t1t/TN0eLY1HJiBDRxWtRmanHnnD4uOurM1rWfFSjMxVMqpnFrP84rFqWx6dcNyyRDbO/xnNosWqsuUvFRGsYcspTBKMtSQ4phpZkXehPoEqNaVGtG3yaNs8KvLfdzcy5o49pmGGuVNbillKQl36Pbnty1SnYyVEfI64TSUG4XtEjmSkyJa+aVcs1t/brTT7TjD7aHmXkGh5lZEpK0qLRSVJPgZGXAyMVoKc1xWxdtete1p8QSdXBwLe2RBxhtB6HHZq8jU1FSRp5fiJbSXDQXdC3oXHRSqAABrf8ANF3stNo+mibSY7KVCyHdmyTirctpSkOsVy2XH7FxCi4e202TB9+jpmXEuEqYxlKmNKJHk91m3GKYVuvufkuTUNPlV3dtYvXos5saNJZr4EZma6bRPLSrw5DstHNpwM2U/wByM1s1tzf86m2H9I+L/diF/wDfCGCGCpJvrbMbP9Y24eUbaTopMYbuM/kWISa9xC4qCTNKew00pvVBto5vD0LUuUtOJC2NMLY1LhsGY1YQYdhHJRMTmG5DJLLRXI6klp1Ljx0MVKnKAAFVbzO99bLdnqVyLEWJqlYbs4teM0cFKj8M57fKdtIUnsJw5JGyZ/3DSO/UW0xoW0xoWHekzZ+q2N6fds8CgQ0RbBmnjWWVvJIueRcz2kPznVqLirRxRoTr2IShPYkhXM4yrmcZSAsa6Bb186ptIbNhWWkd2JYwJCCcZfYfQbbrTiFakpK0qMjI+0hhhT16U4rMHrJ2ThRkmiPD3LrWGEGZmZIbnklJanxPgQtnUtnUuLCpUAAD8ONtutradQl1p1JocbWRKSpKi0MjI+BkZAKhnRlHZh9bmzsSM2TUeLnC2Y7RGZklCPHSktT1PgRC2dS2dS3sKlQAANPnm/b5WmE7V4ds5j01cOXuxKkysqeZVyufQ9UbJ+7K04kmTIdQZmR8UtLQfsqMjnRCdEOv8nDaytp9ps/3ekxEKyDM79VDXzFERrbq6pppw0tqMtUk7JfXzkXb4aNewtFclcp2dbO3WYbr9LW8GB4CwqXllxWRXqqvbMicle4T4056K3qZEa32o620lrxUoiEY1oxrahvK66bd9cL6i52d51tlku3+MY7jdhDlTsjrZVUUqTNU22yxGRKQ2p74qlqUgjSkk+0ZGpGs6p0J1ToWIBWrAGGOondNOymx25+6Wja5eH0MmVUNO/tbli4RMQG1/YrkuNpP1GMxGLMRirV+XtgS+oDrJobjPVuZOVKuyz/LXZpE8qdLjrSppyRzkZK5p0lpa9S9rinvFlWiFlWiFrsVKmtPzV9rK7O+le5zD3RLmQ7TWUK7qJSST4pRZchqBPZ5jLg2pt5LqiIy1NpPo0EqZ0pUzpQg8m/emyhZln+wtnOU5RXlarK8WjOqM0sWENxmPMbZLXgchl1C1Fpp8jrwMz1lXCVcLBYrVgDG280e8l7P7rRcZS4vJJOHXrWPIaI1OHOXXvpjEgkmRmZuGnQiMgghWK8unqhw3pk3fup24jUhrCs8qU09rexW1PrrHWn0vsSVsNpU463wUhZILmLm5iJXLynbVGK2qMVoLAd0tuN06orvbjOaPN6zRJuyaaazL8I1FqSXkNqNbSvSlZEou8hVgqwRU2e6Rpez3VxvPvrj8+njbd7qUq2o+KsE8mfEtpMmFKlOaeGTJMuPNPr0JWpGtJEWhCUzoSmcYTnEUQAAAAAAAGEN+MpeocSbq4bptTMkdVGUsj0UUZsiU/p+m1Sg/Uox0HLmTi9mN+rVRGPf0eue5xnO/E6srk4tUThVcnD/ACx9L1R2S8B05Y8w69eZO+2S3YhogV6z48ilp53lF6+U0lr6DP0jZ805qYiizGqdM+r1tF+X2QpqquZmqNMe7T1Y6avRh6Urhxj1BDLqLjMM5fVyGmkoel1aDkrItDWaHXEpNXpMkkRa+giHecr1zOXqidUVaPCHkP5gW6ac7RVEaZojHrwmYSE2g/Fxi/8AgHfn3BzHHP6y52x5Q7zlT/q7PZP7UskjVOiAHWXVm1S09pcPlzM1cR6U4nvUTSDXyl6z00F2XszeuU0RrqmI8XzZzMxlrFd2rVTTM+EYoR7YqZybcxi5yWU0o0LftJLkhaUIU8n9rIuYyL2VqSZF6vQPQOLxOXyU27UT0Uxhs6fQ8a5bmnO8Vi9mJjXNc46Ix6NeyZjCOpNr6dpP35g/+Ia/ZDz/APD3fsz4S9l/G2P/AGU+Me1E7qHTWyLrH7SBJYkuSobseSthaV/tCyUnm5TPj8qfaO05Ymum1XRVExhMTGPX/g8t5+i1XftXaJiZmmYnCYn6M6NX3mcdlrR+028pjkqNbsA3YROKPXVDKzJsv1KDJP1Bz3HrMW85Vh04T46/S7Tk/M1X+G297XTjT3ROj0YQyqNM6cAcKybQ7XT2nEkttyM6laD7DI0GRkYstTMVxMbYU5imKrVUTqmJ8mvbbaqg3ec45WWTJSIMiSZyGD7Fk22pwkq9JGaSIy9A9N4reqs5WuuicJiPOcHgvL2Vt5niFq3cjGmZ0xtwiZ8NGlsTbbQ0hDTSEtttpJLbaSIkpSRaEREXAiIh5fMzM4y9/ppimMI0RCJPUjWR2LXGbZttKJFjHkx5CiLQ1FGU2aDPhxPR4y1/QHa8q3Zqt3KJ1RMT44+x5X+YeWppvWbsRpqiqJ/y4YftMv7IOuO7b0hOKNXguS229e5JSHDIvqajR8wUxGdrw6vKHWcmVTVwu3j0TV+1LLQ0rqQAAQk6hPw8Z+1Uf5x0egcs/wBLP3p8oeN8+f8AYx9ynzlKfbn8A8R+1Ub5shx3FP6q596fN6Zy/wD9dY+5T5PaD4G4AABhbefArjN66mXRk27OqXneaI44TZLbfJJKMjV7OqTQXb3ajfcB4lbyddXxNVURp16v8XH838Dv8TtW5sYTVRM6JnDGKsO7GMIdttHhVnhGNyIFu62qdPmKluMMq50NEaEIJPNoRGr2NT04Cnjefozl6KqNURh26ZfVyrwe7wzKzRdmN6qrewjVGiI8dGl5HqIdrlYlXsOvs/SaLJpyLHNaSe8M23ErUSNeY09mp6adg+7leK/xFUxE7u7OOzXDVc/1WpydNMzG/vxMRjpwwnHRsdT02PuKqsojGfyTUuO6hP2Tjakq/OQQu5rpj4luenCfP53y/l5XM2b1PRFVM+MT7ISXHJvRQAARt6kv/cmNf9+e+bHVcq/zbnZHm88/MP8Ap7P3p8nf9Pf4BvfbWR820Pm5m/qo+7HnL7uQ/wDrp+/V5QzmOedqAP4ZkkjUoySlJamZ8CIiAmcEA1WTe4W6UWXavJTWWFmhPK6okoRBZVqTZmrgWraePrMzHpXwpyORmmiPein/AFT0+LwucxHF+LxXdn3Kq416tyOj9WPGU503dEhKUpt4CUpIiSkpDRERF2ERcw87nL3Z+rPhL2qM5l40RXT4wjz1DqqbCjoLGJNiypcOcuMfguoWsm32lLPUkmZ6atF/8jHT8sfEou101RMRMY6Y2T87gefps3cvauUVUzVFWGiYnRVGP7ruenW2dl4taVTq+dNRO5o5Hr7LchPNyl6udKj+qKOaLMU36a4+tHl82D7OQM1VcyldqfqVaOyqMfOJnvSDHMu8AGDOoNEpWBtHH5vBbtY6p3L2eFyOkXN6vENH1R0PLM0/i5x17s4duj1YuK58iueHRu6t+nHswn97B4jZTczHqel+9a/lpqnWZLjsCa6WjC0O+0aVr7EGSteKtC07xsOP8JvXbvxrcb2jTHTo82m5O5jy2Xsfhr9W5MTMxM/RnHomeicduhJaXGrMiqZUN1TU+rtGFsuqbUlaFoWRpM0qLUtS7jLsMcpRXXYuRVGiqmcXot23azlmqicKqK4mNGnGJ62Df5nbr+br7yvpaF739NfSPvnynheF4fJy6cuvNrx07PWOh/5y1+M/Ebs4bm7hoxxxcX/aV/8A4z8Hv073xN7HThhhhs1qnFlSVVn1MT8cy1LsajsNzXa3JkJM23W4jtybMoiURapUSDVx7jHPdD0PoWIPyTnSF+82Ufdx39gK9+Ve9J+Sc6Qv3myj7uO/sA35N6UhOnzo32U6ZLnIb3ayDbxLDJ4TUC1VZWC5iTZZc8VJISpJcp83eMTOLEzilSMMADg2lZXXdbY01xBYs6m3jPQrStlNpdYkRpCDbdZdbURpUhaFGlRGWhkegDQv1E+T/dptbHJOm7JYcmnkqU8nbnInlsyIpmevhQrEyWh5Op6JS/yGki4uLMTivanFbWbc4V1U9HGVxriwqsw2YvfFJqLkENxaIMxSNVeCmbFW5Dlp015m+dadPjJ0MT0Slolvq8u3rmuOpuFebd7lsRmt1sOr02ZXMJtLDF1WE4hhyQphGiGnmnHGycJBEhXOk0JTxSVdVOCFVODZ8IogAAqmeaX/AGztw/tXj/8ABUYW06ltOpZZ2C/ETsr/ACDxv+C44rlXOtloYYUqN845WPUZvDFx5Dikz9x8hao2+YvEMnbeQmOXMnhrxLiXAXRqXRqXVxSpAABS73bgV59Um51Xk/NEqv51LqLkPtcimo/028iT7Ra6GlPNxF0al0alhf8AJOdIX7zZR93Hf2Ar35V70n5JzpC/ebKPu47+wDfk3pZ66f8Aos2O6Z8luss2ugXEW3vqw6mwXY2K5jZxjebf0ShSS0PnaTxGJnFiZxSzGGABq/8ANyYmPdJiXIxLNmLmtM7YGlWhEybUtsuYtS1LxFo4enQ+4So1pUa0LvJZnQW8/wB861wk/SUvH6iTEM+Xm8CPKfQ9pqfNpzPN66Fp2a92sq0q1hEVqwAAAABp485v8RO1v8vE/wAFzROhOh33k2f2Ys7/AK0LT+BaQYr1sV622kRRAABqZ6yPM7ptisottqdosdiZ3uNSqOPkt3YrcKnqpZkRlFJtlSHJbyNflEpWhLZ+yalLJaESinFKKcXQYD0ydX/VVSRMr6td+ch28wrIGifi7M4h4NY+7Cf0UlFh4CSZb5kHwbeRIcIj+UNCyNIzjEamcYjU1Y+Ydsdtz0975023m2FQ9U481htbPk+8yn5j8mY/JmJdkOuPLVopSW0J0QSUESS0SR6mcqZxSpnFZE6Por8TpW6eGpCPDcXt9j7yU6kfsPwWnWz4GfahZH/w8RXOtXOtI8YYAABUu8zT+29vZ/o3/wCmqsW06ltOpazxX8GMc+1cP5hAqVO+AAABUQ8xH+2dvp9tIH8FQhbTqW06ltHFfwYxz7Vw/mECpU74AAddb1FXkFVZ0V3Xx7amuYr0G2q5TaXWJEaQg23WnW1EZKStKjIyPtIBoX6h/J9v2rWxyPpvyiHNppTrj6Nu8keVHkxCUZqJmFY8q0PJIz0ST5NqSkvadcVxE4rTitrOtsU6qOjnKYtlPgZjsteOOkiLcxXXGoM1TZmo2ilRluQ5aS0M1N860mXaWhieiUtEt/Hl4dcNn1QVN7gu4zEWPuxhMJue/ZQmyZYuaw3EsKl+An2WnWnFoS6lOiDNaVIJJGaU11U4IVU4NmQiiAACpd5mn9t7ez/Rv/01Vi2nUtp1LWeK/gxjn2rh/MIFSp3wAAAIK9ZPXTgvSXCrqZVSvNtzshjHLpcOae92aYiGpbaZk6RyOcjZrQokoSk1rMjL2S1WUopxSinFCnaRvr06+KlOaZLuwXTvsZYPOswmsSjOwZlq2hRoeKFo77041qk21OPSuTXXkQvRZFmcIZnCEdPMY6PtoOmTbXbCzwNN3bZVk+QzY+TZhf2LkybNQiMTpEtCCajp9szPVLRK9KjGaZxZpnFsA8oT+ylY/wAvLj9ywBGvWjXrbSxFEAAGsDrK8tfEuo27mblbfXsfbzdKa2X017wypyouVto5W3JSWvlGHuCSU82S9Ul7TSle0JRVglFWDSDut0TdVfTw65k13gVmqoo3FPtZ9ib52EWOlo/8pU7DPx4qS7SW+23+aJxMSnFUSmf0K+ZFuVT55iu0e+uQPZ1hWWzmKimzKzUbltUTJS0tRjflH7UmOtxRJWb2q0a85OciDQeKqWKqVi4VqwAAAAAAAABTx67f7Xu/v8qHvmmhbTqW06lw4VKmrTze/wCylXfy8p/3LPEqNaVGtgfyVPwY6gvtpjvzM8ZrZrbwxBBTx3U/t17j/wBfFx/6neFsalsalw4VKgAAaQfOqZdViWwMgm1Gw1b37bjpF7KVuMQjQkz9JkhRl8BidCdDB/l0dFvT/wBTGz+YZVubFuJmV0GYyKptFdYuQ20V30fBfjmpCUmRmp1x7jrrwGaqphmqZhsB/JOdIX7zZR93Hf2AjvyjvSfknOkL95so+7jv7AN+TelskhRGYEOJAjkZR4TLbDBKPU+RtJJTqffwIRRckAAUrt/W/cupLelvIGXXii7lZEV0xzczqyRcSPGSSyUWpqLXiSuPbr3i6NS6NS6ehaXEpWhRLQsiUhaT1IyPiRkZClS/QCnj0v8A9tTZ3+tCB/CJC2dS2dS4cKlQAAACof0d/wBuTaX+Xj3/AAvi2dS2dS3gKlQAAK5/nPMTE7z7SSVkv6Pewp1qMo1ap8ZuxkKe0TrwPlW3qenHh6BZQsobEPKlnQZfR3iseISSfrMgvo1npy6m+qYp8ublMz18J1v42h6erQRq1o1a2yARRAAAAQE8ztie/wBFW7fuJmbbL+Pu2LZFqao6byBroWh/FXyqPs4EYlTrSp1tUfk3SIrXUxnTDqUJkyttbFMR1S+Uz5beoUttKPrjURc3pIkn3aiVepKvUsritWif10PxI/SJv85NQS2VYpJaQk1+H8s6tttk9e/RxST07+zvGadbNOtoR8qOFPldYWNPxFqTHrcdvZNoRa6KYVF8BJK07vFdbPj3+vQWVallWpaeFSoAAGmXqw8qGq3HyK73F2Cv4GF39489OusCtkrRUPy3VG465CkMpWuLzqMz8I21N6n7JtpLlE4qTipp/wBwOm/qq6V7RvK7/DsmwM6lwvc9xMfkKchsms+VBlaVri0MmvuStaFH/ciWMSljEtsXl2+Ybm252aVmw2+Mxu+vblh77xM+8NDMl9+K0p5UGwS2SG1mpptRtukRKNSeVfOpZKKNVKNVLdwIIAAAAAAAAIo9SqXPecQWevhG3OSjjw5iNg1cPgMh2XKkxhd2+763l/5iRO9Ynowq/dez6dlNHhFglHBxNy/4xGfebDGhl6tNCHw80RP4qn7kectxyBMfgKojX8Scf1aWexzbuEOeo/8ACmi+1RfPuDuuVv5Ff3vVDyT8wf6u39z96WfdoPxcYv8A4B359wc1xz+sudseUO55U/6uz2T+1LJI1TogB4Pc9C3Nv8sS2Rmoq9xRkX9ynRSj/MIxseETEZu3j9ppOZImeG38PsShvtRjVLlmWJpr0nFRXojzjKWnPDUbrfKouJfY8w7rjObu5XL/ABLevGPB5Hyvw6xn858G/juzTMxhOGmPmxSb/mD29/7PO/8AFK/QHJf3Jm9seD0f+xuG7Kv1j+YPb3/s87/xSv0A/uTN7Y8D+xuG7Kv1mSMYxiqxGqRT06HEQkOLdSl1ZuK5nD1V7RjVZvN3M1c+Jc1uh4bw2zw+z8Gzju4zOmcdb0I+Z94A4k//ACGZ/gHP+SYnb+lHaqv/AMursnyQF2g/GPi/+Hd+YcHpPHP6O52R5w8M5U/7Sz2z+zLYKPM3vCLHUv8A/wAK/wD3L/8AKjseU/8Ay/5f3nmX5i//AOf/AD/uMk7Gfi4qP8PL+fWNTzD/AFlXZHlDouSv+rt9tX7UsvDSOrAABCTqE/Dxn7VR/nHR6Byz/Sz96fKHjfPn/Yx9ynzlKfbn8A8R+1Ub5shx3FP6q596fN6Zy/8A9dY+5T5PaD4G4AAB4HP9wqjAa9qRNQqZYTeYq2sbPlU6aNOZSlGRkhJalqeh+ojGy4bwy5nq5inRTGudntlouO8es8KtxVXG9VV9GmOnDr6I+WDDlBc7r7sKefh2jWHYyhw23JkRsycUZdqWlmfiKURHxMlJT/wDe5mxkOGYRVT8S5sn19EeEy5LI5zjHHpmqiuLNnHDGmNPZE/SmdummPJ1G6u2VBiGIJt2H5tneP2DLUm2mvGta0rQ4avZLRPE0l2kZ+sX8G4tdzWY3JiKaIpnCIjsfLzPy5l+H5L4tM1VXJriJqqnGdMT3ec9b0HTY2ZVmVPalyrlRkEXfqhCzP8A5Q+Xmufftx1T6n3fl3T/AAr0/pU+U+1Jgcm9GAABG3qS/wDcmNf9+e+bHVcq/wA252R5vPPzD/p7P3p8nf8AT3+Ab321kfNtD5uZv6qPux5y+7kP/rp+/V5QzmOedqAOvtkOuVVm2yZk8uI8loyPQ+Y0GRaGXrFtmYi5TM6sYUZqJmzXEa92fJrtwWrrrvLqGotkrVX2MkmH0tr5FHzpMk6K7va0Hp/Eb1dnL110fSiMXgPBMtazOdtWrv0apwnDRr1elLn+YPb3/s87/wAUr9AcT/cmb2x4PVf7G4bsq/WP5g9vf+zzv/FK/QD+5M3tjwP7G4bsq/We4xHBaDCG5zVE2+2ixU2uT4zpuam2SiTpqRafGMa/O8Ru5yYm5ho1YRhrbrhXBMtwyKosRPvYY4zjq/xexHwtsAODZVsG4gSqyyjIlwZrZtSY6+xST+DiRl2kZcSPiQstXarVcV0ThMalOYy9vMW6rdyMaaowmETsq6ebmK67IxOa3axDMzRXylEzJT6Eks9G1/CZp+Adpk+Z7dUYXo3Z2xpj2x6XlvE+Qb9uZqytUV0/ZnRV4/Rn/SxKh3OtuLFOh2ONSzPmJtRKS09pprqk9W3S/NIbqacrn6Pq1x6Y9cOWiriHB7v17VXon92qPFnX/WFV95/je4tffj4vu/g6K925OXX3nTXXTu5Obt49g53+2P8A6MMZ+Fhj1/d+fY7b+/Z/BY7sfiMcMPq/f9W7jr6lfrzMtgrfZvqPyDNIUJxrCd4JLuT4/atpUTaLJ5RLtIpr7nEyFG9oX1jqNOw9OUpnQ9QpnGG9Xop6t8P6mtsKEnLuLH3ax6vajbgYm66lMs5EdKWl2DDSuU3I8g9HOZBGSFK8NR8xca6owVzGCXOSZLj2H0dnk2V3cLHcepmFSbW6sX0R40dpBamtx1wySRfVGGEFulLqs3E6od4N4bDHsUhxOmTEibrMNy2Uy8xZy7Zs29SSo1eG4h1s1vLRyEplKmSUeqz1lMYJTGDYIIogDVt5uUu3rOmjErmktpNNPpdyaiW3KiuLadMyrrRtJEtBkZaKWSvqCVOtKjWlF0hdTWL9T+0dJltdPYRmlVGYhbkY0kyS/AtEo5Vr8Iv7xINBuMqLgaT5dedC0pxMYMTGDMe7WNYJl+2ec49uazCdwKwppf30OTySbDEVtpTi5JqV8RTHL4iVlxSpJKSZGRGMQxCvl5OmJXVl1C5pmLERf3vYvhcmFZWPKfhpl2UyL7sxzdnMtDDqy9SDFlepZXqWURWrAABVM80v+2duH9q8f/gqMLadS2nUsU9JeeYtuJ047OXmJWrNrChYpU1FkltSTci2FdCZjS4r6CM+RxtxBkZH2lootUqIzrnWrnW9D1C71430+7R5hujksllCaKG4mirnVaKsLV1CihQm0kZKUbrhER6fFQSlnolJmSIxIjFW68u/p9yPqG6janO76K9Nwnbi1byvNr19OrUqybdOTCh66aLW/ISTi09nhpXr2pI7KpwhZVOELVwqVAAAq6eabsFbbX9QtpuVDgLPBt5DK2g2DaD8Ji3Q2lFjEcV3OLWn3gtdNScMk68itLaZ0LKZ0NzHQh1dYj1FbU4xR2eQRmd48SrWq/MsbkupRMmHDQlorSOhWhutvpIluGgvk1mpKtC5TVCqMEaowTdvb6kxinschyS3h0NFTsKk2tzYPIjRYzKC1U4664aUoSXpMxFFAvpn6tM96mt/t2I+EY1BV0w4PGRXVGbymn2Z8y3Qr2Vx1GrlUiQk1uG2pBKbaS0pRoWvkVKYwhKYwhsKEUQBH3qo2bVv7sBuZtXGNpFvkVX4uNvPHyoTawHUTIPMvtQlT7KELUXYhSuBlwPMThLMThKr90ib32XSP1JVeTZZWza+shuS8U3Ro1tKRMZgvOpRKSbJ6K8SLIZbd5D4mbfLw11FkxjCyYxhbixXLMYznH6zKsOv4OTY3csk/V3Va+iRHeQfelxBmWpHwMu0j4HoYqVIbdZnWNW9PlHFwjAEMZn1C5w4zX4FgkdBzHGHZS0NolzWGlEsknz6Mt/GeXoRFyEtSZRGKURimDg8nLpuG4vMz6vgVObSquK9ldXVuLdhRrBbSVSGmFuaqUhCzMiMzP4T7RFF6kAAab/OdmxUbLbS1630Jmys2ckR4xn7S2mK6Qh1ZF6EqeQR/piE6E6HceTRaQHenbcalblNrtIG40ubMhEovEbjzKirbYcUntIlqjOkR9/KfoCvWV623gQQAABS12ju4FZ1L7dZFu6ozhQtxqyw3FesDIuU0Wjbk5yVzcDJKiUpwj7SIyF06l06lz4rGvVXlbJnR1VSo/vZWZOoOOcc0eJ43i68vJy+1za6acRSpVSvMt3bwPeLqbn3m3d23klBj1BBx56+jaKhypcN6S4+qI6RmTzSTeJBOF7KjIzTzJ5VHbTGhbTGhY06QLqsv+ljp4m1MtubGjbe47WvutqJRJlV1ezDlNHprxbeZWgy9JCudaudaRowwAACpF5k8+HY9bG98iDIRJZbkUcVbiOwnotBXR30fChxtST9ZC2nUtp1LWOBWdfdYNhlxVS259ZaUdfLrpzJ8zbzD0ZtbbiD7yUkyMhUqesAAABUL8wt9mR1l77OMPIfQm3htqW2olES2qyIhaTMteKVJNJl3GWgtp1LadS2VglhBt8Iw+0rJTc6usaSvkwJrKiU26y7HbWhaFF2kojIyFSp6oAAaqvN6u7fHunLby1orOTUWUTdOpcjzYjqmnEqbqLlxJkpJkfBSSP4SEqNaVGtLjpN6l8U6n9p6XNKiXGj5XCYaibg4qhwvHrbNKdHNW9TV4LxpNbKz4KTw+OlaU4mMGJjBkzevFcCzXabcDHdz2YjmCTKOY5kcialJtRWI7SnveyNRp5FxzQTqFEZGlSSMjIyCCGgfyccNvLLf7Os4ZjOJxvFsMfrrGw5TNs5tnMiqjRzPUuKm4zy+/4nZx1E6069SySK1YAAKmPmbtOt9bm863G1IQ+nG1sKURkS0ljlYg1JM+0uZJlqXeRkLadS2nUsu9N+6mMbx7K7dZtjFzGtkTqGvbumWVpU7Csmo7aJcSQhP7W406SkmWmh/GTqk0mdcwrlmpiTGlJWuNIbkIbWpta2lksiWg9FJM0mehkfAyGGH3AAFRzzHH7x7rN3qK9NfjMzK1uuQo1GlMEqqGcUkEoi0I2zJR6FpzGrt7Ttp1LadSzp01X2HZJsDs9ZYFKiycXTiNRFrkRFJNEc4sNplyMtKTPkcZWg0LSfFKiMj4iudaudbTb5xG82C5TJ2y2oxfI4t7keF2FlY5tDhGTyK5x5plmKw88kzSl5RE6ZtkZqSREa+XVOs6ISohKXye7esl9MWR1Macy9aVGd2KrOvSsvGYRJhwVMLWjtJLhJVyq00M0qIj1SoijXrYr1trgiiAPBbqkStr9yEqIlJVi1wRkfEjI4TwQQ1FeU51XVVti0npvzu9RHyimlybHbaTOeIjsYcxw35UFC3D1W+y+pbqU66qQs+UtGzE6oTqjpbshBBVl6odo8dtPMXkbX7KwGIxZDlOPE9U1Lf+K11jKZiyLJTaWtSQhkzW+7poTR+IWiSRoVsToWROhaaFSsAAAAAAAAAU7OueQxJ6ut/nI7qHm05ZKaUtBkZEtpKG3E6l3pUk0n6yFtOpbTqXCYM6HZwYdlXSW5tfYMNyYMxlRLbeZdSS23EKLgaVJMjIy7hUqaufN/kMNdK1O066lt2Vn9SiO2oyI1qTCsFmSS79EpMxKjWlRrYC8lOdEOm6hK33hHv6JuOSTimei/BU3YIJZF3lzJ0PTs4a9pDNbNbeaIIKcW7lpXRetjc66emNJqY+911NdsEq52ijoyR5w3SUnXVPIWupdwujUtjUuNoWlxKVoUS0LIlIWk9SMj4kZGQpVP0AAILeYjsDZ9QHTffVeMQF2WbYLLayrE69pJqeluQ23G5URsk8VKdjOuciSI+ZwkFproZSpnCUqZwlpd8svqsx7p43OyDDtxLFNPt5ukiKxLvJBmTFVawjcKLIf4HyNOJeW06rgSfYWsyQgzKdUYpVRitBQpsOyhxbCulsz4E1pD8KdGcS6y804RKQ424gzSpKiPUjI9DFStALrP6zXdk/vd2s2Xjws96jM2s4cOiw5CffUwWnHUaqmsMuIWS5BGTbTZqSo+Y3NSSj2pRGKURinbjjl89j1C9lUaHDyh2uirySHXLW7DanqZScpuOtwiWptLvMSDUWpp01EUXcgACsD5qfT9a7Z7+Td1a+CtWC7xmme1OQn5KNdstJRPirMtdFO8hSEmenNzrJOvhq0splZTOhuK6AOqjGOoTZnGaKXbst7r7fVUaqzagec/xp9ENBR2bRslaG43JSlKnDSWiHDUg9C5DVGqMEaowS83G3IwnabELjO9wshiYzi9Gyp2bYy16cxkkzSyygtVOur00Q2gjUo+CSMxGIxRwVCOm7KaOp6sNnsttpzdVj7e49XNmWUxaWWo0d2xQfivrUZJQhBK1Woz0SWpmehC6dS6dS5cRkoiUkyUlRakZcSMjFKl/QAB+VrS2lS1qJCEEalrUehERcTMzMBT76SL2qr+tLZ64lTG2qyTuA02zMUZEgzmvrYYPU9NCUt1Ja+sWzqWzqXBhUqAABqf82rYS03L2WoN0sagrn3WzEmVJuIjCDU6uisUtJmOkSeKvdnGGnD1LRLfir1IiPWVMpUyg55VHVhjO0eRZLspuPdR8fxLcGY3a4rfTXUsw4d2lpLDzUh1ZkhtMtlttKVqMiJbaUn8fhKqEqoWQULS4lK0KJaFkSkLSepGR8SMjIVq2u3NOs+7ynqd286demirqdxn4NguVvhlL5uO1lbVtESH2mJUdeniM8/Mteikk74TBcylOJTLDRpSw0aWxQRRAGON4Nt6veDa7PdsLlzwIGb0suqVL5eY47rzZkxISnUtTZdJLhFr2pCCFW7poyq86Kes2li7rRV483jVpKxXcZCuY224FgjwffEqJOrjCFKalJUkj520kafjELZ0wtnTC2jGkxpsaPMhyG5cSW2h6LKZWTjbrbhEpC0LSZkpKiMjIyPQyFSpqY83Dfanw/ZGLsjAsEOZfurMiyLKubMjcj0dbITKW84ZcUeNJZabRrpzkTvclRCVEJUw8L5QfTvcYljWW9QOU1y6+Rn8RFHgTT6DQ6unaeJ+XL0Pj4cl9pom+zUmubilSTGa5ZrluoEEABEDr5bludH++ioMtcGVGo2ZTcltSkLSUedGeUSVJMjI1JQZfVGadbNOtgzy0eqqk3o2co9r7+4QndbayvRWzK+S58vZU8bRqFPZ5jM3ORs0MvcTMlpJStCcSM1RgzVGDZTNhQ7KHLrrGIzPr57LkadBktpdZfZdSaHG3G1kaVJUkzIyMtDLgYiiq+dM+3NVL8zFGP7UNInYJgef5DZQZcU1PRYtJVuSSbMndVczZGbbDazMyUakcT5tRZM6Fk6lowVqwAAAAAAAGH968SfyfEFPwGjesqF331hpJaqca5TS8hPr5fa9fLp3jecAzsZbMYVfRq0d/R7O9yfOPCqs9kt6iMa7c70Rtj60eGnuwYN2JzmFjdrOord9MWvvDbVGluHohqSjVJEo+wicI9NT7DIh0PMXDqsxbi5RGNVOuNsfM4vknjVvJ3qrF2cKbmGEzqiqNvbt6oTS7eJdg4J7AhFv3e1V1lsRurlom/RUIosx1o+ZBPeItZoJRcD0JRa6d/Dt1HoHLeXuWcvM1xhvTjHZhDxrnjO2cznaYtVb25ThOGrHGZwxSM2Zlx5W3OPpYdS4uIl9iSgjIzbcS8s+VRdx6GR/AZGOX49RNOcrxjXhMeEPQOULtNfDLW7OOGMT1TvT/iyiNO6UAcOwgsWcCdWyk80WwjuxpKS723UGhRfmGJ2rk264rjXExPgqv2ab9uq3VqqiYnsmMJa+oyrba7PGHJTJnMx+X8qjTQn46yNKjQZ9zjSj0Pu1HplcW+JZSYidFUeE/NLwe3N7gfEYmqPet1frU6tH3qZ0J8UOQVGS1zNpSzW5sV5JGfKZc7ajLXkcT2pUXeRjzfM5a5l65ouRhPy1Pccjn7OdtRds1RVTPo6pjonqcLK8sp8OqZFrbSEoJCVe6RCUROyHCL2W209pmZ9p9hdp8BZkslczdyKKI7Z6IjbKninFLHDrM3bs9kdNU7I+WjXLp9t7zI8jxpq5ySEzCemurXXIaSpJrinoba1JUZ6a8dPSWh94v4rl7OXvTbtTMxEae3p+W18vL2dzWcysXsxTFM1TO7h009Ez6tsYT0vfDWt4AOHYrS3Xz1rUSEIjuqWo+BERIMzMxZajGuI64U5iYi3VM7J8kA9pHG2txcWW4skJOStPMo9C1Wy4lJfVMyIek8aiZydzDZ64eGcq1RTxOzM7Z8pbCB5k95RU6lnmlPYawSyN5tE9xxvvJKzjkkz+E0H+YOy5TpnC7PR7vreYfmLXE1Zenpjfnx3fZLJOxLzbm3VchCyUtiTKQ8ku1KjdUsiP6iiMarmKmYzlXXEeTouSa4nhlER0TVj44sxDROtAABCbqFQtOdxlKTol2pjqQfpInXi/4SHf8sTjlZ+9PlDxzn2mY4hE7bcedSR+0l1At8DoERH0LfrIyIc6OSiNbTjPs+0XaXMREovUY5bjWXrtZqvejRVOMdeL0HlXOW8xw+1FE6aad2Y6YmNGnt1skJWhZqJC0qNCuVZEeuh9uh+g+I1UxMOhiYnU/QwyAIQ9QKpJ56lLxq8JNbH90I+zkNTmvL+r5h6ByzEfhNGvenH0ep4zz3NX/I6dW5Th2afXikrtHLrZO32OJrVtmmLH8GY0gy1RIJRm6Sy7SNSjNXHtI9e8cpxuiunN17/TOMdnQ9F5Vu2q+G2ot4aIwnqq6ce/T3sc9QmR0/0BGxpuWl65VNalOxGzJRtNIQstXTL4upqLQj4mNpyzlbnxZuzHu4TGO2dGpz/PvELP4eMvFWNzeicI6IiJ17Nehxem2Sydbk8TxE+8IksPG1rx5FIUklEXo1SJ810Tv26ujCYVfl5cp+Feox04xPdgkyOTejAAAjT1JvNlU4uwayJ5yXIcQ33mlDaSUf1DUQ6zlSmfiXJ6MI83nX5h1x8GzT070z4RHtd/08vNLweW0hwlOsWr/it96eZtoy1L1kPm5npmM1E7aY85fdyDXE5CqInTFc+UM7jnHbgAA18Z1QT9vs5e92SbLTEtNlj8nT2TbJzxG9PW2ouU/WQ9N4dmaM9lYx04xu1R3YT463g3G8jc4TxCd3REVb9E9WOMfqzo7k2MMzSnzWoYsa19BSSQRWFcai8WO7p7SVJ7dNexXYZDgM/kLmTuTTXGjonomHsfB+MWOJWYuW50/Wp6aZ9myel3dxdVdBXyLS3mNwYUZJqcdcPTUyLXlSXapR9xFxMfPYsV364oojGZfbm85aylubt2qKaY2+rbPU8Ftpl+QZqi7t59c1Bx85RoxxzRSXnEEZkol8TJRJ0LVRfXGZd3DZcWyNnKTRRTVjXh72z5epo+XeLZniUXLtdEU2t73Nsx17cNu3GOhlEad0oAjrv7bTaRzBbSA6bciDPfkNkRmSVKa8FREoiMtSPTiQ6jluzTei9RVqmIjxxcBzzmrmWnLXKJwmmqZ8N2dLM+KZRV5fSxLqrdJTb6SKRGMyNxh0vjtOF3Gk/zS4lwMhoc5k68rdm3XGr0xth1/DOJWuIWKb1qdE646aZ6Yns9OvU6fcyBVT8GyVNulvwI0F6RGeWRatyG0GbKkGentc+hERHx107xfwm5cozVvc1zMRPXHT6Pa+TmOxZu8PvfFwwimZidlUR7uHXjo69XS19fRs/6O+l/dXPoz3j3T33T5Px+Xn8PX08vEemfFo39zH3sMcOra8H/AA9z4Xxd2dzHdx6N7DHDwT33Y2h273vw2fgW5uNRsnxueZOFHe1Q7HfSSkokRn0Glxl1BKPRaDI9DMuKTMj8iicH6TicGnjMfJqeg3xXOzu/EmjjsveLWw72Ao5sQyVqk02MB5rnMiPtJhHZ28eE99Pfe0xTyoL/ACOzrJfUb1JZHuVS1SiNjFYS5RkZI15UlOsJEg20mRmRpbYJWhnyrT2hvG8234LgeHbZ4rT4RgOOwsVxShZJirpYKORptPapSjMzUta1GalrWZrWozUpRqMzEEHrQABGTqy6bIXVTtdH2yn5a/hjEe8iXZW8eGmas1RGn2ia8JbrJaK8fXXm7uwZicGYnBCvIfKwh4fkcXOelrfTJdjsoixksuR1qemsPGSSJaUyWn2H223TSSloc8dJn2JJOiSzvbWd7a5N30H9U28ENrGeoHrRsr3AfEQuzxfH6tMb39DaiUSHlEuM0eh+0RutPERkR8uvEm9BvQ2FbJ7Hbb9PmCwdvtsaMqekirN+ZKdV4s2fKWRE5KmP6Ebrq9CLXQiSRElCUoSlJYmcWJnFlwYYAABVM80v+2duH9q8f/gqMLadS2nU2H7SeX7uhhuIYXub0v8AU9d7UzdwMUpbTJMUtIaZ8B2TNhMvvK5kKS0pKFOK8InIy1oI9PE4mYjNW1Gatr0tj5aW6u9GT1d91WdVFxuNW0pmmFjlND92QSFac/gOPL93jGvlIlm3ENSy01UWhBvYajew1Nn21+1eA7M4bWYDtrjcbF8XqSM2IEfmUpx1eniPvvOGpx51ehcy1qNR8OOhEITOKEyyCAAADH+521uA7yYbaYDuTjcXKcXtiI34EkjJTbqSMkPsOoNLjLqNT5XG1Eou4+JhE4ES06Z15NDLN2q32d3xk0EVD3i19XkEA3pMU+bUjRYwnWTVoXZ8gR8PjH2ie+nvvVYv5UOWZHOrldQvU1kef45WKT4eKV6paudCPipTMsZMgmk9xkiPrpryqSfEN43m2vbzbnCNp8RqME27xuHiuK0jfhwKmGkyTqfx3HVqNS3XFnxW44pS1nxUozEEHtgAAAQH6p/Lz2a6nLN7MXpEvbvct1pDUnMqdtt1ucTZElv6RhOGlD5oTwJaFtuaESVLUlKUlKKsEoqwQWx/ykd7sRmTIWJdVP3s4/Ymbdg/VRbKC8+0pJErxYjE1Da9dCLlN3QyLt7hnfZ3k/OmLoH2g6bbFWYk/M3K3UkJV7xuFkCUG4wt0tHjgRiNaY5uanzLUtx3QzT4nKo0jE1YsTVinKIogAA05515T97uhZsXO4/V3mOdWkVs2Yc29rTnrYaM+Y22Tfsl+GjXjyp0LXuE95Pef3b3ym5+1uSQ8pwTqryzFLWM42b0qmrDgOPspWS1MOrYskmptemikq1SZdpGG8bzcWIIAAA1OdVHlYYbvhm1vuZtvmRbZ5VkjzkzKaeTCObVT5rhmpyUjkdacjOOqPmd050qP2iSlRqNUoqwSirBjTbryk8jYYh0e7XUhd3OAQ3EqVt5jaZMeI+klEpSTclSHG2iVylryxzP0KIyIxneZ3kkuo/y2Nnt6MIwXGsDdb2dtdtILtZis6vhlMiuwXXDfXHnMrdbdeM3jU4Tvi8/MtxSvENQxFWDEVYPAdL/AJbGU9P2cUWXTupO9tqejnFYK2/pIj9XVznkpNKTmkqc+h1JkfFPgkfAvaCasSasW1sRRAGCOofaPL96MHgYnhe8mRbH2UW5YspWW4wp1E2RGaYkNKhGtmTFWlta3kOGZL7Wy4DMTgzE4NXczyX6Owlyp8/qLuZ06c8uRNmyKFp11511RrW44tdgalKUozMzM9TMS30t9M7pM6Msg6Wbqe6jqCyfcPCpFPIrq/bewZci1EKU/KjyPf47HvshpDpE0tHstkZk4rUxiZxYmcU7RFEAYI6hdpMv3nwiDieF7yZFsfZxrhmxlZbjJuJmvxm48hlUI1MyIq0oWt5DhmS+1tPD0ZicGYnBq6leS9RTpUmdO6irmZNmOrfly36Bpx111xRqW44tVgalKUozMzM9TMS30t9NDpN6M8i6W7ue6nqDyfcTC5FO/W1+3Fgy5GqYUl6THfKdHY99kNIcSllbfstkZk4epjEzixM4p2CKIAjH1Z9NcDqq2ujbZ2GVvYazGvYl4m4YhpnL5orT7RN+Et1ki5ifPjzd3ZxGYnBmJwQwyLyt2MOylnPOlTfPI9i8iaZNt6A4p2dGd4Fq2mQ28w8lpZkRrQ746TPuItEjO9tZ3tr73fQd1Rbwxix7qF60bW+wVS0KscVx2sTETOQhRKJLxpVHZ9lRcyTcZdIjIj5dSLRvQb0Nhmy+yW3GwGDQdvtsaFNJRRFm/LeWrxZc6WtKUuS5j5kRuurJJEZ8CIiJKSShKUliZxYmcWWBhgAAGvXrJ8vrC+q+1q81h5U9t3uNVwirnr1uGU+JYRGlKWy1KjeNHMltqWokuoXqST0UlZJQSZRVglFWCFWN+SutuybVlfUCbtNwKXDp6DwZLydSM0E8/OcQ3xIj1NtfwDO+zvtwmx2y2G9Pu2tDtXgarB3HMfVIcjyLR9MiW67KeW+8464hDSNVLWZ6JQlJdxCMzijM4stjDAAgX1h9A+33Vg5X5Md29gG5dRFKDFy2NGTLYlxEKUtDE6Ka2Tc5DUfItLiVJ1Mj506JKUVYJRVghBgXlGbpY69LrpfVJJxnFZziVWldi0Sc0ucgjLUnUKmMNJUZIToakuaeg9CGd9neTWvPLg6d52wcvYukrZdAb81i5TuN8lJvXLeKh1tmXKeUhCXkkh5xBskSEcq1chIUfMWN6cWN6UQtu/KFyrCb9dix1V3WOwVmSJK8Sq36mwlMkavZOQVkpLfA+9DhcT4DO+zvt2UOMUOJFiJdcfTFZQyT7yuZxZISSeZatC1Uempnp2iCDkAOru6pi9pbeklae7XEKRBkalzF4chtTSuGpa8FekBqQa8nfaaNg0Sshbo5HX7mVtg9Pr9y4rCG29FeF4DLtabyiMmDbNSFNPtL5lGalGRJSU99PfemidIHXq3ARirvXnMaxfl8BVoitedt0tacFJkLcTINfr96I/shjGNjGMbEiul/oa2p6ZZk7LIUuduBulcIcTb7kX3KqT8ufM+mIyRqJgnVamtRqW4rUyU4aeAxNWLE1YppjDAAAAAAAACPnUZszmO92I1eMYdvVkmx8qHY++WF/jJupkzI/guNnEcUzJiqJBqWSz0V9bpoMxODMTg1iPeS1j0l52RI6h7eRIkLU4++5j7S1rWs9VKUo7AzMzM9TMxLfS304Ok7pAyPpem2jTm/+T7lYhKq/o+owO0acj1la746HveYrBzJDbajJKkGSEJ1JXE+AxM4sTOKPW83ljZBvnldrkec9VuX3MJ+ymzcex2ygKnxKhiW6bhRYaHrHkbQhPKj2EJ1JJakEVYEVYPDYh5RUvb+5byLBOq3LMMv2m1NN3VHVnXyibWZGtvxo9khfKrlLVOuh94zvs76fG/XT9nG8mA4fhWPdQGV7USqBKW8hyWh8VMq7R7slhSZRtS4ytFqI1qLnURmZkYjEoxODXCfkq4yozUrqDtDMz1Mzx5nUz/8eJb6W+nx0q9KuV9NKraFZdQGU7sYxJro9fQYldIdbg1BR16kqG0uZJS2Rp9jlQlJaCMzijM4plDDAAANanUv5Ymy2/V5Y5tjFlJ2izy3cU/cWFXGbl1c6QszUuRJrlLZ0dWfFS2XW+Y9VLSpZmoSirBKKsET8b8p/f7Geeko+rJzGMUkLWmUxTt2rHM2rUzM4TU1lpRmZ8SNzTj2jO9DO9Cf/S70G7OdMUhWTVvvWebmyWltzNwrxKDeZJ0tHUwI6eZEYnOPMrmW4ZGaTcNJ8ojNWKM1YpuDDAAAMf7n7W4HvJhltgG5GOxsmxe5SRSIMgjJTbidfDfYdSZLZdbM9UrQZKL09oROBE4NNuV+TncU+UJvdlN/H8dhtOqcrW7mI6iyhegk2Fe634h8dNSZb+qJ76e+kFtD5ZdXBvKnLupjdu96ibeiWTlHjFq9JVSRlakZ+MiY/JeklzFry6ttn2LbWQxNWxiamLXfJk28l2tnPnb15AcedMckR4cSqiMGy24tS/DNanXSUZEZERklJfY9wzvs76cnTF0e410vSr+Rju5WbZmxeQmICKfI5zL0CG1HWbiVRo7LDZIXqoy11004aCMzijM4pfDDAAh11TdLeX9SP0XBqeoPKdpMYYr34GQ4pRocXDtyfUZmqYhEyMThEkzTyLJSTLtGYnBmJwQB/IqYx/vBWn/+dZ/8+Jb6W+2bdM+xeS7AYTY4bke8WQbyE/Ye9VFrkPieLXxiYbaTCYJ2TKMmkmg1kRKIiNR6EIzOKMzikaMMAD8ONtutradQl1p1JocbWRKSpKi0MjI+BkZANR++/lF7S7iXs/KNqMtk7PzrN5cidjfuSbOl8RZ8yvdWPGjuxSUZmfKTi0J4EhCEloJxWlFTE+LeU5vF7mxi2X9Vs+Jt80afHxekbsHWXW9ORbaGJExqO3qj2SUaF6f3JlwDeZ3m07p96aNpemfFVYvthQHFcmmhd/k85SZFrZuoLRK5ckko1JOp8raEpbTqZpQRqUZxmcUZnFn0YYAABErqc6L9meqeBHdzWufpM0rGDYpNwKc0NWLLRaqSw/zpU3IZJR68jhap1V4akGpRnmJwZicEO8S6JuuLZ+qawrZ/rPjRsBYNbMGBb1RuLhx1HryxWZKLEmePHladQRGZmWmpiWMSzjDuNuPKzxp3N1bn9TG6lx1AZe/JTMlV8pDkavedQZciJi3XpEiU2nQtEEppHL7BoNBaHje2G9sbWIUKHWw4ldXRGYFfAZbjQYMZtLTLDLSSQ2222giSlKUkRERFoRcCEUXJAAGKt79r2N6tps72rlXDmPx83rF1rt00yUhcclLSrnS0pbZK+L2cxDMTgzE4Na9j5RmDVNNiFjtRvHk23G6+KMF4ufR0rcanSyUpXvJRm5LT0Rw0q8MjZkcpJ+sUevNLfS3neTOjHrfzKodw7PuumWnDZbXu9imqql+/SGD4KaceQ7DdWS06krneUR/XEohjGNjGMbEx+mfpO2m6WMal0u3sCRNurnkVk+aWikO2Vgpv4qFLQhCW2UGZ8jSEkku0+ZZmo8TOLEzik0MMAAAAAAAAADBGZ7EUORSnrOllnj0+Qo1yGEtk5FcUfaZNkaTQZ9/Ken2I6PIcx3bFMUXI34jx8en5aXEcX5Iy+crm5Zq+HVOuMMaZ7tGHdo6nnazYnIkkmFaZ9KTSkXK7XwjeIlo70ES18if1qvgH03uYrM+9RZje2zh7MfTD4MtyTmY9y7mqvh/Zpx0xs0zhHhPY9DfbBY3ZnVt1k12ji17BsutNtE8t9RrNRurcUoj5j104692mhFoPmy3Ml63vTXG9Mzjrww6sNj789yNlb+5FuqbcUxhojGatOOMzM6ym2Fp6aVHlsZPcIcZdQ6pLC22Ur5FEokq0SZ6al6Qv8x3LtM0zbp0x04yZPkexlq4rpvXMYmJ0TEY4dzPA5x24AAPDZpt5jmcx0Jto6mZzCTTEtY+iX2y7eUzMjJSdfrVEffpofEbHIcTvZOfcnROuJ1NLxjgGV4pThdjCqNVUfSj2x1T3YMHl09XtdKU9R5qUdJ/Fe8J2O6RdpEZtOK10+EdB/c9q5ThctY98THphxn9hZizXjZzGHXhNM+iXssd2Mq4c9u2yu4kZdNbPmQzII0sc3aXOSlrU5ofcZkR95GPgzXMVyujcs0xbjq1+rD5aW34fyVZt3Iu5q5N6qOifo9+MzNXjhthnYiJJElJElKS0Ii4EREOddtEYP6AAMY53t7PzWQjkzCfS1hxUx5NOwk1MPKJa1G4tJOIIzMlEWhl3ENvw7idGTj+VFVWOMVTrjq1Ob43wG5xKrRfqoo3cJpj6M6ZnGdMbfQxiXTZCSZKTl0hKknqRlESRkZf9aNt/ddX/AK48fmc5H5eUR/55/V+dmDH8QtaTHbajfy+wtZM9DqINxI5jeh+I14afD5nFH7B+0XEuI0eZz1u9epuRappiMMaY1VacdOjp1OryHCb2Wy1dmq/VXNWOFU66MYwjDTOrXGli2x6fnLeScy1zywspakkk5MpjxnOUuwuZbxnoXcQ3FrmaLVO7RZpiNkTh6nNZjkScxVv3czVVVtmMZ9NTtcX2TkYpaQ7Gtzme00zIaemQGmjablIbWSjadJL2hkoi04kYpznH4zNuaa7VOmJiJxxwx6Y0Pq4bydVkL1Ny3maoiJiZiIwiqInVPvap1M8jnHbgAAxruJtpV7gx4in5S6y0gEpMSxbQTnsL4mhxBmnmTqWpcS0P4TG24XxavIzOEY0zrj2Od4/y5a4tTTjVu106qsMdGyY0Yx36GHo/TW+TqTk5cgmfr/ChnzmXoLV7QtRvKua4w0W9Pb8zk7f5d1Y+9f0dVP8A+mfsMw2rwaoVT1Lj7zLr6pT70lRKWt1aEIM/ZSkiLRBaERDms/n7mcufErwxww0bPlLueD8Is8Ls/BtTMxM4zM68cIjq2Q9aPibUAY8z/binz+GyiY4uBZw9SgWrSSUpBK7ULQZlzpPt01IyPsMuOuz4bxW5kap3dNM64+WqWg47y/Y4tREVzu106qo8pjpjw6p1sNV3T3fwZC/BzcoEdzg65EadS4tPoNJOILs17xvrvM1quNNrGeuY9jkcvyHmbVWjMbsfoxOPnHmynD2ew+Jjllj/AIL0hy3SXv8AduqJUtTiVEtKkr00SSVFrykWh/XajT18czFV6m7jEbuqn6vy+UOmtcpZK3la7GEzNf0q5+njricejCejVtxY1g9O86BO94i5y7CQkzJD0aMpt/kM/i8yXy0+H84bW5zRTXThVZie2dHk52zyBctXN6nMzT1xTMVftJJVkL6Orq+vOQ7MOBGaj+9vnzOu+Egkc7h96laamfpHK3bnxK6qsIjGZnCNUY7HoeXs/BtU28ZndiIxnXOEYYz1z0uaK1z4SWlvxpDLbyo7jza0IkJ+Mg1EZEouziXaJUTEVRMxihcpmqmYicJmNezrR6stgX7l8pVvn9jaSSTypflMm8ok668pGt49C49hDp7XMsWowos00x1Th6nBZjkWrM1b13NV1TtqjHzqcmi2Kfx2c1Oq87sIakuIU+iOybJPJQrm5F8jxakfZoYhmOYov0zTXZpntnHD0LMlyTVk7kV2szXTpjHCMMcOicKtSQY5l3gAAPM5ViNFmVd9G3kTx20Ga40hB8jzKzLTmbX3esj1I+8jH15PO3cpXv25w27J7Wu4nwrL8RtfDv04x0T0xO2J+UbUfpPTpPiS/eKHL/ASRmbSnmVtvII+7xGl8fh0IdNTzRRVThctY9+jwmHB3Py/uW696xfw7YmJjvifY9DU7DIdlszc0yiXkpsmSkwtVpQemnBbji1rMuHYnl+EfLe5jmKZpy9uKOv5oiI82wyvJEVVxXnL1V3Do04d8zMzh2YM/wAaNHhR2IkRhEaLGQluPHbSSUIQktCSki4EREOarrmuZqqnGZd1bt026YooiIiIwiI1RD7iKYAx/nuARM9ap48ycuGzVyjkLQhslm6lRESka8yeXUi7RsuG8SqyU1TTGM1Rh2NFxzgVHFabdNdW7FFWOrHHq16HgHdk5tJYOWW3+YS8bN3g5CdI3UGWuvLzkouZJdxLSr4Rs44/Teo3Mzaivr1fLumGiq5Ory1ybmQv1WseidMePTHVMT2v29tJlOSKabzjcKVaVzSyUdZEaJpCzLvMzMkEfr8MxinjdjL6cvZimrbM4/P6Wa+Vc3nJiM7mqqqI+rTGGPq/0yyp95eM/e396X0S19A8nJ7lx7debn59ebn1482uuo0/4+/8b4+9O/t+XR1Om/4fKfhfwu5HwsNXrx149OOt6gfG2YAAAAAAAAAAAAAAOvsraqpoyplxZxKqIgjNUqY8hhsiSRqPVbhpLgRGZ8ewBUv8xnOcT3C6udyr7CryJklEy1U1yLqA4l6K8/Cro7MgmXUGaVpQ6lSOYj0M0npqWhnbTqW06livpL312j3B2P2hgYxuDRTb2rxKkqrjGTnMN2USdDgssPx3oi1pdI0uNqIj5eVRe0g1JMjFcwrmEtRhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaePOb/ABE7W/y8T/Bc0ToToVxBYmy1sF+PbZX+XmOfwpHGJJXaBSpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z",
					width: 180, margin: [ 0, 20, 0, 40 ]
				},
			    {
			    	text: toTitleCase($scope.pptos[0].Nombre) + ', a continuación le exponemos las condiciones y alternativas de pago para el tratamiento propuesto.',
			    	margin: [ 0, 0, 0, 40 ]
			    },
			    {
			    	text: 'Propuestas de pago', fontSize: 14, bold: true, margin: [ 0, 0, 0, 40 ]
			    },
			    {
				    columns: [
				    	[
				    		{ text: 'Opción Pago Único', margin: [ 0, 20, 0, 10 ] , fontSize: 14, bold: true, color: '#00CCFF' },
				    		'El pago del tratamiento se efectúa de una sola vez al inicio del tratamiento.',
				    		'{textodto1} {costefinal1} '
				    	],
				    	[
				    		{ text: 'Opción Por Tratamiento', margin: [ 0, 20, 0, 10 ] , fontSize: 14, bold: true, color: '#00CCFF' },
				    		'El pago del tratamiento se efectúa en el momento en que se realiza cada una de las intervenciones previstas.',
				    		'{textodto2} {costefinal2}'
				    	]
				    ],
				    margin: [ 0, 0, 0, 40 ]
				},
			    {
				    columns: [
				    	[
				    		{ text: 'Opción Pago Fraccionado', margin: [ 0, 20, 0, 10 ] , fontSize: 14, bold: true, color: '#00CCFF' },
				    		'El pago del tratamiento se efectúa  mediante un pago al inicio y en mensualidades sin intereses.',
				    		'{textodto3} {costefinal3} ',
				    		'Pagándose una entrada de {entrada} (30%) y una cuota de {cuota}/mes durante {meses} meses.'
				    	],
				    	[
				    		{ text: 'Opción Personalizada', margin: [ 0, 20, 0, 10 ] , fontSize: 14, bold: true, color: '#00CCFF' },
				    		'Quedamos a su disposición para valorar otras opciones que les puedan resultar mas cómodas.',
				    		'Para cualquier aclaración no dude en consultarlo con nuestra Responsable de Atención al Paciente.'
				    	]
				    ]
				},
			    {	text: '', pageBreak: 'after' },

		    // pagina 4: contacto
		    	{
		    		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAAlgAAAAEAAQCWAAAAAQAB/+E8Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL2pwZWc8L2RjOmZvcm1hdD4KICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5sb2dvX2VuZXJlc2k8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QWx0PgogICAgICAgICA8L2RjOnRpdGxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBHSW1nPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvZy9pbWcvIj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNS0wNi0xMVQxMjowMzowMSswMjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTUtMDYtMTFUMTA6MDM6MDhaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMDYtMTFUMTI6MDM6MDErMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIENTNiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOlRodW1ibmFpbHM+CiAgICAgICAgICAgIDxyZGY6QWx0PgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6d2lkdGg+MjU2PC94bXBHSW1nOndpZHRoPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpoZWlnaHQ+Njg8L3htcEdJbWc6aGVpZ2h0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpmb3JtYXQ+SlBFRzwveG1wR0ltZzpmb3JtYXQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmltYWdlPi85ai80QUFRU2taSlJnQUJBZ0VBU0FCSUFBRC83UUFzVUdodmRHOXphRzl3SURNdU1BQTRRa2xOQSswQUFBQUFBQkFBU0FBQUFBRUEmI3hBO0FRQklBQUFBQVFBQi8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFCZ1FFQkFVRUJnVUZCZ2tHQlFZSkN3Z0dCZ2dMREFvS0N3b0smI3hBO0RCQU1EQXdNREF3UURBNFBFQThPREJNVEZCUVRFeHdiR3hzY0h4OGZIeDhmSHg4Zkh3RUhCd2NOREEwWUVCQVlHaFVSRlJvZkh4OGYmI3hBO0h4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zi84QUFFUWdBUkFFQUF3RVImI3hBO0FBSVJBUU1SQWYvRUFhSUFBQUFIQVFFQkFRRUFBQUFBQUFBQUFBUUZBd0lHQVFBSENBa0tDd0VBQWdJREFRRUJBUUVBQUFBQUFBQUEmI3hBO0FRQUNBd1FGQmdjSUNRb0xFQUFDQVFNREFnUUNCZ2NEQkFJR0FuTUJBZ01SQkFBRklSSXhRVkVHRTJFaWNZRVVNcEdoQnhXeFFpUEImI3hBO1V0SGhNeFppOENSeWd2RWxRelJUa3FLeVkzUENOVVFuazZPek5oZFVaSFREMHVJSUpvTUpDaGdaaEpSRlJxUzBWdE5WS0JyeTQvUEUmI3hBOzFPVDBaWFdGbGFXMXhkWGw5V1oyaHBhbXRzYlc1dlkzUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8rQ2s1U1ZscGVZbVomI3hBO3FibkoyZW41S2pwS1dtcDZpcHFxdXNyYTZ2b1JBQUlDQVFJREJRVUVCUVlFQ0FNRGJRRUFBaEVEQkNFU01VRUZVUk5oSWdaeGdaRXkmI3hBO29iSHdGTUhSNFNOQ0ZWSmljdkV6SkRSRGdoYVNVeVdpWTdMQ0IzUFNOZUpFZ3hkVWt3Z0pDaGdaSmpaRkdpZGtkRlUzOHFPend5Z3AmI3hBOzArUHpoSlNrdE1UVTVQUmxkWVdWcGJYRjFlWDFSbFptZG9hV3ByYkcxdWIyUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8mI3hBOytEbEpXV2w1aVptcHVjblo2ZmtxT2twYWFucUttcXE2eXRycSt2L2FBQXdEQVFBQ0VRTVJBRDhBOVU0cTdGWFlxN0ZYWXE3RlhZcTcmI3hBO0ZYWXE3RlZrODhOdkM4OHppT0tNY25kdWdBd3hpU2FER2N4RVdkZ0dEYWw1MzFLK3VSYWFOR1l3NTRvOU9Vci9BQ0hSYzJ1UFJSaUwmI3hBO204L243VnlaSmNPSWZyY1BKZm1TK1gxTCs5QVp0K0VqdklSODZmRDl4eC9PWW8vU0Yva3pQazNuTDdiUzNVUEtHdTZhcG5RZXRHdTUmI3hBO2tnSjVBZTQyYjdzdXg2dkhQYmw3M0Z6ZG01c1c0M0hrbWZrelVmTWx4ZXJHWkhuc0UybmFiNGd1MndESGV2dGxHc3g0aEcrVW5MN00mI3hBO3paNVRxN2gxdG5lYXA2RjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFZSdkwyenNiV1M3dlo0N1cxaEhLYTQmI3hBO21kWTQwWHhaMklVRDU0cWtHbS9tWitYT3FhZ3VuYWQ1bzBxOHZuWUpGYlFYc0VqeU13cUJHRmM4ei9xMXhWa3VLdXhWMktzZXZ2ekUmI3hBOzhoV056RmEzZm1IVG9ycWFkYldLMyt0UkdVek8zQUp3REZxOHRqdHQzeFdrUnJublR5Zm9FaXhhNXJ1bjZWSzY4MGp2YnFHM2RsOFYmI3hBO1dSbEo2ZHNWUmVqYS9vV3QyaHZORjFHMTFPMERGRGNXYzBkeEh5SFZlY2JNdFJpcU94VjJLc0svTVhVSkZXMnNFTkVjR1dVZU5EUlImI3hBOyt2Tm4yZGpHOG5ROXRaaUJHQTY3cVA1YjI4TFhGN093QmxpV05ZejRCeTNML2lJeVhhTWpRRFgySkFHVWoxRmZwWjNtcWVpZGlyZ0EmI3hBO09ncFhjNHE3RlVoMXp6LzVIMEZaanJHdldGaTF2dE5GTmNSTElwTzRIcDh1WlBzQlhGVlhWL08za3pSVEFOWTE3VHROTnlnbHRoZVgmI3hBO2NFSHFSbm82ZW82OGw5eGlxY0k2U0lza2JCMGNCa2RUVUVIY0VFWXEzaXJzVlN6WFBOUGxuUUlrbDEzVnJQU281SyttMTdjUlc0YW4mI3hBO1hqNmpMeStqRlZQeS93Q2IvS25tT0pwZEExaXkxVlVDdEw5VG5qbUtjaFVlb3FNU2g5bXBpcWI0cTdGWFlxd1h6UitlUDVVK1Y5U2YmI3hBO1ROYTh3d1E2aEZVVFcwTWM5MDhaRzVXUVcwYzNBaW00YWh4Vk12SmY1b2VRdk8zcmp5eHJFT295V3loNTRRc2tVcXF4b0dNY3l4dlMmI3hBO3UxYVlxeWpGWFlxb1h0L1kyRnM5MWZYRVZyYkpUblBPNnhvdFRRVlppQU1WU3pTZk8zbERXZFVuMHJTTlpzOVIxQzJpRTl4YjJrNlQmI3hBO01rWmJoVnZUTEFmRjFIVWJlSXhWOGorY2Z6UDh1Zm1SK2NYMUx6bHJMYWIrV2VpelMvVjdWQk1WdXZRUEFNd2dWM0xUdnZ5b09NZXcmI3hBO28yNVVwOStjZm1EL0FKeGMxZnlCZFczbGxySzI4eFdhSzJqdnAxaFBiU3RJcEE0U1NlakdySXkxcjZqZTQrTEZYckgvQURpOTU0MXomI3hBO3pkK1ZzVnhyVXJYTjdwZDNKcHYxeVFreVRSeFJ4eUk4akg3VEJadUJicWFWTzlUaWg2NWlyc1ZmQi84QXprSjVRdDlGL1BaN0h5MmkmI3hBO1dENm05bmRXa2NYN3RJYm00SVdxVSt6V1ZlZTNTdTJLWDBsYS93RE9MWDVWdnBqUmE1YjNXdDYzT2hON3I5emQzSXVwWjJIeFNnTEomI3hBO3dIeGJxQ0cveXVYZFczaVAvT1AwT3ArU2YrY2tML3lYYlhiUzZlOGwvWVhOZGhOSGFwSk5CS3lkQS83c2ZLckR2aXI3TXhRN0ZXRS8mI3hBO21McDhyZlZyOUZyR2dNVXBIN05UVmZ2cWMyZloyUWJ4ZEQyMWhKNFpqbHlZNzVkMXlUUjc4VDhTOERqaFBHT3BYclVlNHpOMUdEeEkmI3hBOzExZFhvdFdjRTc2SG05TDA3V2ROMUdNUGFUcklTS21PdEhIelU3NXBNbUdVT1llcnc2bkhsRnhObzNLbTkyS3V4VjhXL3dET1pubGYmI3hBO1NkTDgrYVpxMWhBbHZMck5vNzN5eGppSko0WkNETWFmdE9ycUc4YVY2MXhWbmN2L0FEaURZK1pORjA3VnIvemJmdjVqdklZcHRSdTUmI3hBOzQwdVlXNUlwV09HTW1LUkZSUGdXc2hHM1FEYkZKZlJIbC9SclhROUIwM1JiUXMxcHBkckJaVzdTR3JtTzNqV0pDeEZOK0s3NG9SK0smI3hBO3NVL05QejFCNUY4aWFyNW1rUlpaYk9NTFoyN21nbHVKV0VjS0hjRWptd0xVMzRnbkZYeTErVDNtbjhvOVIxTFV2T241d2EzSHFmbW0mI3hBOzVuTWRwWVg5dlBkUVJRcW9JazRMRkpFYWxpcUowUUxzTjlsS0IvTnJ6NStXK2grZjlDODMvazdkcGI2aENIL1M5dmFXOHRyYU54S2MmI3hBO0FZM1NKU0psWmxrVkJUWUg3VytLdnRiVDd4YjJ3dHJ4VU1hM01TVENOdG1VU0tHb2EwM0ZjVUlqRlV0OHovcGIvRFdyZm9mL0FJNi8mI3hBOzFPNC9SM1QvQUhwOUp2UjYvd0NYVEZYeUgveml0K1pua255bnJPdFdQbTFoWWF0cXNpZWpyZDBLZ0ZTd2tnbWxiNG9xdTNJc2RqKzAmI3hBO1JRWXBmUm5sL3dES1R5L3BINW1YWDVnK1g3bU8xdHRYMDgyOTVwbHZFdjFlWjVIU1g2ekhJckJWNSttcElDN21yVitJNHE5Q3hRN0YmI3hBO1VwODJlV05LODArVzlROHY2dEVKYkRVWVRES3BGU3ArMGpyL0FKVWJnT3A3RURGWHlqL3poUkdZL1BmbUtNN2xOT0NtblNvdUVHS1UmI3hBO3IvNXhJdmRHc1B6SzFMUU5mZ2hGenFGcThGcWwwaU1mclZ2S0dNUTVBMFlyeitmSDVZcSt4LzhBRG5sNy9xMTJuL0lpTC9tbkZGb3kmI3hBOzJpdFlZaERhb2tjTVpLaU9JQlZVMXFSUmRoMXhWVnhWMkt2alQvbkl6LzFwUFJQKzNWL3lmT0tYMlhpaDhmOEFrZjhBOWJRMUQvbVAmI3hBOzFUL3FGbXhTK3dNVU94VlN1dnF2MWFUNjF3K3I4VDZ2cVU0OGZldTJTamQ3YzJHVGg0VHhmVDV2TGZNSTh2aTUvd0J4QmtLMVBxY3YmI3hBOzd2OEEyRmZpKy9ON3AvRXIxdkk2M3dPTDkxZjZQaDFRVVduNmpJb2todHBuWHFyb2pFZlFRTXRPU0kySkRqeHc1RHVJbjVNLzhtYVgmI3hBO3E5ckM5eHFFMGdFb0FqdFpHSjRnR3ZJZ25ZKzJhaldaWVNOUkh4ZWs3TTArV0FNcGs3OUdTNWhPMWRpcjVFLzV6Zy81U0h5dC93QXcmI3hBO2x6L3lkVEZYMVY1Yy93Q1VlMHYvQUpoSVArVFM0cVV4eFYyS3ZFUCtjd3JHOHVmeWZhYTNVbUt5MUsxbnV5T2dpSWVFRSszcVNwaXEmI3hBO2wvemlsZCtWTmQvS2F6c2paMnN1cDZMTlBiYWdza1ViU2Z2Wm5uaWMxQmJpeVNVQjhWUGhpbDdJTkM4dnduMWhwMXBHWS9qOVQwWTEmI3hBOzQ4ZCtWYWJVeFFtR0t1eFZKZk9mbTdTZktIbG05OHg2djZuNk9zQWpUK2l2T1Nra2l4THhVbGEvRTQ3NHE4cy9OSC9uSFB5UCtaTm4mI3hBOy9pWHk5TW1sYTVxRVF1NGRRaEJOcmVlcWdkR25pRktjNmcrb254YjFJYnBpcnpUL0FKeFU4NCtiTkIvTUxVUHl4MWwza3MwK3RJdG8mI3hBOzdCeGFYbG14OVgwMjMrQmdyQWhkcTBJNzFVdnJqRkRzVmRpcjQvOEErY0wvQVB5WVhtZi9BSmdEL3dCUktZcFpuK2RQL09MTjE1aDgmI3hBO3d6ZWJmSTk1RnArcjNNbjFtOXNabWFKSHVLOGpQRE1nWXBJemJrRVU1YjhoaXFqNWY4cS84NWtTcEhwZDc1a3RkT3NRdkI3KzQrcVgmI3hBO002cDBQRjBpa2xkNmRDelYvd0FvWXE5dS9MM3lKcDNrbnk2dWtXbHhOZXp5eXZkNm5xVnl4ZWU3dkpxZXJQSVNUdTNFYlY2QWJrMUomI3hBO1VNbHhWWmNHY1FTRzNDbTQ0dDZJa0pDRjZmRHlJQklGZXRCaXI1ajgvd0QvQURqOStkM25MejZubks0dmZMbG5lVzVnK3FXOFU5NjAmI3hBO2FDMlBLTU1XdGF0OFc1eFY5QVcwbm43L0FBcTczVnZwWCtMQXBFY01VOXoramkzS2lreU5GNndISGNqZ2Q5cTk4VmVBYVQrUVg1NTYmI3hBO2IrYWIvbVBGZmVXMzFhUzZ1THFTMWFhK0Z1UmRLOGNrWUF0dVZBa2hDbXRlaDN4VjlMMkJ2ellXeDFCSWt2ekVodTB0Mlo0Vm00ajEmI3hBO0JHenFqTWdhdkVsUWFkaGlxdVNBQ1NhQWRUaXJ5M3pONWp1Tld1bVZXSzJNYkVReGRBYWZ0c1BFL2htKzAybkdNZjBua05kclpacFUmI3hBO1BvSEw5YkpQS2ZsRzJpdDQ3Ky9qRXR4SUE4VVRDcW9wM0JJN3Qrck1IVjZzazhNZVR0ZXp1em94aUp6RnlQMk11QXBzTTE3dW5ZcTcmI3hBO0ZYWXErYi96ci9Jdjg0ZnpOOHdXOTlMY2VYN0d4MDVKSU5QaFc0dkRJWTNmbHpsUDFVam1hRFliRDhjVmV5ZmwvYi9tTlo2ZEZZZWImI3hBOzR0SXBhVzhVTnZjNlZOY3lOSTBZNGt5Unp3eEJQaEEreXgzeFZsbUt1eFZBNjdvbW1hN28xN28ycVFDNDAvVUlYdDdxRnYya2NVTkQmI3hBOzFCSFVFYmc3akZYeXRkZjg0eC9uRDVHOHluVmZ5ejF4Wm9DU0lYTW90cmtSazE5TzRqY0czbFViZDZFNzhCaWxuR2wvbFgrZTNuYU8mI3hBO096L05iek5GRDVaRGlTNjBUVGhFazEzd1lFUlRTVzhjU3JHYVYrMjN5Qm93VmUrUXd4UVF4d1FvSTRZbENSeHFLQlZVVUFBOEFNVUwmI3hBOzhWU1B6ejVUcy9OM2xIVlBMZDVLMEVHcHdHRXpvQVdqYW9aSEFPeDR1b05PK0t2SmZLUDVaLzhBT1Eza3JTVzh2YUQ1cDBTKzBTTUYmI3hBO0xHVFVvTGoxN1pXYXBNU29yRDVLN3NveFN5SDhvZnlHc2ZJdXEzL21UVk5UZlh2TnVxY3pkNmxJbnBvaG1mMUp2VFVseVdrZjdUc2EmI3hBO25zRnFRVkQxWEZYWXFrdm01dk9ZMG1ubENQVG4xWm5wWFZwSjQ3ZEl5clZZZWdrcnN3Zmo4T3dwWGZGWGdQNVEva0orZFA1YmVaYmomI3hBO1diUzY4dmFndDdBYmE3dDVybTlXcXRJc25OV1cxMmNGTzlSUW5GWDB4aXJzVmRpcnNWZGlyc1ZkaXJzVmRpcXllTDFZSklxMDlSV1cmI3hBO3ZoVVV3eE5HMk00MkNIalZ6YnpXMDhrRXlsSlltS3VwOFJuU3hrSkN3OE5rZ1lTTVR6RDByUy9PT2kzVnNobW5XMm5BQWtpaytFQS8mI3hBOzVKNkVacE11am5FN0N3OVZwKzBzVTQ3bmhQbTNmZWRkQnRSOE14dVgva2hITC9oalJmeHhob3NrdWxlOU9YdFRERHJ4ZTVQRWNPaXUmI3hBO0FRR0FJQjJPL2ptS1E1NE5odkFsMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjImI3hBO0t1eFYyS3V4VjJLcGJxM2wzU3RVbzExRis5QW9Ka1BGNmZQdjlPWDR0UlBIeUxpNmpSWTgzMURmdlNRL2x6cHZPb3VwZ244cDRFL2YmI3hBO1QrR1pQOG95N2c0SDhpWTcrby9ZbW1tK1VkRTA5MWxqaE1zeS9aa21QTWcrSUd5MStqS01tcnlUMkoyY3ZCMmRoeG13TFBtbk9Zem4mI3hBO094VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3NBL0x2OEFOSzY4NlhpbUxRTG15MGU0dFpMeXkxVngmI3hBO09ZbUVjNGhFVWpTVzhNUWxkVzVnUlN5Q2xkNmc0cElYNkgrYVA2VS9NRzk4b0hUa3RXczJ1VjlXYTRaTGgxdHlvV1ZMZDRVV1NPVXMmI3hBO2FHT1ZpS2ZFQml0SURYUHpkMVRSOWI4dzIwMmd4UzZSNVp1Tk9pMUsranZtOWN3Nm1RSTVZN1kyd1Zpbkw0ME1vOWljSzBtdm4vOEEmI3hBO01pWHl4cU5ocE9uNlJMcldyWDhGemRwYVJldUtSV3FyL3dBczl2ZHVXa2R3cS9CeEhWbVVkUXRJdlgvUE11bDZQNWZ1bzlNZHRROHgmI3hBOzNWclpXbW4zVG0xOUthNmlhWXJjUHdsS2Vtc2JjaHdKcnRURlVxODgrWmRZai9LaTUxeTcwMjYwcTk0Uk5lV0VGOExhNmdIcnFqZWwmI3hBO2RSeFRDdlEvWUZWTk5zVlRuOHdQT2plVTlMdHJ5TzFpdlpycTVGc2tFdHg5WDZ4dkpWYVJ6eVNOV01LRWpqWnQ2MG9DY1ZER2ZPL20mI3hBO2lUWC9BTWhyenpacDBsMXBWeFBwWTFHMWEydUpZWm9aZUhMajZzSmpMQlRVZUI4TUtwMytaV3MzR2xyNWFLTE9ZYnpYOU9zNW50cnMmI3hBOzJqajE1Z2lod0lwaE5FVC9BSGtaS2NoM3dLRkQ4eXZ6TlBrcVN3VDlIcGNyZkxLMzFtNXVIdExkWGpNWVNFekxEY0lqeStvU3BsNEomI3hBOzhKcTR4VUJTL01qelI1djBiekg1T3N0Q2p0bnQ5WHYzdHJ4TGlVeGVvRmdlUVJraUM0S0w4UExtdTlSU2xEVUtoVy9NL3dETXVUeVImI3hBO2IyMHlhZEhxUHJRM2R4SWpYUWdkVXM0eElRa1N4WEVzaFlFL0VFNEpTcnNvcGlvQ004NitmVjh0ZVY3VFgxc211b2JxV0JHRE5JcVEmI3hBO1J6b1hNMHpReFhNZ1JBUGk0eHRpdEp0NVMxNCtZUExXbTYwWW80RHFFQ1RtR0taTGxFTERkVm1RQlhwNDBIeXhRbGZuSHpicmVpNngmI3hBO29PbDZWcE1HcHphOU5QYnh0UGVOYUxGSkJidmMvRnh0N21xbEltMzZqd09LcE4rWFA1cjNYbSs5c29KOUdYVFl0UzBvNnhaU0xkZlcmI3hBO0dNYVhIMVo0NVY5R0hnM1BkYU0xVjhEdGlraEw3anozcWQ1K2FzZHBhYWRxZHpvK2ozYTZSY0cwK3NpM0Z6Y3dpU1c2dVVqdDJoa2kmI3hBO2hWNDFIcVhDOGFsd3AySUtvZjhBT3p6cnFVZWsrWTlCME9PV08rMGpTRjFhNzFXSyttc1pMYjFKR2poRVhvS1dtZWlNeFZtVmFVcWEmI3hBOzRoUXlIelpxMTNhZVcvS2MxYmh4ZWFubzl2Y3pXOTIxcktQck1zY2ZKejZjM3JJWFllcEdTdkphL0ZnVkhlY3ZPOTlvbXFhZG8rbGEmI3hBO1QrbU5YMUszdmJ1RzJhNEZxcGpzSTFkbFZ6SEx5a2thUlZSYVU3c1FNVlY5ZjgzM0dtcm9WdEJwL3JhejVnbTlDMHNMaWIwRmpLMjcmI3hBOzNFeG1tVkpnb2lTTWc4VllrOUs0cWdyYjh4MHV2eSt2dk5sdHBzczl4WWZXWXB0SmlibklibTBtYUI0MWRWUElGa3FHVlNlUDdOZHMmI3hBO1ZwR2ZsOTUwWHpmb2N1cXBGQkVpWE10c24xYTRhNVJoSFNqRXZGYlN4c2VXNlNScXcra1lvS2VhaGZmVklveUU5U1NhVklZa3J4QmQmI3hBO3p0VnFHZytqTE1jT0krNXF6WmVBRHFTYVF1aXpTSlpYVFhETWZSbm1CQmRwYUtoNkJuK0lnWlBNQVpDdW9IazA2YVJFWmNYU1I2MnYmI3hBOzBuVnByNG5uYXZBaGpTV09ROHlwRDErR3JJZzVEMnFQZkJseENIVzA2ZlVISnpqVzEvalliL05SdDlkbGt2QkJMYkxIRzF4SmFySXMmI3hBO2hZODQxTFY0OEYySUhqa3BZQUkyRDB0aERWa3lvamJpTWVmVWI5eXM5M2ZqWEV0VVZEYW1BeU5WaUdxSEFxQndQajBya1JDUGgzMXQmI3hBO3NPU2ZpOElyaHI4ZEZ0N3JSdGIrTzE5RU9ydEVyT0grSUdaeWdQQUJ0Z2U3RWUyR0dIaWpkOS8ySXk2bmdtSTEzZGU4MXkvWFMrOUwmI3hBO3JxMm5jWGNDUXlxNkJtQ3NCR1NLclhpZC9iQkQ2SmZCT1d4a2g4ZnVVNzNXM2d2V3RZclY3Z3hyRzh4UU9TQkl4QTRoVVlHZ0JPNUcmI3hBO0dHRzQyVFRITHF1R2ZDSWsxVi9INGZxWDZ2cS82UE1WWWd3a0RIMUhZb2dLMG9wWUs0QmF1M0tnOThHTER4c3RScVBEcmJuOG1KZVEmI3hBO2YrVlcvcEQvQUoxUDFmVTQzWDFUbjlmK3FjUFdYNjM5USt0ZjZOeDlYajZuMWJicFhLWEtYK1h2K1ZZLzR2bC9SZnJmcDM2eHFYcCsmI3hBO3Y5ZjlENng2dy9TWDFUNnovb3ZQMWY3MzBQMVlxd2ovQUoxWC9sYzNuVC9GM0w2ajlZMFA2clg2OTlTK3Nla1BxMzFyMHY4QVEvdDgmI3hBO2FmV051WDJjS3ZRZlAzK0F2cm1qL3dDSlBySDZUNVhINkYvUi93QmYrdS8zWSt0ZWwramY5STRlblQxUDJlbGNDSGVhL3dEbFhIK0QmI3hBOzlOL1RmRC9EM08xL1EzMWY2eHo5WGovb24xVDZwKy81OGZzZW52aWxENjkveXJiL0FKVnJKK2xmckgrRGYrUG5qK2tQVzVldjhmcismI3hBO2wvcG5QNnhYMU9meGNxODk4VlZQUFgvS3ZmcUdpLzRvK3NVOVJ2MFA2ZjZRK3U4L3F6K3IvdkwvQUtWVDZ2ejlYbnRUN2VLb0NiL2wmI3hBO1UvOEF5cCtQbjlZLzVWejZIdzhmMG55K3JlcWZ0Y2Y5TTlMbDQvRHhwK3pUQ3FQODcvNEIvUW1oZjRuK3ZmVXZybHAraHVQNlQrc2YmI3hBO1hkdnF2UDZ2L3BIcmN1bnE3OHV2eFlGVXZ6QS81VnIra1l2OFYvV1ByUDFHYm42SDZSOUw2aDZpZXY4QVd2cWY3cjBlZkhsNjN3NHEmI3hBO2pmekUvd0FEZlZ0Si93QVZldnordkwraHZxWDEzNjU5YzlONmVoK2p2OUpyNmZPdE52SHRpaEsvelA4QStWVS9XYlQvQUJ0Nm4xbjYmI3hBO3BlZWw5WCt2OC9xTkUrdCt2OVEzOUQ3UEwxZmgvSEZJUnV0LzRFL3c1NWQrdi9wRDlIK3ZGL2gvNnY4QXBYNjk2MzFXYmhUNnQvcHQmI3hBO2ZxM3E4dlU3VjVZcW4vbFgvRC8rSE5PL3c3NmY2RDlCUDBmNlZlUHBVMisxOGZMK2JsOFZhOHQ2NG9TUHp2OEE0SC9UbWcvNGcrdi8mI3hBO0FLVjV6L29MNmorbEsrcDZMZXR4L1IvdzgvUjUvYTM0MTdWeFN4Lzh2ZjhBbFRQNlkwZi9BQWY5ZCt1L28yYjlFOHYwejZQNk85WnYmI3hBO1UvM3EvY2VuNi9UbisxU243T0ZVeW4vNVZYL2oyNHI2ditKUHJOcDlmOUg2L3dEVS9ybkQvUlByUHAvNkQ2L0ducCtyOFhTbTlNQ28mI3hBO1g4enYrVlAvQUtSay93QVordDllL1JqZlcvcW42UzVmb3YxdC9yWDZPMjlEMXZzK3J0eXJUQ3FaZWFQK1ZmZjRQMFg5TmZYdjBIOWEmI3hBO3N2MFA2UDZVK3MvV2EvNkZYNnQvcGZMbFRqNm43Zkg5cmpnVkVlZnY4Q2V0cFA4QWlYMS9yM3FTL29iNmo5ZSt1OHVBOWYwZjBkL3AmI3hBO0hIaFRuK3pUcmlxenpQOEE4cTUvdzlvWDZVcitqUFZ0L3dERG4xSDYxOVk5WDBqNkgxUDZqL3BOZlJyOWo5bnJ0aXFHaC81VmQveXEmI3hBOzMvUi8rVUY0YitqOWM5U3YxamV2RC9UUFYrc2ZhL2I1ZGNWVHJ5VC9BSVUvUmx6L0FJYjUraDlibCt2ZXY5WitzZlhOdlYrc2ZXLzkmI3hBO0k5VDdOZlUzcFR0aWhOdFYvUi8xVC9UL0FPNTVyeHB5NWM2L0R3NGZIeXIwNDVaaTRyOVBOcHo4SEQ2K1g0N3QxTFMvMFg2Rng5VTUmI3hBOytsNmpmV1BWOVgrOHA4ZGZXMytlU3k4ZGkvMGZvWVlQRG84UEs5N3ZuMTVyZEkvUkZEOVE1Y2VJNGMvVnA2ZGR2VDlYOWl2OG0yT1gmI3hBO2ovaS9SOXRJMC9oL3dmcDVlVjlQZHNoWS93RERuMXFQaDZ2ci9XMzRWK3MwK3MwK1ByOFBUclhhbVdIeEs2VncrWEpxSGdjUTUzeGYmI3hBOzB2cTYvamtqN2o5SGZwTzM5VGw5ZjRONlBEMVA3dW81YytIdzhhMCszdFhLbzhYQ2ErbjRmajVOOCtEeEJmMTlPZkx6cnA3MEhxUCsmI3hBO0gvcnpmV3ZVK3RWaDUrbjY5T1hMOXpYMHZoNWN2czk4c3grSnc3Y3QrNzQ4Mm5ONFBINnI0dHY1MytieTY5M1ZHWGYxRDYvWit2eismI3hBO3RWZjZyeDlUalhqOFZlSHdkUDVzcmh4Y0pybDE1TitUZzQ0MzlYVG4vWjgxSysvUTMxNWZySEw2endITGg2dFBUNWJlcjZmdzhlWDgmI3hBOysyU2h4OE8zTDRmWit4aGw4TGo5WDFWNTh2T3VudmRxbjZJOVZmcjNQbDZiMTQrcng5S281OC9UK0hqMHJ5d1l1T3ZUK2hjL2gzNismI3hBOzd6NWRicnA3My8vWjwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyI+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MDQ4MDExNzQwNzIwNjgxMTgzRDFBMTI1QTk3QkU5MTY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06UmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC94bXBNTTpSZW5kaXRpb25DbGFzcz4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+dXVpZDplZTM5NjdiOC1mMTM4LTQ3NGMtYTAxYy0xZWNhYWU4MTE5MDE8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6QzM3QzJDM0I0NTIwNjgxMTgyMkFFQ0VBQjNEQTA5MDI8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo1RDIwODkyNDkzQkZEQjExOTE0QTg1OTBEMzE1MDhDODwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6cmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC9zdFJlZjpyZW5kaXRpb25DbGFzcz4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOkMzN0MyQzNCNDUyMDY4MTE4MjJBRUNFQUIzREEwOTAyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTAzLTIzVDEyOjQzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjA0ODAxMTc0MDcyMDY4MTE4M0QxQTEyNUE5N0JFOTE2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTA2LTExVDEyOjAzOjAxKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBJbGx1c3RyYXRvciBDUzYgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iPgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+UHJpbnQ8L2lsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6cGRmPSJodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvIj4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgbGlicmFyeSAxMC4wMTwvcGRmOlByb2R1Y2VyPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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",
					width: 180, margin: [ 0, 20, 0, 40 ]
				},
			    {
			    	text: 'En nombre de todo el equipo de Enéresi le agradezco su confianza y la animo a contactar directamente conmigo en caso de que tenga cualquier duda. ',
			    	margin: [ 0, 10, 0, 20 ]
			    },
			    {
			    	columns: [
			    		{ width: '30%', text: 'imagen'},
			    		[
			    			'Sergi de Verdonces',
							'Responsable d’atenció i suport al pacient.',
							'El meu telèfon de contacte és el 93 726 81 07',
							'El meu correu electrònic és sverdonces@eneresi.com'
				    	],
			    	]
			    }
		    ],
		    styles: {
		      header: {
		        bold: true,
		        color: '#000',
		        fontSize: 11
		      },
		      demoTable: {
		        color: '#666',
		        fontSize: 9
		      }
		    },
		    defaultStyle: {
				columnGap: 25,
			}
		  };

		pdfMake.createPdf(docDefinition).open();
	}

}])

.controller('GesdentCtrl', ['$rootScope','$scope', '$routeParams','$location', 'Users', 'AuthService', 'Presus', '$filter', 'postman', '$q', '$compile', '$timeout',
					function($rootScope, $scope, $routeParams, $location, Users, AuthService, Presus, $filter, postman, $q, $compile, $timeout) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');
	$scope.minimo = 1000;
	$scope.detallame = 1;
	$scope.estado = 's';
	$scope.muestrame = "ppto.FecAceptaBool==0 && ppto.FecRechazBool==0";

	var desde = moment().subtract(6, 'months').format('YYYYMMDD');
	//console.log("detallessssss",desde);

	Presus.countRecallsActius($rootScope.user.centre).then( function(res){
		console.log("detallessssss",res.data.data[0]);
		$scope.recalls = res.data.data[0].recalls;
	});

	Presus.getGesdent($rootScope.user.centre,desde).then( function(res){
		console.log("feinaaaa inici", res);
		$scope.pptos = res;
	});

	$scope.resetFiltros = function(){
		$scope.busca = {};
		$scope.minimo = 0;
	}

	$scope.a = function(){
		$scope.minimo = 1000;
	}
	$scope.b = function(){
		$scope.minimo = 2500;
	}
	$scope.c = function(){
		$scope.minimo = 6000;
	}

	$scope.detallamelos = function(){
		if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }
		//console.log("nuevo ppto");
		$scope.detallame = ($scope.detallame == 0? 1:0);
	}

	$scope.seguimiento = function(){
		$scope.muestrame = "ppto.FecAceptaBool==0";
		console.log("desplegable", $scope.muestrame);
	}
	$scope.aceptado = function(){
		$scope.muestrame = "ppto.FecAceptaBool==1";
		console.log("desplegable", $scope.muestrame);
	}
	$scope.opcional = function(){
		$scope.muestrame = "ppto.OpcionalBool==1";
		console.log("desplegable", $scope.muestrame);
	}
	$scope.rechazado = function(){
		$scope.muestrame = "ppto.FecRechazBool==1";
		console.log("desplegable", $scope.muestrame);
	}
	$scope.filtra = function(){
		console.log("desplegable", $scope.estado);
		switch ($scope.estado){
			case 's': $scope.seguimiento(); break;
			case 'a': $scope.aceptado(); break;
			case 'r': $scope.rechazado(); break;
			case 'o': $scope.opcional(); break;
			default: $scope.seguimiento();
		}
	}

}])

.controller('CitasHoyCtrl', ['$rootScope','$scope', '$routeParams','$location', 'Users', 'AuthService', 'Citas', '$filter', 'postman', '$q', '$compile', '$timeout',
					function($rootScope, $scope, $routeParams, $location, Users, AuthService, Citas, $filter, postman, $q, $compile, $timeout) {
	//===============================================

	// por defecto listado de pptos
	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	$scope.mes = moment().format('M');
	$scope.any = moment().format('YYYY');

	//$scope.fecha = moment().add(2, 'days').format('YYYYMMDD');
	$scope.fecha = moment().format('YYYYMMDD');
	//var hoy = moment().add(9, 'days').format('YYYYMMDD');
	console.log("detallessssss",$scope.fecha);

	Citas.citas($rootScope.user.centre,$scope.fecha).then( function(res){
		console.log("detallessssss",res.data.data);
		$scope.citas = res.data.data;
	});

	$scope.menos = function(){
		$scope.fecha = moment($scope.fecha,'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
		console.log("fechaaaaaa",$scope.fecha);
		Citas.citas($rootScope.user.centre,$scope.fecha).then( function(res){
			console.log("detallessssss",res.data.data);
			$scope.citas = res.data.data;
		});
	}
	$scope.mas = function(){
		$scope.fecha = moment($scope.fecha,'YYYYMMDD').add(1, 'days').format('YYYYMMDD');;
		console.log("fechaaaaaa",$scope.fecha);
		Citas.citas($rootScope.user.centre,$scope.fecha).then( function(res){
			console.log("detallessssss",res.data.data);
			$scope.citas = res.data.data;
		});
	}

}])

//===============================================//===============================================//===============================================
//===============================================//===============================================//===============================================



;


}());

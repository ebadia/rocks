// smsCtrlAs.js

(function(){

angular.module('myApp.smsAsControllers', [])
	.controller('SmsCtrl', SmsCtrl)
	.controller('CitasSmsCtrl', CitasSmsCtrl)
	.controller('CumplesSmsCtrl', CumplesSmsCtrl)
	.controller('ListaSmsCtrl', ListaSmsCtrl)
;

// Funciones de los controladores ===============================================

//===============================================
function SmsCtrl( $rootScope, $scope, $location, $routeParams, Sms, postman ) {
//===============================================
	
	var smsv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	smsv.sms = {};

	var init = function(){
		//smsv.sms.from = $rootScope.user.marca;
		// enviamos desde 	
		smsv.sms.from = "";
		smsv.sms.to = $routeParams.phone;
		smsv.sms.message = $rootScope.user.marca+". "+($routeParams.paciente===undefined?"":$routeParams.paciente) + " ";
	};

	init();

	smsv.sendSMS = function(obj){
		//obj.from = 'Eneresi';
		Sms.smsTM(obj).then( function(data){
			console.log("de enviar sms",data);
			if ( !data.error ){
				// para registro del sms en la bbdd y poder controlar los envios
				obj.motivo = 'msg';
				Sms.putSMS(obj).then( function(res){
					init();
					postman.success('BIEENNN!', 'SMS enviado a su destinatario. Eres un fenómeno.');
				});
			} else {
				postman.error('OHHHH!', 'Algo ha ido mal con el mensaje. Deberias intentar de nuevo.');
			}
		})
	};
	
}
SmsCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Sms', 'postman'];


//===============================================
function CitasSmsCtrl( $rootScope, $scope, $location, Sms, postman ) {
//===============================================
	
	var smsv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){
		smsv.fecha = moment().format('YYYY-MM-DD');
		smsv.fechaGD = moment().format('YYYYMMDD');
		// smsv.fecha = '2015-08-19';
		$scope.dateOptions = {
			dateInit : smsv.fecha,
			startingDay: 1
		};
		smsCitasFecha($rootScope.user.centre, smsv.fecha);
		smsCitasSinMovilFecha($rootScope.user.centre, smsv.fechaGD);
	};


	var smsCitasFecha = function(centro, fecha){
		//console.log("smssss,", centro + " --- " + fecha);
		Sms.citasSMS(centro, fecha).then( function(res) {
			//console.log("citas de la fecha de sms", res);
			smsv.citas = res.data;
		});
	}
	var smsCitasSinMovilFecha = function(centro, fecha){
		console.log("smssss sin movil", centro + " --- " + fecha);
		Sms.citasSinMovilSMS(centro, fecha).then( function(res) {
			console.log("citas de la fecha sin movil", res.data.data);
			smsv.citassin = res.data.data;
		});
	}

	smsv.openCalendar = function($event){
		//console.log("mes " + $rootScope.centre);
		console.log("abrete sesamo");
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	}

	smsv.dia = function(){
		//console.log("mes " + $rootScope.centre);
		console.log(moment(smsv.fecha).format('YYYY-MM-DD'))	;
		smsCitasFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYY-MM-DD'));
		smsCitasSinMovilFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYYMMDD'));
	}
	smsv.mas = function(){
		//console.log("mes " + $rootScope.centre);
		console.log( moment(smsv.fecha).add(1,'days').format('YYYY-MM-DD') );
		smsCitasFecha($rootScope.user.centre, moment(smsv.fecha).add(1,'days').format('YYYY-MM-DD'));
		smsCitasSinMovilFecha($rootScope.user.centre, moment(smsv.fecha).add(1,'days').format('YYYYMMDD'));
		smsv.fecha = moment(smsv.fecha).add(1,'days').format('YYYY-MM-DD');
	}
	smsv.menos = function(){
		//console.log("mes " + $rootScope.centre);
		console.log( moment(smsv.fecha).subtract(1,'days').format('YYYY-MM-DD') );
		smsCitasFecha($rootScope.user.centre, moment(smsv.fecha).subtract(1,'days').format('YYYY-MM-DD'));
		smsCitasSinMovilFecha($rootScope.user.centre, moment(smsv.fecha).subtract(1,'days').format('YYYYMMDD'));
		smsv.fecha = moment(smsv.fecha).subtract(1,'days').format('YYYY-MM-DD');
	}

	smsv.confirma = function(sms, index){
		//console.log("smssss", sms);
		Sms.confirmaSMS(sms.id).then( function(res) {
			//console.log("confirma de sms", res);
			//pone la linea con el dato cambiado
			smsv.citas[index].confirmado = 1;
		});
	};
	smsv.reprograma = function(sms, index){
		//console.log("smssss", sms);
		Sms.reprogramaSMS(sms.id).then( function(res) {
			//console.log("confirma de sms", res);
			//pone la linea con el dato cambiado
			smsv.citas[index].reprogramado = 1;
		});
	};
	smsv.confirmaGD = function(sms, index){
		// console.log("smssss", sms);
		Sms.marcaCitaAvisadaSinMovil($rootScope.user.centre, sms).then( function(res) {
			//console.log("confirma de sms", res);
			//pone la linea con el dato cambiado
			smsv.citassin[index].Recordada = 1;
		});
	};

	init();

}
CitasSmsCtrl.$inject = ['$rootScope','$scope', '$location', 'Sms', 'postman'];

//===============================================
function CumplesSmsCtrl( $rootScope, $scope, $location, Sms, postman ) {
//===============================================
	
	var smsv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	smsv.sms = {};

	var init = function(){
		console.log("original",moment().format('YYYY-MM-DDTHH:mm:ssZ'));

		smsv.fecha = moment().format('YYYY-MM-DD');
		$scope.dateOptions = {
			dateInit : smsv.fecha,
			startingDay: 1
		};
		cumplesCitasFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYYMMDD'));
	};

	var cumplesCitasFecha = function(centro, fecha){
		Sms.smscumples(centro, fecha).then( function(res) {
			// console.log("cumples de la fecha de sms", res.data);
			var phones = [];
			for ( var i=0; i<res.data.length; i++){
				phones.push("\'"+res.data[i]['para'].slice(-9)+"\'");
			}
			 console.log("array cumples de la fecha de sms", phones);
			Sms.cumples(centro, fecha, phones).then( function(res) {
				console.log("cumples de la fecha de sms", res.data);
				smsv.citas = res.data;
			});
		});
	};

	init();

	smsv.openCalendar = function($event){
		//console.log("mes " + $rootScope.centre);
		console.log("abrete sesamo");
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	}

	smsv.dia = function(){
		//console.log("mes " + $rootScope.centre);
		
		console.log(moment(smsv.fecha).format('YYYY-MM-DD'));
		cumplesCitasFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYYMMDD'));
	}

}
CumplesSmsCtrl.$inject = ['$rootScope','$scope', '$location', 'Sms', 'postman'];

//===============================================
function ListaSmsCtrl( $rootScope, $scope, $location, $routeParams, Sms, postman ) {
//===============================================
	
	var smsv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	smsv.sms = {};

	var init = function(){
		smsv.filtro = ($routeParams.filtro===undefined?"":$routeParams.filtro);
		
		smsv.fecha = moment().format('YYYY-MM-DD');
		smsv.coste = 0.18;
		// smsv.fecha = '2015-08-19';
		$scope.dateOptions = {
			dateInit : smsv.fecha,
			startingDay: 1
		};
		smsListaFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYYMMDD'));
	};

	var smsListaFecha = function(centro, fecha){
		Sms.SMS(centro, fecha).then( function(res) {
			console.log("citas del mes de sms", res.data.data);
			smsv.citas = res.data.data;
			smsv.msgs = res.data.size;

			smsv.filtro = ($routeParams.filtro===undefined?"":$routeParams.filtro);
		});
	};

	init();

	smsv.openCalendar = function($event){
		//console.log("mes " + $rootScope.centre);
		console.log("abrete sesamo");
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	smsv.dia = function(){
		//console.log("mes " + $rootScope.centre);
		console.log(moment(smsv.fecha).format('YYYY-MM-DD'))	;
		smsListaFecha($rootScope.user.centre, moment(smsv.fecha).format('YYYYMMDD'));
	};

}
ListaSmsCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Sms', 'postman'];

})();

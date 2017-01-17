// fitxaCtrlAs.js

(function(){

angular.module('myApp.fitxaAsControllers', [])
	.controller('FitxaCtrl', FitxaCtrl)
	.controller('ActivaFitxaCtrl', ActivaFitxaCtrl)
;

// Funciones de los controladores ===============================================

//===============================================
function FitxaCtrl( $rootScope, $scope, $location, $routeParams, Fitxa, postman ) {
//===============================================
	
	var fxv = this;

	fxv.pin = "";

	//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){
		// enviamos desde 	
	};

	init();

	fxv.login = function(pin,accion){
		console.log(pin);
		//console.log(accion);
		if ( pin !== "" ) {
			Fitxa.fichar(pin,accion).then( function(res){
				//
				console.log( "fichadooo", res );
				// primero debemos averiguar que tipo de fichado es IN/OUT?
				// Fitxa.ultimofichado(res) -> "","IN","OUT"
				if ( res.length > 0 ){
					// si ha acertado el PIN grabamos el fichado
					Fitxa.fichando(res,accion).then( function(fres){
						//
						console.log( "fin fichannnndooo", fres.data );
						if (fres.data.error === 0){
							if (accion === 'IN')
								postman.success('Animo '+res[0].nom+', hoy puede ser una gran día.');
							else
								postman.success('Hasta la próxima '+res[0].nom);
						} else {
							postman.error('OHHHH!', 'Algo ha ido mal con el PIN. Deberias intentar de nuevo.');
						}
					})
				} else {
					postman.error('OHHHH!', 'Algo ha ido mal con el PIN. Deberias intentar de nuevo.');
				}
				
				fxv.pin = "";
			});
		} else {
			postman.error('OHHHH!', 'Has olvidado poner el PIN.');
		}
	};
	
}
FitxaCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Fitxa', 'postman'];

//===============================================
function ActivaFitxaCtrl( $rootScope, $scope, $location, $routeParams, Fitxa, postman, localStorageService ) {
//===============================================
	
	var fxv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	// defaults
	fxv.activo = $rootScope.ficharactivo;
	fxv.visualiza = false;

	// defaults
	fxv.lista = [];
	fxv.persona = {};
	fxv.options = {};
	fxv.mesos = [
		{name: 'enero', value: '1'},
		{name: 'febrero', value: '2'},
		{name: 'marzo', value: '3'},
		{name: 'abril', value: '4'},
		{name: 'mayo', value: '5'},
		{name: 'junio', value: '6'},
		{name: 'julio', value: '7'},
		{name: 'agosto', value: '8'},
		{name: 'septiembre', value: '9'},
		{name: 'octubre', value: '10'},
		{name: 'noviembre', value: '11'},
		{name: 'diciembre', value: '12'}
	];
	fxv.anys = [
		{name: '2015', value: '2015'},
		{name: '2016', value: '2016'},
		{name: '2017', value: '2017'},
		{name: '2018', value: '2018'},
		{name: '2019', value: '2019'},
		{name: '2020', value: '2020'}
	];

	var init = function(){
		// enviamos desde
		console.log("activarrr fichar",$rootScope.ficharactivo);
		fxv.activo = $rootScope.ficharactivo;

		// enviamos desde
		fxv.fields = [
			{
			  key: 'mes',
			  type: 'select',
			  defaultValue: moment().format('M'),
			  templateOptions: {
			    label: 'Mes',
			    options: fxv.mesos,
			    required: true
			  }
			},
			{
			  key: 'any',
			  type: 'select',
			  defaultValue: moment().format('YYYY'),
			  templateOptions: {
			    label: 'Año',
			    options: fxv.anys,
			    required: true
			  }
			},
		];
	};

	init();

	fxv.toggle = function(){
		console.log("activarrr activo",fxv.activo);
		//console.log(accion);
		localStorageService.set('ficharactivo', fxv.activo);
		$rootScope.ficharactivo = localStorageService.get('ficharactivo');
		console.log("activarrr fichar",$rootScope.ficharactivo);

	};

	fxv.onSubmit = function(){

		Fitxa.listafichado(fxv.persona.mes,fxv.persona.any,$rootScope.user.centre).then(function(res){
			fxv.lista = res;
			Fitxa.listadetallefichado(fxv.persona.mes,fxv.persona.any,$rootScope.user.centre).then(function(res){
				fxv.listadetalle = res;
				fxv.visualiza = true;
			});
		});

	};

	fxv.exporta = function(){
		console.log("activarrr activo",fxv.lista);
		var hora = moment().format('HHmmss');
		//alasql('SELECT * INTO CSV("fichaje-'+$rootScope.user.centre+'-'+fxv.persona.any+'-'+fxv.persona.mes+'-'+hora+'.csv",{headers:true}) FROM ?',[fxv.lista]);
		alasql('SELECT * INTO XLSX("fichaje-'+$rootScope.user.centre+'-'+fxv.persona.any+'-'+fxv.persona.mes+'-'+hora+'.xlsx",{headers:true}) FROM ?',[fxv.lista]);
		alasql('SELECT * INTO XLSX("fichaje-detalle-'+$rootScope.user.centre+'-'+fxv.persona.any+'-'+fxv.persona.mes+'-'+hora+'.xlsx",{headers:true}) FROM ?',[fxv.listadetalle]);
		fxv.visualiza = false;
	};
	
}
ActivaFitxaCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Fitxa', 'postman', 'localStorageService'];


})();

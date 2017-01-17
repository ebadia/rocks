// fitxaCtrlAs.js

(function(){

angular.module('myApp.personalAsControllers', [])
	.controller('PersonalCtrl', PersonalCtrl)
	.controller('PersonalEditaCtrl', PersonalEditaCtrl)
;

// Funciones de los controladores ===============================================

//===============================================
function PersonalCtrl( $rootScope, $scope, $location, $routeParams, Personal, postman, dialogs ) {
//===============================================
	
	var fxv = this;
	fxv.edita = false;
	fxv.persona = {};
	fxv.options = {};
	fxv.privilegis = [
		{name: 'front', value: '2'},
		{name: 'normal', value: '1'},
		{name: 'master', value: '0'}
	];
	fxv.super = [
		{name: 'No', value: null},
		{name: 'Si', value: '1'}
	];


	//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){

		Personal.centros().then(function(res){
			console.log("sentrosss", res);
			fxv.centros = res;
			fxv.fields.push(
				{
				  key: 'centre_id',
				  type: 'select',
				  defaultValue: $rootScope.user.centre,
				  templateOptions: {
				    label: 'Centro',
				    options: fxv.centros,
				    required: true
					}
				}
			);
		});
		// busca primero la lista
		Personal.lista($rootScope.user.centre).then(function(res){
			console.log("personal list", res);
			fxv.personal = res;
		});

		// enviamos desde
		fxv.fields = [
			{
			  key: 'id',
			  type: 'input',
			  hide: true
			},
			{
			  key: 'nom',
			  type: 'input',
			  templateOptions: {
			    label: 'Nombre',
			    placeholder: 'nombre',
			    required: true
			  }
			},
			{
			  key: 'email',
			  type: 'input',
			  templateOptions: {
			    label: 'Email',
			    placeholder: 'email',
			    //required: true
			  }
			},
			{
			  key: 'password',
			  type: 'input',
			  templateOptions: {
			  	type: 'password',
			    label: 'Password',
			    placeholder: 'password',
			    //required: true
			  }
			},
			{
			  key: 'privilegis_id',
			  type: 'select',
			  defaultValue: '0',
			  templateOptions: {
			    label: 'Privilegis (Economía y Gestión)',
			    options: fxv.privilegis,
			    required: true
			  }
			},
			{
			  key: 'super',
			  type: 'select',
			  defaultValue: null,
			  templateOptions: {
			    label: 'Es Super (Multicentros)',
			    options: fxv.super,
			    required: true
			  }
			},
			{
			  key: 'pin',
			  type: 'input',
			  templateOptions: {
			    label: 'Pin de entrada/salida',
			    placeholder: 'pin',
			    //pattern: '[0-9]{6}'
			  },

			},

		];

	};

	init();

	var lista = function(){
		Personal.lista().then(function(res){
			console.log("personal list", res);
			fxv.personal = res;
		});
	}
	
	fxv.editar = function(persona){
		fxv.persona = persona;
		fxv.edita = true;
	}

	fxv.reset = function(){
		fxv.options.resetModel();
	}

	fxv.cancela = function(){
		fxv.edita = false;
		fxv.persona = {
			privilegis_id: '0',
			super: null
		};
	}

	fxv.nuevo = function(){
		fxv.edita = true;
	}

	fxv.delete = function(persona){
		var dlg = dialogs.confirm('Eliminar persona', '¿Estas seguro de eliminar esta persona de Enéresi?');
		dlg.result.then(function(btn){
			//$scope.confirmed = 'You confirmed "Yes."';
			console.log('Eliminar persona', persona.id);
			Personal.deletepersona(persona.id).then( function(res){
				// borrada
				console.log("personal borrada", res);
				lista();
				$location.path("/gestion/personal");
			});
		},function(btn){
			//$scope.confirmed = 'You confirmed "No."';
		});
	}

}

PersonalCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Personal', 'postman', 'dialogs'];

//===============================================
function PersonalEditaCtrl( $rootScope, $scope, $location, $routeParams, Personal, postman, dialogs ) {
//===============================================
	
	var fxv = this;

	fxv.persona = {};
	fxv.options = {};
	fxv.privilegis = [
		{name: 'front', value: '2'},
		{name: 'normal', value: '1'},
		{name: 'master', value: '0'}
	];
	fxv.super = [
		{name: 'No', value: null},
		{name: 'Si', value: '1'}
	];


	//if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	var init = function(){

		Personal.centros().then(function(res){
			// console.log("sentrosss", res);
			fxv.centros = res;
			fxv.fields.push(
				{
					key: 'centre_id',
					type: 'select',
					defaultValue: $rootScope.user.centre,
					templateOptions: {
						label: 'Centro',
						options: fxv.centros,
						required: true
					}
				}
			);
		});

		// llenamos los campos del editable
		fxv.fields = [
			{
				key: 'id',
				type: 'input',
				hide: true,
			},
			{
				key: 'nom',
				type: 'input',
				templateOptions: {
					label: 'Nombre',
					placeholder: 'nombre',
					required: true
				}
			},
			{
			  	key: 'email',
			  	type: 'input',
			  	templateOptions: {
			    	label: 'Email',
			    	placeholder: 'email',
			    	//required: true
			  	}
			},
			{
				key: 'password',
				type: 'input',
				templateOptions: {
					type: 'password',
					label: 'Password',
					placeholder: 'password',
				  //required: true
				}
			},
			{
				key: 'privilegis_id',
				type: 'select',
				defaultValue: '0',
				templateOptions: {
				  label: 'Privilegis (Economía y Gestión)',
				  options: fxv.privilegis,
				  required: true
				}
			},
			{
				key: 'super',
				type: 'select',
				defaultValue: null,
				templateOptions: {
				  label: 'Es Super (Multicentros)',
				  options: fxv.super,
				  required: true
				}
			},
			{
				key: 'pin',
				type: 'input',
				templateOptions: {
				  label: 'Pin de entrada/salida',
				  placeholder: 'pin',
				  //pattern: '[0-9]{6}'
				},

			},
		];
		
		console.log("parametrooo", $routeParams.id);

		if ( $routeParams.id != 0 ){
			Personal.edita($routeParams.id).then(function(pres){
				// ponemos los valores del individuo a editar
				fxv.personal = pres;
				console.log("personal a editarr", fxv.personal);
				fxv.originales = angular.copy(fxv.personal);
			});
		}

	};

	init();

	fxv.onSubmit = function(){
		// console.log("envio de persona ", fxv.personal);
		// console.log("id de persona ", fxv.personal.id);
		// si el pin no esta definido, entonces lo anulamos
		if (fxv.personal.pin === undefined) fxv.personal.pin = "null";
		if (fxv.personal.super === null) fxv.personal.super = "null";

		if ( fxv.personal.id === undefined ){
			// estamos creando nuevo
			Personal.addpersona(fxv.personal).then(function(res){
				console.log("personal list", res);
				$location.path("/gestion/personal");
			});
		} else {
			// estamos editando persona
			Personal.updatepersona(fxv.personal).then(function(res){
				console.log("personal list", res);
				$location.path("/gestion/personal");
			});
		}
	}
}

PersonalEditaCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Personal', 'postman', 'dialogs'];

})();

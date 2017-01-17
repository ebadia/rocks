// facturasCtrlAs.js

(function(){

angular.module('myApp.facturasAsControllers', [])
	.controller('FacturasCtrl', FacturasCtrl)
;

// Funciones de los controladores ===============================================

//===============================================
function FacturasCtrl( $rootScope, $scope, $location, $routeParams, Invoice, postman ) {
//===============================================
	
	var smsv = this;

	if (!$rootScope.logged ){ console.log($rootScope.logged); $location.path("/login"); }

	//smsv.facturas = {};

	var init = function(){
		Invoice.facturas().then( function(res){
			
			angular.forEach(res.rows, function(value,key){
				//console.log("facturassss-value", value );
				//console.log("facturassss-key", key );
				value.value.posicion = value.key.substr(0, value.key.indexOf("-") );
				value.value.fecha = moment(value.value.date).format('YYYY-MM-DD');
				value.value.mes = moment(value.value.date).format('MM');
				value.value.anyo = moment(value.value.date).format('YYYY');
				value.value.total = 0;
				angular.forEach(value.value.items, function(v){
					value.value.total = value.value.total + (v.qty*v.cost)*(1+(v.iva/100));
				});
			});

			smsv.facturas = res.rows;
			console.log(res.rows);
			var resultado = alasql( 'SELECT `value`->anyo as anyo, `value`->mes as mes, \
				`value`->customerInfo->name as cliente, `value`->posicion as tipo, \
				sum(`value`->total) as total \
				FROM ? \
				GROUP BY `value`->anyo, `value`->mes, `value`->posicion, `value`->customerInfo->name \
				ORDER BY anyo,mes,cliente,tipo', 
			[res.rows]);
    		console.log(resultado);
    		smsv.resumen = resultado;

		});
	};

	init();

	smsv.exportar = function(){
		console.log("exportar");
		alasql('SELECT * INTO XLSX("facturado-argos.xlsx",{headers:true}) FROM ?',[smsv.resumen]);
	}
	
}
FacturasCtrl.$inject = ['$rootScope','$scope', '$location', '$routeParams', 'Invoice', 'postman'];


})();

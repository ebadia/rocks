// comprasCtrlAs.js

(function(){

angular.module('myApp.comprasAsControllers', [])
	.controller('ArticulosAsCtrl', ArticulosAsCtrl)
	.directive("gastosAcumulados", gastosAcumulados)
;

function ArticulosAsCtrl( $scope, $rootScope, $location, Compras, dialogs ) {
	//===============================================
	var articulosAs = this;

	articulosAs.busca = {};
	articulosAs.carro = 0;

    Compras.allArticles().then( function(data){
        //console.log('articulosAs',data);
        articulosAs.articulos = data;
        //$scope.busca.nom = "zzz";
    });

    Compras.cartsize($rootScope.user.centre).then( function(res){
    	//console.log('mida',res.size);
    	articulosAs.carro = res.size;
		$scope.$emit('addedtocart', {compro: res.size} );
	});

    $scope.$on('addedtocartHandle', function(e,v){
		console.log("vvvvvvvvvvvv",v);
		articulosAs.carro = v.compro;
	})

    articulosAs.alCarro = function(ppto){

		var dlg = dialogs.create('partials/modals/carroq.html','ComproController', { title: 'joroña', compro : ppto} ,'lg');
		dlg.result.then(
			function(data){
				console.log('compraooo', data);
			},
			function(){
				console.log('compraooo', 'alcuerno');
    	});
    }
};
ArticulosAsCtrl.$inject = ['$scope', '$rootScope', '$location', 'Compras', 'dialogs'];

function gastosAcumulados(Compras) {
    return {
        restrict: 'AE',
        replace: true,
        scope: { 
            en : '@',
            centro: '@'
        },
        templateUrl: './partials/compras/acumulado.html',
        controllerAs: 'vm',
        bindToController: true,
        controller: function() {
        	var vm = this;

            vm.limite = 0;
            vm.limiteAnual = 0;

        	Compras.getGasto(vm.centro,vm.en).then( function(res){
        		// console.log("esto es el limite", res[0].gasto);
        		vm.acumulado = res[0].gasto;
        	});
        	Compras.getGastoAnual(vm.centro,vm.en).then( function(res){
        		// console.log("esto es el limite", res[0].gasto);
        		vm.acumuladoAnual = res[0].gasto;
        	});
            console.log("esto es el limite", vm.limite);
        }
    };
};
gastosAcumulados.$inject = ['Compras'];

}());
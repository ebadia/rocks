'use strict';

/* Controllers */

(function(){

angular.module('myApp.comprasControllers', [])

.controller('ArticulosCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs',
				function( $scope, $rootScope, $location, Compras, dialogs ) {
	//===============================================
	
	$scope.busca = {};
	$scope.options = {};
	$scope.busca = {};
	$scope.carro = 0;
	$scope.albaran = [];
	$scope.numAlbaran = "";
	$scope.valorAlbaran = 0;
	$scope.articulos = [];

/*
    Compras.allArticles().then( function(data){
        //console.log(data);
        //$scope.articulos = data;
        //$scope.busca.nom = "zzz";
    });


    Compras.proveidors().then( function(data){
    	console.log('proveidors', data);
    	$scope.fields = [
			{ 
				className: 'row',
				fieldGroup: [
		    		{
		    			'key': 'ref',
		    			type: 'input',
		    			className: 'col-xs-4',
		    			templateOptions: {
		    				label: 'Filtra ref...',
		    			}
		    		},
		    		{
		    			'key': 'nom',
		    			type: 'input',
		    			className: 'col-xs-4',
		    			templateOptions: {
		    				label: 'Filtra articulo...',
		    			}
		    		},
		    		{
		    			'key': 'proveidor',
		    			type: 'select',
		    			className: 'col-xs-4',
		    			templateOptions: {
		    				label: 'Filtra proveedor...',
		    				options: data,
		    				valueProp: 'name',
		    				labelProp: 'name'
		    			}
		    		}
		    	]
		    }
    	]
    });


    Compras.cartsize($rootScope.user.centre).then( function(res){
    	//console.log('mida',res.size);
    	$scope.carro = res.size;
		$scope.$emit('addedtocart', {compro: res.size} );
	});
*/
    $scope.$on('addedtocartHandle', function(e,v){
		console.log("vvvvvvvvvvvv",v);
		$scope.carro = v.compro;
	});

    // console.log('buscaaaa', $scope.busca);

    angular.element('#buscame').focus();


    $scope.compra = function(item){
    	// identifica un articulo por su REF y lo "adquiere"
    	if ( item !== "" && item !== undefined ){
    	// console.log("item", item);
	    	Compras.getArticle(item).then( function(res){
	    		// console.log("res", res);

	    		$scope.alCarro(res[0]);
	    		$scope.buscame = "";
	    		angular.element('#buscame').focus();
	    	})
    	}
    }

    $scope.alCarro = function(ppto){

		var dlg = dialogs.create('partials/modals/carroq.html','ComproController', { title: 'joroña', compro : ppto} ,'lg');
		dlg.result.then(
			function(data){
				console.log('compraooo', data);
				$scope.albaran.push(data);
				$scope.valorAlbaran += data.cantidad * data.pvp;
			},
			function(data){
				console.log('NOOO compraooo', data);
				console.log('compraooo', 'alcuerno');
    	});
    }

    $scope.quitamedelalbaran = function(i){
    	console.log("item", i);
    	$scope.albaran.splice(i,1);
    	console.log('compraooo', $scope.albaran);
    	angular.element('#buscame').focus();
    }

    $scope.validaAlbaran = function(){
    	console.log("albaran", $scope.numAlbaran);
    	console.log("albaran", $scope.valorAlbaran);
    	console.log("albaran", $scope.albaran);
    	// pasar el albaran al almacen

    	// resetear el albaran a cero
    	$scope.albaran = [];
    	$scope.numAlbaran = "";
    	$scope.valorAlbaran = 0;

    	angular.element('#buscame').focus();
    }

}])

.controller('VerCarroCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs', 'Global',
				function( $scope, $rootScope, $location, Compras, dialogs, Global ) {
	//===============================================
	
	$scope.busca = {};
	$scope.todosok = 1;
	// necesario para el chekbox de seleccion
	$scope.items = {
		compra: []
	};
	$scope.fecha = moment().format('YYYY.MM');
	$scope.centro = $rootScope.user.centre;

    Compras.carro($rootScope.user.centre).then( function(data){
        console.log(data);
        $scope.articulos = data;
    });

    $scope.$on('addedtocartHandle', function(e,v){
		console.log("vvvvvvvvvvvv",v);
		//$scope.carro = v.items;
		$scope.carro = v.compro;
	})

	$scope.todos = function(){
		$scope.items.compra = angular.copy($scope.articulos);	
	}
	$scope.ninguno = function(){
		$scope.items.compra = [];
	}

	$scope.actualiza = function(ppto){
		
		var dlg = dialogs.create('partials/modals/carroq.html','ActualizoController', { title: 'joroña', compro : ppto} ,'lg');
		dlg.result.then(function(data){
			//$scope.confirmed = 'You confirmed "Yes."';
			console.log('quitame del carro', data);
			Compras.updatecart(data).then( function(res){
				// vuelve a recuperar
				Compras.carro($rootScope.user.centre).then( function(data){
				    console.log(data);
				    $scope.articulos = data;
				});
			});
		});
	}

	$scope.borra = function(linea){
		
		var dlg = dialogs.confirm('Eliminar del carro', '¿Estas seguro de eliminar este articulo del carro?');
		dlg.result.then(function(btn){
			//$scope.confirmed = 'You confirmed "Yes."';
			console.log('quitame del carro', linea);
			Compras.deletefromcart(linea).then( function(res){
				// vuelve a recuperar
				Compras.carro($rootScope.user.centre).then( function(data){
				    console.log(data);
				    $scope.articulos = data;
				});
			});
		},function(btn){
			//$scope.confirmed = 'You confirmed "No."';
		});
	}

	$scope.divide = divide;

	function divide(){
		var provees = [];

		//-- separa las lineas de pedidos por proveedores
		//-- las pone en el array provees
		angular.forEach($scope.items.compra, function(v,k){
			//provees[v.proveidor_id] = [];
			if ( provees[v.proveidor_id] === undefined ){
				provees[v.proveidor_id] = [];
			}
			provees[v.proveidor_id].push(v);
		});

		//-- envia un fichero por cada proveedor que ha identificado
		angular.forEach(provees, function(v,k){
			//console.log('dividido pedido',v);
			var fitxer = Global.CSV( v, 'proveidor_'+k, true );
			console.log('dividido',fitxer);
			Compras.sendfile($rootScope.user, v[0].proveidor_email, v[0].proveidor, 'Pedido', fitxer);
		});
	}

	$scope.hacerpedido = function(){
		
		if ( $scope.items.compra.length > 0){
			// primero prepara los ficheros de envio y hace el envio del email
			divide();
			// luego arregla los valores de la base de datos
			console.log('para hacerpedido', $scope.items.compra );
			Compras.addtopedido($scope.items.compra).then( function(data){
				// borrar los items del carro correspondientes
				//angular.forEach($scope.items.compra, function(v,k){
				//	Compras.deletefromcart(v).then( function(res){
				//	// vuelve a recuperar
				//		Compras.carro($rootScope.user.centre).then( function(data){
				//		    //console.log(data);
				//		    $scope.articulos = data;
				//		});
				//	});
				//});
				Compras.massdeletefromcart($scope.items.compra).then( function(data){
					Compras.carro($rootScope.user.centre).then( function(data){
						    //console.log(data);
						    $scope.articulos = data;
						    // emite cambios en carro y pedidos
						    Compras.cartsize($rootScope.user.centre).then( function(res){
						    	//console.log('items en el carro despues de insercion', res);
						    	$rootScope.$emit('addedtocart', {compro: res.size} );
						    });
						    Compras.pedidossize($rootScope.user.centre).then( function(data){
						    	//console.log('pedidossize',data);
						        $scope.$emit('addedtopedido', {size: data.size} );
						    });
						});
				})
			});
			//
		} else {
			var dlg = dialogs.error('Error', 'Ningun producto del carro escogido');
			dlg.result.then(function(btn){
				console.log('cancelacion ', btn );
			});
		}
	}

}])

.controller('VerPedidosCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs', 'Global',
				function( $scope, $rootScope, $location, Compras, dialogs, Global ) {
	//===============================================
	
	$scope.busca = {};
	$scope.todosok = 1;
	// necesario para el chekbox de seleccion
	$scope.items = {
		compra: []
	};
	$scope.fecha = moment().format('YYYY.MM');
	$scope.centro = $rootScope.user.centre;

    Compras.pedidos($rootScope.user.centre).then( function(data){
        console.log('Compras.pedidos',data);
        $scope.articulos = data;
    });

    $scope.confirmatotal = function(linea){
    	console.log('confirma llegada', linea);
    	// pasa a recibido y marca como inactivo
    	Compras.addtorecibido(linea).then( function(data){
    		// marca el pedido como inactivo
    		Compras.pedidoinactivo(linea).then( function(data){
    			// recupera los pedidos
    			Compras.pedidos($rootScope.user.centre).then( function(data){
    			    console.log('Compras.pedidos',data);
    			    $scope.articulos = data;
    			});
    			Compras.pedidossize($rootScope.user.centre).then( function(data){
    				console.log('pedidossize',data);
    			    $scope.$emit('addedtopedido', {size: data.size} );
    			});
    			Compras.recibidossize($rootScope.user.centre).then( function(data){
    				console.log('recibidossize',data);
    			    $scope.$emit('addedtorecibido', {size: data.size} );
    			});
    		})
    	})

    }

    $scope.confirmaparcial = function(linea){
    	console.log('confirma llegada', linea);
    	// mostrar dialogo para cantidad llegada
		var dlg = dialogs.create('partials/modals/pedidoq.html','PedidoController', { compro : linea } ,'lg');
		dlg.result.then(
			function(data){
				//console.log('llegadas unidades', data);
				// si es el total... pasa a recibido y marca como inactivo
				if ( data.cantidad === linea.cantidad ){
					//console.log('llegadas unidades', data);
					Compras.addtorecibido(data).then( function(res){
						// marca el pedido como inactivo
						Compras.pedidoinactivo(data).then( function(res){
							// recupera los pedidos
							Compras.pedidos($rootScope.user.centre).then( function(res){
							    console.log('Compras.pedidos',res);
							    $scope.articulos = res;
							});
						})
					})
				} else {
					// si es parcial... hacer split uno a recibido e inactivo, resto pendiente
					//console.log('llegadas unidades', data);
					// dividimos el pedido: data es lo recibido, quedate lo pendiente
					var quedate = angular.copy(linea);
					quedate.cantidad = linea.cantidad - data.cantidad;
					// hay que crear un nuevo registo en pedidos para el que se queda
					var mequedo = [];
					mequedo.push(quedate);
					console.log('quedan unidades', mequedo);
					Compras.addtopedido(mequedo);
					// hay que actualizar cantidad y estado del recibido
					Compras.addtorecibido(data).then( function(res){
						// marca el pedido como inactivo
						Compras.pedidoinactivo(data).then( function(res){
							// actualiza cantidad
							console.log('antes de actualizar cantidad', data);
							Compras.pedidonuevacantidad(data).then( function(res){
								// recupera los pedidos
								Compras.pedidos($rootScope.user.centre).then( function(res){
								    console.log('Compras.pedidos',res);
								    $scope.articulos = res;
								});
							});
						})
					})

				}
			},
			function(btn){
				//$scope.confirmed = 'You confirmed "No."';
			}
		);


    }

    $scope.devuelve = function(linea){
    	console.log('confirma llegada', linea);
		// marca el pedido como inactivo
		var dlg = dialogs.create('partials/modals/devolucion.html','DevolucionController', { compro : linea } ,'lg');
		dlg.result.then(
			function(data){
				linea.motivo = data.motivo;
				console.log('Compras.pedidos',linea);
				Compras.pedidodevuelve(linea).then( function(data){
					// recupera los pedidos
					Compras.pedidos($rootScope.user.centre).then( function(data){
					    console.log('Compras.pedidos',data);
					    $scope.articulos = data;
					});
				});

				var provees = [];
				provees[linea.proveidor_id] = [];
				provees[linea.proveidor_id].push(linea);
				var fitxer = Global.CSV( provees[linea.proveidor_id], 'proveidor_'+linea.proveidor_id, true );
				//console.log('dividido',provees);
				Compras.sendfile($rootScope.user, linea.proveidor_email, linea.proveidor, 'Devolución', fitxer);
			},
			function(btn){
				//$scope.confirmed = 'You confirmed "No."';
			}
		);
    }


}])

.controller('VerDevolucionesCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs',
				function( $scope, $rootScope, $location, Compras, dialogs ) {
	//===============================================
	
	$scope.busca = {};
	$scope.todosok = 1;
	// necesario para el chekbox de seleccion
	$scope.items = {
		compra: []
	};

    Compras.devoluciones($rootScope.user.centre).then( function(data){
        console.log('Compras.pedidos',data);
        $scope.articulos = data;
    });

}])

.controller('VerRecibidosCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs',
				function( $scope, $rootScope, $location, Compras, dialogs ) {
	//===============================================
	
	$scope.busca = {};
	$scope.todosok = 1;
	// necesario para el chekbox de seleccion
	$scope.items = {
		compra: []
	};
	
	$scope.fecha = moment().format('YYYY.MM');
	$scope.centro = $rootScope.user.centre;

    Compras.recibidos($rootScope.user.centre).then( function(data){
        console.log('Compras.pedidos',data);
        $scope.articulos = data;
    });


}])

//-- **********************************************************
//-- Controladores para las ventanas modales de compras --//
//-- **********************************************************

.controller('ComproController', [ '$scope', '$rootScope', '$modalInstance','data', 'Compras', '$document',
	function($scope,$rootScope,$modalInstance,data,Compras,$document){

	$scope.compro = data.compro;
	$scope.cantidad = 1;
	$scope.lote = "";

	//-- Methods --//

	$scope.up = function(){
		$scope.cantidad++;
	}

	$scope.down = function(){
		if ($scope.cantidad > 1){
			$scope.cantidad--;
		}
	}

	//-- Teclado --//
	var EVENT_TYPES = "keydown keypress"
	function eventHandler(event) {
	    if (event.which === 13) {
	        //$scope.$close('ok');
	        $scope.save();
	    }
	}
	$document.bind(EVENT_TYPES, eventHandler);
	$scope.$on('$destroy', function () {
	    $document.unbind(EVENT_TYPES, eventHandler);
	})

	//-- Para terminar... --//
	
	$scope.cancel = function(){
		//console.log('modllll', 'canceloooo');
		$modalInstance.dismiss('Cancelado');
	}; // end cancel
	
	$scope.save = function(){
		//console.log('modllll', 'apruebooooo');
		data.compro.centre_id = $rootScope.user.centre;
		data.compro.cantidad = $scope.cantidad;
		data.compro.fecha = moment().format('YYYY-MM-DD');
		// actualizar el carro real de la compra incluyendo la cantidad
		//Compras.addtocart(data.compro).then( function(data){
		//	// emitir el cambio, deberia enviar el numero de items total en el carro
		//	Compras.cartsize($rootScope.user.centre).then( function(res){
		//		console.log('items en el carro despues de insercion', res);
		//		$rootScope.$emit('addedtocart', {compro: res.size} );
		//	});
		//});
		// cerramos la ventana modal
		$modalInstance.close(data.compro);
	}; // end save
}])

.controller('ActualizoController', [ '$scope', '$rootScope', '$modalInstance','data', 'Compras',
	function($scope,$rootScope,$modalInstance,data,Compras){

	$scope.title = data.title;
	$scope.compro = data.compro;
	$scope.cantidad = data.compro.cantidad;

	//-- Methods --//

	$scope.up = function(){
		$scope.cantidad++;
	}

	$scope.down = function(){
		if ($scope.cantidad > 1){
			$scope.cantidad--;
		}
	}

	//-- Para terminar... --//
	
	$scope.cancel = function(){
		//console.log('modllll', 'canceloooo');
		$modalInstance.dismiss('Cancelado');
	}; // end cancel
	
	$scope.save = function(){
		//console.log('modllll', 'apruebooooo');
		data.compro.centre_id = $rootScope.user.centre;
		data.compro.cantidad = $scope.cantidad;
		data.compro.fecha = moment().format('YYYY-MM-DD');
		// actualizar el carro real de la compra incluyendo la cantidad
		// cerramos la ventana modal
		$modalInstance.close(data.compro);
	}; // end save
}])

.controller('PedidoController', [ '$scope', '$rootScope', '$modalInstance','data', 'Compras',
	function($scope,$rootScope,$modalInstance,data,Compras){

	$scope.title = data.title;
	$scope.compro = data.compro;
	$scope.cantidad = data.compro.cantidad;

	//-- Methods --//

	$scope.up = function(){
		if ($scope.cantidad < data.compro.cantidad){
			$scope.cantidad++;
		}
	}

	$scope.down = function(){
		if ($scope.cantidad > 1){
			$scope.cantidad--;
		}
	}

	//-- Para terminar... --//
	
	$scope.cancel = function(){
		//console.log('modllll', 'canceloooo');
		$modalInstance.dismiss('Cancelado');
	}; // end cancel
	
	$scope.save = function(){
		//console.log('modllll', 'apruebooooo');
		data.compro.centre_id = $rootScope.user.centre;
		data.compro.cantidad = $scope.cantidad;
		data.compro.fecha = moment().format('YYYY-MM-DD');
		// actualizar el carro real de la compra incluyendo la cantidad
		// cerramos la ventana modal
		$modalInstance.close(data.compro);
	}; // end save
}])

.controller('DevolucionController', [ '$scope', '$rootScope', '$modalInstance','data', 'Compras',
	function($scope,$rootScope,$modalInstance,data,Compras){

	$scope.title = data.title;
	$scope.compro = data.compro;
	$scope.motivo = "";

	//-- Methods --//

	//-- Para terminar... --//
	
	$scope.cancel = function(){
		//console.log('modllll', 'canceloooo');
		$modalInstance.dismiss('Cancelado');
	}; // end cancel
	
	$scope.save = function(){
		//console.log('modllll', 'apruebooooo');
		data.compro.centre_id = $rootScope.user.centre;
		data.compro.motivo = $scope.motivo;
		data.compro.fecha = moment().format('YYYY-MM-DD');
		// actualizar el carro real de la compra incluyendo la cantidad
		// cerramos la ventana modal
		$modalInstance.close(data.compro);
	}; // end save
}])

.controller('EditaArticulosCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs', '$anchorScroll',
				function( $scope, $rootScope, $location, Compras, dialogs, $anchorScroll ) {
	//===============================================
	
	$scope.busca = {};
	$scope.article = {};
	$scope.options = {};


    Compras.allArticles().then( function(data){
        //console.log(data);
        $scope.articulos = data;
    });

    // -- carga los proveedores
    Compras.proveidors().then( function(data){
    	console.log('proveidors',data);
    	$scope.proveidors = data;
    	$scope.articleFields = [
			{
			  key: 'id',
			  type: 'input',
			  templateOptions: {
			    label: 'Id',
			    placeholder: 'id',
			    disabled: true
			  }
			},
			{
			  key: 'ref',
			  type: 'input',
			  defaultValue: "",
			  templateOptions: {
			    label: 'Ref.Fabricante',
			    placeholder: 'ref',
			    required: false
			  }
			},
			{
			  key: 'ref_proveidor',
			  type: 'input',
			  defaultValue: "",
			  templateOptions: {
			    label: 'Ref.Proveedor',
			    placeholder: 'ref',
			    required: false
			  }
			},
			{
			  key: 'lote',
			  type: 'input',
			  defaultValue: "",
			  templateOptions: {
			    label: 'Lote',
			    placeholder: 'Lote',
			    required: false
			  }
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
			  key: 'pvp',
			  type: 'input',
			  templateOptions: {
			    label: 'Precio',
			    placeholder: 'pvp',
			    required: true
			  }
			},
			{
			  key: 'pga',
			  type: 'input',
			  templateOptions: {
			    label: 'Precio ARGOS',
			    placeholder: 'pga',
			    required: true
			  }
			},
			{
			  key: 'iva',
			  type: 'input',
			  templateOptions: {
			    label: 'IVA',
			    placeholder: 'iva',
			    required: true
			  }
			},
			{
			  key: 'minimo',
			  type: 'input',
			  defaultValue: 1,
			  templateOptions: {
			    label: 'Stock minimo',
			    placeholder: 'minimo',
			    required: false
			  }
			},
			{
			  key: 'proveidor_id',
			  type: 'select',
			  templateOptions: {
			    label: 'Proveedor',
			    options: $scope.proveidors,
			    required: true
			  }
			}
		];
    });


	$scope.onSubmit = onSubmit;
	$scope.editar = editar;

    function onSubmit(){
    	console.log('formulario enviado', $scope.article);
    	if ( $scope.article.id === undefined ){
    		// nuevo
    		console.log('nuevo');
    		Compras.addarticle($scope.article).then( function(data){
    			// refresca datos
    			Compras.allArticles().then( function(data){
    			    $scope.articulos = data;
    			});
    			$scope.options.resetModel()
    		})
    	} else {
    		// edicion ergo actualizacion
    		console.log('actualizacion');
    		console.log('formulario enviado actualizacion', $scope.article);
    		Compras.updatearticle($scope.article).then( function(data){
    			// refresca datos
    			Compras.allArticles().then( function(data){
    			    $scope.articulos = data;
    			});
    			// $scope.options.resetModel()
    		})
    	}
    }

    function editar(linea){
    	//$location.hash('formulario');
    	console.log('forumario editado', linea);
    	$scope.article = linea;
    	//$anchorScroll();
    }

    //$scope.verCarro = 

}])

.controller('EditaProveedoresCtrl', ['$scope', '$rootScope', '$location', 'Compras', 'dialogs', '$anchorScroll',
				function( $scope, $rootScope, $location, Compras, dialogs, $anchorScroll ) {
	//===============================================
	
	$scope.busca = {};
	$scope.proveedor = {};
	$scope.options = {};


    Compras.allProveedores().then( function(data){
        console.log('proveidoorrrss',data);
        $scope.proveedores = data;
    });

    	$scope.proveedoresFields = [
			{
			  key: 'id',
			  type: 'input',
			  templateOptions: {
			    label: 'Id',
			    placeholder: 'id',
			    disabled: true
			  }
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
			    type: 'email',
			    required: true
			  }
			},
		];

	$scope.onSubmit = onSubmit;
	$scope.editar = editar;

    function onSubmit(){
    	console.log('formulario enviado', $scope.proveedor);
    	if ( $scope.proveedor.id === undefined ){
    		// nuevo
    		console.log('nuevo');
    		Compras.addproveedor($scope.proveedor).then( function(data){
    			// refresca datos
    			Compras.allProveedores().then( function(data){
    			    $scope.proveedores = data;
    			});
    			$scope.options.resetModel()
    		})
    	} else {
    		// edicion ergo actualizacion
    		console.log('actualizacion');
    		Compras.updateproveedor($scope.proveedor).then( function(data){
    			// refresca datos
    			Compras.allProveedores().then( function(data){
    			    $scope.proveedores = data;
    			});
    			$scope.options.resetModel()
    		})
    	}
    }

    function editar(linea){
    	//$location.hash('formulario');
    	//console.log('forumario enviado', $scope.article);
    	$scope.proveedor = angular.copy(linea)	;
    	//$anchorScroll();
    }

    //$scope.verCarro = 

}])

;

}());
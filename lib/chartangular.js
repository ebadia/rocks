angular.module('ChartAngular', [])
	
	.directive('barchart', function(){
	
	function createChart(el_id, options) {
		options.element = el_id;
		var r = new Morris.Bar(options);
		return r;
	}


	return {
		restrict: 'E',
		scope: {
			options: '=',
			val: '='
		},
		replace: true,
		template: '<div></div>',
		link: function link(scope, element, attrs) {
			
			// añadido por el menda para poder pintar datos desde un servicio remoto
			// hemos añadido al scope el atributo val que tendra como valor los datos devueltos (array de datos)
			scope.$watch('val', function(newVal,oldVal) {

					// si es la primera vez y no hay cambio de datos pasa de todo					
					if (newVal === oldVal) {
						return;
					}
					// cuando hay cambio de datos lo pones en las opciones y lo pintas
					$(element).empty();
					scope.options.data = newVal;
					return createChart(attrs.id, scope.options);						
				}
					
			);
		}
	};
})
	.directive('linechart', function() {

		function createChart(el_id, options) {
			options.element = el_id;
			var r = new Morris.Line(options);
			return r;
		}

		return {
			restrict: 'E',
			scope:  {
				options: '=',
				val: '='
			},
			replace: true,
			template: '<div></div>',
			link: function(scope, element, attrs) {

				// añadido por el menda para poder pintar datos desde un servicio remoto
				// hemos añadido al scope el atributo val que tendra como valor los datos devueltos (array de datos)
				scope.$watch('val', function(newVal,oldVal) {

						// si es la primera vez y no hay cambio de datos pasa de todo					
						if (newVal === oldVal) {
							return;
						}
						// cuando hay cambio de datos lo pones en las opciones y lo pintas
						$(element).empty();
						scope.options.data = newVal;
						return createChart(attrs.id, scope.options);
							
					}
						
				);
			}
		}

	})

	.directive('donutchart', function() {

		function createChart(el_id, options) {
			options.element = el_id;
			var r = new Morris.Donut(options);
			return r;
		}

		return {
			restrict: 'E',
			scope:  {
				options: '=',
				val: '='
			},
			replace: true,
			template: '<div></div>',
			link: function(scope, element, attrs) {

				// añadido por el menda para poder pintar datos desde un servicio remoto
				// hemos añadido al scope el atributo val que tendra como valor los datos devueltos (array de datos)
				scope.$watch('val', function(newVal,oldVal) {

						// si es la primera vez y no hay cambio de datos pasa de todo					
						if (newVal === oldVal) {
							console.log('NOPE');
							return;
						}
						// cuando hay cambio de datos lo pones en las opciones y lo pintas
						console.log('cambio');
						$(element).empty();
						scope.options.data = newVal;
						return createChart(attrs.id, scope.options);
							
					}
						
				);
			}
		}

	});
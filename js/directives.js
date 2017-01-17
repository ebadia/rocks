(function(){

angular.module('myApp.directives', [])

/*
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
  		elm.text(version);
	};
}])

.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
})
.directive("popuphover", function() {
    return { 
        restrict: "A",
        link: function(scope, element, attrs, ngModelCtrl) {
        	var popover = element.popover().on('show.bs.popover', function () {	
			  	$.get('https://www.googleapis.com/scribe/v1/research?key=AIzaSyDqVYORLCUXxSv7zneerIgC2UYMnxvPeqQ&dataset=dictionary&dictionaryLanguage=en&query='+scope.message.text, function(data) {
	            	if (data.data) {
	            		var definitions = data.data[0].dictionary.definitionData;
	            		popover.attr('data-content', definitions[0].meanings[0].meaning);
	            		element.data('bs.popover').setContent();
	            	}
	            });
			});	
		}
    }
})

.directive("uiRangeSlider", function(){
    return{
        restrict:"AE",
        scope: {
            value: "="
        },

        link:function(scope,ele,attrs){
            
            console.log("newVal");

            scope.$watch('value', function(newVal,oldVal) {
                console.log("inside");
                console.log(newVal);

                return ele.slider();

                    //// si es la primera vez y no hay cambio de datos pasa de todo                   
                    //if (newVal === oldVal) {
                    //    return;
                    //}
                    //// cuando hay cambio de datos lo pones en las opciones y lo pintas
                    //scope.options.data = newVal;
                    //return createChart(attrs.id, scope.options);
                        
                }
                    
            );
        }
    }
})
*/

.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
});

}());


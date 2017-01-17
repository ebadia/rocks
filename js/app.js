'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      [
         'myApp.config', 
         'myApp.routes', 
         'myApp.filters', 
         'myApp.services', 
         'myApp.directives', 
         'ngAnimate',
         'myApp.controllers',
         'myApp.comprasControllers',
         'myApp.comprasAsControllers',
         'myApp.smsAsControllers',
         'myApp.facturasAsControllers',
         'myApp.fitxaAsControllers',
         'myApp.personalAsControllers',
         'app.localization', 
         'ngSanitize',
         'easypiechart',
         'ui.bootstrap', 
         'ChartAngular',
         'Postman', 
         'app.ui.services',
         'dialogs.main', 'pascalprecht.translate','dialogs.default-translations',
         'checklist-model', 
         'formly', 
         'formlyBootstrap', 
         'ngCsv', 
         'angular-loading-bar',
         'LocalStorageModule'
      ]
   )
   // https://github.com/chieffancypants/angular-loading-bar
      
   .run([ '$rootScope', 'Globales', 'localStorageService' , function( $rootScope, Globales, localStorageService ) {

      // variables globales
      $rootScope.logged = true;
      $rootScope.ip = "";
      $rootScope.user = {
         "id":          "1",
         "centre":      "1",
         "telefono":    "973 28 31 43",
         "nom":         "Enric",
         "email":       "ebadia@eneresi.com",
         "privilegis_id":  "0",
         "super" : 1,
         "marca" : "Eneresi",
         "envio" : {
            "adressa": "Segria, 45-baixos",
            "cp" : "25006",
            "localitat": "Lleida",
            "provincia": "Lleida"
         }
      };

      $rootScope.ficharactivo = localStorageService.get('ficharactivo');
      
      // para mantener la fecha de busqueda de recalls de control
      $rootScope.fecharecalls = {
         "mes": moment().month()+1,
         "ano": moment().year()
      };

      //-- receptores / emisores globales --//

      // -- de los recalls
      $rootScope.$on('recallsChange', function(e, v) {
         //console.log('rootssssssssopee', v);
         $rootScope.$broadcast('recallsChangeHandle', v);
      });

      // -- del carro
      // $rootScope.$on('addedtocart', function(e, v) {
      //    //console.log('rootssssssssopee', v);
      //    $rootScope.$broadcast('addedtocartHandle', v);
      // });
      // $rootScope.$on('addedtopedido', function(e, v) {
      //    //console.log('rootssssssssopee', v);
      //    $rootScope.$broadcast('addedtopedidoHandle', v);
      // });
      // $rootScope.$on('addedtorecibido', function(e, v) {
      //    //console.log('rootssssssssopee', v);
      //    $rootScope.$broadcast('addedtorecibidoHandle', v);
      // });

      // -- datos globales para menus y desplegables
      Globales.tratamientos().then( function(data){
         $rootScope.ttos = data.data.data;
         //console.log($rootScope.ttos);
      });

      // -- datos globales para configurar
      // Globales.localizacion().then( function(data){
      //    $rootScope.ip = data.ip;
      //    console.log("mi IP",$rootScope.ip);
      // });
// 
      // if (navigator.geolocation) {
      //    navigator.geolocation.getCurrentPosition(function(position){
      //       $rootScope.$apply(function(){
      //          $rootScope.position = position;
      //          console.log("mi Posicion LA ",$rootScope.position.coords.latitude);
      //          console.log("mi Posicion LO ",$rootScope.position.coords.longitude);
      //       });
      //    });
      // }
      // else {
      //    $rootScope.error = "Geolocation is not supported by this browser.";
      //    $rootScope.position = {};
      // }
      

   }])

   .config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
   })

   .config(['dialogsProvider', function(dialogsProvider){
      dialogsProvider.useBackdrop('static');
      dialogsProvider.useEscClose(true);
   }])

   .config(['$httpProvider', function ( $httpProvider) {        
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);

"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {

      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.when('/logout', {
         templateUrl: 'partials/home.html',
         controller: 'LogoutCtrl'
      });

      // ESTADISTICAS
      $routeProvider.when('/stats/primeras', {
         templateUrl: 'partials/stats/primeras.html',
         controller: 'FacturacionCtrl'
      });
      $routeProvider.when('/stats/facturacion', {
         templateUrl: 'partials/stats/facturacion.html',
         controller: 'FacturacionCtrl'
      });
      $routeProvider.when('/stats/emitidas', {
         templateUrl: 'partials/stats/emitidas.html',
         controller: 'EmitidasCtrl'
      });
      $routeProvider.when('/stats/pagos', {
         templateUrl: 'partials/stats/pagos.html',
         controller: 'PagosCtrl'
      });
      $routeProvider.when('/stats/presupuestados', {
         templateUrl: 'partials/stats/presupuestados.html',
         controller: 'PresupuestadosCtrl'
      });
      $routeProvider.when('/stats/aceptados', {
         templateUrl: 'partials/stats/aceptados.html',
         controller: 'AceptadosCtrl'
      });
      $routeProvider.when('/stats/cartera', {
         templateUrl: 'partials/stats/cartera.html',
         controller: 'CarteraCtrl'
      });
      $routeProvider.when('/stats/facturacion/:operacion', {
         templateUrl: 'partials/stats/facturacionOperaciones.html',
         controller: 'FacturacionOperacionesCtrl'
      });
      $routeProvider.when('/stats/especialidades/:operacion', {
         templateUrl: 'partials/stats/facturacionEspecialidades.html',
         controller: 'FacturacionEspecialidadesCtrl'
      });
      $routeProvider.when('/stats/deuda', {
         templateUrl: 'partials/stats/deuda.html',
         controller: 'DeudaCtrl'
      });
      $routeProvider.when('/stats/primeras', {
         templateUrl: 'partials/stats/primeras.html',
         controller: 'PrimerasCtrl'
      });
      // ratios
      $routeProvider.when('/ratios/:operacion', {
         templateUrl: 'partials/stats/ratios.html',
         controller: 'RatiosCtrl'
      });
      // pacs
      $routeProvider.when('/pacs/pacsunicos', {
         templateUrl: 'partials/stats/pacsunicos.html',
         controller: 'PacsunicosCtrl'
      });
      $routeProvider.when('/pacs/citas', {
         templateUrl: 'partials/stats/citas.html',
         controller: 'CitasCtrl'
      });
      $routeProvider.when('/pacs/tratamientos', {
         templateUrl: 'partials/stats/tratamientos.html',
         controller: 'TratamientosCtrl'
      });
      // operaciones
      $routeProvider.when('/oper/primerasedad', {
         templateUrl: 'partials/stats/primeras.html',
         controller: 'PrimerasCtrl'
      });
      $routeProvider.when('/oper/operaciones/:operacion', {
         templateUrl: 'partials/stats/operaciones.html',
         controller: 'OperacionesCtrl'
      });

      // CONTROLES
      $routeProvider.when('/controles/lista/:tipo/:ano/:mes', {
         templateUrl: 'partials/controles/lista.html',
         controller: 'ControlesCtrl'
      });
      $routeProvider.when('/controles/listado', {
         templateUrl: 'partials/controles/listado.html',
         controller: 'ControlesListadoCtrl'
      });
      $routeProvider.when('/controles/estado', {
         templateUrl: 'partials/controles/estado.html',
         controller: 'ControlesEstadoCtrl'
      });
      $routeProvider.when('/controles/detalles/:idpac', {
         templateUrl: 'partials/controles/detalles.html',
         controller: 'ControlesDetallesCtrl'
      });
      $routeProvider.when('/controles/listacartas', {
         templateUrl: 'partials/controles/cartas.html',
         controller: 'ControlesCartasCtrl'
      });

      // CITAS
      $routeProvider.when('/citas/hoy', {
         templateUrl: 'partials/citas/hoy.html',
         controller: 'CitasHoyCtrl'
      });


      // PRESUPUESTOS
      $routeProvider.when('/presugesdent', {
         templateUrl: 'partials/presupuestos/dashboardgesdent.html',
         controller: 'GesdentCtrl'
      });
      $routeProvider.when('/presupuestos', {
         templateUrl: 'partials/presupuestos/dashboard.html',
         controller: 'PresupuestosCtrl'
      });
      $routeProvider.when('/addPpto', {
         templateUrl: 'partials/presupuestos/add.html',
         controller: 'AddPresupuestoCtrl'
      });
      $routeProvider.when('/addPacPpto', {
         templateUrl: 'partials/presupuestos/addpac.html',
         controller: 'AddPacPresupuestoCtrl'
      });
      $routeProvider.when('/verPacPpto/:numpac', {
         templateUrl: 'partials/presupuestos/verpac.html',
         controller: 'VerPacPresupuestoCtrl'
      });
      $routeProvider.when('/editPpto/:id', {
         templateUrl: 'partials/presupuestos/edit.html',
         controller: 'EditaPresupuestosCtrl'
      });            // este edita los datos de un paciente de un presupuesto
      $routeProvider.when('/editappto/:id', {
         templateUrl: 'partials/presupuestos/editppto.html',
         controller: 'EditaPresupuestosCtrl'
      });            // este edita los datos de un presupuesto
      $routeProvider.when('/graficoevolpptos', {
         templateUrl: 'partials/presupuestos/graficoevolpptos.html',
         controller: 'GraficoEvolPresupuestosCtrl'
      });
      $routeProvider.when('/resumenpptos', {
         templateUrl: 'partials/presupuestos/resumen.html',
         controller: 'NewResumenPresupuestosCtrl'
      });
      $routeProvider.when('/aoresumenpptos', {
         templateUrl: 'partials/presupuestos/resumen.html',
         controller: 'AuroraResumenPresupuestosCtrl'
      });
      $routeProvider.when('/oportunidades', {
         templateUrl: 'partials/presupuestos/oportunidades.html',
         controller: 'OportunidadesCtrl'
      });
      $routeProvider.when('/pptosgesdent/:numpac/:numpre', {
         templateUrl: 'partials/presupuestos/gesdent.html',
         controller: 'PresupuestosGesdentCtrl'
      });

      // RECALLS
      $routeProvider.when('/recallsdehoy', {
         templateUrl: 'partials/presupuestos/recallsdehoy.html',
         controller: 'RecallsHoyCtrl'
      });
      $routeProvider.when('/addRecall/:id/:nom', {
         templateUrl: 'partials/presupuestos/addrecall.html',
         controller: 'RecallCtrl',
         //resolve: {
         //   recalls: function(Presus,$route){
         //      console.log("aqui add recall ---- ");
         //      return Presus.getPptoRecalls($route.current.params.id);
         //   }
         //}
      });
      $routeProvider.when('/listaRecalls/:id/:nom', {
         templateUrl: 'partials/presupuestos/listarecalls.html',
         controller: 'RecallCtrl',
         //resolve: {
         //   recalls: function(Presus,$route){
         //      console.log("aqui");
         //      return Presus.getPptoRecalls($route.current.params.id);
         //   }
         //}
      });

      // Facturas
      $routeProvider.when('/facturas/lista', {
         templateUrl: 'partials/facturas/lista.html',
         controller: 'FacturasCtrl',
         controllerAs: 'smsv'
      });

      // SMS
      $routeProvider.when('/sms/uno', {
         templateUrl: 'partials/envios/sms.html',
         controller: 'SmsCtrl',
         controllerAs: 'smsv'
      });
      $routeProvider.when('/sms/uno/:phone/:paciente', {
         templateUrl: 'partials/envios/sms.html',
         controller: 'SmsCtrl',
         controllerAs: 'smsv'
      });
      $routeProvider.when('/sms/citas', {
         templateUrl: 'partials/envios/smscitas.html',
         controller: 'CitasSmsCtrl',
         controllerAs: 'smsv'
      });
      $routeProvider.when('/sms/cumples', {
         templateUrl: 'partials/envios/smscumples.html',
         controller: 'CumplesSmsCtrl',
         controllerAs: 'smsv'
      });
      $routeProvider.when('/sms/lista', {
         templateUrl: 'partials/envios/smslista.html',
         controller: 'ListaSmsCtrl',
         controllerAs: 'smsv'
      });
      $routeProvider.when('/sms/lista/:filtro', {
         templateUrl: 'partials/envios/smslista.html',
         controller: 'ListaSmsCtrl',
         controllerAs: 'smsv'
      });

      // BOOKS
      $routeProvider.when('/books', {
         templateUrl: 'partials/books/main.html',
         controller: 'BooksMainCtrl'
      });
      $routeProvider.when('/infoorto/:nom', {
         templateUrl: 'partials/books/orto.html',
         controller: 'BooksMainCtrl'
      });

      // SETTINGS
      $routeProvider.when('/gestion/colectivos', {
         templateUrl: 'partials/gestion/colectivos.html',
         controller: 'ColectivosCtrl'
      });
      $routeProvider.when('/gestion/incluyes', {
         templateUrl: 'partials/gestion/incluyes.html',
         controller: 'IncluyesCtrl'
      });
      $routeProvider.when('/gestion/articulos', {
         templateUrl: 'partials/gestion/articulos.html',
         controller: 'EditaArticulosCtrl'
      });
      $routeProvider.when('/gestion/proveedores', {
         templateUrl: 'partials/gestion/proveedores.html',
         controller: 'EditaProveedoresCtrl'
      });
      $routeProvider.when('/gestion/personal', {
         templateUrl: 'partials/gestion/personal.html',
         controller: 'PersonalCtrl',
         controllerAs: 'fxv'
      });
      $routeProvider.when('/gestion/personal/:id', {
         templateUrl: 'partials/gestion/personal-edita.html',
         controller: 'PersonalEditaCtrl',
         controllerAs: 'fxv'
      });
      $routeProvider.when('/gestion/fichar', {
         templateUrl: 'partials/gestion/fichar.html',
         controller: 'ActivaFitxaCtrl',
         controllerAs: 'fxv'
      });

      // tableau
      $routeProvider.when('/tableau/listado', {
         templateUrl: 'partials/tableau/lista.html',
         controller: 'TableauCentroCtl'
      });

      // COMPRAS
      $routeProvider.when('/compras/articles', {
         templateUrl: 'partials/compras/articulos.html',
         controller: 'ArticulosCtrl'
      });
      // esto es una prueba de un controlador AS...
      $routeProvider.when('/compras/articlesas', {
         templateUrl: 'partials/compras/articulosas.html',
         controller: 'ArticulosAsCtrl',
         controllerAs: 'articulosAs'
      });
      // fin de la prueba
      $routeProvider.when('/compras/vercarro', {
         templateUrl: 'partials/compras/vercarro.html',
         controller: 'VerCarroCtrl'
      });
      $routeProvider.when('/compras/verpedidos', {
         templateUrl: 'partials/compras/verpedidos.html',
         controller: 'VerPedidosCtrl'
      });
      $routeProvider.when('/compras/verdevoluciones', {
         templateUrl: 'partials/compras/verdevoluciones.html',
         controller: 'VerDevolucionesCtrl'
      });
      $routeProvider.when('/compras/verrecibidos', {
         templateUrl: 'partials/compras/verrecibidos.html',
         controller: 'VerRecibidosCtrl'
      });

      // Fitxar
      $routeProvider.when('/fichar', {
         templateUrl: 'partials/fichar/entrada.html',
         controller: 'FitxaCtrl',
         controllerAs: 'fxv'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);
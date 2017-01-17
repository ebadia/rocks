'use strict';

/* Filters */

angular.module('myApp.filters', [])

   .filter('gthan', function () {
       return function ( items, value ) {
           var filteredItems = []
           // console.log("itemssss", items);
           angular.forEach(items, function ( item ) {
               if ( item.Importe > value ) {
                   filteredItems.push(item);
               }
           });
           return filteredItems;
       }
   })

   .filter('status', function () {
       return function ( items, value ) {
           var filteredItems = []
           // console.log("itemssss", items);
           angular.forEach(items, function ( item ) {
               if ( item.FecAceptaBool==0 && value === "s" ) {
                   filteredItems.push(item);
               }
               if ( item.FecAceptaBool==1 && value === "a" ) {
                   filteredItems.push(item);
               }
               if ( item.FecRechazBool==1 && value === "r" ) {
                   filteredItems.push(item);
               }
               if ( item.OpcionalBool==1 && value === "o" ) {
                   filteredItems.push(item);
               }
           });
           return filteredItems;
       }
   })

   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])

   .filter('fecha', [function(){
      return function (item) {
         var moneda;

         if (angular.isUndefined(item)){
            item = "00000000";
         }
         
         return item.substring(0,4)+"-"+item.substring(4,6)+"-"+item.substring(6,8);
      };
   }])


   .filter('reverse', function() {
      function toArray(list) {
         var k, out = [];
         if( list ) {
            if( angular.isArray(list) ) {
               out = list;
            }
            else if( typeof(list) === 'object' ) {
               for (k in list) {
                  if (list.hasOwnProperty(k)) { out.push(list[k]); }
               }
            }
         }
         return out;
      }
      return function(items) {
         return toArray(items).slice().reverse();
      };
   })

   .filter('percent', [function(){
      return function (item, decimales) {

         if (angular.isUndefined(decimales))    var decimales = 2;
         if (angular.isUndefined(item))    var item = 0;

         var real = (item) * 100;
         
         return real.toFixed(decimales) + "%";
      };
   }])


;

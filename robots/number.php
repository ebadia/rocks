<?php

// ejecutar con un solo argumento que es el codigo del centro

	//require __DIR__ . '/Mandrill/Mandrill.php';
	//$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //-- Clickatell Composer interface framework 
    //-- https://github.com/arcturial/clickatell

    require 'textmagic/TextMagicAPI.php';

// **************************************
// MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
// **************************************
        // -- datos de textmagic
        $user = "enricbadia";
        $password = "nzj3Telk8Z";
        $prefijo = "34";

        //-- conectamos con textmagic
        $api = new TextMagicAPI(array(
            "username" => $user, 
            "password" => $password
        ));
 
        $res = $api->checkNumber(array('34676769666'));

        print_r($res);

 ?>
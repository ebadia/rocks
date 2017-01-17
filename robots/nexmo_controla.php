<?php

// ejecutar con un solo argumento que es el codigo del centro

	//require __DIR__ . '/Mandrill/Mandrill.php';
	//$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //-- Clickatell Composer interface framework 
    //-- https://github.com/arcturial/clickatell

    require_once "./nexmo/vendor/autoload.php";

    $margen = 2;

    // Parametros del comando de entrada
    // 1: ide del centro
    // 2: dias de margen
    // 3: mostrar resultados en pantalla
    // $id = $argv[1];
    $margen = $argv[1];

// **************************************
// Datos de las conexiones a los dos sistemas
// **************************************
    require 'conn-clinicas.php';
// ********************************* 
    $db = getConnectionGesdent($id);
// ********************************* 
// ********************************* 
    require 'conn-rocks.php';
// ********************************* 
    $dbh = getConnectionRocks();
// ********************************* 


    // recupera las citas del dia de $margen
        // echo date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+$margen, date("Y")) );
        $sqlr = "SELECT * from smsrecordatorios WHERE fecha = 
                '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+$margen, date("Y")) )."'";
        ;
        $stmt = $dbh->prepare($sqlr);
        $pide = $stmt->execute();
        $pide = $stmt->fetchAll();

        // print_r($pide);

// **************************************
// MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
// **************************************
        // -- datos de nexmo
        $prefijo = "34";
        //-- conectamos con nexmo
        $client = new Nexmo\Client(new Nexmo\Client\Credentials\Basic('7c8807b4', 'c113ce5e782233e5'));

        // para cada mensaje enviado del dia $margen
        // buscamos el mmsid para ver el status en nexmo
        foreach ($pide as $envio) {
            // echo "idd" . $envio['msgid'];
            if ( $envio['msgid'] != "" ) {
            	// recogemos el estado de nexmo
            	$respuesta = $client->message()->search( $envio['msgid'] );
                // print_r($respuesta);
                foreach( $respuesta as $key=>$val){
                    // recogemos el mmsgid de la respuesta de TM que esta en la clave de la respuesta
                   	$msgid = $respuesta['message-id'];
                   	$status = $respuesta['final-status'];

                    $sql = "UPDATE smsrecordatorios set status = '". $status . "' WHERE msgid = '". $msgid . "'" ;
                    $stmt = $dbr->prepare($sql);
                    $pide = $stmt->execute();
                }
            }
        }

?>

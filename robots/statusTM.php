<?php

// ejecutar con un solo argumento que es el codigo del centro

	//require __DIR__ . '/Mandrill/Mandrill.php';
	//$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //-- Clickatell Composer interface framework 
    //-- https://github.com/arcturial/clickatell

    require 'textmagic/TextMagicAPI.php';

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
        // -- datos de textmagic
        $user = "enricbadia";
        $password = "nzj3Telk8Z";
        $prefijo = "34";

        //-- conectamos con textmagic
        $api = new TextMagicAPI(array(
            "username" => $user, 
            "password" => $password
        ));

        // para cada mensaje enviado del dia $margen
        // buscamos el mmsid para ver el status en textmagic
        foreach ($pide as $envio) {
            // echo "idd" . $envio['msgid'];
            if ( $envio['msgid'] != "" ) {
            // recogemos el estado de textmagic
            $respuesta = $api->messageStatus(array($envio['msgid']));
                print_r($respuesta);
                foreach( $respuesta as $key=>$val){
                    // recogemos el mmsgid de la respuesta de TM que esta en la clave de la respuesta
                   $msgid = $key;
                   foreach( $respuesta[$key] as $key=>$val){
                        // de la clave de respuesta del msgid, si la variable del array es status lo poenemos en la bbdd
                        if ($key == 'status'){
                            $sql = "UPDATE smsrecordatorios set status = '". $val . "' WHERE msgid = '". $msgid . "'" ;
                            $stmt = $dbr->prepare($sql);
                            $pide = $stmt->execute();
                        }
                   }
                }
            }
        }

?>
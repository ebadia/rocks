<?php

// ejecutar con un solo argumento que es el codigo del centro
	/*
message_id  A unique ID assigned to an incoming message.
timestamp   The time of receiving the message, in Unix time format.
from    The sender’s phone number.
text    The message’s text, in the UTF-8 character set.

	*/
    // -- datos de conexion a rocks
        $rdbhost="31.170.164.39";
        $rport="3306";
        $rdbuser="u742391297_rocks";
        $rdbpass="tincfeina";
        $rdbname="u742391297_rocks";
        $dbr = new PDO("mysql:host=$rdbhost;port=$rport;dbname=$rdbname", $rdbuser, $rdbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
        $dbr->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// $req = print_r($_REQUEST, true);

        //-- poner el resultado en la BD de Gesdent (marcar enviado SMS de la cita) y Rocks
        echo $sqlr = "INSERT INTO smsrecordatorios SET
            pasarela                    = 'clickatell',
            envio                   	= '".date( 'Y-m-d', strtotime($_GET['timestamp']) )."',
            hora                    	= '".date( 'H:i', strtotime($_GET['timestamp']) )."',
            respuesta                   = '".$_GET['text']."',
            phone        	            = '".$_GET['from']."',
            moid 	                  	= '".$_GET['moMsgId'] ."'"
        ;
        $stmt = $dbr->prepare($sqlr);
        $pide = $stmt->execute();

    ob_start();
    var_dump($_POST);
    $a=ob_get_contents();
    ob_end_clean();
    
	file_put_contents( __DIR__ . '/sms-respuesta-catell.txt', $a);
	
?>
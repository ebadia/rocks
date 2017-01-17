<?php

// ejecutar con un solo argumento que es el codigo del centro
	/*
message_id  A unique ID assigned to an incoming message.
timestamp   The time of receiving the message, in Unix time format.
from    The sender’s phone number.
text    The message’s text, in the UTF-8 character set.
    
	*/
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

	// $req = print_r($_REQUEST, true);

        date_default_timezone_set("Europe/Madrid");

        //-- poner el resultado en la BD de Gesdent (marcar enviado SMS de la cita) y Rocks
        // viene de la v1 del callback definido en TextMagic->Services->API
        // echo $sqlr = "INSERT INTO smsrecordatorios SET
        //     pasarela                    = 'textmagic',
        //     envio                       = '".date( 'Y-m-d', $_POST['timestamp'] )."',
        //     hora                        = '".date( 'H:i', $_POST['timestamp'] )."',
        //     respuesta                   = '".$_POST['text']."',
        //     phone                       = '".$_POST['from']."',
        //     moid                        = '".$_POST['message_id'] ."'"
        // ;
        echo $sqlr = "INSERT INTO smsrecordatorios SET
            pasarela                    = 'textmagic',
            envio                       = '".date( 'Y-m-d', $_POST['messageTime'] )."',
            hora                        = '".date( 'H:i', $_POST['messageTime'] )."',
            respuesta                   = '".$_POST['text']."',
            phone                       = '".$_POST['sender']."',
            moid                        = '".$_POST['id'] ."'"
        ;
        $stmt = $dbh->prepare($sqlr);
        $pide = $stmt->execute();

    ob_start();
    var_dump($_POST);
    $a=ob_get_contents();
    ob_end_clean();
    
	file_put_contents( __DIR__ . '/evol/sms-respuesta-tmagic.txt', $a);
	
?>
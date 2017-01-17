<?php

// ejecutar con un solo argumento que es el codigo del centro

	require __DIR__ . '/Mandrill/Mandrill.php';
	$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //-- Clickatell Composer interface framework 
    //-- https://github.com/arcturial/clickatell

    require 'textmagic/TextMagicAPI.php';

    $margen = 2;

    // Parametros del comando de entrada
    // 1: ide del centro
    // 2: dias de margen
    // 3: mostrar resultados en pantalla
    // $id = $argv[1];
    $mes = $argv[1];
    $any = $argv[2];

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

    if ($mes == "" )
        $mes = date( 'm', mktime(0, 0, 0, date("m") , date("d")-5, date("Y")) );
    if ($any == "" )
        $any = date( 'Y', mktime(0, 0, 0, date("m") , date("d")-5, date("Y")) );

    // recupera las citas del dia de $margen
        // echo date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+$margen, date("Y")) );
        $sql = "
            /* euros */
            select centre_id, centres.nom, count(*)*0.18 as pvp from sms 
            left join centres on centres.id = sms.centre_id
            where ( 
                month(fecha) = '".$mes."'
                and 
                year(fecha)  = '".$any."'
                )
            group by centre_id
        ";

        $stmt = $dbh->prepare($sql);
        $pide = $stmt->execute();
        $pide = $stmt->fetchAll();

        // print_r($pide);

// **************************************
// MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
// **************************************
        $evol = file_get_contents( __DIR__ . '/eneresi.rocks.evol/sms.html');

        $evol = str_replace("{{mes}}", $mes, $evol);
        $evol = str_replace("{{any}}", $any, $evol);

        $tabla = "";
        foreach ($pide as $key => $centro) {
            // print_r($centro);
            $linea = '
               <tr>
                   <td><span style="font-size: 18px; line-height: 24px; font-family: Arial; ">{{ppto.centro}}</span></td>
                   <td align="right"><span style="font-size: 18px; line-height: 24px; font-family: Arial; ">{{ppto.pvp}}€</span></td>
               </tr>
            ';
            //print_r( $value );
            $linea = str_replace("{{ppto.centro}}", $centro['nom'], $linea);
            $linea = str_replace("{{ppto.pvp}}", $centro['pvp'], $linea);
    
            $tabla .= $linea;        
        }

        $tabla;
        $evol = str_replace("{{tabla}}", $tabla, $evol);
        $evol = str_replace("{{web}}", '/evol/sms_'.$any.$mes.'.html', $evol);

        file_put_contents( __DIR__ . '/evol/sms_'.$any.$mes.'.html', $evol);

// envia el correo
        // **************************************
        // AQUI EMPIEZA EL ESPECTACULO DE MANDRILL
        // **************************************

        try {

            $mandrill = new Mandrill($MANDRILL_APIKEY);
            $muser = new Mandrill_Users($mandrill);

            //print_r( $muser->info() );

            $message = array(

                'subject' => 'EneresiRocks. Facturacion de SMS mensuales /// '.$mes.'-'.$any,
                'from_email' => 'ebadia@eneresi.com',
                'from_name' => 'EneresiRocks',
                'html' => $evol,

                'to' => array(
                    array(
                        'email' => 'enric.badia@gmail.com',
                        'name' => 'Enric Badia at Gmail',
                        'type' => 'to'
                    ),
                    array(
                        'email' => 'mmartin@eneresi.com',
                        'name' => 'Mireia Martin',
                        'type' => 'to'
                    )
                )
            );
            $async = false;

            // print_r($message);

            // ***** envio del mensaje *******
            $result = $mandrill->messages->send($message, $async);
            print_r($result);
            // ***** envio del mensaje *******


        } catch(Mandrill_Error $e) {
            // Mandrill errors are thrown as exceptions
            echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
            // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
            throw $e;
        }

        // **************************************
        // AQUI ACABA EL ESPECTACULO DE MANDRILL
        // **************************************
?>
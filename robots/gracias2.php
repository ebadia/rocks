<?php

// ejecutar con un solo argumento que es el codigo del centro

	require __DIR__ . '/Mandrill/Mandrill.php';
	$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';
    $mandrill = new Mandrill($MANDRILL_APIKEY);

    $accentsFora = array(
        'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A',
        'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
        'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
        'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
        'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
        'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y'
    );

	// definicion de la fecha
	//$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-1, date("Y")) );
	//$fecha = '20150417';
    $id = $argv[1];
    $centro = $argv[2];

	// definicion de primeras
    $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS', 'V1CO', 'VOCO'";

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


    // definicion del sql de recuperacion de pacientes

    if ($centro) {
        $sql =  "
            SELECT
                DISTINCT TtosMed.IdPac,
                Pacientes.Nombre,
                Pacientes.Apellidos,
                Pacientes.Sexo,
                Pacientes.Email,
                DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
                TTos.Codigo as visita

            FROM TtosMed
            left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
            and TtosMed.StaTto = 5
            AND TtosMed.FecIni = '".$fecha."'
            and TtosMed.IdCentro = ".$centro."

            ORDER BY TtosMed.IdPac ASC
            ";

    } else {
        $sql =  "
            SELECT
                DISTINCT TtosMed.IdPac,
                Pacientes.Nombre,
                Pacientes.Apellidos,
                Pacientes.Sexo,
                Pacientes.Email,
                DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
                TTos.Codigo as visita

            FROM TtosMed
            left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
            and TtosMed.StaTto = 5
            AND TtosMed.FecIni = '".$fecha."'

            ORDER BY TtosMed.IdPac ASC
            ";
    }

    // echo $sql;
    // recupera($id,$sql);

    // --- establece los destinatarios de los correos que se generan
    // -------------------------------------------------------------
    switch ($id) {
        case 1:
            # code...
            $to = array(
                array(
                    'email' => 'enric.badia@gmail.com',
                    'name' => 'Enric Badia at Gmail',
                    'type' => 'to'
                ),
                array(
                    'email' => 'eariza@eneresi.com',
                    'name' => 'Enric Ariza',
                    'type' => 'to'
                ),
                array(
                    'email' => 'aortiz@eneresi.com',
                    'name' => 'Aurora Ortiz',
                    'type' => 'to'
                )
            );
            break;
        case 2:
            #
            $to = array(
                array(
                    'email' => 'enric.badia@gmail.com',
                    'name' => 'Enric Badia at Gmail',
                    'type' => 'to'
                ),
                array(
                    'email' => 'sverdonces@eneresi.com',
                    'name' => 'Sergi de Verdonces',
                    'type' => 'to'
                )
            );
            break;
        case 3:
        case 4:
            #
            $to = array(
                array(
                    'email' => 'enric.badia@gmail.com',
                    'name' => 'Enric Badia at Gmail',
                    'type' => 'to'
                ),
                array(
                    'email' => 'aortiz@eneresi.com',
                    'name' => 'Aurora Ortiz',
                    'type' => 'to'
                ),
                array(
                    'email' => 'aarques@eneresi.com',
                    'name' => 'Ana Arques',
                    'type' => 'to'
                )
            );
            break;
        default:
            # code...
            $to = array(
                array(
                    'email' => 'enric.badia@gmail.com',
                    'name' => 'Enric Badia at Gmail',
                    'type' => 'to'
                )
            );
            break;
    }

    // --- fin: establece los destinatarios de los correos que se generan
    // -------------------------------------------------------------



    try {
        //$db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();

        while ($row = mssql_fetch_array($query)) {
            $res["error"] = 0;
            $res["data"][] = $row;
        }
        $devuelvo['data'] = $res;

// **************************************
// aqui tenemos la devolucion de gesdent
        echo "==========================\n";
        echo "-----> devuelvo de gesdent\n";
        echo "==========================\n\n";
        print_r($devuelvo);

        //echo json_encode($devuelvo);
        mssql_free_result($query);

// **************************************
// MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
// **************************************

        foreach( $devuelvo['data']['data'] as $destino ){

            echo "==========================\n";
            echo "-----> paciente \n";
            echo "==========================\n\n";
            echo $destino['Nombre']. " " . $destino['Apellidos'] . "\n";
            echo $destino['Email'] . "\n";
            echo $destino['edad'] . "\n";
            echo "==========================\n\n";
            //print_r($destino);

// **************************************
// solo pacientes de mas de 16 años...
            // y si tene email

            if ( $destino['edad'] >= 16 && $destino['Email'] != ""){

                // primero preparamos los datos personalizados de sexo, nombre,...
                if ($destino['Sexo']=='H') {
                    if ( in_array( $id, array(1,2) ) ){
                        $nom = 'Benvolgut '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).',';
                        $tracte = 'atès';
                    } else {
                        $nom = 'Apreciado '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).',';
                        $tracte = 'atendido';
                    }
                }
                else {
                    if ( in_array( $id, array(1,2) ) ){
                        $nom = 'Benvolguda '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).',';
                        $tracte = 'atesa';
                    } else {
                        $nom = 'Apreciada '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).',';
                        $tracte = 'atendida';
                    }
                }

                // els destinataris
                //------------------------

                $tus = array();

                $tus_temp = array();
                $tus_temp['email'] = $destino['Email'] ;
                $tus_temp['name'] = $destino['Nombre'].','.$destino['Apellidos'];
                $tus_temp['type'] = 'to';

                array_push( $tus, $tus_temp );
                $destinos = array_merge( $tus, $to );

                // variables personalitzades
                //------------------------
                // para los mayores

                $mergevars = array();

                // posem les variables personalitzades (OJO!!! per cada receptor...)
                foreach ( $destinos as $cadadestino ){
                    $aris = array();
                    $aris['rcpt'] = $cadadestino['email'];
                    //$aris['rcpt'] = $destino['Email'];
                    $aris['vars'] = array();

                    $t = array();
                    $t['name'] = 'nom';
                    $t['content'] = $nom;
                    array_push( $aris['vars'], $t );

                    $t['name'] = 'tracte';
                    $t['content'] = $tracte;

                    // posem les variables personalitzades
                    array_push( $aris['vars'], $t );

                    array_push( $mergevars, $aris );
                }

// **************************************
// AQUI EMPIEZA EL ESPECTACULO DE MANDRILL
// **************************************
// https://mandrillapp.com/api/docs/messages.JSON.html#method=send
// **************************************

                try {

                    // ======
                    // aqui es donde empieza realmente la configuracion del json de mandrill
                    // ======

                    //$muser = new Mandrill_Users($mandrill);
                    //print_r( $muser->info() );

                    // NO HACE FALTA!!! si es murcia/molina ponemos el codigo al final de centro
                    $template = 'gracies_'.$id;
                    //if ($centro)
                    //    $template = 'gracies_'.$centro;

                    $content = array();
                    $message = array(
                        'to' =>  $destinos,
                        'merge_vars' => $mergevars,
                        //'bcc_address' => 'ebadia@eneresi.com'
                    );

                    print_r($message);

                    // $async = false;
                    // $result = $mandrill->messages->sendTemplate($template, $content, $message, $async);

                    // print_r($result);


                } catch(Mandrill_Error $e) {
                    // Mandrill errors are thrown as exceptions
                    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
                    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                    throw $e;
                }

// **************************************
// AQUI ACABA EL ESPECTACULO DE MANDRILL
// **************************************

            }

// **************************************
// solo pacientes de menos de 16 años...
            // y si tene email

            if ( $destino['edad'] < 16 && $destino['Email'] != ""){

                // primero preparamos los datos personalizados de sexo, nombre,...
                if ($destino['Sexo']=='H') {
                    if ( in_array( $id, array(1,2) ) ){
                        $nom =  'en '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).'';
                        $tracte = 'atès';
                    } else {
                        $nom = ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).'';
                        $tracte = 'atendido';
                    }
                }
                else {
                    if ( in_array( $id, array(1,2) ) ){
                        $nom = 'na '.ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).'';
                        $tracte = 'atesa';
                    } else {
                        $nom = ucfirst(strtolower(strtr( $destino['Nombre'], $accentsFora ))).'';
                        $tracte = 'atendida';
                    }
                }

                // els destinataris
                //------------------------

                $tus = array();

                $tus_temp = array();
                $tus_temp['email'] = $destino['Email'] ;
                $tus_temp['name'] = $destino['Nombre'].','.$destino['Apellidos'];
                $tus_temp['type'] = 'to';

                array_push( $tus, $tus_temp );
                $destinos = array_merge( $tus, $to );

                // variables personalitzades
                //------------------------
                // para los niños

                $mergevars = array();

                // posem les variables personalitzades (OJO!!! per cada receptor...)
                foreach ( $destinos as $cadadestino ){
                    $aris = array();
                    $aris['rcpt'] = $cadadestino['email'];
                    //$aris['rcpt'] = $destino['Email'];
                    $aris['vars'] = array();

                    $t = array();
                    $t['name'] = 'nom';
                    $t['content'] = $nom;
                    array_push( $aris['vars'], $t );

                    $t['name'] = 'familia';
                    $t['content'] = 'Apreciada familia '.ucwords(strtolower($destino['Apellidos'])).',';
                    array_push( $aris['vars'], $t );

                    $t['name'] = 'tracte';
                    $t['content'] = $tracte;

                    // posem les variables personalitzades
                    array_push( $aris['vars'], $t );

                    array_push( $mergevars, $aris );
                }

// **************************************
// AQUI EMPIEZA EL ESPECTACULO DE MANDRILL
// **************************************
// https://mandrillapp.com/api/docs/messages.JSON.html#method=send
// **************************************

                try {

                    // ======
                    // aqui es donde empieza realmente la configuracion del json de mandrill
                    // ======

                    //$muser = new Mandrill_Users($mandrill);
                    //print_r( $muser->info() );

                    $template = 'gracies_child_'.$id;
                    //if ($centro)
                    // $template = 'gracies_child_'.$centro;
                    $content = array();
                    $message = array(
                        'to' =>  $destinos,
                        'merge_vars' => $mergevars ,
                        //'bcc_address' => 'ebadia@eneresi.com'
                    );

                    print_r($message);

                    //$async = false;
                    //$result = $mandrill->messages->sendTemplate($template, $content, $message, $async);
                    //print_r($result);


                } catch(Mandrill_Error $e) {
                    // Mandrill errors are thrown as exceptions
                    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
                    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                    throw $e;
                }

 // **************************************
 // AQUI ACABA EL ESPECTACULO DE MANDRILL
 // **************************************
            }

        }


    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }


?>

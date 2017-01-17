<?php

// ejecutar con un solo argumento que es el codigo del centro

	require __DIR__ . '/Mandrill/Mandrill.php';
	$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

	// definicion de la fecha
	//$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-1, date("Y")) );
	//$fecha = '20150417';
	$id = $argv[1];

	// definicion de primeras
    $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS', 'V1CO', 'VOCO'";

	// definicion de clinicas
    $clinicas = array();

    //$lleida = array( "81.184.4.82", "SERVER\\ebadia", "eneresi", "GELITE", 1 );
    $lleida = array( "81.45.46.237", "SERVER\\ebadia", "eneresi", "GELITE", 1 );
    $sabadell =  array( "eneresisabadell.dnsalias.com", "SERVER\\ebadia", "ClinicaSabadell14", "GELITE_310", 2);
    $murcia = array( "84.127.230.57", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    $molina = array( "84.127.230.57", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 4);

    //$lleida = array( "192.168.1.200", "SERVER\\ebadia", "eneresi", "GELITE", 1 );
    //$sabadell =  array( "192.168.2.100", "SERVER\\ebadia", "ClinicaSabadell14", "GELITE_310", 2);
    //$murcia = array( "192.168.2.100", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    //$molina = array( "192.168.2.100", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 4);


    $clinicas[1] = $lleida;
    $clinicas[2] = $sabadell;
    $clinicas[3] = $murcia;
    $clinicas[4] = $molina;

    // definicion del sql de recuperacion de pacientes

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

    //recupera($id,$sql); 

    //function getConnection($id) {


    $dbhost=$clinicas[$id][0];
    $dbport="1433";
    $dbuser=$clinicas[$id][1];
    $dbpass=$clinicas[$id][2];
    //$dbname="GELITE";
    $db = mssql_connect($dbhost.":".$dbport, $dbuser, $dbpass);
    //return $dbh;


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

        // para los mayores
        $tus = array();
        $mergevars = array();

        // para los niños
        $tus1 = array();
        $mergevars1 = array();

        foreach( $devuelvo['data']['data'] as $destino ){

            //echo "==========================\n";
            //echo "-----> para cada paciente \n";
            //echo "==========================\n\n";
            //print_r($destino);

            // solo pacientes de mas de 16 años...
            // y si tene email

            if ( $destino['edad'] >= 16 && $destino['Email'] != ""){

                // primero preparamos los datos personalizados de sexo, nombre,...
                if ($destino['Sexo']=='H') {
                    $nom = 'Benvolgut '.ucfirst(strtolower($destino['Nombre'])).',';
                    $tracte = 'atès';
                }
                else {
                    $nom = 'Benvolguda '.ucfirst(strtolower($destino['Nombre'])).',';
                    $tracte = 'atesa';
                }

                // els destinataris
                $aqui = array();
                $aqui['email'] = 'enric.badia@gmail.com';
                //$aqui['email'] = $destino['Email'];
                $aqui['name'] = $destino['Nombre'].','.$destino['Apellidos'];
                $aqui['type'] = 'to';

                array_push( $tus, $aqui );
                //------------------------

                // posem les variables personalitzades
                $aris = array();
                //$aris['rcpt'] = $destino['Email'];
                $aris['rcpt'] = 'enric.badia@gmail.com';
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
                //------------------------------


            }

            // solo pacientes de menos de 16 años...
            // y si tene email

            if ( $destino['edad'] < 16 && $destino['Email'] != ""){

                // primero preparamos los datos personalizados de sexo, nombre,...
                if ($destino['Sexo']=='H') {
                    $nom = 'en '.ucfirst(strtolower($destino['Nombre'])).'';
                    $tracte = 'atès';
                }
                else {
                    $nom = 'na '.ucfirst(strtolower($destino['Nombre'])).'';
                    $tracte = 'atesa';
                }

                // els destinataris
                $aqui = array();
                $aqui['email'] = 'enric.badia@gmail.com';
                //$aqui['email'] = $destino['Email'];
                $aqui['name'] = $destino['Nombre'].','.$destino['Apellidos'];
                $aqui['type'] = 'to';

                array_push( $tus1, $aqui );
                //------------------------

                // posem les variables personalitzades
                $aris1 = array();
                //$aris['rcpt'] = $destino['Email'];
                $aris1['rcpt'] = 'enric.badia@gmail.com';
                $aris1['vars'] = array();

                $t = array();
                $t['name'] = 'familia';
                $t['content'] = 'Apreciada familia '.ucwords(strtolower($destino['Apellidos'])).',';
                array_push( $aris1['vars'], $t );

                $t['name'] = 'nom';
                $t['content'] = $nom;
                array_push( $aris1['vars'], $t );

                $t['name'] = 'tracte';
                $t['content'] = $tracte;
                array_push( $aris['vars'], $t );

                array_push( $mergevars1, $aris1 );
                //------------------------------

            }
        }

        echo "==========\n";
        echo "-----> tus\n";
        echo "==========\n\n";
        print_r($tus);
        echo "================\n";
        echo "-----> mergevars\n";
        echo "================\n\n";
        print_r($mergevars);

        echo "==========\n";
        echo "-----> tus\n";
        echo "==========\n\n";
        print_r($tus1);
        echo "================\n";
        echo "-----> mergevars\n";
        echo "================\n\n";
        print_r($mergevars1);


        // **************************************
        // AQUI EMPIEZA EL ESPECTACULO DE MANDRILL
        // **************************************

        // **************************************
        // mayores
        // **************************************
        try {

            // ======
            // aqui es donde empieza realmente la confuguracion del json de mandrill
            // ======

            $mandrill = new Mandrill($MANDRILL_APIKEY);
            //$muser = new Mandrill_Users($mandrill);
            //print_r( $muser->info() );

            $template = 'testing';
            $content = array();
            $message = array(
            	'to' =>  $tus ,
                'merge_vars' => array( $aris ),
                'bcc_address' => 'ebadia@eneresi.com'
            );
            $async = false;
            $result = $mandrill->messages->sendTemplate($template, $content, $message, $async);

            print_r($result);


        } catch(Mandrill_Error $e) {
            // Mandrill errors are thrown as exceptions
            echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
            // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
            throw $e;
        }

        // **************************************
        // niños
        // **************************************
        try {

            // ======
            // aqui es donde empieza realmente la confuguracion del json de mandrill
            // ======

            $mandrill = new Mandrill($MANDRILL_APIKEY);
            //$muser = new Mandrill_Users($mandrill);
            //print_r( $muser->info() );

            $template = 'gracies_child_1';
            $content = array();
            $message = array(
                'to' =>  $tus1 ,
                'merge_vars' => array( $aris1 ),
                'bcc_address' => 'ebadia@eneresi.com'   
            );
            $async = false;
            $result = $mandrill->messages->sendTemplate($template, $content, $message, $async);

            print_r($result);


        } catch(Mandrill_Error $e) {
            // Mandrill errors are thrown as exceptions
            echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
            // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
            throw $e;
        }


        // **************************************
        // AQUI ACABA EL ESPECTACULO DE MANDRILL
        // **************************************

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }


?>
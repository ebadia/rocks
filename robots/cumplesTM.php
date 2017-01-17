<?php

// ejecutar con argumentos 
//      1: que es el codigo de ciudad
//      2: centro dentro de la ciudad

    //-- TextMagic  

    require 'textmagic/TextMagicAPI.php';

    //---------------------------------------------------
    //-- Variables de control del script para desarrollo  
    // envia un sms real si test = 0
    $test = 1;
    // envia solo al telefono de test si enviaauno = 1
    $enviaauno = 0;
    // pone los sms en rocks si rocks = 1
    $rocks = 0;
    //---------------------------------------------------

    // Parametros del comando de entrada
    // 1: ide del centro
    // 2: dias de margen
    // 3: mostrar resultados en pantalla
    $id = $argv[1];
    $margen = $argv[2];
    $screen = $argv[3];

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

    $sql = "
        select Nombre, Apellidos, TelMovil,datediff ( year , FecNacim, CAST(GETDATE() AS DATE) ) as cumple
        from Pacientes
        where 
        ( day(FecNacim) = day( CAST(GETDATE() AS DATE) ) )
        and
        ( month(FecNacim) = month( CAST(GETDATE() AS DATE) ) )
        and TelMovil is not NULL
        and Pacientes.AceptaSMS = 1 
    ";

// **************************************
// conexion a gesdent
// **************************************
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
        echo "-----> listado de citas gesdent\n";
        echo "==========================\n\n";
        print_r($devuelvo['data']['data']);
        // echo "==========================\n\n";

        // **************************************
        // SOLO SI HAY CITAS DEVUELTAS DESDE GESDENT...
        // **************************************

        if ( sizeof($res) > 0 ){
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

            // print_r( $api );

            if ( $enviaauno == 0 ){
                $envios = $devuelvo['data']['data'];
            } else {
                $envios = array( $devuelvo['data']['data'][0] );
            }

            // print_r( $envios );

            // -- para cada paciente de la clinica que tiene cita...
            foreach( $envios as $destino ){
            //$destino = $devuelvo['data']['data'][0];
                // print_r( $destino );
                // echo "=====DESTINO==============\n";
                // echo $destino['TelMovil']."\n";

                if (  $destino['TelMovil'] == ""  ){
                
                    $text = "Numero de telefono inexistente";
                
                } else {
                    
                    //-- construimos texto del mensaje de recordatorio
                    if ( $id == 1 || $id == 2 ){
                        //-- CATALA
                        //-- para poder poner en castellano/catalan? la fecha de la cita
                        setlocale(LC_ALL,"ca_ES");
                        $date = DateTime::createFromFormat("Ymd", $fecha);
                        // $inicio = "Hola ". ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ). ", els teus amics d´Enèresi dessitjem que tinguis un fantàstic dia del teu ". $destino['cumple']. " aniversari. \n\nPer molts anys!\n";
                        $inicio = "Hola ". ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ). ", l´equip d´Enèresi Especialistes Mèdics Dentals et desitja un feliç aniversari!\n";
                    } else {
                        //-- CASTELLA
                        //-- para poder poner en castellano/catalan? la fecha de la cita
                        setlocale(LC_ALL,"es_ES");
                        $date = DateTime::createFromFormat("Ymd", $fecha);
                        $inicio = "Hola ". ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ). ", el equipo de Enéresi Especialistas Médicos Dentales te desea un ¡feliz cumpleaños!\n";
                    }

                    $text = utf8_decode( $inicio );

                    if ( $enviaauno == 0 ) {
                        // limpiamos el numero de espacios, puntos, guiones
                        // ponemos el telefono del paciente
                        $to = preg_replace('/\s+/', '', $destino['TelMovil']);
                        $to = preg_replace('/-+/', '', $to);
                        $to = preg_replace('/\.+/', '', $to);
                        $to = $prefijo.$to;
                    } else {
                        // ponemos el telefono de pruebas
                        $to = $prefijo . preg_replace('/\s+/', '', '601007366');
                    }
                    
                 echo "Telefono de envio: \n";
                 echo $to;
                 echo "Largo: \n";
                 echo strlen($to);
                 echo ", ";
                 echo $to[2];
                 echo "\n";

                    if ( $test == 0 ) {
                        if (  $to != "" && strlen($to) == 11 && $to[2] != '9' ) {
                            //-- enviamos mensaje
                            $response = $api->send( $text, array($to), true, false, 'Eneresi' );
                            // print_r($response);

                            // -- actualiza Gesdent
                            // if ( $response[0]->error == "" ){
                            //     echo $sql = "UPDATE DCitas set Recordada = 1 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
                            // } else {
                            //     echo $sql = "UPDATE DCitas set Recordada = 9 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
                            // }
                            // $query = mssql_query($sql);
                        } else {
                            // si el numero es incorrecto se salta el envio
                            $text = "Numero de telefono incorrecto";
                        }
                    }

                }

                 echo $text;
                 echo "\n";
                 echo "==========================\n";

               if ( $rocks == 1 ) {
                    //-- actualiza Rocks
                    // para control de mensajes
                    $sqlr = "INSERT INTO sms SET
                        fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                        para                    = '".$to."',
                        message                 = '".iconv("CP1252", "UTF-8", $text )."',
                        centre_id               = ".$id.",
                        user_id                 = 0,
                        motivo                  = 'cumple'"
                    ;
                    $stmt = $dbh->prepare($sqlr);
                    $pide = $stmt->execute();
                }
    
            }

        } else {
            echo "==========================\n";
            echo "-----> No hay cumples!\n";
            echo "==========================\n";
        }

        // **************************************
        // FINAL
        // **************************************

        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

?>
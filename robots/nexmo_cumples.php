<?php
// ejecutar con argumentos 
//      1: que es el codigo de ciudad
//      2: centro dentro de la ciudad

    //-- TextMagic  
    echo "\n";
	require_once "./nexmo/vendor/autoload.php";

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
        echo "-----> listado de cumples \n";
        echo "==========================\n\n";
        print_r($devuelvo['data']['data']);
        // echo "==========================\n\n";

        // **************************************
        // SOLO SI HAY CUMPLES DEVUELTOS DESDE GESDENT...
        // **************************************

        if ( sizeof($res) > 0 ){
            // **************************************
            // MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
            // **************************************
            // -- datos de previos
            $prefijo = "34";

            //-- conectamos con nexmo
            $client = new Nexmo\Client(new Nexmo\Client\Credentials\Basic('7c8807b4', 'c113ce5e782233e5'));

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
                 echo "=====DESTINO==============\n";
                // echo $destino['Movil']."\n";

                //-- construimos texto del mensaje de recordatorio
     
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

                    // echo $to."\n";
                    // echo ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) )."\n";
                     echo $text."\n";
                     echo "==========================\n";
                
                    if ( $test == 0 ) {
                        if (  $to != "" && strlen($to) == 11 && $to[2] != '9' ) {
                            //-- enviamos mensaje
                            $response = $client->message()->send([
                            	'to' => $to,
                            	'from' => 'Eneresi',
                            	'text' => $text
    
                            ]);
    
                            // $response = $api->send( $text, array($to), true );
                            // print_r($response);
                            echo "Sent message to " . $message['to'] . ". Balance is now " . $message['remaining-balance'   ] . PHP_EOL;
    
                            } else {
                            // si el nuemro es incorrecto se salta el envio
                            $text = "Numero de telefono incorrecto";
                        }
                        
                        // esperamos un momento para evitar enviar mas de 30 por segundo
                        time_nanosleep(0, 35000000);

                    }
                }

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
            echo "-----> No hay citas!\n";
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

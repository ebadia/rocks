<?php

// ejecutar con argumentos 
//      1: que es el codigo de ciudad
//      2: centro dentro de la ciudad

    //-- Twilio  

    require( './twilio-php/vendor/twilio/sdk/Services/Twilio.php' );
    date_default_timezone_set('Europe/Berlin');

    //---------------------------------------------------
    //-- Variables de control del script para desarrollo  
    // envia un sms real
    $test = 0;  
    // envia solo al telefono de test
    $enviaauno = 1;
    //---------------------------------------------------

    // Parametros del comando de entrada
    // 1: ide del centro
    // 2: dias de margen
    // 3: mostrar resultados en pantalla
    $id = $argv[1];
    $margen = $argv[2];
    $screen = $argv[3];

    // definicion de la fecha
    //$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
    $fecha_gd = date('Ymd');
    // $fecha = date('20150818');


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

    $sql = "
        select a.*,
        dcitasop.*,
        pacientes.*,
        tsitcita.*,
        tusuagd.Descripcio as box,
        convert(varchar, cast(CAST(hora / 86399.0 as datetime) as time), 108) as quehora,
        convert(varchar, cast(CAST(horllegada / 86399.0 as datetime) as time), 108) as llega

        from DCitas as a
        
        /* necesario para aislar los pacientes que tienen mas de una cosa programada */
        /* y enviar un solo smsm */
        inner join ( 
            select distinct idpac, min(idorden) as id
            from dcitas 
            WHERE 
            DCitas.Fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2 
            and DCItas.Movil <> '' 
            and DCitas.IdPac is not NULL
            group by idpac
        ) as b
        on (a.idorden = b.id and a.idpac = b.idpac)

        left join dcitasop on a.idusu=dcitasop.idusu and a.idorden=dcitasop.idorden
        left join pacientes on pacientes.numpac=a.numpac
        left join tsitcita on tsitcita.idsitc=a.idsitc
        left join tusuagd on a.idusu=tusuagd.idusu

        /*WHERE fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2*/
        WHERE 
        fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2
        and a.IdSitC <> 1
        order by tusuagd.Descripcio, hora asc
    ";

// **************************************
// Datos de las conexiones a los dos sistemas
// **************************************

    // -- datos de conexion a gesdent
        $dbhost=$clinicas[$id][0];
        $dbport="1433";
        $dbuser=$clinicas[$id][1];
        $dbpass=$clinicas[$id][2];
        //$dbname="GELITE";
        $db = mssql_connect($dbhost.":".$dbport, $dbuser, $dbpass);
        //return $dbh;

    // -- datos de conexion a rocks
        $rdbhost="31.170.164.39";
        $rport="3306";
        $rdbuser="u742391297_rocks";
        $rdbpass="tincfeina";
        $rdbname="u742391297_rocks";
        $dbr = new PDO("mysql:host=$rdbhost;port=$rport;dbname=$rdbname", $rdbuser, $rdbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
        $dbr->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


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
        // echo "==========================\n";
        // echo "-----> listado de citas gesdent\n";
        // echo "==========================\n\n";
        // print_r($devuelvo['data']['data']);
        // echo "==========================\n\n";

        // **************************************
        // SOLO SI HAY CITAS DEVUELTAS DESDE GESDENT...
        // **************************************

        if ( sizeof($res) > 0 ){
            // **************************************
            // MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
            // **************************************
            // -- datos de twilio
            $sid = "AC761170e1a5333c686b1741b3545576de";
            $token = "6e50750f30283ca1a9825ef093c79071";
            $from = "34931071543";
            $prefijo = "34";

            echo "=====sms==============\n";

            //-- conectamos con twilio
            $client = new Services_Twilio($sid,$token);

            echo "=====API==============\n";
            // print_r( $client );

            if ( $enviaauno == 0 ){
                $envios = $devuelvo['data']['data'];
            } else {
                $envios = array( $devuelvo['data']['data'][0] );
            }

            // print_r( $envios );

            // -- para cada paciente de la clinica que tiene cita...
            for ( $i=0; $i<$max; $i++ ){

                $destino = $devuelvo['data']['data'][$i];
                // print_r( $destino );
                echo "=====DESTINO==============\n";
                echo $destino['Movil']."\n";

                //-- construimos texto del mensaje de recordatorio
     
                if ( $id == 1 || $id == 2 ){
                    //-- CATALA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"ca_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Eneresi.\n" . ucwords($destino['Nombre']) . " et recordem la teva cita del ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a les " . substr($destino['quehora'],0,5);
                    $confirma = ". Preguem confirmis responent Si o No a aquest SMS. Gracies.";
                } else {
                    //-- CASTELLA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"es_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Eneresi. " . ucwords($destino['Nombre']) . " te recordamos tu cita del ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a las " . substr($destino['quehora'],0,5);
                    $confirma = ". Rogamos confirmes respondiento Si o No a este SMS. Gracias.";
                }

                $text = utf8_decode( $inicio . $nombredeldia . $dia . $nombredelmes . $hora . $confirma );

                if ( $enviaauno == 0 ) {
                    // ponemos el telefono del paciente
                    $to = $prefijo.preg_replace('/\s+/', '', $destino['Movil']);
                    $to = $prefijo.preg_replace('/\.+/', '', $destino['Movil']);
                    $to = $prefijo.preg_replace('/\-+/', '', $destino['Movil']);
                } else {
                    // ponemos el telefono de pruebas
                    $to = $prefijo . preg_replace('/\s+/', '', '601007366');
                }

                // echo $text;
                // echo "\n";
                // echo $to;
                // echo "\n";
                // echo "======test====================\n";
                // echo $test;
                // echo "\n";
                
                if ( $test == 0 ) {
                    //-- enviamos mensaje
                    echo "=====mensaje==============\n";
                    $response = $client->account->messages->sendMessage( $from, $to, $text );
                    
                    echo "=====response==============\n";
                    print_r($response);

                    // -- actualiza Gesdent
                    if ( $response->error_message == "" ){
                        echo $sql = "UPDATE DCitas set Recordada = 1 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
                    } else {
                        echo $sql = "UPDATE DCitas set Recordada = 9 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
                    }
                    $query = mssql_query($sql);
 
                    //-- poner el resultado en la BD de Gesdent (marcar enviado SMS de la cita) y Rocks
                    echo $sqlr = "INSERT INTO smsrecordatorios SET
                        pasarela                = 'twilio',
                        paciente                = '".$destino['Texto']."',
                        envio                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                        idcita                  = ".$destino['IdOrden'].",
                        fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+$margen, date("Y")) )."',
                        hora                    = '".$destino['quehora']."',
                        texto                   = '".$text."',
                        resultado_destino       = '".$to."',
                        resultado_errorcode     = '".$response['messages']."',
                        resultado_error         = '".$response['messages']."',
                        centroid                = ".$id.",
                        msgid                   = '".key($response['messages'])."'"
                    ;
                    $stmt = $dbr->prepare($sqlr);
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
<?php

// ejecutar con un solo argumento que es el codigo del centro

	//require __DIR__ . '/Mandrill/Mandrill.php';
	//$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //-- Clickatell Composer interface framework 
    //-- https://github.com/arcturial/clickatell

    require '../vendor/autoload.php';
    use Clickatell\Api\ClickatellHttp;

	// definicion de la fecha
	//$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")+2, date("Y")) );

	//$fecha = '20150417';
	$id = $argv[1];
    $centro = $argv[2];

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
        select DCitas.*,
        dcitasop.*,
        pacientes.*,
        tsitcita.*,
        tusuagd.Descripcio as box,
        convert(varchar, cast(CAST(hora / 86399.0 as datetime) as time), 108) as quehora,
        convert(varchar, cast(CAST(horllegada / 86399.0 as datetime) as time), 108) as llega

        from DCitas

        left join dcitasop on dcitas.idusu=dcitasop.idusu and dcitas.idorden=dcitasop.idorden
        left join pacientes on pacientes.numpac=dcitas.numpac
        left join tsitcita on tsitcita.idsitc=dcitas.idsitc
        left join tusuagd on dcitas.idusu=tusuagd.idusu

        /*WHERE fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2*/
        WHERE fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) - 3
        /*and dcitas.IdSitC <> 1 and dcitas.IdSitC <> 0*/
        and dcitas.IdSitC <> 1
        order by tusuagd.Descripcio, hora asc

    ";

    //recupera($id,$sql); 

    //function getConnection($id) {

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
        echo "==========================\n";
        echo "-----> devuelvo de gesdent\n";
        echo "==========================\n\n";
        print_r($devuelvo['data']['data']);
        echo "==========================\n\n";

// **************************************
// MANIPULACION PREVIA DE LAS VARIABLES DEVUELTAS
// **************************************
        // -- datos de clickatell
        $user = "eneresi";
        $password = "Eneresi1997";
        $api_id = "3527760";
        $baseurl = "http://api.clickatell.com";
        $prefijo = "34";
        $retorno = "34973903023";

        //-- conectamos con Clickatell
        $clickatell = new ClickatellHttp($user, $password, $api_id);

        // -- para cada paciente de la clinica que tiene cita...
        //foreach( $devuelvo['data']['data'] as $destino ){
        $destino = $devuelvo['data']['data'][0];
            echo "=====DESTINO==============\n";
            echo $destino['Movil']."\n";
            echo $destino['IdOrden']."\n";


            //-- construimos texto del mensaje de recordatorio
 
            if ( $id == 1 || $id == 2 ){
                //-- CATALA
                //-- para poder poner en castellano/catalan? la fecha de la cita
                setlocale(LC_ALL,"ca_ES");
                $date = DateTime::createFromFormat("Ymd", $fecha);
                $inicio = "Clinica Dental Eneresi. " . ucwords($destino['Nombre']) . " et recordem la teva cita del ";
                $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                $dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+2, date("Y")) );
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
                $dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+2, date("Y")) );
                $hora = "a las " . substr($destino['quehora'],0,5);
                $confirma = ". Rogamos confirmes respondiento Si o No a este SMS. Gracias.";
            }

            $text = utf8_decode( $inicio . $nombredeldia . $dia . $nombredelmes . $hora . $confirma );
            // $to = $prefijo.preg_replace('/\s+/', '', $destino['Movil']);
            $to = $prefijo . preg_replace('/\s+/', '', '639994215');

            //-- enviamos mensaje
            $response = $clickatell->sendMessage(
                array($to), 
                $text, 
                array(
                    "from"=>$retorno,
                    "mo"=>1,
                    "clientMessageId"=>$destino['IdOrden']
                ) 
            );
            // print_r($response);

            // -- actualiza Gesdent
            if ( $response[0]->error == "" ){
                echo $sql = "UPDATE DCitas set Recordada = 1 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
            } else {
                echo $sql = "UPDATE DCitas set Recordada = 9 WHERE IdUsu = ". $destino['IdUsu'] ." AND IdOrden = ". $destino['IdOrden'];
            }
            $query = mssql_query($sql);

            //-- poner el resultado en la BD de Gesdent (marcar enviado SMS de la cita) y Rocks
            echo $sqlr = "INSERT INTO smsrecordatorios SET
                pasarela                = 'clickatell',
                paciente                = '".$destino['Texto']."',
                envio                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                idcita                  = " .$destino['IdOrden'].",
                fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+2, date("Y")) )."',
                hora                    = '".$destino['quehora']."',
                texto                   = '".$text."',
                resultado_destino       = '".$response[0]->destination."',
                resultado_errorcode     = '".$response[0]->errorcode."',
                resultado_error         = '".$response[0]->error."',
                centroid                = " .$id.",
                msgid                   = '".$response[0]->id ."'"
            ;
            $stmt = $dbr->prepare($sqlr);
            $pide = $stmt->execute();

        //}

// **************************************
// FINAL
// **************************************
        //echo json_encode($devuelvo);
        mssql_free_result($query);

     } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

?>
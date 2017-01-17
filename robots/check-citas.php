<?php

// ejecutar con un solo argumento que es el codigo del centro

	//require __DIR__ . '/Mandrill/Mandrill.php';
	//$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';

    //---------------------------------------------------
    //-- Variables de control del script para desarrollo  
    // envia un sms real
    $test = 0;  
    // envia solo al telefono de test
    $enviaauno = 0;
    // pinta el pantalla
    $screen = 0;
    //---------------------------------------------------

    // Parametros del comando de entrada
    // 1: ide del centro
    // 2: dias de margen
    // 3: mostrar resultados en pantalla
    print_r( $argv );

    if ( $argv[1] == "" ) exit("missing argument");

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
    $murcia = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    $molina = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 4);

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
        /* y enviar un solo sms */
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

        WHERE 
        fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2
        and a.IdSitC <> 1
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
        // echo "==========================\n";
        // echo "-----> devuelvo de gesdent\n";
        // echo "==========================\n\n";
        // print_r($devuelvo['data']['data']);
        // echo "==========================\n\n";

        if ( $enviaauno == 0 ){
            $envios = $devuelvo['data']['data'];
        } else {
            $envios = array( $devuelvo['data']['data'][0] );
            echo 'enviamos solo uno al de muestra\n';
            echo sizeof($envios).'\n';
            echo "==========================\n\n";
        }

        // print_r($envios);
        $evol = "";

        foreach( $envios as $destino ){
        //$destino = $devuelvo['data']['data'][0];
            //echo "=====DESTINO==============\n";
            //echo $destino['Movil']."\n";

            setlocale(LC_ALL,"es_ES");
            $date = DateTime::createFromFormat("Ymd", $fecha);
            $inicio = "Clinica Dental Eneresi. " . ucwords($destino['Nombre']) . " te recordamos tu cita del ";
            $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
            $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
            $dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
            $hora = "a las " . substr($destino['quehora'],0,5);
            $confirma = ". Confirma respondiento Si o No a este SMS. Gracias.";

            $evol .= utf8_decode( $destino['Texto']." : " . $inicio . $nombredeldia . $dia . $nombredelmes . $hora . $confirma. "\n" );

        }

        if ( $screen == 1 ){
            echo $evol;
        } else {
            // lo guarda en un archivo por si acaso lo queremos ver en la web
            echo '>>> GUARDADO en '. __DIR__ . '/evol/citas_'.$fecha_gd.'.html';
            file_put_contents( __DIR__ . '/evol/citas_'.$fecha_gd.'.html', $evol);
        }

// **************************************
// FINAL
// **************************************
        //echo json_encode($devuelvo);
        mssql_free_result($query);

     } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

?>
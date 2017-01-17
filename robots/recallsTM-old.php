    <?php
// ejecutar con argumentos 
//      1: que es el codigo de ciudad
//      2: centro dentro de la ciudad

    //-- TextMagic  
    echo "\n";
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

    // definicion de la fecha
    //$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
    $fecha_gd = date('Ymd');
    // $fecha = date('20150818');


//********************************* 
//* definicion de clinicas
//* poner en el indice que corresponde a la id de la base de datos de centros
//********************************* 
    $clincas = array();
    $lleida = array( "81.45.46.237", "SERVER\\ebadia", "eneresi", "GELITE", 1 );
    $sabadell =  array( gethostbyname('eneresisabadell.dnsalias.com'), "SERVER\\ebadia", "ClinicaSabadell14", "GELITE_310", 2);
    if ($externalIp != "81.45.47.60" ) {
        $murcia = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    } else {
        $murcia = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    }
    $molina = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 4);
    $mislata = array();
    $barcelona =  array( gethostbyname('eneresibcn.no-ip.net'), "SERVIDOR\\ebadia", "Eneresi6102", "GELITE", 2);

    $clinicas[1] = $lleida;
    $clinicas[2] = $sabadell;
    $clinicas[3] = $murcia;
    $clinicas[4] = $molina;
    $clinicas[5] = $mislata;
    $clinicas[6] = $barcelona;
//********************************* 
    

    // definicion del sql de recuperacion de pacientes

    // selecciona si hay subcentros en instalaciones multicentro
    switch ($id) {
        case '3':
            // murcia
            $subcentro = " and DCitas.IdCentro = 3 ";
            break;
        case '4':
            // molina
            $subcentro = " and DCitas.IdCentro = 2 ";
            break;
        
        default:
            $subcentro = " ";
            break;
    }

    echo $sql = "
        SELECT * FROM  (
            select DCitas.Movil, DCitas.idpac, DCitas.idusu, DCitas.idorden, DCitas.Texto,
            convert(varchar, cast(CAST(hora / 86399.0 as datetime) as time), 108) as quehora,
            Pacientes.Nombre, Pacientes.Apellidos,
            tusuagd.Descripcio as boxllarg,
            
            ROW_NUMBER() OVER (PARTITION BY DCitas.Movil ORDER BY DCitas.hora ASC) as num
            
            from Pacientes
            
            right join DCitas on  Pacientes.idpac = DCitas.idpac
            left join tusuagd on DCitas.idusu=tusuagd.idusu
            
            WHERE 
            DCitas.Fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2 ".
            $subcentro 
            ."/*and DCitas.IdCentro = 2*/
            and DCitas.IdSitC = 0 
            and DCItas.Movil <> '' 
        ) xx
        where xx.num = 1
        order by IdUsu    
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
	    // ----> en rocks poner este
	    //$dbhost="mysql.hostinger.es";
	    // ----> en local poner este
	    // $dbhost="31.170.164.39";
	    // $port="3306";
	    // $dbuser="u742391297_rocks";
	    // $dbpass="tincfeina";
	    // $dbname="u742391297_rocks";
	    // $dbh = new PDO("mysql:host=$dbhost;port=$port;dbname=$dbname", $dbuser, $dbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
	    // $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    // return $dbh;
	    // ----> en rocks poner este
	    $dbhost="108.179.234.137";
	    // ----> en local poner este
	    // $dbhost="31.170.164.39";
	    $port="3306";
	    $dbuser="eneresi_ebadia";
	    $dbpass="tincfeina";
	    $dbname="eneresi_rocks";
	    $dbh = new PDO("mysql:host=$dbhost;port=$port;dbname=$dbname", $dbuser, $dbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
	    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


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
                 print_r( $destino );
                 echo "=====DESTINO==============\n";
                 echo $destino['Movil']."\n";

                //-- construimos texto del mensaje de recordatorio
     
                if ( $id == 1 || $id == 2 ){
                    //-- CATALA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"ca_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Enèresi. " . ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ) . " et recordem la teva cita del ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $mes = strftime("%m",$date->getTimestamp()) . " ";
                    //$dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $dia = date( 'd\/', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a les " . substr($destino['quehora'],0,5);
                    $confirma = ". Confirma-la responent Si o No a aquest SMS. Gràcies.";
                } else {
                    //-- CASTELLA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"es_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Enéresi. " . ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ) . " te recordamos tu cita del ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $mes = strftime("%m",$date->getTimestamp()) . " ";
                    //$dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $dia = date( 'd\/', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a las " . substr($destino['quehora'],0,5);
                    $confirma = ". Confirmala respondiento Si o No a este SMS. Gracias.";
                }

                //$text = utf8_decode( $inicio . $nombredeldia . $dia . $nombredelmes . $hora . $confirma );
                $text = utf8_decode( $inicio . $dia . $mes . $hora . $confirma );

                if ( $enviaauno == 0 ) {
                    // limpiamos el numero de espacios, puntos, guiones
                    // ponemos el telefono del paciente
                    $to = preg_replace('/\s+/', '', $destino['Movil']);
                    $to = preg_replace('/-+/', '', $to);
                    $to = preg_replace('/\.+/', '', $to);
                    $to = $prefijo.$to;
                } else {
                    // ponemos el telefono de pruebas
                    $to = $prefijo . preg_replace('/\s+/', '', '601007366');
                }
                 echo $to."\n";
                 echo ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) )."\n";
                 echo $text."\n";
                 echo "==========================\n";
                
                if ( $test == 0 ) {
                    if (  $to != "" && strlen($to) == 11 && $to[2] != '9' ) {
                        //-- enviamos mensaje
                        $response = $api->send( $text, array($to), true );
                        print_r($response);

                        //-- poner el resultado en la BD de Gesdent (marcar enviado SMS de la cita) y Rocks
                        // -- actualiza Gesdent
                        if ( $response[0]->error == "" ){
                            $sql = "UPDATE DCitas set Recordada = 1 WHERE IdUsu = ". $destino['idusu'] ." AND IdOrden = ". $destino['idorden'];
                        } else {
                            $sql = "UPDATE DCitas set Recordada = 9 WHERE IdUsu = ". $destino['idusu'] ." AND IdOrden = ". $destino['idorden'];
                        }
                        $query2 = mssql_query($sql);
                        mssql_free_result($query2);
                    } else {
                        // si el nuemro es incorrecto se salta el envio
                        $text = "Numero de telefono incorrecto";
                    }
                }

                if ( $rocks == 1 ) {
                    //-- actualiza Rocks
                    // para control de citas
                    // para controlar el id del mensaje enviado...
                    foreach( $response['messages'] as $key=>$val){
                        $msgid = $key;
                    }
                    // a la bbdd
                    $sqlr = "INSERT INTO smsrecordatorios SET
                        pasarela                = 'textmagic',
                        paciente                = '". iconv("CP1252", "UTF-8", $destino['Texto'] )."',
                        envio                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                        idcita                  = ".$destino['idorden'].",
                        fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")+$margen, date("Y")) )."',
                        hora                    = '".$destino['quehora']."',
                        texto                   = '".iconv("CP1252", "UTF-8", $text )."',
                        phone                   = '".$to."',
                        centroid                = ".$id.",
                        box                     = '".iconv("CP1252", "UTF-8", $destino['boxllarg'] )."',
                        msgid                   = '".$msgid."'"
                    ;
                    $stmt = $dbr->prepare($sqlr);
                    $pide = $stmt->execute();

                    // para control de mensajes
                    $sqlr = "INSERT INTO sms SET
                        fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                        para                    = '".$to."',
                        message                 = '".iconv("CP1252", "UTF-8", $text )."',
                        centre_id               = ".$id.",
                        user_id                 = 0,
                        motivo                  = 'cita'"
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
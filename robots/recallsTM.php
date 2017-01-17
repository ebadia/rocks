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
    $subcentro = $argv[3];

    // definicion de la fecha
    //$fecha = date('Ymd');
    $fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
    $fecha_gd = date('Ymd');
    // $fecha = date('20150818');


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

    // selecciona si hay subcentros en instalaciones multicentro
    switch ($id) {
        case '3':
            // murcia
            $subcentro = " and Recalls.IdCentro = 3 ";
            break;
        case '4':
            // molina
            $subcentro = " and Recalls.IdCentro = 2 ";
            break;
        
        default:
            $subcentro = " ";
            break;
    }

if ( $id == 3 || $id == 4 ){
    $sql = "
        SELECT 

        Recalls.Fecha, Recalls.IdPac,Recalls.IdCentro,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
        ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec
        
        FROM Recalls
        INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
        INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo           
        
        WHERE 
        ( Fecha >= DATEADD(day, DATEDIFF(day, 0, GETDATE()+".$margen."), 0) and Fecha < DATEADD(day, DATEDIFF(day, 0, GETDATE()+".($margen+1)."), 0) )
        and Carta = 'false' and Citado = 'false'
        and TMRecall.Descripcio in ('Revision Conservadora', 'Revision Odontopediatria' )"
        .$subcentro.
                
        "ORDER BY Fecha DESC
    ";
} else {
    $sql = "
        SELECT 

        Recalls.Fecha, Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
        ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec
        
        FROM Recalls
        INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
        INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo            
        
        WHERE 
        ( Fecha >= DATEADD(day, DATEDIFF(day, 0, GETDATE()+".$margen."), 0) and Fecha < DATEADD(day, DATEDIFF(day, 0, GETDATE()+".($margen+1)."), 0) )
        and Carta = 'false' and Citado = 'false'
        and TMRecall.Descripcio in ('REVC', 'REOP' )

        ORDER BY Fecha DESC
    ";
}
// echo $sql;

        // =====================================================
        // recuperamos el telefono de la clinica correspondiente
        $telefono_clinica = "";

        try {
            $stmt = $dbh->query('SET CHARACTER SET utf8');
            $rsql = "select telefono from centres where id = ". $id;
            $stmt = $dbh->query($rsql);
            $hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
            if (count($hisoc) != 0){
                $res["data"] = $hisoc;
            } else {
                $res["data"] = [];
            }
            $dbh = null;

            // echo "Telefono de la clinica " . $hisoc[0]->telefono . "\n";
        // =====================================================

        } catch(PDOException $e) {
            echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
        }

        $telefono_clinica = str_replace(' ', '', $hisoc[0]->telefono );


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
         echo "-----> listado de recall gesdent (".sizeof($res).")\n";
         echo "==========================\n\n";
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
                 // print_r( $destino );
                 echo "=====DESTINO==============\n";
                 echo $destino['Movil']."\n";

                //-- construimos texto del mensaje de recordatorio
                /*
                Clinica Dental Enéresi. JAVIER, toca fer-te la revisió dental. 
                Pots trucar al 973283143 per concertar la teva cita. 
                Si no pots et trucarem nosaltres en breu.
                */
     
                if ( $id == 1 || $id == 2 ){
                    //-- CATALA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"ca_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Enèresi. " . ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ) . " , toca fer-te la revisió dental. ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $mes = strftime("%m",$date->getTimestamp()) . " ";
                    //$dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $dia = date( 'd\/', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a les " . substr($destino['quehora'],0,5);
                    $confirma = "Pots trucar al ".$telefono_clinica." per concertar la teva cita. Si no pots, et trucarem nosaltres en breu.";
                } else {
                    //-- CASTELLA
                    //-- para poder poner en castellano/catalan? la fecha de la cita
                    setlocale(LC_ALL,"es_ES");
                    $date = DateTime::createFromFormat("Ymd", $fecha);
                    $inicio = "Clinica Dental Enéresi. " . ucwords( iconv("CP1252", "UTF-8", $destino['Nombre'] ) ) . " toca hecerte la revisión dental. ";
                    $nombredeldia = strftime("%A",$date->getTimestamp()) . " ";
                    $nombredelmes = strftime("%B",$date->getTimestamp()) . " ";
                    $mes = strftime("%m",$date->getTimestamp()) . " ";
                    //$dia = date( 'd \d\e\ ', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $dia = date( 'd\/', mktime(0, 0, 0, date("m") ,   date("d")+$margen, date("Y")) );
                    $hora = "a las " . substr($destino['quehora'],0,5);
                    $confirma = "Puedes llamar al ".$telefono_clinica." para concertar tu cita. Si no puedes, te lamaremos nosotros en breve.";
                }

                //$text = utf8_decode( $inicio . $nombredeldia . $dia . $nombredelmes . $hora . $confirma );
                $text = utf8_decode( $inicio . $confirma );

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
                        // $response = $api->send( $text, array($to), true, false, 'Eneresi' );
                        print_r($response);

                        //-- poner el resultado en la BD de Gesdent (marcar enviado SMS del recall) y Rocks
                        // -- actualiza Gesdent
                        if ( $response[0]->error == "" ){
                            $sql = "UPDATE DCitas set Recordada = 1 WHERE IdUsu = ". $destino['idusu'] ." AND IdOrden = ". $destino['idorden'];
                        } else {
                            $sql = "UPDATE DCitas set Recordada = 9 WHERE IdUsu = ". $destino['idusu'] ." AND IdOrden = ". $destino['idorden'];
                        }
                        $query2 = mssql_query($sql);
                        mssql_free_result($query2);
                    } else {
                        // si el numero es incorrecto se salta el envio
                        $text = "Numero de telefono incorrecto";
                    }
                }

                if ( $rocks == 1 ) {
                    //-- actualiza Rocks
                    // para control de mensajes de recall
                    $sqlr = "INSERT INTO sms SET
                        fecha                   = '".date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d"), date("Y")) )."',
                        para                    = '".$to."',
                        message                 = '".iconv("CP1252", "UTF-8", $text )."',
                        centre_id               = ".$id.",
                        user_id                 = 0,
                        motivo                  = 'recall'"
                    ;
                    $stmt = $dbh->prepare($sqlr);
                    $pide = $stmt->execute();
                }
    
            }

        } else {
            echo "==========================\n";
            echo "-----> No hay recalls!\n";
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
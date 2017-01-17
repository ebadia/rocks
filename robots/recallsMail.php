<?php

// ejecutar con un solo argumento que es el codigo del centro

require __DIR__ . '/Mandrill/Mandrill.php';
$MANDRILL_APIKEY = 'wnWT_y1LdDRJmPXDeNP0EA';
$mandrill = new Mandrill($MANDRILL_APIKEY);

// variable de entrada de linea de comandos: id del centro y dias de margen
$id = $argv[1];
$margen = $argv[2];

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
    case '1':
        // lleida
        $tel = "973283143";
        break;
    case '2':
        // sabadell
        $tel = "937268107";
        break;
    case '3':
        // murcia
        $tel = "968901202";
        $subcentro = " and Recalls.IdCentro = 3 ";
        break;
    case '4':
        // molina
        $tel = "968641002";
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
echo $sql;

//recupera($id,$sql); 

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
                'email' => 'aortiz@eneresi.com',
                'name' => 'Aurora Ortiz',
                'type' => 'to'
            ),
            array(
                'email' => 'eariza@eneresi.com',
                'name' => 'Enric Ariza',
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
                'email' => 'eariza@eneresi.com',
                'name' => 'Enric Ariza',
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

        // echo "==========================\n";
        // echo "-----> paciente \n";
        // echo "==========================\n\n";
        // echo $destino['Nombre']. " " . $destino['Apellidos'] . "\n";
        // echo $destino['Email'] . "\n";
        // echo $destino['Descripcio'] . "\n";
        // echo "==========================\n\n";
        //print_r($destino);

// **************************************
// solo pacientes 'REOP' , 'REVC'...
        // y si tene email

        if ( ( $destino['Descripcio'] == 'REOP' || $destino['Descripcio'] == 'REVC' ) 
            && $destino['Email'] != ""
            && $destino['Citado'] == 0
            ){

            // primero preparamos los datos personalizados de sexo, nombre,...

            $nom = $destino['Nombre'];

            // els destinataris
            //------------------------

            $tus = array();

            $tus_temp = array();
            $tus_temp['email'] = $destino['Email'] ;
            $tus_temp['name'] = $destino['Nombre'];
            $tus_temp['type'] = 'to';

            array_push( $tus, $tus_temp );
            $destinos = array_merge( $tus, $to );

            // variables personalitzades
            //------------------------
            
            $mergevars = array();

            // posem les variables personalitzades (OJO!!! per cada receptor...)
            foreach ( $destinos as $cadadestino ){
                $aris = array();
                $aris['rcpt'] = $cadadestino['email'];

                $aris['vars'] = array();
                $t = array();
                $t['name'] = 'nom';
                $t['content'] = $nom;                
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

                $template = 'Recalls-'.$destino['Descripcio'].'-'.$id;
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
    }

} catch(PDOException $e) {
    echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
}


?>
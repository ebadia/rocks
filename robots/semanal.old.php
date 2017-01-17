<?php

// ejecutar con un solo argumento que es el codigo del centro
	
    require __DIR__ . '/Mandrill/Mandrill.php';
    $MANDRILL_APIKEY = 'HAFvxoLmhNeqKj5oN3uWqA';

//**********************************

    // definicion de la fecha
    $fecha_gd = date('Ymd');
    $fecha_ql = date('Y-m-d');
    //$fecha = '20150416';
    $id = $argv[1];

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

//**********************************
// F U N C I O N E S
//**********************************

    /*
        recupera los datos de presupuestos del rocks
        $c = clinica que buscas
        $d = fecha desde busqueda
        $d = fecha hasta busqueda
    */

    function feina($c,$d,$h){

        global $dbh;

        $id = $c;
        $desde = $d;
        $hasta = $h;
        
        $sql = "
            select 

            count( import ) as entregado,
            round( sum( import ) ,0) as dentregado,

            round( sum( case when ( estat = 'Aceptado' ) then import else 0 end ) ,0)       as daceptado,
            sum( case when ( estat = 'Aceptado' ) then 1 else 0 end )                       as aceptado,

            round( sum( case when ( estat = 'Seguimiento' ) then import else 0 end ) ,0)    as dseguimiento,
            sum( case when ( estat = 'Seguimiento' ) then 1 else 0 end )                    as seguimiento,

            round( sum( case when ( estat = 'Rechazado' ) then import else 0 end ) ,0)      as drechazado,
            sum( case when ( estat = 'Rechazado' ) then 1 else 0 end )                      as rechazado,

            round( sum( case when ( estat = 'Aceptado' ) then 1 else 0 end ) / count( import ) ,2) * 100 as rexit,
            round( sum( import ) / count( import ) ,0) as TMP,
            round( sum( case when ( estat = 'Aceptado' ) then import else 0 end )/ sum( case when ( estat = 'Aceptado' ) then 1 else 0 end ) ,0)           as TMA


            from pressupostos

            where centre_id = ".$id." and pressupostos.NumPac > 0 
            and (entrega >= '".$desde."' and entrega <= '".$hasta."')

            order by entrega"
        ;

        try {
            // recuperacion
            // $stmt = $dbh->query('SET CHARACTER SET utf8');
            $stmt = $dbh->query($sql);
            $hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
            //if (count($hisoc) != 0){
                return $hisoc;
            //}
            $dbh = null;
        } catch(PDOException $e) {
            return 'error';
        }
    }

     /*
        recupera los pacientes con presupuestos en seguimiento del rocks
        $c = clinica que buscas
        $d = fecha desde busqueda
        $d = fecha hasta busqueda
    */

   function listaTipo($c,$d,$h){

        global $dbh;

        $id = $c;
        $desde = $d;
        $hasta = $h;

            $sql = "
                SELECT pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom, 
                    (select recalls.notas from recalls where pressupostos.NumPac = recalls.NumPac order by data desc limit 1) as nota 
                FROM pressupostos 

                LEFT JOIN recalls ON pressupostos.NumPac = recalls.NumPac 
                LEFT JOIN tipotto ON pressupostos.motiu_id = tipotto.id
                LEFT JOIN centres ON pressupostos.centre_id = centres.id

                WHERE pressupostos.centre_id = ".$id." AND pressupostos.NumPac > 0 AND pressupostos.estat = 'Seguimiento' 
                and ( pressupostos.entrega >= '".$desde."' and pressupostos.entrega <= '".$hasta."')
                 
                GROUP BY pressupostos.id 
                ORDER BY pressupostos.entrega DESC
            ";

        try {
            // recuperacion
            $stmt = $dbh->query('SET CHARACTER SET utf8');
            $stmt = $dbh->query($sql);
            //$hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
            $hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
            //if (count($hisoc) != 0){
                return $hisoc;
            //}
            $dbh = null;
        } catch(PDOException $e) {
            return 'error';
        }

    }

    /*
        recupera los datos de facturacion de gesdent
        $c = clinica que buscas
        $d = fecha desde busqueda
        $d = fecha hasta busqueda
    */

    function facturacionFechas($c,$d,$h){

        global $db;
        global $clinicas;
        
        $id = $c;
        $desde = $d;
        $hasta = $h;

        $sql = "
            SELECT 
                sum( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) as pago    
            FROM TtosMed
            WHERE
                TtosMed.StaTto = 5 and not TtosMed.importe is null
                AND TtosMed.FecIni >= '".$desde."' AND TtosMed.FecIni <= '".$hasta."'
            ;";

            try {

                mssql_select_db($clinicas[$id][3], $db);
                $query = mssql_query($sql);
                $res = array();

                while ($row = mssql_fetch_object($query)) {
                    $res["data"][] = $row;
                }
                $res["error"] = 0;
                $res["sql"] = $sql;
                $devuelvo['data'] = $res;
                //Flight::json($devuelvo);
                return $res['data'];
                mssql_free_result($query);

            } catch(PDOException $e) {
                return 'error';
            }

    }

//**********************************

    // fechas que necesito
    // ultimos 7 dias
    // mes hasta la fecha
    // ultimos 30 dias
    // año hasta la fecha

    // definicion del sql de recuperacion de feina semanal y mensual, ql
    // definicion del sql de recuperacion listado de seguimiento, ql
    // definicion del sql de recuperacion de facturacion, gd

//**********************************
    //echo date( 'Y-m-d', mktime(0, 0, 0, date("m") , date("d")-7, date("Y")) );

    /*
        recupera todos los datos para usar en el template de Mandrill
    */

    $feina07 = feina($id,date( 'Y-m-d', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ),$fecha_ql);
    $feina30 = feina($id, date( 'Y-m-d', mktime(0, 0, 0, date("m")-1 , date("d"),   date("Y")) ),$fecha_ql);
    $sigueme = listaTipo($id,date( 'Y-m-d', mktime(0, 0, 0, date("m")-1 , date("d"),   date("Y")) ),$fecha_ql);

    $factu07 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ),$fecha_gd);
    $factu30 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   '01', date("Y")) ),$fecha_gd);
    $factu99 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, '01' ,   '01', date("Y")) ),$fecha_gd);

    // para pruebas ********************
    // print_r($feina30);
    // echo $factu07[0]->pago;
    // echo $factu30[0]->pago;
    // echo $factu99[0]->pago;
    // para pruebas ********************

// aqui tenemos el template del correo electronico generado en html
// reemplazamos los placeholders por los valores recuperados de las BBDD

$evol = file_get_contents( __DIR__ . '/eneresi.rocks.evol/content.html');

$evol = str_replace("{{real.ddia}}", date( 'd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.dmes}}", date( 'm', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.dany}}", date( 'Y', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.hdia}}", date( 'd', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);
$evol = str_replace("{{real.hmes}}", date( 'm', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);
$evol = str_replace("{{real.hany}}", date( 'Y', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);


$evol = str_replace("{{feina.dentregado}}", $feina07[0]->dentregado, $evol);
$evol = str_replace("{{feina.entregado}}", $feina07[0]->entregado, $evol);
$evol = str_replace("{{feina.daceptado}}", $feina07[0]->daceptado, $evol);
$evol = str_replace("{{feina.aceptado}}", $feina07[0]->aceptado, $evol);
$evol = str_replace("{{feina.rexit}}", $feina07[0]->rexit, $evol);
$evol = str_replace("{{feina.dseguimiento}}", $feina07[0]->dseguimiento, $evol);
$evol = str_replace("{{feina.seguimiento}}", $feina07[0]->seguimiento, $evol);

$evol = str_replace("{{mfeina.dentregado}}", $feina30[0]->dentregado, $evol);
$evol = str_replace("{{mfeina.entregado}}", $feina30[0]->entregado, $evol);
$evol = str_replace("{{mfeina.daceptado}}", $feina30[0]->daceptado, $evol);
$evol = str_replace("{{mfeina.aceptado}}", $feina30[0]->aceptado, $evol);
$evol = str_replace("{{mfeina.rexit}}", $feina30[0]->rexit, $evol);
$evol = str_replace("{{mfeina.dseguimiento}}", $feina30[0]->dseguimiento, $evol);
$evol = str_replace("{{mfeina.seguimiento}}", $feina30[0]->seguimiento, $evol);

$evol = str_replace("{{factweek}}", $factu07[0]->pago, $evol);
$evol = str_replace("{{factmes}}", $factu30[0]->pago, $evol);
$evol = str_replace("{{factany}}", $factu99[0]->pago, $evol);

//
// lineas de los de seguimiento
$tabla = '';
//
//print_r($sigueme);
foreach ($sigueme as $key => $value) {
    $linea = '
    <tr>
        <td><span style="font-size: 11px; line-height: 8px; font-family: Arial; ">{{ppto.entrega}}</span></td>
        <td>
            <span style="font-size: 11px; line-height: 8px; font-family: Arial; font-weight: bold"><strong>{{ppto.pacient}}</strong></span>
        </td>
        <td><span style="font-size: 11px; line-height: 8px; font-family: Arial; ">{{ppto.tto}}</span></td>
        <td><span style="font-size: 11px; line-height: 8px; font-family: Arial; ">{{ppto.import}}</span></td>
        <td><span style="font-size: 11px; line-height: 8px; font-family: Arial; ">{{ppto.estat}}</span></td>
    </tr>
    <tr>
        <td colspan="5">
            <div style="font-size: 11px; line-height: 10px; font-family: Arial; color: #2dc0cc; ">{{ppto.notas}}</div>
            <div style="font-size: 11px; line-height: 10px; font-family: Arial; color: #2dc0cc; ">{{ppto.nota}}</div>
            <div style="font-size: 11px; line-height: 10px; font-family: Arial; color: #2dc0cc; ">&nbsp;</div>
            <hr style="border: 0; height: 1px; background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); background-image:    -moz-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); background-image:     -ms-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); background-image:      -o-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
"/>
        </td>
    </tr>
    ';
   //print_r( $value );
    $linea = str_replace("{{ppto.entrega}}", $value->entrega, $linea);
    $linea = str_replace("{{ppto.pacient}}", $value->pacient, $linea);
    $linea = str_replace("{{ppto.tto}}", $value->tto, $linea);
    $linea = str_replace("{{ppto.import}}", $value->import, $linea);
    $linea = str_replace("{{ppto.estat}}", $value->estat, $linea);
    $linea = str_replace("{{ppto.notas}}", $value->notas, $linea);
    $linea = str_replace("{{ppto.nota}}", $value->nota, $linea);

    $tabla .= $linea;
}

$evol = str_replace("{{tabla}}", $tabla, $evol);

// lo guarda en un archivo por si acaso lo queremos ver en la web
file_put_contents( __DIR__ . '/evol/evol_'.$fecha_gd.'.html', $evol);

// envia el correo
        // **************************************
        // AQUI EMPIEZA EL ESPECTACULO DE MANDRILL
        // **************************************

        try {

            $mandrill = new Mandrill($MANDRILL_APIKEY);
            $muser = new Mandrill_Users($mandrill);

            //print_r( $muser->info() );

            $message = array(

                'subject' => 'EneresiRocks. Cuadro de mandos semanal',
                'from_email' => 'ebadia@eneresi.com',
                'from_name' => 'EneresiRocks',
                'html' => $evol,

                'to' => array(
                    array(
                        'email' => 'enric.badia@gmail.com',
                        'name' => 'Enric Badia at Gmail',
                        'type' => 'to'
                    ),
                    array(
                        'email' => 'jtorres@eneresi.com',
                        'name' => 'Jordi Torres',
                        'type' => 'to'
                    ),
                    array(
                        'email' => 'eariza@eneresi.com',
                        'name' => 'Enric Ariza',
                        'type' => 'to'
                    ),
                    array(
                        'email' => 'jpatau@eneresi.com',
                        'name' => 'Jordi Patau',
                        'type' => 'to'
                    ),
                    array(
                        'email' => 'aortiz@eneresi.com',
                        'name' => 'Aurora Ortiz',
                        'type' => 'to'
                    )
                )
                
            );
            $async = false;
            
            // ***** envio del mensaje *******
            //$result = $mandrill->messages->send($message, $async);
            print_r($result);
            // ***** envio del mensaje *******


        } catch(Mandrill_Error $e) {
            // Mandrill errors are thrown as exceptions
            echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
            // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
            throw $e;
        }

        // **************************************
        // AQUI ACABA EL ESPECTACULO DE MANDRILL
        // **************************************

?>
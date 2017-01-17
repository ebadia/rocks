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
        SELECT

        sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) then 1 else 0 end ) as entregado,
        round( sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as dentregado,

        sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then 1 else 0 end ) as aceptado,
        round( sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as daceptado,

        sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then 1 else 0 end ) as rechazado,
        round( sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as drechazado


        FROM presutto
        LEFT JOIN presu on presu.idpac=presutto.idpac and presu.numpre=presutto.numpre
        "
        ;

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

    function feinaPresus($c,$d,$h){

        global $dbh;

        $id = $c;
        $desde = $d;
        $hasta = $h;

        $sql = "
        select

        count(*),

        (SELECT count(*) FROM presu WHERE fecpresup >= '".$desde."' and fecpresup <= '".$hasta."') as pentregado ,
        (SELECT count(*) FROM presu WHERE fecacepta >= '".$desde."' and fecacepta <= '".$hasta."') as paceptado,
        (SELECT count(*) FROM presu WHERE fecrechaz >= '".$desde."' and fecrechaz <= '".$hasta."') as prechazado

        from Presu
        ";

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

    function objetivosFechas($c,$d){

        global $dbh;
        global $clinicas;

        $id = $c;
        $ano = $d;

        $sql = "SELECT fact FROM objectius WHERE centro_id = ".$id." AND any = ".$ano;

        try {
            $stmt = $dbh->query('SET CHARACTER SET utf8');
            $stmt = $dbh->query($sql);
            //$hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
            // $hisoc = $stmt->fetchColumn(0);
            while ($row = $stmt->fetch(PDO::FETCH_NUM, PDO::FETCH_ORI_NEXT)) {
                $devuelvo[] = $row[0];
            }
            $db = null;
            return $devuelvo;
        } catch(PDOException $e) {
            echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
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

    $feina07 = feina($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ),$fecha_gd);
    $feina30 = feina($id, date( 'Ymd', mktime(0, 0, 0, date("m")-1 , date("d"),   date("Y")) ),$fecha_gd);
    // $sigueme = listaTipo($id,date( 'Y-m-d', mktime(0, 0, 0, date("m")-1 , date("d"),   date("Y")) ),$fecha_ql);
    $feinaPresus07 = feinaPresus($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ),$fecha_gd);
    $feinaPresus30 = feinaPresus($id, date( 'Ymd', mktime(0, 0, 0, date("m")-1 , date("d"),   date("Y")) ),$fecha_gd);

    $factu07 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ),$fecha_gd);
    $factu30 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, date("m") ,   '01', date("Y")) ),$fecha_gd);
    $factu99 = facturacionFechas($id,date( 'Ymd', mktime(0, 0, 0, '01' ,   '01', date("Y")) ),$fecha_gd);

    // para pruebas ********************
    // print_r($feinaPresus07);
    // print_r($feinaPresus30);
    // print_r($factu07);
    // print_r($factu30);
    // print_r($factu99);
    // para pruebas ********************

// aqui tenemos el template del correo electronico generado en html
// reemplazamos los placeholders por los valores recuperados de las BBDD

$evol = file_get_contents( __DIR__ . '/eneresi.rocks.evol/content.php');

$evol = str_replace("{{id}}", $id , $evol);

$evol = str_replace("{{real.ddia}}", date( 'd', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.dmes}}", date( 'm', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.dany}}", date( 'Y', mktime(0, 0, 0, date("m") ,   date("d")-7, date("Y")) ) , $evol);
$evol = str_replace("{{real.hdia}}", date( 'd', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);
$evol = str_replace("{{real.hmes}}", date( 'm', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);
$evol = str_replace("{{real.hany}}", date( 'Y', mktime(0, 0, 0, date("m") ,   date("d"), date("Y")) ) , $evol);


$evol = str_replace("{{feina.dentregado}}", $feina07[0]->dentregado, $evol);
$evol = str_replace("{{feina.entregado}}", $feina07[0]->entregado, $evol);
$evol = str_replace("{{pfeina.pentregado}}", $feinaPresus07[0]->pentregado, $evol);

$evol = str_replace("{{feina.daceptado}}", $feina07[0]->daceptado, $evol);
$evol = str_replace("{{feina.aceptado}}", $feina07[0]->aceptado, $evol);
$evol = str_replace("{{pfeina.paceptado}}", $feinaPresus07[0]->paceptado, $evol);

$evol = str_replace("{{feina.drechazado}}", $feina07[0]->drechazado, $evol);
$evol = str_replace("{{feina.rechazado}}", $feina07[0]->rechazado, $evol);
$evol = str_replace("{{pfeina.prechazado}}", $feinaPresus07[0]->prechazado, $evol);

$evol = str_replace("{{mfeina.dentregado}}", $feina30[0]->dentregado, $evol);
$evol = str_replace("{{mfeina.entregado}}", $feina30[0]->entregado, $evol);
$evol = str_replace("{{pmfeina.pentregado}}", $feinaPresus30[0]->pentregado, $evol);

$evol = str_replace("{{mfeina.daceptado}}", $feina30[0]->daceptado, $evol);
$evol = str_replace("{{mfeina.aceptado}}", $feina30[0]->aceptado, $evol);
$evol = str_replace("{{pmfeina.paceptado}}", $feinaPresus30[0]->paceptado, $evol);

$evol = str_replace("{{mfeina.drechazado}}", $feina30[0]->drechazado, $evol);
$evol = str_replace("{{mfeina.rechazado}}", $feina30[0]->rechazado, $evol);
$evol = str_replace("{{pmfeina.prechazado}}", $feinaPresus30[0]->prechazado, $evol);

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

// $evol = str_replace("{{tabla}}", $tabla, $evol);

// lo guarda en un archivo por si acaso lo queremos ver en la web
file_put_contents( __DIR__ . '/evol/evol_'.$fecha_gd.'_'.$id.'.html', $evol);

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
                        'email' => 'aortiz@eneresi.com',
                        'name' => 'Aurora Ortiz',
                        'type' => 'to'
                    )
                )

            );            $async = false;

            // ***** envio del mensaje *******
            $result = $mandrill->messages->send($message, $async);
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

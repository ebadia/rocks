<?php
header('Content-type: text/plain; charset=utf-8');
header('Content-Transfer-Encoding: utf-8' );
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 *
 * Test:
 * curl -i -X POST -H 'Content-Type: application/json' -d '{"login": "ebadia@eneresi.com", "password": "eneresi"}' http://localhost:8888/eneresi/bend/getUser
 * curl -i -X GET  http://localhost:8888/eneresi/bend/getUser
 */
//require 'Slim/Slim.php';
require 'flight/Flight.php';
require 'Postmark/Autoloader.php';
require 'Clockwork/class-Clockwork.php';

//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Headers: content-Type,x-requested-with');
//header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT', 'OPTIONS');

cors();

Flight::route('GET /@name/@id', function($name, $id){
    echo "hello, $name ($id)!";
});

//********************************* MAIL
Flight::route('POST /sendMail', 'sendMail');

//********************************* MAIL
Flight::route('POST /sendSMS', 'sendSMS');


//********************************* STATS
Flight::route('GET /facturacion', 'facturacion');
Flight::route('GET /pacsunicos', 'pacsunicos');
Flight::route('GET /primeras', 'primeras');
Flight::route('GET /primerasedad', 'primerasedad');
Flight::route('GET /totalcitas', 'totalcitas');
Flight::route('GET /citasedad', 'citasedad');
Flight::route('GET /ticket', 'ticket');

// TESTS
//getUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"login": "ebadia@eneresi.com", "password": "eneresi"}' http://localhost:8888/eneresi/bend/getUser
//addUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"nom": "nou", "login": "nou@eneresi.com", "password": "eneresi", "centreid": 1, "privilegisid": 0}' http://localhost:8888/eneresi/bend/addUser
//updateUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"id": 3, "nom": "canviat", login": "ebadia@eneresi.com", "password": "cambiat"}' http://localhost:8888/eneresi/bend/updateUser
//deleteUser: curl -i -X GET  http://localhost:8888/eneresi/bend/deleteUser?id=4


//getPptos: curl -i -X GET  http://localhost:8888/eneresi/bend/getPptos
//addPpto: curl -i -X POST -H 'Content-Type: application/json' -d '{  "pacient":  "enric", "motiu": "ortodencia", "import": 2000 }' http://localhost:8888/eneresi/bend/addPpto


//*********************************

Flight::start();

//*********************************
function retrieve($sql){


    try {
        $db = getConnection();
        mssql_select_db('GELITE', $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            $temp['mes']  = $row[0];
            $temp['2008'] = $row[1];
            $temp['2009'] = $row[2];
            $temp['2010'] = $row[3];
            $temp['2011'] = $row[4];
            $temp['2012'] = $row[5];
            $temp['2013'] = $row[6];
            $temp['2014'] = $row[7];
            $res[] = $temp;
        }
        $devuelvo['data'] = $res;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function retrieve_ticket($sql){


    try {
        $db = getConnection();
        mssql_select_db('GELITE', $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            $temp['ano']  = $row[0];
            $temp['ticket'] = $row[1];
            $res[] = $temp;
        }
        $devuelvo['data'] = $res;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}


//*********************************
function retrieve_edad($sql){


    try {
        $db = getConnection();
        mssql_select_db('GELITE', $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            $temp['ano']     = $row[0];
            $temp['E_00_08'] = $row[1];
            $temp['E_09_12'] = $row[2];
            $temp['E_13_18'] = $row[3];
            $temp['E_19_25'] = $row[4];
            $temp['E_26_35'] = $row[5];
            $temp['E_36_45'] = $row[6];
            $temp['E_46_55'] = $row[7];
            $temp['E_56_65'] = $row[8];
            $temp['E_66_99'] = $row[9];
            $res[] = $temp;
        }
        $devuelvo['data'] = $res;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}


function ejecuta($sql){

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $pide = $stmt->execute();
        if ($pide != 0){
            $res["error"] = 0;
            $res["data"] = $sql;
            Flight::json($res);
        } else {
            // ya existe
            echo '{"error": 1, "text" : "Error." }';
        }
        $db = null;
    } catch(PDOException $e) {
        echo '{"error": 2 , "text":"'. $e->getMessage() .', "sql":"'. $sql .'"}';
    }

}

function depost(){
    $request = Flight::request();
    print_r($request);
    $datos = $request->body;
    //echo $datos;
    return $objeto = json_decode($datos);
}

function depostMail(){
    $request = Flight::request();
    //print_r($request);
    $datos = $request->body;
    //echo $datos;
    //return  $datos;
    $objeto = json_decode($datos);
    print_r($objeto);
}

function depostSMS(){
    $request = Flight::request();
    //print_r($request);
    $datos = $request->body;
    //return  $datos;
    return $objeto = json_decode($datos, true);
}

function deget(){
    $request = Flight::request();
    //print_r($request);
    return  $request->query;
}
//*********************************
function cors() {

    //header("Access-Control-Allow-Origin: '*'");

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    //echo "You have CORS!";
}

//**********************************
function getConnection() {
    $dbhost="81.184.4.82";
    $dbport="1433";
    $dbuser="SERVER\\ebadia";
    $dbpass="eneresi";
    $dbname="GELITE";
    $dbh = mssql_connect($dbhost.":".$dbport, $dbuser, $dbpass);
    return $dbh;
}
//**********************************
//**********************************
//**********************************


//**********************************
function sendMail() {
    
    $objeto = depost();
    //$login = $objeto->email;
    $postmarkApiKey = "ed073a8d-3afd-4de4-b7f5-a92a2a476040";

    Postmark\Mail::compose($postmarkApiKey)
    ->from('ebadia@eneresi.com', 'Enèresi')
    ->addTo($objeto->destino, 'EneresiRocks')
    ->subject('Mensaje de EneresiRocks')
    ->messageHtml($objeto->texto)
    ->send();

}
//**********************************

//**********************************
function sendSMS() {
    
    $message = depostSMS();
    //$login = $objeto->email;
    $API_KEY = "c1d670495e2c958f436e11133d09014dfeae2c65";

    $clockwork = new Clockwork( $API_KEY );
    // $message = array( 'to' => '441234567891', 'message' => 'This is a test!' );
    //print_r($message);
    $result = $clockwork->send( $message );

            $res["error"] = 0;
            $res["data"] = $result;
            Flight::json($res);
}
//**********************************

//**********************************
function facturacion() {
    
    // $objeto = depost();
    
    $sql ="
        /*drop table #unica;*/
        SELECT 
            YEAR(PagoCli.FecPago) as ano, 
            MONTH(PagoCli.FecPago) as mes, 
            PagoCli.Pagado as pago
        INTO #unica
        FROM PagoCli;

        select mes, 
        sum( case when ano='2008' then pago else 0 end) as a2008,
        sum( case when ano='2009' then pago else 0 end) as a2009,
        sum( case when ano='2010' then pago else 0 end) as a2010,
        sum( case when ano='2011' then pago else 0 end) as a2011,
        sum( case when ano='2012' then pago else 0 end) as a2012,
        sum( case when ano='2013' then pago else 0 end) as a2013,
        sum( case when ano='2014' then pago else 0 end) as a2014
        from #unica 
        group by mes
        order by mes
        ;
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function pacsunicos() {
    
    // $objeto = depost();
    
    $sql ="
        /*drop table #unica;*/
        SELECT 
            Pacientes.Apellidos, 
            YEAR(DCitas.FecAlta) as ano, 
            MONTH(DCitas.FecAlta) as mes, 
            count(DCitas.IdPac) as num
        INTO #unica
        FROM Pacientes, DCitas
        WHERE (Pacientes.IdPac = DCitas.IdPac)
        GROUP BY YEAR(DCitas.FecAlta), MONTH(DCitas.FecAlta), Pacientes.Apellidos
        ORDER BY YEAR(DCitas.FecAlta) ASC, MONTH(DCitas.FecAlta) ASC;

        select mes, 
        sum( case when ano='2008' then 1 else 0 end) as a2008,
        sum( case when ano='2009' then 1 else 0 end) as a2009,
        sum( case when ano='2010' then 1 else 0 end) as a2010,
        sum( case when ano='2011' then 1 else 0 end) as a2011,
        sum( case when ano='2012' then 1 else 0 end) as a2012,
        sum( case when ano='2013' then 1 else 0 end) as a2013,
        sum( case when ano='2014' then 1 else 0 end) as a2014
        from #unica 
        group by mes
        order by mes
        ;
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function primeras() {
    
    // $objeto = depost();
    
    $sql ="
        /*drop table #unica;*/
        SELECT 
            TtosMed.IdPac, 
            Pacientes.FecNacim, 
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano, 
            MONTH(TtosMed.FecIni) as mes
            /*count(TtosMed.IdPac) as num*/
        INTO #unica
        
        /*
        FROM TtosMed, Pacientes
        WHERE TtosMed.IdTto in (2,3 ,153,154,167,168,174,183,192,200,210,221,342,355,253,264,275,287,303,371,532,533,536,857,858,859,861,862,1030)
        AND
        (TtosMed.IdPac = Pacientes.IdPac)
        AND YEAR(TtosMed.FecIni) > 2007
        */

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE TTos.Codigo in ( 'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO' )
        AND YEAR(TtosMed.FecIni) > 2007

        /*GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni), TtosMed.IdPac*/
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;



        select mes, 
        sum( case when ano= 2008 then 1 else 0 end) as a2008,
        sum( case when ano= 2009 then 1 else 0 end) as a2009,
        sum( case when ano= 2010 then 1 else 0 end) as a2010,
        sum( case when ano= 2011 then 1 else 0 end) as a2011,
        sum( case when ano= 2012 then 1 else 0 end) as a2012,
        sum( case when ano= 2013 then 1 else 0 end) as a2013,
        sum( case when ano= 2014 then 1 else 0 end) as a2014
        from #unica 
        group by mes
        order by mes
        ;    ";
    retrieve($sql);
    
}
//**********************************


//**********************************
function primerasedad() {
    
    // $objeto = depost();
    
    $sql ="
        /*drop table #unica;*/
        SELECT 
            TtosMed.IdPac, 
            Pacientes.FecNacim, 
            DATEDIFF(hour,Pacientes.FecNacim,TtosMed.FecIni)/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano, 
            MONTH(TtosMed.FecIni) as mes
            /*count(TtosMed.IdPac) as num*/
        INTO #unica
        FROM TtosMed, Pacientes
        WHERE TtosMed.IdTto in (2,3 ,153,154,167,168,174,183,192,200,210,221,342,355,253,264,275,287,303,371,532,533,536,857,858,859,861,862,1030)
        AND
        (TtosMed.IdPac = Pacientes.IdPac) 
        AND YEAR(TtosMed.FecIni) > 2007
        /*GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni), TtosMed.IdPac*/
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        /*drop table #final;*/

        select ano,mes,
        sum( case when (edad is null          ) then 1 else 0 end) as SINEDAD,
        sum( case when (edad>= 0 and edad<= 8 ) then 1 else 0 end) as E_00_08,
        sum( case when (edad>= 9 and edad<=12 ) then 1 else 0 end) as E_09_12,
        sum( case when (edad>=13 and edad<=18 ) then 1 else 0 end) as E_13_18,
        sum( case when (edad>=19 and edad<=25 ) then 1 else 0 end) as E_19_25,
        sum( case when (edad>=26 and edad<=35 ) then 1 else 0 end) as E_26_35,
        sum( case when (edad>=36 and edad<=45 ) then 1 else 0 end) as E_36_45,
        sum( case when (edad>=46 and edad<=55 ) then 1 else 0 end) as E_46_55,
        sum( case when (edad>=56 and edad<=65 ) then 1 else 0 end) as E_56_65,
        sum( case when (edad>=66              ) then 1 else 0 end) as E_66_99
        into #final
        from #unica 
        group by ano,mes
        order by ano,mes


        select ano, 
        SUM(E_00_08) as E_00_08,
        SUM(E_09_12) as E_09_12,
        SUM(E_13_18) as E_13_18,
        SUM(E_19_25) as E_19_25,
        SUM(E_26_35) as E_26_35,
        SUM(E_36_45) as E_36_45,
        SUM(E_46_55) as E_46_55,
        SUM(E_56_65) as E_56_65,
        SUM(E_66_99) as E_66_99
        from #final group by ano
        ;
    ";
    retrieve_edad($sql);
    
}
//**********************************

//**********************************
function citasedad() {
    
    // $objeto = depost();
    
    $sql ="
    SELECT 
        TtosMed.IdPac, 
        Pacientes.FecNacim, 
        DATEDIFF(hour,Pacientes.FecNacim,TtosMed.FecIni)/8766 AS edad,
        YEAR(TtosMed.FecIni) as ano, 
        MONTH(TtosMed.FecIni) as mes
        /*count(TtosMed.IdPac) as num*/
    INTO #unica
    FROM TtosMed, Pacientes
    WHERE 
    (TtosMed.IdPac = Pacientes.IdPac) 
    AND YEAR(TtosMed.FecIni) > 2007
    /*GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni), TtosMed.IdPac*/
    ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

    /*drop table #final;*/

    select ano,mes,
    sum( case when (edad is null          ) then 1 else 0 end) as SINEDAD,
    sum( case when (edad>= 0 and edad<= 8 ) then 1 else 0 end) as E_00_08,
    sum( case when (edad>= 9 and edad<=12 ) then 1 else 0 end) as E_09_12,
    sum( case when (edad>=13 and edad<=18 ) then 1 else 0 end) as E_13_18,
    sum( case when (edad>=19 and edad<=25 ) then 1 else 0 end) as E_19_25,
    sum( case when (edad>=26 and edad<=35 ) then 1 else 0 end) as E_26_35,
    sum( case when (edad>=36 and edad<=45 ) then 1 else 0 end) as E_36_45,
    sum( case when (edad>=46 and edad<=55 ) then 1 else 0 end) as E_46_55,
    sum( case when (edad>=56 and edad<=65 ) then 1 else 0 end) as E_56_65,
    sum( case when (edad>=66              ) then 1 else 0 end) as E_66_99
    into #final
    from #unica 
    group by ano,mes
    order by ano,mes

    select ano, 
    SUM(E_00_08) as E_00_08,
    SUM(E_09_12) as E_09_12,
    SUM(E_13_18) as E_13_18,
    SUM(E_19_25) as E_19_25,
    SUM(E_26_35) as E_26_35,
    SUM(E_36_45) as E_36_45,
    SUM(E_46_55) as E_46_55,
    SUM(E_56_65) as E_56_65,
    SUM(E_66_99) as E_66_99
    from #final group by ano
    ;
    ";
    retrieve_edad($sql);
    
}
//**********************************

//**********************************
function totalcitas() {
    
    // $objeto = depost();
    
    $sql ="
        /*drop table #unica;*/
        SELECT 
            TtosMed.IdPac, 
            YEAR(TtosMed.FecIni) as ano, 
            MONTH(TtosMed.FecIni) as mes, 
            count(TtosMed.IdPac) as num
        INTO #unica
        FROM TtosMed
        GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni), TtosMed.IdPac
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes, 
        sum( case when ano='2008' then 1 else 0 end) as a2008,
        sum( case when ano='2009' then 1 else 0 end) as a2009,
        sum( case when ano='2010' then 1 else 0 end) as a2010,
        sum( case when ano='2011' then 1 else 0 end) as a2011,
        sum( case when ano='2012' then 1 else 0 end) as a2012,
        sum( case when ano='2013' then 1 else 0 end) as a2013,
        sum( case when ano='2014' then 1 else 0 end) as a2014
        from #unica 
        group by mes
        order by mes
        ;
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function ticket() {
    
    // $objeto = depost();
    
    $sql = "
         SELECT 
            YEAR(PagoCli.FecPago) as ano, 
            sum(PagoCli.Pagado) as pago
         INTO #unica2
         FROM PagoCli
         group by PagoCli.FecPago
         order by PagoCli.FecPago;

         SELECT 
            YEAR(FecIni) as ano, 
            count(IdPac) as num
         INTO #unica
         FROM TtosMed
         GROUP BY YEAR(FecIni), IdPac
         ORDER BY YEAR(FecIni) ASC;

         select ano, count(*) as num into #final from #unica
         GROUP BY ano
         ORDER BY ano asc;

         select #unica2.ano, ROUND(sum(pago)/num,0) as ticket
         from #final, #unica2 
         where #final.ano = #unica2.ano and #unica2.ano>2007
         group by #unica2.ano, num
         order by #unica2.ano;
    ";

    retrieve_ticket($sql);
    
}
//**********************************


?>

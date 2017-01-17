<?php

// control del origen
# First check whether the Origin header exists

$send_header  = 'Access-Control-Allow-Origin: http://eneresi.local';

if ( isset($_SERVER['HTTP_ORIGIN']  ) ) {
    //$send_header  = 'Access-Control-Allow-Origin: http://eneresi.local';

    if ( $_SERVER['HTTP_ORIGIN'] == 'http://www.eneresi.rocks' )
        $send_header  = 'Access-Control-Allow-Origin: http://www.eneresi.rocks';
    if ( $_SERVER['HTTP_ORIGIN'] == 'http://eneresi.rocks' )
        $send_header  = 'Access-Control-Allow-Origin: http://eneresi.rocks';
    if ( $_SERVER['HTTP_ORIGIN'] == 'http://eneresi.local' )
        $send_header  = 'Access-Control-Allow-Origin: http://eneresi.local';
}

//header('Access-Control-Allow-Origin: http://'.$filtered_url );  //I have also tried the * wildcard and get the same response
header($send_header);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');

header('Content-type: text/plain; charset=utf-8');
header('Content-Transfer-Encoding: utf-8' );

ini_set('mssql.charset', 'UTF-8');
date_default_timezone_set('Europe/Berlin');

require 'flight/Flight.php';
require 'Postmark/Autoloader.php';
require 'Clockwork/class-Clockwork.php';

require '../robots/textmagic/TextMagicAPI.php';
// require '../myip.php';

//*********************************
require '../conn-clinicas.php';
//*********************************
function getConnection($id) {
    return $dbh = getConnectionGesdent($id);
}
//*********************************


$externalIp = get_client_ip();

// +++++ intenta asegurar el API ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// if ( !array_key_exists("apikey",$_GET ) || !array_key_exists("apikey",$_POST )){

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // $request = Flight::request();
    // $datos = $request->body;
    $objeto = json_decode(Flight::request()->body);
}

if (
    ($_SERVER['REQUEST_METHOD'] == 'POST' && $objeto->apikey == "" )
    ||
    ($_SERVER['REQUEST_METHOD'] == 'GET' && !isset($_GET['apikey']) )
){
    exit("No existo");
} else {
    if (
        ( $_SERVER['REQUEST_METHOD'] == 'GET' && $_GET['apikey'] != 'HAFvxoLmhNeqKj5oN3uWqA' )
        ||
        ($_SERVER['REQUEST_METHOD'] == 'POST' && $objeto->apikey != "HAFvxoLmhNeqKj5oN3uWqA" )
    )
        exit("Clave incorrecta");
}
// +++++ intenta asegurar el API ++++++++++++++++++++++++++++++++++++++++++++++++++++++++




Flight::route('GET /@name/@id', function($name, $id){
    echo "hello, $name ($id)!";
});

//********************************* MAIL
Flight::route('POST /sendMail', 'sendMail');

//********************************* MAIL
Flight::route('POST /sendSMS', 'sendSMS');
Flight::route('POST /sendSMSCT', 'sendSMSCT');

Flight::route('GET /cumples', 'cumples');


//********************************* STATS
Flight::route('GET /limpiala', 'limpiala');

Flight::route('GET /facturacion', 'facturacion');
Flight::route('GET /facturasEmitidas', 'facturasEmitidas');
Flight::route('GET /facturacionFechas', 'facturacionFechas');
Flight::route('GET /facturacionDelMes', 'facturacionDelMes');
Flight::route('GET /users', 'users');
Flight::route('GET /especialidades', 'especialidades');
Flight::route('GET /especialidadesReport', 'especialidadesReport');
Flight::route('GET /pacsunicos', 'pacsunicos');
Flight::route('GET /pacsunicosanual', 'pacsunicosanual');
Flight::route('GET /totalcitas', 'totalcitas');
Flight::route('GET /citasedad', 'citasedad');
Flight::route('GET /ticket', 'ticket');
Flight::route('GET /tratamientos', 'tratamientos');
Flight::route('GET /tiempostratamientos', 'tiempostratamientos');
Flight::route('GET /mediastiempostratamientos', 'mediastiempostratamientos');
Flight::route('GET /deuda', 'deuda');
Flight::route('GET /deudaAnterior', 'deudaAnterior');
Flight::route('GET /pagos', 'pagos');
Flight::route('GET /getUnicosAnuales', 'getUnicosAnuales');


Flight::route('GET /visitas', 'visitas');
Flight::route('GET /conservadora', 'conservadora');
Flight::route('GET /implantologia', 'implantologia');
Flight::route('GET /dhp', 'dhp');
Flight::route('GET /rhb', 'rhb');
Flight::route('GET /ortodoncia', 'ortodoncia');
Flight::route('GET /estetica', 'estetica');
Flight::route('GET /periodoncia', 'periodoncia');
Flight::route('GET /cirugia', 'cirugia');
Flight::route('GET /odontopediatria', 'odontopediatria');

Flight::route('GET /mvisitas', 'mvisitas');
Flight::route('GET /mconservadora', 'mconservadora');
Flight::route('GET /mimplantologia', 'mimplantologia');
Flight::route('GET /mdhp', 'mdhp');
Flight::route('GET /mrhb', 'mrhb');
Flight::route('GET /mortodoncia', 'mortodoncia');
Flight::route('GET /mestetica', 'mestetica');
Flight::route('GET /mperiodoncia', 'mperiodoncia');
Flight::route('GET /mcirugia', 'mcirugia');
Flight::route('GET /modontopediatria', 'modontopediatria');
Flight::route('GET /mimplantes', 'mimplantes');
Flight::route('GET /mprotesisobreimplante', 'mprotesisobreimplante');
Flight::route('GET /mprotesisfijayremovible', 'mprotesisfijayremovible');

Flight::route('GET /primeras', 'primeras');
Flight::route('GET /fprimeras', 'fprimeras');

Flight::route('GET /primerascolectivo', 'primerascolectivo');
Flight::route('GET /fprimerascolectivo', 'fprimerascolectivo');

Flight::route('GET /totalprimeras', 'totalprimeras');
Flight::route('GET /ftotalprimeras', 'ftotalprimeras');

Flight::route('GET /primerasedad', 'primerasedad');

Flight::route('GET /primeras18', 'primeras18');
Flight::route('GET /primeras616', 'primeras616');
Flight::route('GET /primeras1465', 'primeras1465');

Flight::route('GET /primerasFecha', 'primerasFecha');

// procedimientos
Flight::route('GET /ImplantesColocados', 'ImplantesColocados');
Flight::route('GET /ImplantesFracasados', 'ImplantesFracasados');
Flight::route('GET /ProtesisSobreImplantes', 'ProtesisSobreImplantes');
Flight::route('GET /ProtesisHibridas', 'ProtesisHibridas');
Flight::route('GET /ProtesisFija', 'ProtesisFija');
Flight::route('GET /ProtesisRemovible', 'ProtesisRemovible');
Flight::route('GET /OrtodonciaFija', 'OrtodonciaFija');
Flight::route('GET /Invisalign', 'Invisalign');
Flight::route('GET /OrtodonciaInterceptiva', 'OrtodonciaInterceptiva');
Flight::route('GET /OrtodonciaFI', 'OrtodonciaFI');
Flight::route('GET /OrtodonciaTotal', 'OrtodonciaTotal');
Flight::route('GET /Carillas', 'Carillas');
Flight::route('GET /CarillaCeramica', 'CarillaCeramica');
Flight::route('GET /CarillaComposite', 'CarillaComposite');
Flight::route('GET /Blanqueamiento', 'Blanqueamiento');
Flight::route('GET /EsteticaFacial', 'EsteticaFacial');
Flight::route('GET /DPH', 'DPH');
Flight::route('GET /DPHColectivos', 'DPHColectivos');
Flight::route('GET /RevisionesConservadora', 'RevisionesConservadora');
Flight::route('GET /RevisionesOdontopediatria', 'RevisionesOdontopediatria');
Flight::route('GET /MantenimientosPeridontales', 'MantenimientosPeridontales');
Flight::route('GET /RevisionesHibrida', 'RevisionesHibrida');

Flight::route('GET /RatioFracasoImplantes', 'RatioFracasoImplantes');
Flight::route('GET /RatioFracasoImplantesAnual', 'RatioFracasoImplantesAnual');

// procedimientos
Flight::route('GET /fImplantesColocados', 'fImplantesColocados');
Flight::route('GET /fImplantesFracasados', 'fImplantesFracasados');
Flight::route('GET /fProtesisSobreImplantes', 'fProtesisSobreImplantes');
Flight::route('GET /fProtesisHibridas', 'fProtesisHibridas');
Flight::route('GET /fProtesisFija', 'fProtesisFija');
Flight::route('GET /fProtesisRemovible', 'fProtesisRemovible');
Flight::route('GET /fOrtodonciaFija', 'fOrtodonciaFija');
Flight::route('GET /fInvisalign', 'fInvisalign');
Flight::route('GET /fOrtodonciaInterceptiva', 'fOrtodonciaInterceptiva');
Flight::route('GET /fOrtodonciaTotal', 'fOrtodonciaTotal');
Flight::route('GET /fCarillas', 'fCarillas');
Flight::route('GET /fCarillaCeramica', 'fCarillaCeramica');
Flight::route('GET /fCarillaComposite', 'fCarillaComposite');
Flight::route('GET /fBlanqueamiento', 'fBlanqueamiento');
Flight::route('GET /fEsteticaFacial', 'fEsteticaFacial');
Flight::route('GET /fDPH', 'fDPH');
Flight::route('GET /fDPHColectivos', 'fDPHColectivos');
Flight::route('GET /fRevisionesConservadora', 'fRevisionesConservadora');
Flight::route('GET /fRevisionesOdontopediatria', 'fRevisionesOdontopediatria');
Flight::route('GET /fMantenimientosPeridontales', 'fMantenimientosPeridontales');
Flight::route('GET /fRevisionesHibrida', 'fRevisionesHibrida');

Flight::route('GET /AprobarImplantesColocados', 'AprobarImplantesColocados');
Flight::route('GET /AprobarOrtodonciaTotal', 'AprobarOrtodonciaTotal');
Flight::route('GET /AprobarProtesisSobreImplantes', 'AprobarProtesisSobreImplantes');
Flight::route('GET /AprobarCarillas', 'AprobarCarillas');
Flight::route('GET /AprobarBlanqueamiento', 'AprobarBlanqueamiento');
Flight::route('GET /AprobarDPH', 'AprobarDPH');
Flight::route('GET /AprobarOrtodonciaFija', 'AprobarOrtodonciaFija');
Flight::route('GET /AprobarInvisalign', 'AprobarInvisalign');
Flight::route('GET /AprobarOrtodonciaInterceptiva', 'AprobarOrtodonciaInterceptiva');
Flight::route('GET /AprobarOrtodonciaFI', 'AprobarOrtodonciaFI');


Flight::route('GET /pptoPorFechas', 'pptoPorFechas');
Flight::route('GET /aceptadoPorFechas', 'aceptadoPorFechas');
Flight::route('GET /realizadoPorFechas', 'realizadoPorFechas');
Flight::route('GET /seguimientoPorFechas', 'seguimientoPorFechas');




//********************************* CONTROLES MENSUALES
Flight::route('GET /getControles', 'getControles');
Flight::route('GET /getControlesTipo', 'getControlesTipo');
Flight::route('GET /getDetalles', 'getDetalles');
Flight::route('GET /getTtosDetalles', 'getTtosDetalles');
Flight::route('GET /getTtosDetallesNumPac', 'getTtosDetallesNumPac');
Flight::route('GET /getLastTtosNumPac', 'getLastTtosNumPac');
Flight::route('GET /getLastTtosNumPac', 'getLastTtosNumPac');
Flight::route('POST /addAnotacionesNumPac', 'addAnotacionesNumPac');
Flight::route('GET /getRecallsActiusGD', 'getRecallsActiusGD');
Flight::route('POST /aceptaRecalldeHoyGD', 'aceptaRecalldeHoyGD');
Flight::route('GET /countRecallsActiusGD', 'countRecallsActiusGD');

Flight::route('GET /getAlertasDetalles', 'getAlertasDetalles');
Flight::route('GET /getPacienteControles', 'getPacienteControles');
Flight::route('GET /getPacienteTodosControles', 'getPacienteTodosControles');
Flight::route('GET /citado', 'citado');
Flight::route('GET /carta', 'carta');
Flight::route('GET /sms', 'sms');
Flight::route('GET /llama1', 'llama1');
Flight::route('GET /llama2', 'llama2');
Flight::route('GET /llama3', 'llama3');
Flight::route('GET /getCartasControles', 'getCartasControles');


//********************************* CITAS
Flight::route('GET /getCitas', 'getCitas');
Flight::route('GET /getCitasSinMovil', 'getCitasSinMovil');
Flight::route('POST /marcaCitaAvisadaSinMovil', 'marcaCitaAvisadaSinMovil');


//********************************* PRESUPUESTOS PACIENTES
Flight::route('GET /getDatosPaciente', 'getDatosPaciente');
Flight::route('GET /getPresupuestosGesdent', 'getPresupuestosGesdent');
Flight::route('GET /getPresupuestosPaciente', 'getPresupuestosPaciente');
Flight::route('GET /getPresupuestosDetallesPaciente', 'getPresupuestosDetallesPaciente');
Flight::route('GET /getPresupuestosAnotacionesPaciente', 'getPresupuestosAnotacionesPaciente');
Flight::route('GET /listaPresupuestosPaciente', 'listaPresupuestosPaciente');

Flight::route('GET /pptosAceptados', 'pptosAceptados');
Flight::route('GET /pptosPresupuestados', 'pptosPresupuestados');
Flight::route('GET /pptosPresupuestadosFechas', 'pptosPresupuestadosFechas');
Flight::route('GET /carteraAceptados', 'carteraAceptados');


//********************************* ESTADISTICAS DE RECALLS
Flight::route('GET /getTotalControles', 'getTotalControles');
Flight::route('GET /feinaGD', 'feinaGD');
Flight::route('GET /feinaPresusGD', 'feinaPresusGD');



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
function recupera($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();

        while ($row = mssql_fetch_object($query)) {
            $res["error"] = 0;
            $res["sql"] = $sql;
            $res["data"][] = $row;
        }
        $devuelvo['data'] = $res;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function cuentame($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();

        $res = mssql_num_rows($query);

        //while ($row = mssql_fetch_object($query)) {
        //    $res["error"] = 0;
        //    $res["data"][] = $row;
        //    $res["data"]["sql"] = $sql;
        //}
        //$devuelvo['data'] = $res;
        //Flight::json($devuelvo);
        return $res;
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function comentarioRecalls($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);

        $row = mssql_fetch_array($query);
        //print_r($row);
        return $row["Comentario"];

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function retrieve($id,$sql){

    global $clinicas;

    $any = date('Y');

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            $temp['mes']  = $row[0];
            $indice = 1;
            for ($i=$any-4;$i<=$any;$i++){
                $temp["$i"] = $row[$indice++];
            }
            $res[] = $temp;
        }
        $devuelvo['data'] = $res;
        $devuelvo['sql'] = $sql;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function retrieveAnual($id,$sql){

    global $clinicas;
    $any = date('Y');

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            for ( $i=$any-4; $i<=$any; $i++ ){
                $index = $i-$any+4;
                $temp[$i] = $row[$index];
            }
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
function retrieveJson($id,$sql){

    global $clinicas;
    $any = date('Y');

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = array();
        while ($row = mssql_fetch_row($query)) {
            $temp = array();
            //$temp['mes']  = $row[0];

            for ( $i=$any-4; $i<=$any; $i++ ){
                $index = $i-$any+4;
                $temp[$i] = $row[$index];
            }
            $res[] = $temp;
        }
        $devuelvo['data'] = $res;
        mssql_free_result($query);

        return $res;

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function solouno($id,$sql,$any){

    global $clinicas;

    //$any = date('Y');
    $res = array();

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        while ($row = mssql_fetch_row($query)) {
            //$temp = array();
            $res['cero'] = $row[0];
            $res['cpositivo'] = $row[1];
            $res['spositivo'] = $row[2];
            $res['cnegativo'] = $row[3];
            $res['snegativo'] = $row[4];
            $res['any'] = $any;
            //$res[] = $temp;
            }
        //$devuelvo['data'] = $res;
        //Flight::json($res);
        return json_encode($res);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

//*********************************
function retrieve_ticket($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

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
function retrieve_edad($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

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


function ejecuta($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
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

function ejecutame($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        $query = mssql_query($sql);
        //$pide = $stmt->execute();
        if ($query != 0){
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

function limpiala(){
    $id = deget()->id;
    limpia($id,"drop table #unica;");
}

function limpia($id,$sql){

    global $clinicas;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);
        $query = mssql_query($sql);
        //mssql_free_result($query);
        //$stmt = $db->prepare($sql);
        //$pide = $stmt->execute();
        //$db = null;
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

    header("Access-Control-Allow-Origin: '*'");

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

//**********************************

//**********************************
function elsql($codigos, $col){

    $scol = "";

    if ($col != "" ){ 
        $scol = "AND TtosMed.IdCol = " . $col;
    }

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then (case when actos <> 0 then actos else 1 end) else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then (case when actos <> 0 then actos else 1 end) else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            TtosMed.Actos as actos
            /*count(TtosMed.IdPac) as num*/
        INTO #unica

        FROM TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE TTos.Codigo in ( ".$codigos." )
        /* and (TtosMed.importe >= 0 or TtosMed.Importe IS NULL)
        and not TtosMed.importe is null */
        and TtosMed.StaTto = 5 
        ".$scol."

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";
}
//**********************************

//**********************************
function primerasql($codigos, $col){

    $scol = "";

    if ($col != "" ){ 
        $scol = "AND TtosMed.IdCol = " . $col;
    }

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then 1 else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then 1 else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            Pacientes.FecNacim,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes
            /*count(TtosMed.IdPac) as num*/
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
        /*and (TtosMed.Importe >= 0 or NOT TtosMed.Importe IS NULL) */
        and TtosMed.StaTto = 5
        AND YEAR(TtosMed.FecIni) > 2007 
        /*and YEAR(TtosMed.FecIni) = YEAR(Pacientes.FecAlta)*/
        ".$scol."

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";
}
//**********************************

//**********************************
function primerasqlEdades($codigos,$desde,$hasta){

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then 1 else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then 1 else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            Pacientes.FecNacim,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes
            /*count(TtosMed.IdPac) as num*/
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
        and (TtosMed.importe >= 0 or NOT TtosMed.Importe IS NULL)
        and TtosMed.StaTto = 5
        AND YEAR(TtosMed.FecIni) > 2007
        /*and YEAR(TtosMed.FecIni) = YEAR(Pacientes.FecAlta)*/
        and DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 >= $desde
        and DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 <= $hasta

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";
}
//**********************************


//**********************************
function eurosql($codigos){

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            Pacientes.FecNacim,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            TtosMed.importe as pago
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
            AND TtosMed.StaTto = 5
            and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";
}
//**********************************

//**********************************
function eurosqlAnuales($codigos){

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0) as pago
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
            AND TtosMed.StaTto = 5
            /*
            and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007 */

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select ".$insql." from #unica
        ;";

}
//**********************************

//**********************************
function eurosqlMensuales($codigos){

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0) as pago
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
            AND TtosMed.StaTto = 5
            and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

}
//**********************************
//**********************************
function procsFacturacionesMensuales($codigos,$col){

    $scol = "";

    if ($col != "" ){ 
        $scol = "AND TtosMed.IdCol = " . $col;
    }

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0) as pago,
            TtosMed.Actos as actos
            /*count(TtosMed.IdPac) as num*/
        INTO #unica

        FROM TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE TTos.Codigo in ( ".$codigos." )
        /* and (TtosMed.importe >= 0 or TtosMed.Importe IS NULL)
        and not TtosMed.importe is null */
        and TtosMed.StaTto = 5 
        ".$scol."

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

}
//**********************************

//**********************************
function pptosAceptados(){

    $id = deget()->centro;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then importe else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then importe else 0 end) as a".$any;

    $sql = "
        /*drop table #unica;*/
        select
                /*sum( ROUND( (ImportePre*(100-(ISNULL(PresuTto.Dto,0))))/100 , 2 ) ) as importe,*/
                ROUND( (ImportePre*(100-(ISNULL(PresuTto.Dto,0))))/100 , 2 )  as importe,

                /*
                MONTH(FecIni) as mes,
                YEAR(FecIni) as ano
                */

                MONTH(PresuTto.FecAcepta) as mes,
                YEAR(PresuTto.FecAcepta) as ano

        into #unica

                from PresuTto
                inner join Presu on (
                    ( PresuTto.idpac = Presu.idpac and PresuTto.NumPre = Presu.NumPre )
                )

                where
                PresuTto.StaTto = 7
                and (PresuTto.FecAcepta is not NULL)

                /*group by YEAR(PresuTto.FecIni), MONTH(PresuTto.FecIni)*/
                /*order by YEAR(PresuTto.FecIni), MONTH(PresuTto.FecIni)*/
                order by YEAR(PresuTto.FecAcepta), MONTH(PresuTto.FecAcepta)

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

    retrieve($id,$sql);
}
//**********************************
//***
function pptosPresupuestadosFechas(){

    $id = deget()->id;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "        SELECT

        sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) and (presu.FecRechaz is null) then 1 else 0 end ) as entregado,
        round( sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) and (presu.FecRechaz is null) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as dentregado,

        sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then 1 else 0 end ) as aceptado,
        round( sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as daceptado,

        sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then 1 else 0 end ) as rechazado,
        round( sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as drechazado


        FROM presutto
        LEFT JOIN presu on presu.idpac=presutto.idpac and presu.numpre=presutto.numpre
    ;";

    recupera($id,$sql);

}
//****

//**********************************
function pptosPresupuestados(){

    $id = deget()->centro;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then importe else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then importe else 0 end) as a".$any;

    $sql = "
        /*drop table #unica;*/
        select
                ROUND( (ImportePre*(100-(ISNULL(PresuTto.Dto,0))))/100 , 2 ) as importe,
                DAY(PresuTto.FecIni) as dia,
                MONTH(PresuTto.FecIni) as mes,
                YEAR(PresuTto.FecIni) as ano

        into #unica

                from PresuTto
                /*inner join TtosMed on (
                ( PresuTto.idpac = TtosMed.idpac and PresuTto.NumTto = TtosMed.NumTto )
                )*/
                inner join Presu on (
                ( PresuTto.idpac = Presu.idpac and PresuTto.NumPre = Presu.NumPre )
                )


        where
                PresuTto.StaTto = 7
                and Presu.FecRechaz is null

                order by PresuTto.FecIni

        select mes,".$insql." from #unica
        where mes is not null
        group by mes
        order by mes
        ;";

    retrieve($id,$sql);
}
//**********************************
//**********************************
function carteraAceptadosDeprecated(){

    $id = deget()->centro;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then importe else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then importe else 0 end) as a".$any;

    $sql = "
        /*drop table #unica;*/
        select
                /*sum( ROUND( (Importe*(100-(ISNULL(TtosMed.Dto,0))))/100 , 2 ) ) as importe,*/
                ROUND( (Importe*(100-(ISNULL(TtosMed.Dto,0))))/100 , 2 ) as importe,
                MONTH(FecIni) as mes,
                YEAR(FecIni) as ano

        into #unica

                from TtosMed

                where
                TtosMed.StaTto = 3 and not TtosMed.importe is null
                and (FecIni is not NULL)
                and (FecFin is NULL)

                /*group by YEAR(FecIni), MONTH(FecIni)*/
                order by YEAR(FecIni), MONTH(FecIni)

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

   retrieve($id,$sql);
}
//**********************************
//**********************************
function carteraAceptados(){

    $id = deget()->centro;
    $year = deget()->year;

    $any = date('Y');

    $sql = "
        select
            sum( ROUND( (Importe*(100-(ISNULL(TtosMed.Dto,0))))/100 , 2 ) ) as importe
        from TtosMed
        where
            TtosMed.StaTto = 3 and not TtosMed.importe is null and TtosMed.importe > 0
            and (FecIni is not NULL)
            and (FecFin is NULL)
            and YEAR(FecIni) >= ".$year
    ;

    recupera($id,$sql);
}
//**********************************
//**********************************
function eurosqlAnualesNo($codigos){

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    return $sql = "
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0) as pago
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo NOT in ( ".$codigos." )
            AND TtosMed.StaTto = 5
            and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select ".$insql." from #unica
        ;";

}
//**********************************

//**********************************
// funciones buenas para devolver valores...
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
function sendSMSCT() {

    $message = depostSMS();
    //$login = $objeto->email;
    $API_KEY = "3527760";

    $user = "eneresi";
    $password = "Eneresi1997";
    $api_id = "3527760";
    $baseurl ="http://api.clickatell.com";

    $text = urlencode($message["message"]);
    $to = $message["to"];

    // auth call
    $url = "$baseurl/http/auth?user=$user&password=$password&api_id=$api_id";

    // do auth call
    $ret = file($url);

    // explode our response. return string is on first line of the data returned
    $sess = explode(":",$ret[0]);
    if ($sess[0] == "OK") {

        $sess_id = trim($sess[1]); // remove any whitespace
        $url = "$baseurl/http/sendmsg?session_id=$sess_id&from=Eneresi&to=$to&text=$text";

        // do sendmsg call
        $ret = file($url);
        $send = explode(":",$ret[0]);


        if ($send[0] == "ID") {
            //echo "successnmessage ID: ". $send[1];
            $res["error"] = 0;
            $res["data"] = "successnmessage ID: ". $send[1];
            Flight::json($res);
        } else {
            //echo "send message failed";
            $res["error"] = 1;
            $res["data"] = "send message failed";
            Flight::json($res);
        }
    } else {
        //echo "Authentication failure: ". $ret[0];
        $res["error"] = 1;
        $res["data"] = "Authentication failure: ". $ret[0];
        Flight::json($res);
   }
}
//**********************************

//**********************************
function facturacion(){

    $separa = "";
    $scol = "";

    $id = deget()->id;
    $col = deget()->col;

    if ($col != "" ){
        $scol = "AND TtosMed.IdCol = " . $col;
    }

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    //switch ($id){
    //    case 3:
    //        $separa = "TtosMed.IdCentro = 3 and ";
    //        break;
    //    case 4:
    //        $separa = "TtosMed.IdCentro = 2 and ";
    //        break;
    //    default:
    //        $separa = "";
    //}

    $sql = "
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            Pacientes.FecNacim,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecFin) as ano,
            MONTH(TtosMed.FecFin) as mes,
            ROUND( TtosMed.importe ,2 ) as importe,
            ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) as pago
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE ".$separa."
            TtosMed.StaTto = 5 and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007 AND MONTH(TtosMed.FecFin) is not null
            ".$scol."
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

        retrieve($id,$sql);
}
//**********************************

//**********************************
function users(){

    $id = deget()->centro;

    echo $sql = "select IdCol,Alias,(Nombre+' '+Apellidos) as Nom from TColabos WHERE TColabos.IdCol in (select TtosMed.IdCol from TtosMed GROUP BY TtosMed.IdCol) and TColabos.Activo = 'S'";
    recupera($id,$sql);
}
//**********************************

//**********************************
function cumples(){

    // $request = Flight::request();
    // print_r($request);

    $separa = "";

    $id = deget()->centro;
    $fecha = deget()->fecha;
    $phones = deget()->phones;

    if ( $phones == "" ){
        $tels = " ";
    } else {
        $tels = ", (select count(b.IdPac) from Pacientes b where a.TelMovil = b.TelMovil and (
             ( REPLACE( REPLACE( REPLACE(a.TelMovil, ' ', ''), '-', ''), '.', '') in (".$phones.") )
        )) as sms ";
    }

    echo $sql = "
            select a.Nombre, a.Apellidos, a.TelMovil
            ,datediff ( year , FecNacim, CAST(GETDATE() AS DATE) ) as cumple
            ,( select count(*) from DCitas where DCitas.IdPac = a.IdPac and DCitas.fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2 ) as concitahoy
            ,( select convert(varchar, cast(CAST(hora / 86399.0 as datetime) as time), 108) from DCitas where DCitas.IdPac = a.IdPac and DCitas.fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2 ) as horacita "
            .$tels.

            "from Pacientes a
            where
            ( day(a.FecNacim) = day( '".$fecha."' ) )
            and
            ( month(a.FecNacim) = month( '".$fecha."' ) )
            and a.TelMovil is not NULL
        ";

    recupera($id,$sql);
}
//**********************************

//**********************************
function facturacionFechas(){

    $separa = "";

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $insql = "";
    $any = date('Y');
    //for ( $i=$any-4; $i<$any; $i++ ){
    //    $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    //}
    //$insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    $sql = "
        /*drop table #unica;*/
        SELECT
            sum( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) as pago
        FROM TtosMed
        WHERE
            TtosMed.StaTto = 5 and not TtosMed.importe is null
            AND TtosMed.FecIni >= '".$desde."' AND TtosMed.FecIni <= '".$hasta."'
        ;";

        recupera($id,$sql);
}
//**********************************

//**********************************
function facturacionDelMes(){

    $id = deget()->id;
    $mes = deget()->mes;
    $ano = deget()->ano;

    $sql = "
        /*drop table #unica;*/
        SELECT
            round( SUM ( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) ,0 ) as fact

        FROM TtosMed

        WHERE
            TtosMed.StaTto = 5 and not TtosMed.importe is null
            AND YEAR(TtosMed.FecFin) = ".$ano."
            AND MONTH(TtosMed.FecFin) = ".$mes;

    if ( $id == 3 ){
        $sql = "
            /*drop table #unica;*/
            SELECT
                SUM ( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) as fact

            FROM TtosMed

            WHERE
                TtosMed.StaTto = 5 and not TtosMed.importe is null and IdCentro = 3
                AND YEAR(TtosMed.FecFin) = ".$ano."
                AND MONTH(TtosMed.FecFin) = ".$mes;
    }
    if ( $id == 4 ){
        $sql = "
            /*drop table #unica;*/
            SELECT
                SUM ( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) as fact

            FROM TtosMed

            WHERE
                TtosMed.StaTto = 5 and not TtosMed.importe is null and IdCentro = 2
                AND YEAR(TtosMed.FecFin) = ".$ano."
                AND MONTH(TtosMed.FecFin) = ".$mes;
    }

        recupera($id,$sql);
}
//**********************************

//**********************************
function pagos(){

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    $sql = "
        /*drop table #unica;*/
        SELECT
            YEAR(PagoCli.FecPago) as ano,
            MONTH(PagoCli.FecPago) as mes,
            ROUND( PagoCli.Pagado, 0 ) as pago
        INTO #unica

        FROM PagoCli

        ORDER BY YEAR(PagoCli.FecPago) ASC, MONTH(PagoCli.FecPago) ASC;

        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;";

        retrieve($id,$sql);
}
//**********************************
//**********************************
function pacsunicos() {

    $id = deget()->id;

    // $objeto = depost();
    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;


    $sql ="
        /*drop table #unica;
         */

        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            count(DISTINCT TtosMed.IdPac) as num
        INTO #unica
        FROM TtosMed
        WHERE TtosMed.StaTto = 5
            and not TtosMed.IdTto is null
            AND YEAR(TtosMed.FecIni) > 2007
        GROUP BY YEAR(TtosMed.FecIni),MONTH(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni),MONTH(TtosMed.FecIni)

        select mes,
        ".
        $insql
        ."
        from #unica
        group by mes
        order by mes
        ;
    ";
    retrieve($id,$sql);

}
//**********************************//**********************************
function pacsunicosanual() {

    $id = deget()->id;

    // $objeto = depost();
    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;


    $sql ="
        /*drop table #unica;
         */

        SELECT
            YEAR(TtosMed.FecIni) as ano,
            count(DISTINCT TtosMed.IdPac) as num
        INTO #unica
        FROM TtosMed
        WHERE TtosMed.StaTto = 5
            /*and not TtosMed.importe is null*/
            AND YEAR(TtosMed.FecIni) > 2007
        GROUP BY YEAR(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni)

        select 'Anual' as mes,
        ".
        $insql
        ."
        from #unica
        ;
    ";
    retrieve($id,$sql);

}
//**********************************

//**********************************
function tratamientos() {

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;

    $sql ="
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            count(TtosMed.IdPac) as num
        INTO #unica
        FROM TtosMed
        LEFT JOIN Pacientes on (Pacientes.IdPac = TtosMed.IdPac)
        WHERE StaTto=5 and YEAR(FecIni) > 2007 and TipoOperac is null and IdTto is not null
        GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC

        select mes,
        ".
        $insql
        ."
        from #unica
        group by mes
        order by mes
        ;
    ";
    retrieve($id,$sql);

}
//**********************************

//**********************************
function tiempostratamientos() {

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;

    $sql ="
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            sum(TtosMed.Tiempo) as num
        INTO #unica
        FROM TtosMed
        LEFT JOIN Pacientes on (Pacientes.IdPac = TtosMed.IdPac)
        WHERE StaTto=5 and YEAR(FecIni) > 2007 and TipoOperac is null and IdTto is not null
        GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC

        select mes,
        ".
        $insql
        ."
        from #unica
        group by mes
        order by mes
        ;
    ";
    retrieve($id,$sql);

}


//**********************************

//**********************************
function mediastiempostratamientos() {

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;

    $sql ="
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            sum(TtosMed.Tiempo)/count(TtosMed.Tiempo) as num
        INTO #unica
        FROM TtosMed
        LEFT JOIN Pacientes on (Pacientes.IdPac = TtosMed.IdPac)
        WHERE StaTto=5 and YEAR(FecIni) > 2007 and TipoOperac is null and IdTto is not null
        GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC

        select mes,
        ".
        $insql
        ."
        from #unica
        group by mes
        order by mes
        ;
    ";
    retrieve($id,$sql);

}
//**********************************
// (^[^']+)(['][A-Z0-9]{1,4}.+["])(.+)
// Facturaciones anuales
//**********************************
function visitas()           { $id = deget()->id; $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO'";  $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function conservadora()      { $id = deget()->id; $codigos = "'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function implantologia()     { $id = deget()->id; $codigos = "'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function dhp()               { $id = deget()->id; $codigos = "'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function rhb()               { $id = deget()->id; $codigos = "'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function ortodoncia()        { $id = deget()->id; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2' "; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function estetica()          { $id = deget()->id; $codigos = "'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function periodoncia()       { $id = deget()->id; $codigos = "'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function cirugia()           { $id = deget()->id; $codigos = "'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }
function odontopediatria()   { $id = deget()->id; $codigos = "'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC','ALING', 'ORI1', 'ORI2', 'MANTF', 'MANTR'"; $sql = eurosqlAnuales($codigos); retrieveAnual($id,$sql); }

// Facturaciones mesuales
//**********************************
function mvisitas()           { $id = deget()->id; $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO'";  $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mconservadora()      { $id = deget()->id; $codigos = "'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mimplantologia()     { $id = deget()->id; $codigos = "'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mdhp()               { $id = deget()->id; $codigos = "'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mrhb()               { $id = deget()->id; $codigos = "'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mortodoncia()        { $id = deget()->id; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2' "; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mestetica()          { $id = deget()->id; $codigos = "'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mperiodoncia()       { $id = deget()->id; $codigos = "'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mcirugia()           { $id = deget()->id; $codigos = "'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function modontopediatria()   { $id = deget()->id; $codigos = "'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC','ALING', 'ORI1', 'ORI2', 'MANTF', 'MANTR'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }

function mimplantes()               { $id = deget()->id; $codigos = "'IOIM','IOIP','IOIU','IOIZ','IOIH'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mprotesisobreimplante()        { $id = deget()->id; $codigos = "'FSIP','FSI','FSIDK','PSI'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
function mprotesisfijayremovible()        { $id = deget()->id; $codigos = "'PR+3','PR-3','PPRPL','PPRPS','PC','PCI','CCC','CMC','CMR','CR','INCRU','MARYL','MPR'"; $sql = eurosqlMensuales($codigos); retrieve($id,$sql); }
//function protesisfijayremovible()             { $id = deget()->id; $codigos = "'CCC','CMC','CMR','CR','INCRU','MARYL','MPR'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function protesisremovible()        { $id = deget()->id; $codigos = "'PR+3','PR-3','PPRPL','PPRPS','PC','PCI'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };

//**********************************

// intervenciones Procedimientos

//function implantescolocados()       { $id = deget()->id; $codigos = "'IOIM','IOIP','IOIU','IOIZ','IOIH'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function implantesfracasados()      { $id = deget()->id; $codigos = "'RIF'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function protesisobreimplant()      { $id = deget()->id; $codigos = "'FSIP','FSI','FSIDK','PSI'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function protesishibrida()          { $id = deget()->id; $codigos = "'PHCI','PHDB','PHDA','PSDA/PSDB','RPSD'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function protesisfija()             { $id = deget()->id; $codigos = "'CCC','CMC','CMR','CR','INCRU','MARYL','MPR'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function protesisremovible()        { $id = deget()->id; $codigos = "'PR+3','PR-3','PPRPL','PPRPS','PC','PCI'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function ortodonciafija()           { $id = deget()->id; $codigos = "'ORF','ORFE','ORTQ'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function ortodonciainvisalign()     { $id = deget()->id; $codigos = "'INVCC','INVCO','INV17','INVEX','INTEC','INVTE'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function ortodonciainterceptiva()   { $id = deget()->id; $codigos = "'ORI1','ORI2','MANTF','MANTR','ALING'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function carillas()                 { $id = deget()->id; $codigos = "'CARC','CARIL'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function carillaceramica()          { $id = deget()->id; $codigos = "'CARC'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function carillacomposite()         { $id = deget()->id; $codigos = "'CARIL'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function blaqueamiento()            { $id = deget()->id; $codigos = "'BLANC','BLMIX'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function esteticafacial()           { $id = deget()->id; $codigos = "'AULAB','BOTTS','COBA','LIMA','PLAB','PNSG','PGAL'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function procsdhp()                 { $id = deget()->id; $codigos = "'REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function dhpcolectivos()            { $id = deget()->id; $codigos = "'REVCO'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function revisonesconservadora()    { $id = deget()->id; $codigos = "'REVC','REVCO'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function revisonesodontopediatria() { $id = deget()->id; $codigos = "'REVOC'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function mantenimientoperiodontal() { $id = deget()->id; $codigos = "'MFM'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };
//function revisioneshibrida()       { $id = deget()->id; $codigos = "'R1HC','R2H','R1HP'"; $sql = procsMensuales($codigos); retrieve($id,$sql); };



// facturaciones por especialdades

function especialidades() {

    $res = array();

    $id = deget()->id;
    $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO', 'V1PAD'";  $sql = eurosqlAnuales($codigos);
    $res['visitas'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3'"; $sql = eurosqlAnuales($codigos);
    $res['conservadora'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB'"; $sql = eurosqlAnuales($codigos);
    $res['implantologia'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H'"; $sql = eurosqlAnuales($codigos);
    $res['dhp'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    //$codigos = "'ESRA', 'ESTB', 'EFI', 'PR+3', 'PR-3R', 'FSIP', 'FSI', 'FSIDK', 'PSI', 'PHCI', 'RPSD', 'PHDB', 'PHDA', 'PSDA', 'PSDB', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM'"; $sql = eurosqlAnuales($codigos); $res['rhb'] = retrieveJson($id,$sql);
    //limpia($id,"drop table #unica;");
    $codigos = "'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM'"; $sql = eurosqlAnuales($codigos);
    $res['rhb'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    //$codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE', 'MANTF', 'MANTR', 'ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO'"; $sql = eurosqlAnuales($codigos);
    $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2'"; $sql = eurosqlAnuales($codigos);
    $res['ortodoncia'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = eurosqlAnuales($codigos);
    $res['estetica'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE'"; $sql = eurosqlAnuales($codigos);
    $res['periodoncia'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM'"; $sql = eurosqlAnuales($codigos);
    $res['cirugia'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC','ALING', 'ORI1', 'ORI2', 'MANTF', 'MANTR', 'REVPA'"; $sql = eurosqlAnuales($codigos);
    $res['odontopediatria'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");
    $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO', 'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3',  'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB',  'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H',  'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM',  'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE', 'ORI1', 'ORI2', 'MANTF', 'MANTR', 'ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO',  'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL',  'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE',  'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM',  'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC', 'ALING'" ;
    $sql = eurosqlAnualesNo($codigos); $res['resto'] = retrieveJson($id,$sql);

    limpia($id,"drop table #unica;");

    $data["data"][] = $res;

    Flight::json($data);

}

function especialidadesReport() {

    $res = array();

    $id = deget()->id;

    $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO', 'V1PAD'";  $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "visitas";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "conservadora";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "implantologia";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "dph";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM'"; $sql = eurosqlAnuales($codigos);
    $data["data"][] = $qes[0];
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "rhb";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "ortodoncia";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "estetica";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "periodoncia";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "cirugia";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC','ALING', 'ORI1', 'ORI2', 'MANTF', 'MANTR', 'REVPA'"; $sql = eurosqlAnuales($codigos);
    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "odontopediatria";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");
    $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS' ,'VU' ,'VDCM' ,'V1P' ,'REV' ,'VOCO', 'V1PAD', 'OBTS', 'OBTC', 'OBTPR', 'REC', 'RECAB', 'RECC', 'REES', 'SELL', 'MTA', 'CURA', 'ENDO1', 'ENDO2', 'ENDO3', 'REEN1', 'REEN2', 'MUÑO1', 'MUÑO2', 'REEN3',  'FCG ','FQIC ','FQIP ','IOIM ','IOIP ','IOIH ','IOIU ','IOIZ ','FSIP ','FSI ','FSIDK ','PHCI ','PHDB ','PHDA ','PSDA ','PSDB ','RPSD ','ROGNR ','ROGRE ','REGA ','IHBM ','MBRO ','EXOI ','ELVA ','ELVB',  'HIGH', 'HIGC', 'DESEN', 'FLUOR', 'REVC', 'REVOC', 'R1HP', 'R1HC', 'R2H',  'ESRA', 'ESTB', 'EFI', 'PSI', 'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI', 'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR', 'TALLP', 'REPC', 'RECIM',  'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',                                   'ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO',  'CARC', 'CARIL', 'BLANC', 'BLMIX', 'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL',  'CMUCO', 'CPERI', 'RASP', 'RASHEMP', 'FERUP', 'M12Q', 'M34Q', 'MFM', 'PDL', 'PEOD', 'REPE',  'EXOA', 'EXOB', 'EXOC', 'EXOD', 'FENE', 'COAC', 'CIMT', 'APIU', 'APIM', 'FRE', 'DRF', 'TORUS', 'IACI', 'IAB', 'IAM',  'ENOP1', 'ENOP2', 'ENOP3', 'PPEC', 'PULP', 'RECALD', 'STC', 'ALING', 'ORI1', 'ORI2', 'MANTF', 'MANTR', 'REVPA'" ;
    $sql = eurosqlAnualesNo($codigos);

    $qes = retrieveJson($id,$sql);
    $qes[0]['esp'] = "resto";
    $data["data"][] = $qes[0];

    limpia($id,"drop table #unica;");

    Flight::json($data);

}

function presupuestosAprobadosL($codigos){

    $any = date('Y')-5;

    return
    "
    SELECT
                YEAR(TtosMed.FecIni) as ano,
                sum(TtosMed.actos) as realizado
            INTO #realizado

            FROM TtosMed
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
                AND TtosMed.StaTto = 5
                AND YEAR(TtosMed.FecIni) > ".$any."

            GROUP BY YEAR(TtosMed.FecIni)
            ORDER BY YEAR(TtosMed.FecIni) ASC

    SELECT
                YEAR(TtosMed.FecIni) as ano,
                sum(TtosMed.actos) as previsto
             INTO #previsto

            FROM TtosMed
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
                AND (TtosMed.StaTto = 5 OR TtosMed.StaTto = 3)
                AND YEAR(TtosMed.FecIni) > ".$any."

            GROUP BY YEAR(TtosMed.FecIni)
            ORDER BY YEAR(TtosMed.FecIni) ASC

    select #realizado.ano, #realizado.realizado,#previsto.previsto,
            ROUND( cast(#realizado.realizado as float) / cast(#previsto.previsto as float) * 100, 0) as aprobado
            from #realizado
            left join #previsto on #realizado.ano=#previsto.ano
    ";

}

function presupuestosAprobados($codigos){

    $any = date('Y')-5;

    return
    "
    SELECT
                YEAR(TtosMed.FecIni) as ano,
                sum(TtosMed.actos) as realizado
            INTO #realizado

            FROM TtosMed
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
                /*AND (TtosMed.StaTto = 5 OR TtosMed.StaTto = 3)*/
                AND (TtosMed.StaTto = 5)
                AND YEAR(TtosMed.FecIni) > ".$any."

            GROUP BY YEAR(TtosMed.FecIni)
            ORDER BY YEAR(TtosMed.FecIni) ASC

    SELECT
                YEAR(TtosMed.FecIni) as ano,
                sum(TtosMed.actos) as tres
            INTO #tres

            FROM TtosMed
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
                AND (TtosMed.StaTto = 3)
                AND YEAR(TtosMed.FecIni) > ".$any."

            GROUP BY YEAR(TtosMed.FecIni)
            ORDER BY YEAR(TtosMed.FecIni) ASC

    SELECT
                YEAR(TtosMed.FecIni) as ano,
                sum(TtosMed.actos) as previsto
             INTO #previsto

            FROM TtosMed
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
                AND (TtosMed.StaTto = 5 OR TtosMed.StaTto = 3 OR TtosMed.StaTto = 8)
                AND YEAR(TtosMed.FecIni) > ".$any."

            GROUP BY YEAR(TtosMed.FecIni)
            ORDER BY YEAR(TtosMed.FecIni) ASC

    select #realizado.ano, #realizado.realizado,#previsto.previsto,#tres.tres,
            ROUND(
                ( cast(#realizado.realizado as float) + cast(#tres.tres as float) )
                / cast(#previsto.previsto as float)
                * 100, 0) as aprobado
            from #realizado
            left join #previsto on #realizado.ano=#previsto.ano
            left join #tres on #realizado.ano=#tres.ano
    ";

}

function AprobarImplantesColocados()           { $id = deget()->id; $codigos = "'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' "; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarOrtodonciaTotal()              { $id = deget()->id; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarProtesisSobreImplantes()       { $id = deget()->id; $codigos = "'FSIP', 'FSI', 'FSIDK', 'PSI'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarCarillas()                     { $id = deget()->id; $codigos = "'CARC', 'CARIL'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarBlanqueamiento()               { $id = deget()->id; $codigos = "'BLANC', 'BLMIX'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarDPH()                          { $id = deget()->id; $codigos = "'REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarOrtodonciaFija()               { $id = deget()->id; $codigos = "'ORF', 'ORFE', 'ORTQ'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarInvisalign()                   { $id = deget()->id; $codigos = "'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarOrtodonciaInterceptiva()       { $id = deget()->id; $codigos = "'ORI1', 'ORI2'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }
function AprobarOrtodonciaFI()                 { $id = deget()->id; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = presupuestosAprobados($codigos); if ($id==1){$sql = presupuestosAprobadosL($codigos);} recupera($id,$sql); }


//**********************************
function primeras()                     { $id = deget()->id; $col = deget()->col; $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS'"; $sql = primerasql($codigos, $col); retrieve($id,$sql); }
function primerascolectivo()            { $id = deget()->id; $col = deget()->col; $codigos = "'V1CO', 'VOCO','V1PAD'"; $sql = primerasql($codigos, $col); retrieve($id,$sql); }
function totalprimeras()                { $id = deget()->id; $col = deget()->col; $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS','V1CO', 'VOCO', 'V1PAD'"; $sql = primerasql($codigos, $col); retrieve($id,$sql); }

function ImplantesColocados()           { $id = deget()->id; $col = deget()->col; $codigos = "'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' "; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function ImplantesFracasados()          { $id = deget()->id; $col = deget()->col; $codigos = "'RIF'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function ProtesisSobreImplantes()       { $id = deget()->id; $col = deget()->col; $codigos = "'FSIP', 'FSI', 'FSIDK', 'PSI'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function ProtesisHibridas()             { $id = deget()->id; $col = deget()->col; $codigos = "'PHCI', 'PHDB', 'PHDA', 'PSDA', 'PSDB', 'RPSD'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function ProtesisFija()                 { $id = deget()->id; $col = deget()->col; $codigos = "'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function ProtesisRemovible()            { $id = deget()->id; $col = deget()->col; $codigos = "'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function OrtodonciaFija()               { $id = deget()->id; $col = deget()->col; $codigos = "'ORF', 'ORFE', 'ORTQ'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function Invisalign()                   { $id = deget()->id; $col = deget()->col; $codigos = "'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function OrtodonciaInterceptiva()       { $id = deget()->id; $col = deget()->col; $codigos = "'ORI1', 'ORI2'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function OrtodonciaFI()                 { $id = deget()->id; $col = deget()->col; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function OrtodonciaTotal()              { $id = deget()->id; $col = deget()->col; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
// function OrtodonciaTotal()              { $id = deget()->id; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORI1', 'ORI2'"; $sql = elsql($codigos); retrieve($id,$sql); }
// function OrtodonciaTotal()              { $id = deget()->id; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE',  'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO', 'ORI1', 'ORI2'"; $sql = elsql($codigos); retrieve($id,$sql); }
function Carillas()                     { $id = deget()->id; $col = deget()->col; $codigos = "'CARC', 'CARIL'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function CarillaCeramica()              { $id = deget()->id; $col = deget()->col; $codigos = "'CARC'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function CarillaComposite()             { $id = deget()->id; $col = deget()->col; $codigos = "'CARIL'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function Blanqueamiento()               { $id = deget()->id; $col = deget()->col; $codigos = "'BLANC', 'BLMIX'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function EsteticaFacial()               { $id = deget()->id; $col = deget()->col; $codigos = "'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function DPH()                          { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function DPHColectivos()                { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function RevisionesConservadora()       { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO', 'REVC'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function RevisionesOdontopediatria()    { $id = deget()->id; $col = deget()->col; $codigos = "'REVOC'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function MantenimientosPeridontales()   { $id = deget()->id; $col = deget()->col; $codigos = "'MFM'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }
function RevisionesHibrida()            { $id = deget()->id; $col = deget()->col; $codigos = "'R1HP', 'R2H', 'R1HC'"; $sql = elsql($codigos, $col); retrieve($id,$sql); }

function primeras18()                   { $id = deget()->id; $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS'"; $sql = primerasqlEdades($codigos,18,99); retrieve($id,$sql); }
function primeras616()                  { $id = deget()->id; $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS'"; $sql = primerasqlEdades($codigos,6,16); retrieve($id,$sql); }
function primeras1465()                 { $id = deget()->id; $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS'"; $sql = primerasqlEdades($codigos,14,65); retrieve($id,$sql); }

function RatioFracasoImplantes(){

    $id = deget()->id;

    $time = strtotime("-1 year", time());
    $unanyomenos = date("Ymd", $time);

    echo $sql = "
        select top 1
                (SELECT sum(TtosMed.actos)
                FROM TtosMed
                left join TTos on TtosMed.IdTto = TTos.IdTto
                WHERE TTos.Codigo in ( 'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' )
                and TtosMed.StaTto = 5
                and TtosMed.FecIni > '".$unanyomenos."') as realizados,
                (SELECT sum(TtosMed.actos)
                FROM TtosMed
                left join TTos on TtosMed.IdTto = TTos.IdTto
                WHERE TTos.Codigo in ( 'RIF' )
                and TtosMed.StaTto = 5
                and TtosMed.FecIni > '".$unanyomenos."') as fracasados
        from ttosmed
    ";

    recupera($id,$sql);
}

function RatioFracasoImplantesAnual(){

    $id = deget()->id;

    $time = strtotime("-1 year", time());
    $unanyomenos = date("Y", $time);

    $sql = "
        select year(B.FecIni) as anyo,
        cast(
                (
                SELECT sum(TtosMed.actos)
                FROM TtosMed
                left join TTos on TtosMed.IdTto = TTos.IdTto
                WHERE TTos.Codigo in ( 'RIF' )
                and TtosMed.StaTto = 5
                and year(TtosMed.FecIni) = year(B.FecIni)
                )
        as float)
                /
                (
                SELECT sum(TtosMed.actos)
                FROM TtosMed
                left join TTos on TtosMed.IdTto = TTos.IdTto
                WHERE TTos.Codigo in ( 'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' )
                and TtosMed.StaTto = 5
                and year(TtosMed.FecIni) = year(B.FecIni)
                ) * 100
        as ratio

        from ttosmed B
        where year(B.FecIni) >= ". ($unanyomenos-4) ." and year(B.FecIni) <= ". $unanyomenos ."
        group by year(B.FecIni)
        order by year(B.FecIni)
    ";

    recupera($id,$sql);
}

//**********************************
// procedimientos facturaciones
//**********************************
function fprimeras()                     { $id = deget()->id; $col = deget()->col; $codigos = "'V1C' ,'V1S' ,'V1H' ,'VOC' ,'VOS'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fprimerascolectivo()            { $id = deget()->id; $col = deget()->col; $codigos = "'V1CO', 'VOCO', 'V1PAD'"; $sql =  procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql);}
function ftotalprimeras()                { $id = deget()->id; $col = deget()->col; $codigos = "'V1C' ,'V1S' ,'V1H' ,'VOC' ,'VOS','V1CO', 'VOCO', 'V1PAD' "; $sql =  procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }

function fImplantesColocados()           { $id = deget()->id; $col = deget()->col; $codigos = "'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' "; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fImplantesFracasados()          { $id = deget()->id; $col = deget()->col; $codigos = "'RIF'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fProtesisSobreImplantes()       { $id = deget()->id; $col = deget()->col; $codigos = "'FSIP', 'FSI', 'FSIDK', 'PSI'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fProtesisHibridas()             { $id = deget()->id; $col = deget()->col; $codigos = "'PHCI', 'PHDB', 'PHDA', 'PSDA', 'PSDB', 'RPSD'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fProtesisFija()                 { $id = deget()->id; $col = deget()->col; $codigos = "'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fProtesisRemovible()            { $id = deget()->id; $col = deget()->col; $codigos = "'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fOrtodonciaFija()               { $id = deget()->id; $col = deget()->col; $codigos = "'ORF', 'ORFE', 'ORTQ'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fInvisalign()                   { $id = deget()->id; $col = deget()->col; $codigos = "'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
//function fOrtodonciaInterceptiva()       { $id = deget()->id; $codigos = "'ORI1', 'ORI2', 'MANTF', 'MANTR', 'ALING'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fOrtodonciaInterceptiva()       { $id = deget()->id; $col = deget()->col; $codigos = "'ORI1', 'ORI2'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
//function fOrtodonciaTotal()              { $id = deget()->id; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORI1', 'ORI2'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
//function fOrtodonciaTotal()              { $id = deget()->id; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE', 'MANTF', 'MANTR','ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fOrtodonciaTotal()              { $id = deget()->id; $col = deget()->col; $codigos = "'ESTO', 'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE', 'ORI1', 'ORI2', 'MANTF', 'MANTR', 'ORF', 'ORFE', 'ORTQ', 'ESSIX', 'REPAP', 'REPAR', 'REFO'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fCarillas()                     { $id = deget()->id; $col = deget()->col; $codigos = "'CARC', 'CARIL'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fCarillaCeramica()              { $id = deget()->id; $col = deget()->col; $codigos = "'CARC'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fCarillaComposite()             { $id = deget()->id; $col = deget()->col; $codigos = "'CARIL'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fBlanqueamiento()               { $id = deget()->id; $col = deget()->col; $codigos = "'BLANC', 'BLMIX'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fEsteticaFacial()               { $id = deget()->id; $col = deget()->col; $codigos = "'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fDPH()                          { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fDPHColectivos()                { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fRevisionesConservadora()       { $id = deget()->id; $col = deget()->col; $codigos = "'REVCO', 'REVC'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fRevisionesOdontopediatria()    { $id = deget()->id; $col = deget()->col; $codigos = "'REVOC'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fMantenimientosPeridontales()   { $id = deget()->id; $col = deget()->col; $codigos = "'MFM'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
function fRevisionesHibrida()            { $id = deget()->id; $col = deget()->col; $codigos = "'R1HP', 'R2H', 'R1HC'"; $sql = procsFacturacionesMensuales($codigos,$col); retrieve($id,$sql); }
//**********************************


//**********************************
function primerasedad() {

    $id = deget()->id;

    $codigos = "'V1C' ,'V1S' ,'V1H' ,'V1CO' ,'VOC' ,'VOS'";
    $sql ="
        /*drop table #final;*/
        /*drop table #unica;*/
        SELECT
            TtosMed.IdPac,
            Pacientes.FecNacim,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes
            /*count(TtosMed.IdPac) as num*/
        INTO #unica

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE TTos.Codigo in ( ".$codigos." )
        and (TtosMed.importe >= 0 or TtosMed.Importe IS NULL)
        and TtosMed.StaTto = 5
        AND YEAR(TtosMed.FecIni) > 2007
        and YEAR(TtosMed.FecIni) = YEAR(Pacientes.FecAlta)

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;


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
    retrieve_edad($id,$sql);

}
//**********************************

//**********************************
function citasedad() {

    $id = deget()->id;

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
    AND YEAR(TtosMed.FecIni) > 2007 AND TtosMed.StaTto = 5
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
    retrieve_edad($id,$sql);

}
//**********************************

//**********************************
function totalcitas() {

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then num else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then num else 0 end) as a".$any;

    $sql ="
        /*drop table #unica;*/
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            count(*) as num
        INTO #unica
        FROM TtosMed

        WHERE TtosMed.StaTto = 5
            and not TtosMed.importe is null
            AND YEAR(TtosMed.FecIni) > 2007

        GROUP BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)


        select mes,".$insql." from #unica
        group by mes
        order by mes
        ;
    ";
    retrieve($id,$sql);

}
//**********************************

//**********************************
function ticket() {

    $id = deget()->id;

    $sql = "
        SELECT
            YEAR(TtosMed.FecIni) as ano,
            SUM( ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,2) ) as pago
        INTO #unica2
        FROM TtosMed
        WHERE TtosMed.StaTto = 5
        and not TtosMed.importe is null
        AND YEAR(TtosMed.FecIni) > 2007

        group by YEAR(TtosMed.FecIni)
        ORDER BY YEAR(TtosMed.FecIni) ASC;

        SELECT
           YEAR(FecIni) as ano,
           count(DISTINCT IdPac) as num
        INTO #unica
        FROM TtosMed
        WHERE TtosMed.StaTto = 5 and not TtosMed.importe is null
        GROUP BY YEAR(FecIni), IdPac
        ORDER BY YEAR(FecIni) ASC;

        SELECT #unica2.ano,ROUND(pago/sum(num),0) as ticket
        from #unica, #unica2
        where #unica.ano = #unica2.ano and #unica2.ano>2007
        group by #unica2.ano, pago, num
        order by #unica2.ano;
        ";

    retrieve_ticket($id,$sql);

}
//**********************************

//**********************************
function deuda() {

    $id = deget()->id;

    $any = date('Y');
    $res = array();

    //for ( $i=$any-3; $i<=$any; $i++ ){
    $i = $any-4;
        $sql = "
            SELECT
            TtosMed.IdCli,sum( ROUND( ISNULL(importe,0) - ((ISNULL(importe,0) * ISNULL(Dto,0) / 100)) ,0) )  as factur
            INTO #facturado
            from TtosMed
            INNER JOIN Clientes on Clientes.IdCli = TtosMed.IdCli
            WHERE StaTto = 5 and not TtosMed.IdCli IS NULL and Clientes.TipoCli <> 'M' and YEAR(FecIni)> ".$i."
            GROUP BY TtosMed.IdCli

            SELECT
            PagoCli.IdCli as IdCLi,sum( ISNULL(PagoCli.Pagado,0) ) as pagos
            INTO #pagado
            from PagoCli
            INNER JOIN Clientes on Clientes.IdCli = PagoCli.IdCli
            WHERE not PagoCli.IdCli IS NULL and Clientes.TipoCli <> 'M' and YEAR(PagoCli.FecPago)> ".$i."
            GROUP BY PagoCli.IdCli

            SELECT #pagado.IdCli,pagos,factur,
            ROUND( sum(pagos-factur) , 0) as saldo
            INTO #final
            from #facturado
            INNER JOIN #pagado on #pagado.IdCli = #facturado.IdCli
            WHERE not #pagado.IdCli IS NULL and not #facturado.IdCli IS NULL
            GROUP BY #pagado.IdCli, pagos,factur


            SELECT

            sum( case when saldo = 0 then 1 else 0 end) as cero,
            sum( case when saldo > 0 then 1 else 0 end) as cpositivo,
            sum( case when saldo > 0 then saldo else 0 end) as spositivo,
            sum( case when saldo < 0 then 1 else 0 end) as cnegativo,
            sum( case when saldo < 0 then saldo else 0 end) as snegativo

            from #final
        ";
        $res['data'][] = json_decode(solouno($id,$sql,$i));
        limpia($id,"drop table #facturado,#pagado,#final;");
    //}

    Flight::json($res);


}
//**********************************
//**********************************
function deudaAnterior() {

    $id = deget()->id;

    $any = date('Y');
    $res = array();

    //for ( $i=$any-3; $i<=$any; $i++ ){
    $i = $any-4;
        $sql = "
            SELECT
            TtosMed.IdCli,sum( ROUND( ISNULL(importe,0) - ((ISNULL(importe,0) * ISNULL(Dto,0) / 100)) ,0) )  as factur
            INTO #facturado
            from TtosMed
            INNER JOIN Clientes on Clientes.IdCli = TtosMed.IdCli
            WHERE StaTto = 5 and not TtosMed.IdCli IS NULL and Clientes.TipoCli <> 'M' and (YEAR(FecIni) > 2006 and YEAR(FecIni)<= ".$i.")
            GROUP BY TtosMed.IdCli

            SELECT
            PagoCli.IdCli as IdCLi,sum( ISNULL(PagoCli.Pagado,0) ) as pagos
            INTO #pagado
            from PagoCli
            INNER JOIN Clientes on Clientes.IdCli = PagoCli.IdCli
            WHERE not PagoCli.IdCli IS NULL and Clientes.TipoCli <> 'M' and ( YEAR(PagoCli.FecPago) > 2006 and YEAR(PagoCli.FecPago)<= ".$i.")
            GROUP BY PagoCli.IdCli

            SELECT #pagado.IdCli,pagos,factur,
            ROUND( sum(pagos-factur) , 0) as saldo
            INTO #final
            from #facturado
            INNER JOIN #pagado on #pagado.IdCli = #facturado.IdCli
            WHERE not #pagado.IdCli IS NULL and not #facturado.IdCli IS NULL
            GROUP BY #pagado.IdCli, pagos,factur


            SELECT

            sum( case when saldo = 0 then 1 else 0 end) as cero,
            sum( case when saldo > 0 then 1 else 0 end) as cpositivo,
            sum( case when saldo > 0 then saldo else 0 end) as spositivo,
            sum( case when saldo < 0 then 1 else 0 end) as cnegativo,
            sum( case when saldo < 0 then saldo else 0 end) as snegativo

            from #final
        ";
        $res['data'][] = json_decode(solouno($id,$sql,$i));
        limpia($id,"drop table #facturado,#pagado,#final;");
    //}

    Flight::json($res);


}
//**********************************

// ============================================
// RECALLS NORMALES MENSUALES DE CONTROL ******
// ============================================

function getControles(){

    $id = deget()->centro;
    $mes = deget()->mes;
    $ano = deget()->ano;

    if ( $id == 3 || $id == 4 ){
        $sql = "
            SELECT

            datediff(ss, '1/1/1970', Fecha) as Fecha, Recalls.IdPac,Recalls.IdCentro,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
            ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec

            FROM Recalls
            INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
            INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo


            WHERE
            MONTH(Fecha) = ".$mes." and  YEAR(Fecha) = ".$ano."
            and Fecha <= DATEADD(day, DATEDIFF(day, 0, GETDATE()+1), 0) and Carta = 'false' and Citado = 'false'

            ORDER BY Fecha DESC
        ";
    } else {
        $sql = "
            SELECT

            datediff(ss, '1/1/1970', Fecha) as Fecha, Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
            ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec

            FROM Recalls
            INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
            INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo


            WHERE
            MONTH(Fecha) = ".$mes." and  YEAR(Fecha) = ".$ano."
            and Fecha <= DATEADD(day, DATEDIFF(day, 0, GETDATE()+1), 0) and Carta = 'false' and Citado = 'false'

            ORDER BY Fecha DESC
        ";
    }

    recupera($id,$sql);
}

function getControlesTipo(){

    $id = deget()->centro;
    $mes = deget()->mes;
    $ano = deget()->ano;
    $tipo = deget()->tipo;

    $quetipo = " AND ".$tipo." = 'true' ";

    if ( $id == 3 || $id == 4 ){
        $sql = "
            SELECT
            MONTH(Fecha) as mes, YEAR(Fecha) as ano,
            CAST(DAY(Fecha) AS VARCHAR)+'/'+CAST(MONTH(Fecha) AS VARCHAR)+'/'+CAST(YEAR(Fecha) AS VARCHAR) as Fecha,
            datediff(ss, '1/1/1970', Fecha) as FechaDiff, Recalls.IdPac,Recalls.IdCentro,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
            ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec

            FROM Recalls
            INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
            INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo

            WHERE
            MONTH(Fecha) = ".$mes." and  YEAR(Fecha) = ".$ano."
            ".$quetipo."
            ORDER BY FechaDiff ASC
        ";
    } else {
        $sql = "
            SELECT
            MONTH(Fecha) as mes, YEAR(Fecha) as ano,
            CAST(DAY(Fecha) AS VARCHAR)+'/'+CAST(MONTH(Fecha) AS VARCHAR)+'/'+CAST(YEAR(Fecha) AS VARCHAR) as Fecha,
            datediff(ss, '1/1/1970', Fecha) as FechaDiff, Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
            ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Recalls.NumRec

            FROM Recalls
            INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
            INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo

            WHERE
            MONTH(Fecha) = ".$mes." and  YEAR(Fecha) = ".$ano."
            ".$quetipo."
            ORDER BY FechaDiff ASC
        ";
    }

    echo $sql;

    recupera($id,$sql);
}

function getPacienteControles(){

    $id = deget()->centro;
    $idpac = deget()->idpac;
    $mes = deget()->mes;
    $ano = deget()->ano;

    $sql = "
        SELECT

        NumRec, datediff(ss, '1/1/1970', Fecha), Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
        ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Pacientes.Tel2,
        DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad

        FROM Recalls
        INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
        INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo


        WHERE
        Recalls.NumRec = ".$idpac." and
        MONTH(Fecha) = ".$mes." and  YEAR(Fecha) = ".$ano."
        and Carta = 'false' and Citado = 'false'

        ORDER BY Fecha DESC
    ";

    recupera($id,$sql);
}

function getPacienteTodosControles(){

    $id = deget()->centro;
    $idpac = deget()->idpac;

    $sql = "
        SELECT

        NumRec, datediff(ss, '1/1/1970', Fecha) as Fecha, Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
        ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Pacientes.Tel2,
        DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad

        FROM Recalls
        INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
        INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo

        WHERE
        Recalls.IdPac = ".$idpac."

        ORDER BY Fecha DESC
    ";

    recupera($id,$sql);
}


function getDetalles(){

    $id = deget()->centro;
    $sql = "
        select
        IdOrden, Texto, datediff(ss, '1/1/1970', dateadd(dd,Fecha,'1/1/1900')-2) as Fecha, HorLlegada, Notas
        from DCitas
        WHERE IdPac = ".deget()->idpac."
        order by Fecha DESC
    ";

    recupera($id,$sql);
}

function getTtosDetalles(){

    $id = deget()->centro;
    $sql = "
        select
        TtosMed.*, datediff(ss, '1/1/1970', FecIni) as FecIni, TColabos.Codigo as Colabora
        from TtosMed
        inner join TColabos on TColabos.IdCol = TtosMed.IdCol
        WHERE IdPac = ".deget()->idpac."
        order by FecIni DESC
    ";

    recupera($id,$sql);
}

function getLastTtosNumPac(){
    $id = deget()->centro;

    $quecentro = "";
    if ( $id != 1 )
        $quecentro = ", Pacientes.IdCentro ";

    $sql = "
        select TOP 1
        TtosMed.NumTto, TtosMed.IdPac".$quecentro."
        from TtosMed
        left join Pacientes on Pacientes.IdPac = TtosMed.IdPac
        WHERE Pacientes.NumPac = '".deget()->idpac."'
        order by NumTto Desc

    ";

    recupera($id,$sql);
}

function getRecallsActiusGD(){
    $id = deget()->centro;
    switch ($id) {
        case '3':
            // murcia
            $subcentro = " and TtosMed.IdCentro = 3 ";
            break;
        case '4':
            // molina
            $subcentro = " and TtosMed.IdCentro = 2 ";
            break;

        default:
            $subcentro = " ";
            break;
    }

    $sql = "
        select
        datepart(mi,TtosMed.FecFin) as minutos
        ,TtosMed.IdPac,TtosMed.NumTto,TtosMed.NumFase
        ,convert(varchar,TtosMed.FecFin,120 ) as FecFin
        ,TtosMed.FecFin as FecFinOri
        ,TtosMed.Notas as NotasM
        ,Pacientes.*
        from TtosMed
        left join Pacientes on Pacientes.IdPac = TtosMed.IdPac
        WHERE
        convert( int, convert(varchar,TtosMed.FecFin,112) ) <= '".date('Ymd')."'
        and datepart(hh,TtosMed.FecFin) = 11
        and datepart(mi,TtosMed.FecFin) = 11
        and TtosMed.IdTipoOdg = 11
        ".$subcentro."
    ";

    recupera($id,$sql);
}

function aceptaRecalldeHoyGD(){
    $datos = depost();
    $id = $datos->centro;

    echo $sql = "
        UPDATE TtosMed
        SET FecFin = '".$datos->FecFin." 00:00:00'
        WHERE
            IdPac = ".$datos->IdPac."
            and NumTto = ".$datos->NumTto."
            and NumFase = ".$datos->NumFase."
    ";
    ejecutame($id, $sql);
}

function addAnotacionesNumPac(){
    $datos = depost();
    $id = $datos->centro;

    print_r($datos);

    //posar el centro per que surti al llistat de gesden
    $quecentro1 = "";
    $quecentro2 = "";
    if ($datos->IdCentro != 0){
        $quecentro1 = ", IdCentro ";
        $quecentro2 = ", ".$datos->IdCentro;
    }

    echo $sql = "
    INSERT INTO TtosMed
        ( IdPac, NumTto, NumFase, IdTipoOdg, StaTto, FecIni, FecFin, Notas".$quecentro1." )
    VALUES
        (
            ".$datos->IdPac.",
            ".$datos->NumTto.",
            0,
            11,
            5,
            '".$datos->fecini."',
            '".$datos->fecfin."',
            'ROCKS: ".$datos->notas."'
            ".$quecentro2."
        )"
    ;
    ejecutame($id, $sql);
}

function countRecallsActiusGD(){
    $id = deget()->centre;
    $sql = "
        select count(*) as recalls
        FROM TTosMed
        WHERE
        convert( int, convert(varchar,TtosMed.FecFin,112) ) <= '".date('Ymd')."'
        and datepart(hh,TtosMed.FecFin) = 11
        and datepart(mi,TtosMed.FecFin) = 11
        and TtosMed.IdTipoOdg = 11
        ";
    recupera($id, $sql);
}

function getAnotacionesNumPac(){
    $id = deget()->centro();
    $sql = "
        select
        TtosMed.*, datediff(ss, '1/1/1970', FecIni) as FecIni,
        (select TColabos.Codigo from TColabos where TColabos.IdCol = TtosMed.IdCol) as Colabora
        from TtosMed
        left join Pacientes on Pacientes.IdPac = TtosMed.IdPac
        WHERE Pacientes.NumPac = '".deget()->idpac."'
        and TtosMed.IdTipoOdg = 11
        order by FecIni DESC
    ";

    recupera($id,$sql);
}

function getTtosDetallesNumPac(){

    $id = deget()->centro;
    $sql = "
        select
        TtosMed.*, datediff(ss, '1/1/1970', FecIni) as FecIni, /*TColabos.Codigo as Colabora*/
        (select TColabos.Codigo from TColabos where TColabos.IdCol = TtosMed.IdCol) as Colabora
        from TtosMed
        /*inner join TColabos on TColabos.IdCol = TtosMed.IdCol*/
        left join Pacientes on Pacientes.IdPac = TtosMed.IdPac
        WHERE Pacientes.NumPac = '".deget()->idpac."'
        order by TtosMed.NumTto DESC
    ";

    recupera($id,$sql);
}

function getAlertasDetalles(){

    $id = deget()->centro;
    $sql = "
        select
        *
        from AlertPac
        WHERE IdPac = ".deget()->idpac."
        order by NumAlerta ASC
    ";

    recupera($id,$sql);
}

function llama1(){
    $id = deget()->centro;

    $comentario = comentarioRecalls($id,"select * from Recalls where NumRec = ".deget()->numrec);
    $comentario = $comentario."#tel:".date("d.m.y");
    $sql = "update Recalls set Comentario = '".$comentario."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}
function llama2(){
    $id = deget()->centro;

    $comentario = comentarioRecalls($id,"select * from Recalls where NumRec = ".deget()->numrec);
    $comentario = iconv('UTF-8', 'ISO-8859-1', $comentario)."#tel:".date("d.m.y");
    $sql = "update Recalls set Comentario = '".$comentario."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}
function llama3(){
    $id = deget()->centro;

    $comentario = comentarioRecalls($id,"select * from Recalls where NumRec = ".deget()->numrec);
    $comentario = $comentario."#tel:".date("d.m.y");
    $sql = "update Recalls set Comentario = '".$comentario."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}

function citado(){
    $id = deget()->centro;
    $sql = "update Recalls set Citado = '".deget()->estado."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}
function carta(){
    $id = deget()->centro;
    $sql = "update Recalls set Carta = '".deget()->estado."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}
function sms(){
    $id = deget()->centro;
    $sql = "update Recalls set SMS = '".deget()->estado."' where NumRec = ".deget()->numrec;
    ejecutame($id,$sql);
}

function getCartasControles(){

    $id = deget()->centro;
    $sql = "
        SELECT

        NumRec, datediff(ss, '1/1/1970', Fecha), Recalls.IdPac,Pacientes.Nombre, Pacientes.Apellidos, TMRecall.Descripcio, Comentario
        ,Telefono,Carta,Recalls.Email,SMS,Asistido,Citado, Pacientes.Email,Pacientes.TelMovil,Pacientes.Tel1,Pacientes.Tel2

        FROM Recalls
        INNER JOIN Pacientes ON Pacientes.IdPac = Recalls.IdPac
        INNER JOIN TMRecall ON TMRecall.IdMotivo = Recalls.IdMotivo

        WHERE
        Recalls.Carta = 'true' and
        MONTH(Fecha) =".deget()->mes." and  YEAR(Fecha) = ".deget()->ano."
        and Citado = 'false'

        ORDER BY Fecha DESC
    ";

    recupera($id,$sql);
}

//************************************************************

function getDatosPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;

    $sql = "SELECT * FROM Pacientes WHERE NumPac = '".$NumPac."'";
    recupera($id,$sql);
}

//************************************************************

function getUnicosAnuales(){

    global $clinicas;

    $id = deget()->centro;
    $any = date('Y');


    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $res = array();
        for ($i=$any-4;$i<=$any;$i++){
            $sql =
            "
                SELECT count(DISTINCT TtosMed.IdPac) as num
                INTO #unica
                FROM TtosMed
                WHERE TtosMed.StaTto = 5
                and NOT TotsMed.IdTto is null
                AND YEAR(TtosMed.FecIni) > 2007
                AND YEAR(TtosMed.FecIni) <= ".$i."

                select '".$i."' as mes, sum(num) AS unicos
                from #unica
            ";

            $query = mssql_query($sql);

            while ($row = mssql_fetch_object($query)) {
                $res["data"][] = $row;
            }
            $query = mssql_query("drop table #unica;");
            //mssql_fetch_object($query);
        }

        $res["error"] = 0;
        $devuelvo['data'] = $res;
        Flight::json($devuelvo);
        mssql_free_result($query);

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }
    //recupera($id,$sql);
}

//****************************
// estadisticas de los recalls
//****************************

function getTotalControles(){

    $id = deget()->centro;

    $ano = date('Y');
    $mes = date('n');

    $res["error"] = "";

    for ($y=$ano;$y>=$ano-1;$y--){
        for ($m=12;$m>=1;$m--){

            if ($y == $ano && $m > $mes || $y < $ano && $m <= $mes) {
            } else {
                $recalls["mes"] = $m;
                $recalls["ano"] = $y;

                $recalls["total"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y."  ");

                $recalls["llamadas"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and Comentario like '%#%' ");
                $recalls["llamadas1"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and (LEN(Comentario) - LEN(REPLACE(Comentario, '#', '')))=1 ");
                $recalls["llamadas2"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and (LEN(Comentario) - LEN(REPLACE(Comentario, '#', '')))=2 ");
                $recalls["llamadas3"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and (LEN(Comentario) - LEN(REPLACE(Comentario, '#', '')))=3 ");

                $recalls["cartas"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and Carta = 'true' ");
                $recalls["citados"] = cuentame($id,"SELECT IdPac FROM Recalls WHERE  MONTH(Fecha) = ".$m." and  YEAR(Fecha) = ".$y." and Citado = 'true' ");


                $recalls["rllamadas"] = $recalls["llamadas"] / $recalls["total"] *100;
                $recalls["rcartas"] = $recalls["cartas"] / $recalls["total"] *100;
                $recalls["rcitados"] = $recalls["citados"] / $recalls["total"] *100;

                $res["data"][] = $recalls;
            }

        }
    }
    Flight::json($res);
}


//************************************************************
//****************************
// estadisticas de los presupuestos
//****************************

function getPresupuestosGesdent(){

    $id = deget()->centro;
    $desde = deget()->desde;

    switch ($id) {
        case '3':
            // murcia
            $subcentro = " and Presu.IdCentro = 3 ";
            break;
        case '4':
            // molina
            $subcentro = " and Presu.IdCentro = 2 ";
            break;

        default:
            $subcentro = " ";
            break;
    }


    $rechaza = "1 as FecRechazBool,";
    $agrupa = "group by Pacientes.IdPac, Presu.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo, Presu.NumPre, Pacientes.Tel1, Pacientes.TelMovil, Presu.Web";
    if ($id!=-1) {
        $rechaza = "case when Presu.FecRechaz is null then 0 else 1 end as FecRechazBool,";
        $agrupa = "group by Pacientes.IdPac, Presu.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo, Presu.NumPre, Pacientes.Tel1, Pacientes.TelMovil, Presu.FecRechaz, Presu.Web";
    }

    $sql = "
        select Pacientes.IdPac, Pacientes.NumPac, Presu.NumPre, Nombre, Apellidos,
        case when Presu.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        convert(varchar, FecPresup, 103) as Entrega,
        convert(varchar, Presu.FecAcepta, 103) as FecAcepta,
        convert(varchar, Presu.FecRechaz, 103) as FecRechaz,
        case when Presu.Web like '%*OP%' then 1 else 0 end as OpcionalBool,
        Titulo, sum( (ImportePre*(100-(ISNULL(Dto,0))))/100 ) as Importe,
        (select c.Notas from Presu c where Presu.NumPre = c.NumPre and Presu.IdPac = c.IdPac) as Notas,

        ".$rechaza."
        Pacientes.Tel1, Pacientes.TelMovil,
        (select count(*)
            from TtosMed
            where TtosMed.IdPac = Presu.IdPac and TtosMed.IdTipoOdg = 11 and datepart(hh,TtosMed.FecFin) = 11 and datepart(mi,TtosMed.FecFin) = 11
        ) as tieneRecall

        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac
        inner join PresuTto on (Presu.IdPac = PresuTto.IdPac) and (Presu.NumPre = PresuTto.NumPre)

        where FecPresup > '".$desde."'
        /*and Presu.FecAcepta is null and Presu.FecRechaz is null*/
        and PresuTto.StaTto = 7
        ".$subcentro."

        ".$agrupa."
        order by FecPresup desc"
    ;
    // echo $sql;
    recupera($id,$sql);
}

function getPresupuestosPacienteDesde(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;
    $desde = deget()->desde;

    $sql = "
        select Pacientes.NumPac, Presu.NumPre, Nombre, Apellidos,
        convert(varchar, FecPresup, 103) as FecPresup, Presu.FecAcepta,
        case when Presu.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        Presu.FecRechaz,
        case when Presu.FecRechaz is null then 1 else 0 end as FecRechazBool,
        Titulo, sum( (ImportePre*(100-(ISNULL(Dto,0))))/100 ) as Importe,
        Pacientes.Tel1, Pacientes.TelMovil,PresuTto.StaTto

        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac
        inner join PresuTto on (Presu.IdPac = PresuTto.IdPac) and (Presu.NumPre = PresuTto.NumPre)

        where FecPresup > '".$desde."' /*and Presu.FecAcepta is null and Presu.FecRechaz is null*/
        and (PresuTto.StaTto = 7 or PresuTto.StaTto = 8)
        and Pacientes.NumPac = '".$NumPac."'

        group by  Pacientes.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo, Presu.NumPre, Pacientes.Tel1, Pacientes.TelMovil,PresuTto.StaTto
        order by FecPresup desc"
    ;
    recupera($id,$sql);
}

function getPresupuestosPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;
    $NumPre = deget()->NumPre;

    $sql = "
        select Pacientes.NumPac, Presu.NumPre, Nombre, Apellidos,
        convert(varchar, FecPresup, 103) as FecPresup, Presu.FecAcepta,
        case when Presu.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        Presu.FecRechaz,
        case when Presu.FecRechaz is null then 1 else 0 end as FecRechazBool,
        Titulo, sum( (ImportePre*(100-(ISNULL(Dto,0))))/100 ) as Importe,
        Pacientes.Tel1, Pacientes.TelMovil

        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac
        inner join PresuTto on (Presu.IdPac = PresuTto.IdPac) and (Presu.NumPre = PresuTto.NumPre)

        where Presu.NumPre = '".$NumPre."' /*and Presu.FecAcepta is null and Presu.FecRechaz is null*/
        and (PresuTto.StaTto = 7 )
        /* and (PresuTto.StaTto = 7 or PresuTto.StaTto = 8) */
        and Pacientes.NumPac = '".$NumPac."'

        group by  Pacientes.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo, Presu.NumPre, Pacientes.Tel1, Pacientes.TelMovil, Presu.FecRechaz
        order by FecPresup desc"
    ;
    recupera($id,$sql);
}

function listaPresupuestosPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;

    $sql = "
        select Pacientes.NumPac, Presu.NumPre, Nombre, Apellidos,
        convert(varchar, FecPresup, 103) as FecPresup, Presu.FecAcepta,
        case when Presu.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        case when Presu.FecRechaz is null then 0 else 1 end as FecRechazBool,
        Titulo,
        Pacientes.Tel1, Pacientes.TelMovil

        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac

        where Pacientes.NumPac = '".$NumPac."'

        order by Presu.NumPre desc"
    ;
    recupera($id,$sql);
}

function getPresupuestosDetallesPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;
    $NumPre = deget()->NumPre;


    $sql = "
        select Pacientes.NumPac, PresuTto.NumPre, Nombre, Apellidos,
        convert(varchar, FecPresup, 103) as FecPresup, Presu.FecAcepta,
        Ttos.DescripMed, Ttos.DescripPac, Unidades, ImportePre, ISNULL(PresuTto.Dto,0) as Dto, (ImportePre*(100-(ISNULL(PresuTto.Dto,0))))/100 as ImporteFinal,
        case when PresuTto.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        PresuTto.FecAcepta,
        dbo.DameDientesAfectados(PresuTto.piezasadu,0) as Piezas,
        Pacientes.Tel1, Pacientes.TelMovil,PresuTto.StaTto,
        TtosMed.StaTto as ttomedsta


        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac
        inner join PresuTto on (Presu.IdPac = PresuTto.IdPac) and (Presu.NumPre = PresuTto.NumPre)
        inner join Ttos on PresuTto.IdTto = Ttos.IdTto
        left join TtosMed on (
            ( PresuTto.idpac = TtosMed.idpac and PresuTto.NumTto = TtosMed.NumTto )
        )
        where /*YEAR(FecPresup) = 2015 and Presu.FecAcepta is null and Presu.FecRechaz is null*/
        /* (PresuTto.StaTto = 7 or PresuTto.StaTto = 8) */
        (PresuTto.StaTto = 7)
        and Pacientes.NumPac = '".$NumPac."'
        and PresuTto.NumPre = ".$NumPre."

        /*group by  Pacientes.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo*/

        order by PresuTto.StaTto desc, FecPresup desc
    ";
    recupera($id,$sql);
}

function getPresupuestosPotencialesPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;
    $NumPre = deget()->NumPre;


    $sql = "
        select Pacientes.NumPac, PresuTto.NumPre, Nombre, Apellidos,
        convert(varchar, FecPresup, 103) as FecPresup, Presu.FecAcepta,
        Ttos.DescripMed, Ttos.DescripPac, Unidades, ImportePre, ISNULL(PresuTto.Dto,0) as Dto, (ImportePre*(100-(ISNULL(PresuTto.Dto,0))))/100 as ImporteFinal,
        case when PresuTto.FecAcepta is null then 0 else 1 end as FecAceptaBool,
        PresuTto.FecAcepta,
        dbo.DameDientesAfectados(PresuTto.piezasadu,0) as Piezas,
        Pacientes.Tel1, Pacientes.TelMovil,PresuTto.StaTto,
        TtosMed.StaTto as ttomedsta,
        case when (
                ( presutto.StaTto = 7 and ttosmed.StaTto = 8 ) or
                ( presutto.StaTto = 7 and ttosmed.StaTto = 3 ) or
                ( presutto.StaTto = 8 and ttosmed.StaTto = 8 )
        ) then 1 else 0 end  as potenciales

        from Presu

        inner join Pacientes on Presu.IdPac = Pacientes.IdPac
        inner join PresuTto on (Presu.IdPac = PresuTto.IdPac) and (Presu.NumPre = PresuTto.NumPre)
        inner join Ttos on PresuTto.IdTto = Ttos.IdTto
        left join TtosMed on ( PresuTto.idpac = TtosMed.idpac and PresuTto.numtto = TtosMed.numtto )

        where /*YEAR(FecPresup) = 2015 and Presu.FecAcepta is null and Presu.FecRechaz is null*/
        /* (PresuTto.StaTto = 7) */
        and Pacientes.NumPac = '".$NumPac."'
        and PresuTto.NumPre = ".$NumPre."

        /*group by  Pacientes.IdPac, Pacientes.NumPac, Nombre, Apellidos, FecPresup, Presu.FecAcepta, Titulo*/

        order by PresuTto.StaTto desc, FecPresup desc
    ";
    recupera($id,$sql);
}

function getPresupuestosAnotacionesPaciente(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;
    $NumPre = deget()->NumPre;


    $sql = "
        select
        Pacientes.NumPac, PresuTto.NumPre, PresuTto.Notas as notas

        from PresuTto
        inner join Pacientes on PresuTto.IdPac = Pacientes.IdPac

        where
        PresuTto.IdTipoOdg = 11
        and Pacientes.NumPac = '".$NumPac."'
        and PresuTto.NumPre = ".$NumPre
    ;
    recupera($id,$sql);
}

function getCitasSinMovil(){

    $id = deget()->centro;
    $fecha = deget()->fecha;

    $sql = "
        SELECT * FROM  (
            select Pacientes.Tel1, DCitas.Movil, DCitas.idpac, DCitas.idusu, DCitas.idorden, DCitas.Texto,
            DCitas.Fecha,DCitas.IdCita,
            convert(varchar, cast(CAST(hora / 86399.0 as datetime) as time), 108) as quehora, DCitas.Recordada,
            Pacientes.Nombre, Pacientes.Apellidos,
            tusuagd.Descripcio as boxllarg,

            ROW_NUMBER() OVER (PARTITION BY DCitas.Movil ORDER BY DCitas.hora ASC) as num

            from Pacientes

            right join DCitas on  Pacientes.idpac = DCitas.idpac
            left join tusuagd on DCitas.idusu=tusuagd.idusu

            WHERE
            DCitas.Fecha = CAST(CAST('".$fecha."' AS DATETIME) AS INT) + 2

            and DCitas.IdSitC = 0
            and DCItas.Movil = ''
        ) xx
        where xx.num = 1
        order by IdUsu
    ";

    recupera($id,$sql);
}

function marcaCitaAvisadaSinMovil(){
    $datos = depost();
    $id = $datos->centro;

    $sql = "
        UPDATE DCitas set Recordada = 1 WHERE
        IdUsu = ". $datos->idusu ."
        AND IdOrden = ". $datos->idorden."
    ";
    ejecutame($id, $sql);
}


function getCitas(){

    $id = deget()->centro;
    $dia = deget()->dia;


    $sql = "
        select DCitas.*,
        dcitasop.*,
        pacientes.*,
        tsitcita.*,
        tusuagd.Descripcio as box,

        /*CAMBIADO PARA BILBAO, FUNCIONA EN EL RESTO*/
        right( convert(datetime,CAST(hora / 86399.0 as datetime),108) ,8) as quehora,
        right( convert(datetime,CAST(horllegada / 86399.0 as datetime),108) ,8) as llega,

        /*
        convert(varchar, cast(CAST(hora / 86399.0 as datetime) ), 108) as quehora,
        convert(varchar, cast(CAST(horllegada / 86399.0 as datetime) ), 108) as llega,
        */        CAST(CAST('".$dia."' AS DATETIME) AS INT) + 2 as MIAFECHA,
        ".$dia." as DIA

        from DCitas

        left join dcitasop on dcitas.idusu=dcitasop.idusu and dcitas.idorden=dcitasop.idorden
        left join pacientes on pacientes.numpac=dcitas.numpac
        left join tsitcita on tsitcita.idsitc=dcitas.idsitc
        left join tusuagd on dcitas.idusu=tusuagd.idusu

        WHERE
        DCitas.Fecha = CAST(CAST('".$dia."' AS DATETIME) AS INT) + 2
        and tsitcita.Descripcio not like 'Anulada'
        order by tusuagd.Descripcio, hora asc

    ";


    recupera($id,$sql);
}

/*** calculos entre fechas ***/

function pptoPorFechas(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        SELECT
            count(distinct PresuTto.IdPac) as num,
            sum(ROUND( PresuTto.importepre - ((PresuTto.importepre * ISNULL(PresuTto.Dto,0) / 100)) ,0)) as pago
        FROM PresuTto
            left join TTos on PresuTto.IdTto = TTos.IdTto
        WHERE
        (PresuTto.StaTto = 7 or PresuTto.StaTto = 8) and
        /* (PresuTto.StaTto = 7 ) and */
        not PresuTto.importepre is null and PresuTto.importepre > 0 and
        fecini >=  '".$desde."' and fecini <= '".$hasta."'

    ";

    recupera($id,$sql);

}

function aceptadoPorFechas(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        SELECT
            count(distinct TtosMed.IdPac) as num,
            sum(ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0)) as pago
        FROM TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE
        (TtosMed.StaTto = 3 or TtosMed.StaTto = 5) and
        not TtosMed.importe is null and TtosMed.importe > 0 and
        fecini >=  '".$desde."' and fecini <= '".$hasta."'

    ";

    recupera($id,$sql);

}

function realizadoPorFechas(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        SELECT
            TtosMed.StaTto,
            count(distinct TtosMed.IdPac) as num,
            sum(ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0)) as pago
        FROM TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE
        (TtosMed.StaTto = 5) and
        not TtosMed.importe is null and TtosMed.importe > 0 and
       fecini >=  '".$desde."' and fecini <= '".$hasta."'

        GROUP BY TtosMed.StaTto
    ";

    recupera($id,$sql);

}

function seguimientoPorFechas(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        SELECT
            TtosMed.StaTto,
            count(distinct TtosMed.IdPac) as num,
            sum(ROUND( TtosMed.importe - ((TtosMed.importe * ISNULL(TtosMed.Dto,0) / 100)) ,0)) as pago
        FROM TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        WHERE
        (TtosMed.StaTto = 3) and
        not TtosMed.importe is null and TtosMed.importe > 0 and
        fecini >=  '".$desde."' and fecini <= '".$hasta."'

        GROUP BY TtosMed.StaTto
    ";

    recupera($id,$sql);

}

function primerasFecha(){

    $id = deget()->centro;
    $fecha = deget()->fecha;

    $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS', 'V1CO', 'VOCO'";

    $sql =  "
        SELECT
            TtosMed.IdPac,
            Pacientes.IdTrato,
            Pacientes.Nombre,
            Pacientes.Apellidos,
            Pacientes.Sexo,
            Pacientes.Email,
            DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
            YEAR(TtosMed.FecIni) as ano,
            MONTH(TtosMed.FecIni) as mes,
            DAY(TtosMed.FecIni) as dia,
            TTos.Codigo as visita
            /*count(TtosMed.IdPac) as num*/

        FROM TtosMed
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
        left join TTos on TtosMed.IdTto = TTos.IdTto

        WHERE TTos.Codigo in ( ".$codigos." )
        and TtosMed.StaTto = 5
        AND TtosMed.FecIni = '".$fecha."'
        /*and YEAR(TtosMed.FecIni) = YEAR(Pacientes.FecAlta)*/

        ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;
        ;";

    recupera($id,$sql);
}

function feinaGD(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        SELECT

        sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) and (presu.FecRechaz is null) then 1 else 0 end ) as entregado,
        round( sum( case when ( fecini >= '".$desde."' and fecini <= '".$hasta."' ) and (statto=7) and (presu.FecRechaz is null) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as dentregado,

        sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then 1 else 0 end ) as aceptado,
        round( sum( case when ( presutto.fecacepta >= '".$desde."' and presutto.fecacepta <= '".$hasta."' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as daceptado,

        sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then 1 else 0 end ) as rechazado,
        round( sum( case when ( presu.fecrechaz >= '".$desde."' and presu.fecrechaz <= '".$hasta."' and not presu.obsrechaz like '%*OP%' ) then ((ImportePre*(100-(ISNULL(Dto,0))))/100) else 0 end ) ,0)       as drechazado


        FROM presutto
        LEFT JOIN presu on presu.idpac=presutto.idpac and presu.numpre=presutto.numpre
    ";

    recupera($id,$sql);

}

function feinaPresusGD(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "
        select

        count(*),

        (SELECT count(*) FROM presu WHERE fecpresup >= '".$desde."' and fecpresup <= '".$hasta."') as pentregado ,
        (SELECT count(*) FROM presu WHERE fecacepta >= '".$desde."' and fecacepta <= '".$hasta."') as paceptado,
        (SELECT count(*) FROM presu WHERE fecrechaz >= '".$desde."' and fecrechaz <= '".$hasta."') as prechazado

        from Presu
    ";

    recupera($id,$sql);

}

function facturasEmitidas(){

    $id = deget()->id;

    $insql = "";
    $any = date('Y');
    for ( $i=$any-4; $i<$any; $i++ ){
        $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
    }
    $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

    $sql = "
            select
            docadmin.doc,docadmin.idemisor,docadmin.serie,docadmin.numdoc,docadmin.anyo,
            year(docadmin.fecdoc) as ano,
            month(docadmin.fecdoc) as mes,
            sum( linadmin.importe ) as pago
            into #unica
            from docadmin

            inner join linadmin on
            docadmin.doc = linadmin.doc and
            docadmin.idemisor = linadmin.idemisor and
            docadmin.serie = linadmin.serie and
            docadmin.numdoc = linadmin.numdoc and
            docadmin.anyo = linadmin.anyo

            where docadmin.doc = 'F'
            group by docadmin.doc,docadmin.idemisor,docadmin.serie,docadmin.numdoc,docadmin.anyo,month(docadmin.fecdoc), year(docadmin.fecdoc);

            select mes,".$insql." from #unica
            group by mes
            order by mes;
    ";

    retrieve($id,$sql);

}




?>

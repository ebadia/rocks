<?php
header('Content-type: text/plain; charset=utf-8');
header('Content-Transfer-Encoding: utf-8' );

ini_set('mssql.charset', 'UTF-8');
date_default_timezone_set('Europe/Berlin');

require 'flight/Flight.php';
require 'Postmark/Autoloader.php';
require 'Clockwork/class-Clockwork.php';
require 'ChromePhp.php';

require '../robots/textmagic/TextMagicAPI.php';

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

cors();

require('../conn-rocks.php');
// +++++ connexions globals ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getConnection() {
    return $dbh = getConnectionRocks();
}


Flight::route('GET /centros', 'centros');

Flight::route('GET /@name/@id', function($name, $id){
    echo "hello, $name ($id)!";
});

//********************************* MAIL
Flight::route('POST /sendMail', 'sendMail');

//********************************* MAIL
Flight::route('POST /sendSMS', 'sendSMS');
Flight::route('POST /sendSMSTM', 'sendSMSTM');
Flight::route('POST /putSMS', 'putSMS');
Flight::route('GET /citasSMS', 'citasSMS');
Flight::route('GET /citasNoSMS', 'citasNoSMS');
Flight::route('GET /cumplesSMS', 'cumplesSMS');
Flight::route('GET /SMS', 'SMS');
Flight::route('GET /confirmaSMS', 'confirmaSMS');
Flight::route('GET /citasNoSMSReprogramada', 'citasNoSMSReprogramada');
Flight::route('GET /citasNoSMSLlamada', 'citasNoSMSLlamada');


//********************************* USERS
Flight::route('POST /getUser', 'getUser');
Flight::route('POST /addUser', 'addUser');
Flight::route('POST /updateUser', 'updateUser');
Flight::route('GET /deleteUser', 'deleteUser');
Flight::route('GET /getUsers', 'getUsers');

Flight::route('GET /getCentros', 'getCentros');

//********************************* PTTOS
Flight::route('GET /getPptos', 'getPptos');
Flight::route('GET /getPptosMA', 'getPptosMA');
Flight::route('GET /getPpto', 'getPpto');
Flight::route('GET /getPptosPaciente', 'getPptosPaciente');
Flight::route('POST /addPpto', 'addPpto');
Flight::route('POST /addPptoExterno', 'addPptoExterno');
Flight::route('POST /duplicaPpto', 'duplicaPpto');
Flight::route('POST /updatePpto', 'updatePpto');
Flight::route('GET /deletePpto', 'deletePpto');
Flight::route('GET /aceptaPpto', 'aceptaPpto');
Flight::route('GET /noaceptaPpto', 'noaceptaPpto');
Flight::route('GET /denegadoPpto', 'denegadoPpto');
Flight::route('GET /convertidoPpto', 'convertidoPpto');
Flight::route('GET /opcionalPpto', 'opcionalPpto');
Flight::route('GET /graficosPpto', 'graficosPpto');
Flight::route('GET /purgaPpto', 'purgaPpto');
Flight::route('GET /lastPpto', 'lastPpto');
Flight::route('GET /listaTipo', 'listaTipo');
Flight::route('GET /listaABC', 'listaABC');

//********************************* INCENTIVOS
Flight::route('GET /getAprobadosHastaHoy', 'getAprobadosHastaHoy');
Flight::route('GET /getObjetivosDelTrimestre', 'getObjetivosDelTrimestre');
Flight::route('GET /facturacionDelMes', 'facturacionDelMes');
Flight::route('GET /facturacionDelAny', 'facturacionDelAny');


Flight::route('GET /getTtos', 'getTtos');

Flight::route('GET /colectivos', 'colectivos');
Flight::route('GET /quecolectivos', 'quecolectivos');
Flight::route('GET /quecolectivo', 'quecolectivo');
Flight::route('GET /incluye', 'incluye');
Flight::route('GET /ortodoncia', 'ortodoncia');

Flight::route('GET /getcontroles', 'getcontroles');
Flight::route('POST /addcontrol', 'addcontrol');
Flight::route('GET /deletecontrol', 'deletecontrol');

Flight::route('GET /getcolectivos', 'getcolectivos');
Flight::route('POST /addcolectivo', 'addcolectivo');
Flight::route('GET /deletecolectivo', 'deletecolectivo');

Flight::route('GET /getincluyes', 'getincluyes');
Flight::route('POST /addincluye', 'addincluye');
Flight::route('GET /deleteincluye', 'deleteincluye');

Flight::route('GET /creaColectivos', 'creaColectivos');

//********************************* RECALLS
Flight::route('GET /getRecalls', 'getRecalls');
Flight::route('GET /getRecallsActius', 'getRecallsActius');
Flight::route('GET /getPptoRecalls', 'getPptoRecalls');
Flight::route('POST /getRecall', 'getRecall');
Flight::route('POST /addRecall', 'addRecall');
Flight::route('POST /updateRecall', 'updateRecall');
Flight::route('GET /deleteRecall', 'deleteRecall');
Flight::route('GET /aceptaRecall', 'aceptaRecall');
Flight::route('GET /aceptaTodosRecalls', 'aceptaTodosRecalls');
Flight::route('GET /borraTodosRecalls', 'borraTodosRecalls');
Flight::route('GET /countRecallsActius', 'countRecallsActius');

//********************************* PRESUPOSTOS GESDENT
Flight::route('GET /comprueba', 'comprueba');
Flight::route('POST /altapaciente', 'altapaciente');
Flight::route('POST /actualizappto', 'actualizappto');
Flight::route('GET /getDatosPaciente', 'getDatosPaciente');

//********************************* FITXAR
Flight::route('GET /fichar', 'fichar');
Flight::route('POST /fichando', 'fichando');
Flight::route('GET /listafichado', 'listafichado');
Flight::route('GET /listadetallefichado', 'listadetallefichado');

//********************************* PERSONAL
Flight::route('GET /listarpersonal', 'listarpersonal');
Flight::route('GET /editarpersonal', 'editarpersonal');
Flight::route('GET /personalcentros', 'personalcentros');
Flight::route('GET /deletepersona', 'deletepersona');
Flight::route('POST /addpersona', 'addpersona');
Flight::route('POST /updatepersona', 'updatepersona');

//********************************* ESTADISTIQUES ROCKS DE CONTROL PER INCENTIUS
/*
Feina:
TMP: ticket medio propuesto = € propuestos / n propuestos

Oportunitat:
n presupuestos en seguimiento
€ presupuestos en seguimiento
A de 2,5mil a 8mil
B mas de 8mil
C menos de 2,5mil

Exit:
n aprobados
€ aprobados
TMA: ticket medio aceptacion del mes = € aprobado / n aprobado

recalls realizados = n llamadas / n total recalls a realizar
recalls citados = n citados / n total recalls a realizar
recalls resueltos = ( n citados + n cartas ) / n total recalls a realizar
*/
//********************************* 
Flight::route('GET /feina', 'feina');
Flight::route('GET /feina_ao', 'feina_ao');
Flight::route('GET /oportunitat', 'oportunitat');
Flight::route('GET /exito', 'exito');
Flight::route('GET /opcional', 'opcional');


//********************************* 

// TESTS
//getUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"login": "ebadia@eneresi.com", "password": "eneresi"}' http://localhost:8888/eneresi/bend/getUser
//addUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"nom": "nou", "login": "nou@eneresi.com", "password": "eneresi", "centreid": 1, "privilegisid": 0}' http://localhost:8888/eneresi/bend/addUser
//updateUser: curl -i -X POST -H 'Content-Type: application/json' -d '{"id": 3, "nom": "canviat", login": "ebadia@eneresi.com", "password": "cambiat"}' http://localhost:8888/eneresi/bend/updateUser
//deleteUser: curl -i -X GET  http://localhost:8888/eneresi/bend/deleteUser?id=4

//*********************************

Flight::start();

//*********************************
function retrieve($sql){


    try {
        $db = getConnection();
        $stmt = $db->query('SET CHARACTER SET utf8');
        $stmt = $db->query($sql);
        //$hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
        $hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);
        if (count($hisoc) != 0){
            $res["error"] = 0;
            $res["size"] = count($hisoc);
            $res["data"] = $hisoc;
            $res["sql"] = $sql;
            Flight::json($res);
        } else {
            // ya existe
            $res["error"] = 1;
            $res["data"] = [];
            $res["sql"] = $sql;
            Flight::json($res);
        }
        $db = null;
    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

function executa($s1,$s2,$s3){

    try {
        $db = getConnection();
        $stmt1 = $db->prepare($s1);
        $pide1 = $stmt1->execute();

        $stmt2 = $db->prepare($s2);
        $pide2 = $stmt2->execute();

        $stmt = $db->query('SET CHARACTER SET utf8');
        $stmt = $db->query($s3);
        $hisoc = $stmt->fetchAll(PDO::FETCH_OBJ);

        if (count($hisoc) != 0){
            $res["error"] = 0;
            $res["size"] = count($hisoc);
            $res["data"] = $hisoc;
            $res["sql"] = $s3;
            Flight::json($res);
        } else {
            // ya existe
            echo '{"error": 1, "text" : "Error." }';
        }
        $db = null;
    } catch(PDOException $e) {
        echo '{"error": 2 , "text":"'. $e->getMessage() .', "s3":"'. $s3 .'"}';
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
    //print_r($request);
    $datos = $request->body;
    //ChromePhp::log($datos);
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
    ->subject('Mensaje de EneresiRocks'. $objeto->tema)
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
function sendSMSTM() {
    
    $datos = depost();

    // -- datos de textmagic
    $user = "enricbadia";
    $password = "nzj3Telk8Z";

    $text = $datos->message;
    $to = preg_replace('/\s+/', '', $datos->to);
    $from = $datos->from;
    $cuando = false;
    if ( isset($cuando) && $cuando != "" ) {
        $cuando = $datos->cuando;
    }

    //-- conectamos con textmagic
    $api = new TextMagicAPI(array(
        "username" => $user, 
        "password" => $password
    ));

    $result = $api->send( utf8_decode($text), array($to), true, $cuando , $from );

    $res["error"] = 0;
    $res["data"] = $result;
    Flight::json($res);
}
//**********************************


//**********************************
function putSMS() {
    
    $objeto = depost();

    $sql = "INSERT INTO sms SET  
            fecha = '".$objeto->fecha."',  
            para = '".$objeto->to."',  
            message = '".$objeto->message."',  
            centre_id = '".$objeto->centre_id."',  
            motivo = '".$objeto->motivo."',  
            user_id = '".$objeto->user_id."'"
    ;
    
    ejecuta($sql);

}

//**********************************

//**********************************
function creaColectivos(){
    $id = deget()->id;

    $sql = "
        INSERT INTO `colectivos` (`nom`, `a`, `b`, `c`, `d`, `clinica_id`)
        VALUES
        ('Ninguno', 0, 10, 7, 5, ".$id."),
        ('Platino', 20, 15, 5, 0, ".$id."),
        ('Oro', 15, 10, 0, 0, ".$id."),
        ('Plata', 10, 5, 0, 0, ".$id.");
    ";

    ejectuta($sql);
}
//**********************************

//**********************************
function citasSMS() {
    
    $objeto = Flight::request();
    $fecha = $objeto->query->fecha;
    $centro = $objeto->query->centro;
    
    $sql = "
        select
        centroid
        , id
        , idcita
        , fecha
        , hora
        , status
        , confirmado
        , reprogramado
        , llamado
        , box
        , paciente
        , phone as movil
        , creado as envio_day
        , (select DISTINCT creado from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -2 ) order by id DESC limit 1) as respuesta_day
        , (select DISTINCT hora from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -2 ) order by id DESC limit 1) as hora_day
        , (select DISTINCT respuesta from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -2 ) order by id DESC limit 1) as respuesta_in
        , (select DISTINCT Confirmacion(texto,respuesta) from smsrecordatorios where phone = a.phone and texto is null  and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -2 ) order by id DESC  limit 1) as viene
        , (select DISTINCT datediff ( a.envio , creado ) from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -2 ) order by id DESC  limit 1) as tiempo_respuesta

        from smsrecordatorios a
        where fecha = '".$fecha."' and idcita is not NULL and centroid = '". $centro ."' 
        order by
        box ASC
        , phone ASC
        , envio ASC
        , id ASC
    ";
    retrieve($sql);
    
}

//**********************************//**********************************
function citasNoSMSLlamada() {
    
    $objeto = Flight::request();
    $id = $objeto->query->id;
    $fecha = date('Y-m-d');

    $sql = "UPDATE smsrecordatorios set llamado = '".$fecha."' where id = ". $id;

    ejecuta($sql);
}
//**********************************//**********************************
//**********************************//**********************************
function citasNoSMSReprogramada() {
    
    $objeto = Flight::request();
    $id = $objeto->query->id;

    $sql = "UPDATE smsrecordatorios set reprogramado = 1 where id = ". $id;

    ejecuta($sql);
}
//**********************************//**********************************

//**********************************//**********************************
function citasNoSMS() {
    
    $objeto = Flight::request();
    $fecha = $objeto->query->fecha;
    $centro = $objeto->query->centro;
    
    $sql = "
        select
        centroid
        , id
        , idcita
        , fecha
        , hora
        , status
        , confirmado
        , reprogramado
        , llamado
        , box
        , paciente
        , phone as movil
        , creado as envio_day
        , (select DISTINCT creado from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC limit 1) as respuesta_day
        , (select DISTINCT hora from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC limit 1) as hora_day
        , (select DISTINCT respuesta from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC limit 1) as respuesta_in
        , (select DISTINCT Confirmacion(texto,respuesta) from smsrecordatorios where phone = a.phone and texto is null  and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC  limit 1) as viene
        , (select DISTINCT datediff ( a.envio , creado ) from smsrecordatorios where phone = a.phone and texto is null and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC  limit 1) as tiempo_respuesta

        from smsrecordatorios a
        where fecha >= '".$fecha."' and idcita is not NULL and centroid = '". $centro ."' 
        and
        (select DISTINCT Confirmacion(texto,respuesta) from smsrecordatorios where phone = a.phone and texto is null  and (datediff ( a.envio , creado ) <= 0 and datediff ( a.envio , creado ) > -3 ) order by id DESC  limit 1) < 1
        order by
        box ASC
        , phone ASC
        , envio ASC
        , id ASC
    ";
    retrieve($sql);
    
}
//**********************************
//**********************************
function SMS() {
    
    $objeto = Flight::request();
    $fecha = $objeto->query->fecha;
    $centro = $objeto->query->centro;
    
    echo $sql = "
        select sms.*,
        personal.nom
        from sms
        left join personal on  personal.id = sms.user_id 
        where month(sms.fecha) = '".substr($fecha,4,2)."'and year(sms.fecha) = '".substr($fecha,0,4)."' and sms.centre_id = '". $centro."'
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function confirmaSMS() {
    
    $objeto = Flight::request();
    $id = $objeto->query->id;
    
    echo $sql = "update smsrecordatorios set confirmado = 1 where id = ". $id;

    ejecuta($sql);
    
}
//**********************************

//**********************************
function cumplesSMS() {
    
    $objeto = Flight::request();
    $fecha = $objeto->query->fecha;
    $centro = $objeto->query->centro;
    
    $sql = "
        select para from sms where fecha = '".$fecha."' and centre_id = '". $centro ."' and motivo = 'cumple'
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function getUser() {
    
    $objeto = depost();
    $login = $objeto->email;
    $password = $objeto->password;
    
    $sql = "select personal.*, 
        centres.telefono
        ,centres.adressa
        ,centres.localitat
        ,centres.provincia
        ,centres.cp
        ,centres.marca
        FROM personal 
        left join centres on centres.id = personal.centre_id 
        where personal.email like '".$login."' and personal.password like '".$password."'";
    retrieve($sql);
    
}
//**********************************
//**********************************
function getUsers() {
    
    $sql = "select personal.*, centres.telefono FROM personal 
        left join centres on centres.id = personal.centre_id ";

    retrieve($sql);    
}
//**********************************
//**********************************
function getCentros() {
        
    $sql = "select * FROM centres";
    retrieve($sql);
    
}
//**********************************

//**********************************
function colectivos() {
    
    $objeto = Flight::request();
    //$login = $objeto->email;
    //$password = $objeto->password;
    
    $sql = "select * FROM colectivos where clinica_id = ".$objeto->query->clinicaid;
    retrieve($sql);
    
}
//**********************************
//**********************************
function quecolectivos() {
    
    $objeto = Flight::request();
    //$login = $objeto->email;
    //$password = $objeto->password;
    
    $sql = "select * FROM quecolectivos where clinica_id = ".$objeto->query->clinicaid." and colectivo_id = ".$objeto->query->colectivoid;

    retrieve($sql);
    
}
//**********************************
//**********************************
function quecolectivo() {
    
    $objeto = Flight::request();
    //$login = $objeto->email;
    //$password = $objeto->password;
    
    $sql = "select * FROM quecolectivos where id = ".$objeto->query->id;

    retrieve($sql);
    
}
//**********************************
//**********************************
function ortodoncia() {
    
    $objeto = Flight::request();
    //$login = $objeto->email;
    //$password = $objeto->password;
    
    $sql = "select * FROM ortodoncia where clinica_id = ".$objeto->query->clinicaid;
    retrieve($sql);
    
}
//**********************************

//**********************************
function getcontroles() {
    
    $objeto = Flight::request();

    $sql = "select *, (nocontesta+noprograma+programado) as total 
    FROM controles 
    WHERE clinica_id = ".$objeto->query->centro .
    " ORDER BY ano DESC, mes DESC"
    ;

    retrieve($sql);
    
}
//**********************************

function addcontrol() {
    
    $objeto = depost();

    $sql = "INSERT INTO controles SET  
            ano = ".$objeto->ano.",  
            mes = ".$objeto->mes.",  
            programado = ".$objeto->programado.",  
            noprograma = ".$objeto->noprograma.",  
            nocontesta = ".$objeto->nocontesta.",  
            clinica_id = ".$objeto->clinica_id
    ;
    
    ejecuta($sql);

}

//**********************************
//**********************************
function deletecontrol() {

    $objeto = Flight::request();
    $sql = "DELETE from controles WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function getcolectivos() {
    
    $objeto = Flight::request();

    $sql = "select quecolectivos.id, quecolectivos.nom, colectivos.nom as tipo 
	FROM quecolectivos 
	LEFT JOIN colectivos ON colectivos.id = quecolectivos.colectivo_id 
	WHERE quecolectivos.clinica_id = ".$objeto->query->centro .
	" ORDER BY quecolectivos.colectivo_id ASC"
	;

    retrieve($sql);
    
}
//**********************************
//**********************************
function addcolectivo() {
    
    $objeto = depost();

    $sql = "INSERT INTO quecolectivos SET  
			nom = '".$objeto->nom."',  
			colectivo_id = ".$objeto->colectivo_id.",  
			clinica_id = ".$objeto->clinica_id
	;
    
    ejecuta($sql);

}

//**********************************
//**********************************
function deletecolectivo() {

    $objeto = Flight::request();
    $sql = "DELETE from quecolectivos WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function getincluyes() {
    
    $objeto = Flight::request();

    $sql = "select * 
	FROM incluye 
	ORDER BY sino ASC"
	;

    retrieve($sql);
    
}
//**********************************
//**********************************
function addincluye() {
    
    $objeto = depost();

    $sql = "INSERT INTO incluye SET  
			nom = '".$objeto->nom."',  
			sino = '".$objeto->sino."'" 
	;
    
    ejecuta($sql);

}

//**********************************
//**********************************
function deleteincluye() {

    $objeto = Flight::request();
    $sql = "DELETE from incluye WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************


//**********************************
function incluye() {
    
    $objeto = Flight::request();
    //$login = $objeto->email;
    //$password = $objeto->password;
    
    $sql = "select * FROM incluye where sino = '".$objeto->query->sino."'";

    retrieve($sql);
    
}
//**********************************

//**********************************
function addUser() {

    // comprueba que el tio no existe
    
    $objeto = depost();

    $sql = "INSERT INTO personal SET 
                nom =       '".$objeto->nom."', 
                email =     '".$objeto->login."', 
                password =  '".$objeto->password."', 
                centre_id =  ".$objeto->centreid.", 
                privilegis_id =  ".$objeto->privilegisid;
    
    ejecuta($sql);

}
//**********************************

//**********************************
function getPptos() {
    
    $objeto = Flight::request();
    if ( strtoupper($objeto->query->estado) == "TODOS")
        $sql = "
select pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom
FROM pressupostos 

LEFT JOIN recalls ON pressupostos.NumPac = recalls.NumPac 
left join tipotto on pressupostos.motiu_id = tipotto.id
left join centres on pressupostos.centre_id = centres.id

WHERE pressupostos.centre_id = ".$objeto->query->centro." and pressupostos.NumPac <> '-1' 
 
GROUP BY pressupostos.id 
ORDER BY pressupostos.entrega DESC
";
    else
        $sql = "
select pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom
FROM pressupostos 

LEFT JOIN recalls ON pressupostos.NumPac = recalls.NumPac 
left join tipotto on pressupostos.motiu_id = tipotto.id
left join centres on pressupostos.centre_id = centres.id

WHERE UPPER(pressupostos.estat) = '".strtoupper($objeto->query->estado)."' 
and pressupostos.centre_id = ".$objeto->query->centro."  and pressupostos.NumPac <> '-1'

GROUP BY pressupostos.id 
ORDER BY pressupostos.entrega DESC
";

    retrieve($sql);
        
}
//**********************************
//**********************************
function getPptosMA() {
    
    $objeto = Flight::request();
        $sql = "
select pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom
FROM pressupostos 

LEFT JOIN recalls ON pressupostos.id = recalls.pressupost_id 
left join tipotto on pressupostos.motiu_id = tipotto.id
left join centres on pressupostos.centre_id = centres.id

WHERE pressupostos.centre_id = ".$objeto->query->centro." 
    and pressupostos.NumPac <> ''
    and YEAR(entrega) = '".$objeto->query->ano."'
    and MONTH(entrega) = '".$objeto->query->mes."'

GROUP BY pressupostos.id 
ORDER BY pressupostos.entrega DESC
";


    retrieve($sql);
        
}
//**********************************

//**********************************
function getTtos() {
    
    $objeto = Flight::request();
    $sql = "select * from tipotto";

    retrieve($sql);
        
}
//**********************************

//**********************************
function getRecallsActius() {
    
    $objeto = Flight::request();
    
    //$sql = "select distinct recalls.*, pressupostos.pacient as nom, pressupostos.telefon as telefon, personal.nom as encarregat
    //    FROM recalls 
    //    inner JOIN pressupostos ON pressupostos.NumPac = recalls.NumPac  
    //    inner JOIN personal ON personal.id = recalls.responsable_id
    //    WHERE recalls.estat = 1 and pressupostos.centre_id = ".$objeto->query->centre."
    //    ORDER BY recalls.data DESC, recalls.id DESC
    //    ";
    $sql = "
        select distinct recalls.*, pressupostos.pacient as nom, pressupostos.telefon as telefon, personal.nom as encarregat
        FROM recalls 
        inner JOIN pressupostos ON pressupostos.NumPac = recalls.NumPac
        inner JOIN personal ON personal.id = recalls.responsable_id
        WHERE recalls.estat = 1 and centro = ".$objeto->query->centre."
        ORDER BY recalls.data ASC, recalls.id DESC
        ";
    retrieve($sql);
        
}
//**********************************
function countRecallsActius() {
    
    $objeto = Flight::request();
    
    $sql = "select count(*) as recalls
        FROM recalls 
        WHERE recalls.estat = 1 and centro = ".$objeto->query->centre
        ;
    retrieve($sql);
        
}
//**********************************

//**********************************
function graficosPpto() {
    
    $objeto = Flight::request();

    if ($objeto->query->mes == 0 ){
        $sql = "select 
                    YEAR(entrega) as any, 
                    MONTH(entrega) as mes, 
                    COUNT(*) as cuantos, 
                    SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) as cuantosaprobados,
                    ROUND( SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) / COUNT(*) *100, 1 ) as aprobacion,
                    SUM(import) as suma, 
                    SUM(IF(UPPER(estat)='ACEPTADO', import,0)) as sumaaprobados,
                    ROUND( SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) / COUNT(import) *100, 1 ) as ratiocuantos,
                    ROUND( SUM(IF( UPPER(estat)='ACEPTADO', import,0)) / SUM(import) *100, 1 ) as ratioaprobados
                    from pressupostos 
                WHERE YEAR(entrega)=".$objeto->query->any." and MONTH(entrega) > 0 and centre_id =".$objeto->query->centre."
                GROUP BY YEAR(entrega),MONTH(entrega)";
    } else {
            $sql = "select 
                YEAR(entrega) as any, 
                MONTH(entrega) as mes, 
                COUNT(*) as cuantos, 
                SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) as cuantosaprobados,
                ROUND( SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) / COUNT(*) *100, 1 ) as aprobacion,
                SUM(import) as suma, 
                SUM(IF(UPPER(estat)='ACEPTADO', import,0)) as sumaaprobados,
                ROUND( SUM(IF( UPPER(estat)='ACEPTADO', 1,0)) / COUNT(import) *100, 1 ) as ratiocuantos,
                ROUND( SUM(IF( UPPER(estat)='ACEPTADO', import,0)) / SUM(import) *100, 1 ) as ratioaprobados
                from pressupostos 
            WHERE YEAR(entrega)=".$objeto->query->any." and MONTH(entrega) = ".$objeto->query->mes." and centre_id =".$objeto->query->centre."
            GROUP BY YEAR(entrega),MONTH(entrega)";

    }
    retrieve($sql);
        
}
//**********************************

//**********************************
function getPpto() {
    
    $objeto = Flight::request();

    //$sql = "SELECT * FROM pressupostos where id = '".$objeto->query->id."'";
     $sql = "SELECT pressupostos.*, pressupostos.id as id, tipotto.nom as tto 
    FROM pressupostos 
    left join tipotto on pressupostos.motiu_id = tipotto.id 
    where pressupostos.id = '".$objeto->query->id."'";
   retrieve($sql);
    
}
//**********************************
function getPptosPaciente() {
    
    $NumPac = deget()->NumPac;
    $centro = deget()->centro;

    $sql = "SELECT pressupostos.*, pressupostos.id as id, tipotto.nom as tto 
    FROM pressupostos 
    left join tipotto on pressupostos.motiu_id = tipotto.id 
    where centre_id = ".$centro." and NumPac = '".$NumPac."'";
    /* where NumPac = ".$NumPac." AND estat = 'Seguimiento'"; */

    retrieve($sql);
    
}
//**********************************

//**********************************
function getPptoRecalls() {
    
    //$objeto = Flight::request();
    $NumPac = deget()->NumPac;

    $sql = "select recalls.*, count(recalls.id) as num, personal.nom as encarregat
        FROM recalls 

        INNER JOIN personal ON personal.id = recalls.responsable_id 

        WHERE recalls.NumPac = '".$NumPac."' and recalls.centro = ".deget()->centro."
        GROUP BY recalls.id
        ORDER BY recalls.data DESC, recalls.id DESC 
        ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function addPpto() {

    $objeto = depost();

    $sql = "INSERT INTO pressupostos SET 
                pacient =  '".$objeto->pacient."', 
                entrega =  '".date("Y-m-d")."', 
                edat   =  '".$objeto->edat."', 
                telefon   =  '".$objeto->telefon."', 
                responsable_id   =  '".$objeto->responsable."', 
                motiu_id   =  '".$objeto->motiu_id."', 
                notas   =  '".$objeto->notas."', 
                centre_id =  ".$objeto->centre.", 
                NumPac =  '".$objeto->NumPac."', 
                import  =  ".$objeto->import
    ;
     
    ejecuta($sql);

}
//**********************************
//**********************************
function addPptoExterno() {

    $objeto = depost();

    $sql = "INSERT INTO pacients SET 
                centro =  ".$objeto->centre.", 
                Apellidos =  '".$objeto->Apellidos."', 
                Nombre =  '".$objeto->Nombre."', 
                TelMovil =  '".$objeto->TelMovil."', 
                Email =  '".$objeto->Email."', 
                NumPac =  '".$objeto->NumPac."', 
                fechaalta =  '".date("Y-m-d")."'"
    ;
     
    ejecuta($sql);

}
//**********************************

//**********************************
function lastPpto() {

    $sql = "SELECT id,pacient FROM pressupostos ORDER BY id DESC LIMIT 1";
     
    retrieve($sql);

}
//**********************************

//**********************************
function duplicaPpto() {

    $objeto = depost();
    //echo json_last_error();
    //print_r($objeto);
    echo $sql = "INSERT INTO pressupostos SET 
                 pacient =  '".$objeto->pacient."', 
                 entrega =  '".date("Y-m-d")."', 
                 edat   =  '".$objeto->edat."', 
                 telefon   =  '".$objeto->telefon."', 
                 responsable_id   =  '".$objeto->responsable_id."', 
                 centre_id =  ".$objeto->centre_id
    ;
    
    ejecuta($sql);

}
//**********************************

//**********************************
function updatePpto() {

    $objeto = depost();

    echo mb_detect_encoding($objeto->notas);
    mb_convert_encoding($objeto->notas, "UTF-8", "auto");
    str_replace("\'", ",", $objeto->notas);

    $sql = "UPDATE pressupostos SET 
                 pacient =  '".$objeto->pacient."', 
                 edat   =  '".$objeto->edat."', 
                 telefon   =  '".$objeto->telefon."', 
                 motiu_id   =  '".$objeto->motiu_id."', 
                 notas   =  '".$objeto->notas."', 
                 entrega   =  '".$objeto->entrega."', 
                 NumPac   =  '".$objeto->NumPac."', 
                 import  =  ".$objeto->import ."
            WHERE id ='".$objeto->id."'";
    ;
     
    ejecuta($sql);

}
//**********************************

//**********************************
function purgaPpto() {

    $objeto = Flight::request();

    $sql = "UPDATE pressupostos SET 
                 estat =  'Rechazado' 
            WHERE entrega < '".$objeto->query->data."'
            and estat = 'Seguimiento'

            ";
    ;
     
    ejecuta($sql);

}
//**********************************

//**********************************
function addRecall() {

    $objeto = depost();

    $sql = "INSERT INTO recalls SET 
                 NumPac =  '".$objeto->NumPac."', 
                 data =  '".$objeto->data."', 
                 responsable_id =  '".$objeto->responsable."', 
                 pacient =  '".$objeto->pacient."', 
                 centro =  '".$objeto->centro."', 
                 notas   =  '".$objeto->notas."'"
     ;
     
     ejecuta($sql);

}
//**********************************

//**********************************
function aceptaRecall() {

    $objeto = Flight::request();
    $sql = "UPDATE recalls SET estat = 0 WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function aceptaTodosRecalls() {

    $objeto = Flight::request();
    $sql = "UPDATE recalls SET estat = 0 WHERE pressupost_id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function borraTodosRecalls() {

    $objeto = Flight::request();
    $sql = "DELETE from recalls WHERE pressupost_id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function aceptaPpto() {

    $objeto = Flight::request();
    $sql = "UPDATE pressupostos SET 
        acceptacio =  '".date("Y-m-d")."', estat = 'Aceptado' WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************
//**********************************
function noaceptaPpto() {

    $objeto = Flight::request();
    $sql = "UPDATE pressupostos SET acceptacio =  null, estat = 'Seguimiento'  WHERE id = '". $objeto->query->id."'";
    ejecuta($sql);

}
//**********************************
//**********************************
function denegadoPpto() {

    $objeto = Flight::request();
    $sql = "UPDATE pressupostos SET acceptacio =  null, estat = 'Rechazado' WHERE id = '". $objeto->query->id."'";
    ejecuta($sql);

}
//**********************************
//**********************************
function convertidoPpto() {

    $objeto = Flight::request();
    $sql = "UPDATE pressupostos SET 
        acceptacio =  '".date("Y-m-d")."', estat = 'Convertido' WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************
function opcionalPpto() {

    $objeto = Flight::request();
    $sql = "UPDATE pressupostos SET 
        acceptacio =  '".date("Y-m-d")."', estat = 'Opcional' WHERE id = ". $objeto->query->id;
    ejecuta($sql);

}
//**********************************

//**********************************
function deletePpto() {

    // comprueba que el tio no existe
    
    $request = Flight::request();
    $sql = "DELETE FROM pressupostos WHERE id = ".$request->query->id;

    ejecuta($sql);

}
//**********************************

//**********************************
function comprueba(){

    $id = deget()->centro;
    $NumPac = deget()->NumPac;

    $sql = "SELECT * FROM pacients WHERE NumPac = '".$NumPac ."' and centro = ". $id;
    retrieve($sql);
}

function altapaciente() {

    $objeto = depost();

    $sql = "INSERT INTO pacients SET 
                 centro =  '".$objeto->centro."', 
                 NumPac =  '".$objeto->NumPac."', 
                 Nombre =  '".$objeto->Nombre."', 
                 Apellidos =  '".$objeto->Apellidos."', 
                 Tel1 =  '".$objeto->Tel1."', 
                 TelMovil =  '".$objeto->TelMovil."', 
                 Tel2 =  '".$objeto->Tel2."', 
                 fechaalta =  '".date("Y-m-d")."', 
                 Email   =  '".$objeto->Email."'"
     ;
     
     ejecuta($sql);

}

function actualizappto() {

    $objeto = depost();

    $sql = "UPDATE pressupostos SET 
                colectivo =  '".$objeto->colectivo."', 
                quecolectivo =  '".$objeto->quecolectivo."', 
                idioma =  '".$objeto->idioma."', 
                import =  ".$objeto->import."  
            WHERE id = ". $objeto->id
     ;
     
    ejecuta($sql);

}

function getDatosPaciente(){

    $NumPac = deget()->NumPac;
    $centro = deget()->centro;

    $sql = "SELECT * FROM pacients WHERE centro =" .$centro. " and NumPac = '".$NumPac."'";
    retrieve($sql);
}


function getAprobadosHastaHoy(){

    $centro = deget()->centro;

    $hoy = date("Y-m-d");

    switch (date("m")) {
        case '01':
        case '02':
        case '03':
            # code...
            $inicio = 1;
            break;
        case '04':
        case '05':
        case '06':
            # code...
            $inicio = 4;
            break;
        case '07':
        case '08':
        case '09':
            # code...
            $inicio = 7;
            break;
        case '10':
        case '11':
        case '12':
            # code...
            $inicio = 10;
            break;
        
        default:
            # code...
            $inicio = 1;
            break;
    }

    $fin = $inicio +2;

/*
para analasis de incentivos trimestrales frontdesk
*/

    echo $sql = "select 
    ROUND( sum( IF (entrega <= '".$hoy."' AND UPPER(estat)='SEGUIMIENTO', 1, 0 ) ) )  AS cseguimiento,
    ROUND( sum( IF (entrega <= '".$hoy."' AND UPPER(estat)='SEGUIMIENTO', import, 0 ) ) )  AS seguimiento,
    ROUND( sum( IF (YEAR(acceptacio) = ".date("Y")." and  MONTH(acceptacio) >= ".$inicio." and MONTH(acceptacio)<= ".$fin." , 1, 0  ) ) ) AS caprobado,
    ROUND( sum( IF (YEAR(acceptacio) = ".date("Y")." and  MONTH(acceptacio) >= ".$inicio." and MONTH(acceptacio)<= ".$fin." , import, 0  ) ) ) AS aprobado
    from pressupostos 
    WHERE centre_id = " . $centro;

    retrieve($sql);
}

function getObjetivosDelTrimestre(){

    $centro = deget()->centro;

    $hoy = date("Y-m-d");

    switch (date("m")) {
        case '01':
        case '02':
        case '03':
            # code...
            $inicio = 1;
            break;
        case '04':
        case '05':
        case '06':
            # code...
            $inicio = 2;
            break;
        case '07':
        case '08':
        case '09':
            # code...
            $inicio = 3;
            break;
        case '10':
        case '11':
        case '12':
            # code...
            $inicio = 4;
            break;
        
        default:
            # code...
            $inicio = 1;
            break;
    }

/*
para analasis de incentivos trimestrales frontdesk
*/

    echo $sql = "select * from incentivos 
    WHERE centro_id = " . $centro . "
    and ano = ".date("Y")." and trimestre = ". $inicio
    ;

    retrieve($sql);
}

function centros(){

    $sql = "SELECT * FROM centres";
    retrieve($sql);
}

//**********************************
function feina(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

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

    where centre_id = ".$id." and pressupostos.NumPac <> '' 
    and (entrega >= '".$desde."' and entrega <= '".$hasta."')

    order by entrega"
    ;
    retrieve($sql);
}
//**********************************
function feina_ao(){

    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $sql = "

    select 

    sum( case when ( (entrega >= '".$desde."') and (entrega <= '".$hasta."') ) then 1 else 0 end )  as entregado,
    round( sum( case when ( (entrega >= '".$desde."') and (entrega <= '".$hasta."') ) then import else 0 end ) ,0 ) as dentregado,

    sum( case when ( (acceptacio >= '".$desde."') and (acceptacio <= '".$hasta."') ) then 1 else 0 end )  as aceptado,
    round( sum( case when ( (acceptacio >= '".$desde."') and (acceptacio <= '".$hasta."') ) then import else 0 end ) ,0 ) as daceptado,

    round( sum( case when ( estat = 'Seguimiento' and ( (entrega >= '".$desde."') and (entrega <= '".$hasta."') ) ) then import else 0 end ) ,0)    as dseguimiento,
    sum( case when ( estat = 'Seguimiento' and ( (entrega >= '".$desde."') and (entrega <= '".$hasta."') ) ) then 1 else 0 end )                    as seguimiento

    from pressupostos

    where centre_id = ".$id." and pressupostos.NumPac <> '' 

    order by entrega"
    ;

    retrieve($sql);
}

//**********************************
function feina_jt(){

    $id = deget()->centro;

    $sql = "
    select 
    YEAR(entrega) as ano,
    MONTH(entrega) as mes,

    count( import ) as entregado,
    round( sum( import ) ,0) as dentregado,

    round( sum( case when ( estat = 'Aceptado' ) then import else 0 end ) ,0)       as daceptado,
    sum( case when ( estat = 'Aceptado' ) then 1 else 0 end )                       as aceptado,

    round( sum( case when ( estat = 'Seguimiento' ) then import else 0 end ) ,0)      as dseguimiento,
    sum( case when ( estat = 'Seguimiento' ) then 1 else 0 end )                      as seguimiento,

    round( sum( case when ( estat = 'Rechazado' ) then import else 0 end ) ,0)      as drechazado,
    sum( case when ( estat = 'Rechazado' ) then 1 else 0 end )                      as rechazado,

    round( sum( case when ( estat = 'Aceptado' ) then 1 else 0 end ) / count( import ) ,2) * 100 as rexit,
    round( sum( import ) / count( import ) ,0) as TMP,
    round( sum( case when ( estat = 'Aceptado' ) then import else 0 end )/ sum( case when ( estat = 'Aceptado' ) then 1 else 0 end ) ,0)           as TMA


    from pressupostos

    where centre_id = ".$id."

    group by YEAR(entrega), MONTH(entrega)
    order by YEAR(entrega), MONTH(entrega)"
    ;
    retrieve($sql);
}

//**********************************
function exito(){

    $id = deget()->centro;
    //$mes = deget()->mes;
    //$any = deget()->any;

    $sql = "
    select YEAR(acceptacio) as ano, MONTH(acceptacio) as mes,

    count( import ) as aprobado,
    round( sum( import ) ,0) as daprobado,
    round( sum( import )  / count( import ) ,0) as raprobado


    from pressupostos

    where centre_id = ".$id."
    and  estat = 'Aceptado'

    group by YEAR(acceptacio), MONTH(acceptacio)
    order by YEAR(acceptacio), MONTH(acceptacio)"
    ;
    retrieve($sql);
}

//**********************************
function opcional(){

    $id = deget()->centro;
    //$mes = deget()->mes;
    //$any = deget()->any;

    $sql = "
    select YEAR(acceptacio) as ano, MONTH(acceptacio) as mes,

    count( import ) as aprobado,
    round( sum( import ) ,0) as daprobado,
    round( sum( import )  /
    count( import ) ,0) as raprobado


    from pressupostos

    where centre_id = ".$id."
    and  estat = 'Opcional'

    group by YEAR(acceptacio), MONTH(acceptacio)
    order by YEAR(acceptacio), MONTH(acceptacio)"
    ;
    retrieve($sql);
}

//**********************************
function oportunitat(){

    $id = deget()->centro;

    $sql = "
    select 

    round( sum( case when ( estat = 'Seguimiento' ) then import else 0 end ) ,0)    as dseguimiento,
    sum( case when ( estat = 'Seguimiento' ) then 1 else 0 end )        as seguimiento,


    sum( case when ( estat = 'Seguimiento' and (import >= 2500 and import < 8000 ) ) then 1 else 0 end )            as A,
    sum( case when ( estat = 'Seguimiento' and (import >= 8000 ) ) then 1 else 0 end )                              as B,
    sum( case when ( estat = 'Seguimiento' and (import < 2500 ) ) then 1 else 0 end )                               as C,

    round( sum( case when ( estat = 'Seguimiento' and (import >= 2500 and import < 8000 ) ) then import else 0 end ) ,0)       as dA,
    round( sum( case when ( estat = 'Seguimiento' and (import >= 8000 ) ) then import else 0 end ) ,0)                         as dB,
    round( sum( case when ( estat = 'Seguimiento' and (import < 2500 ) ) then import else 0 end ) ,0)                          as dC,

    round( sum( case when ( estat = 'Seguimiento' ) then import else 0 end ) / 
    sum( case when ( estat = 'Seguimiento' ) then 1 else 0 end ) ,0)        as TMS

    from pressupostos

    where centre_id = ".$id ."
    and  estat = 'Seguimiento'
    and NumPac <> ''"
    ;
    retrieve($sql);
}

//**********************************
function listaTipo() {
    
    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;

    $condicion = "";

    //switch (strtoupper($tipo)){
    //    case 'A':
    //        $condicion = " and pressupostos.estat = 'Seguimiento' and (import >= 2500 and import < 8000 ) ";
    //        break;
    //    case 'B':
    //        $condicion = " and pressupostos.estat = 'Seguimiento' and (import >= 8000 ) ";
    //        break;
    //    case 'C':
    //        $condicion = " and pressupostos.estat = 'Seguimiento' and (import < 2500  ) ";
    //        break;
    //}

        $sql = "
            SELECT pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom, 
                (select recalls.notas from recalls where pressupostos.NumPac = recalls.NumPac order by data desc limit 1) as nota 
            FROM pressupostos 

            LEFT JOIN recalls ON pressupostos.NumPac = recalls.NumPac 
            LEFT JOIN tipotto ON pressupostos.motiu_id = tipotto.id
            LEFT JOIN centres ON pressupostos.centre_id = centres.id

            WHERE pressupostos.centre_id = ".$id." AND pressupostos.NumPac <> '' AND pressupostos.estat = 'Seguimiento' 
            and ( pressupostos.entrega >= '".$desde."' and pressupostos.entrega <= '".$hasta."')
             
            GROUP BY pressupostos.id 
            ORDER BY pressupostos.entrega DESC
        ";


    retrieve($sql);
        
}

//**********************************
function listaABC() {
    
    $id = deget()->centro;
    $desde = deget()->desde;
    $hasta = deget()->hasta;
    $tipo = deget()->tipo;

    $condicion = "";

    switch (strtoupper($tipo)){
        case 'A':
            $condicion = " and pressupostos.estat = 'Seguimiento' and (import >= 2500 and import < 8000 ) ";
            break;
        case 'B':
            $condicion = " and pressupostos.estat = 'Seguimiento' and (import >= 8000 ) ";
            break;
        case 'C':
            $condicion = " and pressupostos.estat = 'Seguimiento' and (import < 2500  ) ";
            break;
    }

        $sql = "
            SELECT pressupostos.*, sum(recalls.estat) as recalls, tipotto.nom as tto, centres.nom, 
                (select recalls.notas from recalls where pressupostos.NumPac = recalls.NumPac order by data desc limit 1) as nota 
            FROM pressupostos 

            LEFT JOIN recalls ON pressupostos.NumPac = recalls.NumPac 
            LEFT JOIN tipotto ON pressupostos.motiu_id = tipotto.id
            LEFT JOIN centres ON pressupostos.centre_id = centres.id

            WHERE pressupostos.centre_id = ".$id." AND pressupostos.NumPac <> '' AND pressupostos.estat = 'Seguimiento' 
            ".$condicion."
             
            GROUP BY pressupostos.id 
            ORDER BY pressupostos.entrega DESC
        ";


    retrieve($sql);
        
}


//**********************************
function facturacionDelMes(){ 

    $id = deget()->id;
    $mes = deget()->mes;
    $ano = deget()->ano;

    $sql = "SELECT fact FROM objectius WHERE centro_id = ".$id." AND any = ".$ano." AND mes = ".$mes;

    retrieve($sql);
}

//**********************************
function facturacionDelAny(){ 

    $id = deget()->id;
    $ano = deget()->ano;

    $sql = "SELECT mes,fact FROM objectius WHERE centro_id = ".$id." AND any = ".$ano;

    retrieve($sql);
}

//**********************************
// FITXAR
//**********************************
function fichar(){ 

    $pin = deget()->pin;

    $sql = "SELECT * FROM personal WHERE pin = ".$pin;

    retrieve($sql);
}

//**********************************
function listafichado(){ 

    $mes = deget()->mes;
    $any = deget()->any;
    $centre = deget()->centre;

    /*
    $sql = "SELECT centre_id as centro, accion, DATE(fecha) as dia, TIME(fecha) as hora, nom as persona 
    FROM `inout`
    WHERE centre_id = ".$centre ." AND YEAR(fecha) = ".$any." AND MONTH(fecha)= ".$mes."
    ORDER BY nom ASC, fecha ASC"
    */
    ;
    $sql1 = "
    DROP TABLE IF EXISTS temporal;";
    $sql2 = "
    CREATE TABLE temporal
    select 
        io.nom
        ,date(io.fecha) as fecha
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) as in1
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) as out1
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) as in2
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) as out2

        , 

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  as morning

        , 
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  as evening
        , 
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  ) as tutto
        ,
    ceil(
    (
        hour(
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  )
        ) * 60 
    +
        minute(
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  )
        )
    ) / 60 )
        as alldayminutos

    from `inout` io
    WHERE centre_id = ".$centre ." AND YEAR(fecha) = ".$any." AND MONTH(fecha)= ".$mes."
    group by io.nom, date(io.fecha)
    ORDER BY io.nom ASC, io.fecha ;  
    ";

    $sql3 = "
    select nom, sum(alldayminutos) as horas from temporal group by nom order by nom;
    ";

    executa($sql1,$sql2,$sql3);
}

//**********************************
function listadetallefichado(){ 

    $mes = deget()->mes;
    $any = deget()->any;
    $centre = deget()->centre;

    $sql = "
    select 
        io.nom
        ,date(io.fecha) as fecha
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) as in1
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) as out1
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) as in2
        ,(select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) as out2

        , 

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  as morning

        , 
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  as evening
        , 
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  ) as tutto
        ,
    round(
    (
        hour(
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  )
        ) * 60 
    +
        minute(
    addtime(

        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'OUT' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) < '14:30:00' group by date(fecha)) )
    ,0)  

    ,
        if (    ((select time(fecha) from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)))<
                ((select time(fecha) from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha))),
    timediff( (select fecha from `inout` where io.nom = nom and accion = 'out' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) , (select fecha from `inout` where io.nom = nom and accion = 'in' and date(io.fecha) = date(fecha) and time(fecha) > '14:30:00' group by date(fecha)) )
    ,0)  )
        )
    ) / 60 )
        as alldayminutos

    from `inout` io
    WHERE centre_id = ".$centre ." AND YEAR(fecha) = ".$any." AND MONTH(fecha)= ".$mes."
    group by io.nom, date(io.fecha)
    ORDER BY io.nom ASC, io.fecha ;  
    ";

    retrieve($sql);
}

//**********************************
function ultimofichado(){ 

    $aux = deget()->aux;
    $centre = deget()->centre;

    $sql = "SELECT accion 
        from `inout`
        where personal_id = ".$aux." and centre_id = ".$centre." and date(fecha) = curdate()
        order by fecha desc
        limit 1
    ";

    retrieve($sql);
}


function fichando(){ 

    $objeto = depost();

    $sql = "INSERT INTO `inout` 
            ( fecha, accion, centre_id, nom, personal_id )
            VALUES 
            ('".date('Y-m-d H:i:s')."', '".$objeto->accion."', ".$objeto->centre_id.", '".$objeto->nom."', ".$objeto->id.");"
    ;
    //echo $sql;
    ejecuta($sql);
}

//**********************************
// PERSONAL
//**********************************
function listarpersonal(){ 

    $id = deget()->id;

    $sql = "SELECT * FROM personal WHERE centre_id = ".$id;

    retrieve($sql);
}

//**********************************
function editarpersonal(){ 

    $id = deget()->id;

    $sql = "SELECT * FROM personal WHERE id = ".$id;

    retrieve($sql);
}

//**********************************
function personalcentros(){
        
    $sql = "select id as value, nom as name from centres";
    retrieve($sql);
    
}

//**********************************
function addpersona(){

    $objeto = depost();

    $sql = "INSERT INTO `personal` 
            ( centre_id, email, nom, password, privilegis_id, super, pin )
            VALUES 
            (   ".$objeto->centre_id.", '".$objeto->email."', '".$objeto->nom."',
                '".$objeto->password."', ".$objeto->privilegis_id.",
                ".$objeto->super.", ".$objeto->pin." );"
    ;
    //echo $sql;
    ejecuta($sql);
}

//**********************************
function updatepersona(){

    $objeto = depost();

    $sql = "UPDATE `personal` SET
            centre_id       = ".$objeto->centre_id.", 
            email           = '".$objeto->email."', 
            nom             = '".$objeto->nom."', 
            password        = '".$objeto->password."', 
            privilegis_id   = ".$objeto->privilegis_id.", 
            super           = ".$objeto->super.",
            pin             = ".$objeto->pin."
            WHERE id = ".$objeto->id
            
    ;
    //echo $sql;
    ejecuta($sql);
}

//**********************************
function deletepersona(){ 

    $id = deget()->id;

    $sql = "DELETE FROM personal WHERE id = " . $id;

    //echo $sql;
    ejecuta($sql);
}


?>

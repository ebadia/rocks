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

require '../vendor/autoload.php';
use Postmark\PostmarkClient;
use Postmark\Models\PostmarkAttachment;
use Postmark\Models\PostmarkException;

//********************************* 
require '../conn-rocks.php';
//********************************* 
function getConnection() {
    return $dbh = getConnectionRocks();
}
//********************************* 

// +++++ intenta asegurar el API ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// if ( !array_key_exists("apikey",$_GET ) || !array_key_exists("apikey",$_POST )){

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // $request = Flight::request();
    // $datos = $request->body;
    $objeto = json_decode(Flight::request()->body);
    // print_r(Flight::request());
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



Flight::route('GET /centros', 'centros');

//********************************* MAIL
Flight::route('POST /sendMail', 'sendMail');
Flight::route('POST /sendPMail', 'sendPMail');

//********************************* MAIL
Flight::route('POST /sendSMS', 'sendSMS');
Flight::route('POST /putSMS', 'putSMS');
Flight::route('POST /savefile', 'savefile');


//********************************* USERS
Flight::route('POST /getUser', 'getUser');

//********************************* ARTICLES
Flight::route('GET /getArticle', 'getArticle');
Flight::route('GET /allArticles', 'allArticles');
Flight::route('GET /getArticles', 'getArticles');
Flight::route('POST /addarticle', 'addarticle');
Flight::route('POST /updatearticle', 'updatearticle');

//********************************* CARRO
Flight::route('GET /carro', 'carro');
Flight::route('GET /cartsize', 'cartsize');
Flight::route('POST /addtocart', 'addtocart');
Flight::route('POST /deletefromcart', 'deletefromcart');
Flight::route('POST /massdeletefromcart', 'massdeletefromcart');
Flight::route('POST /updatecart', 'updatecart');

//********************************* PEDIDOS
Flight::route('GET /pedidos', 'pedidos');
Flight::route('POST /addtopedido', 'addtopedido');
Flight::route('GET /pedidoinactivo', 'pedidoinactivo');
Flight::route('GET /pedidodevuelve', 'pedidodevuelve');
Flight::route('GET /pedidonuevacantidad', 'pedidonuevacantidad');
Flight::route('GET /pedidossize', 'pedidossize');
Flight::route('GET /devoluciones', 'devoluciones');

//********************************* RECIBIDOS
Flight::route('GET /recibidos', 'recibidos');
Flight::route('POST /addtorecibido', 'addtorecibido');
Flight::route('GET /recibidossize', 'recibidossize');

//********************************* GASTO
Flight::route('GET /getGasto', 'getGasto');
Flight::route('GET /getGastoAnual', 'getGastoAnual');

//********************************* PROVEEDORES
Flight::route('GET /proveidors', 'proveidors');
Flight::route('GET /allProveedores', 'allProveedores');
Flight::route('POST /updateproveedor', 'updateproveedor');
Flight::route('POST /addproveedor', 'addproveedor');

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
function sendPMail() {

    // Postmark: https://github.com/wildbit/postmark-php/wiki
    // Composer: https://getcomposer.org/download/
    // Ejecutar con: /Applications/MAMP/bin/php/php5.4.30/bin/php composer.phar require wildbit/postmark-php
    
    $objeto = depost();
    //print_r($objeto);

    $postmarkApiKey = "ed073a8d-3afd-4de4-b7f5-a92a2a476040";

    $client = new PostmarkClient($postmarkApiKey);

    //$attachment = PostmarkAttachment::fromFile(
    //    dirname(__FILE__)."/".$objeto->nom.".csv", 
    //    $objeto->nom.".csv", 
    //    "text/csv"
    //);
    $attachment = PostmarkAttachment::fromRawData(
        $objeto->contenido, 
        $objeto->nom.".csv", 
        "text/csv"
    );

    $destino_html = "</br></br></br><div>"
                ."Adjuntamos archivo de pedido de material."
                ."</br>Direccion de envio:"
                . "</br>Enéresi ". $objeto->centro->envio->localitat
                . "</br>". $objeto->centro->envio->adressa
                . "</br>". $objeto->centro->envio->cp 
                . "</br>". $objeto->centro->envio->localitat 
                . "</br>". $objeto->centro->envio->provincia 
                . "</br>Tel: ". $objeto->centro->telefono 
                . "</br></div></br></br></br>" ;
   $destino_raw = "\r\n\r\n\r\n\r\n"
                ."Adjuntamos archivo de pedido de material."
                ."\r\nDireccion de envio:"
                . "\r\nEnéresi ". $objeto->centro->envio->localitat
                . "\r\n". $objeto->centro->envio->adressa
                . "\r\n". $objeto->centro->envio->cp 
                . "\r\n". $objeto->centro->envio->localitat 
                . "\r\n". $objeto->centro->envio->provincia 
                . "\r\nTel: ". $objeto->centro->telefono 
                . "\r\n\r\n\r\n\r\n\r\n" ;

    try {
            $sendResult = $client->sendEmail(
                "ebadia@eneresi.com", 
                $objeto->mail, 
                $objeto->tipo . " Eneresi",
                "<div><b>".$objeto->tipo." para ".$objeto->nom.".</b></div>".$destino_html,
                $objeto->tipo . " para ".$objeto->nom.".".$destino_raw,
                NULL, 
                true, 
                "ebadia@eneresi.com", 
                "enric@ideatius.com,".$objeto->centro->email, 
                NULL,
                NULL, 
                [$attachment]);
            //echo "ok";
    } catch ( PostmarkException $ex ) {
            // Calls to the $client can throw an exception 
            // if the request to the API times out.
            echo "error" . $ex;
    }

}
//**********************************

//**********************************
function savefile() {
    
    $objeto = depost();

    $myfile = fopen($objeto->nom.".csv", "w") or die("Unable to open file!");
    $txt = $objeto->contenido;
    fwrite($myfile, $txt);
    fclose($myfile);

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
function putSMS() {
    
    $objeto = depost();

    $sql = "INSERT INTO sms SET  
            fecha = '".$objeto->fecha."',  
            para = '".$objeto->to."',  
            message = '".$objeto->message."',  
            centre_id = '".$objeto->centre_id."',  
            user_id = '".$objeto->user_id."'"
    ;
    
    ejecuta($sql);

}

//**********************************
//**********************************
function getUser() {
    
    $objeto = depost();
    $login = $objeto->email;
    $password = $objeto->password;
    
    $sql = "select personal.*, centres.telefono FROM personal 
        left join centres on centres.id = personal.centre_id 
        where personal.email like '".$login."' and personal.password like '".$password."'";
    retrieve($sql);
    
}
//**********************************

//**********************************
function getArticle() {

    $item = deget()->item;
    $sql = "select articles.*,proveidors.nom as proveidor from articles
                left join proveidors on proveidors.id = articles.proveidor_id
                where articles.ref = ". $item
                /*limit 200*/
    ;
    retrieve($sql);
    
}
//**********************************
function allArticles() {
        
    $sql = "select articles.*,proveidors.nom as proveidor from articles
                left join proveidors on proveidors.id = articles.proveidor_id
                /*where articles.id not in ( select articulo_id from carro )*/
                /*limit 200*/
    ";
    retrieve($sql);
    
}
//**********************************
//**********************************

//**********************************
function allProveedores() {
        
    $sql = "select proveidors.* from proveidors
    ";
    retrieve($sql);
    
}
//**********************************

//**********************************
function proveidors() {
        
    $sql = "select id as value, nom as name from proveidors";
    retrieve($sql);
    
}
//**********************************

//**********************************
function carro() {

    $centro = deget()->centro;
    $sql = "select carro.*,
                    articles.nom as article, articles.ref as article_ref, articles.pga as pga,
                    proveidors.nom as proveidor, proveidors.id as proveidor_id, proveidors.email as proveidor_email 
                from carro
                left join articles on articles.id = carro.articulo_id
                left join proveidors on proveidors.id = articles.proveidor_id
                where centre_id = ". $centro ."
                order by proveidor_id"
    ;
    retrieve($sql);
    
}
//**********************************

//**********************************
function pedidos() {

    $centro = deget()->centro;
    $sql = "select pedidos.*,
                    articles.nom as article, articles.ref as article_ref, articles.pga as pga, 
                    proveidors.nom as proveidor, proveidors.id as proveidor_id, proveidors.email as proveidor_email
                from pedidos
                left join articles on articles.id = pedidos.articulo_id
                left join proveidors on proveidors.id = articles.proveidor_id
                where centre_id = ". $centro ." and procesado = 0
                order by proveidor_id"
    ;
    retrieve($sql);
    
}
//**********************************
//**********************************
function devoluciones() {

    $centro = deget()->centro;
    $sql = "select pedidos.*,
                    articles.nom as article, articles.ref as article_ref, articles.pga as pga, 
                    proveidors.nom as proveidor, proveidors.id as proveidor_id, proveidors.email as proveidor_email
                from pedidos
                left join articles on articles.id = pedidos.articulo_id
                left join proveidors on proveidors.id = articles.proveidor_id
                where centre_id = ". $centro ." and procesado = -1
                order by proveidor_id"
    ;
    retrieve($sql);
    
}
//**********************************

//**********************************
function recibidos() {

    $centro = deget()->centro;
    $sql = "select recibidos.*,
                    articles.nom as article, articles.ref as article_ref, articles.pga as pga, 
                    proveidors.nom as proveidor, proveidors.id as proveidor_id, proveidors.email as proveidor_email
                from recibidos
                left join articles on articles.id = recibidos.articulo_id
                left join proveidors on proveidors.id = articles.proveidor_id
                where centre_id = ". $centro ." 
                order by proveidor_id, procesado ASC
                limit 50
                "
    ;
    retrieve($sql);
    
}
//**********************************

//**********************************
function addtocart() {
    
    $objeto = depost();
    //$objeto = Flight::request()->data;
    //print_r(Flight::request()->data->cantidad);

    $sql = "INSERT INTO carro SET 
                cantidad =  '".$objeto->cantidad."', 
                fecha =     '".$objeto->fecha."', 
                centre_id =  '".$objeto->centre_id."', 
                articulo_id =  '".$objeto->id."'";
    
    ejecuta($sql);

}
//**********************************

//**********************************
function addarticle() {
    
    $objeto = depost();

    $sql = "INSERT INTO articles SET 
                ref =  '".$objeto->ref."', 
                nom =  '".$objeto->nom."', 
                iva =  '".$objeto->iva."', 
                lote =  '".$objeto->lote."', 
                pvp =   ".$objeto->pvp.", 
                pga =   ".$objeto->pga.", 
                minimo =   ".$objeto->minimo.", 
                proveidor_id =  '".$objeto->proveidor_id."'";
    
    ejecuta($sql);

}
//**********************************

//**********************************
function addproveedor() {
    
    $objeto = depost();

    $sql = "INSERT INTO proveidors SET 
                nom =     '".$objeto->nom."', 
                email =  '".$objeto->email."'";
    
    ejecuta($sql);

}
//**********************************

//**********************************
function addtorecibido() {
    
    $objeto = depost();
    //$objeto = Flight::request()->data;
    //print_r(Flight::request()->data->cantidad);

    $sql = "INSERT INTO recibidos SET 
                cantidad =  '".$objeto->cantidad."', 
                fecha =     '".date("Y-m-d")."', 
                centre_id =  '".$objeto->centre_id."', 
                articulo_id =  '".$objeto->articulo_id."'";
    
    ejecuta($sql);

}
//**********************************

//**********************************
function deletefromcart() {
    
    $objeto = depost();
    //$objeto = Flight::request()->data;
    //print_r(Flight::request()->data->cantidad);

    $sql = "DELETE FROM carro where id = ". $objeto->id;
    
    ejecuta($sql);

}
//**********************************
//**********************************
function massdeletefromcart() {
    
    $oo = json_decode( Flight::request()->body );

    $valores = "DELETE FROM carro WHERE id IN ( ";
    foreach ($oo->compras as $value) {
        $valores = $valores . "\"" . $value->id . "\"," ;
    }
    // quito la coma final
    $valores = substr($valores,0,strlen($valores)-1)." );";
    
    ejecuta($valores);

}
//**********************************

//**********************************
function updatecart() {
    
    $objeto = depost();

    $sql = "UPDATE carro SET 
        cantidad = ". $objeto->cantidad ."
        where id = ". $objeto->id;
    
    ejecuta($sql);

}
//**********************************

//**********************************
function updatearticle() {
    
    $objeto = depost();

    $sql = "UPDATE articles SET 
                ref =  '".$objeto->ref."', 
                nom =     '".$objeto->nom."', 
                iva =  '".$objeto->iva."', 
                lote =  '".$objeto->lote."', 
                pvp =   ".$objeto->pvp.", 
                pga =   ".$objeto->pga.", 
                minimo =   ".$objeto->minimo.", 
                proveidor_id =  '".$objeto->proveidor_id."' 
        where id = ". $objeto->id;
    
    ejecuta($sql);

}
//**********************************
//**********************************
function updateproveedor() {
    
    $objeto = depost();

    $sql = "UPDATE proveodors SET 
                nom =     '".$objeto->nom."', 
                email =  '".$objeto->email."' 
        where id = ". $objeto->id;
    
    ejecuta($sql);

}
//**********************************

//**********************************
function pedidoinactivo() {
    
    $id = deget()->id;

    $sql = "UPDATE pedidos SET procesado = 1
        where id = ". $id;
    
    ejecuta($sql);

}
//**********************************
//**********************************
function pedidonuevacantidad() {
    
    $id = deget()->id;
    $q = deget()->q;

    $sql = "UPDATE pedidos SET cantidad = ". $q ."
        where id = ". $id;
    
    ejecuta($sql);

}
//**********************************
//**********************************
function pedidodevuelve() {
    
    $id = deget()->id;

    $sql = "UPDATE pedidos SET procesado = -1, motivo = '" . deget()->motivo ."' 
        where id = ". $id;
    
    ejecuta($sql);

}
//**********************************


//**********************************
function cartsize() {

    $centro = deget()->centro;
    $sql = "select count(*) as size from carro
                where centre_id = ". $centro
    ;
    retrieve($sql);
    
}
//**********************************
//**********************************
function pedidossize() {

    $centro = deget()->centro;
    $sql = "select count(*) as size from pedidos
                where centre_id = ". $centro ." and procesado = 0"
    ;
    retrieve($sql);
    
}
//**********************************
//**********************************
function recibidossize() {

    $centro = deget()->centro;
    $sql = "select count(*) as size from recibidos
                where centre_id = ". $centro ." and procesado = 0"
    ;
    retrieve($sql);
    
}
//**********************************

//**********************************
function addtopedido() {
    
    $objeto = depost();
    $oo = json_decode( Flight::request()->body );

    

    
    $valores = "INSERT INTO pedidos (cantidad,fecha,centre_id,articulo_id) VALUES ";
    foreach ($oo->datos as $value) {
        // print_r($value->cantidad);
        $valores = $valores . "(\"" .
            $value->cantidad."\",\"".date("Y-m-d")."\",\"".$value->centre_id."\",\"".$value->articulo_id .
            "\"),"
        ;
    }

    // pongo el punto y coma final
    $valores = substr($valores,0,strlen($valores)-1).";";
    
    ejecuta($valores);
    

}
//**********************************

//**********************************
function getGasto() {

    $centro = deget()->centro;
    $en = deget()->en;
    $fecha = explode(".",$en);

    echo $sql = "
        select 
        sum(recibidos.cantidad*articles.pga) as gasto
        from recibidos
        left join articles on articles.id = recibidos.articulo_id
        where centre_id = ".$centro."
        and MONTH(fecha)=".$fecha[1]."
        and YEAR(fecha)=".$fecha[0]
    ;
    retrieve($sql);
    
}
//**********************************
//**********************************
function getGastoAnual() {

    $centro = deget()->centro;
    $en = deget()->en;
    $fecha = explode(".",$en);

    echo $sql = "
        select 
        sum(recibidos.cantidad*articles.pga) as gasto
        from recibidos
        left join articles on articles.id = recibidos.articulo_id
        where centre_id = ".$centro."
        and YEAR(fecha)=".$fecha[0]
    ;
    retrieve($sql);
    
}
//**********************************


?>

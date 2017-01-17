<?php
// control del origen
# First check whether the Origin header exists
if ( $_SERVER['HTTP_ORIGIN'] == 'http://www.eneresi.rocks' ) 
    $send_header  = 'Access-Control-Allow-Origin: http://www.eneresi.rocks';
if ( $_SERVER['HTTP_ORIGIN'] == 'http://eneresi.rocks' ) 
    $send_header  = 'Access-Control-Allow-Origin: http://eneresi.rocks';
if ( $_SERVER['HTTP_ORIGIN'] == 'http://eneresi.local' ) 
    $send_header  = 'Access-Control-Allow-Origin: http://eneresi.local';

//header('Access-Control-Allow-Origin: http://'.$filtered_url );  //I have also tried the * wildcard and get the same response
header($send_header);
header("Access-Control-Allow-Credentials: true");
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

//********************************* 
require '../conn-clinicas.php';
//********************************* 
function getConnection($id) {
    return $dbh = getConnectionGesdent($id);
}
//********************************* 


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

// retorna la ip publica de la instalacion para comprobar si estamos dentro de un centro
//$externalContent = file_get_contents('http://checkip.dyndns.com/');
//preg_match('/Current IP Address: \[?([:.0-9a-fA-F]+)\]?/', $externalContent, $m);
//$externalIp = $m[1];
$externalIp =  get_client_ip();
// +++++ retorna la ip publica ++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//********************************* ESTADISTICAS DE Tablero 
Flight::route('GET /TB_ImplantesColocados'           , 'TB_ImplantesColocados');
Flight::route('GET /TB_ProtesisSobreImplantes'       , 'TB_ProtesisSobreImplantes');
Flight::route('GET /TB_ProtesisHibridas'             , 'TB_ProtesisHibridas');
Flight::route('GET /TB_ProtesisFija'                 , 'TB_ProtesisFija');
Flight::route('GET /TB_ProtesisRemovible'            , 'TB_ProtesisRemovible');
Flight::route('GET /TB_OrtodonciaFija'               , 'TB_OrtodonciaFija');
Flight::route('GET /TB_Invisalign'                   , 'TB_Invisalign');
Flight::route('GET /TB_OrtodonciaInterceptiva'       , 'TB_OrtodonciaInterceptiva');
Flight::route('GET /TB_OrtodonciaFI'                 , 'TB_OrtodonciaFI');
Flight::route('GET /TB_OrtodonciaTotal'              , 'TB_OrtodonciaTotal');
Flight::route('GET /TB_Carillas'                     , 'TB_Carillas');
Flight::route('GET /TB_CarillaCeramica'              , 'TB_CarillaCeramica');
Flight::route('GET /TB_CarillaComposite'             , 'TB_CarillaComposite');
Flight::route('GET /TB_Blanqueamiento'               , 'TB_Blanqueamiento');
Flight::route('GET /TB_EsteticaFacial'               , 'TB_EsteticaFacial');
Flight::route('GET /TB_DPH'                          , 'TB_DPH');
Flight::route('GET /TB_DPHColectivos'                , 'TB_DPHColectivos');
Flight::route('GET /TB_RevisionesConservadora'       , 'TB_RevisionesConservadora');
Flight::route('GET /TB_RevisionesOdontopediatria'    , 'TB_RevisionesOdontopediatria');
Flight::route('GET /TB_MantenimientosPeridontales'   , 'TB_MantenimientosPeridontales');
Flight::route('GET /TB_RevisionesHibrida'            , 'TB_RevisionesHibrida');

Flight::route('GET /especialidadesRatios'            , 'especialidadesRatios');
Flight::route('GET /unRatio'            , 'unRatio');

//*********************************

Flight::start();

//*********************************


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

// controles estadisticos

//*********************************
function losratios($id,$sql){

    global $clinicas;

    // si venimos de poner un negativo al centro para calculo de antiguedad hay que cambarselo
    // para que conecte al gesdent adecuado.
    if ($id<0) $id = $id * -1;

    try {
        $db = getConnection($id);
        mssql_select_db($clinicas[$id][3], $db);

        $query = mssql_query($sql);
        $res = [];

        $num = mssql_num_rows($query);
        
        if ( $num > 0 ){
            while ($row = mssql_fetch_object($query)) {
                //$res["data"] = $row;
                $res = $row;
            }
        } else {
            // por si no hay datos en gesdent
            $res = (object) array();;
        }

        mssql_free_result($query);
        return $res;

    } catch(PDOException $e) {
        echo '{"error": 2, "data": {"text":'. $e->getMessage() .'}}';
    }

}

function sqlratios($id,$esp,$ano){

    //$ano = date('Y');
    //$mes = date('n');

    $sql = "
    IF OBJECT_ID('tempdb..#temp', 'U') IS NOT NULL 
            drop table #temp

    DECLARE @minim  INT
    SET @minim = 0

    SELECT  YEAR(FecIni) ano, MONTH(FecIni) mes, TtosMed.IdPac,
            round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3)) THEN 1 ELSE 0 END ) ,0) as tentregado,
            round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 )) THEN 1 ELSE 0 END ) ,0) as cuentaaprobado,
            round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3)) THEN ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2) ELSE 0 END ) ,0) as tpresupuestado,
            round( SUM( CASE WHEN (not TtosMed.Importe is null and (TtosMed.StaTto = 5 )) THEN ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2) ELSE 0 END ) ,0) as tfacturado,
            round( sum(ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2)) ,0) as trealizado,
            round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 )) THEN TtosMed.Actos ELSE 0 END ) ,0) as tactosok,
            round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3)) THEN TtosMed.Actos ELSE 0 END ) ,0) as tactosko,
            CASE WHEN ( DATEDIFF(hour,Pacientes.FecAlta,TtosMed.FecIni)/8766) = 0 THEN 0 ELSE 1 END  AS edad

    INTO #temp

    FROM    TtosMed
    left join TTos on TtosMed.IdTto = TTos.IdTto
    left join Pacientes on TtosMed.IdPac = Pacientes.IdPac

    WHERE TTos.Codigo in ( ".$esp." )
    AND YEAR(TtosMed.FecIni) = ".$ano." 

    GROUP BY TtosMed.IdPac,TtosMed.FecIni,Pacientes.FecAlta,YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
    ORDER BY MONTH(TtosMed.FecIni)
    ";

    if ($id > 1){
        $sql = "
        IF OBJECT_ID('tempdb..#temp', 'U') IS NOT NULL 
                drop table #temp

        DECLARE @minim  INT
        SET @minim = 0

        SELECT  YEAR(FecIni) ano, MONTH(FecIni) mes, TtosMed.IdPac, 
                round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 or TtosMed.StaTto = 8)) THEN 1 ELSE 0 END ) ,0) as tentregado,
                round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 )) THEN 1 ELSE 0 END ) ,0) as cuentaaprobado,
                round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 or TtosMed.StaTto = 8)) THEN ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2) ELSE 0 END ) ,0) as tpresupuestado,
                round( SUM( CASE WHEN (not TtosMed.Importe is null and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 )) THEN ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2) ELSE 0 END ) ,0) as tfacturado,
                round( sum(ROUND( Importe - ((Importe * ISNULL(Dto,0) / 100)) ,2)) ,0) as trealizado,
                round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 )) THEN TtosMed.Actos ELSE 0 END ) ,0) as tactosok,
                round( SUM( CASE WHEN (Importe > @minim and (TtosMed.StaTto = 5 or TtosMed.StaTto = 3 or TtosMed.StaTto = 8)) THEN TtosMed.Actos ELSE 0 END ) ,0) as tactosko,
                CASE WHEN ( DATEDIFF(hour,Pacientes.FecAlta,TtosMed.FecIni)/8766) = 0 THEN 0 ELSE 1 END  AS edad

        INTO #temp

        FROM    TtosMed
        left join TTos on TtosMed.IdTto = TTos.IdTto
        left join Pacientes on TtosMed.IdPac = Pacientes.IdPac

        WHERE TTos.Codigo in ( ".$esp." )
        AND YEAR(TtosMed.FecIni) = ".$ano." 

        GROUP BY TtosMed.IdPac,TtosMed.FecIni,Pacientes.FecAlta,YEAR(TtosMed.FecIni), MONTH(TtosMed.FecIni)
        ORDER BY MONTH(TtosMed.FecIni)
        ";
    }

    $sql = $sql;

    if ( $id > 0 ){
        // calculo para cada centro en concreto
        $sql = $sql . "
        select 
        ano,
        sum(tentregado) as entregado, 
        sum(cuentaaprobado) as aprobado, 
        sum(tpresupuestado) as presupuestado,
        sum(tfacturado) as facturado,
        sum(trealizado) as pres_sin_minimo,

        CASE WHEN ( sum(tentregado) > 0 ) THEN ROUND( sum(tpresupuestado) / sum(tentregado) ,0) ELSE 0 END as PMP,
        CASE WHEN ( sum(cuentaaprobado) > 0 ) THEN ROUND( sum(tfacturado) / sum(cuentaaprobado) ,0) ELSE 0 END as TPC,
        CASE WHEN ( sum(tpresupuestado) > 0 ) THEN ROUND( 100 * sum(tfacturado) / sum(tpresupuestado) ,0) ELSE 0 END as Efectividad,
        CASE WHEN ( sum(tentregado) > 0 ) THEN (100 * sum(cuentaaprobado) / sum(tentregado) ) ELSE 0 END as OC,

        CASE WHEN ( sum(cuentaaprobado) > 0 ) THEN ROUND( 100 * sum(tactosok) / sum(cuentaaprobado) ,0 ) ELSE 0 END as actosok,

        ROUND( sum(tpresupuestado) / sum(tactosko) ,0 ) as PrecioM


        from #temp GROUP BY ano ORDER BY ano
        ";
       
    } else {
        // calculo para cada la antiguedad del paciente
        $sql = $sql . "
        select 
        edad,
        sum(tentregado) as entregado, 
        sum(cuentaaprobado) as aprobado, 
        sum(tpresupuestado) as presupuestado,
        sum(tfacturado) as facturado,
        sum(trealizado) as pres_sin_minimo,

        CASE WHEN ( sum(tentregado) > 0 ) THEN ROUND( sum(tpresupuestado) / sum(tentregado) ,0) ELSE 0 END as PMP,
        CASE WHEN ( sum(cuentaaprobado) > 0 ) THEN ROUND( sum(tfacturado) / sum(cuentaaprobado) ,0) ELSE 0 END as TPC,
        CASE WHEN ( sum(tpresupuestado) > 0 ) THEN ROUND( 100 * sum(tfacturado) / sum(tpresupuestado) ,0) ELSE 0 END as Efectividad,
        CASE WHEN ( sum(tentregado) > 0 ) THEN (100 * sum(cuentaaprobado) / sum(tentregado) ) ELSE 0 END as OC,

        CASE WHEN ( sum(cuentaaprobado) > 0 ) THEN ROUND( 100 * sum(tactosok) / sum(cuentaaprobado) ,0 ) ELSE 0 END as actosok,

        ROUND( sum(tpresupuestado) / sum(tactosko) ,0 ) as PrecioM


        from #temp GROUP BY edad ORDER BY edad
        ";

    }


    return $sql;

}

/*
// para calcular todas las variables a la vez...
*/

function TB_Promedio()           { $id = deget()->id; $ano = deget()->ano; $codigos = "'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' ,'FSIP', 'FSI', 'FSIDK', 'PSI','PHCI', 'PHDB', 'PHDA', 'PSDA', 'PSDB', 'RPSD','CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR','PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI','ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORI1', 'ORI2','ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORI1', 'ORI2','CARC', 'CARIL','CARC','CARIL','BLANC', 'BLMIX','AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL','REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC','REVCO','REVCO', 'REVC','REVOC','MFM','R1HP', 'R2H', 'R1HC'
"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_ImplantesColocados()           { $id = deget()->id; $ano = deget()->ano; $codigos = "'IOIM', 'IOIP', 'IOIU', 'IOIZ', 'IOIH' "; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_ProtesisSobreImplantes()       { $id = deget()->id; $ano = deget()->ano; $codigos = "'FSIP', 'FSI', 'FSIDK', 'PSI'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_ProtesisHibridas()             { $id = deget()->id; $ano = deget()->ano; $codigos = "'PHCI', 'PHDB', 'PHDA', 'PSDA', 'PSDB', 'RPSD'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_ProtesisFija()                 { $id = deget()->id; $ano = deget()->ano; $codigos = "'CCC', 'CMC', 'CMR', 'CR', 'INCRU', 'MARYL', 'MPR'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_ProtesisRemovible()            { $id = deget()->id; $ano = deget()->ano; $codigos = "'PR+3', 'PR-3', 'PPRPL', 'PPRPS', 'PC', 'PCI'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_OrtodonciaFija()               { $id = deget()->id; $ano = deget()->ano; $codigos = "'ORF', 'ORFE', 'ORTQ'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_Invisalign()                   { $id = deget()->id; $ano = deget()->ano; $codigos = "'INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_OrtodonciaInterceptiva()       { $id = deget()->id; $ano = deget()->ano; $codigos = "'ORI1', 'ORI2'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_OrtodonciaFI()                 { $id = deget()->id; $ano = deget()->ano; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_OrtodonciaTotal()              { $id = deget()->id; $ano = deget()->ano; $codigos = "'ORF', 'ORFE', 'ORTQ','INVCC', 'INVCO', 'INV17', 'INVEX', 'INTEC', 'INVTE','ORI1', 'ORI2'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_Carillas()                     { $id = deget()->id; $ano = deget()->ano; $codigos = "'CARC', 'CARIL'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_CarillaCeramica()              { $id = deget()->id; $ano = deget()->ano; $codigos = "'CARC'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_CarillaComposite()             { $id = deget()->id; $ano = deget()->ano; $codigos = "'CARIL'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_Blanqueamiento()               { $id = deget()->id; $ano = deget()->ano; $codigos = "'BLANC', 'BLMIX'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_EsteticaFacial()               { $id = deget()->id; $ano = deget()->ano; $codigos = "'AULAB', 'BOTTS', 'COBA', 'LIMA', 'PLAB', 'PNSG', 'PGAL'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_DPH()                          { $id = deget()->id; $ano = deget()->ano; $codigos = "'REVCO','REVC','REVOC','MFM','R1HC','R2H','R1HP','DESEN','FLUOR','HIG','HIGH','HIGC'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_DPHColectivos()                { $id = deget()->id; $ano = deget()->ano; $codigos = "'REVCO'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_RevisionesConservadora()       { $id = deget()->id; $ano = deget()->ano; $codigos = "'REVCO', 'REVC'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_RevisionesOdontopediatria()    { $id = deget()->id; $ano = deget()->ano; $codigos = "'REVOC'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_MantenimientosPeridontales()   { $id = deget()->id; $ano = deget()->ano; $codigos = "'MFM'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }
function TB_RevisionesHibrida()            { $id = deget()->id; $ano = deget()->ano; $codigos = "'R1HP', 'R2H', 'R1HC'"; $sql = sqlratios($id,$codigos,$ano); return losratios($id,$sql); }


function especialidadesRatios() {

    $res = array();

    $qes = TB_Promedio();                    $qes->var = 'TB_Promedio';                      $res[] = $qes;
    $qes = TB_ImplantesColocados();          $qes->var = 'TB_ImplantesColocados';            $res[] = $qes;
    $qes = TB_ProtesisSobreImplantes();      $qes->var = 'TB_ProtesisSobreImplantes';        $res[] = $qes;
    $qes = TB_ProtesisHibridas();            $qes->var = 'TB_ProtesisHibridas';              $res[] = $qes;
    $qes = TB_ProtesisFija();                $qes->var = 'TB_ProtesisFija';                  $res[] = $qes;
    $qes = TB_ProtesisRemovible();           $qes->var = 'TB_ProtesisRemovible';             $res[] = $qes;
    $qes = TB_OrtodonciaFija();              $qes->var = 'TB_OrtodonciaFija';                $res[] = $qes;
    $qes = TB_Invisalign();                  $qes->var = 'TB_Invisalign';                    $res[] = $qes;
    $qes = TB_OrtodonciaInterceptiva();      $qes->var = 'TB_OrtodonciaInterceptiva';        $res[] = $qes;
    $qes = TB_OrtodonciaFI();                $qes->var = 'TB_OrtodonciaFI';                  $res[] = $qes;
    $qes = TB_OrtodonciaTotal();             $qes->var = 'TB_OrtodonciaTotal';               $res[] = $qes;
    $qes = TB_Carillas();                    $qes->var = 'TB_Carillas';                      $res[] = $qes;
    $qes = TB_CarillaCeramica();             $qes->var = 'TB_CarillaCeramica';               $res[] = $qes;
    $qes = TB_CarillaComposite();            $qes->var = 'TB_CarillaComposite';              $res[] = $qes;
    $qes = TB_Blanqueamiento();              $qes->var = 'TB_Blanqueamiento';                $res[] = $qes;
    $qes = TB_EsteticaFacial();              $qes->var = 'TB_EsteticaFacial';                $res[] = $qes;
    $qes = TB_DPH();                         $qes->var = 'TB_DPH';                           $res[] = $qes;
    $qes = TB_DPHColectivos();               $qes->var = 'TB_DPHColectivos';                 $res[] = $qes;
    $qes = TB_RevisionesConservadora();      $qes->var = 'TB_RevisionesConservadora';        $res[] = $qes;
    $qes = TB_RevisionesOdontopediatria();   $qes->var = 'TB_RevisionesOdontopediatria';     $res[] = $qes;
    $qes = TB_MantenimientosPeridontales();  $qes->var = 'TB_MantenimientosPeridontales';    $res[] = $qes;
    $qes = TB_RevisionesHibrida();           $qes->var = 'TB_RevisionesHibrida';             $res[] = $qes;

    Flight::json($res);
}

/*
// para calcular una sola variable para todas las cities...
*/

function unRatio() {

    $var = deget()->var;

    $res = array();

    $qes = $var();          
    $qes->var = $var;            
    $res[] = $qes;

    Flight::json($res);
}


?>

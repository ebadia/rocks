<?php

    $id = $_GET['id'];
    // $id = $argv[1];

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

        global $db;
        global $clinicas;

        $id = $c;
        $desde = $d;
        $hasta = $h;

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
        ;" ;

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

        global $db;
        global $clinicas;

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
        ;";

            try {

                mssql_select_db($clinicas[$id][3], $db);
                $query = mssql_query($sql);
                $res = array();

                while ($row = mssql_fetch_object($query)) {
                    $res["data"][] = $row;
                }
                $res["data"]["error"] = 0;
                $res["data"]["sql"] = $sql;
                // $devuelvo['data'] = $res;
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

    //$margen = 7;
    function calculaFacturacion1T($id, $margen){
        $ver = [];
        for ( $i=0; $i<12; $i++ ){

            // echo "Desde: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )."\n"; 
            // echo "Hasta: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )."\n"; 

            $ver[] = 
                facturacionFechas(
                    $id, 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )     , 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )
                )[0]->pago;
        }
        return $ver;
    }
    function calculaFacturacion5Y($id, $margen){
        $ver = [];
        for ( $i=0; $i<6; $i++ ){

            // echo "Desde: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )."\n"; 
            // echo "Hasta: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )."\n"; 

            $ver[] = 
                facturacionFechas(
                    $id, 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )     , 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )
                )[0]->pago;
        }
        return $ver;
    }

    function calculaPresupuestosEuros1T($id, $margen){
        $ver = [];
        for ( $i=0; $i<12; $i++ ){

            //echo "Desde: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )."\n"; 
            //echo "Hasta: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )."\n"; 

            $temporal = 
                feina(
                    $id, 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )     , 
                    date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )
                );
            $entregado[] = $temporal[0]->dentregado;
            $aceptado[] = $temporal[0]->daceptado;
            $rechazado[] = $temporal[0]->drechazado;
        }
        $ver['entregado'] = $entregado;
        $ver['aceptado'] = $aceptado;
        $ver['rechazado'] = $rechazado;

        return $ver;
    }

    // opereaciones
    function transpose($array) {
        array_unshift($array, null);
        return call_user_func_array('array_map', $array);
    }

    // primeras
    function operaciones($c,$v){

        global $db;
        global $clinicas;

        $id = $c;
        // $desde = $d;
        // $hasta = $h;

        $insql = "";
        $any = date('Y');
        for ( $i=$any-4; $i<$any; $i++ ){
            $insql = $insql . "sum( case when ano='".$i."' then 1 else 0 end) as a".$i.",";
        }
        $insql = $insql . "sum( case when ano='".$any."' then 1 else 0 end) as a".$any;

        $sql = "
            SELECT 
                TtosMed.IdPac, 
                Pacientes.FecNacim, 
                DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
                YEAR(TtosMed.FecIni) as ano, 
                MONTH(TtosMed.FecIni) as mes
            INTO #unica
        
            FROM TtosMed
            left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( $v )
            and TtosMed.StaTto = 5 
            AND YEAR(TtosMed.FecIni) > 2007

            ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

            select mes,".$insql." from #unica 
            group by mes
            order by mes
            ;";

            try {
                mssql_select_db($clinicas[$id][3], $db);
                $query = mssql_query($sql);
                $res = array();

                while ($row = mssql_fetch_row($query)) {
                    $res["data"][] = $row;
                }
                $res["error"] = 0;
                $res["sql"] = $sql;
                // $devuelvo['data'] = $res;
                //Flight::json($devuelvo);
                return transpose( $res['data'] );
                mssql_free_result($query);

            } catch(PDOException $e) {
                return 'error';
            }


    }


    // facturacion mensual ultimos 5 años (como en rocks)
    function facturacion($id){ 

        global $db;
        global $clinicas;

        $insql = "";
        $any = date('Y');
        for ( $i=$any-4; $i<$any; $i++ ){
            $insql = $insql . "sum( case when ano='".$i."' then pago else 0 end) as a".$i.",";
        }
        $insql = $insql . "sum( case when ano='".$any."' then pago else 0 end) as a".$any;

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
            WHERE 
                TtosMed.StaTto = 5 and not TtosMed.importe is null
                AND YEAR(TtosMed.FecIni) > 2007 AND MONTH(TtosMed.FecFin) is not null

            ORDER BY YEAR(TtosMed.FecIni) ASC, MONTH(TtosMed.FecIni) ASC;

            select mes,".$insql." from #unica 
            group by mes
            order by mes
            ;" ;

            try {
                mssql_select_db($clinicas[$id][3], $db);
                $query = mssql_query($sql);
                $res = array();

                while ($row = mssql_fetch_row($query)) {
                    $res["data"][] = $row;
                }
                $res["error"] = 0;
                $res["sql"] = $sql;
                // $devuelvo['data'] = $res;
                //Flight::json($devuelvo);
                return transpose( $res['data'] );
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
    // print_r( calculaPresupuestosEuros1T( 1, 7 ) );
    // $i = 0;
    // $margen = 7;
    // $desde = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) );
    // $hasta = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) );
    // echo "Desde: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen), date("Y")) )."\n"; 
    // echo "Hasta: ".date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-(($i+1)*$margen)+$margen, date("Y")) )."\n"; 
    // $kk = feina( $id,  $desde,  $hasta );
    // print_r( $kk );
    // $kk = objetivosFechas( $id,2016 );
    // print_r( $kk );

?>

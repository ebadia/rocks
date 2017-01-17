<?php

require 'myip.php';

//*********************************
//* definicion de clinicas
//* poner en el indice que corresponde a la id de la base de datos de centros
//*********************************
    $lleida = array( "81.45.46.237", "SERVER\\ebadia", "Eneresi2016", "GELITE", 1 );
    // $lleida = array( "192.168.1.200", "SERVER\\ebadia", "eneresi", "GELITE", 1 );
    //$sabadell =  array( "192.168.3.100", "SERVER\\ebadia", "ClinicaSabadell14", "GELITE_310", 2);
    $sabadell =  array( gethostbyname('eneresisabadell.dnsalias.com'), "SERVER\\ebadia", "ClinicaSabadell14", "GELITE_310", 2);
    $murcia = array( gethostbyname('eneresicentral.dyndns.biz'), "SERVIDOR\\Administrador", "Eneresi5102", "GELITE", 3);
    // $murcia = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 3);
    // $molina = array( "81.45.47.60", "SERVIDOR\\ebadia", "ClinicaMurcia14", "GELITE", 4);
    // $barcelona =  array( gethostbyname('eneresibcn.no-ip.net'), "SERVIDOR\\ebadia", "Eneresi6102", "GELITE", 6);
    $barcelona =  array( "80.24.9.68", "SERVIDOR\\ebadia", "Eneresi6102", "GELITE", 6);
    // $bilbao =  array( gethostbyname('eneresibilbao.no-ip.net'), "GABINETE\\ebadia", "Eneresi6102", "GELITE", 7);
    $bilbao =  array( "80.24.208.234", "GABINETE\\ebadia", "Eneresi6102", "GELITE", 7);
    $tarrega =  array( "212.170.161.189", "SERVIDOR\\ebadia", "Eneresi6102", "GELITE", 8);

    $clinicas = array();
        $clinicas[1] = $lleida;
        $clinicas[2] = $sabadell;
        $clinicas[3] = $murcia;
        // $clinicas[4] = $molina;
        $clinicas[5] = $mislata;
        $clinicas[6] = $barcelona;
        $clinicas[7] = $bilbao;
        $clinicas[8] = $tarrega;
//*********************************

function getConnectionGesdent($id) {

    global $clinicas;

    // -- datos de conexion a gesdent
        $dbhost=$clinicas[$id][0];
        $dbport="1433";
        $dbuser=$clinicas[$id][1];
        $dbpass=$clinicas[$id][2];
        $db = mssql_connect($dbhost.":".$dbport, $dbuser, $dbpass);

        return $db;

}

?>

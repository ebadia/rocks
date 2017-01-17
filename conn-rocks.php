<?php

// **************************************
// Datos de las conexiones a los dos sistemas
// **************************************
function getConnectionRocks() {

    // -- datos de conexion a rocks
	    // ----> en rocks poner este
	    $dbhost="108.179.234.137";
	    // ----> en local poner este
	    // $dbhost="31.170.164.39";
	    $port="3306";
	    $dbuser="eneresi_ebadia";
	    $dbpass="tincfeina";
	    $dbname="eneresi_rocks";
	    $dbh = new PDO("mysql:host=$dbhost;port=$port;dbname=$dbname", $dbuser, $dbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
	    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	    return $dbh;
}

?>
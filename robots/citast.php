<?php

// ejecutar con un solo argumento que es el codigo del centro

require '../vendor/autoload.php';
use Clickatell\Api\ClickatellHttp;

$username = "eneresi";
$password = "Eneresi1997";
$apiID = "3527760";

$clickatell = new ClickatellHttp($username, $password, $apiID);
$response = $clickatell->sendMessage(array(34601007366), "My Message", array("from"=>'Eneresi'));

foreach ($response as $message) {
    echo $message->id;
    echo "\n";
    echo $message->error;
    echo "\n";
    echo $message->destination;
    echo "\n";

    // Message response fields:
    //echo $message->id;
    //echo $message->destination;
    //echo $message->error;
    //echo $message->errorCode;
}

?>
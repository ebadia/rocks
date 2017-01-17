<?php

// recepcion de SMS a un array de numeros a traves de NEXMO

// require_once "./nexmo/vendor/autoload.php";

// work with get or post
$request = array_merge($_GET, $_POST);

// Check that this is a delivery receipt.
// if (!isset($request['messageId']) OR !isset($request['status'])) {
//     error_log('This is not a delivery receipt');
//     return;
// }

ob_start();
var_dump($request);
$a=ob_get_contents();
ob_end_clean();

$pon = $request['message-timestamp'] . "; " . $request['msisdn'] . "; 	" . $request['text'] . PHP_EOL;

file_put_contents( __DIR__ . '/evol/sms-respuesta-nexmo.txt', $pon, FILE_APPEND);

?>

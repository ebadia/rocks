<?php

// envio de SMS a un array de numeros a traves de NEXMO

require_once "./nexmo/vendor/autoload.php";

$client = new Nexmo\Client(new Nexmo\Client\Credentials\Basic('7c8807b4', 'c113ce5e782233e5'));

$destinos = ['34601007366'];

foreach ($destinos as $numero) {

	$message = $client->message()->send([
	    'to' => $numero,
	    'from' => 'SdeAlma',
	    'text' => 'S DE ALMA 30%OFF\nPer haber-nos acompanyat en aquest 2016, podeu gaudir d\'un 30% de dte. del 19 al 31 de desembre.'
	]);   

	ob_start();
	var_dump($message);
	$a=ob_get_contents();
	ob_end_clean();

	file_put_contents( __DIR__ . '/evol/sms-envio-nexmo.txt', $a);
	
	echo "Sent message to " . $message['to'] . ". Balance is now " . $message['remaining-balance'] . PHP_EOL;


}

?>


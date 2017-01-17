<?php
require 'sendgrid/vendor/autoload.php';
require 'sendgrid/lib/SendGrid.php';
require 'sendgrid/lib/Client.php';
  
// Dotenv::load(__DIR__);

$sendgrid_apikey = "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";
$templateId = "b8090229-9a07-4b0c-b47f-88a69d76b2d0";

// $sendgrid = new Client($sendgrid_apikey);

    // --- establece los destinatarios de los correos que se generan
    // -------------------------------------------------------------
    switch ($id) {
        case 1:
            $to = array(
                    'enric.badia@gmail.com',
                    'eariza@eneresi.com',
                    'aortiz@eneresi.com'
            );
            break;
        case 2:
            $to = array(
                    'enric.badia@gmail.com',
                    'sverdonces@eneresi.com'
            );
            break;
        case 3: 
        case 4: 
            $to = array(
                    'enric.badia@gmail.com',
                    'aortiz@eneresi.com',
                    'aarques@eneresi.com'
            );
            break;
        default:
            $to = array(
                    'enric.badia@gmail.com',
            );
            break;
    }

    // --- fin: establece los destinatarios de los correos que se generan
    // -------------------------------------------------------------
// using SendGrid's PHP Library - https://github.com/sendgrid/sendgrid-php
$sendgrid = new SendGrid($sendgrid_apikey);
$email    = new SendGrid\Email();

// $emails = array("foo@bar.com", "another@another.com", "other@other.com");
// $email->setCcs($emails);

$email->addTo("enric.badia@gmail.com")
      ->addCc("ebadia@eneresi.com")
      ->setFrom("ebadia@eneresi.com")
      ->setSubject("Eneresi li agraeix la seva visita.")
      ->setHtml(" ")

  		->setTemplateId($templateId)
      ->addSubstitution('-nom-', array('Enric'))
  		->addSubstitution('-tracte-', array('tractat'))
	;

// $sendgrid->send($email);

try {
    $sendgrid->send($email);
} catch(\SendGrid\Exception $e) {
    echo $e->getCode();
    foreach($e->getErrors() as $er) {
        echo $er;
    }
}

// $group_id = 70;
// $email = 'elmer.thomas+test2@gmail.com';
// $response = $sendgrid->asm_suppressions->delete($group_id, $email);
// print("Status Code: " . $response->getStatusCode() . "\n");

/*

$group_id = 70;
$email = 'elmer.thomas+test1@gmail.com';
$response = $sendgrid->asm_suppressions->post($group_id, $email);
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");

$group_id = 70;
$email = array('elmer.thomas+test5@gmail.com', 'elmer.thomas+test6@gmail.com');
$response = $sendgrid->asm_suppressions->post($group_id, $email);
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");

$response = $sendgrid->asm_groups->get();
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");

$response = $sendgrid->api_keys->post("Magic Key");
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");


$response = $sendgrid->api_keys->patch("VlgpNJUeTSaAM8KNJ0vlLA", "Magic Key Updated");
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");
*/

/*
$response = $sendgrid->api_keys->delete("VlgpNJUeTSaAM8KNJ0vlLA");
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");

$response = $sendgrid->api_keys->get();
print("Status Code: " . $response->getStatusCode() . "\n");
print("Body: " . $response->getBody() . "\n");

*/
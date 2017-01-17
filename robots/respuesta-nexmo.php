<?php

// ejecutar con un solo argumento que es el codigo del centro
    /*
        message_id  A unique ID assigned to an incoming message.
        timestamp   The time of receiving the message, in Unix time format.
        from    The sender’s phone number.
        text    The message’s text, in the UTF-8 character set.
    
    */

require_once "nexmo/vendor/autoload.php";

$inbound = \Nexmo\Message\InboundMessage::createFromGlobals();
if($inbound->isValid()){
    error_log($inbound->getBody());
} else {
    error_log('invalid message');
}

	
?>
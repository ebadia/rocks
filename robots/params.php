<?php

echo $argv[1];
echo "\n";
echo $centro = $argv[2];

	$fecha = date( 'Ymd', mktime(0, 0, 0, date("m") ,   date("d")-1, date("Y")) );
    $codigos = "'V1C' ,'V1S' ,'V1H','VOC' ,'VOS', 'V1CO', 'VOCO'";

if ($argv[2]) echo "hay";



    if ($centro) {
        $sql =  "
            SELECT 
                DISTINCT TtosMed.IdPac, 
                Pacientes.Nombre, 
                Pacientes.Apellidos, 
                Pacientes.Sexo, 
                Pacientes.Email, 
                DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
                TTos.Codigo as visita
        
            FROM TtosMed
            left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
            and TtosMed.StaTto = 5 
            AND TtosMed.FecIni = '".$fecha."'
            and TtosMed.IdCentro = ".$centro."

            ORDER BY TtosMed.IdPac ASC
            ";

    } else {
        $sql =  "
            SELECT 
                DISTINCT TtosMed.IdPac, 
                Pacientes.Nombre, 
                Pacientes.Apellidos, 
                Pacientes.Sexo, 
                Pacientes.Email, 
                DATEDIFF(hour,Pacientes.FecNacim,GETDATE())/8766 AS edad,
                TTos.Codigo as visita
        
            FROM TtosMed
            left join Pacientes on TtosMed.IdPac = Pacientes.IdPac
            left join TTos on TtosMed.IdTto = TTos.IdTto

            WHERE TTos.Codigo in ( ".$codigos." )
            and TtosMed.StaTto = 5 
            AND TtosMed.FecIni = '".$fecha."'

            ORDER BY TtosMed.IdPac ASC
            ";        
    }

echo $sql;

?>
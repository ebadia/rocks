<?php // content="text/plain; charset=utf-8"
require_once ('./jpgraph/jpgraph.php');
require_once ('./jpgraph/jpgraph_line.php');
require_once ('./semanal-func.php');

$datay1 = array_reverse( calculaPresupuestosEuros1T($_GET['id'],$_GET['margen'])['entregado'] );
$datay2 = array_reverse( calculaPresupuestosEuros1T($_GET['id'],$_GET['margen'])['aceptado'] );
$datay3 = array_reverse( calculaPresupuestosEuros1T($_GET['id'],$_GET['margen'])['rechazado'] );

// Setup the graph
$graph = new Graph(650,250);
$graph->SetScale("textlin");

$theme_class=new UniversalTheme;

$graph->SetTheme($theme_class);
$graph->img->SetAntiAliasing(false);
$graph->title->Set($_GET['titol']);
$graph->SetBox(false);
$graph->SetMargin(75,10,40,20);

$graph->img->SetAntiAliasing();

$graph->yaxis->HideZeroLabel();
$graph->yaxis->HideLine(false);
$graph->yaxis->HideTicks(false,false);

$graph->xgrid->Show();
$graph->xgrid->SetLineStyle("solid");
// $graph->xaxis->SetTickLabels(array('A','B','C','D'));
$graph->xgrid->SetColor('#E3E3E3');

// Create the first line
$p1 = new LinePlot($datay1);
$graph->Add($p1);
$p1->SetColor("#6495ED");
$p1->SetLegend('Entregados');

// Create the second line
$p2 = new LinePlot($datay2);
$graph->Add($p2);
$p2->SetColor("#33cc33");
$p2->SetLegend('Aceptados');

// Create the third line
$p3 = new LinePlot($datay3);
$graph->Add($p3);
$p3->SetColor("#FF1493");
$p3->SetLegend('Rechazados');
$graph->legend->SetFrameWeight(1);

// Output line
$graph->Stroke();

?>
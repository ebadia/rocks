<?php // content="text/plain; charset=utf-8"
require_once ('./semanal-func.php');
require_once ('./jpgraph/jpgraph.php');
require_once ('./jpgraph/jpgraph_line.php');
require_once ('./jpgraph/jpgraph_bar.php');

$pinto = facturacion($_GET['id']);
$objet = objetivosFechas($_GET['id'], $_GET['anyo']);

$datay0 = $pinto[2];
$datay1 = $pinto[3];
$datay2 = $pinto[4];
$datay3 = $pinto[5];

// Setup the graph
$graph = new Graph(650,250,'auto');
$graph->SetScale("textlin");

$theme_class=new UniversalTheme;

$graph->SetTheme($theme_class);
$graph->img->SetAntiAliasing(false);
$graph->title->Set("Facturación Mensual.");
$graph->SetBox(false);
$graph->SetMargin(75,10,40,20);

$graph->legend->SetColumns(5);

$graph->img->SetAntiAliasing();

$graph->yaxis->HideZeroLabel();
$graph->yaxis->HideLine(false);
$graph->yaxis->HideTicks(false,false);

$graph->xgrid->Show();
$graph->xgrid->SetLineStyle("solid");
$graph->xgrid->SetColor('#E3E3E3');

$p0 = new BarPlot($datay0);
$p1 = new BarPlot($datay1);
$p2 = new BarPlot($datay2);
$p3 = new BarPlot($datay3);
// grupo de barras
// Create the grouped bar plot
$gbplot = new GroupBarPlot(array($p0,$p1,$p2,$p3));
$graph->Add($gbplot);

// Create the first line
$p4 = new LinePlot($objet);
$graph->Add($p4);


// Create the first line
$p0->SetColor("white");
$p0->SetFillColor("#6495ED");
$p0->SetLegend(date('Y')-3);

// Create the first line
$p1->SetColor("white");
$p1->SetFillColor("#00cc66");
$p1->SetLegend(date('Y')-2);

// Create the second line
$p2->SetColor("white");
$p2->SetFillColor("#FF1493");
$p2->SetLegend(date('Y')-1);

// Create the third line
$p3->SetColor("white");
$p3->SetFillColor("#1111cc");
$p3->SetLegend(date('Y'));

// Create the third line
$p4->SetColor("#FF0000");
$p4->SetLegend('Objetivo');

$graph->legend->SetFrameWeight(1);


// Output line
$graph->Stroke();

?>
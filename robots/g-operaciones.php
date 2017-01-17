<?php // content="text/plain; charset=utf-8"
require_once ('./jpgraph/jpgraph.php');
require_once ('./jpgraph/jpgraph_line.php');
require_once ('./jpgraph/jpgraph_bar.php');
require_once ('./semanal-func.php');
require_once ('./g-codis.php');


$pinto = operaciones($_GET['id'], $ope[$_GET['ope']]);
$datay1 = $pinto[3];
$datay2 = $pinto[4];
$datay3 = $pinto[5];

// Setup the graph
$graph = new Graph(650,250,'auto');
$graph->SetScale("textlin");

$theme_class=new UniversalTheme;

$graph->SetTheme($theme_class);
$graph->img->SetAntiAliasing(false);
$graph->title->Set("// ".$_GET['ope']." \\\\");
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
$p1 = new BarPlot($datay1);
//$graph->Add($p1);
$p1->SetColor("#6495ED");
$p1->SetLegend(date('Y')-2);

// Create the second line
$p2 = new BarPlot($datay2);
//$graph->Add($p2);
$p2->SetColor("#B22222");
$p2->SetLegend(date('Y')-1);

// Create the third line
$p3 = new BarPlot($datay3);
//$graph->Add($p3);
$p3->SetColor("#FF1493");
$p3->SetLegend(date('Y'));
$graph->legend->SetFrameWeight(1);

// grupo de barras
// Create the grouped bar plot
$gbplot = new GroupBarPlot(array($p1,$p2,$p3));
$graph->Add($gbplot);

// Output line
$graph->Stroke();

?>
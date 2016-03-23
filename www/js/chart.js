function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 

d3.tsv("data/vnTradeData.tsv", type, function(error, tsv_data) {
  if (error) throw error;

  var parseDate = d3.time.format("%Y").parse;
  
  tsv_data.forEach(function(d) {
    d.yr = parseDate(String(d.yr));
  });

  var ndx = crossfilter(tsv_data);

  var yrDim = ndx.dimension(function(d) {return d.yr; });
  var typeDim = ndx.dimension(function(d) {return d.type; });
  var partnerDim = ndx.dimension(function(d) {return d.partnerCountry; });
  var valueDim = ndx.dimension(function(d) {return d.TradeValue; });  
  
  var type_tv = typeDim.group().reduceSum(function(d) {return d.TradeValue;});

  var tv = yrDim.group().reduceSum(function(d) {return d.TradeValue;});
  //print_filter(tv);
  var minYear = yrDim.bottom(1)[0].yr;
  //console.log(minYear);
  var maxYear = yrDim.top(1)[0].yr;
  //console.log(maxYear);
  
  var VN_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='USA') {return d.TradeValue;}else{return 0;}});

  var TH_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='CHN') {return d.TradeValue;}else{return 0;}});

  var SN_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='CAN') {return d.TradeValue;}else{return 0;}});

  var PH_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='JPN') {return d.TradeValue;}else{return 0;}});

  var MY_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='DEU') {return d.TradeValue;}else{return 0;}});

  var MA_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='FRA') {return d.TradeValue;}else{return 0;}});

  var LA_tv = yrDim.group().reduceSum(function(d)
  {if (d.partnerCountry==='GBR') {return d.TradeValue;}else{return 0;}});

  //var IN_tv = yrDim.group().reduceSum(function(d)
  //{if (d.partnerCountry==='Indonesia') {return d.TradeValue;}else{return 0;}});

  //var CM_tv = yrDim.group().reduceSum(function(d)
  //{if (d.partnerCountry==='Cambodia') {return d.TradeValue;}else{return 0;}});

  //var BR_tv = yrDim.group().reduceSum(function(d)
  //{if (d.partnerCountry==='Brunei Darussalam') {return d.TradeValue;}else{return 0;}});
  
  print_filter(type_tv)
 
  var typeChart = dc.pieChart("#chart-ring-tradepertype");
  typeChart
    .width(200).height(200)
	.dimension(typeDim)
	.group(type_tv)
	.innerRadius(60)
	.legend(dc.legend().x(80).y(80).itemHeight(13).gap(5))
	.renderLabel(false)
	.renderTitle(false);
	
  
  var tpyvChart = dc.lineChart("#chart-line-tradeperyear");
  tpyvChart
    .width(400).height(400)
	.margins({top: 10, right: 100, bottom: 30, left: 90})
	.dimension(yrDim)
	.group(VN_tv, "USA")
	.stack(TH_tv, "China")
	.stack(SN_tv, "Canada")
	.stack(PH_tv, "Japan")
	.stack(MY_tv, "Germany")
	.stack(MA_tv, "France")
	.stack(LA_tv, "UK")
	//.stack(IN_tv, "Indonesia")
	//.stack(CM_tv, "Cambodia")
	//.stack(BR_tv, "Brunei")
	.renderArea(true)
	.brushOn(false)
	.elasticY(true)
	.x(d3.time.scale().domain([minYear,maxYear]))
	.legend(dc.legend().x(310).y(10).itemHeight(13).gap(5))

  dc.renderAll();
  
  //var yr_2012 = yrDim.filter(2012);
  //print_filter(yr_2012);  
  //var pt_VN = partnerDim.filter("Viet Nam");
  //print_filter(pt_VN);

  //var tp_Export = typeDim.filter("Export");
  //print_filter(tp_Export);
  //var totalExport = ndx.groupAll().reduceSum(function(d) { return d.TradeValue;}).value()
  //console.log("totalExport="+totalExport);
  //typeDim.filterAll()

  //var tp_Import = typeDim.filter("Import");
  //print_filter(tp_Import);
  //var totalImport = ndx.groupAll().reduceSum(function(d) { return d.TradeValue;}).value()
  //console.log("totalImport="+totalImport);
  //typeDim.filterAll()
  
});  
  
function type(d) {
  d.yr = +d.yr;
  d.TradeValue = +d.TradeValue;
  d.type = d.type
  return d;
}

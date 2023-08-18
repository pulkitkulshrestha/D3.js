// Hint: This is a good place to declare your global variables

var data_fem;
var data_mal;

var margin = {top: 10, right: 30, bottom: 80, left: 60}, // 10 30 80 60
width = 1000 - 90;
height = 600 - 90;

var svg;

var x_bar;
var y_bar;

var x_axis;
var y_axis;

var chart_fem;
var chart_mal;
// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
svg = d3.select("#my_dataviz").append("svg").attr("height", 600).attr("width", 1000).append("g").attr("transform", "translate(" + 60 + "," + 30 + ")");

svg.append("rect").attr("x",800).attr("y",-30).style("fill", "#2E8B57").attr("height",15).attr("width", 15)
svg.append("text").attr("x", 825).attr("y", -20).text("Female Employment Rate").style("font-size", "9px").attr("alignment-baseline","middle")

svg.append("rect").attr("x",800).attr("y",-10).style("fill", "#fc1998").attr("height",15).attr("width", 15)
svg.append("text").attr("x", 825).attr("y", 2).text("Male Employment Rate").style("font-size", "9px").attr("alignment-baseline","middle")

x_bar = d3.scaleTime().range([ 0, width ]);
x_axis = svg.append("g").attr("transform", "translate(0," + height + ")")
svg.append("text").attr("x", 460 ).attr("y", 550 ).style("text-anchor", "middle").text("Year");

y_bar = d3.scaleLinear().range([ height, 0]);
y_axis = svg.append("g").attr("class", "y_axis")
svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - 60).attr("x",0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Employment Rate");     
 

  function data_wrang(d) {
  return {
    France: +d.France,Germany: +d.Germany,India: +d.India,Japan: +d.Japan,Latvia: +d.Latvia,Year: d.Year,
  }
}
 // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv',data_wrang),d3.csv('data/males_data.csv',data_wrang)])
        .then(function (values) {
            //console.log('loaded females_data.csv and males_data.csv');
            data_fem = values[0];
            data_mal = values[1];
            drawLolliPopChart();
                        
        });
   
}); 

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    //console.log('trace:drawLollipopChart()');

var name_country = document.getElementById('country');

  if(name_country.value=="France")
  {  
    ////console.log("France");
    chart_mal=data_mal.map((male_data) => [new Date(male_data.Year), male_data.France]);
    chart_fem=data_fem.map((female_data) => [new Date(female_data.Year), female_data.France]);
  }
  else if(name_country.value=="Germany")
  {
     ////console.log("Germany");
     chart_mal=data_mal.map((male_data) => [new Date(male_data.Year), male_data.Germany]);
     chart_fem=data_fem.map((female_data) => [new Date(female_data.Year), female_data.Germany]);
  }
  else if(name_country.value=="India")
  {
     ////console.log("India");
     chart_mal=data_mal.map((male_data) => [new Date(male_data.Year), male_data.India]);
     chart_fem=data_fem.map((female_data) => [new Date(female_data.Year), female_data.India]);  
  }
  else if(name_country.value=="Japan")
  {
     ////console.log("Japan");
     chart_mal=data_mal.map((male_data) => [new Date(male_data.Year), male_data.Japan]);
     chart_fem=data_fem.map((female_data) => [new Date(female_data.Year), female_data.Japan]);
  }
  else if(name_country.value=="Latvia")
  {
    ////console.log("Latvia");
    chart_mal=data_mal.map((male_data) => [new Date(male_data.Year), male_data.Latvia]);
    chart_fem=data_fem.map((female_data) => [new Date(female_data.Year), female_data.Latvia]);
  }
  const male_highest = chart_mal.reduce((previous, current) => {
    if(current[1] > previous[1])
    return current;
    else 
    return previous;
});

  const female_highest = chart_fem.reduce((previous, current) => {
    if(current[1] > previous[1])
    return current;
    else 
    return previous;
});

  const chart_height=Math.max(male_highest[1],female_highest[1]);

  // declare X axis

  x_bar.domain([new Date(1990,0,1),new Date(2023,0,1)])
  x_axis.transition().duration(2000).call(d3.axisBottom(x_bar));

  // declare Y axis
 
  y_bar.domain([0, chart_height ]);
  y_axis.transition().duration(2000).call(d3.axisLeft(y_bar));

  var male_line = svg.selectAll(".Line_male").data(chart_mal)
  var fem_line = svg.selectAll(".Line_female").data(chart_fem)
 
    // chart lines for male
    male_line.enter().append("line").attr("class", "Line_male").merge(male_line).transition().duration(2000)
    .attr("x1", function(d) { return x_bar(d[0])+8.0; })
    .attr("x2", function(d) { return x_bar(d[0])+8.0; })
    .attr("y1", y_bar(0))
    .attr("y2", function(d) { return y_bar(d[1]); })
    .attr("stroke", "#fc1998")   

  // chart lines for female
  fem_line.enter().append("line").attr("class", "Line_female").merge(fem_line).transition().duration(2000)
      .attr("x1", function(d) { return x_bar(d[0]); })
      .attr("x2", function(d) { return x_bar(d[0]); })
      .attr("y1", y_bar(0))
      .attr("y2", function(d) { return y_bar(d[1]); })
      .attr("stroke", "#2E8B57")

  // mapping data to circle
  var male_cir = svg.selectAll(".male_circle").data(chart_mal)
  var female_cir = svg.selectAll(".female_circle").data(chart_fem)

  male_cir.enter().append("circle").merge(male_cir).attr("class", "male_circle").transition().duration(2000)
      .attr("cx", function(d) { return x_bar(d[0])+8.0; })
      .attr("cy", function(d) { return y_bar(d[1]); })
      .attr("r", 5.5)
      .attr("fill", "#fc1998");

  female_cir.enter().append("circle").merge(female_cir).attr("class", "female_circle").transition().duration(2000)
      .attr("cx", function(d) { return x_bar(d[0]); })
      .attr("cy", function(d) { return y_bar(d[1]); })
      .attr("r", 5.5)
      .attr("fill", "#2E8B57"); 

}
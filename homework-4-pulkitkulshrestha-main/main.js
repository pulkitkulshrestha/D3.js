var x;
var y;
width = 1000 - 100;
height = 600 - 100;
document.addEventListener('DOMContentLoaded', function () {
  
  svg = d3.select("#my_data_svg").append("svg").attr("width", 1000).attr("height", 600)
 .append("g").attr("transform","translate(" + 60 + "," + 30 + ")");
    Promise.all([d3.csv('data/nasa_dataset.csv')])
       .then(function (values) {
           data_viz=values[0];
           //console.log(data_viz);
           
  submit();   
  });  
});

function submit()
{

 var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

svg.append("image").attr("x",800).attr("y",-25).attr("width", 20).attr("height",20).attr("href", "data/gas-giant.PNG")
svg.append("image").attr("x",800).attr("y",-5).attr("width", 20).attr("height",20).attr("href", "data/neptune.PNG")
svg.append("image").attr("x",800).attr("y",15).attr("width", 20).attr("height",20).attr("href", "data/earthlike.PNG")
svg.append("text").attr("x", 820).attr("y", -10).text("Gas Giant").style("font-size", "12px").style("fill","white").attr("alignment-baseline","middle")
svg.append("text").attr("x", 820).attr("y", 10).text("Neptune like").style("font-size", "12px").style("fill","white").attr("alignment-baseline","middle")
svg.append("text").attr("x", 820).attr("y", 30).text("Super Earth").style("font-size", "12px").style("fill","white").attr("alignment-baseline","middle")

x = d3.scaleLinear().range([ 0, width ]);
x_axis = svg.append("g").attr("class", "x_axis").attr("transform", "translate(0," + height + ")")
x.domain([0,20]);
x_axis.transition().duration(1000).call(d3.axisBottom(x));
svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - 60).attr("x",0 - (height / 2)).attr("dy", "1.5em")
.style("fill","white").style("text-anchor", "middle").text("Year Discovered"); 

y = d3.scaleTime().range([ height, 0]);
var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%Y"));
yAxis = svg.append("g").attr("class", "y_axis")  .call(yAxis);
y.domain([new Date(2000,0,1),new Date(2010,0,1)]);
yAxis.transition().duration(1000).call(d3.axisLeft(y));
svg.append("text").attr("id", "axisLabel").attr("transform","translate(" + (width / 2.5 + 100) + " ," + (height + 40) + ")").style("font-weight","bold").style("fill","white").style("text-anchor", "middle").text("Serial Number");

group1 = Array.from(
  d3.group(data_viz, d => d.discovery_year), ([key, value]) => ({key, value})
);
//console.log(group1);
group2 = Array.from(
  d3.group(data_viz, d => d.planet_type), ([key, value]) => ({key, value})
);
//console.log(group2);
group3 = Array.from(
d3.group(data_viz, d => d.detection_value), ([key, value]) => ({key, value})
);
//console.log(group3);

const line = d3.line().x(d => x(d.serial_number)).y(function(d) { return y(new Date(d["discovery_year"]))+10; });

svg.selectAll(".name")
   .data(data_viz)
   .join("path")
   .attr("class", "name")
   .attr("d", (d, i, nodes) => {
      
       //console.log("attr",d,i,nodes);

       const prev = i > 0 ? nodes[i-1].__data__ : null;
       const prevDetection = prev && prev.discovery_year === d.discovery_year ? prev.detection_value : null;
       

       if (prevDetection === d.detection_value) {
           const prevX = x(prev.serial_number);
           const prevY = y(prev.discovery_year);
          
           a=line([{serial_number: prev.serial_number, discovery_year: prev.discovery_year}, d]);
           //console.log(a);
           return a;
       } else {
           return null; 
       }
   })
   .attr("stroke", "white")
   .attr("stroke-width", 2)
   .attr("fill", "none");
  


   // Select circles
const circles = svg.selectAll(".circle").data(data_viz);

// Append image elements for circles
const circlesImage = circles.enter().append('svg:image')
  .attr("class", "circle")
  .merge(circles)
  .transition(1000)
  .attr('x', (d) => x(d.serial_number) - 0.5)
  .attr('y', (d) => y(new Date(d.discovery_year)))
  .attr('width', 20)
  .attr('height', 20)
  .attr("xlink:href", (d) => {
    if (d.planet_type == "Gas Giant") {
      return "data/gas-giant.PNG";
    } else if (d.planet_type == "Neptune-like") {
      return "data/neptune.PNG";
    } else {
      return "data/earthlike.PNG";
    }
  });

const elements = document.getElementsByClassName("circle");

   var fade_out=function(event)
   {
     div.transition()
          .duration(500)
          .style("opacity", 0);
   }
   var fade_in = function(event) {
    d=event["explicitOriginalTarget"]["__data__"];
    d=d["name"];
    div.transition().duration(200).style("opacity", 1);
    div.html("<span style='color:white'>Name:"+d+"<br>Method:"+event["explicitOriginalTarget"]["__data__"]["detection_method"]+"</span>")
   .style("left", (event.pageX) + "px").style("top", (event.pageY - 35) + "px");
       }
  for (var i = 0; i < elements.length; i++) {
     elements[i].addEventListener('mouseover', fade_in, false);
     elements[i].addEventListener('mouseout', fade_out, false);
  }
  
  }
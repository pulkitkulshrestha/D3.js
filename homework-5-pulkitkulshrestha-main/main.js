
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

document.addEventListener('DOMContentLoaded', function () {

    Promise.all([d3.csv('data/kidney_stone_data.csv')])
    .then(function (values) {
var dataLeft = values[0];
data = values[0];


// create an object to store the grouped data
const groupedData = {};
const groupedData1 = {};

// loop through the data and group it based on treatment and stone size
data.forEach(d => {
  const key = `${d.stone_size}-${d.treatment}`;
  if (!groupedData[key]) {
    groupedData[key] = { 
      stone_size: d.stone_size, 
      treatment: d.treatment, 
      successCount: 0, 
      totalCount: 0 
    };
  }
  if (d.success == 1) {
    groupedData[key].successCount++;
  }
  groupedData[key].totalCount++;
});

// calculate the success rate for each group
Object.values(groupedData).forEach(d => {
  d.successRate = d.successCount / d.totalCount;
});


//console.log(groupedData);

data.forEach(d => {
  const key = `${d.treatment}`;
  if (!groupedData1[key]) {
    groupedData1[key] = { 
      treatment: d.treatment,  
      successCount: 0, 
      totalCount: 0 
    };
  }
  if (d.success == 1) {
    groupedData1[key].successCount++;
  }
  groupedData1[key].totalCount++;
});

// calculate the success rate for each group
Object.values(groupedData1).forEach(d => {
  d.successRate = d.successCount / d.totalCount;
});

//console.log(groupedData1);

var svg = d3.select('#my_leftviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select(".w3-row-padding").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);  

// Define a color scale for the treatments
const treatmentColorScale = d3.scaleOrdinal()
  .range(["#d6d727", "#79ccb3"]);
  // Define a color scale for the treatments
const tooltip_color = d3.scaleOrdinal()
.range(["#e41a1c","#377eb8"]);

 // Set up the x-axis
var x = d3.scaleBand()
.domain(Object.keys(groupedData))
.range([0, width])
.padding(0.2);

// Add the x-axis to the chart
svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x).tickSizeOuter(0));

// Set up the y-axis
var y = d3.scaleLinear()
.domain([0, 100])
.range([height, 0]);

// Add the y-axis to the chart
svg.append("g")
.call(d3.axisLeft(y));

// Add the bars to the chart

  svg.selectAll("rect")
  .data(Object.values(groupedData))
  .enter().append("rect")
  .attr("x", d => x(`${d.stone_size}-${d.treatment}`))
  .attr("y", d => y(d.successCount / d.totalCount * 100))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.successCount / d.totalCount * 100))
  .attr("fill", d => treatmentColorScale(d.treatment))
  .on("mouseover", function(d,i) { 
    //console.log("pos",d,i);
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    //tooltip.html(`Success rate: ${(i.successCount / i.totalCount * 100)}`)
    tooltip.html(`Success rate: ${(i.successCount / i.totalCount * 100).toFixed(1)}%`)
      .style("left", (d.clientX) + "px")
      .style("top", ((d.clientY) - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

svg.append("text")
  .attr("x", width / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "1.2rem")
  .text("Success Rates by Treatment and Stone Size");

  svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (height / 2))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("Success Percentage");




var svg=d3.select("#my_rightviz").append("svg")
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);


 // Set up the x-axis
 var x_axis = d3.scaleBand()
 .domain(Object.keys(groupedData1))
 .range([0, width])
 .padding(0.2);
 
 // Add the x-axis to the chart
 svg.append("g")
 .attr("transform", `translate(0,${height})`)
 .call(d3.axisBottom(x_axis).tickSizeOuter(0));
 
 // Set up the y-axis
 var y_axis = d3.scaleLinear()
 .domain([0, 100])
 .range([height, 0]);
 
 // Add the y-axis to the chart
 svg.append("g")
 .call(d3.axisLeft(y_axis));
 
svg.selectAll("rect")
  .data(Object.values(groupedData1))
  .enter().append("rect")
  .attr("x", d => x_axis(`${d.treatment}`))
  .attr("y", d => y_axis(d.successCount / d.totalCount * 100))
  .attr("width", x_axis.bandwidth())
  .attr("height", d => height - y_axis(d.successCount / d.totalCount * 100))
  .attr("fill", d => treatmentColorScale(d.treatment))
  .on("mouseover", function(d,i) { 
   // console.log("pos",d);
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      //console.log(d.totalCount);
      //console.log(d.successRate);
      //tooltip.html(`Success rate: ${(i.successCount / i.totalCount * 100)}`)
    tooltip.html(`Success rate: ${(i.successCount / i.totalCount * 100).toFixed(1)}%`)
      .style("left", (d.clientX) + "px")
      .style("top", ((d.clientY) - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });




 svg.append("text")
 .attr("x", width / 2)
 .attr("y", margin.top / 2)
 .attr("text-anchor", "middle")
 .style("font-size", "1.2rem")
 .text("Success Rates by Treatment");

 svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (height / 2))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("Success Percentage");
 
                })
              
});

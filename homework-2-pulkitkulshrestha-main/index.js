var vowel, count_vowel, consonant, count_consonant, punctuation,count_punctuation;
var text_msg,charat;
var donut_tags, donut_col, donut_row, donut_radius,donut_wid;
function submitText(){
    text_msg = document.getElementById("wordbox").value;
    text_msg = text_msg.toLowerCase();
    vowel = {a:0,e:0,i:0,o:0,u:0,y:0}, count_vowel = 0,
    consonant = {b:0,c:0,d:0,f:0,g:0,h:0,j:0,k:0,l:0,m:0,n:0,p:0,q:0,r:0,s:0,t:0,v:0,w:0,x:0,z:0}, count_consonant=0,
    punctuation = {},count_punctuation=0;
  for (var a = 0; a < text_msg.length; a++) {
    charat = text_msg[a];
    if (charat=="."|| charat==","||charat=="?"||charat=="!"||charat==":"||charat==";") 
        {
          count_punctuation++;
          if(!punctuation[charat])
          punctuation[charat] = 1;
          else 
          punctuation[charat] = punctuation[charat]  + 1;
        }

    else if (charat == "a" || charat == "e" || charat == "i" || charat == "o" || charat == "u" || charat == "y")
      {
        count_vowel++;
        vowel[charat] = vowel[charat]  + 1;
      }
    else if (charat == " ") continue;
    
    else if (charat == "b" || charat == "c" || charat == "d" || charat == "f" || charat == "g" || charat == "h" || charat == "j" || charat == "k" || charat == "l" || charat == "m" || 
             charat == "n" || charat == "p" || charat == "q" || charat == "r" || charat == "s" || charat == "t" || charat == "v" || charat == "w" || charat == "x" || charat == "z")
      { 
        count_consonant++;
        consonant[charat] = consonant[charat]  + 1;
      }
    } 
    Donut_chart();    
  }

function Donut_chart(){

	  d3.select("#bar_svg").selectAll("svg").remove();
    d3.select("#character-name").text("NONE"); 
    d3.select("#pie_svg").selectAll("g").remove(); 
    
    donut_row = 350;
    donut_col = 540;
    donut_wid = 80;
	  donut_radius = Math.min(donut_col, donut_row) / 2;
    donut_tags =  [{label:"consonant", count:count_consonant},{label:"vowel", count:count_vowel},{label:"punctuation", count:count_punctuation}];

	var color = d3.scaleOrdinal().range(d3.schemeSet3);
	var donut_svg = d3.select('#pie_svg').append('g').attr('height', donut_row).attr('width', donut_col).attr('transform', 'translate(275,200)');
	var donut_arc = d3.arc().outerRadius(donut_radius).innerRadius(donut_radius - donut_wid);
	var donut_pie = d3.pie().value(d=>d.count).sort(null);
	var donut_tip = d3.select("body").append("div").attr("class", "donut-tip").style("opacity", 0);
  
	donut_data = donut_svg.selectAll('path').data(donut_pie(donut_tags)).enter().append('path').attr('d', donut_arc).attr('fill', function (a, b) {return color(a.data.label);
	  }).attr("stroke", "black").style("stroke-width", "1px").attr('transform', 'translate(0, 0)').on('click', (a, b, c) => {

		 createBarChart(b.data.label,color(b.data.label));
	  })
	.on('mouseover', function (a, b) {
	  d3.select(this).transition().attr('opacity', '.8').duration('50').style("stroke-width", "4px").attr("stroke", "black");
    donut_svg.append("text").attr("text-anchor", "middle").attr("id", "caption").text(b.data.label +" : "+ b.data.count );
	donut_tip.transition().style("opacity", 1).duration(50).style("stroke-width", "4px").attr("stroke", "black");}).on('mouseout', function (d, i) {
	d3.select("#caption").remove();
	d3.select(this).transition().attr('opacity', '1').duration('50').style("stroke-width", "1px").attr("stroke", "black");
	});
}

function createBarChart(charType,color)
  {
    d3.select("#bar_svg").selectAll("svg").remove();

    var barchart_margin = {top: 80, right: 25, bottom: 50, left: 80};
    var barchart_height = 350 - barchart_margin.top - barchart_margin.bottom;
    var barchart_width = 540 - barchart_margin.left - barchart_margin.right;
    
    var barchart_data ={};
    switch(charType){
        case 'consonant': barchart_data = consonant; break;
        case 'vowel': barchart_data = vowel; break;
        case 'punctuation': barchart_data = punctuation; break;
        default: break;    
    }
    var barchart_bars = [];
    for (const [key, values] of Object.entries(barchart_data)) {
        barchart_bars.push({label:key,count:values});

  }
  const mouse_out = function(event, i) 
  {
    barchart_tooltip.transition().duration(100).delay(100).style("opacity", 0);
    document.getElementById("character-name").innerHTML = 'None';
  }
  const mouse_move = function(event, i) 
  {
   barchart_tooltip.style("left",(event.x)+"px").style("top",(event.y)+"px");
  }
  const mouse_over = function(event, i) 
  {
   barchart_tooltip.html("Character: " + i.label + "<br>" + "Count: " + i.count).style("opacity", 1);
   document.getElementById("character-name").innerHTML = i.count;
  }

var x = d3.scaleBand().range([ 0, barchart_width ]).padding(0.25).domain(barchart_bars.map(function(i) { return i.label; }));
var y = d3.scaleLinear().domain([0, d3.max(barchart_bars, function(i) { return i.count; } )]).range([ barchart_height, 0]);
var barchart_svg = d3.select("#bar_svg").append("svg").attr("height", barchart_height + barchart_margin.top + barchart_margin.bottom).attr("width", barchart_width + barchart_margin.left + barchart_margin.right)
  .append("g").attr("transform","translate(" + barchart_margin.left + "," + barchart_margin.top + ")");
barchart_svg.append("g").attr("transform", "translate(0," + barchart_height + ")").call(d3.axisBottom(x)).selectAll("text").attr("transform", "translate(2,0)").style("text-anchor", "end");
barchart_svg.append("g").call(d3.axisLeft(y));

barchart_svg.selectAll("bar").data(barchart_bars).enter().append("rect").attr("x", function(i) { return x(i.label); }).attr("y", function(i) { return y(i.count); })
            .attr("width", x.bandwidth()).attr("height", function(i) { return barchart_height - y(i.count); }).attr("fill", color).on("mouseout", mouse_out).on("mousemove", mouse_move).on("mouseover", mouse_over);
            
const barchart_tooltip = d3.select("#bar_div").append("div").style("border-radius", "5px").style("border-width", "1px").style("opacity", 0).attr("class", "tooltip").style("position", "absolute").style("border", "solid").style("background-color", "white").style("padding", "10px")
 
};

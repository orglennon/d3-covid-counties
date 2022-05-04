
//Width and height of map
var width = 960;
var height = 500;

var date = "2020-03-07";

d3.select("#date").html(date);

var color = d3.scaleLinear()
              .domain([0,120])
              .range(["yellow", "red"])
              .unknown("#ccc")

//Create SVG element and append map to the SVG
var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, 975, 610]);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
        .append("div")   
        .attr("id", "tooltip")               
        .style("opacity", 0);



d3.json("data/counties-albers-10m.json").then((usJSON)=>{
  console.log(usJSON);

  path = d3.geoPath();

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(usJSON, usJSON.objects.counties).features)
    .join("path")
      .attr("class", "county")
      .attr("id", d => "county--" + d.id)
      .attr("fill", d => "#000000")
      .attr("d", path);
  
  d3.csv("data/us-counties.csv").then((covidData)=>{
    // console.log(covidData);

    var selectedData = [];

    for(var r = 0; r < covidData.length; r++){
      if(covidData[r].date == date){
        selectedData.push(covidData[r]);
      }
    }

    console.log(selectedData);

    d3.selectAll(".county")
      .data(topojson.feature(usJSON, usJSON.objects.counties).features)
      .attr("fill", d => {
        // console.log(d)
        var value = "no data";
        for(var r = 0; r < selectedData.length; r++){
          if(selectedData[r].fips == d.id){
            value = selectedData[r].cases;
          }
        }

        return color(value);
      })
      .attr("data-value", d => {
        // console.log(d)
        var value = "no-data";
        for(var r = 0; r < selectedData.length; r++){
          if(selectedData[r].fips == d.id){
            value = selectedData[r].cases;
          }
        }

        return value;
      })
      .on("mouseenter", (event, d) =>{
        var label = d3.select("#county--" + d.id).attr("data-value");
        if(label == "no-data"){
          label = "No data";
        } else {
          if(parseInt(label) == 1){
            label += " case";
          } else {
            label += " cases";
          }
        }



        d3.select("#tooltip")
          .html(label)
          .style("opacity", 1)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseleave", d =>{
        d3.select("#tooltip").style("opacity", 0);
      })
      
  });

});



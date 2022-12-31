let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();
let data
let values

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800  
let height = 600
let padding = 40;

let svg = d3.select("svg");

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
};

let generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      })
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  let years = values.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([height - padding, padding]);
};

let drawBars = () => {

    let tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);


    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('height', (d) => heightScale(d[1]))
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => height - heightScale(d[1]) - padding)
        .on("mouseover", (d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d[0] + "<br/>" + d[1])
                .attr("data-date", d[0])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })  
        .on("mouseout", (d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });   
};

let drawAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
};

req.open("GET", url, true)
req.onload = () => {
  data = JSON.parse(req.responseText)
  values = data.data;

  drawCanvas()
  generateScales()
  drawBars()
  drawAxes()
}
req.send()

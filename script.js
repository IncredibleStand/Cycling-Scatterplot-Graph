// Constants for chart dimensions
const width = 800;
const height = 500;
const padding = 60;

// Select container
const svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Tooltip container
const tooltip = d3.select("#tooltip");

// Fetch data
const DATA_URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(DATA_URL).then((data) => {
  // Convert time strings to Date objects for y-axis
  data.forEach((d) => {
    d.Time = new Date(`2007-02-11T00:${d.Time}`);
  });

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => d.Year - 1),
      d3.max(data, (d) => d.Year + 1),
    ])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([padding, height - padding]);

  // Create Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Create dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 7)
    .attr("fill", (d) => (d.Doping ? "tomato" : "lightgreen"))
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`)
        .attr("data-year", d.Year)
        .html(
          `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>
          ${d.Doping || "No doping allegations"}`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // Legend
  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("rect")
    .attr("x", width - 260)
    .attr("y", height / 6 - 40)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "tomato");

  legend
    .append("text")
    .attr("x", width - 240)
    .attr("y", height / 6 - 28)
    .text("Riders with doping allegations");

  legend
    .append("rect")
    .attr("x", width - 260)
    .attr("y", height / 6 - 10)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "lightgreen");

  legend
    .append("text")
    .attr("x", width - 240)
    .attr("y", height / 6 + 2)
    .text("No doping allegations");
});

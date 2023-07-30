
const url =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";



fetch(url)
  .then((res) => res.json())
  .then((data) => {
    json = data;
    const dataset = json.data;
    const title = json.source_name;

    const width = 1100;
    const height = 500;
    const padding = 60;

    document.getElementById("title").textContent = title;

    const svg = d3
      .select(".visHolder")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    const xScale = d3
      .scaleTime()
      .domain([
        new Date(dataset[0][0]),
        new Date(dataset[dataset.length - 1][0]),
      ])
      .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

    const Yscale = d3
    .scaleLinear()
    .domain([0, (dataset, d3.max(dataset, (d) => d[1]))])
    .range([height - padding, padding]);
  const yAxis = d3.axisLeft(Yscale);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("class", "tick")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);


    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("class", "tick")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => Yscale(d[1]))
      .attr("width", (width - 2 * padding) / dataset.length)
      .attr("height", (d) => height - padding - Yscale(d[1]))
      .attr("border", "none")


      .on("mousemove", (e, d) => {
        const tooltip = d3.select("#tooltip");

        tooltip
          .style("opacity", 0.9)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px")
          .style("font-size", "12px");

        tooltip.attr("data-date", d[0]).html(`${d[0]} <br> ${d[1]} Billion`);
      })

      .on("mouseout", () => {
        const tooltip = d3.select("#tooltip");

        tooltip.style("opacity", 0);
      });

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "#ffffff")
      .style("padding", "10px");
  });
    
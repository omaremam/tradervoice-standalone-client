import "./Chart.css";
import * as React from "react";
import { Stack, Typography, Tooltip, useTheme } from "@mui/material";
import * as d3 from "d3";
import * as fc from "d3fc";
import PropTypes from "prop-types";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WeightsStats from "./WeightsStats";
import { red } from "@mui/material/colors";
import ArticleBox from "./ArticleBox";
import { useSearchParams } from "react-router-dom";

const SP_VALUES = "values";
const SP_VALUES_SENTIMENT = "sentiment";

const Chart = ({ timeSeries, onMouseMoveCallback, data, isCrossChosen }) => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const svg = React.useRef(null);

  const [isSentimentSelected, setSentimentSelected] = React.useState(searchParams.get(SP_VALUES) === SP_VALUES_SENTIMENT);
  const [selectedArticle, setSelectedArticle] = React.useState(null);
  const [xDomain, setXDomain] = React.useState();

  React.useMemo(() => {
    setSelectedArticle(null); // Hide article (if any) when origin may change.
  }, [isSentimentSelected, xDomain]);

  React.useEffect(() => {
    renderChart(
      timeSeries.meta.from,
      timeSeries.price.points.map((p) => ({ ...p, tstamp: new Date(p.tstamp) })), // TODO Possible to render discontinuities as dimmed background fade?
      timeSeries.price.color,
      timeSeries.weights.map((e) => e.points.map((p) => ({ ...p, tstamp: new Date(p.tstamp), value: isSentimentSelected ? p.sentiment : p.prevalence }))),
      timeSeries.weights.map((e) => e.color),
      isSentimentSelected,
      onMouseMoveCallback
    );
  }, [timeSeries, isSentimentSelected, xDomain]);

  const handleSentimentSelection = (selection) => {
    setSearchParams(
      (sp) => {
        if (selection) {
          sp.set(SP_VALUES, SP_VALUES_SENTIMENT);
        } else {
          sp.delete(SP_VALUES);
        }

        return sp;
      },
      { replace: true }
    );
    setSentimentSelected(selection);
  };

  /**
   * @param {Date} from
   * @param {{price: number | null, tstamp: Date}[]} pricePoints
   * @param {string} priceColor
   * @param {{significant: any | null, tstamp: Date, value: number}[]} weightsPoints
   * @param {string[]} weightsColors
   * @param {boolean} weightsUseSentiment
   */
  const renderChart = (from, pricePoints, priceColor, weightsPoints, weightsColors, weightsUseSentiment, onMouseMoveCallback) => {
    const hasPrice = pricePoints.length > 0;
    const significantPoints = weightsPoints.flatMap((series, i) =>
      series.filter((point) => point.significant != null).map((point) => ({ ...point, color: weightsColors[i] }))
    );

    const domainWeights = fc.extentLinear().accessors([(d) => d.value])(weightsPoints.flatMap((p) => p));
    let rangeWeights = [0, 100]; // Prevalence is normalized to the range [0, 100] (unless prices are provided)
    if (weightsUseSentiment) {
      const weightValueMultiplier = 100 / Math.max(...domainWeights.map(Math.abs));
      rangeWeights = domainWeights.map((d) => d * weightValueMultiplier); // Sentiment is normalized inside the bounds of [-100, 100] (unless prices are provided)
    }
    const [yMin, yMax] = hasPrice ? fc.extentLinear().accessors([(d) => d.price])(pricePoints) : rangeWeights;
    const yPadding = 0.05 * (yMax - yMin); // 5% top and bottom padding

    const scaleWeightFn = d3.scaleLinear().domain(domainWeights).range([yMin, yMax]);

    // Price (single series, may be empty)
    const priceSeries = fc
      .seriesSvgArea()
      .mainValue((d) => d.price)
      .crossValue((d) => d.tstamp)
      .baseValue((_) => yMin - yPadding) // Make sure gradient goes all the way to the Y-axis
      .decorate((sel) => sel.enter().attr("fill", () => "url(#price-area-gradient)"));

    // Weights (multiple series)
    const weightsSeries = fc
      .seriesSvgRepeat()
      .series(
        fc
          .seriesSvgLine()
          .mainValue((d) => scaleWeightFn(d.value))
          .crossValue((d) => d.tstamp)
          .decorate(
            (sel) => sel.attr("stroke", () => null) // In order to let repeat-series color by index.
          )
      )
      .orient("horizontal")
      .decorate((sel) => sel.attr("stroke", (_, i) => weightsColors[i]).attr("stroke-width", () => 2));

    // Grid lines
    const gridlines = fc
      .annotationSvgGridline()
      .yTicks(hasPrice ? 7 : 0)
      .xTicks(0);

    // Significant tooltip
    const significantSeries = fc
      .seriesSvgPoint()
      .size(100)
      .crossValue((d) => d.tstamp)
      .mainValue((d) => scaleWeightFn(d.value))
      .decorate((sel) => {
        sel
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", () => 0.7)
          .attr("stroke", () => theme.palette.background.default);
        sel.on("mousemove", (e, d) => {
          setSelectedArticle({
            article: d.significant,
            x: Math.max(0, e.pageX - 150),
            y: e.pageY,
          });
        });
      });

    /* Labels for significant articles. Add to multi.series and multi.mappings (along points)
    const textLabelPadding = 2;
    const textLabel = fc
      .layoutTextLabel()
      .padding(textLabelPadding)
      .value(d => d.significant.title.length > 25 ? d.significant.title.substring(0, 20) + '…' : d.significant.title)
    const labels = fc
      .layoutLabel(fc.layoutAnnealing().temperature(5))
      .size((d, i, g) => {
        const textSize = g[i].getElementsByTagName('text')[0].getBBox();
        return [textSize.width + 2 * textLabelPadding, textSize.height + 2 * textLabelPadding];
      })
      .position(d => [d.tstamp, scaleWeightFn(d.value)])
      .component(textLabel)
      .decorate(sel => {
        sel
          .on('click', (e, d) => console.error('navigate', d.significant.url));

        sel.on('mouseover', (e, d) => {
          tooltipContainer
            .text(d.significant.title)
            //.attr('transform', 'translate(4, -2)')
            .style("left", e.pageX + "px")
            .style("top", e.pageY + "px");
        })
      });
     */

    const multi = fc
      .seriesSvgMulti()
      .series([gridlines, priceSeries, weightsSeries, significantSeries])
      .mapping((data, index, series) => {
        switch (series[index]) {
          case significantSeries:
            return data.significantPoints;
          case priceSeries:
            return data.pricePoints;
          default:
            return data.weightsPoints;
        }
      });

    const xScale = d3.scaleTime().domain(xDomain || [from, new Date()]);
    const xScaleOriginal = xScale.copy();


    let totalWidth = 0;

    const chart = fc
      .chartCartesian({
        xScale,
        yScale: d3.scaleLinear().domain([yMin - yPadding, yMax + yPadding]),
        xAxis: {
          bottom: (scale) => fc.axisLabelRotate(fc.axisOrdinalBottom(scale)),
        },
      })
      .svgPlotArea(multi)
      .decorate((sel) => {
        sel
          .enter()
          .selectAll(".x-axis")
          .on("measure.range", (event) => {
            totalWidth = event.detail.width;
            return xScaleOriginal.range([0, event.detail.width]);
          });
      });

    if (weightsUseSentiment) {
      chart.yDecorate((sel) => sel.select("text").style("fill", (d) => (d < 0 ? red["A400"] : undefined)));
    }

    d3.select(svg.current)
  .datum({
    pricePoints,
    weightsPoints,
    significantPoints,
  })
  .on("mousemove", (event, datum) => {
    const svgElement = event.target;
    const { width,height } = svgElement.getBoundingClientRect();
    const totalWidth = width;
    const totalHeight = height;
    
    


    const [x, y] = d3.pointer(event);



    const lineData = []; // Array to store line points

  const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveLinear);

  const svgP = d3.select(".air-quality");

  svgP.on("mousedown", (event) => {
    const [x, y] = d3.pointer(event);

    console.log("PRESSS")


    // Store the clicked point in the line data array
    lineData.push({ x, y });

    // Redraw the line
    svgP.select(".line").attr("d", line(lineData));

    // Append a path element for the line
  svgP.append("line")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2);
  });

  

    // Find the closest price point to the mouse cursor

    onMouseMoveCallback({xFactor: x/totalWidth, yFactor: y/totalHeight});
  })
  .call(chart);

}

  return (
    <React.Fragment>
      <div style={{zIndex: "99", position: "absolute", left: 15}}>
      {isCrossChosen && <p>{"Timestamp: " + data.tstamp + "\n"   + "Price: " + data.price} </p>}

      </div>

      <svg style={{ width: 0, height: 0 }}>
        <defs>
          <linearGradient id="price-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopOpacity="1" stopColor={timeSeries.price.color} />
            <stop offset="100%" stopOpacity="0.2" stopColor={timeSeries.price.color} />
          </linearGradient>
        </defs>
      </svg>
      <d3fc-svg ref={svg} style={{ flex: "1 0 auto", width: "70vw", height: "60vh" }} />
      {selectedArticle && (
        <ArticleBox
          article={selectedArticle.article}
          onDismiss={() => setSelectedArticle(null)}
          style={{
            position: "absolute",
            left: selectedArticle.x,
            right: 0,
            top: selectedArticle.y + 5,
            zIndex: 9999,
          }}
        />
      )}
      {timeSeries.meta.weightsStats && <WeightsStats sx={{ ml: 2, mr: 8 }} stats={timeSeries.meta.weightsStats} />}
    </React.Fragment>
  );
};

Chart.propTypes = {
  timeSeries: PropTypes.shape({
    meta: PropTypes.shape({
      from: PropTypes.instanceOf(Date).isRequired,
      weightsStats: PropTypes.object,
    }).isRequired,
    price: PropTypes.shape({
      color: PropTypes.string.isRequired,
      points: PropTypes.arrayOf(
        PropTypes.shape({
          price: PropTypes.number.isRequired,
          tstamp: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    weights: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string.isRequired,
        points: PropTypes.arrayOf(
          PropTypes.shape({
            prevalence: PropTypes.number.isRequired,
            sentiment: PropTypes.number.isRequired,
            significant: PropTypes.object,
            tstamp: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Chart;

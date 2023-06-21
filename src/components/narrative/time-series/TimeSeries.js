import React, { useRef, useState } from "react";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import Symbols from "./Symbols";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Chart from "./Chart";
import SearchInput from "./SearchInput";
import Intro from "../../Intro";
import Summary from "./Summary";
import TimeSeriesHeader from "./time-series-header";
import MainStock from "./main-stock";
import NarrativePosts from "./narrative-posts";
import "./TimeSeries.css";
import cross from "../../../gfx/cross.svg";
import trendLine from "../../../gfx/trendline.svg";
import TransparentContainer from "./TransparentContainer";

const TimeSeries = () => {
  const theme = useTheme();

  const [combinedTimeSeries, setCombinedTimeSeries] = React.useState();
  const [symbolTimeSeries, setSymbolTimeSeries] = React.useState();
  const [textTimeSeries, setTextTimeSeries] = React.useState([]);
  const [isTextLoading, setTextLoading] = React.useState(false);
  const [isCrossChosen, setIsCrossChosen] = React.useState(false);
  const [isTrendLineChosen, setIsTrendLineChosen] = React.useState(false);
  const [inChart, setInChart] = React.useState(false);

  const [cursorClassName, setCursorClassName] = React.useState("");

  const [currentHoverChart, setCurrentHoverChart] = React.useState({
    tstamp: "",
    price: "",
  });

  const parentDivRef = React.useRef(null);

  React.useEffect(() => {
    if (isCrossChosen) setCursorClassName("custom-cursor-cross");
    else setCursorClassName("custom-cursor-line");
  }, [isCrossChosen, isTrendLineChosen]);

  React.useMemo(() => {
    const isSymbolsLoaded = symbolTimeSeries !== undefined;
    const isAnyTextsLoaded = textTimeSeries.length > 0;
    if (isSymbolsLoaded || isAnyTextsLoaded) {
      const earliestDate = textTimeSeries
        .concat(isSymbolsLoaded ? [symbolTimeSeries] : [])
        .map((ts) => new Date(ts.from))
        .reduce((min, date) => (date < min ? date : min));

      setCombinedTimeSeries({
        meta: {
          from: earliestDate,
          weightsStats: isAnyTextsLoaded ? textTimeSeries[0].statistics : null, // TODO Which one to use? Or have stats in separate endpoint?
        },
        price: {
          color: theme.palette.primary.main,
          points: isSymbolsLoaded ? symbolTimeSeries.points : [],
        },
        weights: textTimeSeries,
      });
    } else {
      setCombinedTimeSeries(undefined);
    }
  }, [symbolTimeSeries, textTimeSeries]);

  const handleTextTimeSeries = (loaded, loading) => {
    setTextTimeSeries(loaded);
    setTextLoading(loading > 0);
  };

  const handleChartMouseMove = (point) => {
    let prices = combinedTimeSeries.price.points.map((price) => {
      return price;
    });

    console.log(prices);
    if (point.xFactor <= 1) setCurrentHoverChart(prices[Math.round(prices.length * point.xFactor) - 1]);
  };

  const getParentDivWidth = () => {
    if (parentDivRef.current) {
      return parentDivRef.current.offsetWidth;
    }
    return 0;
  };

  return (
    <>
      <TimeSeriesHeader />

      <div className={cursorClassName} style={{ display: "flex" }}>
        <div style={{ minWidth: "80%" }}>
          <MainStock />

          <Grid container direction="row" justifyContent="space-between">
            <Grid container direction="column" item sm={12} md={9}>
              <Grid container item minHeight={750} flexDirection="column">
                {combinedTimeSeries && (
                  <div style={{ display: "flex", height: "100%", width: "100%", justifyContent: "space-between" }}>
                    <div className="tools" style={{ width: "5vw", marginLeft: "35px", height: "75%" }}>
                      <p
                        onClick={() => {
                          setIsCrossChosen(true);
                          setIsTrendLineChosen(false);
                        }}
                      >
                        <img src={cross}></img>
                      </p>

                      <p
                        onClick={() => {
                          setIsTrendLineChosen(true);
                          setIsCrossChosen(false);
                        }}
                      >
                        <img src={trendLine}></img>
                      </p>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "relative", zIndex: isCrossChosen ? 2 : 1 }}>
                        <Chart
                          timeSeries={combinedTimeSeries}
                          onMouseMoveCallback={handleChartMouseMove}
                          data={currentHoverChart}
                          isCrossChosen={isCrossChosen}
                        />
                      </div>
                      <div
                        ref={parentDivRef}
                        style={{ position: "absolute", top: 0, left: 0, width: "70vw", height: "80%", zIndex: isTrendLineChosen ? 2 : 1 }}
                      >
                        {console.log(getParentDivWidth())}
                        <TransparentContainer width={getParentDivWidth()} />
                      </div>
                    </div>

                    {/* Place TransparentContainer on top */}
                  </div>
                )}
                {!combinedTimeSeries && !isTextLoading && (
                  <Box sx={{ pl: 2, pr: 8, pt: 2, my: "auto" }}>
                    <Intro />
                  </Box>
                )}

                {!combinedTimeSeries && isTextLoading && (
                  <Container maxWidth={"sm"} sx={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                    <EngineeringIcon sx={{ alignSelf: "center", color: theme.palette.action.disabled, fontSize: 120 }} />
                    <Typography color={theme.palette.action.disabled} component="p" gutterBottom textAlign="center" variant="h5">
                      We're crunching the numbers!
                    </Typography>
                    <Typography color={theme.palette.action.disabled} component="p" textAlign="center">
                      Please be patient as this may take a few seconds.
                    </Typography>
                  </Container>
                )}
              </Grid>

              <Grid
                item
                component="ol"
                sx={{
                  listStyle: "none",
                  p: 0,
                  ml: 2,
                  mr: 8,
                }}
              >
                <Grid item>
                  <SearchInput onTimeSeries={handleTextTimeSeries} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div>
          <NarrativePosts />

          <Grid item sm="auto" md={3}>
            {console.log(symbolTimeSeries)}
            <Symbols onTimeSeries={setSymbolTimeSeries} />
          </Grid>
        </div>
      </div>
    </>
  );
};

export default TimeSeries;

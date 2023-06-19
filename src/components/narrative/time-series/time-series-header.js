import * as React from "react";
import "./time-series-header.css";
import logo from "../../../gfx/small-logo.svg"
import bookmark from "../../../gfx/bookmark.svg"
import theme from "../../../gfx/theme-icon.svg"
import arrowDown from "../../../gfx/arrow-down.svg"
import arrowUp from "../../../gfx/arrow-up.svg"

function TimeSeriesHeader(props) {
  const [mainStock, setMainStock] = React.useState({
    currentPrice: 0.4750,
    trend: false,
    name: "SVB Financial Group (SIVBQ)",
  });

  const [narratives, setNarratives] = React.useState([]);

  return (
    <>
      <div className="header-main">
        <div className="header-left">
          <div className="header-left-main">
            <img className="logo" src={logo}></img>
            <div className="main-stock"></div>
          </div>

          <div className="header-left-narratives">
            {narratives.map((narrative) =>{
                return <div className="narrative"></div>
            })}

          </div>
        </div>
        <div className="header-right">
            <img src={bookmark}></img>
            <img src={theme}></img>


        </div>
      </div>
    </>
  );
}

export default TimeSeriesHeader;

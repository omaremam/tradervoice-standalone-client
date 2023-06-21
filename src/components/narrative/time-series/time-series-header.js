import * as React from "react";
import "./time-series-header.css";
import logo from "../../../gfx/small-logo.svg"
import bookmark from "../../../gfx/bookmark.svg"
import bookmarkGreen from "../../../gfx/bookmarkGreen.svg"
import theme from "../../../gfx/theme-icon.svg"
import arrowDown from "../../../gfx/arrow-down.svg"
import arrowUp from "../../../gfx/arrow-up.svg"

function TimeSeriesHeader(props) {
  const [mainStock, setMainStock] = React.useState({
    currentPrice: 0.4750,
    trend: false,
    name: "SVB Financial Group (SIVBQ)",
  });

  const [isBookmarked, setIsBookmarked] = React.useState(false)

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
          {console.log(isBookmarked)}
          {isBookmarked? <img style={ isBookmarked?{fill:  "green"} : {fill: "white"}} onClick={() => {
              setIsBookmarked(!isBookmarked)
            }} src={bookmarkGreen}></img> : <img style={ isBookmarked?{fill:  "green"} : {fill: "white"}} onClick={() => {
              setIsBookmarked(!isBookmarked)
            }} src={bookmark}></img>}
           
            <img src={theme}></img>


        </div>
      </div>
    </>
  );
}

export default TimeSeriesHeader;

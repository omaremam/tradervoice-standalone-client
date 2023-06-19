import React, { useState } from "react";
import mainStockIcon from "../../../gfx/svb-icon.svg";
import arrowDown from "../../../gfx/arrow-down.svg"
import "./main-stock.css";

function MainStock(props) {
  const [mainStock, setMainStock] = useState({
    currentPrice: 0.4750,
    trend: false,
    name: "SVB Financial Group (SIVBQ)",
    trendText: "-0.0750 -13.64",
    marketVolume: "3.29M",
    marketVolumeTrend: false,
    marketVolumeTrendChange: "-0.67%",
    marketCap: "3.29M",
    marketCapTrend: true,
    marketCapTrendChange: "+1.56%",
    dividendYield: "0.70%"
  });
  return (
    <>
      <div className="main-stock-card">
        <img style={{height: "40px", marginTop: "5px"}} src={mainStockIcon}></img>

        <div className="main-stock-info">
          <div className="main-stock-topSection">
            <div style={{marginLeft: "10px"}}>
                <p className="main-stock-name">{mainStock.name}</p>
            </div>
            <button className="button">Add template +</button>
          </div>
          <div className="main-stock-bottomSection">
            <div className="main-stock-bottomSection-priceContainer">
                <div className="price-tag">
                    <div style={{fontSize: "15px", alignSelf: "flex-start"}}>$</div>
                    <div style={{fontSize: "24px"}}>{mainStock.currentPrice}</div>
                    <div className="main-stock-trend red" style={{marginLeft: "10px"}}>
                        
                        {mainStock.trendText}
                        <img style={{marginLeft: "5px"}} src={arrowDown}></img>

                        </div>
                </div>
                <div className="last-used-tag">Last updated: Jun 16, 2023 4:00 p.m EDT</div>
            </div>
            <div className="extra-insights">
                <div>
                    <div className="extra-insights-titles">Market Volume</div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className="extra-insights-content">{mainStock.marketVolume}</div>
                        <div className="extra-insights-trend green">{mainStock.marketVolumeTrendChange}</div>
                    </div>
                </div>
                <div>
                    <div className="extra-insights-titles">Market Cap</div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className="extra-insights-content">{mainStock.marketVolume}</div>
                        <div className="extra-insights-trend red">{mainStock.marketCapTrendChange}</div>
                    </div>
                </div>
                <div>
                    <div className="extra-insights-titles">Dividend Yield</div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className="extra-insights-content">{mainStock.dividendYield}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainStock;

import React, { useState } from 'react';
import "./main-stock.css"
import arrowDown from "../../../gfx/arrow-down.svg"
import mainStockIcon from "../../../gfx/svb-icon.svg";



function NarrativeCard(props) {
    const [narrative, setNarrative] = useState(
        {
            currentPrice: 110.4750,
            trend: false,
            name: props.data.text,
            trendText: "-0.0750 -13.64",
            marketVolume: "3.29M",
            marketVolumeTrend: false,
            marketVolumeTrendChange: "-0.67%",
            marketCap: "3.29M",
            marketCapTrend: true,
            marketCapTrendChange: "+1.56%",
            dividendYield: "0.70%"
    })
    return ( <>
    <div className='narrative-main-card'>
        <div className='narrative-top-section'>
        <img src={mainStockIcon}></img>
        <div style={{marginLeft: "6px"}}>{narrative.name}</div>
        </div>
        <div style={{display: "flex", justifyContent:"space-between", width:"100%", marginTop: "20px"}}>
        <div className="main-stock-bottomSection-priceContainer" style={{marginTop: "0"}}>
                <div className="price-tag">
                    <div style={{fontSize: "10px", alignSelf: "flex-start"}}>$</div>
                    <div style={{fontSize: "18px"}}>{narrative.currentPrice}</div>
                    <div className="main-stock-trend red" style={{marginLeft: "10px", fontSize:"12px"}}>
                        
                    {narrative.trendText}
                        <img style={{marginLeft: "5px"}} src={arrowDown}></img>

                        </div>
                </div>
                <div className="last-used-tag" style={{fontSize: "10px"}}>Last updated: Jun 16, 2023 4:00 p.m EDT</div>
            </div>
<div>
    <div className="narrative-more-info">Volume: <strong style={{color:"black"}}>{narrative.marketVolume}</strong></div>
    <div  className="narrative-more-info">Market Cap: <strong style={{color:"black"}}>{narrative.marketCap}</strong></div>
    <div  className="narrative-more-info">dividend: <strong style={{color:"black"}}>{narrative.dividendYield} </strong></div>
</div>
        </div>

    </div>
    </> );
}

export default NarrativeCard;
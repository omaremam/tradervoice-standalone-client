import React from "react";
import "./narrative-posts.css";
import filterIcon from "../../../gfx/filter.svg" 


function NarrativePosts() {
  const [narratives, setNarratives] = React.useState(["NVDA", "TSLA"]);
  const [chosenNarrative, setChosenNarrative] = React.useState("NVDA");

  return (
    <>
      <div className="narrative-posts-container">
        <div style={{ display: "flex", width: "100%", height: "40px" }}>
          {narratives.map((narrative) => {
            let style;
            if (narrative === chosenNarrative) {
              style = { width: "50%", backgroundColor: "#79BA11", border: "none", color: "white", cursor: "pointer" };
            } else {
              style = { width: "50%", backgroundColor: "white", border: "none", color: "#79BA11", cursor: "pointer" };
            }
            return (
              <button
                onClick={() => {
                  setChosenNarrative(narrative);
                }}
                style={style}
              >
                {narrative}
              </button>
            );
          })}
        </div>

        <div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", marginTop: "25px"}}>
          <div className="narrative-posts-title">{chosenNarrative} Related Articles</div>
          <img src={filterIcon}></img>
          </div>
          

        </div>

        <div>
            <div className="article-card">
                <div className="article-title">The Banking Crisis Of Mar’23, Silicon Valley Bank</div>
                <div className="article-subtitle">Published: 3/23/2023, 1:40 PM</div>
                <div className="article-subtitle">Via: Newsweek (newsweek.com)</div>
            </div>

            <div className="article-card">
                <div className="article-title">The Banking Crisis Of Mar’23, Silicon Valley Bank</div>
                <div className="article-subtitle">Published: 3/23/2023, 1:40 PM</div>
                <div className="article-subtitle">Via: Newsweek (newsweek.com)</div>
            </div>

            <div className="article-card">
                <div className="article-title">The Banking Crisis Of Mar’23, Silicon Valley Bank</div>
                <div className="article-subtitle">Published: 3/23/2023, 1:40 PM</div>
                <div className="article-subtitle">Via: Newsweek (newsweek.com)</div>
            </div>

            <div className="article-card">
                <div className="article-title">The Banking Crisis Of Mar’23, Silicon Valley Bank</div>
                <div className="article-subtitle">Published: 3/23/2023, 1:40 PM</div>
                <div className="article-subtitle">Via: Newsweek (newsweek.com)</div>
            </div>



        </div>
      </div>
    </>
  );
}

export default NarrativePosts;

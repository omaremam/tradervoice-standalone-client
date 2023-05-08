import * as d3fc from 'd3fc';
import * as d3 from 'd3';
import {LoremIpsum} from 'lorem-ipsum';

const sleep = delayMs =>
  new Promise(resolve => setTimeout(resolve, (delayMs / 2) + (delayMs * Math.random())))

const lookback = () => {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - 3);
  date.setUTCHours(0, 0, 0, 0); // Start of day.

  return date;
}

const allSymbols = [{"symbol":"AMC","label":"AMC","name":"AMC Entertainment Holdings, Inc","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":5.89,"changeAbs":-0.05000000000000071,"changePct":-0.8417508417508537},{"symbol":"BTC-USD","label":"BTCUSD","name":"Bitcoin USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":28016.342,"changeAbs":-168.26800000000003,"changePct":-0.5970208564177402},{"symbol":"CNY=X","label":"USDCNY","name":"USD/CNY","type":"CURRENCY","tstamp":"2023-05-08T08:02:02.000Z","price":6.9144,"changeAbs":-0.002400000000000624,"changePct":-0.03469812630118876},{"symbol":"EUR=X","label":"USDEUR","name":"USD/EUR","type":"CURRENCY","tstamp":"2023-05-08T08:01:40.000Z","price":0.9045,"changeAbs":-0.000300000000000078,"changePct":-0.03315649867374867},{"symbol":"MATIC-USD","label":"MATICUSD","name":"Polygon USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":0.929873,"changeAbs":-0.0045280000000000875,"changePct":-0.4845885224866077},{"symbol":"NVDA","label":"NVDA","name":"NVIDIA Corporation","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":286.8,"changeAbs":0.5500000000000114,"changePct":0.19213973799127035},{"symbol":"CAD=X","label":"USDCAD","name":"USD/CAD","type":"CURRENCY","tstamp":"2023-05-08T08:02:05.000Z","price":1.3353,"changeAbs":-0.000400000000000178,"changePct":-0.029946844351289807},{"symbol":"SI=F","label":"Silver","name":"Silver Jul 23","type":"FUTURE","tstamp":"2023-05-08T07:51:51.000Z","price":25.92,"changeAbs":0.020000000000003126,"changePct":0.07722007722008929},{"symbol":"SOL-USD","label":"SOLUSD","name":"Solana USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":21.208485,"changeAbs":-0.10985300000000109,"changePct":-0.5152981437858856},{"symbol":"USDT-USD","label":"USDTUSD","name":"Tether USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":1.0013205,"changeAbs":-0.000012699999999865597,"changePct":-0.001268309090307362},{"symbol":"XRP-USD","label":"XRPUSD","name":"XRP USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":0.43680912,"changeAbs":-0.0023748299999999944,"changePct":-0.5407369736530659},{"symbol":"AMD","label":"AMD","name":"Advanced Micro Devices, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":89.84,"changeAbs":-0.07500000000000284,"changePct":-0.08341211143858404},{"symbol":"AUD=X","label":"USDAUD","name":"USD/AUD","type":"CURRENCY","tstamp":"2023-05-08T08:02:04.000Z","price":1.4734,"changeAbs":0.00019999999999997797,"changePct":0.013575889220742463},{"symbol":"BUSD-USD","label":"BUSDUSD","name":"Binance USD USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":1.000619,"changeAbs":0.00029799999999990945,"changePct":0.029790437269627393},{"symbol":"CL=F","label":"Oil","name":"Crude Oil Jun 23","type":"FUTURE","tstamp":"2023-05-08T07:52:01.000Z","price":72.34,"changeAbs":0.25,"changePct":0.3467887363018449},{"symbol":"GBP=X","label":"USDGBP","name":"USD/GBP","type":"CURRENCY","tstamp":"2023-05-08T08:01:40.000Z","price":0.791,"changeAbs":-0.00029999999999996696,"changePct":-0.03791229622140364},{"symbol":"JPY=X","label":"USDJPY","name":"USD/JPY","type":"CURRENCY","tstamp":"2023-05-08T08:02:04.000Z","price":134.973,"changeAbs":-0.05299999999999727,"changePct":-0.039251699672653614},{"symbol":"META","label":"META","name":"Meta Platforms, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":232.78,"changeAbs":-1.240000000000009,"changePct":-0.5298692419451367},{"symbol":"SQ","label":"SQ","name":"Block, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":59.25,"changeAbs":0.10999999999999943,"changePct":0.18599932363882216},{"symbol":"USDC-USD","label":"USDCUSD","name":"USD Coin USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":1.0000079,"changeAbs":-0.000021199999999943486,"changePct":-0.002119938309789534},{"symbol":"GBPUSD=X","label":"GBPUSD","name":"GBP/USD","type":"CURRENCY","tstamp":"2023-05-08T08:01:40.000Z","price":1.2642,"changeAbs":0.0004999999999999449,"changePct":0.03956635277359697},{"symbol":"ADA-USD","label":"ADAUSD","name":"Cardano USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":0.36655876,"changeAbs":-0.0018580400000000052,"changePct":-0.5043309642774176},{"symbol":"BNB-USD","label":"BNBUSD","name":"BNB USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":316.93027,"changeAbs":-0.7240299999999706,"changePct":-0.2279301744065705},{"symbol":"DOGE-USD","label":"DOGEUSD","name":"Dogecoin USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":0.07450317,"changeAbs":-0.00023946000000001078,"changePct":-0.32037941399708675},{"symbol":"EURUSD=X","label":"EURUSD","name":"EUR/USD","type":"CURRENCY","tstamp":"2023-05-08T08:01:40.000Z","price":1.1056,"changeAbs":0.00039999999999995595,"changePct":0.036192544335862824},{"symbol":"HOOD","label":"HOOD","name":"Robinhood Markets, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":8.85,"changeAbs":0.07499999999999929,"changePct":0.8547008547008466},{"symbol":"INTC","label":"INTC","name":"Intel Corporation","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":30.99,"changeAbs":-0.0400000000000027,"changePct":-0.12890750886239993},{"symbol":"NFLX","label":"NFLX","name":"Netflix, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":322.76,"changeAbs":0.3849999999999909,"changePct":0.11942613416052451},{"symbol":"SHIB-USD","label":"SHIBUSD","name":"Shiba Inu USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":0.000008942,"changeAbs":-8.399999999999953e-8,"changePct":-0.9306448038998397},{"symbol":"TSLA","label":"TSLA","name":"Tesla, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":170.06,"changeAbs":-0.09999999999999432,"changePct":-0.058768218147622425},{"symbol":"^NDX","label":"NDX","name":"NASDAQ 100","type":"INDEX","tstamp":"2023-05-05T20:00:00.000Z","price":13259.132,"changeAbs":-15.59100000000035,"changePct":-0.11744877840389098},{"symbol":"AAPL","label":"AAPL","name":"Apple Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":173.57,"changeAbs":-0.17500000000001137,"changePct":-0.1007223229445517},{"symbol":"AMZN","label":"AMZN","name":"Amazon.com, Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":105.655,"changeAbs":0.16500000000000625,"changePct":0.15641293013556382},{"symbol":"ETH-USD","label":"ETHUSD","name":"Ethereum USD","type":"CRYPTOCURRENCY","tstamp":"2023-05-08T08:00:00.000Z","price":1853.6692,"changeAbs":-9.235500000000002,"changePct":-0.49575804924427974},{"symbol":"GC=F","label":"Gold","name":"Gold Jun 23","type":"FUTURE","tstamp":"2023-05-08T07:51:59.000Z","price":2028.8,"changeAbs":0.20000000000004547,"changePct":0.009859016070198437},{"symbol":"GME","label":"GME","name":"GameStop Corporation","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":20.42,"changeAbs":0.3000000000000007,"changePct":1.491053677932409},{"symbol":"GOOGL","label":"GOOGL","name":"Alphabet Inc.","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":105.57,"changeAbs":0.09999999999999432,"changePct":0.09481369109698902},{"symbol":"MSFT","label":"MSFT","name":"Microsoft Corporation","type":"EQUITY","tstamp":"2023-05-05T20:00:00.000Z","price":310.65,"changeAbs":-1.1299999999999955,"changePct":-0.36243505035601886},{"symbol":"^DJI","label":"DJI","name":"Dow Jones Industrial Average","type":"INDEX","tstamp":"2023-05-05T20:00:00.000Z","price":33674.38,"changeAbs":-28.889999999999418,"changePct":-0.08571868545692872},{"symbol":"^SPX","label":"SPX","name":"S&P 500 INDEX","type":"INDEX","tstamp":"2023-05-05T20:00:00.000Z","price":4136.25,"changeAbs":-5.220000000000255,"changePct":-0.12604220240639807},{"symbol":"^VIX","label":"VIX","name":"CBOE Volatility Index","type":"INDEX","tstamp":"2023-05-05T20:00:00.000Z","price":17.81,"changeAbs":0.9299999999999997,"changePct":5.5094786729857805}];

const loremIpsum = new LoremIpsum();

const symbols = async () => {
  await sleep(500);

  return allSymbols;
}

const symbol = async symbol => {
  await sleep(1_000);

  const from = lookback();
  const points = d3fc
    .randomFinancial()
    .startDate(from)
    .startPrice(allSymbols.find(s => s.symbol === symbol).price)
    .interval(d3.timeHour)
    .stream()
    .until(d => d.date > new Date())
    .map(d => ({
      tstamp: d.date.toISOString(),
      price: d.close
    }));

  return {
    from,
    points
  }
}

const summary = async text => {
  await sleep(4_000);

  let out = '';
  while (out.length < 380) {
    out += ' ' + loremIpsum.generateSentences(1);
  }

  return out.trim();
}

const timeSeries = async searchText => {
  await sleep(4_000);

  const from = lookback();
  const points = d3fc
    .randomFinancial()
    .startDate(from)
    .startPrice(1)
    .interval(d3.timeHour)
    .stream()
    .until(d => d.date > new Date())
    .map(d => {
      const obj = {
        tstamp: d.date.toISOString(),
        prevalence: Math.abs(1 - d.close),
        sentiment: 1 - d.open
      };

      if (Math.random() >= .995) {
        obj.significant = {
          id: `dummy:${+d.date}`,
          published: new Date(d.date - (Math.random() * 1_000 * 60 * 60 * 2)).toISOString(),
          url: `http://example.org/${loremIpsum.generateWords(5).replace(/ /g, '-')}`,
          title: loremIpsum.generateSentences(1),
          originates_url: 'example.org',
          originates_title: 'Example'
        };
      }

      return obj;
    });

  return {
    from,
    statistics: {
      tstamp: new Date().toISOString(),
      significant: Math.ceil(Math.random() * 1_500_000)
    },
    points
  }
}

export {
  symbols,
  symbol,
  summary,
  timeSeries
}

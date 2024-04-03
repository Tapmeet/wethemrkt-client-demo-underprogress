import React,{useState,useEffect} from "react"
import PropTypes, { element } from 'prop-types'

// reactstrap
import { Row, Col ,Label} from "reactstrap"

//i18n
// import { withTranslation } from "react-i18next";
// import symbol from '../../../services/symbol.servie';
import "../../../assets/scss/custom/wethemkrt/common.scss";

const StockMerquee = props => {
  const [trendingSymbol, settrendingSymbol] = useState("");

  useEffect(() => {
    // async function getTrendingSymbol() {
    //   //if (localStorage.getItem("user")) {
    //     const response = await symbol.getTrendingSymbols();
    //     if (response.status == 200) {
    //       settrendingSymbol(response.data.trendingSymbolResponse[0].quotes.map(({ symbol }) => ({ label: symbol, value: symbol })));  
    //     }
    //   //}
    // }
    // getTrendingSymbol();
  }, [])

  return (
    <React.Fragment>
        <div className="topnav bg-color">
            <div className="container-fluid">
            {/* <Row>
              <Col lg={3}>
                <label className="mt-2">
                  DOW 0.31%  &emsp;  S&P 5000.20%  &emsp;  NASDAQ 0.01%
                </label>
              </Col>
              <Col lg={9}>
                <Row>
                  <Col lg={1} >  <Label className="mt-2"> Trending </Label> </Col>
                  <Col lg={11} > 
                  <marquee direction="left" height="70%" className="mt-2">
                    {trendingSymbol && trendingSymbol.map((element,key) => {
                      return (
                        <span className="px-2" key={key}>
                        {element.label}
                        </span>
                      );
                    })}
                    </marquee>
                </Col>
                </Row>
              </Col>
            </Row> */}
            </div>
        </div>
    </React.Fragment>
  )
}

StockMerquee.propTypes = {
  t: PropTypes.any
}

export default (StockMerquee)
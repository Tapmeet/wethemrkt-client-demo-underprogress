import React, { Component } from "react";
import Header from "../../components/CommonLanding/Header";
import FooterHome from "../../components/CommonLanding/FooterHome";
import Section from "./Section";
import PostCard from "./people";



class LandingPage extends Component {
  componentDidMount() {
    if (localStorage.getItem("user")) {
      this.props.history.push("/feed")
    }
  }
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <React.Fragment>
        <Header />
        <Section />
        <FooterHome />
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  const { layoutType } = state.Layout;
  return { layoutType };
};

export default LandingPage;


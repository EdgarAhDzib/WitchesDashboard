var React = require("react");
var axios = require("axios");
import Menu from "./menu";
import Tarot from "./tarot";
import Tonalli from "./tonalli";
import Lunar from "./lunar";
import Talisman from "./talisman";
import About from "./about";

import AllCards from "./allcards";

export default class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			oracle: ""
		};
		this.selectOracle = this.selectOracle.bind(this);
	}

	selectOracle(option) {
		this.setState({ oracle: option });
	}

	componentDidMount() {
	}

	render() {
		var currComponent = "";
		var backGround = "intro";
		switch (this.state.oracle) {
			case "tarot" :
				currComponent = <Tarot/>
				backGround = "tarotBkgd";
			break;
			case "tonalli":
				currComponent = <Tonalli/>
				backGround = "tonalliBkgd";
			break;
			case "lunar":
				currComponent = <Lunar/>
				backGround = "lunarBkgd";
			break;
			case "talisman" :
				currComponent = <Talisman/>
				backGround = "talismanBkgd";
			break;
			case "about" :
				currComponent = <About/>
				backGround = "aboutBkgd";
			break;
			default:
				currComponent = <Menu oracle={this.selectOracle}/>
				backGround = "menuBkgd";
			break;
		}

		var panels = [ ["tarot", "Tarot Oracle"], ["tonalli", "Aztec Calendar"], ["lunar", "Lunar Months"], ["talisman", "Antiquity Talisman"], ["about", "About"] ];
		var buttons = [ ["","",""], ["LinkedIn", "linkedin64.png", "https://www.linkedin.com/in/edgar-martin-del-campo-7ba775125"], ["GitHub", "github64.png", "https://github.com/EdgarAhDzib/WitchesDashboard/"], ["Facebook", "fb-likebutton-online-100.png", "https://facebook.com/ShamansCross"], ["","",""] ];
		var oracleFunction = this.selectOracle;
		var currOracle = this.state.oracle;
		var menuPanels = panels.map(function(panel, inc){
			var selected = currOracle == panel[0] ? " selectedMenu" : "" ;
			var increment = inc + 1;
			var oracleOption = panel[0];
			return (
				<div key={"menuPanel"+inc} className={"menuItem" + increment + selected} onClick={() => oracleFunction(oracleOption)}><h2>{panel[1]}</h2></div>
			);
		});
		var buttonLinks = buttons.map(function(button, inc) {
			var increment = inc + 1;
			var linkElement = button[0] != "" ? <div className="buttonImg"><a href={button[2]} target="_blank"><img src={'assets/images/'+button[1]} alt={button[0]}/></a></div> : "";
			return <div key={"button"+inc}>{linkElement}</div>
		});
		var copyColor = this.state.oracle == "lunar" ? {color: "white"} : {color: "black"} ;

// Ran for testing, synoptic review of all cards
// currComponent = <AllCards/>

		return (
		<div className={backGround}>
			<div className="menuRow">
				{menuPanels}
				{buttonLinks}
			</div>
			{currComponent}
			<h4 style={copyColor}><em>All original photography and content copyright &copy; 2017-2018 Edgar Martin del Campo.</em></h4>
		</div>
		)
	}
}

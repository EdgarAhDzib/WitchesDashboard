var React = require("react");
var axios = require("axios");
import Menu from "./menu";
import Tarot from "./tarot";
import Tonalli from "./tonalli";
import Lunar from "./lunar";
import Talisman from "./talisman";

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
			default:
				currComponent = <Menu oracle={this.selectOracle}/>
				backGround = "menuBkgd";
			break;
		}

		var panels = [ ["tarot", "Tarot Oracle"], ["tonalli", "Aztec Calendar"], ["lunar", "Lunar Planner"], ["talisman", "Antiquity Talisman"] ];
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

		return (
		<div className={backGround}>
			<div className="menuRow">
				{menuPanels}
			</div>
			{currComponent}
		</div>
		)
	}
}

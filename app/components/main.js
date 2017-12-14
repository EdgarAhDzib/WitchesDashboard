var React = require("react");
var axios = require("axios");
import Tarot from "./tarot";
import Tonalli from "./tonalli";

export default class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			wallpaper: "intro"
		};
	}
	
	wallPaper(comp) {
		this.setState({ wallpaper: comp });
	}
	
	componentDidMount() {
	}
// Temporarily removed <Tarot/>
	render() {
		return (
		<div className={this.state.wallpaper}>
			<Tonalli/>
		</div>
		)
	}
}

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
		this.wallPaper = this.wallPaper.bind(this);
	}
	
	wallPaper(comp) {
		console.log(comp);
		this.setState({ wallpaper: comp });
	}
	
	componentDidMount() {
	}
// Temporarily removed <Tarot wallpaper={this.wallPaper} />
	render() {
		return (
		<div className={this.state.wallpaper}>
			<Tonalli wallpaper={this.wallPaper}/>
		</div>
		)
	}
}

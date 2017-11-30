var React = require("react");
var axios = require("axios");
import Tarot from "./tarot";

export default class Main extends React.Component {
	constructor() {
		super();
		this.state = {};
	}
	
	componentDidMount() {
	}
	
	render() {
		return (
		<Tarot/>
		)
	}
}

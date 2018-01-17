var React = require("react");
var axios = require("axios");

export default class Talisman extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"talisman" : "",
		};
	}

	componentDidMount() {
		axios.get("/talisman/").then(function(response) {
			this.setState({ talisman: response.data });
		}.bind(this) );
	}

	render() {
		console.log(this.state);
		var img = "";
		if (this.state.talisman) {
			img = <img src={this.state.talisman.img_file} />
		}
		return (
			<div className="container talismanDiv">
				{img}
			</div>
		)
	}
}

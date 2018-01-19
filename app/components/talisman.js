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
		var img = "";
		var title = "";
		var description = "";
		var rowCounter = 0;
		var notes = []; // String concatenation was throwing an [object Object] bug
		if (this.state.talisman) {
			title = <div className="talismanTitle"><h2>{this.state.talisman.title}</h2></div>
			img = <div className="talismanImg"><img src={this.state.talisman.img_file} width="400" /></div>
			description = this.state.talisman.description.map(function(desc, i){
				return (
					<div className="display-linebreak" key={"desc"+i}>{desc}</div>
				);
			});
			for (var i in this.state.talisman) {
				if (!isNaN(i)) {
					for (let j = 0; j < this.state.talisman[i].length; j++) {
						notes.push(<div className={"talismanRow"+rowCounter+" talismanPart"+j} key={i+"notes"+j}>{this.state.talisman[i][j]}</div>);
					}
					rowCounter++;
				}
			}
		}
		return (
		<div className="container talismanDiv">
			{title}
			{img}
			{notes}
			<div className="talismanDesc">
				{description}
			</div>
		</div>
		)
	}
}

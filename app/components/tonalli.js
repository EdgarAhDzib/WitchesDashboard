var React = require("react");
var axios = require("axios");

export default class Tonalli extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tonalli: ""
		};
	}

// Add form to calculate tonalli by month, day, year

	componentDidMount() {
		axios.get("/tonalli/").then(function(response) {
			this.setState({ tonalli: response.data });
		}.bind(this) );
	}

	render() {
		console.log(this.state.tonalli);
		var tonalComponent = <div></div>
		var teoComponent = <div></div>
		// Initialize the variables, each will be assigned to deity through map
		var dayPos = "";
		var nightPos = "";
		var trecena = "";
		var tonalli = "";
		var specialDay = "";
		var tonalliNum = "";
		var nahuatlName = "";
		if (this.state.tonalli.hasOwnProperty("position")) {
			tonalliNum = this.state.tonalli.position;
			tonalComponent = <div className="imgContainer">
					<img src={'/assets/images/tonalli/num_' + this.state.tonalli.thirteen + '.png'}/><br/>
					<img src={'/assets/images/tonalli/day_' + this.state.tonalli.position + '.png'}/>
					<h2 style={{textAlign:"center"}}>{this.state.tonalli.thirteen + " " + this.state.tonalli.nahuatl}</h2>
					<h3 style={{textAlign:"center"}}>{this.state.tonalli.name}</h3>
					<h3 style={{textAlign:"center"}}>{this.state.tonalli.night} Night</h3>
				</div>
		}
		if (this.state.tonalli.hasOwnProperty("nahuatl")) {
			nahuatlName = this.state.tonalli.nahuatl;
		}
		if (this.state.tonalli.hasOwnProperty("deities") && this.state.tonalli.deities.length > 0) {
			teoComponent = this.state.tonalli.deities.map(function(deity, i){
				if (deity.tonalli == tonalliNum) {
					console.log("defined");
					tonalli = <span><br/><em>Day of {nahuatlName}</em><br/></span>
				}
				return <div key={"div" + i}>{deity.name} ('{deity.english}') - {deity.charge}{tonalli}</div>
			});
		}

		return <div>{tonalComponent}{teoComponent}</div>
	}
}

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
		
		this.props.wallpaper("tonalliBkgd");
	}

	render() {
		console.log(this.state.tonalli);
		var tonalComponent = <div></div>
		var teoComponent = <div></div>
		// Initialize the variables, each will be assigned to deity through map
		var tonalliNum = "";
		var dayPos = 0;
		var nightPos = 0;
		var trecena = 0;
		var firstDay = "";
		var specialDay = "";
		var nahuatlName = "";

		// HTML elements initialized blank

		// var tonalli = "";
		// var dayPhrase = "";
		// var nightPhrase = "";
		// var trecenaPhrase = "";

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
		if (this.state.tonalli.hasOwnProperty("trecenaIndex")) {
			trecena = this.state.tonalli.trecenaIndex;
		}
		if (this.state.tonalli.hasOwnProperty("trecenaFirst")) {
			firstDay = this.state.tonalli.trecenaFirst;
		}
		if (this.state.tonalli.hasOwnProperty("thirteen")) {
			dayPos = this.state.tonalli.thirteen;
		}
		if (this.state.tonalli.hasOwnProperty("night")) {
			nightPos = this.state.tonalli.night;
		}
		if (this.state.tonalli.hasOwnProperty("deities") && this.state.tonalli.deities.length > 0) {
			teoComponent = this.state.tonalli.deities.map(function(deity, i){
				
				if (deity.hasOwnProperty("tonalli") && deity.tonalli == tonalliNum) {
					var tonalli = <h4><em>Day of {nahuatlName}</em></h4>
				} else { var tonalli = ""; }
				
				if (deity.hasOwnProperty("dayPos") && deity.dayPos == dayPos) {
					var dayPhrase = <h4><em>Day {dayPos} of 13</em></h4>
				} else { var dayPhrase = ""; }

				if (deity.hasOwnProperty("nightPos") && deity.nightPos == nightPos) {
					var nightPhrase = <h4><em>Night {nightPos} of 9</em></h4>
				} else { var nightPhrase = ""; }
				if (deity.hasOwnProperty("thirteen") && deity.thirteen.indexOf(trecena) >= 0 ) {
					var trecenaPhrase = <h4><em>Cycle of 1 {firstDay}</em></h4>
				} else { var trecenaPhrase = ""; }

				return <div key={"div" + i}><h3>{deity.name} ('{deity.english}') - {deity.charge}</h3>{tonalli}{dayPhrase}{nightPhrase}{trecenaPhrase}</div>
			});
		}

		return <div>{tonalComponent}{teoComponent}</div>
	}
}

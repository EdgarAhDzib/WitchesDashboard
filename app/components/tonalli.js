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
		// console.log(this.state.tonalli);
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
		var tier = -1;
		// Tier sequence, descending:
		var tierArray = [ "Highest", "Omeyocan", "Celestial", "Elemental", "Above surface", "Earth surface", "Chthonic", "Underworld" ];
		var tierDivs = tierArray.map(function(level, i){
			return <div key={"tierDiv"+i} className={"TonalTier"+i + " tonalCol0"}>{level}</div>
		});
		// Initialize the counters by tier position, which will then determine how many cells to assign per level
		var cellsForTier = {
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0
		};
		// Clone the cellsForTier object to initially count the number of deities per tier, thus determining the number of horizontal cells per tier
		var cellsInEachTier = Object.assign({}, cellsForTier);
		if (this.state.tonalli.hasOwnProperty("deities") && this.state.tonalli.deities.length > 0) {
			for (let i = 0; i < this.state.tonalli.deities.length; i++) {
				var tier = this.state.tonalli.deities[i].tier;
				cellsInEachTier[tier] += 1;
			}
		}

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
				if (deity.hasOwnProperty("tier") ) {
					var tier = "TonalTier" + deity.tier;
					// Add 1 (cell) to the value for each represented tier property, to assign column position
					cellsForTier[deity.tier] += 1;
					if (cellsInEachTier[deity.tier] > 1) {
						// Assign horizontal cell position by increment and sum
						var columnClass = "TonalCol" + cellsForTier[deity.tier] + "Of" + cellsInEachTier[deity.tier];
					} else {
						var columnClass = "TonalSingleCol";
					}
				} else { var tier = ""; }

				return <div key={"div" + i} className={tier + " " + columnClass}><h3>{deity.name} ('{deity.english}') - {deity.charge}</h3>{tonalli}{dayPhrase}{nightPhrase}{trecenaPhrase}</div>
			});
		}
		// console.log(cellsForTier);

		return (
			<div className="tonalContainer">
				<div className="tonalBoxOne">
					{tonalComponent}
				</div>
				<div className="tonalBoxTwo container">
					{tierDivs}
					{teoComponent}
				</div>
			</div>
			)
	}
}

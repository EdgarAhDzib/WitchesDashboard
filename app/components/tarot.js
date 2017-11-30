var React = require("react");
var axios = require("axios");
import Carddiv from "./carddiv";
import CardForm from "./cardform";

export default class Tarot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"spread" : "",
			"showCards" : false
		};
		this.submitSpread = this.submitSpread.bind(this);
		this.shuffle = this.shuffle.bind(this);
	}

	submitSpread(count) {
		axios.get("/query/" + count).then(function(response) {
			var rearrange = this.shuffle(response.data);
			this.setState({spread: rearrange});
		}.bind(this) );
	}

	shuffle(arr) {
		var ctr = arr.length, tmp, ind;

		while (ctr > 0) {
			ind = Math.floor(Math.random() * ctr);
			ctr--;
			tmp = arr[ctr];
			arr[ctr] = arr[ind];
			arr[ind] = tmp;
		}
		return arr;
	}

	render() {
		// First display form, change display by changing state after form submission
		var cardInfo = "";
		var keywordsFromArray = "";
		var qualsFromArray = "";
		var cardDesc = "";
		var imgLink = "";
		var cardSet = [];
		switch (this.state.spread.length) {
			case 1: cardSet = ["singleCard"];
			break;
			case 3: cardSet = ["cardFirstOfThree", "cardSndOfThree", "cardThirdOfThree"];
			break;
			case 10: cardSet = ["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"];
			break;
			default: break;
		}

		if (this.state.spread.length > 0) {
			cardInfo = this.state.spread.map(function(obj, i) {

				var classIndex = cardSet[i];
				var imgSrc = obj.img_file.replace("bigjpgs", "/assets/images/cards");
				var cardTitle = obj.title;
				return (
					<Carddiv key={"div" + i} interval={i} gridPos={classIndex} cardTitle={cardTitle} imgSrc={imgSrc} />
				)
			});

		} else {
			return (
				<div className="container">
				<div className="cardFirstOfThree"></div>
				<CardForm submitSpread={this.submitSpread}/>
				<div className="cardThirdOfThree"></div>
				</div>
			)
		}

		return (
			<div className="container">
				{cardInfo}
			</div>
		)
	}
}

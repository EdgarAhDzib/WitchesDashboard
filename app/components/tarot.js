var React = require("react");
var axios = require("axios");
import Carddiv from "./carddiv";
import CardForm from "./cardform";
import CardDetails from "./carddetails";

export default class Tarot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"spread" : "",
			"cardDetails" : "",
			"showModal" : false
		};
		this.submitSpread = this.submitSpread.bind(this);
		this.shuffle = this.shuffle.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.clearModal = this.clearModal.bind(this);
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
	
	toggleModal(attrs, mode) {
		this.setState({
			"cardDetails" : attrs,
			"showModal" : mode
		});
	}
	
	clearModal() {
		if (this.state.showModal) {
			this.setState({ "showModal" : false });
		}
	}
	
	componentDidMount() {
	}

	render() {
		// First display form, change display by changing state after form submission
		var cardInfo = "";
		var keywordsFromArray = "";
		var qualsFromArray = "";
		var cardDesc = "";
		var imgLink = "";
		var cardSet = [];
		var cardPositions = [""];
		var toggleModal = this.toggleModal;
		var clearModal = this.clearModal;
		switch (this.state.spread.length) {
			case 1: cardSet = ["singleCard"];
			break;
			case 3: cardSet = ["cardFirstOfThree", "cardSndOfThree", "cardThirdOfThree"];
				cardPositions = ["Past", "Present", "Future"];
			break;
			case 10: cardSet = ["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"];
				cardPositions = ["Your Present","Challenge / Blockage","Past Influence","Upcoming Influence","Conscious Goal","Unknown Influences","Inner Resources","How Others See You","Hopes And/Or Fears","Outcome"];
			break;
			default: break;
		}

		if (this.state.spread.length > 0) {
			cardInfo = this.state.spread.map(function(obj, i) {
				var classIndex = cardSet[i];
				var imgSrc = obj.img_file.replace("bigjpgs", "/assets/images/cards");
				var cardTitle = obj.title;
				var positionName = cardPositions[i];
				var keyWords = obj.keywords;
				return (
					<Carddiv key={"div" + i} interval={i} gridPos={classIndex} cardTitle={cardTitle} imgSrc={imgSrc} cardPos={positionName} keyWords={keyWords} toggleModal={toggleModal} />
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
		
		var cardModal = "";
		if (this.state.showModal) {
			var cardTitle = this.state.cardDetails.cardTitle;
			var imgSrc = this.state.cardDetails.imgSrc;
			var cardPos = this.state.cardDetails.cardPos;
			var keyWords = this.state.cardDetails.keyWords;
			cardModal = <CardDetails cardTitle={cardTitle} imgSrc={imgSrc} cardPos={cardPos} keyWords={keyWords} toggleModal={toggleModal} />
		}

		return (
		<div>
			{cardModal}
			<div className="container" onClick={clearModal}>
				{cardInfo}
			</div>
		</div>
		)
	}
}

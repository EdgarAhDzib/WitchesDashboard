var React = require("react");
var axios = require("axios");

export default class AllCards extends React.Component {
	constructor() {
		super();
		this.state = {
			"spread" : "",
		};
	}
	
	componentDidMount() {
		axios.get("/reviewallcards/").then(function(response) {
			this.setState({spread: response.data});
		}.bind(this) );
	}
	
	render() {
		var allCards = "";
		console.log(this.state.spread.length);
		if (this.state.spread && this.state.spread.length > 0) {
			console.log("Run");
			allCards = this.state.spread.map(function(card, i) {
				var keywords = card.keywords.map(function(words, inc) {
					return <span key={inc}>{words}<br/></span>
				});
				return <div key={i}><h3>{card.title}</h3><img src={card.image} height="200"/><br/>{keywords}<br/></div>
			});
		}
		return (
			<div className="container">
				{allCards}
			</div>
		)
	}
}

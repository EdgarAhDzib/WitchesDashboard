var React = require("react");

export default class CardDetails extends React.Component {

	constructor() {
		super();
		this.state = {};
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		var emptyObj = {
			imgSrc: "",
			cardPos: "",
			cardTitle: "",
			keyWords: ""
		};
		this.props.toggleModal(emptyObj, false);
	}

	render() {
		var imgLink = <img src={this.props.imgSrc} className="imgEl"/>
		var phrases = "";
		if (this.props.keyWords) {
			phrases = this.props.keyWords.map(function(attrib, inc){
				return <h4 key={inc}>{attrib}</h4>
			});
		}
		return (
			<div className="selectedCard" onClick={this.handleClick}>
				<div className="titleDiv"><h3><em>{this.props.cardPos}</em><br/>{this.props.cardTitle}</h3></div>
				{imgLink}
				<div className="titleDiv">{phrases}<h5>(Click anywhere to close this popup!)</h5></div>
			</div>
		)
	}
}

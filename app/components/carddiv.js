var React = require("react");

export default class Carddiv extends React.Component {

	constructor() {
		super();
		this.state = {};
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		var cardObj = {
			imgSrc: this.props.imgSrc,
			cardPos: this.props.cardPos,
			cardTitle: this.props.cardTitle,
			keyWords: this.props.keyWords
		};
		this.props.toggleModal(cardObj, true);
	}

	render() {
		var imgLink = <img src={this.props.imgSrc} height="250" className="imgEl"/>
		return (
			<div className={this.props.gridPos + " cardGrid"} onClick={this.handleClick}>
				<div className="titleDiv">{this.props.cardPos}</div>
				<div className="nested">
					<div className="imgContainer">
						{imgLink}
					</div>
				</div>
				<div className="titleDiv">{this.props.cardTitle}</div>
			</div>
		)
	}
}

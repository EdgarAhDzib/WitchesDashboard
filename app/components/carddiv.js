var React = require("react");

export default class Carddiv extends React.Component {

	/*
	static propTypes = {
		interval: PropTypes.number,
		gridPos: PropTypes.string,
		imgSrc: PropTypes.string
	}
	*/

	constructor() {
		super();
		this.state = {
			/*
			interval : -1,
			gridPos : "",
			imgSrc : ""
			*/
		};
	}

	render() {
		var imgLink = <img src={this.props.imgSrc} height="250" className="imgEl"/>
		return (
			<div className={this.props.gridPos + " cardGrid"}>
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

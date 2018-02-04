var React = require("react");

export default class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(value) {
		this.props.oracle(value);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="container">
				<div className="menuTitleRow"><h1>The Witches' Dashboard</h1></div>
				<div className="menuPanel1" onClick={() => this.handleClick("tarot")}><img src="assets/images/cards/maj00.jpg" height="200"/><h2>Tarot Oracle</h2></div>
				<div className="menuPanel2" onClick={() => this.handleClick("tonalli")}><img src="assets/images/quetzalcoatl.png" height="200"/><h2>Aztec Calendar</h2></div>
				<div className="menuPanel3" onClick={() => this.handleClick("lunar")}><img src="assets/images/crescent_moon.png" height="200"/><h2>Lunar Months</h2></div>
				<div className="menuPanel4" onClick={() => this.handleClick("talisman")}><img src="assets/images/scarab_gemstone.png" height="200"/><h2>Antiquity Talisman</h2></div>
			</div>
		)
	}
}

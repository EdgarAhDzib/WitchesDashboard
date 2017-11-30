var React = require("react");

export default class CardForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"num" : 1
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({"num" : e.target.value});
	}
	
	handleSubmit(e) {
		this.props.submitSpread(this.state.num);
		e.preventDefault();
	}
	
	render() {
		var cardSelector = <form onSubmit={this.handleSubmit}>
			<h2>Choose a spread!</h2>
			<select onChange={this.handleChange}>
				<option value="1">One</option>
				<option value="3">Three</option>
				<option value="10">Ten (Celtic Cross)</option>
			</select>
			<br/><br/>
			<input id="tarotSub" type="submit" value="Choose Spread!"/>
		</form>;
		return (
			<div className="cardSndOfThree">
				{cardSelector}
			</div>
		)
	}

}

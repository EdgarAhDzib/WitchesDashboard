var React = require("react");
var axios = require("axios");

export default class Lunar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"month" : "",
			today: new Date()
		};
		this.newMonth = this.newMonth.bind(this);
	}
	
	newMonth(month) {
		if (month < 0) {
			return;
		} else {
			axios.post("/newmonth/",{month:month}).then(function(response) {
				// console.log(response);
				this.setState({ month: response.data });
			}.bind(this));
		}
	}

	componentDidMount() {
		axios.get("/lunar/").then(function(response) {
			this.setState({ month: response.data });
		}.bind(this) );
	}

	render() {
		// console.log(this.state.today);
		var weekday = this.state.today.getDay();
		var todayDate = this.state.today.getDate();
		var todayMonth = this.state.today.getMonth();
		// console.log(this.state.month);
		// Use month and weekday names to ensure proper date formatting in loops
		var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var weekdayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		// Adopted from Space.com
		var fullMoonList = ["Wolf", "Snow", "Worm", "Sap", "Pink", "Flower", "Strawberry", "Buck", "Sturgeon", "Harvest", "Hunter's", "Beaver", "Cold"];
		var lunarCalendar = "";
		var fullMoonName = "";
		var lunarMonthIndex = 0;
		if (this.state.month) {
			var lunarMonthIndex = this.state.month[0].lunarMonthIndex;
			fullMoonName = fullMoonList[lunarMonthIndex];
			var leftArrow = lunarMonthIndex > 0 ? " << " : "";
			var lastIndex = fullMoonList.length - 1;
			var rightArrow = lunarMonthIndex < lastIndex ? " >> " : "";
			var weekNum = 1;
			lunarCalendar = this.state.month.map(function(day, key){
				var phase = (day.phase) ? day.phase : "";
				var attributes = "";
				if (day.attributes && day.attributes.length > 0) {
					attributes = day.attributes.map(function(attrib, inc){
						var sabbat = (attrib.sabbat) ? attrib.sabbat : "";
						return <span key={"attrib"+inc}><br/>{sabbat}</span>
					});
				}
				var month = monthList[day.month];
				var calendarDay = day.day;
				var year = day.year;
				var loopDate = year + " " + month + " " + calendarDay;
				var formatDate = Date.parse(loopDate);
				var newDate = new Date(formatDate);
				weekday = newDate.getDay();
				
				// Increment week row for each instance of Sunday (weekday 0) unless the lunar month begins on Sunday
				if (weekday == 0 && key > 0) { weekNum++; }

				// Display UTF-8 lunar phase character
				switch (phase) {
					case "Full Moon" : var phaseChar = "🌕";
						break;
					case "Last Quarter" : var phaseChar = "🌗";
						break;
					case "New Moon" : var phaseChar = "🌑";
						break;
					case "First Quarter" : var phaseChar = "🌓";
						break;
					default : var phaseChar = "";
						break;
				}
				// Highlight today's date by assigning CSS class
				var highlightToday = calendarDay == todayDate && day.month == todayMonth ? " highlightToday" : "";
				// Assign weekday grid class by var "weekday" (0-6)
				return (
					<div key={"month"+key} className={"lunarDay weekDay"+weekday + " weekRow"+weekNum + highlightToday} style={{backgroundColor:"white", color:"black"}}>
						<h4>{month} {calendarDay} {phaseChar} {phase}{attributes}</h4>
					</div>
				);
			});
			
		}
		var weekDayDivs = weekdayList.map(function(weekday, i){
			return (
				<div key={"weekDay"+i} className={"lunarDay topLunRow weekDay"+weekday}><h2>{weekday}</h2></div>
			);
		});
		return (
			<div className="container lunarDiv">
				<div className="leftArrow" onClick={() => this.newMonth(lunarMonthIndex - 1)}><h1>{leftArrow}</h1></div>
				<div className="moonTitleCell"><h1>{fullMoonName} Moon</h1></div>
				<div className="rightArrow" onClick={() => this.newMonth(lunarMonthIndex + 1)}><h1>{rightArrow}</h1></div>
				<div className="lunarContainer">
					{weekDayDivs}
					{lunarCalendar}
				</div>
			</div>
		)
	}
}

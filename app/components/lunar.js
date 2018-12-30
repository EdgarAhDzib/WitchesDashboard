var React = require("react");
var axios = require("axios");

export default class Lunar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"month" : "",
			maxYear : 2018,
			// Restore from hard-code
			today: new Date()
			// today: new Date("Jan 6 2019")
		};
		this.previousMonth = this.previousMonth.bind(this);
		this.followingMonth = this.followingMonth.bind(this);
	}

	previousMonth(month, year) {
		if (month < 0 || month > 12) {
			return;
		} else {
			// console.log("Passed to function previousMonth:");
			// console.log(month, year);
			axios.post("/newmonth/",{month:month, year:year}).then(function(response) {
				// console.log(response);
				this.setState({ month: response.data });
			}.bind(this));
		}
	}
	
	followingMonth(month, year) {
		if (month < 0 || month > 12) {
			return;
		} else {
			// console.log("Passed to function followingMonth:");
			// console.log(month, year);
			axios.post("/newmonth/",{month:month, year:year}).then(function(response) {
				// console.log(response);
				this.setState({ month: response.data });
			}.bind(this));
		}
	}

	componentDidMount() {
		axios.get("/lunar/").then(function(response) {
			this.setState({ month: response.data });
		}.bind(this) );
		axios.get("/maxYear/").then(function(response) {
			this.setState({ maxYear: response.data[0].max});
		}.bind(this) );
	}

	render() {
		// console.log("this.state.today:");
		// console.log(this.state.today);
		var weekday = this.state.today.getDay();
		var todayDate = this.state.today.getDate();
		var todayMonth = this.state.today.getMonth();
		var todayYear = this.state.today.getFullYear();
		// console.log(this.state.month);
		// Use month and weekday names to ensure proper date formatting in loops
		var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var weekdayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		// Adopted from Space.com
		var fullMoonList = ["Wolf", "Snow", "Worm", "Sap", "Pink", "Flower", "Strawberry", "Buck", "Sturgeon", "Harvest", "Hunter's", "Beaver", "Cold"];
		var lunarCalendar = "";
		var fullMoonName = "";
		var lunarMonthIndex = 0;
		var minYear = 2018;
		var maxYear = this.state.maxYear;
		if (this.state.month) {
			var currYear = this.state.month[0].year;
			var lunarMonthIndex = this.state.month[0].lunarMonthIndex;
			fullMoonName = fullMoonList[lunarMonthIndex];


			// Extend logic to accommodate 2018-2019 reset, include min and max years from full days collection
			var leftArrow = " << ";
			// if (lunarMonthIndex <= 0) { console.log("lunarMonthIndex less or equal to 0"); }
			if (currYear <= minYear) { currYear = minYear;  /* console.log("Current year less or equal to min"); */ }
			if (lunarMonthIndex <= 0 && currYear <= minYear) { leftArrow = ""; }
			var lastIndex = fullMoonList.length - 1;
			var rightArrow = " >> ";
			if (lunarMonthIndex >= lastIndex && currYear >= maxYear - 1) { rightArrow = ""; }


			var weekNum = 1;
			lunarCalendar = this.state.month.map(function(day, key){
				var phase = (day.phase) ? day.phase : "";
				var attributes = "";
				if (day.attributes && day.attributes.length > 0) {
					attributes = day.attributes.map(function(attrib, inc){
						var sabbat = (attrib.sabbat) ? attrib.sabbat : "";


						// Why does the sabbat repeat seven additional times?


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
		
		var prevYear = currYear;
		var nextYear = currYear;
		var prevMonth = lunarMonthIndex - 1;
		var nextMonth = lunarMonthIndex + 1;

		// Prevent query for unsaved dates
		if (prevMonth < 0) {
			// console.log("Next month less than 0");
			prevYear = prevYear - 1;
			prevMonth = 12;
		}
		if (nextMonth > 12) {
			// console.log("Next month greater than 13");
			nextYear = nextYear + 1;
			nextMonth = 0;
		}
		
		// console.log("Before the render return: lunarMonthIndex " + lunarMonthIndex + ", prevMonth: " + prevMonth + ", nextMonth: " + nextMonth);
		// console.log("prevYear: " + prevYear + ", nextYear: " + nextYear);
		// console.log("currYear:" + currYear);

		return (
			<div className="container lunarDiv">
				<div className="leftArrow" onClick={() => this.previousMonth(prevMonth, prevYear)}><h1>{leftArrow}</h1></div>
				<div className="moonTitleCell"><h1>{fullMoonName} Moon</h1></div>
				<div className="rightArrow" onClick={() => this.followingMonth(nextMonth, nextYear)}><h1>{rightArrow}</h1></div>
				<div className="lunarContainer">
					{weekDayDivs}
					{lunarCalendar}
				</div>
			</div>
		)
	}
}

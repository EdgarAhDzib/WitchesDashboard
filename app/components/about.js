var React = require("react");

export default class About extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="container">
				<div className="aboutTitleRow">
					<h1>About the Witches' Dashboard</h1>
					<br/>
					<h2><a className="aboutATag" href="#tech"><span className="aboutSpan">The Tech Behind the Magic</span></a>  <a className="aboutATag" href="#magic"><span className="aboutSpan">The Magic Behind the Tech</span></a></h2>
				</div>
				<div id="tech" className="techDiv">
				<h2>The Tech Behind the Magic</h2>
					<h3>MERN</h3>
					<p>The Witches' Dashboard is built on the MERN full-stack platform: Mongo database, Express Middleware, React display, and Node server-ware. Each contributes distinctly to the project's Model-View-Controller architecture.</p>
					<p>Display is managed through CSS Grid, which distributes elements upon a flexible, nested framework.</p>
					<p>Each oracle and the present page is prepared through its own React component. Routers handle the requests and send the JSON results to React, whose Axios functions receive them to update application state.</p>
					<p>GitHub is used for version control, and the application is deployed on Heroku.</p>
					<p>Graphics were prepared in Photoshop on a separate laptop and shared to the development environment with a local network.</p>
					<h3>Tarot Oracle</h3>
					<p>To provide card graphics and titles for this component, a Cheerio web-scraper in Node used two loops to generate URL paths for a remote server. The first loop stored the title and filename for each card into a Mongo collection, and the other generated filename paths to download each image.</p>
					<p>The Express router for this component uses a random generator to select a series of cards based on the provided count. If any duplicates are listed, a function to return unique values removes the former and repeats the query until the proper card count is ready. The sequence is shuffled on the React side prior to rendering.</p>
					<p>Card display is sequenced with CSS animation methods.</p>
					<h3>Aztec Calendar</h3>
					<p>The <em>Tonalpohualli</em> is a cycle of mythical time based on counts from 1 to 13 within a round of 20 zodiac signs, each combination of number and sign repeating once every 260 days. Distinct series of deities presided over the several cycles: the 13 numbers, the 20 signs, the 9 nights, and the 13-day counts themselves.</p>
					<p>To calculate the mythical date, a initial date at which all cycles began from "1" is subtracted from today's. The router determines the remainders in each sequence and uses these numbers to query a Mongo collection of Aztec gods to assign today's attendant deities. To prevent duplication, the router calls a function to ensure that each god is unique within the result array.</p>
					<p>Each deity is arranged by cosmic tier within a CSS Grid layout. All calendar associations for each deity are prepared through comparisons with today's sign within the React component.</p>
					<h3>Lunar Months</h3>
					<p>The original database collection for the lunar calendar required a &quot;seeder&quot; program to collect the dates and times from the Navy's <a href="http://aa.usno.navy.mil/data/docs/MoonPhase.php" target="_blank">&quot;Phases of the Moon&quot;</a> site for all lunar phases in 2018 (and a few from 2017 and 2019) to produce 13 months. A second seeder generated all 2018 dates within a loop to create a second collection. Content from the first collection was then saved to matching dates in the full year.</p>
					<p>Within the router today's date provides the default value for the current lunar month. Clicking the left and right arrows posts the number for the previous or next lunar month, respectively, to the router for further calculation. If either limit is reached, the React component hides the arrow from further extrapolation.</p>
					<p>The React component displays any special features for a given date by checks on its object properties. The weekly days and rows are incremented, their DIV cells then arranged with CSS Grid.</p>
					<h3>Antiquity Talisman</h3>
					<p>Inspired by the rich assortment of 2200+ magical gems and other talismans in the <a href="http://www2.szepmuveszeti.hu/talismans/visitatori_salutem" target="_blank">Campbell Bonner Magical Gems Database</a>, this component accesses a randomly selected talisman with a web-scraping router. In case the random number produces no image, the scraper function recursively calls itself til an entry with an image file is returned.</p>
					<p>As catalog properties are inconsistent across the entries, the React component uses a counter to assign CSS Grid position for each property that does occur, by checking whether its object key is numeric. RegEx tests determine whether to return one or two description paragraphs, by stopping before the paragraph beginning with "Bibliography."</p>
				</div>
				<div id="magic" className="magicDiv">
				<h2>The Magic Behind the Tech</h2>
					<h3>Power Sources</h3>
					<p>The Witches' Dashboard is a distinct project because it not only uses computer technology to present magical themes, but magical rites themselves were also used to prepare the development environment.</p>
					<p>Most of the program was written in the #heXBox, a Raspberry Pi 3B assembled specifically for techno-occultic projects. Before its first activation, it was ritually charged within a pentagram space with candles representing the five elements: Wind, Fire, Water, Earth, Spirit. Following Aztec and Maya custom, copal incense consecrated the device.</p>
					<p>Ritual devices during programming sessions included sigil candles, crystal correspondences, and essential oils.</p>
					<p>A 17th-century Aztec spell protected gardens against infestation. Likewise, to ward the app from electronic bugs, the main server.js file imports a script containing the spell's Nahuatl verses. Following the original procedure, they were enchanted upon the #heXBox with copal.</p>
					<h3>Research Consultants</h3>
					<p>Authenticity was paramount to this application's content.</p>
					<p>Herbalist Jessica Beauvoir conceptualized and guided development for the Lunar Months component. Her recommendations shaped the logic and layout for displaying each month.<br/>
					<a href="https://www.erisapothecary.com" target="_blank">Eris Apothecary</a>
					</p>
					<p>Spiritual worker and intuitive tarot reader Melinda Bennett was the main consultant for the Tarot Oracle component. Her insights especially informed materials for the major arcana and upper ranks of each suit: Page, Knight, Queen, and King.<br/>
					<a href="https://www.missmelindasmetaphysicalservices.com" target="_blank">Miss Melinda's Metaphysical Services</a>
					</p>
				</div>
				<div className="rpiBox">
					<img className="rpiImg" src="assets/images/raspberry_pi.jpg" width="350"/>
				</div>
			</div>
		)
	}
}

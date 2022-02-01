let modInfo = {
	name: "新年树",
	id: "Happy_Luna_New_Year_2022",
	author: "QwQe308",
	pointsName: "快乐点",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 0.1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: '2022.2.1',
	name: "农历新年!",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v2022.2.1</h3><br>
		- 这还会有更新么?说不定呢..`

let winText = `您玩了一年(指游戏时间),欢迎来到新的农历新年!现在该去庆祝新年了.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	let gain = realGain
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  function(){return `当前欢庆点：${format(player.points.add(1).log10().cbrt(),3)}`},
  function(){return `通关进度：${format(getPercentOfComplete(),3)}%`}
]

function getPercentOfComplete(){
  var timePercent = Math.min(player.timePlayed/315360,100)
  var pointPercent = player.points.add(1).log10().cbrt().mul(25).min(100).toNumber()
  return ((timePercent+pointPercent)/200)**0.5*100
}

// Determines when the game "ends"
function isEndgame() {
	return player.timePlayed>=31536000
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
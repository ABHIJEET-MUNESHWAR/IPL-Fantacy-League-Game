var $parseAppID = "xz2mw7kGMTkG9gt4ZoIc1Ch0fsaGqvfCKFOXpAv4";
var $parseJSKey = "4A2rFnBAWk5ITaSkMPP1cd2ucgeqXsdraYJKTFAg";

var $fbUserID = "";
var $fbUserName = "";
var $batsmenArr = new Array();
var $bowlerArr = new Array();
var $wKeeperArr = new Array();
var $allRoundArr = new Array();

Parse.initialize($parseAppID, $parseJSKey);

// Save current user details
var saveCurrentUser = function () {
	// Check first if user exists: (start)
	var usersInfo = Parse.Object.extend("Users");

	//This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
	var query = new Parse.Query(usersInfo);
	query.userID = $fbUserID;
	query.descending('createdAt');

	//We submit the query and pass in callback functions.
	query.find({
		success: function(results) {
			if(results.length == 0) {
				// The user doesn't exists
				var Users = Parse.Object.extend("Users");
				//Instantiate an object of the ListItem class
				var Users = new Users();

				//listItem is now the object that we want to save, so we assign the properties that we want on it.
				Users.set("userID", localStorage.getItem("fbUserID"));
				Users.set("userName", localStorage.getItem("fbUserName"));
				Users.set("initBalance", parseInt(localStorage.getItem("initBalance")));
				Users.set("remBalance", 100);
				localStorage.setItem("Players", JSON.stringify([]));
				localStorage.setItem("totalPlayersSelected", 0);

				//We call the save method, and pass in success and failure callback functions.
				Users.save(null, {       
					success: function(item) {
					},
					error: function(gameScore, error) {
						console.log(gameScore + error);
					}
				});
			} else {
				// The user already exists
				//localStorage.setItem("remBalance", results[0].attributes.remBalance);
				// TODO save rem balance to localStorage from team table
				//populateSelectedTeam();
			}
		},
		error: function(error) {
			console.log(error);
		}

	});
// Check first if user exists (end)
};

// Get details of all the players
var getAllPlayerInfo = function () {

	//$("#historyLoader").css("display","block");
	//$("#noHistory").css("display","none");

	var playersInfo = Parse.Object.extend("Players");

	//This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
	var query = new Parse.Query(playersInfo);
	query.limit = 100;
	query.descending('createdAt');

	//We submit the query and pass in callback functions.
	query.find({
		success: function(results) {
			var $rLen = results.length;
			$batsmenArr = [];
			for (var i = 0; i < $rLen; i++) {
				var $skill = results[i].attributes.Skill;
				switch($skill) {
					case "Batsmen":
						$batsmenArr.push(results[i].attributes);
						break;
					case "Bowler":
						$bowlerArr.push(results[i].attributes);
						break;
					case "All Rounder":
						$allRoundArr.push(results[i].attributes);
						break;
					case "Wicket Keeper":
						$wKeeperArr.push(results[i].attributes);
						break;
				}
			};
			
			loadRightSidebar($batsmenArr, "#tbdRSBBatsmen", "$batsmenArr");
			loadRightSidebar($bowlerArr, "#tbdRSBBowler", "$bowlerArr");
			loadRightSidebar($allRoundArr, "#tbdRSBAllRound", "$allRoundArr");
			loadRightSidebar($wKeeperArr, "#tbdRSBWK", "$wKeeperArr");
			$("#allPlayersBatsTable").show();
			populateSelectedTeam();
		},
		error: function(error) {
			$("#historyLoader").css("display","none");
			//console.log(error);
		}

	});

};

// Get details of all the players selected by user
var getUserTeamInfo = function() {
	var $totalPlayersSelected = localStorage.getItem("totalPlayersSelected");
	if($totalPlayersSelected != null) {
		//populateSelectedTeam();
		return;
	}
	// Check first if user exists: (start)
	var teamInfo = Parse.Object.extend("Team");

	//This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
	var query = new Parse.Query(teamInfo);
	query.userID = $fbUserID;
	query.descending('createdAt');

	//We submit the query and pass in callback functions.
	query.find({
		success: function(results) {
			if(results.length == 0) {
				// The user doesn't exists
				resetUserTeamSel();
				$("#selectedTeamLoader").css("display", "none");
			} else {
				// The user already exists
				var $remBalance = results[0].attributes.RemBalance;
				var $playersArr = results[0].attributes.Players;
				var $teamName = results[0].attributes.TeamName;
				localStorage.setItem("remBalance", $remBalance);
				localStorage.setItem("Players", JSON.stringify($playersArr));
				localStorage.setItem("teamName", $teamName);
				$("#teamName").val($teamName);
				populateSelectedTeam();
			}
		},
		error: function(error) {
			console.log(error);
		}

	});
// Check first if user exists (end)
};

// Save details of all the players selected by user
var saveUserTeamDetails = function() {
	var $teamName = localStorage.getItem("teamName");
	// Check first if user exists: (start)
	var teamInfo = Parse.Object.extend("Team");

	//This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
	var query = new Parse.Query(teamInfo);
	query.userID = $fbUserID;
	query.descending('createdAt');

	//We submit the query and pass in callback functions.
	query.find({
		success: function(results) {
			if(results.length == 0) {
				// The user doesn't exists
				// Insert new record
				var Team = Parse.Object.extend("Team");
				//Instantiate an object of the ListItem class
				var Team = new Team();
				//listItem is now the object that we want to save, so we assign the properties that we want on it.
				Team.set("userID", localStorage.getItem("fbUserID"));
				Team.set("Players", JSON.parse(localStorage.getItem("Players")));
				Team.set("RemBalance", parseInt(localStorage.getItem("remBalance")));
				Team.set("TeamName", localStorage.getItem("teamName"));
				$teamName

				//We call the save method, and pass in success and failure callback functions.
				Team.save(null, {       
					success: function(item) {
						if(!$isSaveTeam) {
							localStorage.clear();
							window.location.href = "http://ipl-game.parseapp.com/";							
						}
						$isSaveTeam = false;
						$("#teamConfigFormSbmt").removeAttr("disabled");
						alert("Team name and selected player details are saved.");
					},
					error: function(gameScore, error) {
						console.log(gameScore + error);
					}
				});
			} else {
				// TODO Update existing record
				var teamInfo = Parse.Object.extend("Team");
				var query = new Parse.Query(teamInfo);
				query.equalTo("userID", localStorage.getItem("fbUserID"));
				query.first({
				success: function (teamInfo) {
						teamInfo.save(null, {
							success: function (teamInfoUpdate) {
								teamInfoUpdate.set("Players", JSON.parse(localStorage.getItem("Players")));
								teamInfoUpdate.set("RemBalance", parseInt(localStorage.getItem("remBalance")));
								teamInfoUpdate.set("TeamName", localStorage.getItem("teamName"));
								teamInfoUpdate.save();
								if(!$isSaveTeam) {
									localStorage.clear();
									window.location.href = "http://ipl-game.parseapp.com/";							
								}
								$isSaveTeam = false;
								$("#teamConfigFormSbmt").removeAttr("disabled");
								alert("Team name and selected player details are saved.");
							}
						});
					}
				});
				// The user already exists
				
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
	// Check first if user exists (end)
};
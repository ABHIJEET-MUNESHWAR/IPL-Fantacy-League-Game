var $totalPlayers = 8;
var $maxBats = 4;
var $maxBolw = 3;
var $maxAR = 2;
var $maxWK = 1;

var $totalPlayersSelected = 0;
var $batsSelected = 0;
var $bolwSelected = 0;
var $arSelected = 0;
var $wkSelected = 0;

var $remBalance = localStorage.getItem("remBalance");
var $isSaveTeam = false;

$(document).ready(function(){
	checkLoginState();
	saveCurrentUser();
	getAllPlayerInfo();
	getUserTeamInfo();
});

$(document).on("click", ".playerChkBx", function(e){
	var $this = $(this);
	if ($this.is(':checked')) {
		var $totalPlayersSelected = localStorage.getItem("totalPlayersSelected");
		$totalPlayersSelected = parseInt($totalPlayersSelected) + 1;
		$batsSelected = localStorage.getItem("batsSelected");
		$bolwSelected = localStorage.getItem("bolwSelected");
		$arSelected = localStorage.getItem("arSelected");
		$wkSelected = localStorage.getItem("wkSelected");		

		var $searchArrValidate = $($this).data("skillArr");
		switch($searchArrValidate) {
			case "$batsmenArr":
				if($batsSelected >= $maxBats) {
					$($this).prop('checked', false);
					alert("You can not select batsmen more than " + $maxBats);
					return false;
				}
				break;
			case "$bowlerArr":
				if($bolwSelected >= $maxBolw) {
					$($this).prop('checked', false);
					alert("You can not select bowlers more than " + $maxBolw);
					return false;
				}
				break;
			case "$allRoundArr":
				if($arSelected >= $maxAR) {
					$($this).prop('checked', false);
					alert("You can not select all-rounders more than " + $maxAR);
					return false;
				}
				break;
			case "$wKeeperArr":
				if($wkSelected >= $maxWK) {
					$($this).prop('checked', false);
					alert("You can not select wicket keepers more than " + $maxWK);
					return false;
				}
				break;
		}
		// check if total players are exceeding (start)		
		if($totalPlayersSelected > $totalPlayers) {
			$($this).prop('checked', false);
			alert("You can not select players more than " + $totalPlayers);
			return false;
		}

		// check if balance is going negative (start)
		var $searchArr = $($this).data("skill-arr");
		addToSelectedTeam($searchArr, e.target.id.split("_")[1], $this);

		//if($remBalance + )
		// check if balance is going negative (end)
	} else {
		unCheckRSB(e);
		// add balance
		// uncheck player from sidebar
		// remove player from Players array
	}
});

// Save details of selected players to user's player's list
var addToSelectedTeam = function($searchArr, $pid, $this){
	// add selected player to the team of selected players
	$searchArr = window[$searchArr];
	$pid = parseInt($pid);
	$searchArrLen = $searchArr.length;
	$stRow = "";
	for(var i=0; i<$searchArrLen; i++) {
		if($pid === $searchArr[i].pid) {
			var $remBalance = localStorage.getItem("remBalance");
			// reduce balance
			$remBalance -= $searchArr[i].Price;
			if($remBalance < 0) {
				$($this).prop('checked', false);
				alert("You don't have enough balance to choose this player.");
				return false;
			}
			$stRow += "<tr id='selPlyrRow_" + $pid + "'>";
			$stRow += "<td>";
			$stRow += "<p class='player'>" + $searchArr[i].Name + "</p>";
			$stRow += "</td>";
			$stRow += "<td>";
			$stRow += "<p class='city'>" + $searchArr[i].Team + "</p>";
			$stRow += "</td>";
			$stRow += "<td>";
			$stRow += "<p class='money'>" + $searchArr[i].Price + "</p>";
			$stRow += "</td>";
			$stRow += "<td>";
			$stRow += "<p class='skill'>" + $searchArr[i].Skill + "</p>";
			$stRow += "</td>";
			$stRow += "<td>";
			$stRow += "<p class='playerChk'><span class='glyphicon glyphicon-remove rmvFromSelTeam' id='selP_" + $pid + "'></span></p>";
			$stRow += "</td>";
			$stRow += "</tr>";
			$("#tbst").append($stRow);

			var $totalPlayersSelected = localStorage.getItem("totalPlayersSelected");
			var $players = JSON.parse(localStorage.getItem("Players"));
			if($players == null) {
				$players = [];
			}
			if($totalPlayersSelected == null) {
				$totalPlayersSelected = 0;
			}

			// increase total selected players
			$totalPlayersSelected ++;
			// add player ID to players array
			$players.push($pid);
			localStorage.setItem("remBalance", $remBalance);
			localStorage.setItem("totalPlayersSelected", $totalPlayersSelected);
			localStorage.setItem("Players", JSON.stringify($players));


			$batsSelected = localStorage.getItem("batsSelected");
			$bolwSelected = localStorage.getItem("bolwSelected");
			$arSelected = localStorage.getItem("arSelected");
			$wkSelected = localStorage.getItem("wkSelected");
			
			var $skill = $searchArr[i].Skill;
			switch($skill) {
				case "Batsmen":
					$batsSelected++;
					break;
				case "Bowler":
					$bolwSelected++;
					break;
				case "All Rounder":
					$arSelected++;
					break;
				case "Wicket Keeper":
					$wkSelected++;
					break;
			}

			$("#totalBadge").text($totalPlayersSelected + "/8");
			$("#balanceBadge").text("$"+localStorage.getItem("remBalance")+"m");
			$("#batsmenBadge").text($batsSelected);
			$("#bowlerBadge").text($bolwSelected);
			$("#arBadge").text($arSelected);
			$("#wkBadge").text($wkSelected);

			localStorage.setItem("batsSelected", $batsSelected);
			localStorage.setItem("bolwSelected", $bolwSelected);
			localStorage.setItem("arSelected", $arSelected);
			localStorage.setItem("wkSelected", $wkSelected);	

			if($('#tbst tr').length == 0) {
				$("#selectedTeamTable").show();
			}		
		}
	}
};

// Fill up user selected players details into main table
var populateSelectedTeam = function(){
	var $playersArr = JSON.parse(localStorage.getItem("Players"));
	if($playersArr != null) {
		if($batsmenArr.length == 0) {
			return;
		}
		var $playersArrLen = $playersArr.length;
		var $remBalance = 100;
		var $searchArr = [];
		$searchArr = $searchArr.concat($batsmenArr);
		$searchArr = $searchArr.concat($bowlerArr);
		$searchArr = $searchArr.concat($allRoundArr);
		$searchArr = $searchArr.concat($wKeeperArr);
		var $searchArrLen = $searchArr.length;
		var $stRow = "";
		$("#tbst").empty();
		for(var i=0; i<$playersArrLen; i++) {
			for(var j=0; j<$searchArrLen; j++) {
				if($playersArr[i] == $searchArr[j].pid) {
					var $arrName = "";
					var $skill = $searchArr[j].Skill;
					switch($skill) {
						case "Batsmen":
							$batsSelected++;
							$arrName = "$batsmenArr";
							break;
						case "Bowler":
							$bolwSelected++;
							$arrName = "$bowlerArr";
							break;
						case "All Rounder":
							$arSelected++;
							$arrName = "$allRoundArr";
							break;
						case "Wicket Keeper":
							$wkSelected++;
							$arrName = "$wKeeperArr";
							break;
					}

					$stRow = "";
					$stRow += "<tr id='selPlyrRow_" + $searchArr[j].pid + "'>";
					$stRow += "<td>";
					$stRow += "<p class='player'>" + $searchArr[j].Name + "</p>";
					$stRow += "</td>";
					$stRow += "<td>";
					$stRow += "<p class='city'>" + $searchArr[j].Team + "</p>";
					$stRow += "</td>";
					$stRow += "<td>";
					$stRow += "<p class='money'>" + $searchArr[j].Price + "</p>";
					$stRow += "</td>";
					$stRow += "<td>";
					$stRow += "<p class='skill'>" + $searchArr[j].Skill + "</p>";
					$stRow += "</td>";
					$stRow += "<td>";
					$stRow += "<p class='playerChk'><span class='glyphicon glyphicon-remove rmvFromSelTeam' id='selP_" + $searchArr[j].pid + "' data-skill-arr=" + $arrName + "></span></p>";
					$stRow += "</td>";
					$stRow += "</tr>";
					$("#tbst").append($stRow);
					$remBalance -= $searchArr[j].Price;
					// check relavent rows in sidebar
					$("#sbP_" + $searchArr[j].pid).prop('checked', true);
					break;
				}
			}
		}

		$("#selectedTeamTable").show();	
		var $teamName = localStorage.getItem("teamName");
		if($teamName != "null") {
			$("#teamName").val(localStorage.getItem("teamName"));
		}

		$totalPlayersSelected = $playersArrLen;
		// set selected player details in local storage
		localStorage.setItem("batsSelected", $batsSelected);
		localStorage.setItem("bolwSelected", $bolwSelected);
		localStorage.setItem("arSelected", $arSelected);
		localStorage.setItem("wkSelected", $wkSelected);
		localStorage.setItem("totalPlayersSelected", $totalPlayersSelected);
		localStorage.setItem("remBalance", $remBalance);

		// Set number on badges
		$("#totalBadge").text($playersArrLen + "/8");
		$("#balanceBadge").text("$"+localStorage.getItem("remBalance")+"m");
		$("#batsmenBadge").text($batsSelected);
		$("#bowlerBadge").text($bolwSelected);
		$("#arBadge").text($arSelected);
		$("#wkBadge").text($wkSelected);
	} else {
		resetUserTeamSel();
	}
	$("#selectedTeamLoader").css("display", "none");
};

// Fill up players details skillwise into right side bar
var loadRightSidebar = function($PlayerArr, $rstpID, $arrName) {
	var $PlayerArrlen = $PlayerArr.length;
	var $patp = "";
	$($rstpID).empty();
	for(var i=0; i<$PlayerArrlen; i++) {
		$patp += "<tr id='sbR_" + $PlayerArr[i].pid + "''>";
		$patp += "<td>";
		$patp += "<p class='player'>" + $PlayerArr[i].Name + "(" + $PlayerArr[i].Team.substr(0, 3) + ")" + "</p>";
		$patp += "</td>";
		$patp += "<td>";
		$patp += "<p class='player'>" + $PlayerArr[i].Price + "</p>";
		$patp += "</td>";
		$patp += "<td>";
		$patp += "<p class='player'>" + $PlayerArr[i].Ratings + "</p>";
		$patp += "</td>";
		$patp += "<td>";
		$patp += "<p class='player' id=" + $PlayerArr[i].pid + "><label><input type='checkbox' class='playerChkBx' id='sbP_" + $PlayerArr[i].pid + "' data-skill-arr=" + $arrName + "></label></p>";
		$patp += "</td>";
		$patp += "</tr>";
	}
	if($PlayerArrlen > 0) {
		$($rstpID).append($patp);
	}
};

$(document).on("click", ".rmvFromSelTeam", function(e){
//$(document).on("click", ".rmvFromSelTeam, .playerChkBx", function(e){
	unCheckRSB(e);
});

// Remove user entry from main table if unchecked
var unCheckRSB = function (e) {
	var $pid = e.target.id;
	var $searchArr = $("#"+$pid).data("skill-arr");
	if(typeof($searchArr) == "undefined") {
		$searchArr = $("#sbP_"+$pid.split("_")[1]).data("skill-arr");
	}
	$searchArr = window[$searchArr];
	$searchArrLen = $searchArr.length;
	$pid = $pid.split("_")[1];
	$pid = parseInt($pid);

	$batsSelected = localStorage.getItem("batsSelected");
	$bolwSelected = localStorage.getItem("bolwSelected");
	$arSelected = localStorage.getItem("arSelected");
	$wkSelected = localStorage.getItem("wkSelected");

	// remove row from selected player table
	$("#selPlyrRow_" + $pid).remove();
	// uncheck same row from sidebar
	$("#sbP_" + $pid).prop('checked', false);

	var $remBalance = localStorage.getItem("remBalance");
	$remBalance = parseInt($remBalance);
	var $totalPlayersSelected = localStorage.getItem("totalPlayersSelected");
	// Add balance
	for(var i=0; i<$searchArrLen; i++) {
		if($pid == $searchArr[i].pid) {
			$remBalance += parseInt($searchArr[i].Price);
			localStorage.setItem("remBalance", $remBalance);
			var $skill = $searchArr[i].Skill;
			switch($skill) {
				case "Batsmen":
					$batsSelected--;
					break;
				case "Bowler":
					$bolwSelected--;
					break;
				case "All Rounder":
					$arSelected--;
					break;
				case "Wicket Keeper":
					$wkSelected--;
					break;
			}
		}
	}
	// Reduce total
	$totalPlayersSelected --;
	localStorage.setItem("totalPlayersSelected", $totalPlayersSelected);
	// modify Players array
	var $players = JSON.parse(localStorage.getItem("Players"));
	var $index = $players.indexOf($pid);
	if ($index > -1) {
		$players.splice($index, 1);
	}
	localStorage.setItem("Players", JSON.stringify($players));
	
	localStorage.setItem("batsSelected", $batsSelected);
	localStorage.setItem("bolwSelected", $bolwSelected);
	localStorage.setItem("arSelected", $arSelected);
	localStorage.setItem("wkSelected", $wkSelected);

	$("#totalBadge").text($totalPlayersSelected + "/8");
	$("#balanceBadge").text("$"+localStorage.getItem("remBalance")+"m");
	$("#batsmenBadge").text($batsSelected);
	$("#bowlerBadge").text($bolwSelected);
	$("#arBadge").text($arSelected);
	$("#wkBadge").text($wkSelected);
};

var resetUserTeamSel = function () {
	// set selected player details in local storage
	localStorage.setItem("totalPlayersSelected", 0);
	localStorage.setItem("batsSelected", 0);
	localStorage.setItem("bolwSelected", 0);
	localStorage.setItem("arSelected", 0);
	localStorage.setItem("wkSelected", 0);
	localStorage.setItem("Players", JSON.stringify([]));
	
	// set badge numbers to 0;
	$("#totalBadge").text("0/8");
	$("#balanceBadge").text("$100m");
	$("#batsmenBadge").text(0);
	$("#bowlerBadge").text(0);
	$("#arBadge").text(0);
	$("#wkBadge").text(0);
};

// Save user team name and user configuration
$(document).on("click", "#teamConfigFormSbmt", function(e){
	e.preventDefault();
	var $teamName = $("#teamName").val();
	if( (!$teamName) || ($teamName==null) || ($teamName=="")) {
		alert("Please enter team name.");
		return false;
	}
	if( $teamName.length > 20) {
		alert("Please enter team name less than 20 characters.");
		return false;
	}
	var $totalPlayersSelected = localStorage.getItem("totalPlayersSelected");
	$totalPlayersSelected = parseInt($totalPlayersSelected) + 1;
	$batsSelected = localStorage.getItem("batsSelected");
	$bolwSelected = localStorage.getItem("bolwSelected");
	$arSelected = localStorage.getItem("arSelected");
	$wkSelected = localStorage.getItem("wkSelected");
	if($batsSelected < 3) {
		alert("Please select at least 3 batsmen.");
		return false;
	}
	if($bolwSelected < 2) {
		alert("Please select at least 2 bowlers.");
		return false;
	}	
	if($arSelected < 1) {
		alert("Please select at least 1 all-rounder.");
		return false;
	}
	if($wkSelected < 1) {
		alert("Please select at least 1 wicket-keeper.");
		return false;
	}	
	localStorage.setItem("teamName", $teamName);
	$isSaveTeam = true;
	$("#teamConfigFormSbmt").attr("disabled", "disabled");
	saveUserTeamDetails();
	return false;
});
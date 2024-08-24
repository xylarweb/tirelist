const forcedBreakPoints = [1, 150, 200, 220, 240, 260, 280, 300];

function validateLevelRange() {
	const levelStart = parseInt(document.getElementById('levelStart').value);
	const levelEnd = parseInt(document.getElementById('levelEnd').value);
	
	let error = '';

	// Ensure level range adheres to the forced breakpoints
	if (levelStart >= levelEnd) {
		error = 'Start level must be less than end level.';
	} else {
		const nextForcedBreakStart = forcedBreakPoints.find(bp => bp > levelStart);
		const nextForcedBreakEnd = forcedBreakPoints.find(bp => bp >= levelEnd);

		if (nextForcedBreakStart && levelEnd > nextForcedBreakStart && levelEnd < nextForcedBreakEnd) {
			error = `Invalid level range. After ${levelStart}, the next valid end level can only be up to ${nextForcedBreakStart}.`;
		}
	}

	// Display error or valid range
	document.getElementById('errorOutput').innerText = error;
	if (!error) {
		calculateSquadCoins();
	} else {
		document.getElementById('selectionOutput').innerText = '';
	}
}
const xpConversions = [
	{"Type": "Common", "Rank": 1, "XPConversion": 10, "Multiplier": 1},
	{"Type": "Common", "Rank": 2, "XPConversion": 30, "Multiplier": 3},
	{"Type": "Common", "Rank": 3, "XPConversion": 90, "Multiplier": 8},
	{"Type": "Common", "Rank": 4, "XPConversion": 250, "Multiplier": 20},
	{"Type": "Rare", "Rank": 2, "XPConversion": 35, "Multiplier": 3},
	{"Type": "Rare", "Rank": 3, "XPConversion": 100, "Multiplier": 8},
	{"Type": "Rare", "Rank": 4, "XPConversion": 350, "Multiplier": 20},
	{"Type": "Trainer", "Rank": 1, "XPConversion": 100, "Multiplier": 3},
	{"Type": "Trainer", "Rank": 2, "XPConversion": 200, "Multiplier": 7},
	{"Type": "Trainer", "Rank": 3, "XPConversion": 600, "Multiplier": 35},
	{"Type": "Trainer", "Rank": 4, "XPConversion": 2500, "Multiplier": 120}
];

const selections = {
	"Trainer": [],
	"Common": [],
	"Rare": []
};

function addSelection(type) {
	const rankSelect = document.getElementById(type.toLowerCase() + 'Rank');
	const selectedRank = parseInt(rankSelect.value);

	if (isNaN(selectedRank)) {
		document.getElementById('errorOutput').innerText = `Please select a rank for ${type}.`;
		return;
	}

	if (selections[type].includes(selectedRank)) {
		document.getElementById('errorOutput').innerText = `${type} Rank ${selectedRank} is already added.`;
		return;
	}

	const selectedConversion = xpConversions.find(item => item.Type === type && item.Rank === selectedRank);

	// Add to selections
	selections[type].push(selectedRank);

	// Create a new selection element
	const selectionDiv = document.createElement('div');
	selectionDiv.className = 'selection';
	selectionDiv.dataset.type = type;
	selectionDiv.dataset.rank = selectedRank;
	
	const selectionText = document.createElement('span');
	let sameFactionBonus = selectedConversion.XPConversion * 1.2;
	selectionText.innerText = `${type} Rank ${selectedRank}: XP = ${selectedConversion.XPConversion}, Faction Bonus XP = ${sameFactionBonus}`;

	// Input for Same Faction Quantity
	const sameFactionInput = document.createElement('input');
	sameFactionInput.type = 'number';
	sameFactionInput.min = '0';
	sameFactionInput.placeholder = 'Same Faction Qty';
	sameFactionInput.style.marginLeft = '10px';
	sameFactionInput.addEventListener('input', calculateSquadCoins);

	// Input for Different Faction Quantity
	const diffFactionInput = document.createElement('input');
	diffFactionInput.type = 'number';
	diffFactionInput.min = '0';
	diffFactionInput.placeholder = 'Different Faction Qty';
	diffFactionInput.style.marginLeft = '10px';
	diffFactionInput.addEventListener('input', calculateSquadCoins);

	const removeButton = document.createElement('button');
	removeButton.innerText = 'Remove';
	removeButton.className += 'sqbtn';
	removeButton.style.marginLeft = '10px';
	removeButton.onclick = function() {
		selectionDiv.remove();
		selections[type] = selections[type].filter(rank => rank !== selectedRank);
		rankSelect.querySelector(`option[value="${selectedRank}"]`).disabled = false;
	};

	selectionDiv.appendChild(selectionText);
	selectionDiv.appendChild(sameFactionInput);
	selectionDiv.appendChild(diffFactionInput);
	selectionDiv.appendChild(removeButton);
	document.getElementById('selections').appendChild(selectionDiv);

	// Disable the selected option in the dropdown
	rankSelect.querySelector(`option[value="${selectedRank}"]`).disabled = true;
	rankSelect.selectedIndex = 0;

	document.getElementById('errorOutput').innerText = ''; // Clear any previous error
}

async function fetchXPCostData() {
	const response = await fetch('SquadCoinXPRequirements.json');
	const data = await response.json();
	return data.XPCost; // Access the "XPCost" array within the JSON
}

async function fetchSquadCoinCostData() {
	const response = await fetch('SquadCoinXPRequirements.json');
	const data = await response.json();
	return data.SquadCoinsCost; // Access the "SquadCoinsCost" array within the JSON
}

async function grabLevels() {
	const startLevel = parseInt(document.getElementById('levelStart').value);
	const endLevel = parseInt(document.getElementById('levelEnd').value);

	// Validate the level range
	if (startLevel > endLevel) {
		return;
	}

	// Fetch the JSON data from the file
	const xpCostData = await fetchXPCostData();

	// Grab the JSON items corresponding to the start and end levels
	const selectedItems = xpCostData.filter(item => item.Level >= startLevel && item.Level <= endLevel);

	return selectedItems;
}

async function grabSquadCoinDataLevelStartAndEnd() {
	const startLevel = parseInt(document.getElementById('levelStart').value);
	const endLevel = parseInt(document.getElementById('levelEnd').value);

	// Validate the level range
	if (startLevel > endLevel) {
		return;
	}

	// Fetch the JSON data from the file
	const scCostData = await fetchSquadCoinCostData();

	// Grab the JSON items corresponding to the start and end levels
	const selectedItems = scCostData.filter(item => item.Level == startLevel || item.Level == endLevel);

	return selectedItems;
}

async function calculateSquadCoins() {
	const xpCostData = await grabLevels();
	const levelData = await grabSquadCoinDataLevelStartAndEnd();
	const levelNum = levelData[1].Level - levelData[0].Level;
	const squadCoinBaseCost = levelData[0].BaseSquadCoinCost;
	
	const firstXPCost = xpCostData[0];
	const lastXPCost = xpCostData[xpCostData.length - 1];
	
	const totalXPRequired = lastXPCost.TotalXP - firstXPCost.TotalXP;

	// Iterate through selections to calculate total squad coins
	let totalCoins = 0;
	
	let totalXPGained = 0;

	document.querySelectorAll('.selection').forEach(selectionDiv => {
		const type = selectionDiv.dataset.type;
		const rank = parseInt(selectionDiv.dataset.rank);
		const sameFactionQty = parseInt(selectionDiv.querySelector('input[placeholder="Same Faction Qty"]').value) || 0;
		const diffFactionQty = parseInt(selectionDiv.querySelector('input[placeholder="Different Faction Qty"]').value) || 0;
		
		console.log("type, rank:" + type + ", " + rank);

		const selectedConversion = xpConversions.find(item => item.Type === type && item.Rank === rank);

		// Calculate coins for same faction and different faction
		const sameFactionCoins = squadCoinBaseCost * sameFactionQty * selectedConversion.Multiplier;
		const diffFactionCoins = squadCoinBaseCost * diffFactionQty * selectedConversion.Multiplier;
		
		totalXPGained += (selectedConversion.XPConversion * sameFactionQty * 1.2) + (selectedConversion.XPConversion * diffFactionQty);

		totalCoins += sameFactionCoins + diffFactionCoins;
	});

	document.getElementById('xp-result').innerText = `Total XP Required: ${totalXPRequired}\nTotal XP Gained ${totalXPGained}\nTotal Squad Coins: ${totalCoins}`;
}

// Trigger validation when inputs change
document.getElementById('levelStart').addEventListener('input', validateLevelRange);
document.getElementById('levelEnd').addEventListener('input', validateLevelRange);
"use strict";

// Gestion de l'import du csv
let fileUpload = document.getElementById("csvInput");

fileUpload.addEventListener("change", (event) => {
	event.preventDefault();
	document.getElementById("message").innerText = "Calcul en cours...";
	let reader = new FileReader();
	if (reader.readAsBinaryString) {
		reader.readAsBinaryString(fileUpload.files[0]);
		reader.onload = function (e) {
			let csv = csvToArray(e.target.result);
			findBestSolution(csv);
		};
	}
});

fileUpload.addEventListener("click", (event) => {
	fileUpload.value = null;
});

function findBestSolution(csv) {
	// Trois algorithmes de notations sont testés pour choisir le meilleur
	// Le temps de calcul est testé pour ne pas dépasser 2 min de calcul
	let Timer = new MiniTimer();
	let response1 = solveColorIt(csv, 0);
	let response2 = undefined;
	let response3 = undefined;
	Timer.stopTimer();
	if (Timer.getTimeMilliseconds() < 50000) {
		response2 = solveColorIt(csv, 1);
	}
	Timer.stopTimer();
	if (Timer.getTimeMilliseconds() < 75000) {
		response3 = solveColorIt(csv, 2);
	}
	Timer.stopTimer();
	let calculTime = Timer.getTimeMilliseconds() / 1000;

	let responses = [response1, response2, response3];
	let bestResponseIndex = findShortestResponse(responses);
	exportResult(responses[bestResponseIndex], calculTime);

	function findShortestResponse(responses) {
		let min = responses[0].length;
		let index = 0;
		for (let i in responses) {
			if (responses[i]) {
				let length = responses[i].length;
				if (length < min) {
					index = i;
					min = length;
				}
			}
		}
		return index;
	}
}

function exportResult(response, calculTime) {
	document.getElementById("message").innerText =
		"Solution en " +
		response.length +
		" coups trouvée en " +
		calculTime +
		"s";
	let ExportResult = new ExportCSV("Result.csv", ",", "\n");
	for (let color of response) {
		ExportResult.addLineOfValues([color]);
	}
	ExportResult.generateCsvFiles();
}

function generateRandomGrid(NB_COLORS, NB_CASE) {
	let cols = [...Array(NB_COLORS).keys()];
	const csv = Array.from(Array(NB_CASE), () => new Array(NB_CASE));
	for (let i = 0; i < NB_CASE; i++) {
		for (let j = 0; j < NB_CASE; j++) {
			csv[i][j] = cols[Math.floor(Math.random() * NB_COLORS)];
		}
	}
	console.log(JSON.stringify(csv));
	return csv;
}

function randomHex() {
	return Math.floor(Math.random() * 16).toString(16);
}

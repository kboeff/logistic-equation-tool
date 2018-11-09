// Show/Hide the instructions for use
let isInstructed = true;
const toggleInstructions = () => {
	let show = document.getElementById('instructions');
	let text = document.getElementById('instr-text');
	text.innerHTML = 'The logistic equation (sometimes called the Verhulst model or logistic growth curve) is a model of population growth first published by Pierre Verhulst (1845, 1847). The model is continuous in time, but a modification of the continuous equation to a discrete quadratic recurrence equation known as the logistic map is used here.<br>x<sub>n+1</sub> = Rx<sub>n</sub>(1 - x<sub>n</sub>), where x<sub>0</sub> is the initial condition, R is a parameter and n is the count of the iterations we want.<br><br>There are a few options with this tool:<br>(1) Plot one logistic map - just fill in the three fields below and hit "Plot".<br>(2) Plot a difference between two different logistic maps - in this case use the checkbox to add more fields for the second scenario. This option is useful for visualizing sensitive dependence on the initial condition, as very small difference in x<sub>0</sub> lead to big discrepancies when using the same parameter(R) (i.e. R=3.72)<br>(3) Calculate Average Absolute Difference - optimized to use more iterations (up to 500,000) shows only the result, but doesn\'t plot the solution.';
	
	if(isInstructed) {
		show.innerHTML = 'Hide Instructions &lArr;';
		text.style.display = 'block';
	} else {
		show.innerHTML = 'Show Instructions &rArr;';
		text.style.display = 'none';
	}
	isInstructed = !isInstructed;
}

// Handling checkbox events for Toggle Mode
let modeCheck = document.getElementById('check-mode');
let modeText = document.getElementsByClassName('top-text')[0];
let mapMode = true;
let mapChart = document.getElementById('map-chart');
let bifurcationChart = document.getElementById('bifurcation-chart');

modeCheck.addEventListener('change', function(){ 
	if(this.checked) {
		bifurcationChart.style.display = 'block';
		mapChart.style.display = 'none';
		modeText.innerHTML = 'Bifurcation Diagram (!Warning: don\'t run this on your phone. It will most probably crash it!)';
		modeText.style.color = '#ec7396';
		mapMode = false;
	} else {
		bifurcationChart.style.display = 'none';
		mapChart.style.display = 'block';
		modeText.innerHTML = 'Logistic Map';
		modeText.style.color = '#fff';
		mapMode = true;
	}
});

// Handling checkbox events for Calculate Difference
let differenceCheck = document.getElementById('checkbox-difference');
let initial2 = document.getElementById('initial2');
let coeffitient2 = document.getElementById('coef2');
let isDifChecked = false;
let multi = false; // if datapoints are too little to display by Chart.js, they are multiplied by 10^6

differenceCheck.addEventListener('change', function(){ 
	if(this.checked) {
		coeffitient2.style.display = 'inline';
		initial2.style.display = 'inline';
		isDifChecked = true;
	} else {
		coeffitient2.style.display = 'none';
		initial2.style.display = 'none';
		isDifChecked = false;
	}
});


// Calculate data points
const calcPoints = () => {
	// Get input values
	let iterations = parseInt(document.getElementById('iterations').value);
	
	let initial = parseFloat(document.getElementById('initial').value);
	let coef = parseFloat(document.getElementById('coef').value);
	
	let init2 = parseFloat(initial2.value);
	let coef2 = parseFloat(coeffitient2.value);
	
	if(iterations < 0 || iterations > 2000 ||
	  initial < 0 || initial > 1 ||
	  coef < 0 || coef > 4) {
		alert('Invalid input, please try again.');
		return 1;
	} 
	
	let labels = [0];
	let results = [];
	let multiResults = [];
	let sum = 0;
	
	if(isDifChecked) {
		results.push(Math.abs(initial - init2));
		multiResults.push(Math.abs(initial - init2) * 1000000);
		
	} else {
		results.push(initial);
	}
	let x = initial;
	let x2 = init2;
	
	for(let i = 1; i <= iterations; i++) {
		x = coef * x * (1 - x);
		x2 = coef2 * x2 * (1 - x2);
		
		if(isDifChecked) {
			let diff = Math.abs(x-x2);
			results.push(diff);
			multiResults.push(diff * 1000000);
			sum += diff;
		} else {
			results.push(x);
		}
		labels.push(i);
	}
	if(sum < 1 && isDifChecked) {
		multi = true;
		console.log(multiResults);
		return plotChart(multiResults, labels);
	} else {
		multi = false;
		console.log(results);
		return plotChart(results, labels);
	}
}


// Rendering the chart
const plotChart = (results, newLabels) => {
	let myChart = document.getElementById('myChart').getContext('2d');
	let yLabel = 'x(n)';
	if(isDifChecked) {
		yLabel = "x(n) - x\'(n)";
		if(multi) {
			yLabel = "x(n) - x\'(n) /times 10^6/";
		}
	}
	// Global options
	Chart.defaults.global.hover.animationDuration = 1000;
	
	let massPopChart = new Chart(myChart, {
		type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
		data: {
			labels: [...newLabels],
			datasets: [{
				label: 'Population',
				data: [...results],
				borderWidth: 2,
				borderColor: '#0aafcc',
				hoverBorderWidth: 3,
				hoverBorderColor: '#00fafa'
			}]
		},
		options: {
			responsiveAnimationDuration: 1,
			title: {
				display: true,
				text: 'Logistic Equation Plot',
				fontSize: 25
			},
			legend: {
				display: false,
				position: 'right',
				labels: {
					fontColor: '#000'
				}
			},
			scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: yLabel
				  }
				}],
				xAxes: [{
				  scaleLabel: {
					display: true,
					labelString: 'Iterations (n)'
				  }
				}]
			}		
			
		},
		layout: {
			padding: {
				left: 50,
				right: 0,
				bottom: 0,
				top: 0
			}
		}
	});
	
	return massPopChart;
}


// Calculate Average absolute difference
// TODO: re-factor code according to the DRY principle -> use logic from calcPoints
const calcAAD = () => {
	if(!isDifChecked) {
		return 1;
	}
	let aad = document.getElementsByClassName('aad');
	for(let j = 0; j < aad.length; j++) {
		aad[j].style.display = 'flex';
	}
	
	// Get input values
	let iterations = parseInt(document.getElementById('iterations').value);
	let initial = parseFloat(document.getElementById('initial').value);
	let coef = parseFloat(document.getElementById('coef').value);
	
	let init2 = parseFloat(initial2.value);
	let coef2 = parseFloat(coeffitient2.value);
	
	if(iterations < 0 || iterations > 500000 ||
	  initial < 0 || initial > 1 ||
	  coef < 0 || coef > 4) {
		alert('Invalid input, please try again.');
	} 
	
	let sum = 0;
	let x = initial;
	let x2 = init2;
	
	for(let i = 1; i <= iterations; i++) {
		x = coef * x * (1 - x);
		x2 = coef2 * x2 * (1 - x2);
		sum += Math.abs(x-x2);		
	}
	console.log(sum, iterations); // Not a debug log; show raw data if needed by the user
	document.getElementById('aad-text').innerHTML = (sum/iterations).toFixed(5).toString();
	return 0;	
}


// Bifurcation diagram - logic
const bifurcationDiagram = (x0, rMin, rMax, rStep, n, discard) =>  {
	let data = [];
	
	// Iterate x-axis
	for(let i = rMin; i <= rMax; i += rStep) {
		let column = {};
		let x = x0;
		
		// Filling the y-axis or column of dots
		// TODO: Remove duplicates as fixed points are reached
		for(let j = 1; j <= n; j++) {
			x = i * x * (1 - x);
			if(j > discard) {
				column[j] = x;
			}
		}
		data[i] = column;
	}
	return data;
}

// Bifurcation diagram - plot
const plotBifurcation = () => {
	// Inputs - is it the best solution to have them here?
	let iterations = parseInt(document.getElementById('iterates-bifu').value);
	let discard = parseInt(document.getElementById('k-discard').value);
	let initial = parseFloat(document.getElementById('bifu-initial').value);
	let rStep = parseFloat(document.getElementById('r-step').value);
	let rMin = parseFloat(document.getElementById('r-min').value);
	let rMax = parseFloat(document.getElementById('r-max').value);
	// DEBUG: console.log('iterations =', iterations, 'discard =', discard, 'initial =', initial, 'rStep =', rStep, 'rMin =', rMin, 'rMax =', rMax);

	// Input validation
	if(iterations < 0 || iterations > 1000 || discard >= iterations ||
	  initial < 0 || initial > 1 ||
	  rStep < 0 || rStep > 1 ||
	  rMin < 0 || rMin > 4 ||
	  rMax < 0 || rMax > 4) {
		alert('Invalid input, please try again.');
		return 1;
	} 
	
	let chartData = bifurcationDiagram(initial, rMin, rMax, rStep, iterations, discard);
	console.log(chartData);
	
	// Drawing the chart on canvas
	let canvas = document.getElementById("myChart");
	let ctx = canvas.getContext("2d");
	let scale = 1;
	let pointSize = 0.1;
	
		
	/*
	const resizeChart = () => {
		if (window.innerWidth <= 500) {
			scale = 1;
		} else if (window.innerWidth >= 1000) {
			scale = 2;
		} else {
			scale = window.innerWidth / 500;
		}
		
		
	}
	resizeChart();	
	window.onresize = resizeChart();
	*/
		
	canvas.width = 800;
	canvas.height = canvas.width / 2;
	canvas.style.backgroundColor = "#eee";
	
	let xSpread = canvas.width / (rMax - rMin);
	//console.log(xSpread, rMax, rMin);
	
	
	for (let i in chartData) {
		let x = (i - rMin) * xSpread * scale;
		for (let j in chartData[i]) {
			let y = canvas.height - (chartData[i][j] * canvas.height * scale);
			ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
		}
	}
		
	ctx.fillStyle = "#0a5e8c";
	ctx.fill();
		
	for (let k = rMin; k <= rMax; k += 0.1){ 
		let x = (k - rMin) * xSpread * scale;
		ctx.beginPath();
		ctx.moveTo(x, canvas.height);
		ctx.lineTo(x, canvas.height - 10);
		ctx.strokeStyle="#ec7396";
		ctx.stroke();
		ctx.font = "10px Arial";
		ctx.fillText(k.toFixed(1).toString(),x-6,canvas.height - 13);
		
	}
}

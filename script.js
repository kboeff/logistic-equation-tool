let isInstructed = true;
const toggleInstructions = () => {
	let show = document.getElementById('instructions');
	let text = document.getElementById('instr-text');
	text.innerHTML = 'The logistic equation (sometimes called the Verhulst model or logistic growth curve) is a model of population growth first published by Pierre Verhulst (1845, 1847). The model is continuous in time, but a modification of the continuous equation to a discrete quadratic recurrence equation known as the logistic map is used here.<br>x<sub>n+1</sub> = Rx<sub>n</sub>(1 - x<sub>n</sub>), where x<sub>0</sub> is the initial condition, R is a parameter and n is the count of the iterations we want.<br><br>There are a few options with this tool:<br>(1) Plot one logistic map - just fill in the three fields below and hit "Plot".<br>(2) Plot a difference between two different logistic maps - in this case use the checkbox to add more fields for the second scenario. This option is useful for visualizing sensitive dependence on the initial condition, as very small difference in x<sub>0</sub> lead to big discrepancies when using the same parameter(R) (i.e. R=3.72)<br>(3) Calculate Average Absolute Difference - optimized to use more iterations (up to 500,000) shows only the result, but doesn\'t plot the solution.<br><br>There are some default values preset in case a field is left empty.';
	
	if(isInstructed) {
		show.innerHTML = 'Hide Instructions &lArr;';
		text.style.display = 'block';
		
	} else {
		show.innerHTML = 'Show Instructions &rArr;';
		text.style.display = 'none';
		
	}
	isInstructed = !isInstructed;
}



// handling checkbox events
let checkbox = document.getElementById('checkbox');
let initial2 = document.getElementById('initial2');
let coeffitient2 = document.getElementById('coef2');
let isDifChecked = false;
let multi = false; // if datapoints are too little to display by Chart.js, they are multiplied by 10^6

checkbox.addEventListener('change', function(){ 
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


// Data points
const calcPoints = () => {
	// Get input values
	let iterations = parseInt(document.getElementById('iterations').value) || 100;
	let initial = parseFloat(document.getElementById('initial').value) || 0.2;
	let coef = parseFloat(document.getElementById('coef').value) || 2.7;
	
	let init2 = parseFloat(initial2.value) || 0.2;
	let coef2 = parseFloat(coeffitient2.value) || 2.7;
	
	if(iterations < 0 || iterations > 2000 ||
	  initial < 0 || initial > 1 ||
	  coef < 0 || coef > 4) {
		alert('Invalid input, expect the unexpected.');
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
		console.log(results, 'single');
		multi = false;
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
	// Chart.defaults.global.defaultFontFamily = 'Arial';

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

const calcAAD = () => {
	if(!isDifChecked) {
		return 1;
	}
	let aad = document.getElementsByClassName('aad');
	for(let j = 0; j < aad.length; j++) {
		aad[j].style.display = 'flex';
	}
	
	// Get input values
	let iterations = parseInt(document.getElementById('iterations').value) || 100;
	let initial = parseFloat(document.getElementById('initial').value) || 0.2;
	let coef = parseFloat(document.getElementById('coef').value) || 2.7;
	
	let init2 = parseFloat(initial2.value) || 0.2;
	let coef2 = parseFloat(coeffitient2.value) || 2.7;
	
	if(iterations < 0 || iterations > 500000 ||
	  initial < 0 || initial > 1 ||
	  coef < 0 || coef > 4) {
		alert('Invalid input, expect the unexpected.');
	} 
	
	let sum = 0;
	let x = initial;
	let x2 = init2;
	
	for(let i = 1; i <= iterations; i++) {
		x = coef * x * (1 - x);
		x2 = coef2 * x2 * (1 - x2);
		sum += Math.abs(x-x2);		
	}
	console.log(sum, iterations);
	document.getElementById('aad-text').innerHTML = (sum/iterations).toFixed(5).toString();
	return 0;	
}

let checkbox = document.getElementById('checkbox');
let initial2 = document.getElementById('initial2');
let coeffitient2 = document.getElementById('coef2');
let isDifChecked = false;

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
	} 
	
	let labels = [0];
	let results = [];
	if(isDifChecked) {
		results.push(Math.abs(initial - init2));
	} else {
		results.push(initial);
	}
	let x = initial;
	let x2 = init2;
	
	for(let i = 1; i <= iterations; i++) {
		x = coef * x * (1 - x);
		x2 = coef2 * x2 * (1 - x2);
		
		if(isDifChecked) {
			results.push(Math.abs(x-x2));
		} else {
			results.push(x);
		}
		
		labels.push(i);
		
		
	}
	console.log(results);
	return plotChart(results, labels);
}


// Rendering the chart
const plotChart = (results, newLabels) => {
	let myChart = document.getElementById('myChart').getContext('2d');
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
				borderColor: '#000',
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


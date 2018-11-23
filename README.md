# logistic-equation-tool

Made for solving/visualisation of results from the Logistic equation.<br>
Part of the Nonlinear Dynamics course on <a href='https://www.complexityexplorer.org/courses/92-nonlinear-dynamics-mathematical-and-computational-approaches/'>Complexity Explorer</a>.<br><br>
Using Chart.js for the visual part.

# Notes

<strong>(1)</strong> One thing I like about the code is that there are different functions for handling the calculation of the data points and the actual plotting of the diagram.
<code>
bifurcationDiagram(…) // calculates the data
plotBifurcation() // takes the result of bifurcationDiagram() and draws it in the canvas
</code><br>
The code for the Logistic map is similar:
<code>
calcPoints() // calculates the data points
plotChart() // plots the chart
</code><br>
The difference here is that calcPoints() also handles the inputs, whereas bifurcationDiagram() doesn’t handle any global objects/variables. I couldn’t figure out which approach is better practice. Maybe there should be a separate function that handles and validates input only, second function for calculation and third for drawing.
<br>
<strong>(2)</strong> This little CSS feature saved me a lot of time and JS code, as I was trying to display some hints for the input fields. The tricky part for me was when I had two similar fields on one row and use one hint for both of them. Here's the CSS:
<code>
input:focus + .hint {
	display: inline;
}
input:focus + input + .hint {
	display: inline;
}
</code><br>
<strong>(3)</strong> <em>On the negative side:</em> <ul>
	<li>The general issue with the tool is that it's lacking good preparation and planning of the execution. It started as a project for displaying one kind of map and later I decided to add more complicated chart (the bifurcation diagram), and UI features: switch modes, hints and show/hide instructions. As a result it's not very mobile friendly (it crashes my iPhone, works only on desktop Chrome and Firefox).</li>
	<li>Besides the performance issues, there are some side effects of using Chart.js. The eventListeners it uses for showing value of data points when you hover over the chart remain active after you draw the other chart (bifurcation diagram), so these must be cleared additionally.</li>
<li>Many global variables, used for handling HTML elements, are hanging around, which could be enclosed in functions.</li>
	</ul>

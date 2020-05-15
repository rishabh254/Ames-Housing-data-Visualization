# Ames-Housing-data-Visualization

1. First get raw data and draw initial plot

2. in slider js, add same filter function inside < if (this.minDomNode) {} if (this.maxDomNode) {} >, use original raw data , filter it, output will be filtered raw data

3. call updateGraph() after filtering in above section only


4. In updateGraph() , use the same drawing code, just use select(".class") instead of append() , also keep svg, margins, height, width as global so it is accessible in intialdraw and updateGraph functions
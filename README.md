# Ames-Housing-data-Visualization
This is a complete dashboard of the visualization of Ames Housing Dataset using d3.js. This includes bubble plot, line plot , data context map and parallel coordinates as the primary visualizations. 

<p align="center">
  <a href="https://www.youtube.com/watch?v=JC7L55FGAm0&t=25s"><img width="70%" height ="70%" src="https://user-images.githubusercontent.com/8913742/82628593-3f374d80-9bbb-11ea-9622-5f6d48cf1e26.png"></a>
  <br><br>
  
</p>

1. Data Context Map : This helps us to observe data points in the context of attributes. Using data context map user can simultaneously analyze
(1) the similarity of data objects
(2) the similarity of attributes in the specific scope of the collection of data objects, and
(3) the relationships of data objects with attributes and vice versa

More info : https://www.youtube.com/watch?v=nnjkHA8xvbI

2. Line graph : This line graph helps visualise change in SalePrice and overall Quality with house age( remodelled_yearbuilt - year).

More info : https://en.wikipedia.org/wiki/Line_chart

3. Neighborhood bubble plot : In our dataset, we have different features related to geography such as neighborhood which will help us to project the number of house sales in each neighborhood.

More info : https://en.wikipedia.org/wiki/Bubble_chart

4.  Parallel Coordinates : We use parallel coordinates as it is a common way of visualizing high-dimensional geometry and analyzing multivariate data. Each of the dimensions corresponds to a vertical axis and each data element is displayed as a series of connected points along the axes. In our housing dataset we have many variables and we want to show their relation
at once. We have selected features such as SalePrice, GarageArea, OverallQual, GrLivArea, LotArea to show under parallel coordinates. 

More info : https://en.wikipedia.org/wiki/Parallel_coordinates

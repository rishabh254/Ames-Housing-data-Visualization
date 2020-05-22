# Ames-Housing-data-Visualization

## Youtube link : https://www.youtube.com/watch?v=JC7L55FGAm0&t=25s

## Background

When someone wants to buy their dream house they might be considering many aspects. This
includes various features such as house cost, locality, size of the house and many more. Also,
the importance of features might vary from person to person. We need to consider all possible
features related to the house during this analysis. Most of the variables are exactly the type of
information that a typical home buyer would want to know about a potential property such as-

- When was it built?
- How big is the lot?
- Feet of living space is in the house?
- Basement is there or not?
- How many bathrooms are there?
- What is the neighborhood of the house?

Every home buyer places a certain amount of significance on the many different aspects of a
particular property that give that property its inherent value. Also, the demand for housing
keeps on increasing. During the year to July 2019, new and existing home sales increased by
4.3% and 2.5%. According to the National Association of Realtors (NAR) existing home sales will
keep on growing every year. Also one of the largest recessions in American history occurred
due to major fluctuations in the housing markets, being able to use visualization tools to
analyze house features will be extremely useful in managing resources.

Our aim is to visualize the data in an interactive and creative way to help us answer different
questions related to housing. One of the questions this project will seek to answer is how home
buyers get different sale prices by changing their preference for certain housing characteristics.
We are providing different plots to see the relations between any variables. As a house buyer,
any user can select multiple combinations of features and will get the corresponding
visualization. This will help the user to analyze and detect different patterns within the data.
This will enable users to select housing of choice with their own required features.


## DataSet

Ames Housing Dataset is a well-known data set consisting of 79 variables describing every
aspect of residential homes in Ames.

Data Source : ​https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data

After going through the data we found that the variables were a mix of nominal, ordinal,
continuous, and discrete types. We have analyzed this dataset using a heatmap to get a view of
all important features that will help us in visualization.

```
Fig 1. Features with positive correlation with ‘SalePrice’
```

## Fig 2. Features with negative correlation with ‘SalePrice’

## Problem

Several aspects that have to be taken into consideration before buying a house. Sometimes, it
can be overwhelming to find a house that ticks all the boxes. We plan to build a visualization
that will make this process smoother for a person looking to buy a house in the Ames region of
Iowa, by analyzing this dataset. Sale Price of the house acts as a deal breaker most of the time,
so we will correlate our features to the sale price.

Our dataset primarily consists of three kinds of features:

```
● House related features : OverallQual, GarageArea, Heating, etc
● Temporal features : YrSold, MoSold, YearBuilt, YearRemodAdd
● Location features : Neighbourhood, MSZoning
```
We have identified the following four problems which could be solved using intelligent
visualizations in the context of our dataset features :

**#1** ​ The user should be able to filter the houses based on house related features. Not only
filtering, but there should be a way of understanding how a combination of requirements
reflect in the house as a whole.


**#2** ​ The user should be aware of the age of the house, i.e the last time it was remodelled (if not
remodelled, then the time it was built).

**#3** ​ The second big factor after price is the location. The user should have a clear view of where
the good houses are , or, in other words, are there any good houses in the neighborhood where
the user is looking to buy a house.

**#4** ​ It is nearly impossible to find an ideal house, so in the practical world, we try to find a house
that matches as close to our expectations. The user should be able to know the tradeoffs
between different features.

**#5** ​ The visualizations used to solve the first four problems should be interactive among each
other, i.e. if we filter by location, that change should reflect in the houses filtered according to
house features and temporal features too, and vice versa.

## Project Structure

▪ Client : We use d3 Javascript library for producing our visualizations.
▪ Server : We use python flask framework for processing and sending data to the client.
▪ housing.csv contains the data which we are going to visualize.
▪ index.html contains the basic html code, where all js and css are included and functions to draw
visualizations are called.
▪ bubble.js, lineGraph.js, mdsScatter.js and parallelCoordinates.js contain the Neighborhood bubble
plot, line graph , data context map and parallel coordinates implementation respectively.
▪ multithumb-slider.js contains the javascript code to handle slider events.
▪ style.css and multithumb-slider.css contains the presentation of different elements of our html.

**How to run** ​ : Open cmd/shell and run flask-app.py to start a local server (give it ~45 seconds to run) and
then open ​http://localhost:5000/index​ in web browser.


## Data Analysis

We have used the following visualisation techniques on our dashboard. This helps us to analyse
our data clearly and we can get important insights also.

**0. Intensity for ordering:** ​Throughout our visualizations, we use different intensities of the
    color teal to describe how relevant a house is according to a hand-crafted scoring
    function on the basis of the features selected by the user.

```
A. Darker shades of teal represents more relevance.
B. For most variables, higher value indicates higher intensity of teal, except for
SalePrice, since a buyer will be looking for houses having low prices.
```
**1. Data Context Map:** ​This helps us to observe data points in the context of attributes.
    Using data context map user can simultaneously analyze
    (1) the similarity of data objects
    (2) the similarity of attributes in the specific scope of the collection of data objects, and
    (3) the relationships of data objects with attributes and vice versa.

```
Motivation ​ ​: We chose this visualization to solve problem #1 and to some extent
problem #4. The features are represented by peach colored dots and data points with
different shades of teal color. Based on the correlations between data-data ,
feature-feature and data-feature, we map the data points and attributes in the same
plane to gather as much information using as less space as possible.
```
```
Fig 3. Data Context Map
```

```
Implementation ​ ​: We have used correlation distance for D-D , D-V, V-D and V-V
matrices. After concatenating these matrices, we apply multidimensional scaling to
them to get their projections into the two dimensions of our plot. The user can select
certain features from the slider to select which features they are interested in and the
houses will be colored with corresponding intensity of blue color based on the score
obtained from those features. This is a tweak to the original data context
implementation, where instead of coloring the background with different colors, we are
coloring the data points instead. We chose to do this because of two reasons: 1) to
prevent confusion when many colors are overlapping , 2) to allow the user to select as
many features as are present in the data context map.
```
```
Observations ​ ​: The map is particularly useful when the user is looking for a house
satisfying some particular criterias. They can just glance at the data points near the
feature they are looking for, and choose the point they like. Adding color intensity to the
data points further help the user to distinguish which points satisfy their requirements.
Apart from filtering data points, we are able to see the features that are plotted nearby
are highly correlated (refer fig 1 and fig 3). Same analogy can be applied for data points
and finding clusters. In this way, a data context map is serving multiple purposes and is a
highly useful plot to have in a dashboard.
```
**2. Line Graph:** ​ This shows the change in variable along with x-axis variable but data points
    are connected by line segments. We are using house age(remodelled_year- built_year)
    on x-axis and mean SalePrice and mean OverallQuality on Y axis.

```
Motivation ​ ​: ​Using line graphs we are providing a solution for problem #2. This plot
helps the user to visualize distribution of Overall Quality and SalePrice along with Age of
the house.
```
```
Fig 4. Line Graph
```

```
Implementation: ​This is a fairly easier plot to draw but it's quite useful for analysis at
the same time. We have added two line series mean OverallQuality and mean SalePrice
vs house age on the same graph. This line graph helps to visualise change in SalePrice
and overall Quality with house age. The House age is a derived feature from two
available features - YrSold and YearLastRemod.
```
```
Observations: ​ From the plot, we observe as the house ages, i.e its last remodelling date
is becoming far from the time it was sold, its overall quality decreases, which eventually
led to a decrease in its market value. This is quite intuitive as older houses tend to be
sold at lower market prices than new houses. There are many peaks and valleys in
SalePrice and OverallQuality around a given house age(For example around 25). This
helps users to select an affordable price range for a given house age.
```
**3. Neighborhood Bubble Plot:** ​Bubble plot uses the size of individual circles to describe a
    quantifiable quantity​ and can be helpful in comparing the relative sizes of groups.

```
Motivation ​ ​ : ​This visualization helps us to solve problem #3.​ ​Neighborhood is an
important feature to consider before buying any house. We are using a bubble chart to
show this information.
```
```
Fig 5. Neighborhood Bubble Plot
```
```
Implementation: ​ ​We are grouping houses by neighborhoods to get the collective
insights about houses. Bubble size represents the number of houses in that
```

```
neighborhood and its color represents the mean house score for this neighborhood.
We also have implemented detail on demand features on this bubble chart.
```
- Detail on Demand: Once a user selects any neighborhood they can get detailed data
about that particular neighborhood. This will show us the mean sale price and data will
change in other plots accordingly.

```
Observations ​: Most top scoring houses are situated in IDOTRR neighborhood for the
lowest Sale Price range($50k to $100k). Neighborhoods such as Gilbert and NWAmes
have enough houses that provide good value for money.
```
**4. Parallel Coordinates:** ​ This is a common way of visualizing high-dimensional geometry
    and analyzing multivariate data. ​Each of the dimensions corresponds to a vertical axis
    and each data element is displayed as a series of connected points along the axes.

```
Motivation ​ : ​In our housing dataset we have many variables and we want to show their
correlation at once. We have selected features such as SalePrice, GarageArea,
OverallQual,GrLivArea, LotArea to show under parallel coordinates. All these
features have the same scale and are comparable. We have also also added sliders to
bound and filter values across axes to check different relations at low and high values
separately.
```
```
Fig 6. Parallel Coordinates
```
```
Implementation ​ : ​After analysing data with correlation matrix , we found many
correlated features with​ ​SalePrice such as GarageArea, OverallQual, GrLivArea, LotArea,
BsmtQual. We finalised these features as y-axis. After experimenting with various
relative positions for y-axis we finalised the following plot which shows interesting
```

```
correlations. We have also added sliders to brush and filter values across axes to check
different relations at low and high values separately. We can also select these features if
we want to add their weight for score calculation.
```
```
Observations ​ :
```
```
-There is a positive correlation between SalePrice and OverallQual. With the help of a
slider we can filter our outlier and can find out general trends.
```
```
-There is also a positive correlation between OverallQual and BsmtQual.
```
```
-In the following graph SalePrice filter in on, this will contribute to house score. We can
clearly see that houses with lower price ranges are having good scores.
```
**5. Brushing & Linking**
    **-** ​We are using brushing and linking techniques to solve problem #5. For instance, If we
    are selecting a subset of a graph that will automatically get reflected in other plots. This
    will provide us more information than we were getting from independent graphs and
    we can do in detail analysis.
    - We have used brushing for parallel coordinates, Data context map(using range slider)
    and for Neighborhood map and have linked it with all plots.
    - While brushing and linking we are showing top 3 house data also. This shows more
    detail about houses which are high scoring from selected filters.

```
Fig 7. Summary of brushed features
```

## Final Result

This project resulted in an interactive dashboard to find new insights about houses in Ames,
Iowa, and is extensible to any housing dataset with similar features.

<div style="text-align:center"><img src="https://user-images.githubusercontent.com/8913742/82627418-5d4f7e80-9bb8-11ea-9db7-3173a3a00516.png" /></div>
```
Fig 8. Dashboard
```


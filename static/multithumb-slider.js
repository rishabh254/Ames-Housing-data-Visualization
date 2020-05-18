/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2014/copyright-software-and-document
*
*   File:   slider.js
*
*   Desc:   Slider widget that implements ARIA Authoring Practices
*/

// Create Slider that contains value, valuemin, valuemax, and valuenow
var Slider = function (domNode,sliderNo)  {

  this.domNode = domNode;
  this.sliderNo = sliderNo;
  this.railDomNode = domNode.parentNode;

  this.labelDomNode = false;
  this.minDomNode = false;
  this.maxDomNode = false;

  this.valueNow = 50;


  this.railMin = 0;
  this.railMax = 140;
  this.railWidth = 0;
  this.railBorderWidth = 1;

  this.thumbWidth  = 20;
  this.thumbHeight = 24;

  this.keyCode = Object.freeze({
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'pageUp': 33,
    'pageDown': 34,
    'end': 35,
    'home': 36
  });
};



function updateBubble(){
  	  d_bubble = [];
	  for(var i = 0;i<bubble_global_data.length-14;i++)
	  {
		 var temp=true;
		for(var j=0;j<features.length;j++)
		  {
			  temp = temp & ((bubble_global_data[i][features[j]]>=currMin[j] && bubble_global_data[i][features[j]]<=currMax[j]));
		  }
		  if(selectedNeigh != null){
		    temp = temp & (bubble_global_data[i]['NeighborhoodText'] == selectedNeigh);
		}

		if(temp)
			d_bubble.push(bubble_global_data[i]);
	  }
	  updateBubbleGraph(getBubbleData(d_bubble));
  }



function updateLineData(){
	  d_line = [];
	  for(var i = 0;i<d_line_graph.length-14;i++)
	  {
		 var temp=true;
		for(var j=0;j<features.length;j++)
		  {
			  temp = temp & ((d_line_graph[i][features[j]]>=currMin[j] && d_line_graph[i][features[j]]<=currMax[j]));
		  }
		 if(selectedNeigh != null){
		    temp = temp & (d_line_graph[i]['NeighborhoodText'] == selectedNeigh);
		    }
		if(temp)
			d_line.push(d_line_graph[i]);
	  }
	  updateLineGraph(d_line);
}

function updateDcm(){
	  // for data context map
	   maxScore = -10000;
	   minScore =  10000;
	   currentHouses =0;
	   scoreList =[];

	  for(var i = 0;i<d_mds_orig.length-14;i++)
	  {
		    if(scoreFeatures.length==0)
				d_mds_orig[i]['score'] = 0;
			else
			{
				d_mds_orig[i]['score'] = 0;
				for(var j=0;j<scoreFeatures.length;j++)
				{
				    if(scoreFeatures[j]=="SalePrice"){
				        d_mds_orig[i]['score'] += (1- d_mds_orig[i][scoreFeatures[j]])/scoreFeatures.length;
				    } else{
				        d_mds_orig[i]['score'] += d_mds_orig[i][scoreFeatures[j]]/scoreFeatures.length;
				    }
				}
				maxScore = Math.max(d_mds_orig[i]['score'],maxScore);
				minScore = Math.min(d_mds_orig[i]['score'],minScore);
			}
	  }

	  if(scoreFeatures.length>0)
	  {
		for(var i = 0;i<d_mds_orig.length-14;i++)
		{
			d_mds_orig[i]['score'] = (d_mds_orig[i]['score']-minScore)/(maxScore-minScore);
		}
	  }


	for(var i = 0;i<d_mds_orig.length-14;i++)
	  {
		 var temp=true;
		for(var j=0;j<features.length;j++)
		  {
			  temp = temp & ((d_mds_orig[i][features[j]]>=currMin[j] && d_mds_orig[i][features[j]]<=currMax[j]));
		  }
		if(selectedNeigh != null){
		    temp = temp & (d_mds_orig[i]['NeighborhoodText'] == selectedNeigh);
		}
		if(temp){
		    currentHouses++;
		    scoreList.push(d_mds_orig[i]);
			d3.select("#scatter_"+i).style("visibility", "visible").style("fill", function(d) {
                    return myColor1[d["dataType"]](d['score']*10>10?10:d['score']*10);
                });
        }else
			d3.select("#scatter_"+i).style("visibility", "hidden");
	  }


	  if(scoreList.length>0){
	  	  scoreList.sort((a, b) => (a.score > b.score) ? -1 : 1);
	  addValueToHTML("1", scoreList[0]['SalePrice1']);
	  addValueToHTML("2", scoreList[0]['OverallQual1']);
	  addValueToHTML("3", scoreList[0]['NeighborhoodText']);

	  addValueToHTML("4", scoreList[1]['SalePrice1']);
	  addValueToHTML("5", scoreList[1]['OverallQual1']);
	  addValueToHTML("6", scoreList[1]['NeighborhoodText']);

	  addValueToHTML("7", scoreList[2]['SalePrice1']);
	  addValueToHTML("8", scoreList[2]['OverallQual1']);
	  addValueToHTML("9", scoreList[2]['NeighborhoodText']);

	  }

	  if(scoreFeatures.length==0){
	   addValueToHTML("1", "");
	  addValueToHTML("2", "");
	  addValueToHTML("3", "");

	  addValueToHTML("4", "");
	  addValueToHTML("5", "");
	  addValueToHTML("6", "");

	  addValueToHTML("7", "");
	  addValueToHTML("8", "");
	  addValueToHTML("9", "");
	  }




	  addValueToHTML("total-houses", currentHouses);




}

function addValueToHTML(id, value){
  var element = document.getElementById(id);
  element.innerHTML = value;

}


    const applyFilters = function(){
        d3.select('g.active').selectAll('path')
    .style('display', d=>(selected(d)?null:'none'))
	.style("stroke", function(d){
    return(
    myColor(d.score*10>10?10:d.score*10))} );

    }
  function selected(d){

		    if(scoreFeatures.length==0)
				d['score'] = 0;
			else
			{
				d['score'] = 0;
				for(var j=0;j<scoreFeatures.length;j++)
				{
					if(scoreFeatures[j]=="SalePrice"){
				        d['score'] += (1- d[scoreFeatures[j]])/scoreFeatures.length;
				    } else{
				        d['score'] += d[scoreFeatures[j]]/scoreFeatures.length;
				    }
				}

				d['score'] = (d['score']-minScore)/(maxScore-minScore);
			}
			var tmp = true;
	        for(var j=0; j<parallel_slider.length;j++){
	            tmp = tmp & ((d[parallel_slider[j]]>=currMin[j] && d[parallel_slider[j]]<=currMax[j]));
	        }
	        if(selectedNeigh != null){
		        tmp = tmp & (d['NeighborhoodText'] == selectedNeigh);
		    }

	    return tmp;
  }

// Initialize slider
Slider.prototype.init = function () {

  if (this.domNode.previousElementSibling) {
    this.minDomNode = this.domNode.previousElementSibling;
    this.railMin = parseInt((this.minDomNode.getAttribute('aria-valuemin')));
  }
  else {
    this.railMin = parseInt((this.domNode.getAttribute('aria-valuemin')));
  };

  if (this.domNode.nextElementSibling) {
    this.maxDomNode = this.domNode.nextElementSibling;
    this.railMax = parseInt((this.maxDomNode.getAttribute('aria-valuemax')));
  }

  else {
    this.railMax = parseInt((this.domNode.getAttribute('aria-valuemax')));
  }

  this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));

  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  if (this.domNode.classList.contains('min')) {
    this.labelDomNode = this.domNode.parentElement.previousElementSibling;
  }

  if (this.domNode.classList.contains('max')) {
    this.labelDomNode = this.domNode.parentElement.nextElementSibling;
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.addEventListener('keydown',    this.handleKeyDown.bind(this));
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

  this.moveSliderTo(this.valueNow);

};

var currMax = [10,800000,50000,1400,5,2010];
var currMin = [1,30000,1000,0,1,2006];
var maxScore = -10000;
var minScore =  10000;
var currentHouses=d_mds_orig.length;
var scoreList=[];
var selectedNeigh=null;



Slider.prototype.moveSliderTo = function (value) {
  var valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  var valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  this.valueNow = value;
  if(value>=10000)
	this.dolValueNow = (value/1000).toFixed(1)+"k";
  else
	this.dolValueNow = value;  


  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  this.domNode.setAttribute('aria-valuetext', this.dolValueNow);



  if (this.minDomNode) {
	  //console.log("max"+this.sliderNo)
	  currMax[(this.sliderNo-1)/2] = this.valueNow;
	  //d3.select("svg").select("g").style("visibility", "hidden");
	  updateDcm();
	  //// for line graph
	  updateLineData();
	  //For parallel graph
	  applyFilters();
	  //for bubble chart

	  updateBubble();
    this.minDomNode.setAttribute('aria-valuemax', this.valueNow);
  }

  if (this.maxDomNode) {

	  currMin[this.sliderNo/2] = this.valueNow;
	  //for dcm
	  updateDcm();
	  //for line
	  updateLineData();
	    //for parallel
        applyFilters();
        //for bubble
        updateBubble();

    this.maxDomNode.setAttribute('aria-valuemin', this.valueNow);
  }
  //.on('brush', ()=>brushEventHandler(x.key))



  var pos = Math.round(((this.valueNow - this.railMin) * (this.railWidth - 2 * (this.thumbWidth - this.railBorderWidth))) / (this.railMax - this.railMin));

  if (this.minDomNode) {
    this.domNode.style.left = (pos + this.thumbWidth - this.railBorderWidth) + 'px';
  }
  else {
    this.domNode.style.left = (pos - this.railBorderWidth) + 'px';
  }

  if (this.labelDomNode) {
    this.labelDomNode.innerHTML = this.dolValueNow.toString();
  }
};



Slider.prototype.handleKeyDown = function (event) {

  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.pageDown:
      this.moveSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case this.keyCode.pageUp:
      this.moveSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveSliderTo(this.railMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveSliderTo(this.railMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }

};

Slider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

Slider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

Slider.prototype.handleMouseDown = function (event) {

  var self = this;

  var handleMouseMove = function (event) {

    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = self.railMin + parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);
    self.moveSliderTo(self.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  var handleMouseUp = function (event) {

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

  };

    // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', handleMouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', handleMouseUp);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  this.domNode.focus();

};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
// Slider.prototype.handleClick = function (event) {

//  var diffX = event.pageX - this.railDomNode.offsetLeft;
//  this.valueNow = parseInt(((this.railMax - this.railMin) * diffX) / this.railWidth);
//  this.moveSliderTo(this.valueNow);

//  event.preventDefault();
//  event.stopPropagation();

// };

// Initialise Sliders on the page

window.addEventListener('load', function () {

  var sliders = document.querySelectorAll('[role=slider]');;

  for (var i = 0; i < sliders.length; i++) {
    var s = new Slider(sliders[i],i);
    s.init();
  }
});



function myFunction(id){

  var x = document.getElementById(id);
  if (x.style.backgroundColor === "grey") {
  //on
    x.style.backgroundColor="#65B3b3";
    scoreFeatures.push(id.substring(4, id.length));
  } else {
    x.style.backgroundColor="grey";
    var index = scoreFeatures.indexOf(id.substring(4, id.length));
    scoreFeatures.splice(index,1);
  }
  updateDcm();
  applyFilters();
  updateBubble();
  updateLineData();
}
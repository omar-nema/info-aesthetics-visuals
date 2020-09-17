function getStyleProp(int){
    return int.toString() + "px"
}
canvas = d3.select('.canvas');

document.addEventListener("DOMContentLoaded", function(){
    

    d3.csv('avgdaytest.csv', function(d){ 
        newd = new Date(d['Created Date']);
        newd.setMinutes(0);
        return {
            key: +d['Unique Key'],
            borough: d.Borough,
            zip: d.ZIP,
            city: d.City,
            createdDate: new Date(d['Created Date']),
            timeInt: new Date(d['Created Date']).getHours(),
            timeHour: newd.toLocaleTimeString(),
            complaintType: d['Complaint Type'],
            desc: d.Descriptor,
            resolution: d['Resolution Description']
        }
    }).then(function(data){

        dataGrp = Array.from(d3.group(data, d => d.timeInt));
        distinctTimes = dataGrp.map(d=> d[0]);
        console.log(distinctTimes)
        //add missing times for placeholder data
        for (var i = 0; i< 24; i++){
            if (distinctTimes.indexOf(i) == -1){
                //console.log(dataGrp)
                dummyData = [i, [{timeInt: i, timeHour: i, complaintType: 'No data to display'}]]
                //
                dataGrp.push(dummyData);
            }
        }
        //re-sort data now that we've manually inserted other info
        dataGrp.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))
  



        //group data by hour to generate separate divs
       
 
       //add hours that don't exist

        canvasHt = d3.select('.canvas').node().getBoundingClientRect().height;
        canvasWidth = canvas.node().getBoundingClientRect().width;
        let rectWidth = 120, rectHeight = 30;
        var padding = 40;
        var rowHt = 40;
        var numCols =  Math.ceil(canvasWidth/(rectWidth+padding));
        var numRows = Math.ceil(data.length/numCols);
        var xScale = d3.scaleLinear().domain([0, numCols]).range([0, canvasWidth]);
        var yScale = d3.scaleLinear().domain([0, numRows]).range([0, canvasHt])

        
        //encode positions
        data.forEach(function(d, i){
            d.rowNum = Math.floor(i/numCols);
            d.colNum = i % numCols;
            d.xVal = xScale(d.colNum);
            d.yVal = yScale(d.rowNum);
        }); 

        canvas.selectAll('.time-group').data(dataGrp).enter().append('div').attr('class', 'time-group').append('div').attr('class', 'time-header').text((d)=>  d[0]);
        comps = canvas.selectAll('.time-group').selectAll('.comp').data(function(d){return d[1]}).enter().append('div').attr('class', function(d){
            if (d.key){
                return 'comp'
            } else {
                return 'dummy'
            }
        })

        comps
            .style('width', getStyleProp(rectWidth))
            .style('height', getStyleProp(rectHeight))
            .append('div').attr('class', 'compText').text((d) => d.complaintType);


    })

});




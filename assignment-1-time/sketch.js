function getStyleProp(int){
    return int.toString() + "px"
}

document.addEventListener("DOMContentLoaded", function(){
    canvas = d3.select('.canvas');

    d3.csv('avgdaytest.csv', function(d){ 
        return {
            key: +d['Unique Key'],
            borough: d.Borough,
            zip: d.ZIP,
            city: d.City,
            createdDate: new Date(d['Created Date']),
            time: new Date(d['Created Date']).getHours(),
            complaintType: d['Complaint Type'],
            desc: d.Descriptor,
            resolution: d['Resolution Description']
        }
    }).then(function(data){

        hours = [];
        for (var i = 0; i< 24; i++){
            hours.push(i);
        }
        canvasHt = canvas.node().getBoundingClientRect().height;
        canvasWidth = canvas.node().getBoundingClientRect().width;

        // timeScale = d3.scaleLinear().domain([0, hours.length]).range([0, canvasHt]);
        // axis = d3.axisLeft(timeScale);
        // canvas.append('g').attr("transform", "translate(40,0)").call(axis);

        let rectWidth = 120;
        var padding = 40;
        var numCols =  Math.ceil(canvasWidth/(rectWidth+padding));
        var numRows = Math.ceil(data.length/numCols);
        var rowHt = Math.ceil(canvasHt/numRows);

        var xScale = d3.scaleLinear().domain([0, numCols]).range([0, canvasWidth]);
        var yScale = d3.scaleLinear().domain([0, numRows]).range([0, canvasHt])

        
        //encode positions
        data.forEach(function(d, i){
            d.rowNum = Math.floor(i/numCols);
            d.colNum = i % numCols;
            d.xVal = xScale(d.colNum);
            d.yVal = yScale(d.rowNum);
        });


        complaints = canvas.append('div').attr('class', 'complaints').selectAll('rect').data(data).enter();
        compG = complaints.append('div')
            .attr('class', 'complaint')
            .style('width', getStyleProp(rectWidth))
            .style('height', getStyleProp(rowHt*.6))
            .style('background', 'blue')
            .style('transform', function(d){
                return 'translate(' + getStyleProp(d.xVal) + ',' + getStyleProp(d.yVal) + ')'
            })
            .append('div').attr('class', 'compText').text((d) => d.complaintType);
            //.style('transform', (d) =>  console.log(d);
            // .style('height', rowHt.toString())
    
            // .attr('x', (d) => d.xVal)
            // .attr('y', (d) => d.yVal)

         
      
        
        // compG.append('div')
        //     // .attr('fill', 'gray')
        //     .attr('height', 30)
        //     .attr('width', rectWidth)
        //     .attr('x', 0)
        //     .attr('y', 0)
        // compG   
        //     .append('text')
            // .text(function(d){ return d.complaintType})
        // rects.append('rect')
        //     .attr('width', 30).attr('height', 10)
        //     .attr('fill', 'blue')
        //     .attr('x', 0)
        //     .attr('y', (d) => timeScale(d.time))
        //     .text(function(d){ return d.complaintType});
          
       


        //get max num elements 
        // xScale = d3.scaleLinear()

        // dataTime = Array.from(d3.group(data, d => d.time));
        // maxLen = 0;
        // dataTime.filter(function(d){
        //     if (d[1].length > maxLen){
        //         console.log('dd')
        //         maxLen = d[1].length
        //     }
        // })
        // console.log(dataTime, maxLen)


        // conts = canvas.selectAll('rect').data(data).enter();
        // conts.append('rect');



    })

});




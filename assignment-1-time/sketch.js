function getStyleProp(int){
    return int.toString() + "px"
}
canvas = d3.select('.canvas');
tooltip = d3.select('body').append('div').attr('class', 'tooltip').style("opacity", 0);

document.addEventListener("DOMContentLoaded", function(){

    d3.csv('fulldataset.csv', function(d){
        newd = new Date(d['Created Date']);
        newd.setMinutes(0);
        return {
            zip: d.ZIP,
            zipBorough: d.Borough + ' (' + d.ZIP + ')',
            dayOfWeek: +d.dayOfWeek,
            key: +d['Unique Key'],
            borough: d.Borough,          
            city: d.City,
            createdDate: new Date(d['Created Date']),
            timeInt: new Date(d['Created Date']).getHours(),
            timeHour: newd.toLocaleTimeString(),
            complaintType: d['Complaint Type'],
            location: d['Location Type'],
            desc: d.Descriptor,
            address: d['Incident Address'],
            mappedCategory: d.mappedCategory,
            resolution: d['Resolution Description']
        }
    }).then(function(data){

        console.log(data)

        zipGroup = d3.group(data, d => d.zipBorough, d=> d.dayOfWeek)
        data = zipGroup.get('QUEENS (11385)').get(7);//ridgeWoodtest

        //grp data to make drawing by category easier
        dataGrp = Array.from(d3.group(data, d => d.timeInt));
        distinctTimes = dataGrp.map(d=> d[0]);

        //get distinct categories to use for colors
        compTypes = Array.from(d3.group(data, d => d.mappedCategory));
        distinctComps = compTypes.map(d=> d[0]);
        colScheme = d3.schemeTableau10;
        colScheme = ['rgb(89, 161, 79)', '#e6383a', '#c047c7', '#4593e6', '#2dcec6', '#7c47ad', '#555963', '#a52b74', '#2992ff', '#e0893f']
        var colorScale = d3.scaleOrdinal().domain(distinctComps).range(colScheme);
    
        //add missing times for placeholder data
        for (var i = 0; i< 24; i++){
            if (distinctTimes.indexOf(i) == -1){
                //console.log(dataGrp)
                dummyData = [i, [{timeInt: i, timeHour: i, mappedCategory: 'No data to display'}]]
                //
                dataGrp.push(dummyData);
            }
        }
        //re-sort data now that we've manually inserted other info
        dataGrp.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))
  
        //calc grid stuff
        canvasHt = d3.select('.canvas').node().getBoundingClientRect().height;
        canvasWidth = canvas.node().getBoundingClientRect().width;
        let rectWidth = 120, rectHeight = 35;
        var padding = 40;
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

        //draw!
        canvas.selectAll('.time-group').data(dataGrp).enter().append('div').attr('class', 'time-group').append('div').attr('class', 'time-header')
            .text(function(d){
                len = d[0].toString().length
                if (parseInt(d[0]) == 0){
                    return '12am'
                } else if (parseInt(d[0]) < 12) {
                    return d[0] + 'am'
                } else if (parseInt(d[0]) == 12) {
                    return '12px'
                } else {
                    num = parseInt(d[0]) % 12;
                    return  num.toString() + 'pm'
                }
            });
            // .text((d)=>  '0' + d[0] + ':00');
        comps = canvas.selectAll('.time-group').selectAll('.comp').data(function(d){return d[1]}).enter().append('div')
        .on('click', function(e){
            d = d3.select(this).data()[0]
            console.log(d);
            tooltip.transition().duration(200).style("opacity", .95)
            .style("left", (e.pageX) + "px")		
            .style("top", (e.pageY + 22) + "px");
            firstline = '<div class="first"><strong>' + d.complaintType +'</strong></div>'
            secondline =  '<div><strong>' + 'Description:</strong> ' + d.desc + '</div>';
            var thirdline;
            if (d.resolution != ''){
                thirdline = '<div><strong>' + 'Resolution:</strong> ' + d.resolution +'</div>'
            } else {
                thirdline = '<div class="noreshighlight">No Resolution</div>'
            }
            fourth ='<div>' + '<strong>Location:</strong> ' + d.location + ' at ' + d.address+ '</div>';
            
            str = firstline + secondline + thirdline + fourth;
            tooltip.html(str)		
        })
        .on('mouseout', function(){
            tooltip.style("opacity", 0);	
        })
        .each(function(d){
            if (d.key){
                d3.select(this).attr('class', 'comp')
                d3.select(this).style('background', colorScale(d.mappedCategory))
            } else {
                d3.select(this).attr('class', 'dummy');
            }     
            if (d.resolution == ''){
                d3.select(this).append('div').attr('class', 'nores').text('!')
            }
        });
        comps
            .style('width', getStyleProp(rectWidth))
            .style('height', getStyleProp(rectHeight))
            .append('div').attr('class', 'compText').text((d) => d.mappedCategory);

    })
    
});




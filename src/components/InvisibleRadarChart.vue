<template>
  <div v-bind:id="graphId" v-bind:style="'width:'+(width)+'px'">
  </div>
</template>

<script>

import * as d3 from 'd3';
import RadarChart from './utils/RadarChart.js';

export default {
  props: ['serverData', 'legendOptions', 'graphId', 'height', 'width', 'shownAxes','size','initialZoom','initialPosX'],
  data: function() {
    return {
      localData: [],
      legendStatus: [],
      companies: {}
    }
  },
  watch: {
    serverData: function(newVal, oldVal) {
      this.localData = _.cloneDeep(this.serverData);
      this.draw();
    },
  },
  methods: {
    draw() {

      this.companies = new Set();

      if(this.shownAxes == undefined){
        _.forEach(this.localData, (x) => {
          _.forEach(x, (y, i) => {
            if (y.value != 0) {
              this.companies.add(y.axis);
            }
          })
        })
      } else {
        _.forEach(this.shownAxes, (x) => {
          this.companies.add(x);
        })
      }


      this.companies.forEach((value) => {
        _.forEach(this.localData, (x) => {
          if (_.find(x, (y) => { return y.axis == value }) == undefined) {
            x.push({ axis: value, value: 0, dummy: true })
          }
        })
      });

      let newLocal = [];
      _.forEach(this.localData, (x) => {
        let newX = [];
        _.forEach(x, (y, i) => {

          if (this.companies.has(y.axis)) {
            newX.push(y)
          }

        })
        newLocal.push(newX);
      })
      this.localData = newLocal;

      var w = this.width,
        h = this.height,
        legendW = 275,
        legendH = this.height;

      var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

      //Legend titles
      if (this.legendStatus.length != this.legendOptions.length) {
        this.legendStatus = _.map(this.legendOptions, (x) => { return { text: x, active: true } });
      }

      var d = this.localData;

      //Options for the Radar chart, other than default
      var mycfg = {
        w: this.size == undefined ? 500 : this.size,
        h: this.size == undefined ? 500 : this.size,
        initialZoom: this.initialZoom == undefined ? 1 : this.initialZoom,
        maxValue: 1,
        levels: 4,
        ExtraWidthX: 0,
        factor: 1,
        containerW:w,
        containerH:h,
      }


      ////////////////////////////////////////////
      /////////// Initiate legend ////////////////
      ////////////////////////////////////////////

      d3.select(`#radarChartlegend`).remove();

      var svg = d3.select(`#${this.graphId}`)
        .append('svg')
        .attr("id", "radarChartlegend")
        .attr("width", legendW )
        .attr("height", legendH )
        // .attr("style", "position:absolute;z-index:2;background-color:#FFF" )
        .attr("style", "position:absolute;z-index:2" )
        .attr("height", 20 * (this.legendOptions.length+1))

      //Create the title for the legend
      var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)')
        // .attr("x", w - 70)
        .attr("x", -70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("font-family", "'Avenir', Helvetica, Arial, sans-serif")        
        .attr("fill", "#404040")
        .text("Percentage of company inclusions per country");

      //Initiate Legend	
      var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
        ;
      //Create colour squares
      legend.selectAll('rect')
        .data(this.legendStatus)
        .enter()
        .append("rect")
        .attr("x", 0 - 65)
        .attr("y", function(d, i) { return i * 20; })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i) { return colorscale(i); })
        ;
      var self = this;
      //Create text next to squares
      legend.selectAll('text')
        .data(this.legendStatus)
        .enter()
        .append("text")
        // .attr("x", w - 52)
        .attr("x", 0 )
        .attr("y", function(d, i) { return i * 20 + 9; })
        .attr("font-size", "11px")
        .attr("font-family", "'Avenir', Helvetica, Arial, sans-serif")        
        .attr("fill", (x) => { if (x.active) { return "#000" } else { return "#737373"; } })
        .attr("style", "cursor:pointer;text-transform: capitalize;")
        .on("click", (x, i) => {
          if (self.legendStatus[i].active) {
            self.localData[i] = _.map(self.localData[i], (x) => { return { axis: x.axis, value: 0 }; });
            self.legendStatus[i].active = false;
          } else {
            self.localData[i] = self.serverData[i];
            self.legendStatus[i].active = true;
          }
          self.draw()
        })
        .text(function(d) { return d.text; });

              //Call function to draw the Radar chart
      //Will expect that data is in %'s
      RadarChart.draw(`#${this.graphId}`, d, mycfg);
    }
  }
}
</script>

<template>
    <div v-bind:id="graphId">
        <vue-simple-spinner v-bind:style="'height:'+(height)+'px; padding-top:'+(height/2)+'px;'" v-if="isDrawing"></vue-simple-spinner>
    </div>
</template>
<script>
import * as d3 from 'd3';
export default {
    props: ["graphId","serverData", "height", "width", "centerLabel", "layers", "initialScale", "radius", "computeSize"],
    data() {
        return {
            chartData:[],
            isDrawing: true
        };
    },
    methods: {
        processData() {

            let obj = {
                name: this.centerLabel == undefined ? '':this.centerLabel,
                label: this.centerLabel == undefined ? '':this.centerLabel,
                children: []
            };

            let temp = _.chain(this.serverData)
                .flatten()
                .forEach(x => {
                    this.buildHierarchy(x, obj)
                }
                )
                .value();

            this.chartData = obj;
        },

        buildHierarchy(element, base) {
            let layers = this.layers;
            let founds = [];
            let obj = base;
            let idx = -1;
            _.forEach(layers, (x) => {

                let found = _.find(obj.children, y => {
                    return element[x] == y.name;
                })

                if (found != undefined) {
                    obj = found;
                    idx++;
                    founds.push(found);
                } else {
                    return false;
                }

            })

            let tempList = [];

            for (; idx < layers.length; idx++) {
                let temp = {}
                temp.name = element[layers[idx]]
                temp.label = element[layers[idx]]
                if (idx > 0) {
                    temp.category = element[layers[0]]
                }
                if (idx == (layers.length - 1)) {
                    // temp.label = element[layers[idx]] == undefined ? '' : element[layers[idx]].split(';')[0].split('/')[1]
                    temp.size = 1;
                }
                tempList.push(temp)
            }

            for (let i = tempList.length - 1; i > -1; i--) {
                if (tempList[i + 1] != undefined) {
                    tempList[i].children = [tempList[i + 1]]
                }
            }

            if (obj.children != undefined) {
                obj.children.push(tempList[1]);
            } else {
                obj.size++;
            }

        },
        draw() {

            this.isDrawing = true;

            let graphId = this.graphId;

            d3.select(`#${graphId} svg`).remove();
            var width = this.width == undefined? 3000 : this.width,
                height = this.height == undefined? 3000 : this.height,
                radius = this.radius == undefined? 1500 : this.radius;

            var x = d3.scaleLinear()
                .range([0, 2 * Math.PI]);

            var y = d3.scaleSqrt()
                .range([0, radius]);

            var color = d3.scaleOrdinal(d3.schemeCategory20c);

            var zoom = d3.zoom()
                .scaleExtent([0.1, 100])
                .on('zoom', zoomFn);

            function zoomFn() {
                d3.select(`#${graphId}`).select('svg').select('g')
                    .attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ') rotate(-90 0 0)');
            }

            var svg = d3.select(`#${graphId}`).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ") rotate(-90 0 0)");

            var partition = d3.partition()

            var arc = d3.arc()
                .startAngle(function(d) {
                    return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
                })
                .endAngle(function(d) {
                    return Math.max(0, Math.min(2 * Math.PI, x(d.x0 + (d.x1 - d.x0))));
                })
                .innerRadius(function(d) {
                    return Math.max(0, y(d.y0));
                })
                .outerRadius(function(d) {
                    return Math.max(0, y(d.y0 + (d.y1 - d.y0)));
                });

            var computeSize = this.computeSize;

            var root = d3.hierarchy(this.chartData)
                .sum(function(d) {
                    if(computeSize){
                        return d.children ? 0 : d.size;
                    }
                    return d.children ? 0 : 1;
                })

            let colorList = [
                { low: '#e19151', high: '#ffe27e' },
                { low: '#d39248', high: '#ffe470' },
                { low: '#ae933c', high: '#ffe55d' },
                { low: '#88923e', high: '#d4e460' },
                { low: '#648d4a', high: '#9cdc73' },
                { low: '#438659', high: '#68d18b' },
                { low: '#277d67', high: '#3cc3a0' },
                { low: '#1d7170', high: '#2db0ae' },
                { low: '#2c6473', high: '#449cb3' },
                { low: '#3f566e', high: '#6286ab' },
                { low: '#4e4861', high: '#797097' },
                { low: '#553a50', high: '#845a7c' },
                { low: '#702550', high: '#ae397c' },
            ]

            let step = Math.max(Math.floor(colorList.length / root.children.length), 1);

            if (step == 1) {
                colorList = _.shuffle(colorList)
            }

            let colors = {};

            for (let i = 0, j = 0; j < root.children.length; i += step, j++) {

                let colorFn = d3.scaleLinear()
                    .domain([1, this.layers.length])
                    .range([d3.rgb(colorList[i % colorList.length].low), d3.rgb(colorList[i % colorList.length].high)]);
                colors[root.children[j].data.name] = colorFn;

            }


            partition(root)

            var g = svg.selectAll("g")
                .data(root.descendants())
                .enter().append("g");

            var path = g.append("path")
                .attr("d", arc)
                .style("fill", function(d) {

                    if (d.depth == 0) {
                        return '#FFF';
                    }

                    if (d.depth == 1) {
                        return colors[d.data.name](d.depth)
                    }

                    return colors[d.data.category](d.depth)

                })
                .on("click", click);

            var text = g.append("text")
                .attr("x", function(d) {
                    return y(d.y0);
                })
                .attr("dx", "6") // margin
                .attr("dy", ".35em") // vertical-align
                .text(function(d) {
                    return d.data.label;
                });

            function computeTextRotation(d) {
                var angle = x(d.x0 + (d.x1 - d.x0) / 2) - Math.PI / 2;
                return angle / Math.PI * 180;
            }

            text.attr("transform", function(d) {
                return "rotate(" + computeTextRotation(d) + ")";
            });


            function click(d) {
                // fade out all text elements
                if (d.size !== undefined) {
                    d.size += 100;
                };
                text.transition().attr("opacity", 0);

                path.transition()
                    .duration(750)
                    .attrTween("d", arcTween(d))
                    .on("end", function(e, i) {
                        // check if the animated element's data e lies within the visible angle span given in d
                        if (e.x0 >= d.x0 && e.x0 < (d.x0 + (d.x1 - d.x0))) {
                            // get a selection of the associated text element
                            var arcText = d3.select(this.parentNode).select("text");
                            // fade in the text element and recalculate positions
                            arcText.transition().duration(750)
                                .attr("opacity", 1)
                                .attr("transform", function() {
                                    return "rotate(" + computeTextRotation(e) + ")"
                                })
                                .attr("x", function(d) {
                                    return y(d.y0);
                                });
                        }
                    });
            } //});

            d3.select(self.frameElement).style("height", height + "px");

            // Interpolate the scales!
            function arcTween(d) {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x0 + (d.x1 - d.x0)]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function(d, i) {
                    return i ? function(t) {
                        return arc(d);
                    } : function(t) {
                        x.domain(xd(t));
                        y.domain(yd(t)).range(yr(t));
                        return arc(d);
                    };
                };
            }

            let scale = this.initialScale == undefined? 1 : this.initialScale;

            d3.select(`#${graphId}`).select('svg').call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width / 2 , (height / 2 + 10) ).scale(scale,scale));

            this.isDrawing = false;

        }
    },
    watch: {
        serverData: function(newVal, oldVal) {
            if(this.serverData.length>0){
                this.processData();
                this.draw();
            }
        },
    }
}
</script>
<style>
path {
    stroke: #fff;
    fill-rule: evenodd;
}
</style>

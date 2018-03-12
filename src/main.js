import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import * as _ from 'lodash';
import * as d3 from 'd3';
import InvisibleRadarChart from './components/InvisibleRadarChart.vue'

Vue.use(VueResource);

Vue.component('radar-chart', InvisibleRadarChart)

new Vue({
  el: '#app',
  render: h => h(App)
})

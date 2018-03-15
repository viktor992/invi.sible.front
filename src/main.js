import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import * as _ from 'lodash';
import * as d3 from 'd3';
import InvisibleRadarChart from './components/InvisibleRadarChart.vue'
import InvisibleSunburstChart from './components/InvisibleSunburstChart.vue'

Vue.use(VueResource);

Vue.component('radar-chart', InvisibleRadarChart)
Vue.component('sunburst-chart', InvisibleSunburstChart)

new Vue({
  el: '#app',
  render: h => h(App)
})

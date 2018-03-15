import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import * as _ from 'lodash';
import * as d3 from 'd3';
import {routes} from './routes'
import InvisibleRadarChart from './components/charts/InvisibleRadarChart.vue'
import InvisibleSunburstChart from './components/charts/InvisibleSunburstChart.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.component('radar-chart', InvisibleRadarChart)
Vue.component('sunburst-chart', InvisibleSunburstChart)

const router = new VueRouter({routes,
  mode:'history'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

import App from './App.vue'
import RadarChartDemo from './components/views/InvisibleRadarChartDemo.vue'
import SunburstChartDemo from './components/views/InvisibleSunburstChartDemo.vue'


export const routes = [
    {path: '/', component: App },
    {path: '/app', component: App },
    {path: '/radar-chart-demo', component: RadarChartDemo },
    {path: '/sunburst-chart-demo', component: SunburstChartDemo }
]
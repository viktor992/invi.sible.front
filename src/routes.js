import App from './App.vue'
import RadarChartView from './components/views/InvisibleRadarChartView.vue'
import SunburstChartView from './components/views/InvisibleSunburstChartView.vue'


export const routes = [
    {path: '/', component: App },
    {path: '/app', component: App },
    {path: '/radar-chart', component: RadarChartView },
    {path: '/radar-chart-demo', component: RadarChartView },
    {path: '/sunburst-chart', component: SunburstChartView },
    {path: '/sunburst-chart-demo', component: SunburstChartView }
]
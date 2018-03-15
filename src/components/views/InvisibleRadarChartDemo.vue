<template>
    <div>
        <radar-chart :graphId="'g1'" :serverData="surfaceData" :legendOptions="legendOptions"  :width="width" :height="height" :size="size" :initialZoom="initialZoom" :shownAxes="shownAxes" ></radar-chart>
    </div>
</template>
<script>
export default {
  data(){
      return {
        legendOptions: [],
        countries: [
            { short: 'py', name: 'Paraguay', campaign: 'gob.paraguay' },
            { short: 'br', name: 'Brasil', campaign: 'gob.brasil' },
            {short:'co', name:'Colombia',campaign:'gob.colombia'},
            { short: 'cl', name: 'Chile', campaign: 'gob.chile' }
        ],
        surfaceData: [],
        width: this.$route.query.width === undefined? 800: Number(this.$route.query.width),
        height: this.$route.query.height === undefined? 800: Number(this.$route.query.height),
        size: this.$route.query.size === undefined? 800: Number(this.$route.query.size),
        initialZoom: this.$route.query.initialZoom === undefined? 0.75: parseFloat(this.$route.query.initialZoom),
        shownAxes: this.$route.query.shownAxes,
        shownItems: this.$route.query.shownItems,

      }
  },
  methods: {
    getSurfaceData(campaign) {
        console.log("this",this)
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/surface/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {

          this.legendOptions.push(country.name)
          this.surfaceData.push(this.processLeaders(data));

        })
    },
    processLeaders(data) {
      return _.chain(data)
        .map(x => { return x.leaders })
        .flatten()
        .sortBy(x => -x.p)
        .uniqBy(x => x.company)
        .map(x => { return { axis: x.company, value: Number((x.p / 100).toFixed(2)) }; })
        .value();
    },
  },
  mounted(){

    _.forEach(this.countries, (country) => {
      if (this.shownItems == undefined || this.shownItems.indexOf(country.name) >= 0) {
        this.getSurfaceData(country.campaign);
      }
    })
  }
}
</script>

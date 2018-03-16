<template>
  <div>
      <sunburst-chart :graphId="'g2'" :serverData="extendedData" :layers="layers" :centerLabel="centerLabel" :height="height" :width="width" :initialScale="initialScale" :radius="radius" :computeSize="computeSize"></sunburst-chart>
  </div>
</template>
<script>
export default {
  data(){
      return {
        extendedData: [],
        countries: [
            { short: 'py', name: 'Paraguay', campaign: 'gob.paraguay' },
            { short: 'br', name: 'Brasil', campaign: 'gob.brasil' },
            {short:'co', name:'Colombia',campaign:'gob.colombia'},
            { short: 'cl', name: 'Chile', campaign: 'gob.chile' }
        ],
        width: this.$route.query.width === undefined? 800: Number(this.$route.query.width),
        height: this.$route.query.height === undefined? 800: Number(this.$route.query.height),
        radius: this.$route.query.radius === undefined? 3000: Number(this.$route.query.radius),
        initialScale: this.$route.query.initialScale === undefined? 0.10: parseFloat(this.$route.query.initialScale),
        shownItems: this.$route.query.shownItems,
        layers: this.$route.query.layers == undefined? ['siteCountry', 'company','href']: this.$route.query.layers,
        centerLabel: this.$route.query.centerLabel == undefined? "Sites" : this.$route.query.centerLabel,        
        computeSize: this.$route.query.computeSize === 'true'? true: false,
      }
  },
  methods:{
    getExtendedData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/extended/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original Extended data", data)

          this.extendedData.push(this.processSiteExtended(data, country));
        })
    },
    processSiteExtended(data, country) {
      return _.chain(data)
        .map(x => { x.siteCountry = country.name; return x })
        .value();
    },
  },
  mounted(){

    let campaigns = _.map(this.countries, x => { return x.campaign });

    _.forEach(this.countries, (country) => {
      if (this.shownItems == undefined || this.shownItems.indexOf(country.name) >= 0) {
        this.getExtendedData(country.campaign);
      }
    })

  }
}
</script>

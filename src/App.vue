<template>
  <div id="app">
    <!-- <h1>invi.sible.front</h1>
    <p>Consultando datos de
      <a href="https://invi.sible.link">https://invi.sible.link</a>
    </p> -->
    <!-- <radar-chart :graphId="'g1'" :serverData="surfaceData" :legendOptions="legendOptions"  :width=800 :height=800 :size=800 :initialZoom=0.75 ></radar-chart>
    <sunburst-chart :graphId="'g2'" :serverData="extendedData" :layers="['siteCountry', 'company','href']" :centerLabel="'Sites'" :height=800 :width=800 :initialScale=0.17 :radius=3000></sunburst-chart>
     -->

    <router-view></router-view>

  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'app',
  data() {
    return {
      legendOptions: [],
      countries: [
        { short: 'py', name: 'Paraguay', campaign: 'gob.paraguay' },
        { short: 'br', name: 'Brasil', campaign: 'gob.brasil' },
        {short:'co', name:'Colombia',campaign:'gob.colombia'},
        { short: 'cl', name: 'Chile', campaign: 'gob.chile' }
      ],
      serverData: [],
      surfaceData: [],
      detailsData: [],
      extendedData: [],
      companies: {},
    }
  },
  methods: {
    getMixedData(campaign) {
      // this.$http.get('http://localhost:7000/api/v1/mixed/gobwebsecpy')            
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/mixed/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original data", data)
          console.log("Mostrando javascripts/cookies/companies por cada url/pais:", this.processData1(data, country))
          console.log("Mostrando inclusion/pais", this.processData2(data, country))

          //Se guarda en variable serverData para algún uso futuro
          this.serverData.push(this.processData1(data, country));

        })
    },

    getSurfaceData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/surface/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {

          this.legendOptions.push(country.name)
          this.surfaceData.push(this.processLeaders(data));

        })
    },

    getDetailsData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/details/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original Details data", data)

          //Se guarda en variable serverData para algún uso futuro
          this.detailsData.push(this.processInclusions(data, country));


        })
    },

    getExtendedData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/extended/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original Extended data", data)

          //Se guarda en variable serverData para algún uso futuro
          this.extendedData.push(this.processSiteExtended(data, country));
        })
    },


    /**
     * Mostrar javascripts/cookies/companies por cada url/pais 
     */
    processData1(data, country) {
      return _.chain(data[0])
        .map(x => { return { href: x.href, cookies: x.cookies.length, javascripts: x.javascripts, companies: x.companies, country: country.name } })
        .value();
    },
    /**
     * Mostrar inclusion/pais 
    */
    processData2(data, country) {
      return _.chain(data[1])
        .map(x => { return { href: x.href, inclusion: x.inclusion, country: country.name } })
        .value();
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
    processSiteInclusions(data, country) {
      return _.chain(data)
        .map(x => { x.siteCountry = country.name; return x })
        .value();
    },
    processInclusions(data, country) {
      return _.chain(data)
        .countBy(x => x.inclusion)
        .map((x, y) => { return { country: country.name, inclusion: y, quantity: x, percentage: x / data.length * 100 } })
        .flatten()
        .value();
    },
    processSiteExtended(data, country) {
      return _.chain(data)
        .map(x => { x.siteCountry = country.name; return x })
        .value();
    },

    processExtended(data, country) {
      return _.chain(data)
        .countBy(x => x.inclusion)
        .map((x, y) => { return { country: country.name, inclusion: y, quantity: x, percentage: x / data.length * 100 } })
        .flatten()
        .value();
    },
    processContentTypeExtended(data, country) {
      return _.chain(data)
        // .countBy(x=>x["Content-Type"])
        // .countBy(x=>x["Content-Type"] == undefined ? "UNKNOWN" : x["Content-Type"].split(';')[0])
        .countBy(x => x["Content-Type"] == undefined ? "UNKNOWN" : x["Content-Type"].split(';')[0].split('/')[1])
        .map((x, y) => { return { country: country.name, inclusion: y, quantity: x, percentage: x / data.length * 100 } })
        .flatten()
        .sortBy(x => -x.quantity)
        .value();
    }
  },
  mounted: function() {

    let campaigns = _.map(this.countries, x => { return x.campaign });

    _.forEach(campaigns, (campaign) => {
      // this.getSurfaceData(campaign);
      // this.getDetailsData(campaign);
      // this.getExtendedData(campaign);
    })

  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; */
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>

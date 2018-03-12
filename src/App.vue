<template>
  <div id="app">
    <h1>invi.sible.front</h1>
    <p>Consultando datos de
      <a href="https://invi.sible.link">https://invi.sible.link</a>
    </p>
    <radar-chart :serverData="serverData" :legendOptions="legendOptions"></radar-chart>
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
        { short: 'py', name: 'paraguay', campaign: 'gob.paraguay' },
        { short: 'br', name: 'brasil', campaign: 'gob.brasil' },
        // {short:'co', name:'colombia',campaign:'gob.colombia'},
        { short: 'cl', name: 'chile', campaign: 'gob.chile' }
      ],
      serverData: [],
      companies: {}
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
          console.log("Original data", data)
          console.log("processLeaders:", this.processLeaders(data, country))

          this.legendOptions.push(country.name)
          this.serverData.push(this.processLeaders(data, country));

        })
    },

    getDetailsData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/details/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original data", data)

          //Se guarda en variable serverData para algún uso futuro
          this.serverData.push(this.processInclusions(data, country));


        })
    },

    getExtendedData(campaign) {
      let country = _.find(this.countries, x => { return x.campaign == campaign });
      this.$http.get(`https://invi.sible.link/api/v1/extended/${campaign}`)
        .then(response => { return response.json() })
        .then(data => {
          console.log("Original data", data)

          //Se guarda en variable serverData para algún uso futuro
          this.serverData.push(this.processContentTypeExtended(data, country));


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
    processLeaders(data, country) {
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
      this.getSurfaceData(campaign);
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
    margin-top: 60px;
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

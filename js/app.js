const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = ""; // Insert your api key here

const SECTIONS = "arts, automobiles, books, business, fashion, food, health, home, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world";

function buildUrl(url) {
  return NYTBaseUrl + url + ".json?api-key=" + ApiKey;
}

Vue.component('news-list', {
  props: ['results'],
  template: `
  <section>
  <div class="row" v-for="posts in processedPosts">
                
    <div class="col s12 m4" v-for="post in posts">
      <div class="card">
          <div class="card-title card-panel teal lighten-2">
              {{ post.title }}
          </div>
          <div class="card-image waves-effect waves-block waves-light">
              <a :href="post.url" target="_blank"><img class="activator" :src="post.image_url"></a>
          </div>
          <div class="card-action">
              <p>{{ post.abstract }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  computed: {
    processedPosts() {
      let posts = this.results;
      

      // Add image_url attribute
      posts.map(post => {
        let imgObj = post.multimedia.find(media => media.format === "superJumbo");
        post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
      });

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 3;
      for (i=0,j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i, i + chunk);
      }
      return chunkedArray;
    }
  }
});

const vm = new Vue({
    el: '#app',
    data: {
      results: [],
      sections: SECTIONS.split(', '), // create an array of the sections
      section: 'home', // set default to home
      loading: true,
      title:''
    },
    mounted() {
        this.getPosts('home');
        
    },
    methods: {
      getPosts(section) {
        let url = buildUrl(section);
        axios.get(url).then((response) => {
          this.loading = false;
          this.results = response.data.results;
          let title = this.section !== 'home' ? "Top stories in '" + this.section + "' today" : "Top stories today";
          this.title = title + "(" + response.data.num_results + ")";
        }).catch((error) => {
          console.log(error);
        });
      }
    },
});
const NFTPostcard = {
  template: `
    <div class="mt-5 pt-3">
      <b-card no-body header="NFTPostcard" class="border-0" header-class="p-1">
        <b-card no-body class="border-0 m-0 mt-2">
          <b-card-body class="p-0">

            <b-container class="p-0" fluid>

              <b-row class="mb-3">
                <b-col md="8" class="p-3">
                  <div id="toBeCaptured">
                    <canvas id="thecanvas" width="1024" height="480" style="border:1px solid; margin: 0 auto; position: absolute;"></canvas>
                  </div>
                </b-col>

                <div>
                  <b-button id="show-btn" @click="showModal">Open Modal</b-button>
                  <b-button id="toggle-btn" @click="toggleModal">Toggle Modal</b-button>

                  <b-modal ref="my-modal" hide-footer title="Select frame from GIF" @shown="onGIFFrameSelectionModalOpened">

                    <b-link @click="addGIFFrame()" v-b-popover.hover="'Click to add this frame to the canvas'">
                      <div class="d-block text-center">
                        <h3>Frame {{ gif.frame == null ? '(loading)' : gif.frame }} </h3>
                        <img id="thegif1" :src="gif.src" :rel:animated_src="gif.src" width="360" height="360" rel:auto_play="0" rel:rubbable="1" class="p-2" />
                      </div>
                    </b-link>
                    <br />

                    <b-input-group>
                      <template #prepend>
                        <b-form-spinbutton wrap @change="setFrame()" v-model.trim="gif.frame" min="0" :max="gif.frames == null ? 0 : (gif.frames - 1)" class="mr-2"></b-form-spinbutton>
                        <b-input-group-text>0</b-input-group-text>
                      </template>
                      <b-form-input @change="setFrame()" v-model="gif.frame" type="range" min="0" :max="gif.frames == null ? 0 : (gif.frames - 1)" class="w-25"></b-form-input>
                      <template #append>
                        <b-input-group-text>{{ gif.frames == null ? 0 : (gif.frames - 1) }}</b-input-group-text>
                      </template>
                    </b-input-group>

                    <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
                    <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button>
                  </b-modal>
                </div>

                <!--
                <b-col md="4" class="ml-auto p-3">
                  <pre>
                    <code class="json">
{{ JSON.stringify(selectedObject, null, 4) }}
                    </code>
                  </pre>
                </b-col>
                -->

              </b-row>
            </b-container>
            <!--
            <b-form-group label-cols="2" label-size="sm">
              <b-button size="sm" @click="saveImage()" variant="info">Save Image</b-button>
            </b-form-group>
            -->

            <div>
              <b-card no-body class="mt-2">
                <b-tabs vertical pills card end nav-class="p-2" active-tab-class="p-2">

                  <b-tab title="Canvas" class="p-1">
                    <b-card-text>

                      <b-form-group label-cols="2" label-size="sm" label="Width" description="24 to 2048">
                        <b-input-group>
                          <template #prepend>
                            <b-form-input type="text" @change="setCanvasSize()" v-model.trim="canvasSetting.width" class="w-100 mr-2"></b-form-input>
                            <b-input-group-text>24</b-input-group-text>
                          </template>
                          <b-form-input @change="setCanvasSize()" v-model="canvasSetting.width" type="range" min="24" max="2048" class="w-25"></b-form-input>
                          <template #append>
                            <b-input-group-text>2048</b-input-group-text>
                          </template>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group label-cols="2" label-size="sm" label="Height" description="24 to 2048">
                        <b-input-group>
                          <template #prepend>
                            <b-form-input type="text" @change="setCanvasSize()" v-model.trim="canvasSetting.height" class="w-100 mr-2"></b-form-input>
                            <b-input-group-text>24</b-input-group-text>
                          </template>
                          <b-form-input @change="setCanvasSize()" v-model="canvasSetting.height" type="range" min="24" max="2048" class="w-25"></b-form-input>
                          <template #append>
                            <b-input-group-text>2048</b-input-group-text>
                          </template>
                        </b-input-group>
                      </b-form-group>

                      <!--
                      <b-form-group label-cols="2" label-size="sm">
                        <b-button size="sm" @click="setCanvasSize()" variant="info">Set Canvas Size</b-button>
                      </b-form-group>
                      -->
                      <b-form-group label-cols="2" label-size="sm" description="To be implemented. Please use your OS print screen buttons">
                        <b-button disabled size="sm" @click="saveImage()" v-b-popover.hover="'Not working yet. Please use your OS print screen buttons'" variant="info">Save Image</b-button>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>

                  <b-tab active title="NFTs" class="p-1">

                    <b-row class="mb-3">
                      <b-col md="6" class="p-3">
                        <b-card-group deck class="m-0">
                          <b-card body-class="p-1" footer-class="p-1" img-top class="m-1 p-0">
                            <b-form-select v-model="collectionsSelected" :options="collectionsOptions" multiple :select-size="10"></b-form-select>
                          </b-card>
                        </b-card-group>
                      </b-col>
                      <b-col md="6" class="p-3">
                        <b-form-select disabled v-model="accountsSelected" :options="accountsOptions" multiple :select-size="4"></b-form-select>
                      </b-col>
                    </b-row>

                    <div v-if="!powerOn" class="mt-4">
                      Click the power button <b-button size="sm" variant="link" class="m-0 p-0" v-b-popover.hover="'Power up this app'" @click="setPowerOn();" v-if="!powerOn"><b-icon-power shift-v="-1" font-scale="1.5"></b-icon-power></b-button> on the top right to connect via web3 to load your NFTs.
                    </div>
                    <div v-else>
                      <b-button size="sm" @click="loadNFTs()" variant="link" class="mt-2"><b-icon-arrow-repeat v-b-popover.hover="'Refresh NFTs using the OpenSea API'" shift-v="+3" font-scale="1.5"></b-icon-arrow-repeat></b-button>Refresh NFTs
                    </div>

                    <b-card-group deck class="m-0">
                      <div v-for="asset in assetsToDisplay">
                        <b-card body-class="p-1" header-class="p-2" footer-class="p-2" img-top class="m-1 p-0">
                          <b-link @click="addAsset(asset)" v-b-popover.hover="'Click to add image to the canvas'">
                            <!-- <b-avatar rounded="sm" variant="light" size="10.0rem" :src="asset.image_url" class="pixelated"></b-avatar> -->
                            <!-- <b-avatar rounded="sm" variant="light" size="10.0rem" :src="asset.image_url" class="pixelated"></b-avatar> -->
                            <b-img rounded="sm" variant="light" size="10.0rem" :src="asset.image_url" style="width: 15rem; height: 15rem; object-fit: contain; object-position: 50% top; background-color: #fafafa;" class="pixelated m-1 p-2"></b-img>
                            <!-- <b-img rounded="sm" variant="light" size="10.0rem" :src="asset.image_url" style="image-rendering: pixelated!; width: 10rem; height: 10rem; object-fit: contain; object-position: 50% top; background-color: #fafafa; " class="m-1 p-2"></b-img> -->
                          </b-link>
                          <template #header>
                            <span variant="secondary" class="small truncate">
                              <b-link :href="asset.collection.external_url" v-b-popover.hover="'View on original site, if available. Risky out there, so be careful - ' + getCollectionTitle(asset)" target="_blank">
                                <img :src="asset.collection.image_url" width="20px" />
                              </b-link>
                              {{ getCollectionTitle(asset).substring(0, 32) }}
                            </span>
                            <!--
                            <span class="float-right">
                              <b-link :href="asset.permalink + '?ref=0x000001f568875F378Bf6d170B790967FE429C81A'" v-b-popover.hover="'View on OpenSea.io'" target="_blank"><img src="images/381114e-opensea-logomark-flat-colored-blue.png" width="20px" /></b-link>
                            </span>
                            -->
                          </template>
                          <template #footer>
                            <span class="small truncate" v-b-popover.hover="getAssetName(asset)">
                              {{ getAssetName(asset).substring(0, 32) }}
                            </span>
                            <span class="float-right">
                              <b-link :href="asset.permalink + '?ref=0x000001f568875F378Bf6d170B790967FE429C81A'" v-b-popover.hover="'View on OpenSea.io'" target="_blank"><img src="images/381114e-opensea-logomark-flat-colored-blue.png" width="20px" /></b-link>
                              <!-- <b-link :href="'https://rarible.com/token/'+ asset.permalink + ':' + tokenId" v-b-popover.hover="'View on Rarible.com'" target="_blank"><img src="images/rarible_feb7c08ba34c310f059947d23916f76c12314e85.png" height="20px" /></b-link> -->
                            </span>
                          </template>
                        </b-card>
                      </div>
                    </b-card-group>
                  </b-tab>

                  <b-tab title="Upload Image" class="p-1">
                    <b-card-text>
                      <b-row  align-h="start">
                        <b-col cols="2">Scale</b-col>
                        <b-col cols="3">
                          <b-form-group description="Scale width. e.g., 0.5">
                            <b-form-input type="text" v-model.trim="settings['ImageUpload'].scaleWidth"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col cols="3">
                          <b-form-group description="Scale height. e.g., 0.5">
                            <b-form-input type="text" v-model.trim="settings['ImageUpload'].scaleHeight"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col cols="2">
                          <b-form-group>
                            <b-form-checkbox v-model.trim="settings['ImageUpload'].flipX">
                              Flip X
                            </b-form-checkbox>
                          </b-form-group>
                        </b-col>
                        <b-col cols="2">
                          <b-form-group>
                            <b-form-checkbox v-model.trim="settings['ImageUpload'].flipY">
                              Flip Y
                            </b-form-checkbox>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-form-group label-cols="2" label-size="sm" label="Select image" description="From local filesystem">
                        <b-form-file v-model="file" @input="onFileChange" accept="image/jpeg, image/png, image/gif"  class="w-50" placeholder="Choose a JPEG, PNG or GIF file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>

                  <b-tab title="Text" class="p-1">
                    <b-card-text>
                      <b-form-group label-cols="2" label-size="sm" label="Enter text">
                        <b-form-input type="text" v-model.trim="text.text"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols="2" label-size="sm" label="Text colour">
                        <input type="color" v-model.trim="text.colour" value="#00ff36">
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="Background colour">
                        <b-form-checkbox v-model="text.backgroundTransparent">
                          transparent
                        </b-form-checkbox>
                        <input type="color" v-model.trim="text.backgroundColour" value="#00ff36">
                      </b-form-group>

                      <b-form-group label-cols="2" label-size="sm" label="Font family">
                        <b-form-select v-model="text.fontFamily" class="mb-3 w-25">
                          <b-form-select-option value="arial">Arial</b-form-select-option>
                          <b-form-select-option value="helvetica" selected>Helvetica</b-form-select-option>
                          <b-form-select-option value="myriad pro">Myriad Pro</b-form-select-option>
                          <b-form-select-option value="delicious">Delicious</b-form-select-option>
                          <b-form-select-option value="verdana">Verdana</b-form-select-option>
                          <b-form-select-option value="georgia">Georgia</b-form-select-option>
                          <b-form-select-option value="courier">Courier</b-form-select-option>
                          <b-form-select-option value="comic sans ms">Comic Sans MS</b-form-select-option>
                          <b-form-select-option value="impact">Impact</b-form-select-option>
                          <b-form-select-option value="monaco">Monaco</b-form-select-option>
                          <b-form-select-option value="optima">Optima</b-form-select-option>
                          <b-form-select-option value="hoefler text">Hoefler Text</b-form-select-option>
                          <b-form-select-option value="plaster">Plaster</b-form-select-option>
                          <b-form-select-option value="engagement">Engagement</b-form-select-option>
                        </b-form-select>
                      </b-form-group>

                      <b-form-group label-cols="2" label-size="sm">
                        <b-button size="sm" @click="addText(text)" variant="info">Add Text</b-button>
                      </b-form-group>

                    </b-card-text>
                  </b-tab>

                </b-tabs>
              </b-card>
            </div>

          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,

      assets: [],

      collectionsSelected: [],
      accountsSelected: [],

      punksDataList: [],
      pixelPortraitsDataList: [],
      bganpunkv2DataList: [],
      punkBodiesDataList: [],
      mooncatsDataList: [],
      cryptoCatsDataList: [],
      wrappedCryptoCatsDataList: [],

      selectedObject: null,
      canvasSetting: {
        width: 1024,
        height: 480
      },
      imageSetting: {
        scaleWidth: 0.5,
        scaleHeight: 0.5,
        flipX: false,
        flipY: false
      },
      settings: {
        "ImageUpload": {
          scaleWidth: 0.5,
          scaleHeight: 0.5,
          flipX: false,
          flipY: false
        },
        "ZombieBaby": {
          scaleWidth: 5.0 / 40,
          scaleHeight: 5.0 / 40,
          flipX: false,
          flipY: false
        },
        "CryptoPunk": {
          scaleWidth: 5.0,
          scaleHeight: 5.0,
          flipX: false,
          flipY: false
        },
        "PixelPortrait": {
          scaleWidth: 5.0 / 20,
          scaleHeight: 5.0 / 20,
          flipX: false,
          flipY: false
        },
        "BGANPUNKV2": {
          scaleWidth: 5.0 / 20,
          scaleHeight: 5.0 / 20,
          flipX: false,
          flipY: false
        },
        "PunkBody": {
          scaleWidth: 5.0,
          scaleHeight: 5.0,
          flipX: false,
          flipY: false
        },
        "MoonCat": {
          scaleWidth: 5.0 / 12,
          scaleHeight: 5.0 / 12,
          flipX: false,
          flipY: false
        },
        "CryptoCat": {
          scaleWidth: 5.0 / 80,
          scaleHeight: 5.0 / 80,
          flipX: false,
          flipY: false
        },
      },
      file: null,

      text: {
        text: "",
        fontFamily: "helvetica",
        colour: "#000000",
        backgroundTransparent: true,
        backgroundColour: "#ffffff"
      },

      gif: {
        src: "images/bganpunkv2_2221.gif", // null,
        rub: null,
        frames: null,
        frame: 0,
      },

      canvas: null,
    }
  },
  computed: {
    powerOn() {
      return store.getters['connection/powerOn'];
    },
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    networkName() {
      return store.getters['connection/networkName'];
    },
    accounts() {
      return [ store.getters['connection/coinbase'], "0xBeeef66749B64Afe43Bbc9475635Eb510cFE4922" ];
      // return [ "0x000001f568875F378Bf6d170B790967FE429C81A", "0x00000217d2795F1Da57e392D2a5bC87125BAA38D", "0x000003e1E88A1110E961f135dF8cdEa4b1FFA81a", "0x07fb31ff47Dc15f78C5261EEb3D711fb6eA985D1" ];
    },
    // canvas() {
    //   return store.getters['nftPostcard/canvas'];
    // },
    nftData() {
      return store.getters['tokens/nftData'];
    },
    allTokenIds() {
      return store.getters['tokens/allTokenIds'];
    },
    allParents() {
      return store.getters['tokens/allParents'];
    },
    allAttributes() {
      return store.getters['tokens/allAttributes'];
    },
    allAncientDNAs() {
      return store.getters['tokens/allAncientDNAs'];
    },
    freeTokenId() {
      const tokenIds = store.getters['tokens/allTokenIds'];
      return tokenIds == null ? null : tokenIds[Math.floor(Math.random() * tokenIds.length)];
    },
    accountsOptions() {
      const results = [];
      const map = {};
      for (let accountIndex in this.accounts) {
        const account = this.accounts[accountIndex];
        if (account != null) {
          map[account] = true;
        }
      }
      for (let [account, value] of Object.entries(map)) {
        results.push({ value: account, text: account});
      }
      results.push({ value: '--- (all) ---', text: '--- (all) ---'});
      results.sort(function(a, b) {
        return ('' + a.value).localeCompare(b.value);
      });
      return results;
    },
    collectionsOptions() {
      const results = [];
      const map = {};
      for (let assetIndex in this.assets) {
        const asset = this.assets[assetIndex];
        if (asset.collection.slug != null) {
          map[asset.collection.slug] = asset.collection.name;
        }
      }
      for (let [slug, name] of Object.entries(map)) {
        results.push({ value: slug, text: name});
      }
      results.push({ value: '--- (all) ---', text: '--- (all) ---'});
      results.sort(function(a, b) {
        return ('' + a.value + a.text).localeCompare(b.value + a.text);
      });
      return results;
    },
    assetsToDisplay() {
      let results = [];
      if (this.collectionsSelected == null || this.collectionsSelected.length == 0 || (this.collectionsSelected.length == 1 && this.collectionsSelected[0] == "--- (all) ---")) {
        results = this.assets;
      } else {
        var lookupMap = {};
        for (let selectionIndex in this.collectionsSelected) {
          lookupMap[this.collectionsSelected[selectionIndex]] = true;
        }
        for (let assetIndex in this.assets) {
          const asset = this.assets[assetIndex];
          if ((asset.collection.slug in lookupMap)) {
            results.push(asset);
          }
        }
      }
      results.sort(function(a, b) {
        return ('' + a.collection.slug + '-' + a.name).localeCompare(b.collection.slug + '-' + b.name);
      });
      return results;
    },
  },
  methods: {

    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['my-modal'].toggle('#toggle-btn')
    },


    setPowerOn() {
      store.dispatch('connection/setPowerOn', true);
      localStorage.setItem('powerOn', true);
      var t = this;
      setTimeout(function() {
        t.statusSidebar = true;
      }, 1500);
    },
    getCollectionTitle(asset) {
      if (asset.collection != null && asset.collection.name) {
        return asset.collection.name;
      } else {
        return '#' + asset.asset_contract.name;
      }
    },
    getAssetName(asset) {
      if (asset.name != null) {
        return asset.name;
      } else {
        return '#' + asset.asset_contract.name + ' #' + asset.token_id;
      }
    },
    async saveImage() {
      logDebug("NFTPostcard", "saveImage()");

      // const div = document.getElementById("toBeCaptured");
      // logDebug("NFTPostcard", "saveImage() div: " + JSON.stringify(div));
      // console.table(div);

      // getScreenshotOfElement($("div#toBeCaptured").get(0), 0, 0, 100, 100, function(data) {
      //     // in the data variable there is the base64 image
      //     // exmaple for displaying the image in an <img>
      //     $("img#captured").attr("src", "data:image/png;base64,"+data);
      // });

      // function getScreenshotOfElement(element, posX, posY, width, height, callback) {
      //     html2canvas(element, {
      //         onrendered: function (canvas) {
      //             var context = canvas.getContext('2d');
      //             var imageData = context.getImageData(posX, posY, width, height).data;
      //             var outputCanvas = document.createElement('canvas');
      //             var outputContext = outputCanvas.getContext('2d');
      //             outputCanvas.width = width;
      //             outputCanvas.height = height;
      //
      //             var idata = outputContext.createImageData(width, height);
      //             idata.data.set(imageData);
      //             outputContext.putImageData(idata, 0, 0);
      //             callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
      //         },
      //         width: width,
      //         height: height,
      //         useCORS: true,
      //         taintTest: false,
      //         allowTaint: false
      //     });
      // }

      /*
      function getScreenshotOfElement(element, posX, posY, width, height, callback) {
        // logDebug("NFTPostcard", "getScreenshotOfElement() element: " + JSON.stringify(element));
        // console.table(element);
        html2canvas(element, {
          width: width,
          height: height,
          useCORS: true,
          taintTest: false,
          allowTaint: false
        }).then(canvas => {
          // onrendered: function (canvas) {
          // logDebug("NFTPostcard", "getScreenshotOfElement() element: " + JSON.stringify(element));
          var context = canvas.getContext('2d');
          var imageData = context.getImageData(posX, posY, width, height).data;
          var outputCanvas = document.createElement('canvas');
          var outputContext = outputCanvas.getContext('2d');
          outputCanvas.width = width;
          outputCanvas.height = height;

          var idata = outputContext.createImageData(width, height);
          idata.data.set(imageData);
          outputContext.putImageData(idata, 0, 0);
          logDebug("NFTPostcard", "getScreenshotOfElement() idata: " + JSON.stringify(idata));
          callback(outputCanvas.toDataURL());
          // },
        });
      }

      getScreenshotOfElement(document.querySelector("#toBeCaptured"), 0, 0, 1000, 1000, async function(data) {
        // in the data variable there is the base64 image
        // exmaple for displaying the image in an <img>
        // $("img#captured").attr("src", "data:image/png;base64,"+data);
        logDebug("NFTPostcard", "saveImage() data: " + JSON.stringify(data));
        const blob = await fetch(data).then(r => r.blob());
        logDebug("NFTPostcard", "saveImage() blob: " + JSON.stringify(blob));
        const url = URL.createObjectURL(blob);
        logDebug("NFTPostcard", "saveImage() url: " + JSON.stringify(url));
        const a = document.createElement('a');
        a.download = "my_image.png"
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
      });
      */

      // this.canvas.renderAll();
      // console.table(document.getElementsByClassName("upper-canvas"));
      // var element = document.getElementsByClassName("upper-canvas")[0];
      // console.table(element);
      const posX = 0;
      const posY = 0;
      const width = 480;
      const height = 480;
      // html2canvas(document.body).then(async (canvas) => {
      var theCanvas = document.querySelector("#thecanvas");
      console.table(theCanvas);
      html2canvas(theCanvas).then(async (canvas) => {
      // html2canvas(element).then(async (canvas) => {
        // document.body.appendChild(canvas);
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(posX, posY, width, height).data;
        logDebug("NFTPostcard", "saveImage() imageData: " + JSON.stringify(imageData));
        var outputCanvas = document.createElement('canvas');
        var outputContext = outputCanvas.getContext('2d');
        outputCanvas.width = width;
        outputCanvas.height = height;

        var idata = outputContext.createImageData(width, height);
        idata.data.set(imageData);
        outputContext.putImageData(idata, 0, 0);
        var dataURL = outputCanvas.toDataURL();
        logDebug("NFTPostcard", "saveImage() dataURL: " + JSON.stringify(dataURL));

        const blob = await fetch(dataURL).then(r => r.blob());
        logDebug("NFTPostcard", "saveImage() blob: " + JSON.stringify(blob));
        const url = URL.createObjectURL(blob);
        logDebug("NFTPostcard", "saveImage() url: " + JSON.stringify(url));
        const a = document.createElement('a');
        a.download = "my_image.png"
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
        a.remove();

        // callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        // console.table(canvas);
          // document.body.appendChild(canvas)
      }, { width: width, height: height, useCORS: false, taintTest: false, allowTaint: true });
      // }, { width: width, height: height, useCORS: true, taintTest: false, allowTaint: false });


      // let dataURL = this.canvas.toDataURL({ format: 'png', multiplier: 2, });
      // logDebug("NFTPostcard", "saveImage() dataURL: " + JSON.stringify(dataURL));
      //
      // const blob = await fetch(dataURL).then(r => r.blob());
      // logDebug("NFTPostcard", "saveImage() blob: " + JSON.stringify(blob));
      // const url = URL.createObjectURL(blob);
      // logDebug("NFTPostcard", "saveImage() url: " + JSON.stringify(url));
      // const a = document.createElement('a');
      // a.download = "my_image.png"
      // a.href = url;
      // a.click();
      // URL.revokeObjectURL(url);
      // a.remove();

      // downloadDataUrl(dataURL);

    },
    setCanvasSize() {
      // logDebug("NFTPostcard", "setCanvasSize() canvasSetting: " + JSON.stringify(this.canvasSetting));
      this.canvas.setWidth(this.canvasSetting.width);
      this.canvas.setHeight(this.canvasSetting.height);
    },
    setFrame() {
      logDebug("NFTPostcard", "setFrame() this.gif.frame: " + JSON.stringify(this.gif.frame));
      this.gif.rub.move_to(this.gif.frame);
      // this.canvas.setWidth(this.gif.frame);
    },
    onFileChange(file) {
      const t = this;
      const url = URL.createObjectURL(file);
      // logDebug("NFTPostcard", "onFileChange() url: " + JSON.stringify(url));
      var imgObj = new Image();
      imgObj.src = url;
      // logDebug("NFTPostcard", "onFileChange() imgObj: " + JSON.stringify(imgObj));
      imgObj.onload = function () {
        const image = new fabric.Image(imgObj);
        image.set({ left: 0, top: 0, angle: 0, padding: 0, cornersize: 0 });
        // logDebug("NFTPostcard", "onFileChange() image width: " + image.width + ", height: " + image.height);
        // logDebug("NFTPostcard", "onFileChange() t.canvas width: " + t.canvas.width + ", height: " + t.canvas.height);
        image.scale(t.settings['ImageUpload'].scaleWidth, t.settings['ImageUpload'].scaleHeight).set('flipX', t.settings['ImageUpload'].flipX).set('flipY', t.settings['ImageUpload'].flipY);
        t.canvas.add(image);
        localStorage.setItem('canvas', JSON.stringify(t.canvas));
        // t.canvas.setBackgroundImage(image);
        // t.canvas.renderAll();
      };
    },
    async onGIFFrameSelectionModalOpened() {
      logDebug("NFTPostcard", "onGIFFrameSelectionModalOpened()");
      const t = this;
      var element = document.getElementById("thegif1")
      t.gif.rub = new SuperGif({ gif: element, loop_delay: 2000, max_width: 360, rubbable: true } );
      console.log("rub: " + JSON.stringify(t.gif.rub));
      console.log("rub.loadError: " + JSON.stringify(t.gif.rub.loadError));
      t.gif.rub.load(function(){
        console.log('oh hey, now the gif is loaded');
        console.log("rub.get_length(): " + JSON.stringify(t.gif.rub.get_length()));
        console.log("rub.get_auto_play(): " + JSON.stringify(t.gif.rub.get_auto_play()));
        t.gif.frames = t.gif.rub.get_length();
        if (t.gif.frame < 0 || t.gif.frame >= t.gif.frames) {
          t.gif.frame = 0;
        }
        t.gif.rub.move_to(t.gif.frame);
      });
    },
    async addGIFFrame() {
      const t = this;
      logDebug("NFTPostcard", "addGIFFrame() t.gif.rub: " + JSON.stringify(t.gif.rub, null, 2));
      logDebug("NFTPostcard", "addGIFFrame() t.gif.rub.get_canvas(): " + JSON.stringify(t.gif.rub.get_canvas(), null, 2));
      const scale = 0.5;
      const x = t.gif.rub;
      const y = x.get_canvas().getContext("2d");
      const z = x.get_canvas().toDataURL();
      logDebug("NFTPostcard", "addGIFFrame() z: " + JSON.stringify(z, null, 2));
      fabric.Image.fromURL(z, function(oImg) {
        oImg.set('imageSmoothing', false).scale(scale);
        // logDebug("NFTPostcard", "addAsset() adding: " + JSON.stringify(oImg));
        t.canvas.add(oImg);
        logDebug("NFTPostcard", "addGIFFrame() added: " + JSON.stringify(oImg));
        logDebug("NFTPostcard", "addGIFFrame() LocalStorage.setItem: " + JSON.stringify(oImg));
        localStorage.setItem('canvas', JSON.stringify(t.canvas));
      } , {crossOrigin: 'anonymous'});
      // var element = document.getElementById("thegif1")
    },
    async addAsset(asset) {
      logDebug("NFTPostcard", "addAsset() asset: " + JSON.stringify(asset, null, 2));
      const t = this;
      var element = document.getElementById("thegif1")

      const xhr = new XMLHttpRequest();
      // Bypass CORS for this demo - naughty, Drakes
      xhr.open('GET', asset.image_url);
      // xhr.responseType = "image/gif";
      xhr.onload = function() {
        // callback(url, xhr.response);
        console.log(xhr.response.substring(0, 3));
        if (xhr.response.substring(0, 3) == "GIF") {
          logDebug("NFTPostcard", "addAsset() asset GIF: " + JSON.stringify(asset, null, 2));
          t.gif.src = asset.image_url;
          t.$refs['my-modal'].show();
          // var rub = new SuperGif({ gif: element, loop_delay: 2000, rubbable: true } );
          // console.log("rub: " + JSON.stringify(rub));
          // console.log("rub.loadError: " + JSON.stringify(rub.loadError));
          // rub.load(function(){
          //   console.log('oh hey, now the gif is loaded');
          //   console.log("rub.get_length(): " + JSON.stringify(rub.get_length()));
          //   console.log("rub.get_auto_play(): " + JSON.stringify(rub.get_auto_play()));
          //   rub.move_to(120);
          // });
        } else {
          let scale = 1.0;
          // const canvas = store.getters['nftPostcard/canvas'];
          // ZombieBabies
          if (asset.asset_contract.address == '0xfe9231f0e6753a8412a00ec1f0028a24d5220ba9') {
            scale = 5.0 / 16;
          } else if (asset.asset_contract.name == 'CryptoPunks') {
            scale = 5.0 / 14;
          } else if (asset.asset_contract.name == 'PunkBodies') {
            scale = 1.0;
          } else if (asset.asset_contract.name == 'Meebits') {
            scale = 1.0 / 1.2;
          } else if (asset.collection.name == 'The Pixel Portraits') {
            scale = 5.0 / 20;
          } else if (asset.collection.name == 'BASTARD GAN PUNKS V2') {
            scale = 5.0 / 15;
          } else if (asset.collection.name == '3DVoxelPunks') {
            scale = 5.0 / 16;
          // } else if (asset.asset_contract.name == 'MoonCat') {
          //   scale = 5.0 / 12;
          // } else if (asset.asset_contract.name == 'CryptoCat') {
          //   scale = 5.0 / 80;
          }
          fabric.Image.fromURL(asset.image_url, function(oImg) {
            oImg.set('imageSmoothing', false).scale(scale);
            // logDebug("NFTPostcard", "addAsset() adding: " + JSON.stringify(oImg));
            t.canvas.add(oImg);
            logDebug("NFTPostcard", "addAsset() added: " + JSON.stringify(oImg));
            logDebug("NFTPostcard", "addAsset() LocalStorage.setItem: " + JSON.stringify(oImg));
            localStorage.setItem('canvas', JSON.stringify(t.canvas));
          } , {crossOrigin: 'anonymous'});
        }
      };
      xhr.onerror = function() {
        alert('A network error occurred!');
      };
      xhr.send();

    },
    async addAssetOld(asset) {
      logDebug("NFTPostcard", "addAsset() asset: " + JSON.stringify(asset, null, 2));
      const t = this;
      let scale = 1.0;
      // const canvas = store.getters['nftPostcard/canvas'];
      // ZombieBabies
      if (asset.asset_contract.address == '0xfe9231f0e6753a8412a00ec1f0028a24d5220ba9') {
        scale = 5.0 / 16;
      } else if (asset.asset_contract.name == 'CryptoPunks') {
        scale = 5.0 / 14;
      } else if (asset.asset_contract.name == 'PunkBodies') {
        scale = 1.0;
      } else if (asset.asset_contract.name == 'Meebits') {
        scale = 1.0 / 1.2;
      } else if (asset.collection.name == 'The Pixel Portraits') {
        scale = 5.0 / 20;
      } else if (asset.collection.name == 'BASTARD GAN PUNKS V2') {
        scale = 5.0 / 15;
      } else if (asset.collection.name == '3DVoxelPunks') {
        scale = 5.0 / 16;
      // } else if (asset.asset_contract.name == 'MoonCat') {
      //   scale = 5.0 / 12;
      // } else if (asset.asset_contract.name == 'CryptoCat') {
      //   scale = 5.0 / 80;
      }

      logDebug("NFTPostcard", "EXIF.getData getting 1: " + JSON.stringify(asset.image_url));
      // this.img.src = asset.image_url;
      // logDebug("NFTPostcard", "EXIF.getData getting 2: " + JSON.stringify(asset.image_url));
      // var element = document.getElementById("thegif")
      // logDebug("NFTPostcard", "EXIF.getData getting 3: " + JSON.stringify(asset.image_url));
      // EXIF.getData(new File(asset.image_url), function() {
      //   logDebug("NFTPostcard", "EXIF.getData this: " + JSON.stringify(this));
      //   var make = EXIF.getTag(this, "Make");
      //     // var model = EXIF.getTag(this, "Model");
      //     // var makeAndModel = document.getElementById("makeAndModel");
      //     // makeAndModel.innerHTML = `${make} ${model}`;
      // });

      // if (/.*\.gif/.test(asset.image_url)) {
        this.gif.src = asset.image_url;
        this.$refs['my-modal'].show()
      // } else {
        fabric.Image.fromURL(asset.image_url, function(oImg) {

          // EXIF.getData(oImg, function() {
          //   logDebug("NFTPostcard", "EXIF.getData this: " + JSON.stringify(this));
          //   // var make = EXIF.getTag(this, "Make");
          //     // var model = EXIF.getTag(this, "Model");
          //     // var makeAndModel = document.getElementById("makeAndModel");
          //     // makeAndModel.innerHTML = `${make} ${model}`;
          // });


          oImg.set('imageSmoothing', false).scale(scale);
          // logDebug("NFTPostcard", "addAsset() adding: " + JSON.stringify(oImg));
          t.canvas.add(oImg);
          logDebug("NFTPostcard", "addAsset() added: " + JSON.stringify(oImg));
          logDebug("NFTPostcard", "addAsset() LocalStorage.setItem: " + JSON.stringify(oImg));
          localStorage.setItem('canvas', JSON.stringify(t.canvas));
        } , {crossOrigin: 'anonymous'});
      // }
    },
    async addImage(nftType, id, image, asset) {
      logDebug("NFTPostcard", "addImage() type: " + nftType + ", id: " + id + ", image: " + image);
      if (asset != null) {
        // console.table(asset);
        console.log(JSON.stringify(asset, null, 2));
      }
      const t = this;
      let scale = 5.0;
      if (nftType == 'ZombieBaby') {
        scale = 5.0 / 40;
      } else if (nftType == 'CryptoPunk') {
        scale = 5.0 / 14;
      } else if (nftType == 'PixelPortrait') {
        scale = 5.0 / 20;
      } else if (nftType == 'BGANPUNKV2') {
        scale = 5.0 / 40;
      } else if (nftType == 'PunkBody') {
        scale = 1.0;
      } else if (nftType == 'MoonCat') {
        scale = 5.0 / 12;
      } else if (nftType == 'CryptoCat') {
        scale = 5.0 / 80;
      }
      const flipX = false;
      // fabric.Image.fromURL(image, function(oImg) {
      //   oImg.set('imageSmoothing', false).scale(scale).set('flipX', flipX);
      //   // oImg.set({width: 300, height: 300, left: 10, top: 10, originX: 'left', originY: 'top'});
      //   // oImg.filters.push(new fabric.Image.filters.Grayscale());
      //   // oImg.applyFilters();
      //   t.canvas.add(oImg);
      // } , {crossOrigin: 'anonymous'});
      fabric.Image.fromURL(image, function(oImg) {
        oImg.set('imageSmoothing', false).scale(scale).set('flipX', flipX);
        // oImg.set({width: 300, height: 300, left: 10, top: 10, originX: 'left', originY: 'top'});
        // oImg.filters.push(new fabric.Image.filters.Grayscale());
        // oImg.applyFilters();
        logDebug("NFTPostcard", "addImage() adding: " + JSON.stringify(oImg));
        t.canvas.add(oImg);
        logDebug("NFTPostcard", "addImage() added: " + JSON.stringify(oImg));
      } , {crossOrigin: 'anonymous'});
    },

    async addText(text) {
      logDebug("NFTPostcard", "addText() text: " + JSON.stringify(text, null, 2));
      const iText = new fabric.IText(text.text, {
        fontFamily: text.fontFamily,
        left: 100,
        top: 100,
        fill: text.colour,
        textBackgroundColor: text.backgroundTransparent ? null : text.backgroundColour,
      });
      this.canvas.add(iText);
      localStorage.setItem('canvas', JSON.stringify(this.canvas));
      logDebug("NFTPostcard", "LocalStorage Canvas: " + JSON.stringify(this.canvas));
    },

    async loadNFTs() {
      logDebug("NFTPostcard", "loadNFTs()");
      const PAGESIZE = 50; // Default 20, max 50
      const DELAY = 1000; // Millis
      let page = 0;
      this.assets = [];
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(DELAY);
      logDebug("NFTPostcard", "loadNFTs() 1 - this.accounts: " + this.accounts);
      for (let accountIndex in this.accounts) {
        logDebug("NFTPostcard", "loadNFTs() 2");
        const account = this.accounts[accountIndex];
        logDebug("NFTPostcard", "loadNFTs() 2 - account: " + account);
        let completed = false;
        let page = 0;
        while (!completed) {
          if (account != null) {
            const offset = PAGESIZE * page;
            let url = "https://api.opensea.io/api/v1/assets?owner=" + account + "&order_direction=desc&limit=" + PAGESIZE + "&offset=" + offset;
            logDebug("NFTPostcard", "loadAssets() url:" + url);
            const data = await fetch(url).then(response => response.json());
            if (data.assets && data.assets.length > 0) {
              for (let assetIndex = 0; assetIndex < data.assets.length; assetIndex++) {
                const asset = data.assets[assetIndex];
                // logDebug("NFTPostcard", "loadAssets() asset(" + (parseInt(offset) + assetIndex) + ") name: " + asset.collection.name + ", slug: " + asset.collection.slug);
                this.assets.push(asset);
              }
            } else {
              completed = true;
            }
            page++;
          }
          await delay(DELAY);
        }
      }
    },
    async timeoutCallback() {
      logDebug("NFTPostcard", "timeoutCallback() count: " + this.count);

      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 15000);
      }
    },
  },
  beforeDestroy() {
    logDebug("NFTPostcard", "beforeDestroy()");
  },
  mounted() {
    logDebug("NFTPostcard", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("NFTPostcard", "Calling timeoutCallback()");
    this.timeoutCallback();
    this.loadNFTs();

    let storedCanvas;
    try {
      storedCanvas = JSON.parse(localStorage.getItem('canvas'));
    } catch (e) {
      storedCanvas = null;
    }
    // logDebug("NFTPostcard", "LocalStorage storedCanvas: " + JSON.stringify(storedCanvas));

    logDebug("NFTPostcard", "Canvas: " + JSON.stringify(this.canvas));
    if (storedCanvas == null) {
      logDebug("NFTPostcard", "Canvas");
      this.canvas = new fabric.Canvas('thecanvas', {
        hoverCursor: 'pointer',
        selection: false,
        targetFindTolerance: 2
      });
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: 'cyan',
        width: 380,
        height: 380
      });
      this.canvas.add(rect);
      const text = new fabric.IText('Tap and Type', {
          left: 100,
          top: 100,
      });
      this.canvas.add(text);
      localStorage.setItem('canvas', JSON.stringify(this.canvas));
      logDebug("NFTPostcard", "LocalStorage Canvas: " + JSON.stringify(this.canvas));
    } else {
      this.canvas = new fabric.Canvas('thecanvas', {
        hoverCursor: 'pointer',
        selection: false,
        targetFindTolerance: 2
      });
      const t = this;
      this.canvas.loadFromJSON(storedCanvas, function() {
        // logDebug("NFTPostcard", "LocalStorage loadFromJSON: " + JSON.stringify(storedCanvas));
         t.canvas.renderAll();
      },function(o,object){
         // console.log(o,object)
      })
    }


    function renderIcon(icon) {
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size/2, -size/2, size, size);
        ctx.restore();
      }
    }

    const deleteImg = document.createElement('img');
    // deleteImg.src = deleteIcon;
    deleteImg.src = "images/trash.svg";
    const cloneImg = document.createElement('img');
    // cloneImg.src = cloneIcon;
    cloneImg.src = "images/images.svg";
    const layerUpImg = document.createElement('img');
    layerUpImg.src = "images/arrow-up-square.svg";
    const layerDownImg = document.createElement('img');
    layerDownImg.src = "images/arrow-down-square.svg";
    const flipYImg = document.createElement('img');
    flipYImg.src = "images/symmetry-horizontal.svg";
    const flipXImg = document.createElement('img');
    flipXImg.src = "images/symmetry-vertical.svg";
    const removeBackgroundImg = document.createElement('img');
    removeBackgroundImg.src = "images/person-bounding-box.svg";

    function deleteObject(eventData, transform) {
      var target = transform.target;
  		var canvas = target.canvas;
  		canvas.remove(target);
      canvas.requestRenderAll();
  	}

    function cloneObject(eventData, transform) {
      var target = transform.target;
      var canvas = target.canvas;
      target.clone(function(cloned) {
        cloned.left += 10;
        cloned.top += 10;
        canvas.add(cloned);
      });
    }

    function layerUpObject(eventData, transform) {
      transform.target.bringForward();
    }

    function layerDownObject(eventData, transform) {
      transform.target.sendBackwards();
    }

    function flipXObject(eventData, transform) {
      transform.target.flipX = !transform.target.flipX;
      t.canvas.renderAll();
    }

    function flipYObject(eventData, transform) {
      transform.target.flipY = !transform.target.flipY;
      t.canvas.renderAll();
    }

    function removeObjectBackground(eventData, transform) {
      if (transform.target.type == "image") {
        logDebug("NFTPostcard", "Calling removeObjectBackground()  target: " + JSON.stringify(transform.target));
        let ctx = transform.target.canvas.getContext('2d');
        let data = ctx.getImageData(parseInt(transform.target.left) * window.devicePixelRatio + 1, parseInt(transform.target.top) * window.devicePixelRatio + 1, 1, 1);
        logDebug("NFTPostcard", "Calling removeObjectBackground() data: " + JSON.stringify(data));
        if (data.data[3] != 0) {
          var backgroundColor = '#' + data.data[0].toString(16) + data.data[1].toString(16) + data.data[2].toString(16);
          var filter = new fabric.Image.filters.RemoveColor({
            threshold: 0.2,
            color: backgroundColor
          });
          transform.target.filters.push(filter);
          // Meebit 0 - #5f7c8f, 1 - #536e83

          const meeBitBackgroundColours = ['#5f7c8f', '#536e83', '#68889d', '#648196', '#58758a', '#455f75', '#4c687d', '#3e576d', '597384', '#506676', '#536d7c', '#4a606e'];

          for (let i = 0; i < meeBitBackgroundColours.length; i++) {
            const filter = new fabric.Image.filters.RemoveColor({
              distance: 0.05,
              color: meeBitBackgroundColours[i]
            });
            transform.target.filters.push(filter);
          }

          // var filter1 = new fabric.Image.filters.RemoveColor({
          //   threshold: 0.2,
          //   color: '#5f7c8f'
          // });
          // transform.target.filters.push(filter1);
          //
          // var filter2 = new fabric.Image.filters.RemoveColor({
          //   threshold: 0.2,
          //   color: '#536e83'
          // });
          // transform.target.filters.push(filter2);
          //
          // var filter3 = new fabric.Image.filters.RemoveColor({
          //   threshold: 0.2,
          //   color: '#68889d'
          // });
          // transform.target.filters.push(filter3);
          //
// 648196

          transform.target.applyFilters();
          t.canvas.renderAll();
        }
      }
    }

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon(deleteImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.clone = new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: cloneObject,
      render: renderIcon(cloneImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.layerUpControl = new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetY: 16,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: layerUpObject,
      render: renderIcon(layerUpImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.layerDownControl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      offsetY: 16,
      offsetX: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: layerDownObject,
      render: renderIcon(layerDownImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.flipXControl = new fabric.Control({
      x: -0.5,
      y: 0,
      offsetY: 0,
      offsetX: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: flipXObject,
      render: renderIcon(flipXImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.flipYControl = new fabric.Control({
      x: 0,
      y: 0.5,
      offsetY: 16,
      offsetX: 0,
      cursorStyle: 'pointer',
      mouseUpHandler: flipYObject,
      render: renderIcon(flipYImg),
      cornerSize: 24
    });

    fabric.Object.prototype.controls.removeBackgroundControl = new fabric.Control({
      x: 0.5,
      y: 0,
      offsetY: 0,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: removeObjectBackground,
      render: renderIcon(removeBackgroundImg),
      cornerSize: 24
    });

    // logDebug("NFTPostcard", "Calling fabric.Object.prototype.controls: " + JSON.stringify(fabric.Object.prototype.controls));

    const t = this;
    this.canvas.on({
      'object:moving': function(e) {
        e.target.opacity = 0.5;
      },
      'object:modified': function(e) {
        e.target.opacity = 1;
        // var objects = canvas.getObjects('line');
        // var objects = t.canvas.getObjects();
        // for (let i in objects) {
        //     logDebug("NFTPostcard", "Canvas object:modified(): " + JSON.stringify(objects[i]));
        // }
        logDebug("NFTPostcard", "canvas object:modified: " + JSON.stringify(t.canvas));
        localStorage.setItem('canvas', JSON.stringify(t.canvas));
      },
      'selection:cleared': function(e) {
        // var objects = t.canvas.getObjects();
        // for (let i in objects) {
        //     logDebug("NFTPostcard", "Canvas selection:cleared(): " + JSON.stringify(objects[i]));
        // }
      },
      'selection:updated': function(e) {
        // var objects = t.canvas.getObjects();
        // for (let i in objects) {
        //     logDebug("NFTPostcard", "Canvas selection:updated(): " + JSON.stringify(objects[i]));
        // }
      },
      'selection:created': function(e) {
        // logDebug("NFTPostcard", "Canvas selection:created() e: " + JSON.stringify(e));
        // // t.selectedObject = e;
        // var objects = t.canvas.getObjects();
        // for (let i in objects) {
        //     logDebug("NFTPostcard", "Canvas selection:created(): " + JSON.stringify(objects[i]));
        // }
      },
      'mouse:down': function(options) {
        if (options.target) {
          // logDebug("NFTPostcard", "Canvas mouse:down(): " + JSON.stringify(options.target));
          t.selectedObject = options.target;
          // var objects = t.canvas.getObjects();
          // for (let i in objects) {
          //     logDebug("NFTPostcard", "Canvas mouse:down(): " + JSON.stringify(objects[i]));
          // }
        }
      }
    });
  },
  destroyed() {
    this.reschedule = false;
  },
};

const nftPostcardModule = {
  namespaced: true,
  state: {
    canvas: null,
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    canvas: state => state.canvas,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    setCanvas(state, c) {
      logDebug("nftPostcardModule", "mutations.setCanvas('" + c + "')")
      state.canvas = c;
    },
    deQueue(state) {
      logDebug("nftPostcardModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("nftPostcardModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("nftPostcardModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    setCanvas(context, c) {
      logDebug("connectionModule", "actions.setCanvas(" + JSON.stringify(c) + ")");
      // context.commit('setCanvas', c);
    },
  },
};

const MoonCatData = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 1 && network != 3">
        <b-card-text>
          Please switch to the Ethereum mainnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      MoonCatDataModule
      <!--
      <b-button v-b-toggle.contracts size="sm" block variant="outline-info">Contracts</b-button>
      <b-collapse id="contracts" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 1 || network == 3">
          <b-row>
            <b-col cols="4" class="small">ERC-1155 NFT</b-col>
            <b-col class="small truncate" cols="8">
              <b-link :href="explorer + 'address/' + nftData.nftAddress + '#code'" class="card-link" target="_blank">{{ nftData.nftAddress == null ? '' : (nftData.nftAddress.substring(0, 10) + '...') }}</b-link>
              <span class="float-right"><b-link v-b-popover.hover="'View on OpenSea.io'" :href="nftData.openSeaUrl" target="_blank"><img src="images/381114e-opensea-logomark-flat-colored-blue.png" width="20px" /></b-link> <b-link :href="'https://rarible.com/collection/'+ nftData.nftAddress" v-b-popover.hover="'View on Rarible.com'" target="_blank"><img src="images/rarible_feb7c08ba34c310f059947d23916f76c12314e85.png" height="20px" /></b-link>
              </span>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Adoption Centre</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + nftData.adoptionCentreV1Address + '#code'" class="card-link" target="_blank">{{ nftData.adoptionCentreV1Address == null ? '' : (nftData.adoptionCentreV1Address.substring(0, 10) + '...') }}</b-link></b-col>
          </b-row>
        </b-card>
      </b-collapse>
      <b-button v-b-toggle.library size="sm" block variant="outline-info">Library</b-button>
      <b-collapse id="library" visible class="mt-2">
        <b-card no-body class="border-0">
          <b-row>
            <b-col cols="4" class="small">Collections</b-col><b-col class="small truncate" cols="8">{{ Object.keys(collections).length }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Assets</b-col><b-col class="small truncate" cols="8">{{ Object.keys(assets).length }}</b-col>
          </b-row>
        </b-card>
      </b-collapse>
      -->
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
      refreshNow: false,
    }
  },
  computed: {
    network() {
      return store.getters['connection/network'] == null ? null : store.getters['connection/network'].chainId;
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    // collections() {
    //   return store.getters['tokens/collections'];
    // },
    // collectionList() {
    //   return store.getters['tokens/collectionList'];
    // },
    // assets() {
    //   return store.getters['tokens/assets'];
    // },
    // nftData() {
    //   return store.getters['tokens/nftData'];
    // },
  },
  methods: {
    async timeoutCallback() {
      // logInfo("MoonCatData", "timeoutCallback() count: " + this.count);
      if (this.count++ % 15 == 0 || store.getters['connection/blockUpdated'] || this.refreshNow) {
        // Call from Connection instead
        // store.dispatch('tokens/execWeb3', { count: this.count });
        if (this.refreshNow) {
          this.refreshNow = false;
        }
      }

      // this.count++;

      logInfo("MoonCatData", "before moonCatData/loadMoonCatData");
      await store.dispatch('moonCatData/loadMoonCatData');
      logInfo("MoonCatData", "after moonCatData/loadMoonCatData");

      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 600000);
      }
    },
  },
  // beforeDestroy() {
  //   logInfo("MoonCatData", "beforeDestroy()");
  // },
  mounted() {
    logInfo("MoonCatData", "mounted()");
    this.reschedule = true;
    var t = this;
    setTimeout(function() {
      t.timeoutCallback();
    }, 1000);
  },
  destroyed() {
    logDebug("MoonCatData", "destroyed()");
    this.reschedule = false;
  },
};


const moonCatDataModule = {
  namespaced: true,
  state: {
    // collections: {},
    // collectionList: [],
    assets: {},
    touched: {},

    // nftData: null,
    // allTokenIds: null,
    // allParents: null,
    // allAttributes: null,
    // allAncientDNAs: null,

    // selectedId: null,
    // balances: null,

    params: null,
    executing: false,
  },
  getters: {
    // collections: state => state.collections,
    // collectionList: state => state.collectionList,
    assets: state => state.assets,
    // nftData: state => state.nftData,
    // allTokenIds: state => state.allTokenIds,
    // allParents: state => state.allParents,
    // allAttributes: state => state.allAttributes,
    // allAncientDNAs: state => state.allAncientDNAs,

    // selectedId: state => state.selectedId,
    // balances: state => state.balances,

    params: state => state.params,
  },
  mutations: {
    updateAssetsPreparation(state) {
      const keys = Object.keys(state.assets);
      for (let i = 0; i < keys.length; i++) {
        state.touched[keys[i]] = 0;
      }
    },
    updateAssetsCompletion(state) {
      for (let key in state.touched) {
        const value = state.touched[key];
        if (value == 0) {
          Vue.delete(state.collections[state.assets[key].contract].assets, key);
          if (Object.keys(state.collections[state.assets[key].contract].assets).length == 0) {
            Vue.delete(state.collections, state.assets[key].contract);
          }
          Vue.delete(state.assets, key);
        }
      }
      state.touched = {};
      // state.collectionList = Object.keys(state.collections).sort(function(a, b) {
      //   return (state.collections[a].name).localeCompare(state.collections[b].name);
      // });
      // for (const contract in state.collectionList) {
      //   const collection = state.collections[state.collectionList[contract]];
      //   collection.assetList = Object.keys(collection.assets).sort(function(a, b) {
      //     return (state.assets[a].name).localeCompare(state.assets[b].name);
      //   });
      // }

      // for (const contract in state.collectionList) {
      //   const collection = state.collections[state.collectionList[contract]];
      //   logInfo("moonCatDataModule", "mutations.updateAssetsCompletion() - collection: " + JSON.stringify(collection, null, 2));
      //   for (let assetKeyIndex in collection.assetList) {
      //     const assetKey = collection.assetList[assetKeyIndex];
      //     const asset = state.assets[assetKey];
      //     logInfo("moonCatDataModule", "mutations.updateAssetsCompletion()   - asset: " + JSON.stringify(asset));
      //   }
      // }
    },
    updateAssets(state, { owner, permissions, data }) {
      // logInfo("moonCatDataModule", "mutations.updateAssets(" + JSON.stringify(permissions) + ", " + JSON.stringify(data).substring(0, 100) + ")");
      if (data && data.assets && data.assets.length > 0) {
        for (let assetIndex = 0; assetIndex < data.assets.length; assetIndex++) {
          const asset = data.assets[assetIndex];
          let assetOwner = asset.owner.address.toLowerCase();
          if (assetOwner == ADDRESS0) {
            assetOwner = owner.toLowerCase();
            // console.log("assetOwner is " + ADDRESS0 + " so set to " + assetOwner);
          }
          const contract = asset.asset_contract.address.toLowerCase();
          // console.log("Asset: " + JSON.stringify(asset.name || '(no name)') + ", contract: " + contract);
          // console.log(JSON.stringify(asset, null, 2));
          let permission = permissions[assetOwner + ':' + contract];
          if (permission == null) {
            permission = permissions[assetOwner + ':' + null];
          }
          // console.log("  assetOwner: " + assetOwner + ", contract: " + contract + " => permission: " + JSON.stringify(permission));
          if (permission && (permission.permission == 1 || permission.permission == 2)) {
            var traits = [];
            for (let traitIndex = 0; traitIndex < asset.traits.length; traitIndex++) {
              const trait = asset.traits[traitIndex];
              // TODO: Sanitize
              traits.push({ type: trait.trait_type, value: trait.value });
            }
            var collection = state.collections[contract];
            if (collection == null) {
              Vue.set(state.collections, contract, {
                contract: contract,
                name: asset.collection.name,
                slug: asset.collection.slug,
                bannerImageUrl: asset.collection.banner_image_url,
                imageUrl: asset.collection.image_url,
                externalUrl: asset.collection.external_url,
                assets: {},
                assetList: []
              });
              collection = state.collections[contract];
              // console.log("New collection: " + JSON.stringify(collection));
            }
            const key = contract + "." + asset.token_id;
            state.touched[key] = 1;
            // console.log(JSON.stringify(asset));
            var record = {
              key: key,
              permission: permission.permission,
              curation: permission.curation,
              contract: contract,
              tokenId: asset.token_id,
              owner: assetOwner,
              name: asset.name || '(null)',
              imageUrl: asset.image_url,
              externalLink: asset.external_link,
              permalink: asset.permalink,
              traits: traits
            }
            Vue.set(state.assets, key, record);
            Vue.set(state.collections[contract].assets, key, true);
            // console.log(JSON.stringify(record, null, 2));
          }
        }
        state.collectionList = Object.keys(state.collections).sort(function(a, b) {
          return ('' + state.collections[a].name).localeCompare('' + state.collections[b].name);
        });
        for (const contract in state.collectionList) {
          const collection = state.collections[state.collectionList[contract]];
          collection.assetList = Object.keys(collection.assets).sort(function(a, b) {
            return ('' + state.assets[a].name).localeCompare('' + state.assets[b].name);
          });
        }
      }
    },
    // updateNFTData(state, nftData) {
    //   // logInfo("moonCatDataModule", "mutations.updateNFTData(" + JSON.stringify(nftData) + ")");
    //   state.nftData = nftData;
    //   if (state.nftData == null) {
    //     state.allTokenIds = null;
    //     state.allParents = null;
    //     state.allAttributes = null;
    //     state.allAncientDNAs = null;
    //   } else {
    //     const allParents = {};
    //     const allAttributes = {};
    //     const allAncientDNAs = {};
    //     for (let tokenId in Object.keys(state.nftData.tokens)) {
    //       const token = state.nftData.tokens[tokenId];
    //       for (let parentIndex in token.parents) {
    //         const parent = token.parents[parentIndex];
    //         if (allParents[parent] === undefined) {
    //           allParents[parent] = 1;
    //         }
    //       }
    //       for (let attributeIndex in token.attributes) {
    //         const attribute = token.attributes[attributeIndex];
    //         if (allAttributes[attribute] === undefined) {
    //           allAttributes[attribute] = 1;
    //         }
    //       }
    //       for (let ancientDNAIndex in token.ancientDNA) {
    //         let ancientDNA = token.ancientDNA[ancientDNAIndex];
    //         if (allAncientDNAs[ancientDNA] === undefined) {
    //           allAncientDNAs[ancientDNA] = 1;
    //         }
    //       }
    //     }
    //     state.allTokenIds = Object.keys(state.nftData.tokens).sort(function(a, b) { return a - b; });
    //     state.allParents = Object.keys(allParents).sort();
    //     state.allAttributes = Object.keys(allAttributes).sort();
    //     state.allAncientDNAs = Object.keys(allAncientDNAs).sort();
    //   }
    // },
    // updateSelectedId(state, selectedId) {
    //   state.selectedId = selectedId;
    //   logDebug("moonCatDataModule", "updateSelectedId('" + JSON.stringify(selectedId) + "')")
    // },
    // updateBalances(state, balances) {
    //   state.balances = balances;
    //   logDebug("moonCatDataModule", "updateBalances('" + JSON.stringify(balances) + "')")
    // },
    // updateParams(state, params) {
    //   state.params = params;
    //   logDebug("moonCatDataModule", "updateParams('" + params + "')")
    // },
    // updateExecuting(state, executing) {
    //   state.executing = executing;
    //   logDebug("moonCatDataModule", "updateExecuting(" + executing + ")")
    // },
  },
  actions: {
    async loadMoonCatData(context) {
      logInfo("moonCatDataModule", "actions.loadMoonCatData()");

      const chunkSize = 5; // 500
      const DELAY = 1000;
      const delay = ms => new Promise(res => setTimeout(res, ms));

      for (let i = 0; i < CATIDS.length && i < 5; i += chunkSize) {
        const slice = CATIDS.slice(i, i + chunkSize);
        // logDebug("NFTPostcard", "loadCatData() slice: " + JSON.stringify(slice));
        try {
          // logDebug("NFTPostcard", "loadCatData() url: " + "https://api.mooncat.community/traits/" + catId);
          const requests = slice.map((catId) => fetch("https://api.mooncat.community/traits/" + catId));
          // logDebug("NFTPostcard", "loadCatData() url: " + "https://api.mooncat.community/contract-details/" + catId);
          // const requests = slice.map((catId) => fetch("https://api.mooncat.community/contract-details/" + catId));
          const responses = await Promise.all(requests);
          const errors = responses.filter((response) => !response.ok);
          if (errors.length > 0) {
            throw errors.map((response) => Error(response.statusText));
          }
          const json = responses.map((response) => response.json());
          const data = await Promise.all(json);
          const t = this;
          data.forEach((datum) => {
            console.table(datum);
            // Vue.set(t.traitData, datum.details.catId, datum);
            // logDebug("NFTPostcard", "loadCatData() rescueIndex: " + datum.details.rescueIndex);
            // logDebug("NFTPostcard", "loadCatData() datum: " + JSON.stringify(datum, null, 2));
            // logDebug("NFTPostcard", "loadCatData() datum: " + JSON.stringify(t.traitData[datum.details.rescueIndex], null, 2));
          });
        }
        catch (errors) {
          console.table(errors);
          // logError("NFTPostcard", "loadCatData() errors: " + JSON.stringify(errors, null, 2));
          // errors.forEach((error) => console.error(error));
        }
        await delay(DELAY);
      }

      var db0 = new Dexie("MoonCatDB");
      db0.version(1).stores({
        apiData: '&rescueIndex,catId,timestamp'
      });
      await db0.apiData.bulkPut([
        {rescueIndex: 0, catId: "0x12345678", timestamp: 1},
        {rescueIndex: 1, catId: "0x23456789", timestamp: 2},
        {rescueIndex: 2, catId: "0x34567890", timestamp: 3},
        {rescueIndex: 3, catId: "0x45678901", timestamp: 4},
        {rescueIndex: 4, catId: "0x56789012", timestamp: 5},
        {rescueIndex: 5, catId: "0x67890123", timestamp: 6}
      ]).then (function(){
        return db0.apiData.get(3);
      }).then(function (item) {
        logInfo("moonCatDataModule", "loadMoonCatData() - timestamp: " + item.timestamp);
      }).catch(function(error) {
         logError("moonCatDataModule", "loadMoonCatData() - error: " + error);
      });

      const data = await db0.apiData.toArray();
      logInfo("moonCatDataModule", "loadMoonCatData() Dexie - data: " + JSON.stringify(data));

      // const defaultRegistryEntries = [
      //   ["0x00000217d2795F1Da57e392D2a5bC87125BAA38D", "0x00000217d2795F1Da57e392D2a5bC87125BAA38D"],
      //   [null, "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"],
      //   [2, 1],
      //   [1, 1],
      // ];
      //
      // const owners = {};
      // const permissions = {};
      // const assets = {};
      // let i;
      // for (i = 0; i < defaultRegistryEntries[0].length; i++) {
      //   const owner = defaultRegistryEntries[0][i].toLowerCase();
      //   const contract = defaultRegistryEntries[1][i] == null ? null : defaultRegistryEntries[1][i].toLowerCase();
      //   const permission = defaultRegistryEntries[2][i];
      //   const curation = defaultRegistryEntries[3][i];
      //
      //   if (owners[owner] == null) {
      //     owners[owner] = [contract];
      //   } else {
      //     owners[owner].push(contract);
      //   }
      //   permissions[owner + ':' + contract] = { permission: permission, curation: curation };
      // }
      // logDebug("moonCatDataModule", "actions.loadMoonCatData() - permissions: " + JSON.stringify(permissions));
      //
      // context.commit('updateAssetsPreparation');
      // for (const [owner, ownersContracts] of Object.entries(owners)) {
      //   // console.log(owner, ownersContracts);
      //   let hasNull = false;
      //   for (let i = 0; i < ownersContracts.length; i++) {
      //     let contract = ownersContracts[i];
      //     if (contract == null) {
      //       hasNull = true;
      //     }
      //     // console.log(" - " + contract);
      //   }
      //   const PAGESIZE = 50; // Default 20, max 50
      //   const DELAY = 1000; // Millis
      //   const delay = ms => new Promise(res => setTimeout(res, ms));
      //   // Do all
      //   if (hasNull) {
      //     // console.log("Retrieve all by owner %s", owner);
      //     // this.assets = [];
      //     // await delay(DELAY);
      //     let completed = false;
      //     let page = 0;
      //     while (!completed) {
      //       const offset = PAGESIZE * page;
      //       const url = "https://api.opensea.io/api/v1/assets?owner=" + owner + "&order_direction=desc&limit=" + PAGESIZE + "&offset=" + offset;
      //       const data = await fetch(url).then(response => response.json());
      //       if (!data.assets || data.assets.length < PAGESIZE) {
      //         completed = true;
      //       }
      //       page++;
      //       await delay(DELAY);
      //     }
      //   } else {
      //     // Do individually
      //     for (let i = 0; i < ownersContracts.length; i++) {
      //       const contract = ownersContracts[i];
      //       // console.log("Retrieve all by owner %s contract %s", owner, contract);
      //       let completed = false;
      //       let page = 0;
      //       while (!completed) {
      //         const offset = PAGESIZE * page;
      //         const url = "https://api.opensea.io/api/v1/assets?owner=" + owner + "&asset_contract_address=" + contract + "&order_direction=desc&limit=" + PAGESIZE + "&offset=" + offset;
      //         logInfo("moonCatDataModule", "actions.loadMoonCatData() owner and contract url:" + url);
      //         const data = await fetch(url).then(response => response.json());
      //         context.commit('updateAssets', { owner, permissions, data });
      //         if (!data.assets || data.assets.length < PAGESIZE) {
      //           completed = true;
      //         }
      //         page++;
      //         await delay(DELAY);
      //       }
      //     }
      //   }
      //   context.commit('updateAssetsCompletion');
      // }
    },
    // updateNFTData(context, nftData) {
    //   context.commit('updateNFTData', nftData);
    // },
    // updateSelectedId(context, selectedId) {
    //   logInfo("moonCatDataModule", "actions.updateSelectedId(" + JSON.stringify(selectedId) + ")");
    //   context.commit('updateSelectedId', selectedId);
    // },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count }) {
      const powerOn = store.getters['connection/powerOn'];
      const connected = store.getters['connection/connected'];
      const networkUpdated = store.getters['connection/networkUpdated'];
      const blockUpdated = store.getters['connection/blockUpdated'];
      const coinbaseUpdated = store.getters['connection/coinbaseUpdated'];
      const coinbase = store.getters['connection/coinbase'];

      logInfo("moonCatDataModule", "execWeb3() start[" + count + "] rootState.route.params: " + JSON.stringify(rootState.route.params) + ", networkUpdated: " + networkUpdated + ", blockUpdated: " + blockUpdated + ", coinbaseUpdated: " + coinbaseUpdated+ ", powerOn: " + powerOn + ", connected: " + connected + ", coinbase: " + coinbase);
      if (coinbase != null) {
        if (!state.executing) {
          commit('updateExecuting', true);
          logInfo("moonCatDataModule", "execWeb3() executing[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkUpdated + ", " + blockUpdated + ", " + coinbaseUpdated + "]");

          var paramsChanged = false;
          if (state.params != rootState.route.params.param) {
            logDebug("moonCatDataModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
            paramsChanged = true;
            commit('updateParams', rootState.route.params.param);
          }

          if (networkUpdated || blockUpdated || coinbaseUpdated || paramsChanged) {
            const nftAddress = "token.zombiebabies.eth"; // state.nftData.nftAddress;
            logDebug("moonCatDataModule", "execWeb3() nftAddress: " + nftAddress);

            logInfo("moonCatDataModule", "execWeb3() coinbase: " + coinbase);
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const moonCatRescue = new ethers.Contract(MOONCATRESCUEADDRESS, MOONCATRESCUEABI, provider);
            const totalSupply = await moonCatRescue.totalSupply();
            logInfo("moonCatDataModule", "execWeb3() moonCatRescue.totalSupply: " + totalSupply.toString());
            const rescueIndex = await moonCatRescue.rescueIndex();
            logInfo("moonCatDataModule", "execWeb3() moonCatRescue.rescueIndex: " + rescueIndex.toString());
            // const catIds = await moonCatRescue.getCatIds();
            // logInfo("moonCatDataModule", "execWeb3() moonCatRescue.catIds: " + JSON.stringify(catIds));
            // console.log(JSON.stringify(catIds));

            const acclimatedMoonCatRescue = new ethers.Contract(ACCLIMATEDMOONCATADDRESS, ACCLIMATEDMOONCATABI, provider);
            const totalSupplyAcclimated = await acclimatedMoonCatRescue.totalSupply();
            logInfo("moonCatDataModule", "execWeb3() acclimatedMoonCatRescue.totalSupply: " + totalSupplyAcclimated.toString());

            const wrappedMoonCatRescue = new ethers.Contract(WRAPPEDMOONCATADDRESS, WRAPPEDMOONCATABI, provider);
            const totalSupplyWrapped = await wrappedMoonCatRescue.totalSupply();
            logInfo("moonCatDataModule", "execWeb3() wrappedMoonCatRescue.totalSupply: " + totalSupplyWrapped.toString());
            const _tokenIDToCatID = await wrappedMoonCatRescue._tokenIDToCatID(0);
            logInfo("moonCatDataModule", "execWeb3() wrappedMoonCatRescue._tokenIDToCatID: " + _tokenIDToCatID.toString());

          }
          commit('updateExecuting', false);
          logDebug("moonCatDataModule", "execWeb3() end[" + count + ", " + networkUpdated + ", " + blockUpdated + ", " + coinbaseUpdated + "]");
        } else {
          logDebug("moonCatDataModule", "execWeb3() already executing[" + count + ", " + networkUpdated + ", " + blockUpdated + ", " + coinbaseUpdated + "]");
        }
      }
    },
  },
  // mounted() {
  //   logInfo("moonCatDataModule", "mounted() $route: " + JSON.stringify(this.$route.params));
  // },
};

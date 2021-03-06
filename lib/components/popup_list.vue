<template>
<div class='o-pl-wrapper u-relative'
  @keydown.up.prevent='scrollUpItems'
  @keydown.down.prevent='scrollDownItems'
  @keydown.enter.prevent='selectItem($event, hIndex)'> 

  <input type='text' :name='fieldName' :id='fieldName'
    v-bind:class="fieldClass.join(' ')"
    @click='onInputClick'
    :data-ori-value='oriValue'
    v-model='value' readonly/>

  <div class="o-pl u-small-font" v-show='isPopup'>
    <div class="o-pl__search" v-if="hasSearchBar">
      <input type="text" ref='searchBar' v-model="keyword" @input='searchItems'/>
    </div>

    <ul class="o-pl__items u-nav-list" ref='itemsList' v-show='items.length > 0'
      v-bind:style="{ height: itemsListHeight + 'px' }">
      <li v-for="(item, idx) in items" class='o-pl__item'
          v-on:click="selectItem($event, idx)"
          v-bind:style="{ height: itemHeight + 'px' }"
          v-bind:class="{ 'is-active': idx == hIndex }">
        {{ item }}
      </li>
    </ul>
  </div>
</div>
</template>

<script>
  var axios = require('axios');
  var util = require('../util');

  module.exports = {
    data: function() {
      return {
        oriValue: this.oriFieldVal,
        value: this.oriFieldVal,
        keyword: '', // search keyword
        items: this.initItems, // displayed items after search
        allItems: this.initItems,
        hIndex: 0, // highlight index of items
        showStartIdx: 0, // starting index of items to display
        isPopup: false,
      }
    },

    computed: {
      showEndIdx: function() {
        return this.showStartIdx + Math.min(this.items.length, this.minScrollItemCnt);
      },

      hasSearchBar: function() {
        return this.allItems.length > this.minScrollItemCnt;
      },

      itemsListHeight: function() {
        return Math.min(this.items.length, this.minScrollItemCnt) * this.itemHeight;
      }
    },

    props: {
      fieldName: {
        type: String,
        required: true
      },

      itemHeight: {
        type: Number,
        default: 22
      },

      // original input value
      oriFieldVal: {
        type: String,
        default: ''
      },

      fieldClass: {
        type: Array,
        default: function() { return []; },
      },

      /*
       * initial items in the popup list
       * if isListFixed is true, we must provide items at initialization
       * or provide itemsInitUrl to pre-fetch it
       */
      initItems: {
        type:    Array,
        default: function() { return []; },
      },

      /*
       * we use this url to pre-fetch items
       */
      itemsInitUrl: {
        type:    String,
        default: ''
      },

      /*
       * min items count to show search bar
       */
      minScrollItemCnt: {
        type:    Number,
        default: 10
      }
    },

    methods: {
      onInputClick: function(evt) {
        this.isPopup = true;

        if (this.hasSearchBar) {
          this.$nextTick(function() {
            this.$refs.searchBar.focus();
          });
        }
      },

      searchItems: function() {
        var me = this;

        this.items = this.allItems.filter(function(item) {
          return item.indexOf(me.keyword) != -1; 
        });

        this.hIndex = 0;
        this.showStartIdx = 0;  // clear show range
      },

      scrollDownItems: function() {
        if (this.hIndex >= this.items.length - 1) {
          return;
        }

        this.hIndex++;

        if (this.hIndex >= this.showEndIdx) {
          this.$refs.itemsList.scrollTop += this.itemHeight;
          this.showStartIdx++;
        }
      },

      scrollUpItems: function() {
        if (this.hIndex <= 0) {
          return;
        }

        this.hIndex--;

        if (this.hIndex < this.showStartIdx) {
          this.$refs.itemsList.scrollTop -= this.itemHeight;
          this.showStartIdx--;
        }
      },

      selectItem: function(evt, idx) {
        if (0 <= idx && idx < this.items.length) {
          this.value = this.items[idx];
          this.isPopup = false;
          this.$emit('change', this.oriValue, this.value, this.fieldName);
        }
      },

      reset: function() {
        this.keyword = '';
        this.items = this.allItems;
        this.hIndex = 0;
        this.showStartIdx = 0;
        this.$refs.itemsList.scrollTop = 0;
      }
    },

    watch: {
      isPopup: function(nv) {
        if (!nv) {
          this.reset();
        } else {
          util.closePopOnClkOut.call(this);
        }
      }
    },

    mounted: function() {
      if (this.initItems.length)
        return;

      var me = this;

      if (this.itemsInitUrl) {
        axios.get(this.itemsInitUrl).then(function(response) {
          var data = response.data;

          me.allItems = data.items;
          me.items = data.items;
        });
      }
    }
  };
</script>

<style lang="sass" src='../sass/_popup_list.scss'></style>

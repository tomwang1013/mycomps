<template>
  <span class='o-ss-wrapper u-relative'
    @keydown.up.prevent='scrollUpItems'
    @keydown.down.prevent='scrollDownItems'
    @keydown.enter.prevent='selectItem($event, hIndex)'> 

    <input type='text' :name='fieldName' :id='fieldName'
      v-bind:class="fieldClass.join(' ')" v-model.trim='keyword' @input='searchItems'/>

    <ul class="o-search-sugg u-nav-list u-small-font" ref='itemsList' v-show='isPopup'>
      <li class="o-search-sugg__item" v-for='(item, idx) in items'
        v-on:click='selectItem($event, idx)'
        v-bind:class="{ 'is-active': idx == hIndex }">
        {{ item }}
      </li>
    </ul>
  </span>
</template>

<script>
  var util = require('../util');
  var axios = require('axios');

  module.exports = {
    name: 'search-suggestion',
    data: function() {
      return {
        keyword: '', // search keyword
        items: [], // displayed items after search
        hIndex: 0, // highlight index of items
        showStartIdx: 0, // starting index of items to display
        isPopup: false, // if the item list is shown
      }
    },

    computed: {
      showEndIdx: function() {
        return this.showStartIdx + Math.min(this.items.length, this.minScrollItemCnt);
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

      fieldClass: {
        type: Array,
        default: function() { return []; },
      },

      /*
       * min items count to show search bar
       */
      minScrollItemCnt: {
        type: Number,
        default: 10
      },

      searchUrl: {
        type: String,
        required: true
      }
    },

    methods: {
      searchItems: function() {
        var me = this;

        axios.get(this.searchUrl, {
          params: { kw: this.keyword }
        }).then(function(response) {
          var data = response.data;

          me.items = data.items;
          me.isPopup = me.items.length > 0;
          me.hIndex = 0;
          me.showStartIdx = 0;
        });
      },

      scrollDownItems: function() {
        if (!this.isPopup || this.hIndex >= this.items.length - 1) {
          return;
        }

        this.hIndex++;

        if (this.hIndex >= this.showEndIdx) {
          this.$refs.itemsList.scrollTop += this.itemHeight;
          this.showStartIdx++;
        }
      },

      scrollUpItems: function() {
        if (!this.isPopup || this.hIndex <= 0) {
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
          this.keyword = this.items[idx];
          this.isPopup = false;
        }
      }
    },

    watch: {
      isPopup: function(nv) {
        if (!nv) return;
        util.closePopOnClkOut.call(this);
      }
    }
  };
</script>

<style lang="sass" src='../sass/_search_suggestion.scss'></style>

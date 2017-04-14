<template>
  <div class='u-relative'>
    <!-- original form input -->
    <input type='hidden' :name='inputId' :id='inputId' :value="currentLabels.join(',')" class='o-fm-ctl'></input>

    <!-- current labels -->
    <span class="o-labels-input" :class="{'is-active': isActive}">
      <template v-for="label in currentLabels">
        <span class="o-labels-input__lab-wrapper">
          <span>{{ label }}</span>
          <span class="fa fa-times o-labels-input__lab-del" aria-hidden="true" :label="label" :data-label="label" @click="removeFromCurLabels"></span>
        </span>
      </template>
      <input class="o-labels-input__input" ref="labInput" @focus="focusInput" @blur="blurInput" @input="searchLabels" @keydown.enter.prevent="addLabel" v-model.trim="inputLabel"></input>
    </span>

    <!-- popup matching labels -->
    <div class="o-labels-popup u-small-font" v-show="isPopup">
      <ul class="u-nav-list">
        <template v-for="label in matchingLabels">
          <li class="o-labels-popup__item" :data-label="label.name" @click="addToCurLabels">
            <span class='o-labels-popup__name'>{{ label.name }}</span>
            <span class='o-labels-popup__cnt'>× {{ label.ques_cnt }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
  var axios = require('axios');
  var _ = require('lodash');
  var util = require('../util');

  module.exports = {
    data: function() {
      return {
        currentLabels: !this.initLabels ? [] : this.initLabels.split(','),
        matchingLabels: [],
        isActive: false,
        isPopup: false,
        inputLabel: ''
      }
    },

    watch: {
      isPopup: function(nv) {
        if (!nv) return;
        util.closePopOnClkOut.call(this);
      }
    },

    props: {
      inputId:    { required: true },
      searchUrl:  { required: true },
      addUrl:     { required: true },
      initLabels: String
    },

    methods: {
      focusInput: function(evt) {
        this.isActive = true;
      },

      blurInput: function(evt) {
        this.inputLabel = '';
        this.isActive = false;
      },

      // instantly search matching labels when input label prefix
      searchLabels: function(evt) {
        if (!this.inputLabel) {
          this.isPopup = false;
          return;
        }

        var me = this;

        axios.get(this.searchUrl, {
          params: { name: me.inputLabel }
        }).then(function(response) {
          var data = response.data;

          if (data.error || !data.labels.length) {
            me.isPopup = false;
          } else {
            me.matchingLabels = data.labels;
            me.isPopup = true;
          }
        });
      },

      // add new label to remote server
      addLabel: function(evt) {
        var me = this;

        axios.post(this.addUrl, {
          name: me.inputLabel
        }).then(function(response) {
          var data = response.data;

          me.currentLabels.push(me.inputLabel);
          me.inputLabel = '';
        });
      },

      // remove a currently selected label
      removeFromCurLabels: function(evt) {
        var labelToRem = evt.target.dataset.label;
        this.currentLabels.splice(this.currentLabels.indexOf(labelToRem), 1);
        this.inputLabel = '';
        this.$refs.labInput.focus();
      },

      // add to current labels
      addToCurLabels: function(evt) {
        this.currentLabels.push(evt.currentTarget.dataset.label);
        this.inputLabel = '';
        this.$refs.labInput.focus();
      }
    }
  };
</script>

<style lang="sass" src='../sass/_input_labels.scss'></style>

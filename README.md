# mycomps
common vue components used in my personal projects, includes:

## `fa-rating`: font-awesome star rating

```pug
label(for='level') 难度：
fa-rating(
  field-name='level'
  initial-value=question.level
  v-bind:all-values="['0','1','2','3','4']")
```

[fa-rating](doc/fa-rating.png)

## `input-labels`: labels management in an text input

```pug
label(for='labels') 标签：
input-labels(input-id='labels'
             search-url='/qlabels/search'
             add-url='/qlabels'
             init-labels=question.labels.join(','))
```

[input-labels](doc/input-labels.png)

## `popup-list`: popup search list

```pug
label(for='university') 学校名称：
popup-list(
  field-name='university'
  ref='university'
  v-if='initialized'
  v-bind:ori-field-val="oriValues['university']"
  v-bind:field-class="['o-fm-ctl']"
  v-bind:init-items='constants.universities'
  v-on:change='onChange')
```

[popup-list](doc/popup-list.png)

## `popup-overlay`: popup a dialog on an gray overlay

```pug
popup-overlay(v-on:ok='onOk' ref='po')
  span(slot='body') 删除后无法恢复，确定要删除这个问题吗？
```

[popup-overlay](doc/popup-overlay.png)

## `popup-tabs`: multiple-hierarchies tabs to select a value from the last tab

```pug
label(for='address') 工作地点：
popup-tabs( 
  field-name='address'
  field-class='o-fm-ctl-hr'
  v-bind:init-item=address
  v-bind:init-lables='initLables'
  v-bind:init-items='initItems')
```

[popup-tabs](doc/popup-tabs.png)

## `search_suggestion`: search suggestion input

```pug
label(for='company_name') 公司：
search-sugg(field-name='company_name'
            v-bind:field-class="['o-fm-ctl-hr']"
            search-url='/users/queryByCompanyName')
```

[search-suggetion](doc/search-suggestion.png)

More details please check the source code. It is easy to use.

import Vue from 'vue/dist/vue.runtime.common'
import weex from 'weex-vue-render'

weex.init(Vue)

import App from './App.vue';

new Vue({
    el: '#app',
    render: h => h(App),
    components: { App },
    template: '<App/>'
})

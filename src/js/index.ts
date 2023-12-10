import Vue, { h } from "vue";
import AppVue from "./components/App.vue";

import { FilesState } from "./core/states/FilesState";

declare module "vue" {
    interface ComponentCustomProperties {
        $files: typeof FilesState;
    }
}

Vue.prototype.$files = FilesState;

const app = new Vue({
    render() {
        return h(AppVue);
    }
});

app.$mount("#app");
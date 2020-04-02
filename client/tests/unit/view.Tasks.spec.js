// Unit test for views/Tasks.vue

// Libraries
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import localVue from "./setup";

// Components
import Tasks from '@/views/Tasks.vue';

// Utilities
import { shallowMount } from '@vue/test-utils';

describe('Tasks.vue', () => {
  let vuetify, router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter()
  });

  // Two simple test cases below

  it('has the right title', () => {
    //Shallow mount: child components get stubbed
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    const title = wrapper.find('h1.display-2')

    expect(title.text()).toBe('Tasks')
  });

  it("computes weekdays correctly", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    expect(wrapper.vm.mapWeekdayToInt("sunday")).toBe(0);
  });

});
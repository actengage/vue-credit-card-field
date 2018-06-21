import Vue from 'vue';
import { mount } from '@vue/test-utils';
import SampleComponent from '../src/Components/SampleComponent.vue';

describe('Components/SampleComponent.vue', () => {
    test('if component is a Vue instance', () => {
        expect(mount(SampleComponent, {
            propsData: {
                message: 'Test'
            }
        }).isVueInstance()).toBeTruthy();
    });

    test('to see if SampleComponent renders the message correctly', () => {
        const message = 'This is a test message!';
        const wrapper = mount(SampleComponent, {
            propsData: {
                message: message
            }
        });

        expect(wrapper.find('.message').text()).toBe(message);
    });
});

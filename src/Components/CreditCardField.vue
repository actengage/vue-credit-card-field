<template>

    <form-group class="credit-card-field" :class="{'has-brand': !!type}">
        <div class="credit-card-field-rows">
            <div class="credit-card-field-row">
                <input-field
                    v-model="card.name"
                    custom
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Name on card"
                />
            </div>

            <div class="credit-card-field-row">
                <input-field
                    v-card-number
                    v-validate:number
                    v-model="card.number"
                    :errors="currentErrors"
                    custom
                    id="number"
                    name="number"
                    label="Card Number"
                    placeholder="Credit Card Number"
                    @invalid="() => errors['number']"
                    @card-types.native="onCardTypeChange"
                />
                <div class="credit-card-icons">
                    <div class="credit-card-field-icon-wrapper">
                        <div class="credit-card-field-icon-card">
                            <div class="credit-card-field-icon-front">
                                <transition name="icon">
                                    <icon :key="type && type.type" :icon="[icon ? 'fab' : 'far', icon || 'credit-card']" :data-brand="type && type.niceType || 'unknown'" class="credit-card-field-icon" width="20" height="18"/>
                                </transition>
                            </div>
                            <div class="credit-card-field-icon-back">
                                <icon :icon="['fas', 'credit-card']" class="credit-card-field-icon" width="23.33" height="20"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="credit-card-field-row d-flex">
                <select-field
                    v-model="card.exp_month"
                    :errors="currentErrors"
                    custom
                    id="month"
                    name="month"
                    label="Month"
                    placeholder="Month"
                    class="credit-card-field-month">
                    <option v-for="i in 12" :key="i">{{ padZero(i, 2) }}</option>
                </select-field>

                <select-field
                    v-model="card.exp_year"
                    :errors="currentErrors"
                    custom
                    id="year"
                    name="year"
                    label="Year"
                    placeholder="Year"
                    class="credit-card-field-year">
                    <option v-for="i in years" :key="i">{{i}}</option>
                </select-field>

                <input-field
                    v-validate:cvc
                    v-model="card.cvc"
                    :errors="currentErrors"
                    :maxlength="code && code.size"
                    :label="code && code.name || 'CVC'"
                    :placeholder="code && code.name || 'CVC'"
                    custom
                    id="cvc"
                    name="cvc"
                    class="credit-card-field-cvc"
                />
                <input-field v-model="card.postalCode" label="Zip Code" placeholder="Zip Code" maxlength="5" class="credit-card-field-zip" custom />
            </div>
        </div>

        <slot/>

        <slot name="help">
            <help-text v-if="helpText" v-html="helpText" />
        </slot>

        <slot name="feedback">
            <form-feedback v-if="validFeedback" v-html="validFeedback" valid />
            <form-feedback v-if="invalidFeedback" v-html="invalidFeedback" invalid />
        </slot>

    </form-group>

</template>

<script>
import '../icons';
import Payment from 'payment';
import { format } from '../Helpers';
import Validate from '../Directives/Validate';
import CardNumber from '../Directives/CardNumber';
import Variant from 'vue-interface/src/Mixins/Variant';
import HelpText from 'vue-interface/src/Components/HelpText';
import FormControl from 'vue-interface/src/Mixins/FormControl';
import FormGroup from 'vue-interface/src/Components/FormGroup';
import InputField from 'vue-interface/src/Components/InputField';
import MergeClasses from 'vue-interface/src/Mixins/MergeClasses';
import SelectField from 'vue-interface/src/Components/SelectField';
import FormFeedback from 'vue-interface/src/Components/FormFeedback';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    name: 'CreditCardField',

    mixins: [
        MergeClasses,
        Variant,
        FormControl
    ],

    components: {
        Icon,
        HelpText,
        FormGroup,
        InputField,
        SelectField,
        FormFeedback,
        ActivityIndicator
    },

    props: {

        activity: {
            type: Boolean,
            default: false
        }

    },

    directives: {
        Validate,
        CardNumber
    },

    watch: {

        ['card.number'](value) {
            this.card.number = format(value.replace(/[^\d\/]/g, ''), this.type);
        }

    },

    computed: {

        years() {
            const years = [], year = new Date().getFullYear();

            for(let i = year; i < year + 15; i++) {
                years.push(i);    
            }

            return years;
        }

    },

    methods: {

        padZero(num, places) {
            const zero = places - num.toString().length + 1;

            return Array(+(zero > 0 && zero)).join('0') + num;
        },

        onCardTypeChange({ types }) {
            const [ type ] = types;

            const ICONS = {
                'american-express': 'amex',
                'diners-club': 'dinersclub',
            };

            this.type = type;
            this.code = type && type.code;
            this.icon = type && `cc-${(ICONS[type.type] || type.type)}`;
            this.$set(this.card, 'brand', type ? type.type : null);
        }

    },

    data() {
        return {
            icon: null,
            code: null,
            type: null,
            currentErrors: this.errors || {},
            card: {
                name: null,
                brand: null,
                number: null,
                cvc: null,
                expiration: null,
                postalCode: null
            }
        }
    }

};
</script>

<style lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~vue-interface/src/scss/custom-fields';

.credit-card-field {
    border-radius: .25em;
    border: 1px solid $gray-300;
    box-shadow: 0 0 .5em $gray-100;
    background: lighten($gray-100, 2%);

    &.has-errors {
        border-color: $danger;

        .is-invalid.custom-input-field .custom-control,
        .is-invalid.custom-select {
            color: $danger;
            background-color: lighten($danger, 45%);
        }
        
    }

    .credit-card-field-row {
        position: relative;

        &:first-child .form-group-inner,
        &:first-child .custom-control {
            border-radius: .25em .25em 0 0;
        }

        &:last-child {
            & > :not(:last-child) {
                border-right: 1px solid $gray-300;
            }

            & > :first-child .form-group-inner,
            & > :first-child .custom-control {
                border-radius: 0 0 0 .25em;
            }

            & > :last-child .form-group-inner,
            & > :last-child .custom-control {
                border-radius: 0 0 .25em 0;
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid $gray-200;
        }

        &.has-error:not(:last-child) {
            border-bottom: 1px solid $danger;
        }

        &.d-flex .form-group {
            // border-color: $danger;
        }

        &.d-flex > div {
            flex: 1;
        }

        .has-focus {
            position: relative;
            z-index: 5;
        }

        .form-group {
            margin-bottom: 0;
        }

        .invalid-feedback {
            display: none;
        }
    }

    .custom-input-field .custom-control,
    .custom-select-field .form-group-inner {
        border: 0;
        border-radius: 0;
        background: none;
        

        &:after {
            border-left: none;
        }
    }

    .custom-select,
    .custom-select:active,
    .custom-select:focus,
    .custom-select.is-valid,
    .custom-select.is-invalid {
        &:focus {
            box-shadow: none;
        }
    }

    .custom-select-field > label {
        z-index: 2;
    }

    .credit-card-field-icon-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 2.5em;
        height: 100%;
        z-index: 2;
        background: white;
    }

    .credit-card-field-icon-card {
        position: absolute;
        left: 0;
        top: 0;
        width: 2.5em;
        height: 100%;
        transition: transform 0.4s ease-in-out;
        transform-style: preserve-3d;

        .credit-card-field-icon {
            height: 100%;
            width: 2.5em;
            transition: .33s;
            padding: 0 .5em;
            position: absolute;
            top: 0;
            left: 0;
        }

        .credit-card-field-icon-back,
        .credit-card-field-icon-front .credit-card-field-icon {
            opacity: 1;
            transform: scale(1);
        }
        
        /* hide back of pane during swap */
        .credit-card-field-icon-front,
        .credit-card-field-icon-back {
            backface-visibility: hidden;
            position: absolute;
            height: 100%;
            width: 2.5em;
            top: 0;
            left: 0;
        }

        .credit-card-field-icon-front {
            z-index: 3;
            transform: rotateY(0deg);
        }

        .credit-card-field-icon-back {
            transform: rotateY(180deg);
        }

        .credit-card-field-icon {
            transition: 10s;
        }
    }
}
</style>

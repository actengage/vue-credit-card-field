<template>

    <div class="credit-card-field" :class="{'has-brand': !!type, 'has-errors': hasErrors, [`is-focused-${focused}`]: focused}">

        <form-group>
            <div class="credit-card-field-rows">
                <div class="credit-card-field-row" :class="{'has-error': currentErrors.number}">
                    <input-field
                        v-card-number
                        v-model="card.numberFormatted"
                        v-bubble:blur="onBlur"
                        v-bubble:focus="() => focused = 'number'"
                        v-validate:number="validated.number"
                        :disabled="activity"
                        :error="error"
                        :errors="currentErrors"
                        custom
                        id="number"
                        ref="number"
                        name="number"
                        label="Card Number"
                        placeholder="Credit Card Number"
                        @validate="onValidate"
                        @card-types.native="onCardTypeChange"
                        @valid.native="() => onValid('number', showName ? 'name' : 'expMonth')">
                        <template #activity>
                            <animate-css name="fade">
                                <activity-indicator v-if="activity" key="activity" :size="size" />
                                <div v-else key="icons" class="credit-card-icons">
                                    <animate-css mode="out-in" name="flip" y>
                                        <div v-if="focused !== 'cvc'" key="front" class="credit-card-field-icon-card">
                                            <icon :icon="[icon ? 'fab' : 'far', icon || 'credit-card']" :data-brand="type && type.niceType || 'unknown'" class="credit-card-field-icon" width="20" height="18"/>
                                        </div>                                
                                        <div v-else key="back" class="credit-card-field-icon-card">
                                            <icon :icon="['fas', 'credit-card']" class="credit-card-field-icon" width="23.33" height="20"/>
                                        </div>                                
                                    </animate-css>
                                </div>                          
                            </animate-css>
                        </template>
                    </input-field>
                </div>
                
                <animate-css name="fade">
                    <div v-if="showSecurityFields && showName" class="credit-card-field-row" :class="{'has-error': currentErrors.name}">
                        <input-field
                            v-model="card.name"
                            v-bubble:focus="() => focused = 'name'"
                            v-validate:name="validated.name"
                            :disabled="activity"
                            :errors="currentErrors"
                            custom
                            id="name"
                            ref="name"
                            name="name"
                            label="Name"
                            placeholder="Name on Card"
                            class="credit-card-field-name"
                        />
                    </div>
                </animate-css>
                <animate-css name="fade">
                    <div v-if="showSecurityFields" class="credit-card-field-row d-flex" :class="{'has-error': currentErrors.expMonth || currentErrors.expYear || currentErrors.cvc || currentErrors.zip}">
                        <select-field
                            v-bubble
                            v-model="card.expMonth"
                            v-bubble:blur="onBlur"
                            v-bubble:focus="() => focused = 'expMonth'"
                            v-validate:month="validated.expMonth"
                            :disabled="activity"
                            :errors="currentErrors"
                            custom
                            id="expMonth"
                            ref="expMonth"
                            name="expMonth"
                            label="Month"
                            placeholder="Month"
                            class="credit-card-field-month"
                            @valid.native="() => onValid('expMonth', 'expYear')">
                            <option v-for="i in 12" :key="i">{{ padZero(i, 2) }}</option>
                        </select-field>

                        <select-field
                            v-bubble
                            v-model="card.expYear"
                            v-bubble:blur="onBlur"
                            v-bubble:focus="() => focused = 'expYear'"
                            v-validate:year="validated.expYear"
                            :disabled="activity"
                            :errors="currentErrors"
                            custom
                            id="expYear"
                            ref="expYear"
                            name="expYear"
                            label="Year"
                            placeholder="Year"
                            class="credit-card-field-year"
                            @valid.native="() => onValid('expYear', 'cvc')">
                            <option v-for="i in years" :key="i">{{i}}</option>
                        </select-field>

                        <input-field
                            v-bubble
                            v-model="card.cvc"
                            v-bubble:blur="onBlur"
                            v-bubble:focus="() => focused = 'cvc'"
                            v-validate:cvc="validated.cvc"
                            :disabled="activity"
                            :errors="currentErrors"
                            :maxlength="code && code.size"
                            :label="code && code.name || 'CVC'"
                            :placeholder="code && code.name || 'CVC'"
                            :validator="() => type && type.code.size"
                            custom
                            id="cvc"
                            ref="cvc"
                            name="cvc"
                            class="credit-card-field-cvc"
                            @valid.native="() => onValid('cvc', 'zip')"
                        />

                        <input-field
                            v-if="showZip"
                            v-bubble
                            v-model="card.zip"
                            v-bubble:blur="onBlur"
                            v-bubble:focus="() => focused = 'zip'"
                            v-validate:zip="validated.zip"
                            :disabled="activity"
                            :errors="currentErrors"
                            :validator="{minLength: 5}"
                            custom
                            id="zip"
                            ref="zip"
                            name="zip"
                            maxlength="5"
                            label="Zip Code"
                            placeholder="Zip Code"
                            class="credit-card-field-zip"
                            @valid.native="() => onValid('zip')"
                        />
                    </div>
                </animate-css>
            </div>

            <slot/>

        </form-group>

        <slot name="help">
            <help-text v-if="helpText" v-html="helpText" />
        </slot>

        <slot name="feedback">
            <form-feedback v-if="validFeedback" v-html="validFeedback" valid />
            <form-feedback v-if="invalidFeedback" v-html="invalidFeedback" invalid />
        </slot>

    </div>

</template>

<script>
import '../icons';
import Payment from 'payment';
import { format, input } from '../Helpers';
import Bubble from '../Directives/Bubble';
import Validate from '../Directives/Validate';
import CardNumber from '../Directives/CardNumber';
import Variant from 'vue-interface/src/Mixins/Variant';
import HelpText from 'vue-interface/src/Components/HelpText';
import { pickBy } from 'vue-interface/src/Helpers/Functions';
import FormControl from 'vue-interface/src/Mixins/FormControl';
import FormGroup from 'vue-interface/src/Components/FormGroup';
import InputField from 'vue-interface/src/Components/InputField';
import MergeClasses from 'vue-interface/src/Mixins/MergeClasses';
import AnimateCss from 'vue-interface/src/Components/AnimateCss';
import SelectField from 'vue-interface/src/Components/SelectField';
import FormFeedback from 'vue-interface/src/Components/FormFeedback';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

const ICONS = {
    'american-express': 'amex'
};

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
        AnimateCss,
        InputField,
        SelectField,
        FormFeedback,
        ActivityIndicator
    },

    props: {

        activity: {
            type: Boolean,
            default: false
        },

        name: String,

        number: [Number, String],

        expMonth: String,

        expYear: String,

        cvc: String,

        zip: String,
        
        showName: {
            type: Boolean,
            default() {
                return !!this.name;
            }
        },

        showZip: {
            type: Boolean,
            default() {
                return !!this.zip;
            }
        }

    },

    directives: {
        Bubble,
        Validate,
        CardNumber
    },

    watch: {

        card: {
            deep: true,
            handler(value) {
                this.$emit('input', Object.assign(this.blankCard(), value));
            }
        },

        validated: {
            deep: true,
            handler(value, oldValue) {
                const entries = Object.entries(value);

                entries.forEach(([key, value]) => {
                    this.$set(this.currentErrors, key, value === false ? (this.currentErrors[key] || true) : false);
                });

                if(this.showSecurityFields) {
                    this.$nextTick(() => {
                        if(this.totalFields === this.totalValidFields) {
                            this.isValid = true;
                        }
                        else if(this.totalInvalidFields) {
                            this.isValid = false;
                        }
                        else {
                            this.isValid = null;
                        }
                    });
                }
            }
        },

        ['card.number'](value) {
            this.card.number = value ? value.replace(/\s/g, '') : value;
        },

        ['card.numberFormatted'](value) {
            this.$set(this.card, 'number', value);
            this.$set(this.card, 'numberFormatted', format(value, this.type));
        },

        ['card.expMonth'](value) {
            this.updateExpiration();
        },

        ['card.expYear'](value) {
            this.updateExpiration();
        },

        ['validated.number'](value, old) {
            if(!this.showSecurityFields && value === true) {
                this.showSecurityFields = true;
            }
        },

        isValid(value) {
            if(value === true) {
                this.dispatch('valid');
            }
            else if(value === false) {
                this.dispatch('invalid');
            }
        },

        showSecurityFields(value) {
            this.$nextTick(() => {
                const field = this.showName ? 'name' : 'expMonth';

                this.$refs[field] && this.$refs[field].focus();
            });
        }

    },

    computed: {

        invalidFeedback() {
            return this.error || Object.entries(this.currentErrors)
                .filter(([key, value]) => !!value && (typeof value === 'string'))
                .map(([key, value]) => value.toString())
                .join('<br>');
        },

        isPotentiallyValid() {
            return this.isValid !== false;
        },

        totalFields() {
            return Object.entries(this.$refs).length
        },

        totalValidFields() {
            return Object.entries(this.validated)
                .filter(([key, value]) => value === true)
                .length;
        },

        totalInvalidFields() {
            return Object.entries(this.validated)
                .filter(([key, value]) => value === false)
                .length;
        },

        hasErrors() {
            return !!this.error || !!Object.entries(this.currentErrors)
                .filter(([key, value]) => !!value)
                .length;
        },

        years() {
            const years = [], year = new Date().getFullYear();

            for(let i = year; i < year + 15; i++) {
                years.push(i);    
            }

            return years;
        }

    },

    methods: {

        blankCard(defaultValues) {
            return pickBy(Object.assign({
                number: null,
                numberFormatted: null,
                expMonth: null,
                expYear: null,
                expiration: null,
                name: this.showName ? null : undefined,
                zip: this.showZip ? null : undefined,
            }, defaultValues || {}), value => value !== undefined);
        },

        dispatch(event) {
            this.$emit(event, {
                card: this.card,
                type: this.type,
                isValid: this.isValid,
                isPotentiallyValid: this.isPotentiallyValid,
                input: {
                    el: this.$el.querySelector(':focus'),
                    isValid: null,
                    isPotentiallyValid: null,
                }
            });
        },

        padZero(num, places) {
            const zero = places - num.toString().length + 1;

            return Array(+(zero > 0 && zero)).join('0') + num;
        },

        updateExpiration() {
            if(this.card.expMonth && this.card.expYear) {
                this.$set(this.card, 'expiration', `${this.card.expMonth} / ${this.card.expYear}`);
            }
        },

        onBlur() {
            setTimeout(() => {
                if(!this.$el.querySelector(':focus')) {
                   this.focused = null;
                }
            });
        },

        onValid(current, next) {
            if(this.$refs[current] && this.$refs[current].$el.querySelector(':focus')) {
                if(this.$refs[next] && this.$refs[next].$el.classList.contains('is-empty')) {
                    input(this.$refs[next].$el).focus();
                }
                else if(!this.$refs[next]) {
                    input(this.$refs[current].$el).blur();
                }
            }
        },

        onValidate(el, { isValid, isPotentiallyValid }) {
            this.$emit('change', {
                card: this.card,
                type: this.type,
                isValid: this.isValid === true,
                isPotentiallyValid: this.isPotentiallyValid,
                input: {
                    el,
                    isValid,
                    isPotentiallyValid 
                }
            });
        },

        onCardTypeChange({ types }) {
            const [ type ] = types;

            this.type = type;
            this.code = type && type.code;
            this.icon = type && `cc-${(ICONS[type.type] || type.type)}`;
            this.$set(this.card, 'brand', type ? type.type : null);
            this.$set(this.card, 'numberFormatted', format(this.card.number, this.type));
            
            this.$refs.number.$el.dispatchEvent(new Event('revalidate'));
        }

    },

    created() {
        this.card.numberFormatted = this.card.number;
        this.updateExpiration();
    },

    data() {
        const card = this.blankCard({
            number: this.number,
            expMonth: this.expMonth,
            expYear: this.expYear,
            cvc: this.cvc,
            zip: this.zip,
            name: this.name
        });

        const validated = Object.keys(card)
            .reduce((carry, value) => {
                carry[value] = this.errors[value] ? false : null;

                return carry;
            }, {});

        return {
            card,
            validated,
            icon: null,
            code: null,
            type: null,
            focused: null,
            isValid: null,
            showSecurityFields: !!card.number,
            currentErrors: Object.assign({
                number: this.error
            }, this.errors)
        }
    }

};
</script>

<style lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~vue-interface/src/scss/custom-fields';

.credit-card-field {

    & > .form-group {
        margin-bottom: 0;
        border-radius: .25em;
        border: 1px solid $gray-300;
        box-shadow: 0 0 .5em $gray-100;
        background: lighten($gray-100, 2%);
    }
    
    .credit-card-field-rows .form-group {
        margin-bottom: 0;
    }

    &.has-errors {
        & > .form-group {
            border-color: $danger;
        }
        
        .is-invalid.custom-input-field .custom-control,
        .is-invalid.custom-select {
            color: $danger;
            background-color: lighten($danger, 45%);
        }      
    }

    .credit-card-field-rows {
        display: flex;
        flex-direction: column;
    }

    .credit-card-field-row {
        position: relative;
        flex-direction: row;

        &:first-child .form-group-inner,
        &:first-child .custom-control {
            border-top-left-radius : .25em;
            border-top-right-radius : .25em;
        }

        &:last-child {
            & > :last-child .form-group-inner,
            & > :last-child .custom-control {
                border-bottom-right-radius : .25em;
            }

            & > :first-child .form-group-inner,
            & > :first-child .custom-control {
                border-bottom-left-radius : .25em;
            }
            
            &:not(:first-child) > :not(:last-child) {
                .custom-select,
                .custom-control {
                    border-right: 1px solid $gray-300;
                }
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid $gray-300;
        }

        &.has-error {
            &:not(:last-child) {
                
            }

            .credit-card-field-icon {
                color: $danger;
            }
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

        .invalid-feedback {
            display: none !important;
        }
    }

    .custom-input-field .custom-control,
    .custom-select-field .custom-select,
    .custom-select-field .form-group-inner {
        border: 0;
        background: inherit;
        border-radius: inherit;

        &:after {
            border-left: none;
        }

        &:disabled {
            background: $input-disabled-bg;
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
        z-index: 1;
    }

    .credit-card-icons {
        position: absolute;
        top: 0;
        right: .25em;
        width: 2.5em;
        height: 100%;
        z-index: 2;
    }

    .credit-card-field-icon-card {
        position: absolute;
        top: 0;
        left: 0;
        width: 2.5em;
        height: 100%;

        &.animated {
            animation-duration: 333ms;
            animation-timing-function: ease-in;
        }

        .credit-card-field-icon {
            height: 100%;
            width: 2.5em;
            padding: .25em;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1;
            font-size: 1em;
        }
    }

    &.has-errors .invalid-feedback {
        display: block;
        margin-bottom: 1rem;
    }
}
</style>

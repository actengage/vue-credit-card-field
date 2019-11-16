<template>

    <form-group class="credit-card-field-wrapper" @click="onClick">

        <slot name="control">
            <div class="credit-card-field" :class="mergeClasses(controlClasses, variantClass, classes)">
                <div class="credit-card-field-icon-wrapper">
                    <div class="credit-card-field-icon-card">
                        <div class="credit-card-field-icon-front">
                            <icon :icon="['fab', 'cc-jcb']" data-brand="jcb" class="credit-card-field-icon"/>
                            <icon :icon="['fab', 'cc-visa']" data-brand="visa" class="credit-card-field-icon"/>
                            <icon :icon="['fab', 'cc-amex']" data-brand="amex" class="credit-card-field-icon"/>
                            <icon :icon="['fab', 'cc-discover']" data-brand="discover" class="credit-card-field-icon"/>
                            <icon :icon="['fab', 'cc-mastercard']" data-brand="mastercard" class="credit-card-field-icon"/>
                            <icon :icon="['fab', 'cc-diners-club']" data-brand="dinersclub" class="credit-card-field-icon"/>
                            <icon :icon="['far', 'credit-card']" data-brand="unknown" class="credit-card-field-icon" width="20" height="18"/>
                        </div>
                        <div class="credit-card-field-icon-back">
                            <icon :icon="['fas', 'credit-card']" class="credit-card-field-icon" width="23.33" height="20"/>
                        </div>
                    </div>
                </div>

                <div class="credit-card-field-fields">
                    <input v-focus.transform v-validate:number="validateNumber" v-model="card.number" max="19" type="text" placeholder="Card number" class="credit-card-field-field credit-card-field-number" :class="mergeClasses({'is-empty': !card.number, 'is-invalid': validated.number === false})">

                    <div class="credit-card-field-security-fields">
                        <input v-focus v-validate:expiration="validateExpiration" v-model="card.expiration" type="text" placeholder="MM / YY" maxlength="7" class="credit-card-field-field credit-card-field-expiration" :class="mergeClasses({'is-empty': !card.expiration, 'is-invalid': validated.expiration === false})">
                        <input v-focus="validateCvc" v-validate:cvc="validateCvc" v-model="card.cvc" type="text" placeholder="CVC" autocomplete="off" class="credit-card-field-field credit-card-field-cvc" :class="mergeClasses({'is-empty': !card.cvc, 'is-invalid': validated.cvc === false})">
                        <input v-focus="validatePostalCode" v-validate:postalCode="validatePostalCode" v-model="card.postalCode" max="5" type="text" placeholder="Zip" maxlength="5" class="credit-card-field-field credit-card-field-postal" :class="mergeClasses({'is-empty': !card.postalCode, 'is-invalid': validated.postalCode === false})">
                    </div>

                    <div class="credit-card-field-placeholder-mask">Number</div>
                    <div class="credit-card-field-number-mask" v-html="card.number"></div>
                </div>
            </div>
        </slot>

        <slot name="activity-indicator">
            <div v-show="activity" class="credit-card-field-activity">
                <activity-indicator size="sm" type="dots" center/>
            </div>
        </slot>

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
import Variant from 'vue-interface/src/Mixins/Variant';
import HelpText from 'vue-interface/src/Components/HelpText';
import FormControl from 'vue-interface/src/Mixins/FormControl';
import FormGroup from 'vue-interface/src/Components/FormGroup';
import MergeClasses from 'vue-interface/src/Mixins/MergeClasses';
import FormFeedback from 'vue-interface/src/Components/FormFeedback';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    name: 'InlineCreditCardField',

    mixins: [
        MergeClasses,
        Variant,
        FormControl
    ],

    components: {
        ActivityIndicator,
        FormGroup,
        FormFeedback,
        HelpText,
        Icon
    },

    props: {

        activity: {
            type: Boolean,
            default: false
        }

    },

    watch: {
        'card.number': function(newVal, oldVal) {
            this.brand = this.card.brand = Payment.fns.cardType(newVal) || 'unknown';
            this.validated.number = null;

            if (this.$el.querySelector('.credit-card-field-lg')) {
                this.showSecurityFields = this.card.number.length >= 14;
            }
        },
        'card.expiration': function(newVal, oldVal) {
            this.validated.expiration = null;
        },
        'card.cvc': function(newVal, oldVal) {
            this.validated.cvc = null;
        },
        'card.postalCode': function(newVal, oldVal) {
            this.validated.postalCode = null;
        }
    },

    directives: {
        focus: {
            bind(el, binding, vnode) {
                el.addEventListener('focus', event => {
                    el.style.transform = '';
                    el.classList.add('is-focused');
                    vnode.context.isFocused = true;
                    vnode.context.focusedElement = event.target;
                });

                el.addEventListener('blur', event => {
                    el.classList.remove('is-focused');
                    vnode.context.isFocused = false;

                    if (binding.modifiers.transform && vnode.context.shouldTransform(el)) {
                        vnode.context.addTransform(el);
                    }
                });
            }
        },
        validate: {
            bind(el, binding, vnode) {
                function validate(isValid) {
                    vnode.context.validated[binding.arg] = el.value === '' ? false : binding.value && binding.value(el.value);
                    vnode.context.$emit(isValid ? 'valid' : 'invalid', vnode.context.getEventPayload(el, isValid));

                    if (vnode.context.isComplete() &&
                        vnode.context.isValid() &&
                        vnode.context.hasChanged()) {
                        vnode.context.$emit('complete', vnode.context.getEventPayload(el, isValid));
                    }
                }

                function maxLength(isValid) {
                    return el.getAttribute('max') && el.value.length >= parseInt(el.getAttribute('max'));
                }

                el.addEventListener('keydown', event => {
                    const isValid = binding.value && binding.value(el.value);

                    if ((isValid || maxLength()) && vnode.context.isPrintableKeyCode(event)) {
                        event.preventDefault();
                    }
                    else if (!el.value && event.keyCode === 8) {
                        vnode.context.focusPrevElement(el);
                    }

                    vnode.context.previousValue = JSON.stringify(vnode.context.card);
                });

                el.addEventListener('keyup', event => {
                    if (vnode.context.isPrintableKeyCode(event)) {
                        const isValid = binding.value && binding.value(el.value);

                        if (maxLength()) {
                            validate(isValid);
                        }

                        if (isValid) {
                            vnode.context.focusNextElement(el);
                        }

                        vnode.context.$emit('input', vnode.context.card);

                        if (vnode.context.hasChanged()) {
                            vnode.context.$emit('change', vnode.context.getEventPayload(el, isValid));
                        }
                    }
                });

                el.addEventListener('blur', event => {
                    el.value !== '' && validate(binding.value && binding.value(el.value));
                });
            }
        }
    },

    computed: {

        classes() {
            const classes = {
                'show-security-fields': this.showSecurityFields,
                'credit-card-field-sm': this.width < 300,
                'credit-card-field-lg': this.width > 400,
                'has-activity': this.activity,
                'is-focused': this.isFocused,
                'is-invalid': this.isInvalid()
            };

            classes[`brand-${this.brand || 'unknown'}`] = true;

            if (this.isFocused) {
                classes[`is-focused-${this.getClassName(this.focusedElement)}`] = true;
            }
            else if (this.focusedElement) {
                classes[`last-focused-${this.getClassName(this.focusedElement)}`] = true;
            }

            for (let i in this.validated) {
                classes[`is-invalid-${i}`] = this.validated[i] === false;
            }

            return classes;
        }
    },

    methods: {

        addTransform(el) {
            const positionInfo = this.$el.querySelector('.credit-card-field-number-mask').getBoundingClientRect();
            const parts = el.value.split(' ');
            const totalWidth = positionInfo.width;
            const width = this.getTextWidth(parts[parts.length - 1].trim(), el);
            el.style.transform = 'translateX(' + ((totalWidth - width) * -1) + 'px)';
        },

        shouldTransform(el, offset = 1.25) {
            const totalWidth = el.offsetWidth - this.$el.querySelector('.credit-card-field-security-fields').offsetWidth;
            return totalWidth <= this.getTextWidth(el.value, el) * offset;
        },

        getDefaultCard() {
            return {
                number: this.$attrs.number || '',
                expiration: this.$attrs.expiration || '',
                cvc: this.$attrs.cvc || '',
                postalCode: this.$attrs.postalCode || ''
            };
        },

        getCardField() {
            return this.$el.querySelector('.credit-card-field');
        },

        getEventPayload(el, isValid) {
            const card = JSON.parse(JSON.stringify(this.card));
            const expiration = card.expiration.split('/');

            card.numberFormatted = card.number;
            card.number = card.number.replace(/\s/g, '');
            card.expMonth = expiration[0] ? expiration[0].trim() : null;
            card.expYear = expiration[1] ? expiration[1].trim() : null;

            return {
                card: card,
                brand: this.brand,
                invalid: this.isInvalid(),
                complete: this.isComplete(),
                input: {
                    el: el,
                    valid: isValid
                }
            };
        },

        getTextWidth(text, el) {
            const defaultView = (el.ownerDocument || document).defaultView;
            const computedStyle = defaultView.getComputedStyle(el);
            // re-use canvas object for better performance
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.margin = 0;
            context.font = computedStyle.font;
            var metrics = context.measureText(text);
            return metrics.width;
        },

        getClassName(el) {
            const classes = el.classList.item(1).split('-');
            return classes[classes.length - 1];
        },

        focusNextElement(el) {
            if (el.nextElementSibling && el.nextElementSibling.children[0]) {
                el.nextElementSibling.children[0].focus();
            }
            else if (el.nextElementSibling) {
                el.nextElementSibling.focus();
            }
        },

        focusPrevElement(el) {
            if (!el.value && el.previousElementSibling) {
                el.previousElementSibling.focus();
            }
            else if (!el.value) {
                this.$el.querySelector('.credit-card-field-number').focus();
            }
        },

        hasChanged() {
            return this.previousValue !== JSON.stringify(this.card);
        },

        validateCvc(value) {
            return Payment.fns.validateCardCVC(value);
        },

        validateNumber(value) {
            return Payment.fns.validateCardNumber(value);
        },

        validateExpiration(value) {
            return Payment.fns.validateCardExpiry(value);
        },

        validatePostalCode(value) {
            return value.match(/^\d{5}(?:[-\s]\d{4})?$/) !== null;
        },

        isPrintableKeyCode(event) {
            const keycode = event.keyCode;

            return (
                (keycode > 47 && keycode < 58) || // number keys
                keycode === 32 || keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
                (keycode > 64 && keycode < 91) || // letter keys
                (keycode > 95 && keycode < 112) || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223) // [\]' (in order)
            );
        },

        isValid() {
            for (let i in this.validated) {
                if (this.validated[i] !== true) {
                    return false;
                }
            }

            return true;
        },

        isInvalid() {
            for (let i in this.validated) {
                if (this.validated[i] === false) {
                    return true;
                }
            }

            return false;
        },

        isComplete() {
            return !!((
                this.validated.number &&
                this.validated.expiration &&
                this.validated.cvc &&
                this.validated.postalCode
            ));
        },

        onResize(event) {
            this.width = this.$el.offsetWidth;
            return this.onResize;
        },

        onClick(event) {
            if (!event.target.classList.contains('credit-card-field-field')) {
                this.focusedElement ? this.focusedElement.focus() : this.$el.querySelector('.credit-card-field-field').focus();
            }
        }

    },

    created() {
        this.card = this.getDefaultCard();
    },

    mounted() {
        Payment.formatCardCVC(this.$el.querySelector('.credit-card-field-cvc'));
        Payment.restrictNumeric(this.$el.querySelector('.credit-card-field-postal'));
        Payment.formatCardNumber(this.$el.querySelector('.credit-card-field-number'));
        Payment.formatCardExpiry(this.$el.querySelector('.credit-card-field-expiration'));

        this.$emit('input', this.card);

        window.addEventListener('resize', this.onResize());
    },

    destroyed() {
        window.removeEventListener('resize', this.onResize);
    },

    data() {
        return {
            width: null,
            isFocused: false,
            focusedElement: null,
            previousValue: null,
            showSecurityFields: false,
            brand: null,
            validated: {
                number: null,
                expiration: null,
                cvc: null,
                postalCode: null
            },
            card: {
                brand: null,
                number: null,
                expiration: null,
                cvc: null,
                postalCode: null
            }
        };
    }

};
</script>

<style lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.credit-card-field-wrapper {
    position: relative;

    .credit-card-field-activity {
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 3em;
        height: 100%;
        transition: opacity .15s ease-in-out;
    }

    .form-control.credit-card-field {
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        background: white;
        transition: width .333s ease-in-out;

        /*
        &.text-sm .credit-card-field-field,
        &.text-sm .credit-card-field-number-mask,
        &.text-sm .credit-card-field-placeholder-mask {
            font-size: .85em;
            line-height: .85em;
        }

        &.text-sm .credit-card-field-security-fields {
            width: calc(11em * .85);
        }

        &.text-sm:not(.is-focused) .credit-card-field-security-fields,
        &.text-sm.is-focused-number .credit-card-field-security-fields {
            transform: translateX(calc(-4.5em * .85));
        }
        */

        &.has-activity {
            width: calc(100% - 3em);


            & + .credit-card-field-activity {
                opacity: 1;
            }
        }

        &.form-control-sm {
            min-height: calc((#{$input-padding-y-sm} * 2) + (#{$font-size-sm} * #{$input-line-height-sm}) + (#{$input-border-width} * 2));
        }

        &, &.form-control-md {
            min-height: calc((#{$input-padding-y} * 2) + (#{$font-size-base} * #{$input-line-height}) + (#{$input-border-width} * 2));
        }

        &.form-control-lg {
            min-height: calc((#{$input-padding-y-lg} * 2) + (#{$font-size-lg} * #{$input-line-height-lg}) + (#{$input-border-width} * 2));
        }

        ::-webkit-input-placeholder {
            color: $gray-500;
        }
        ::-moz-placeholder {
            color: $gray-500;
        }
        :-ms-input-placeholder {
            color: $gray-500;
        }
        :-moz-placeholder {
            color: $gray-400;
        }

        & + .invalid-feedback {
            display: block;
        }

        &.credit-card-field-sm {
            font-size: .95em;

            .credit-card-field-icon-wrapper {
                width: .5em;
            }

            .credit-card-field-number,
            .credit-card-field-fields {
                width: calc(100% - .5em);
            }

            .credit-card-field-icon-card {
                display: none;
            }

            .credit-card-field-fields {
                left: .5em;
            }
        }

        &.credit-card-field-lg {
            &.is-focused-number:not(.show-security-fields) .credit-card-field-security-fields {
                transform: translateX(-7.5em);
            }
        }

        .credit-card-field-fields {
            position: absolute;
            top: 50%;
            width: calc(100% - 2.5em);
            transform: translateY(-50%);
            left: 2.5em;
        }

        .credit-card-field-field, input.credit-card-field-field {
            float: left;
            display: inline;
            border: none;
            outline: 0;
            background: none;
            box-shadow: none;
            line-height: 1em;
            padding: .5em 0;
            transition: transform .333s ease-in-out;

            &.is-invalid {
                color: $form-feedback-invalid-color;
            }
        }

        .credit-card-field-security-fields {
            position: absolute;
            left: 100%;
            width: 11em;
            display: inline-block;
            transition: transform .333s ease-in-out;
        }

        .credit-card-field-placeholder-mask,
        .credit-card-field-number-mask {
            width: auto;
            opacity: 0;
            position: absolute;
            z-index: -1;
            color: $gray-500;
            top: 50%;
            line-height: 1em;
            font-size: 1em;
            white-space: nowrap;
            transform: translateY(-50%);
        }

        .credit-card-field-placeholder-mask {
            padding: 2px 0;
            transition: opacity ease 0.25s;
        }

        .credit-card-field-number {
            width: 100%;
        }

        .credit-card-field-expiration {
            width: 4.75em;
        }

        .credit-card-field-cvc {
            width: 2.75em;
        }

        .credit-card-field-postal {
            width: 3.5em;
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
                opacity: 0;
                transform: scale(0);
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
        }

        &:not(.is-focused) .credit-card-field-security-fields,
        &.is-focused-number .credit-card-field-security-fields {
            transform: translateX(-4.5em);
        }

        &.show-security-fields .credit-card-field-security-fields,
        &.is-focused-expiration .credit-card-field-security-fields,
        &.is-focused-cvc .credit-card-field-security-fields,
        &.is-focused-postal .credit-card-field-security-fields,
        &.last-focused-expiration .credit-card-field-security-fields,
        &.last-focused-cvc .credit-card-field-security-fields,
        &.last-focused-postal .credit-card-field-security-fields {
            transform: translateX(-100%);
        }

        &.is-focused {
            outline: none;
            border-color: $input-focus-border-color;
            box-shadow: $input-focus-box-shadow;
        }


        &.is-focused:not(.is-focused-number),
        &:not(.is-focused).last-focused-expiration,
        &:not(.is-focused).last-focused-cvc,
        &:not(.is-focused).last-focused-postal, {
            .credit-card-field-number.is-empty {
                opacity: 0;
            }
            .credit-card-field-number.is-empty ~ .credit-card-field-placeholder-mask {
                opacity: 1;
            }
        }

        &.is-focused-cvc {
            .credit-card-field-icon-card {
                perspective: 1000px;
                transform: rotateY(180deg);
            }

            .credit-card-field-icon-back {
                display: block;
                opacity: 1;
            }

            .credit-card-field-icon-front {
                display: none;
                opacity: 0;
            }
        }

        &.brand-jcb .credit-card-field-icon-card svg[data-brand="jcb"],
        &.brand-visa .credit-card-field-icon-card svg[data-brand=visa],
        &.brand-amex .credit-card-field-icon-card svg[data-brand="amex"],
        &.brand-unknown .credit-card-field-icon-card svg[data-brand="unknown"],
        &.brand-discover .credit-card-field-icon-card svg[data-brand="discover"],
        &.brand-mastercard .credit-card-field-icon-card svg[data-brand="mastercard"],
        &.brand-dinersclub .credit-card-field-icon-card svg[data-brand="dinersclub"] {
            opacity: 1;
            transform: scale(1);
        }

        &.is-invalid,
        &:invalid {
            outline: none;
            border-color: $form-feedback-invalid-color;
            box-shadow: 0 0 0 0.2rem rgba($form-feedback-invalid-color, .25);

            .credit-card-field-icon {
                color: $form-feedback-invalid-color;
            }
        }

        &.is-valid,
        &:valid {
            outline: none;
            border-color: $form-feedback-valid-color;
            box-shadow: 0 0 0 0.2rem rgba($form-feedback-valid-color, .25);

            .credit-card-field-icon {
                color: $form-feedback-valid-color;
            }
        }

    }

}
</style>

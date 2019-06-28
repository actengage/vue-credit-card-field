# vue-credit-card-field

This repository is a collection of Vue components for credit card field UI's. As time goes on and trends change, the best credit card UI tends to change. All of the components are fully compatible with Bootstrap 4. 

## Features

- Fully compatible and designed for Bootstrap 4
- Extensible and written in ES6
- Responsive for mobile, tablets, and desktop
- Inline error handling and client side validation fields on a form

---

## Installation

#### NPM
    npm install vue-credit-card-field --save

----

## Available Components

This repository contains multiple standalone components. You can import the component you want to use like so:

    import { CreditCardField, InlineCreditCardField } from 'vue-credit-card-field';
    
    export default {
        components: {
            CreditCardField,
            InlineCreditCardField
        }
    }

---

## CreditCardField

This is the standard credit card field. It has individual fields and not based on Stripe. Newer case studies suggest individual fields can give a better return. More studies show that only showing the fields that are relevant to no overwhelm the user and clutter the UI before the user as comitted will improve results. This field attempts to build on those principles.

![Basic Usage Example](screenshots/credit-card-field.gif)

    <credit-card-field v-model="card"></credit-card-field>

---

## InlineCreditCardField

This field mimics Stripe's elements UI. It works well unless the space is too narrow and the fields start to overlap.

![Basic Usage Example](screenshots/basic-usage.gif)

![Error Handling Example](screenshots/error-handling.gif)

    <inline-credit-card-field v-model="card"></inline-credit-card-field>


// Load the icons
import { faCcJcb } from '@fortawesome/free-brands-svg-icons/faCcJcb';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons/faCcVisa';
import { faCcAmex } from '@fortawesome/free-brands-svg-icons/faCCAmex';
import { faCcDiscover } from '@fortawesome/free-brands-svg-icons/faCcDiscover';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons/faCcMastercard';
import { faCcDinersClub } from '@fortawesome/free-brands-svg-icons/faCcDinersClub';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faCreditCard as faCreditCardFront } from '@fortawesome/free-regular-svg-icons/faCreditCard';
import { faCreditCard as faCreditCardBack } from '@fortawesome/free-solid-svg-icons/faCreditCard';

// Load the font awesome library
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
    faCcJcb,
    faCcVisa,
    faCcAmex,
    faCcDiscover,
    faCcMastercard,
    faCcDinersClub,
    faCreditCardFront,
    faCreditCardBack,
    faExclamationTriangle
);

export {
    faCcJcb,
    faCcVisa,
    faCcAmex,
    faCcDiscover,
    faCcMastercard,
    faCcDinersClub,
    faCreditCardFront,
    faCreditCardBack,
    faExclamationTriangle
};

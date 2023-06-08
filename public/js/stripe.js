/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51NC3gkSG6mLbr0Q8wihshv4c7omuBvgSoefRR67ldwxg8Bn7UFnvmJgXMP9DPeddGkQjRKq2Dph4DVK8Q6FIFrNj008ndkatAA'
);

export const bookTour = async tourId => {
  try {
    // Get Checkout session from an api
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err.message);
  }
};

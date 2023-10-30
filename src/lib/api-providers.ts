import { OPENAI_API_KEY, REPLICATE_API_TOKEN, STRIPE_API_KEY } from '$env/static/private';
import Replicate from 'replicate';
import OpenAI from 'openai';
import Stripe from 'stripe';

export const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

export const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const stripe = new Stripe(STRIPE_API_KEY, {
	apiVersion: '2023-10-16',
	typescript: true
});

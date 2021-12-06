import { Component, createSignal, For } from 'solid-js';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { pipe, subscribe } from 'wonka';

import {
	createClient,
	defaultExchanges,
	subscriptionExchange,
} from '@urql/core';
import { ChatFeed } from './ChatFeed';
import { ChatForm } from './ChatForm';
import { styled } from 'solid-styled-components';

const subscriptionClient = new SubscriptionClient('ws://localhost:4000', {
	reconnect: true,
});

const client = createClient({
	url: 'http://localhost:4000',
	exchanges: [
		...defaultExchanges,
		subscriptionExchange({
			forwardSubscription: (operation) =>
				subscriptionClient.request(operation) as any,
		}),
	],
});

interface Message {
	id: string;
	text: string;
	from: string;
}

const ChatContainer = styled('div')`
	padding: 24px;
	width: 92%;
	max-width: 800px;

	@media only screen and (min-width: 601px) {
		width: 80%;
	}

	@media only screen and (min-width: 1201px) {
		width: 60%;
	}
`;

export const Chat: Component = () => {
	return (
		<ChatContainer>
			<ChatFeed client={client} />
			<ChatForm client={client} />
		</ChatContainer>
	);
};

import { Client } from '@urql/core';
import { Component, createSignal, For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { pipe, subscribe } from 'wonka';

interface Message {
	id: string;
	text: string;
	from: string;
}

interface ChatFeedProps {
	client: Client;
}

const ChatFeedContainer = styled('div')`
	width: 100%;
	padding: 6px;
`;
const ChatMessage = styled('div')`
	display: flex;
	width: 100%;
	margin: 6px 0;
`;
const ChatMessageFrom = styled('span')`
	padding: 4px 6px;
	text-align: center;
	width: 20%;
	min-width: 64px;
	background: #0692d3;
	margin-right: 6px;
	font-size: 1.2rem;
	color: #05386b;
`;
const ChatMessageText = styled('span')`
	padding: 4px 6px;
	font-size: 1.2rem;
	width: 80%;
	background: #03a9f4;
	color: #05386b;
`;

export const ChatFeed: Component<ChatFeedProps> = ({ client }) => {
	const [messages, setMessages] = createSignal<Message[]>([]);

	const { unsubscribe } = pipe(
		client.subscription(`
		subscription MessagesSub {
			messages {
				id,
				text,
				from
			}
		}
	`),
		subscribe((result) => {
			setMessages(result.data.messages);
		})
	);

	return (
		<ChatFeedContainer>
			<For each={messages()}>
				{({ id, text, from }) => (
					<ChatMessage>
						<ChatMessageFrom>{from}</ChatMessageFrom>
						<ChatMessageText>{text}</ChatMessageText>
					</ChatMessage>
				)}
			</For>
		</ChatFeedContainer>
	);
};

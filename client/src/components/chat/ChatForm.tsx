import { Client } from '@urql/core';
import { Component, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';

const ChatFormContainer = styled('div')`
	width: 100%;
	display: flex;
	padding: 0 6px;
	margin-top: 12px;
`;

const TextInput = styled('input')`
	background: #03a9f4;
	border: 1px solid #88cdec;
	min-width: 64px;
	margin-right: 6px;
	font-size: 1.2rem;
	color: #05386b;
	padding: 0 6px;

	&:focus {
		outline: none;
		border: 1px solid #e0f2fa;
	}

	&::placeholder {
		font-size: 1.2rem;
		color: #224b75;
		opacity: 0.8;
	}
`;

const SubmitButton = styled('button')`
	border: none;
	padding: 6px 12px;
	min-width: 64px;
	text-align: center;
	cursor: pointer;
	background: #03a9f4;
	transition: filter 0.1s ease-out;
	letter-spacing: 0.4px;
	font-size: 1.2rem;
	font-weight: 500;
	color: #05386b;
	margin-left: 12px;

	&:hover {
		filter: brightness(0.9);
	}
`;

interface ChatFormProps {
	client: Client;
}

export const ChatForm: Component<ChatFormProps> = ({ client }) => {
	const [text, setText] = createSignal('');
	const [from, setFrom] = createSignal('');
	const onAdd = async () => {
		await client
			.mutation(
				`mutation($text: String!, $from: String!) {
					addMessage(text: $text, from: $from) {
						id
					}
				}`,
				{
					text: text(),
					from: from(),
				}
			)
			.toPromise();
		setText('');
	};

	return (
		<ChatFormContainer>
			<TextInput
				type="text"
				style={{ width: '20%' }}
				placeholder="Name..."
				value={from()}
				oninput={(e) => setFrom(e.currentTarget.value)}
			/>
			<TextInput
				type="text"
				style={{ width: '70%' }}
				placeholder="Message..."
				value={text()}
				oninput={(e) => setText(e.currentTarget.value)}
			/>
			<SubmitButton style={{ width: '10%' }} onclick={onAdd}>
				Add
			</SubmitButton>
		</ChatFormContainer>
	);
};

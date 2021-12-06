import { Component } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Chat } from './components/chat/Chat';

const PageContainer = styled('div')`
	width: 100%;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const App: Component = () => {
	return (
		<PageContainer>
			<Chat />
		</PageContainer>
	);
};

export default App;

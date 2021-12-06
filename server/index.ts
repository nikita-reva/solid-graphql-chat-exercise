import { GraphQLServer, PubSub } from 'graphql-yoga';

const CHAT_CHANNEL = 'CHAT_CHANNEL';

const pubsub = new PubSub();

const messages: [
	{
		id: string;
		text: string;
		from: string;
	}?
] = [];

const typeDefs = `
    type ChatMessage {
        id: ID!
        text: String!
		from: String!
    }
    type Query {
        getChatMessages: [ChatMessage]!
    }
	type Mutation {
		addMessage(text: String!, from: String!): ChatMessage
	}
	type Subscription {
		messages: [ChatMessage]! 
	}
`;

const resolvers = {
	Query: {
		getChatMessages: () => {
			return messages;
		},
	},
	Mutation: {
		addMessage: (
			_: unknown,
			{ text, from }: { text: string; from: string },
			{ pubsub }: { pubsub: PubSub }
		) => {
			const newMessage = {
				id: String(messages.length + 1),
				text,
				from,
			};
			messages.push(newMessage);
			pubsub.publish(CHAT_CHANNEL, { messages });
			return newMessage;
		},
	},
	Subscription: {
		messages: {
			subscribe: () => {
				const iterator = pubsub.asyncIterator(CHAT_CHANNEL);
				pubsub.publish(CHAT_CHANNEL, { messages });
				return iterator;
			},
		},
	},
};

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(() => console.log('Server is running http://localhost:4000'));

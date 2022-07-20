export const fixtures = (messages, addMessage, match) => {
    if (match.id !== 39) return;
    const baseMessages = [
        { id: 3, text: 'First', from: { id: 7 }, createdAt: new Date('2022-07-19 14:03:24') },
        { id: 5, text: 'Second', from: { id: 5 }, createdAt: new Date('2022-07-19 14:03:52') },
        { id: 6, text: 'This is a 3rd', from: { id: 7 }, createdAt: new Date('2022-07-19 14:04:32') },
        { id: 7, text: 'With a follow-up', from: { id: 7 }, createdAt: new Date('2022-07-19 14:04:55') },
        { id: 8, text: 'Final comment', from: { id: 5 }, createdAt: new Date('2022-07-19 14:05:32') },
    ];

    if (messages.length === 0) {
        for (const message of baseMessages) addMessage(String(match.id), message);
    }
};

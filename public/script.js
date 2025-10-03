const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  // Show a thinking indicator
  const thinkingMsg = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong with the request.');
    }

    const responseData = await response.json();

    if (responseData.success) {
      const botMessage = responseData.data;
      // Update the "thinking..." message with the actual response
      thinkingMsg.textContent = botMessage;
      conversation.push({ role: 'model', text: botMessage });
    } else {
      // Handle cases where the API returns success: false
      thinkingMsg.textContent = `Error: ${responseData.message}`;
      thinkingMsg.classList.add('error');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    // Update the "thinking..." message with the error
    thinkingMsg.textContent = `Error: ${error.message}`;
    thinkingMsg.classList.add('error');
    // Optional: remove the last user message from history on failure
    conversation.pop();
  } finally {
    // Ensure the chat box scrolls to the bottom after the response
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the message element to allow for modification
}

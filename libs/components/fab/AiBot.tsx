import React, { useState, useEffect, useRef } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Image from 'next/image';

interface AiBotProps {
	onClick: () => void;
}

interface Message {
	role: 'user' | 'ai';
	text: string;
}

const AiBot: React.FC<AiBotProps> = ({ onClick }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		setModalOpen(true);
		onClick();
	};

	const handleClose = () => {
		setModalOpen(false);
	};

	// Auto-scroll to bottom when new message appears
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async () => {
		if (!inputValue.trim() || loading) return;

		const userMessage = inputValue.trim();
		setInputValue('');

		// Add user message
		setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
		setLoading(true);

		try {
			// Call backend API
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMessage }),
			});

			if (!response.ok) {
				throw new Error('Failed to get AI response');
			}

			const data = await response.json();

			// Add AI response
			setMessages((prev) => [
				...prev,
				{ role: 'ai', text: data.reply || data.message || 'Sorry, I could not process that.' },
			]);
		} catch (error) {
			console.error('AI Chat Error:', error);
			setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<>
			<Box className="ai-bot" onClick={handleClick}>
				<Box className="ai-bot-icon-wrapper">
					<Image src="/img/icons/robot.png" alt="AI Assistant" width={66} height={66} className="ai-bot-icon" />
				</Box>
			</Box>

			<Dialog
				open={modalOpen}
				onClose={handleClose}
				PaperProps={{
					className: 'ai-bot-dialog-paper',
				}}
			>
				{/* Header */}
				<Box className="ai-bot-dialog-header">
					<Box className="ai-bot-dialog-header-content">
						<Image src="/img/icons/robot.png" alt="AI" width={36} height={36} className="ai-bot-dialog-header-image" />
						<Box>
							<Typography variant="subtitle1" className="ai-bot-dialog-header-title">
								AI Assistant
							</Typography>
							<Typography variant="caption" className="ai-bot-dialog-header-subtitle">
								Ask CarMoa AI anything about auto parts
							</Typography>
						</Box>
					</Box>
					<IconButton
						aria-label="close"
						onClick={handleClose}
						size="small"
						className="ai-bot-dialog-close-btn"
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				{/* Messages Area */}
				<Box className="ai-bot-messages-area">
					{messages.length === 0 ? (
						<Box className="ai-bot-empty-state">
							<Image
								src="/img/icons/robot.png"
								alt="AI"
								width={70}
								height={70}
								className="ai-bot-empty-state-image"
							/>
							<Typography variant="body2" className="ai-bot-empty-state-text">
								Start a conversation with CarMoa AI
							</Typography>
						</Box>
					) : (
						<>
							{messages.map((msg, index) => (
								<Box
									key={index}
									className={`ai-bot-message-wrapper ${msg.role}`}
								>
									<Box className={`ai-bot-message-bubble ${msg.role}`}>
										<Typography variant="body2" className="ai-bot-message-text">
											{msg.text}
										</Typography>
									</Box>
								</Box>
							))}
							{loading && (
								<Box className="ai-bot-loading-wrapper">
									<Box className="ai-bot-loading-bubble">
										{/* Typing indicator - 3 pulsing dots */}
										<Box className="ai-bot-typing-indicator">
											<span></span>
											<span></span>
											<span></span>
										</Box>
									</Box>
								</Box>
							)}
							<div ref={messagesEndRef} />
						</>
					)}
				</Box>

				{/* Input Area */}
				<Box className="ai-bot-input-area">
					<input
						className="ai-bot-input"
						placeholder="Ask about auto parts, orders, or anything..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						disabled={loading}
					/>
					<IconButton
						onClick={handleSendMessage}
						disabled={!inputValue.trim() || loading}
						className="ai-bot-send-btn"
					>
						<SendIcon fontSize="small" />
					</IconButton>
				</Box>
			</Dialog>
		</>
	);
};

export default AiBot;


import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface AiBotProps {
	onClick: () => void;
}

const AiBot: React.FC<AiBotProps> = ({ onClick }) => {
	const [modalOpen, setModalOpen] = useState(false);

	const handleClick = () => {
		setModalOpen(true);
		onClick();
	};

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<>
			<Box className="ai-bot" onClick={handleClick}>
				<Box className="ai-bot-icon-wrapper">
					<Image
						src="/img/icons/robot.png"
						alt="AI Assistant"
						width={66}
						height={66}
						className="ai-bot-icon"
					/>
				</Box>
			</Box>

			<Dialog
				open={modalOpen}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					className: 'ai-bot-modal-paper',
				}}
			>
				<DialogTitle className="ai-bot-modal-title">
					<Typography variant="h6">AI Assistant</Typography>
					<IconButton
						aria-label="close"
						onClick={handleClose}
						className="ai-bot-modal-close-btn"
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent className="ai-bot-modal-content">
					<Box className="ai-bot-modal-placeholder">
						<Image
							src="/img/icons/robot.png"
							alt="AI Assistant"
							width={64}
							height={64}
							className="ai-bot-modal-image"
						/>
						<Typography variant="h6" gutterBottom>
							AI Assistant Coming Soon
						</Typography>
						<Typography variant="body2" color="text.secondary">
							This feature is currently under development. Check back soon!
						</Typography>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AiBot;


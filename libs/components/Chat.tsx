import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, getMemberImageUrl } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<Box
				component={'div'}
				flexDirection={'row'}
				style={{ display: 'flex' }}
				alignItems={'flex-end'}
				justifyContent={'flex-end'}
				sx={{ m: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</Box>
		);
	} else {
		return (
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg_left'}></div>
			</Box>
		);
	}
};

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			console.log('WebSocket message:', data);

			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;

				case 'messages':
					const list: MessagePayload[] = data.messages || [];
					setMessagesList(list);
					break;

				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList((prev) => [...prev, newMessage]);
					break;
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) sweetErrorAlert(Messages.error4);
		else {
			socket.send(
				JSON.stringify({
					event: 'message',
					data: messageInput,
				}),
			);
			setMessageInput('');
		}
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className={`live-chat-floating-btn ${!open ? 'pulse' : ''}`} onClick={handleOpenChat}>
					{open ? <CloseIcon style={{ fontSize: 28 }} /> : <img src="/img/icons/liveChat.png" alt="Live Chat" />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
					<RippleBadge style={{ margin: '-10px 0 0 21px' }} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							{(!messagesList || messagesList.length === 0) && (
								<Box className={'welcome-container'} component={'div'}>
									<div className={'welcome'}>Welcome to CarMoa Live Chat 👋</div>
									<div className={'welcome-sub'}>How can we assist you with auto parts today?</div>
								</Box>
							)}
							{messagesList &&
								messagesList.map((ele: MessagePayload, idx: number) => {
									const { text, memberData } = ele;
									const memberImage = getMemberImageUrl(memberData?.memberImage);

									return memberData?._id === user?._id ? (
										<Box
											key={idx}
											component={'div'}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											alignItems={'flex-end'}
											justifyContent={'flex-end'}
											sx={{ m: '10px 0px' }}
										>
											<div className="msg-right">{text}</div>
										</Box>
									) : (
										<Box
											key={idx}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											sx={{ m: '10px 0px' }}
											component={'div'}
										>
											<Avatar alt={memberData?.memberNick || 'Support'} src={memberImage} />
											<div className="msg-left">{text}</div>
										</Box>
									);
								})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;

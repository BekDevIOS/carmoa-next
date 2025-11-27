import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { BoardArticleCategory } from '../../enums/blog.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../sweetAlert';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.REVIEWS);

	/** APOLLO REQUESTS **/
	const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);


	const memoizedValues = useMemo(() => {
		const articleTitle = '',
			articleContent = '',
			articleImage = '';

		return { articleTitle, articleContent, articleImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.articleImage = responseImage;

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.articleTitle = e.target.value;
	};

	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const articleContent = editor?.getInstance().getHTML() as string;
			memoizedValues.articleContent = articleContent;

			if (memoizedValues.articleContent === '' && memoizedValues.articleTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createBoardArticle({
				variables: {
					input: { ...memoizedValues, articleCategory },
				},
			});

			await sweetTopSuccessAlert('Article is created successfully', 700);
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myArticles',
				},
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
		}
	};

	const doDisabledCheck = () => {
		if (memoizedValues.articleContent === '' || memoizedValues.articleTitle === '') {
			return true;
		}
	};

	return (
		<Stack sx={{ color: 'var(--carmo-text)' }}>
			<Stack direction="row" sx={{ margin: '40px' }} justifyContent="space-evenly">
				<Box component={'div'} className={'form_row'} sx={{ width: '300px' }}>
					<Typography sx={{ color: 'var(--carmo-text-secondary)', margin: '10px' }} variant="h3">
						Category
					</Typography>
					<FormControl sx={{ width: '100%', backgroundColor: 'var(--carmo-card-bg)', '& .MuiOutlinedInput-root': { color: 'var(--carmo-text)' }, '& .MuiInputLabel-root': { color: 'var(--carmo-text-secondary)' } }}>
						<Select
							value={articleCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
							sx={{ color: 'var(--carmo-text)' }}
						>
							<MenuItem value={BoardArticleCategory.REVIEWS}>
								<span>Reviews</span>
							</MenuItem>
							<MenuItem value={BoardArticleCategory.REPAIR}>Repair</MenuItem>
							<MenuItem value={BoardArticleCategory.PARTS}>Parts</MenuItem>
							<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
							<MenuItem value={BoardArticleCategory.COMMUNITY}>Community</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box component={'div'} sx={{ width: '300px', flexDirection: 'column' }}>
					<Typography sx={{ color: 'var(--carmo-text-secondary)', margin: '10px' }} variant="h3">
						Title
					</Typography>
					<TextField
						onChange={articleTitleHandler}
						id="filled-basic"
						label="Type Title"
						sx={{ 
							width: '300px', 
							backgroundColor: 'var(--carmo-card-bg)',
							'& .MuiOutlinedInput-root': { 
								color: 'var(--carmo-text)',
								'& fieldset': { borderColor: 'var(--carmo-border)' },
								'&:hover fieldset': { borderColor: 'var(--carmo-text)' },
								'&.Mui-focused fieldset': { borderColor: 'var(--carmo-primary)' }
							},
							'& .MuiInputLabel-root': { color: 'var(--carmo-text-secondary)' },
							'& .MuiInputLabel-root.Mui-focused': { color: 'var(--carmo-primary)' }
						}}
					/>
				</Box>
			</Stack>

			<Box sx={{ 
				backgroundColor: 'var(--carmo-card-bg)', 
				borderRadius: '8px',
				'& .toastui-editor-defaultUI': { 
					borderColor: 'var(--carmo-border)',
				},
				'& .toastui-editor-defaultUI-toolbar': {
					backgroundColor: 'var(--carmo-bg-soft)',
					borderBottomColor: 'var(--carmo-border)',
					'& button': {
						color: 'var(--carmo-text)',
					}
				},
				'& .toastui-editor-contents': {
					color: 'var(--carmo-text)',
					backgroundColor: 'var(--carmo-card-bg)',
					'& p': { color: 'var(--carmo-text)' },
					'& h1, & h2, & h3, & h4, & h5, & h6': { color: 'var(--carmo-text)' },
					'& a': { color: 'var(--carmo-primary)' },
					'& code': { 
						color: 'var(--carmo-text)', 
						backgroundColor: 'var(--carmo-bg-soft)' 
					},
					'& pre': { 
						backgroundColor: 'var(--carmo-bg-soft)', 
						color: 'var(--carmo-text)' 
					},
					'& blockquote': { 
						borderLeftColor: 'var(--carmo-primary)', 
						color: 'var(--carmo-text-secondary)' 
					}
				},
				'& .toastui-editor-contents-placeholder': {
					color: 'var(--carmo-text-secondary)',
				}
			}}>
				<Editor
					initialValue={'Type here'}
					placeholder={'Type here'}
					previewStyle={'vertical'}
					height={'640px'}
					// @ts-ignore
					initialEditType={'WYSIWYG'}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const uploadedImageURL = await uploadImage(image);
							callback(uploadedImageURL);
							return false;
						},
					}}
					events={{
						load: function (param: any) {},
					}}
				/>
			</Box>

			<Stack direction="row" justifyContent="center">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '30px', width: '250px', height: '45px' }}
					onClick={handleRegisterButton}
				>
					Register
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;

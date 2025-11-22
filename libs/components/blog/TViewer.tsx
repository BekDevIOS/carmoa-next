import React, { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import { Box, Stack, CircularProgress } from '@mui/material';

const TViewer = (props: any) => {
	const [editorLoaded, setEditorLoaded] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (props.markdown) {
			setEditorLoaded(true);
		} else {
			setEditorLoaded(false);
		}
	}, [props.markdown]);

	return (
		<Stack sx={{ background: "var(--carmo-bg)", color: "var(--carmo-text)", mt: '30px', borderRadius: '10px' }}>
			<Box component={'div'} sx={{ m: '40px', color: "var(--carmo-text)", '& .toastui-editor-contents': { color: 'var(--carmo-text)' }, '& .toastui-editor-contents p': { color: 'var(--carmo-text)' }, '& .toastui-editor-contents h1, & .toastui-editor-contents h2, & .toastui-editor-contents h3, & .toastui-editor-contents h4, & .toastui-editor-contents h5, & .toastui-editor-contents h6': { color: 'var(--carmo-text)' }, '& .toastui-editor-contents a': { color: 'var(--carmo-primary)' }, '& .toastui-editor-contents code': { color: 'var(--carmo-text)', background: 'var(--carmo-bg-soft)' }, '& .toastui-editor-contents pre': { background: 'var(--carmo-bg-soft)', color: 'var(--carmo-text)' }, '& .toastui-editor-contents blockquote': { borderLeftColor: 'var(--carmo-primary)', color: 'var(--carmo-text-secondary)' } }}>
				{editorLoaded ? (
					<Viewer
						initialValue={props.markdown}
						customHTMLRenderer={{
							htmlBlock: {
								iframe(node: any) {
									return [
										{
											type: 'openTag',
											tagName: 'iframe',
											outerNewLine: true,
											attributes: node.attrs,
										},
										{ type: 'html', content: node.childrenHTML ?? '' },
										{ type: 'closeTag', tagName: 'iframe', outerNewLine: true },
									];
								},
								div(node: any) {
									return [
										{ type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
										{ type: 'html', content: node.childrenHTML ?? '' },
										{ type: 'closeTag', tagName: 'div', outerNewLine: true },
									];
								},
							},
							htmlInline: {
								big(node: any, { entering }: any) {
									return entering
										? { type: 'openTag', tagName: 'big', attributes: node.attrs }
										: { type: 'closeTag', tagName: 'big' };
								},
							},
						}}
					/>
				) : (
					<CircularProgress />
				)}
			</Box>
		</Stack>
	);
};

export default TViewer;

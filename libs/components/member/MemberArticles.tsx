import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import BlogCard from '../common/BlogCard';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/blog/board-article';
import { BoardArticlesInquiry } from '../../types/blog/board-article.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>(initialInput);
	const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const activeMemberId = (memberId as string) || (user?._id as string);

	const {
		loading: getMemberArticlesLoading,
		data: getMemberArticlesData,
		error: getMemberArticlesError,
		refetch: getMemberArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberBoArticles(data?.getBoardArticles?.list || []);
			setTotal(data?.getBoardArticles?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!activeMemberId) return;
		setSearchFilter((prev) => ({
			...prev,
			search: {
				...(prev.search || {}),
				memberId: activeMemberId,
			},
		}));
	}, [activeMemberId]);

	useEffect(() => {
		if (!searchFilter?.search?.memberId) return;
		getMemberArticlesRefetch({ input: searchFilter }).then();
	}, [searchFilter, getMemberArticlesRefetch]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter((prev) => ({
			...prev,
			page: value,
		}));
	};

	const likeMemberArticleHandler = async (e: React.SyntheticEvent, userData: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!userData?._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await getMemberArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success!', 750);
		} catch (err: any) {
			// eslint-disable-next-line no-console
			console.log('ERROR, likeMemberArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>MEMBER ARTICLES MOBILE</div>;
	} else {
		return (
			<div id="member-articles-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Articles</Typography>
					</Stack>
				</Stack>
				<Stack className="articles-list-box">
					{memberBoArticles?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Articles found!</p>
						</div>
					)}
					{memberBoArticles?.map((boardArticle: BoardArticle) => {
						return (
							<BlogCard
								boardArticle={boardArticle}
								key={boardArticle?._id}
								likeArticleHandler={likeMemberArticleHandler}
							/>
						);
					})}
				</Stack>
				{memberBoArticles?.length !== 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / (searchFilter.limit || 6)) || 1}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								{total} article
								{total !== 1 ? 's' : ''} available
							</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
	}
};

MemberArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberArticles;

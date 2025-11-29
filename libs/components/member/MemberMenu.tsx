import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Button, useTheme } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { getMemberImageUrl } from '../../config';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MEMBER } from '../../../apollo/user/query';
import { userVar } from '../../../apollo/store';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArticleIcon from '@mui/icons-material/Article';

interface MemberMenuProps {
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const theme = useTheme();
	const category: any = router.query?.category;
	const user = useReactiveVar(userVar);
	const [member, setMember] = useState<Member | null>(null);
	const { memberId } = router.query;

	/** APOLLO REQUESTS **/
	const activeMemberId = (memberId as string) || (user?._id as string);

	// Match icon color behavior with MyMenu (supports light/dark modes)
	const getIconColor = (isActive: boolean) => {
		if (isActive) {
			return '#ffffff';
		}
		return theme.palette.text.primary;
	};

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: activeMemberId || '' },
		skip: !activeMemberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setMember(data?.getMember || null);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!activeMemberId) return;
		getMemberRefetch({ input: activeMemberId }).then();
	}, [activeMemberId, getMemberRefetch]);

	/** HANDLERS **/
	const handleFollow = async () => {
		if (!member?._id) return;
		await subscribeHandler(member._id, null, memberId);
		await getMemberRefetch({ input: activeMemberId });
	};

	const handleUnfollow = async () => {
		if (!member?._id) return;
		await unsubscribeHandler(member._id, null, memberId);
		await getMemberRefetch({ input: activeMemberId });
	};

	if (device === 'mobile') {
		return <div>MEMBER MENU MOBILE</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={getMemberImageUrl(member?.memberImage)}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{member?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.primary }} />
							<Typography className={'p-number'}>{member?.memberPhone}</Typography>
						</Box>
						<Typography className={'view-list'}>{member?.memberType}</Typography>
					</Stack>
				</Stack>
				<Stack className="follow-button-box">
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<>
							<Button variant="outlined" onClick={handleUnfollow}>
								Unfollow
							</Button>
							<Typography>Following</Typography>
						</>
					) : (
						<Button variant="contained" onClick={handleFollow}>
							Follow
						</Button>
					)}
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							Details
						</Typography>
						<List className={'sub-section'}>
							{member?.memberType === 'DEALER' && (
								<ListItem className={category === 'properties' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'properties' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'}>
											<InventoryIcon
												className="com-icon"
												sx={{
													fontSize: 16,
													color: getIconColor(category === 'properties'),
												}}
											/>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Products
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberProducts}
											</Typography>
										</div>
									</Link>
								</ListItem>
							)}
							<ListItem className={category === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followers' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'}>
										<PeopleIcon
											className="com-icon"
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'followers'),
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followers
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowers}
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={category === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followings' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'}>
										<PersonAddIcon
											className="com-icon"
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'followings'),
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followings
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowings}
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'}>
						<div>
							<Typography className="title" variant={'h5'}>
								Community
							</Typography>
							<List className={'sub-section'}>
								<ListItem className={category === 'articles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'articles' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'}>
											<ArticleIcon
												className="com-icon"
												sx={{
													fontSize: 16,
													color: getIconColor(category === 'articles'),
												}}
											/>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberArticles}
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MemberMenu;

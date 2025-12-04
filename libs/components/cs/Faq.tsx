import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography, CircularProgress } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_FAQ_LIST } from '../../../apollo/user/query';
import { Faq as FaqType } from '../../types/faq/faq';
import { FAQCategory } from '../../enums/faq.enum';

interface PublicFaqListResponse {
	getPublicFaqList: FaqType[];
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<FAQCategory>(FAQCategory.GENERAL);
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	const { data, loading, error } = useQuery<PublicFaqListResponse>(GET_PUBLIC_FAQ_LIST, {
		fetchPolicy: 'cache-and-network',
	});

	/** HANDLERS **/
	const changeCategoryHandler = (newCategory: FAQCategory) => {
		setCategory(newCategory);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const getCategoryLabel = (cat: FAQCategory) => {
		const labels: { [key in FAQCategory]: string } = {
			[FAQCategory.ACCOUNT]: t('Account'),
			[FAQCategory.ORDER]: t('Order'),
			[FAQCategory.PAYMENT]: t('Payment'),
			[FAQCategory.SHIPPING]: t('Shipping'),
			[FAQCategory.RETURNS]: t('Returns'),
			[FAQCategory.DEALER]: t('For Dealers'),
			[FAQCategory.GENERAL]: t('General'),
		};
		return labels[cat];
	};

	// Group FAQs by category
	const groupedFaqs = data?.getPublicFaqList?.reduce((acc, faq) => {
		if (!acc[faq.category]) {
			acc[faq.category] = [];
		}
		acc[faq.category].push(faq);
		return acc;
	}, {} as Record<FAQCategory, FaqType[]>);

	// Get FAQs for selected category
	const categoryFaqs = groupedFaqs?.[category] || [];

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	}

	if (loading) {
		return (
			<Stack className={'faq-content'} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
				<CircularProgress />
				<Typography sx={{ mt: 2 }} color="text.secondary">
					{t('Loading FAQs...')}
				</Typography>
			</Stack>
		);
	}

	if (error) {
		return (
			<Stack className={'faq-content'} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
				<Typography color="error">{t('Failed to load FAQs')}</Typography>
			</Stack>
		);
	}

	return (
		<Stack className={'faq-content'}>
			<Box className={'categories'} component={'div'}>
				{Object.values(FAQCategory).map((cat) => {
					const count = groupedFaqs?.[cat]?.length || 0;
					if (count === 0) return null; // Hide categories with no FAQs

					return (
						<div
							key={cat}
							className={category === cat ? 'active' : ''}
							onClick={() => changeCategoryHandler(cat)}
						>
							{getCategoryLabel(cat)}
							{count > 0 && (
								<span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>({count})</span>
							)}
						</div>
					);
				})}
			</Box>

			<Box className={'wrap'} component={'div'}>
				{categoryFaqs.length > 0 ? (
					categoryFaqs.map((faq: FaqType) => (
						<Accordion expanded={expanded === faq._id} onChange={handleChange(faq._id)} key={faq._id}>
							<AccordionSummary id={`panel-${faq._id}-header`} className="question" aria-controls={`panel-${faq._id}-content`}>
								<Typography className="badge" variant={'h4'}>
									Q
								</Typography>
								<Typography>{faq.question}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer flex-box'}>
									<Typography className="badge" variant={'h4'} color={'primary'}>
										A
									</Typography>
									<Typography>{faq.answer}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))
				) : (
					<Box component={'div'} sx={{ py: 8, textAlign: 'center' }}>
						<Typography color="text.secondary">
							{t('No FAQs available for')} {getCategoryLabel(category)}
						</Typography>
					</Box>
				)}
			</Box>
		</Stack>
	);
};

export default Faq;

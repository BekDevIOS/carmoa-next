import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberProvider
				memberPhone
				memberEmail
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberShippingAddress {
					firstName
					lastName
					address1
					address2
					city
					postalCode
					phone
				}
				memberBillingAddress {
					country
					firstName
					lastName
					address1
					address2
					city
					postalCode
					phone
				}
				memberDesc
				memberProducts
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PRODUCT        *
 *************************/

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
	query GetAllProductsByAdmin($input: AllProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
			list {
				_id
				productType
				productStatus
				productCondition
				ratingAverage
				ratingCount
				productMainCategory
				productSubCategory
				productCarBrand
				productCarModel
				productYearFrom
				productYearTo
				productOemNumbers
				productTitle
				productPrice
				productSalePrice
				productStock
				productViews
				productLikes
				productComments
				productRank
				productImages
				productDescription
				dealerId
				soldAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberProvider
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberShippingAddress {
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberBillingAddress {
						country
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberDesc
					memberProducts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberProvider
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberShippingAddress {
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberBillingAddress {
						country
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberDesc
					memberProducts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				rating
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberProvider
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberShippingAddress {
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberBillingAddress {
						country
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberDesc
					memberProducts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         ORDER        *
 *************************/

export const GET_ORDERS_BY_ADMIN = gql`
	query GetOrdersByAdmin($input: OrdersInquiry!) {
		getOrdersByAdmin(input: $input) {
			list {
				_id
				memberId
				orderStatus
				paymentStatus
				paymentMethod
				totalPrice
				shippingFee
				notes
				deliveredAt
				cancelledAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberProvider
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberShippingAddress {
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberBillingAddress {
						country
						firstName
						lastName
						address1
						address2
						city
						postalCode
						phone
					}
					memberDesc
					memberProducts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				orderItems {
					_id
					orderId
					productId
					dealerId
					itemQuantity
					itemPrice
					itemStatus
					createdAt
					updatedAt
					productData {
						_id
						productType
						productStatus
						productCondition
						productMainCategory
						productSubCategory
						productCarBrand
						productCarModel
						productYearFrom
						productYearTo
						productOemNumbers
						productTitle
						productPrice
						productSalePrice
						productStock
						productViews
						productLikes
						productComments
						ratingAverage
						ratingCount
						productRank
						productImages
						productDescription
						dealerId
						soldAt
						deletedAt
						createdAt
						updatedAt
					}
					dealerData {
						_id
						memberType
						memberStatus
						memberAuthType
						memberProvider
						memberPhone
						memberEmail
						memberNick
						memberFullName
						memberImage
						memberAddress
						memberDesc
						memberProducts
						memberArticles
						memberFollowers
						memberFollowings
						memberPoints
						memberLikes
						memberViews
						memberComments
						memberRank
						memberWarnings
						memberBlocks
						deletedAt
						createdAt
						updatedAt
					accessToken
				}
			}
		}
		metaCounter {
			total
		}
	}
}
`;

/**************************
 *         FAQ          *
 *************************/

export const GET_FAQ_LIST = gql`
	query GetFaqList($input: FaqInquiry!) {
		getFaqList(input: $input) {
			list {
				_id
				category
				question
				answer
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        NOTICE        *
 *************************/

export const GET_NOTICE_LIST = gql`
	query GetNoticeList($input: NoticeInquiryInput!) {
		getNoticeList(input: $input) {
			list {
				_id
				title
				content
				visibleTo
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

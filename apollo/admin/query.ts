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

export const GET_ORDERS = gql`
	query GetOrders($input: OrdersInquiry!) {
		getOrders(input: $input) {
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
					itemQuantity
					itemPrice
					createdAt
					updatedAt
					product {
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
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
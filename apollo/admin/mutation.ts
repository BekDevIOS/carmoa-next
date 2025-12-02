import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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
`;

/**************************
 *        PRODUCT        *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
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
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			rating
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         ORDER        *
 *************************/

export const UPDATE_ORDER_BY_ADMIN = gql`
	mutation UpdateOrder($input: OrderUpdate!) {
		updateOrder(input: $input) {
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

				}
			}
		}
	}
`;

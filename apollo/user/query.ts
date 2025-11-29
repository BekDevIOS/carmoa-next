import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
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

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}
`);

/**************************
 *        PRODUCT        *
 *************************/

export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
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
					memberPhone
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
					memberProducts
					memberProvider
					memberEmail
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

export const GET_DEALER_PRODUCTS = gql`
	query GetDealerProducts($input: DealerProductsInquiry!) {
		getDealerProducts(input: $input) {
			list {
				_id
				productType
				productStatus
				productCondition
				productTitle
				productPrice
				productViews
				productLikes
				productComments
				productRank
				productImages
				productMainCategory
				productSubCategory
				productCarBrand
				productCarModel
				productYearFrom
				productYearTo
				productOemNumbers
				productSalePrice
				productStock
				productDescription
				dealerId
				soldAt
				deletedAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
					memberPhone
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
					memberProducts
					memberProvider
					memberEmail
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
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
					memberPhone
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
					memberProducts
					memberProvider
					memberEmail
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
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
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
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
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
					memberPhone
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
					memberProducts
					memberProvider
					memberEmail
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
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
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
					memberProducts
					memberProvider
					memberEmail
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
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

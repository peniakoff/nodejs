/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */
import { ByProjectKeyProductsByIDRequestBuilder } from 'client/products/by-project-key-products-by-id-request-builder'
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from 'client/products/by-project-key-products-key-by-key-request-builder'
import {
  Product,
  ProductDraft,
  ProductPagedQueryResponse,
} from 'models/product'
import { executeRequest, QueryParam } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyProductsRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  public withKey(childPathArgs: {
    key: string
  }): ByProjectKeyProductsKeyByKeyRequestBuilder {
    return new ByProjectKeyProductsKeyByKeyRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }
  public withId(childPathArgs: {
    ID: string
  }): ByProjectKeyProductsByIDRequestBuilder {
    return new ByProjectKeyProductsByIDRequestBuilder({
      pathArgs: {
        ...this.args.pathArgs,
        ...childPathArgs,
      },
      executeRequest: this.args.executeRequest,
      baseUri: this.args.baseUri,
    })
  }

  /**
   *	You can use the query endpoint to get the full representations of products.
   *	REMARK: We suggest to use the performance optimized search endpoint which has a bunch functionalities,
   *	the query API lacks like sorting on custom attributes, etc.
   *
   */
  public get(methodArgs?: {
    queryArgs?: {
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
      localeProjection?: string | string[]
      storeProjection?: string | string[]
      expand?: string | string[]
      sort?: string | string[]
      limit?: number | number[]
      offset?: number | number[]
      withTotal?: boolean | boolean[]
      where?: string | string[]
      [key: string]: QueryParam
    }
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<ProductPagedQueryResponse> {
    return new ApiRequest<ProductPagedQueryResponse>(
      {
        baseUri: this.args.baseUri,
        method: 'GET',
        uriTemplate: '/{projectKey}/products',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
      },
      this.args.executeRequest
    )
  }
  /**
   *	To create a new product, send a representation that is going to become the initial staged representation
   *	of the new product in the master catalog. If price selection query parameters are provided,
   *	the selected prices will be added to the response.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      priceCurrency?: string | string[]
      priceCountry?: string | string[]
      priceCustomerGroup?: string | string[]
      priceChannel?: string | string[]
      localeProjection?: string | string[]
      storeProjection?: string | string[]
      expand?: string | string[]
      [key: string]: QueryParam
    }
    body: ProductDraft
    headers?: {
      [key: string]: string
    }
  }): ApiRequest<Product> {
    return new ApiRequest<Product>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/products',
        pathVariables: this.args.pathArgs,
        headers: {
          'Content-Type': 'application/json',
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.executeRequest
    )
  }
}
